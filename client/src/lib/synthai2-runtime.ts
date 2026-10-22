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
