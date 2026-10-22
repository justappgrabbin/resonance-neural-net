import { describe, expect, it } from 'vitest';
import { assessAppRun, readSynthAi2Runs } from './synthai2-runtime';
import { importGithubRelease, mapReleaseAssets } from './github-release-import';

describe('existing app runner verification', () => {
  it('does not count an absent run as success', () => {
    expect(assessAppRun([]).passed).toBe(false);
  });
  it('rejects failed and timed-out runs', () => {
    expect(assessAppRun([{ code: 1 }]).passed).toBe(false);
    expect(assessAppRun([{ code: 0, timedOut: true }]).passed).toBe(false);
  });
  it('reports a successful process without claiming functional tests', () => {
    const result = assessAppRun([{ code: 0 }]);
    expect(result.passed).toBe(true);
    expect(result.reason).toContain('not a functional test');
  });
  it('reads actual runs without executing a command', async () => {
    const requests: string[] = [];
    const fakeFetch = (async (url: string) => {
      requests.push(url);
      return { ok: true, json: async () => ({ success: true, runs: [{ code: 0 }] }) };
    }) as unknown as typeof fetch;
    expect(await readSynthAi2Runs('https://example.test', 'demo-123', fakeFetch)).toHaveLength(1);
    expect(requests[0]).toContain('/api/apps/demo-123/runs');
  });
});
describe('GitHub release assets', () => {
  const release = { tag_name: 'v1', published_at: '2026-10-22T00:00:00Z', draft: false, prerelease: false, html_url: 'https://github.com/example/repo/releases/tag/v1',
    assets: [{ name: 'app.apk', browser_download_url: 'https://github.com/example/repo/releases/download/v1/app.apk', size: 100, content_type: 'application/octet-stream' }] };
  it('identifies real APK assets and keeps imported releases as drafts', () => {
    expect(mapReleaseAssets(release)[0].platform).toBe('android');
    expect(importGithubRelease(release).status).toBe('draft');
  });
});
