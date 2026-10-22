/**
 * Distribution Center: versioned product catalog and release gate.
 * Pure browser-compatible TypeScript. No claims of building, charging, or uploading.
 */
export type Pricing = { kind: 'free' } | { kind: 'one-time' | 'subscription'; amountCents: number; currency: string; interval?: 'month' | 'year'; checkoutUrl?: string };
export type Artifact = { name: string; url: string; sha256?: string; platform: 'android' | 'web' | 'desktop' | 'source' };
export type Release = { version: string; createdAt: string; status: 'draft' | 'tested' | 'published'; testEvidence?: string; artifacts: Artifact[]; notes?: string };
export type Product = { id: string; name: string; description: string; pricing: Pricing; releases: Release[] };
const KEY = 'resonance.distribution.catalog.v1';
const validUrl = (value: string) => { try { const u = new URL(value); return u.protocol === 'https:'; } catch { return false; } };
export class DistributionCenter {
  private products: Product[] = [];
  constructor() {
    try { const raw = localStorage.getItem(KEY); if (raw) { const parsed: unknown = JSON.parse(raw); if (Array.isArray(parsed)) this.products = parsed as Product[]; } } catch { /* storage may be unavailable */ }
  }
  list(): Product[] { return structuredClone(this.products); }
  private save() { try { localStorage.setItem(KEY, JSON.stringify(this.products)); } catch { /* in-memory fallback */ } }
  addProduct(input: Omit<Product, 'releases'>): Product {
    if (!input.id.trim() || !input.name.trim() || this.products.some(p => p.id === input.id)) throw new Error('Unique product ID and name required');
    if (input.pricing.kind !== 'free' && (!Number.isInteger(input.pricing.amountCents) || input.pricing.amountCents < 0)) throw new Error('Invalid price');
    const product: Product = { ...input, releases: [] }; this.products.push(product); this.save(); return structuredClone(product);
  }
  addRelease(productId: string, release: Release) {
    const product = this.products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    if (!release.version.trim() || product.releases.some(r => r.version === release.version)) throw new Error('Unique version required');
    if (release.status === 'published') throw new Error('Publish through verified release gate');
    product.releases.push({ ...release, status: 'draft' }); this.save();
  }
  markTested(productId: string, version: string, evidence: string) {
    const release = this.getRelease(productId, version);
    if (!evidence.trim()) throw new Error('Test evidence required');
    release.testEvidence = evidence.trim(); release.status = 'tested'; this.save();
  }
  publish(productId: string, version: string) {
    const release = this.getRelease(productId, version);
    if (release.status !== 'tested' || !release.testEvidence) throw new Error('Release must be tested before publishing');
    if (!release.artifacts.length || release.artifacts.some(a => !a.name.trim() || !validUrl(a.url))) throw new Error('At least one valid HTTPS artifact link required');
    release.status = 'published'; this.save();
  }
  private getRelease(productId: string, version: string): Release {
    const release = this.products.find(p => p.id === productId)?.releases.find(r => r.version === version);
    if (!release) throw new Error('Release not found');
    return release;
  }
}
