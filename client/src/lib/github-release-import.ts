import type { Artifact, Release } from './distribution-center';

/** Import only actual GitHub release assets. Never treat a source archive as an APK. */
export type GithubAsset = { name: string; browser_download_url: string; size: number; content_type: string; digest?: string };
export type GithubRelease = { tag_name: string; published_at: string | null; draft: boolean; prerelease: boolean; html_url: string; assets: GithubAsset[] };
export type GithubReleaseResult = { releases: GithubRelease[]; source: string };

export async function fetchGithubReleases(repository: string, fetcher: typeof fetch = fetch): Promise<GithubReleaseResult> {
  if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repository)) throw new Error('Expected owner/repository');
  const url = 'https://api.github.com/repos/' + repository + '/releases?per_page=30';
  const response = await fetcher(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) throw new Error('GitHub releases request failed (' + response.status + ')');
  const data: unknown = await response.json();
  if (!Array.isArray(data)) throw new Error('Invalid GitHub release response');
  return { source: url, releases: data.filter((x): x is GithubRelease => !!x && typeof x === 'object' && typeof x.tag_name === 'string' && Array.isArray(x.assets)) };
}
export function mapReleaseAssets(release: GithubRelease): Artifact[] {
  return release.assets.filter(asset => asset.size > 0 && /^https:\/\/github\.com\//.test(asset.browser_download_url)).map(asset => ({
    name: asset.name, url: asset.browser_download_url,
    platform: /\.apk$/i.test(asset.name) ? 'android' : /\.(zip|tar\.gz)$/i.test(asset.name) ? 'source' : /\.(exe|dmg|appimage)$/i.test(asset.name) ? 'desktop' : 'web',
    ...(asset.digest?.startsWith('sha256:') ? { sha256: asset.digest.slice(7) } : {})
  }));
}
export function importGithubRelease(release: GithubRelease): Release {
  return { version: release.tag_name, createdAt: release.published_at ?? new Date().toISOString(), status: 'draft',
    artifacts: mapReleaseAssets(release), notes: 'Imported from GitHub release. Verify tests before publishing in catalog.' };
}
