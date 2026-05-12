import type { Address, ConnectingPoint, Modification, NodeState, Sense, SuperBaseEntry, PersonalityProfile } from './orchestrator';

type Attitude = 'curious' | 'playful' | 'serious' | 'mystical' | 'analytical';

export default class ResonanceOrchestrator {
  private mesh = new Map<string, NodeState>();
  private superBase = new Map<string, SuperBaseEntry>();
  private personalities = new Map<string, PersonalityProfile>();
  private globalCoherence = 0.5;
  private morphState = 0.5;
  private tickCount = 0;
  private running = false;
  private timer: number | undefined;
  private loaded = new Set<string>();
  private attractors = new Map<string, number>();
  private connectionWeights = new Map<string, number>();
  private attitude: Attitude = 'curious';
  private seedGates = [10, 20, 34, 57];

  constructor(private apiBase = 'http://localhost:10000', autoStart = true) {
    this.seedMesh();
    if (autoStart) this.startAutonomousLoop();
  }

  public startAutonomousLoop(): void {
    if (this.running || typeof window === 'undefined') return;
    this.running = true;
    this.timer = window.setInterval(() => this.tick(), 250);
  }

  public stopAutonomousLoop(): void {
    if (this.timer !== undefined && typeof window !== 'undefined') clearInterval(this.timer);
    this.timer = undefined;
    this.running = false;
  }

  private seedMesh(): void {
    for (const gate of this.seedGates) {
      for (let layer = 0; layer < 13; layer++) {
        this.addNode({ mesh: 0, layer, center: 4, node: gate - 1, line: 1, color: 0, tone: 0, zodiac: 0, house: 0, dimension: Math.random(), arcDegree: this.arc() }, 0.8);
      }
    }
    this.updateGlobalCoherence();
  }

  private addNode(address: Address, coherence = 0.5): void {
    const key = this.key(address);
    if (this.loaded.has(key) || this.mesh.size >= 1000) return;
    this.mesh.set(key, {
      address,
      baseState: 'STABLE',
      tension: Math.random() * 0.3,
      modifications: this.mods(),
      senses: this.senses(),
      connectingPoints: this.points(),
      coherence,
      lastUpdated: Date.now(),
    });
    this.loaded.add(key);
  }

  public loadNodesInProximity(centerAddress: Address, radius = 2): void {
    void radius;
    for (let center = 0; center < 9; center++) {
      for (let node = 0; node < 64; node++) {
        if (this.mesh.size >= 1000) return;
        this.addNode({ ...centerAddress, center, node, line: Math.floor(Math.random() * 6) + 1, arcDegree: this.arc() }, Math.random() * 0.7 + 0.3);
      }
    }
    this.updateGlobalCoherence();
  }

  private tick(): void {
    this.tickCount++;
    for (const n of this.mesh.values()) {
      n.tension = Math.max(0, Math.min(1, n.tension + (Math.random() - 0.48) * 0.01));
      if (n.tension > 0.85 && n.baseState === 'STABLE') n.baseState = 'CHANGING';
      if (n.tension > 0.95 && n.baseState === 'CHANGING') {
        n.baseState = 'RESOLVING';
        n.address.line = (n.address.line % 6) + 1;
        n.tension = 0.3;
      }
      if (n.baseState === 'RESOLVING' && n.tension < 0.5) n.baseState = 'STABLE';
      if (this.neighborResonance(n) > 0.7) n.baseState = 'RESONANT';
      n.coherence = Math.max(0.1, Math.min(1, n.coherence + (n.baseState === 'RESONANT' ? 0.005 : -0.001)));
      n.lastUpdated = Date.now();
    }
    if (this.tickCount % 50 === 0) this.learn();
    this.updateGlobalCoherence();
  }

  private neighborResonance(node: NodeState): number {
    let total = 0;
    let count = 0;
    for (const other of this.mesh.values()) {
      if (other === node || other.address.layer !== node.address.layer) continue;
      const score = this.score(node.address, other.address);
      if (score > 1.5) {
        total += score;
        count++;
        if (count >= 24) break;
      }
    }
    return count ? total / count : 0;
  }

  private learn(): void {
    for (const [key, node] of this.mesh.entries()) {
      if (node.baseState === 'STABLE' && node.coherence > 0.6) {
        const attractor = `${node.address.mesh}_${node.address.layer}_${node.address.center}`;
        this.attractors.set(attractor, (this.attractors.get(attractor) || 0) + 1);
      }
      for (const point of node.connectingPoints) {
        if (!point.connected || node.baseState !== 'RESONANT') continue;
        const path = `${key}_${this.key(point.connected)}`;
        this.connectionWeights.set(path, (this.connectionWeights.get(path) || 1) * 1.01);
      }
    }
  }

