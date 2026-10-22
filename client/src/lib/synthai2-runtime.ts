/** Read-only connection to the EXISTING SynthAi2 Linux and app runner APIs.
 * Never executes shell commands or changes the target runtime.
 * Use a same-origin reverse proxy or an explicitly configured trusted URL.
 */
export type RuntimeStatus = { connected: boolean; containerEnabled: boolean; apps: unknown[]; details: string };
function endpoint(base: string, path: string): string {
  const url = new URL(path, base.endsWith('/') ? base : base + '/');
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Unsupported runtime URL');
  return url.toString();
}
async function readJson(url: string, fetcher: typeof fetch): Promise<unknown> {
  const response = await fetcher(url, { method: 'GET', credentials: 'omit', headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Runtime HTTP ' + response.status);
  return response.json();
}
export async function inspectSynthAi2(base: string, fetcher: typeof fetch = fetch): Promise<RuntimeStatus> {
  const [container, apps] = await Promise.all([
    readJson(endpoint(base, 'api/container/status'), fetcher),
    readJson(endpoint(base, 'api/apps'), fetcher)
  ]);
  const status = container as { enabled?: boolean; message?: string };
  const appList = Array.isArray(apps) ? apps : (apps as { apps?: unknown[] })?.apps;
  return { connected: true, containerEnabled: status.enabled === true,
    apps: Array.isArray(appList) ? appList : [],
    details: status.message || 'Runtime responded' };
}

export type MountedApp = { id: string; name: string; status?: string; runCommand?: string; files?: string[] };
export type AppRun = { id?: string; code: number | null; timedOut?: boolean; command?: string; at?: string; stdout?: string; stderr?: string };
export async function listSynthAi2Apps(base: string, fetcher: typeof fetch = fetch): Promise<MountedApp[]> {
  const data = await readJson(endpoint(base, 'api/apps'), fetcher) as { success?: boolean; apps?: MountedApp[] };
  if (data.success !== true || !Array.isArray(data.apps)) throw new Error('Invalid app runner response');
  return data.apps.filter(a => a && typeof a.id === 'string' && typeof a.name === 'string');
}
export async function readSynthAi2Runs(base: string, appId: string, fetcher: typeof fetch = fetch): Promise<AppRun[]> {
  if (!/^[a-zA-Z0-9._-]+$/.test(appId)) throw new Error('Invalid app ID');
  const data = await readJson(endpoint(base, 'api/apps/' + encodeURIComponent(appId) + '/runs'), fetcher) as { success?: boolean; runs?: AppRun[] };
  if (data.success !== true || !Array.isArray(data.runs)) throw new Error('Invalid run history response');
  return data.runs;
}
export function assessAppRun(runs: AppRun[]): { passed: boolean; reason: string } {
  const latest = runs[0];
  if (!latest) return { passed: false, reason: 'No recorded execution' };
  if (latest.timedOut) return { passed: false, reason: 'Last run timed out' };
  if (latest.code !== 0) return { passed: false, reason: 'Last run exited with code ' + latest.code };
  return { passed: true, reason: 'Last recorded process exited successfully (not a functional test)' };
}