  public async routeData(input: any, userId: string): Promise<any> {
    let profile = this.personalities.get(userId);
    if (!profile) {
      profile = await this.createPersonalityProfile(userId);
      this.personalities.set(userId, profile);
    }
    const address = this.addressFor(input);
    this.loadNodesInProximity(address, 2);
    const node = this.mesh.get(this.key(address));
    if (node) node.tension = Math.min(1, node.tension + 0.1);
    this.updateGlobalCoherence();
    return { address, response: this.response(), superBaseEntry: this.best(address), coherence: this.globalCoherence, morphState: this.morphState };
  }

  private async createPersonalityProfile(userId: string): Promise<PersonalityProfile> {
    try {
      const res = await fetch(`${this.apiBase}/consciousness/profile`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
      return { userId, birthChart: await res.json(), preferences: {}, learningHistory: [], adaptationLevel: 0.5 };
    } catch {
      return { userId, birthChart: {}, preferences: {}, learningHistory: [], adaptationLevel: 0.5 };
    }
  }

  private addressFor(input: any): Address {
    const h = this.hash(input);
    return { mesh: h % 5, layer: (h >>> 3) % 13, center: (h >>> 7) % 9, node: (h >>> 11) % 64, line: ((h >>> 17) % 6) + 1, color: (h >>> 5) % 6, tone: (h >>> 9) % 6, zodiac: (h >>> 13) % 12, house: (h >>> 19) % 12, dimension: Math.random(), arcDegree: this.arc() };
  }

  private hash(input: any): number {
    const str = JSON.stringify(input);
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  private best(address: Address): SuperBaseEntry | null {
    let match: SuperBaseEntry | null = null;
    let best = 0;
    this.superBase.forEach((entry) => {
      const s = this.score(address, entry.address);
      if (s > best) { best = s; match = entry; }
    });
    return match;
  }

  private score(a: Address, b: Address): number {
    let s = 1;
    if (a.mesh === b.mesh) s += 0.2;
    if (a.layer === b.layer) s += 0.2;
    if (a.center === b.center) s += 0.15;
    if (a.line === b.line) s += 0.15;
    s += (1 - Math.abs(a.zodiac - b.zodiac) / 6) * 0.1;
    return s;
  }

  private response(): string {
    const wit = ['The universe is listening', 'That resonates with something deep', 'I see what you did there', 'The coherence just spiked'][Math.floor(Math.random() * 4)];
    this.attitude = this.globalCoherence > 0.7 ? 'mystical' : this.globalCoherence < 0.3 ? 'analytical' : this.attitude;
    return `${wit} (Coherence: ${(this.globalCoherence * 100).toFixed(0)}%)`;
  }

  private updateGlobalCoherence(): void {
    const nodes = Array.from(this.mesh.values());
    this.globalCoherence = nodes.length ? nodes.reduce((sum, n) => sum + n.coherence, 0) / nodes.length : 0.5;
    this.morphState = this.globalCoherence;
  }

  private mods(): Modification[] {
    return ['gain', 'noise', 'bleed', 'magnitude', 'sensitivity', 'resonance'].map((type) => ({ type: type as Modification['type'], value: Math.random(), active: Math.random() > 0.5 }));
  }

  private senses(): Sense[] {
    return ['sight', 'taste', 'touch', 'smell', 'sound', 'proprioception'].map((type) => ({ type: type as Sense['type'], intensity: Math.random(), data: null }));
  }

  private points(): ConnectingPoint[] {
    return ['input', 'output', 'memory', 'lateral', 'temporal', 'field'].map((type) => ({ type: type as ConnectingPoint['type'], connected: null, strength: 0 }));
  }

  private arc(): number {
    const d = new Date();
    return (d.getMinutes() * 6 + d.getSeconds() * 0.1) % 360;
  }

  private key(a: Address): string { return `${a.mesh}_${a.layer}_${a.center}_${a.node}_${a.line}`; }

  public addToSuperBase(entry: SuperBaseEntry): void { this.superBase.set(entry.id, entry); }
  public getMeshState(address: Address): NodeState | undefined { return this.mesh.get(this.key(address)); }
  public getAllMeshNodes(): NodeState[] { return Array.from(this.mesh.values()); }
  public getLoadedNodes(): NodeState[] { return Array.from(this.mesh.values()); }
  public getGlobalCoherence(): number { return this.globalCoherence; }
  public getPersonality() { return { wit: [], attitude: this.attitude, morphState: this.morphState }; }
  public setAttitude(attitude: Attitude): void { this.attitude = attitude; }
  public getMorphState(): number { return this.morphState; }
  public getTickCount(): number { return this.tickCount; }
  public getAttractors(): Map<string, number> { return this.attractors; }
  public getConnectionWeights(): Map<string, number> { return this.connectionWeights; }
  public isAutonomous(): boolean { return this.running; }
}
