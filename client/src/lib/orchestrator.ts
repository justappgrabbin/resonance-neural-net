export interface Address {
  mesh: number
  layer: number
  center: number
  node: number
  line: number
  color: number
  tone: number
  zodiac: number
  house: number
  dimension: number
  arcDegree: number
}

export interface NodeState {
  address: Address
  baseState: 'STABLE' | 'CHANGING' | 'RESOLVING' | 'RESONANT' | 'DORMANT'
  tension: number
  modifications: Array<{ type: string; value: number; active: boolean }>
  senses: Array<{ type: string; intensity: number; data: unknown }>
  connectingPoints: Array<{ type: string; connected: Address | null; strength: number }>
  coherence: number
  lastUpdated: number
}

export interface SuperBaseEntry {
  id: string
  address: Address
  content: unknown
  metadata: Record<string, unknown> & { timestamp: number; resonanceScore?: number }
}

export interface PersonalityProfile {
  userId: string
  birthChart: unknown
  preferences: Record<string, unknown>
  learningHistory: unknown[]
  adaptationLevel: number
}

export type RegenerationMode = 'exact' | 'cleaned' | 'improved'

export interface RouteResult {
  address: Address
  response: string
  superBaseEntry: SuperBaseEntry | null
  coherence: number
  morphState: number
  matches: SuperBaseEntry[]
}

export class ResonanceOrchestrator {
  private mesh = new Map<string, NodeState>()
  private superBase = new Map<string, SuperBaseEntry>()
  private personalities = new Map<string, PersonalityProfile>()
  private loadedNodeKeys = new Set<string>()
  private tickInterval: ReturnType<typeof setInterval> | null = null
  private running = false
  private tickCount = 0
  private globalCoherence = 0.5
  private seedGates = [10, 20, 34, 57]
  private personality = {
    wit: ['Autonomy online', 'The mesh is breathing', 'Pattern accepted', 'Browser spared'],
    attitude: 'curious' as 'curious' | 'playful' | 'serious' | 'mystical' | 'analytical',
    morphState: 0,
  }

  constructor(private apiBase = 'https://synthia-server.onrender.com', autoStart = true) {
    this.initializeMeshLazy()
    if (autoStart) this.startAutonomousLoop()
  }

  public startAutonomousLoop(): void {
    if (this.running) return
    this.running = true
    this.tickInterval = setInterval(() => this.tick(), 250)
  }

  public stopAutonomousLoop(): void {
    if (this.tickInterval) clearInterval(this.tickInterval)
    this.tickInterval = null
    this.running = false
  }

  private initializeMeshLazy(): void {
    for (const gate of this.seedGates) {
      for (let layer = 0; layer < 13; layer++) {
        const address: Address = {
          mesh: 0,
          layer,
          center: 4,
          node: gate - 1,
          line: 1,
          color: 0,
          tone: 0,
          zodiac: 0,
          house: 0,
          dimension: Math.random(),
          arcDegree: this.calculateArcDegree(),
        }
        this.addNode(address, 0.8)
      }
    }
    this.updateGlobalCoherence()
  }

  private tick(): void {
    this.tickCount++
    for (const node of this.mesh.values()) {
      node.tension = clamp(node.tension + (Math.random() - 0.48) * 0.018)
      node.coherence = clamp(node.coherence + (Math.random() - 0.5) * 0.012, 0.1, 1)
      node.baseState = node.tension > 0.88 ? 'CHANGING' : node.coherence > 0.76 ? 'RESONANT' : node.tension < 0.18 ? 'DORMANT' : 'STABLE'
      node.address.arcDegree = this.calculateArcDegree()
      node.lastUpdated = Date.now()
    }

    if (this.tickCount % 24 === 0 && this.mesh.size < 1000) {
      const focus = this.getLoadedNodes()[this.tickCount % Math.max(1, this.mesh.size)]?.address
      if (focus) this.loadNodesInProximity(focus, 1)
    }

    this.updateGlobalCoherence()
  }

  public loadNodesInProximity(center: Address, radius = 2): void {
    const boundedRadius = Math.max(0, Math.min(6, radius))
    for (let c = 0; c < 9 && this.mesh.size < 1000; c++) {
      for (let offset = -boundedRadius; offset <= boundedRadius && this.mesh.size < 1000; offset++) {
        const address: Address = {
          ...center,
          center: c,
          node: (center.node + offset + 64) % 64,
          line: ((center.line + offset + 5) % 6) + 1,
        }
        this.addNode(address, 0.45 + Math.random() * 0.35)
      }
    }
    this.updateGlobalCoherence()
  }

  public async routeData(input: unknown, userId: string): Promise<RouteResult> {
    this.startAutonomousLoop()
    const profile = this.getOrCreateProfile(userId)
    const address = this.calculateResonanceAddress(input, profile)
    this.loadNodesInProximity(address, 2)
    const matches = this.retrieveMultipleFromSuperBase(address, input, 5)
    this.activateAddress(address)
    const superBaseEntry = matches[0] ?? null
    return {
      address,
      response: this.generateResponse(superBaseEntry),
      superBaseEntry,
      coherence: this.globalCoherence,
      morphState: this.personality.morphState,
      matches,
    }
  }

  public addToSuperBase(entry: SuperBaseEntry): void {
    this.superBase.set(entry.id, entry)
  }

  public storeArtifactUnderstanding(artifact: { id: string; understanding?: unknown; originalName?: string; language?: string }): SuperBaseEntry | null {
    if (!artifact.understanding) return null
    const address = this.calculateResonanceAddress(artifact, this.defaultProfile('system'))
    const entry: SuperBaseEntry = {
      id: `artifact_${artifact.id}`,
      address,
      content: artifact.understanding,
      metadata: {
        gate: address.node + 1,
        line: address.line,
        codon: `${address.node + 1}.${address.line}.${address.color}.${address.tone}`,
        timestamp: Date.now(),
        sourceArtifact: artifact.id,
        artifactName: artifact.originalName,
        language: artifact.language,
        contentType: 'understanding',
      },
    }
    this.addToSuperBase(entry)
    this.loadNodesInProximity(address, 2)
    return entry
  }

  public storeCodeChunks(artifactId: string, chunks: string[], language = 'typescript'): SuperBaseEntry[] {
    return chunks.map((chunk, index) => {
      const address = this.calculateResonanceAddress({ artifactId, chunk, index }, this.defaultProfile('system'))
      const entry: SuperBaseEntry = {
        id: `chunk_${artifactId}_${index}`,
        address,
        content: { artifactId, chunkIndex: index, content: chunk, language },
        metadata: { timestamp: Date.now(), sourceArtifact: artifactId, contentType: 'source_chunk' },
      }
      this.addToSuperBase(entry)
      return entry
    })
  }

  public async regenerateFromMemory(query: string, mode: RegenerationMode = 'improved') {
    const result = await this.routeData({ query, mode, task: 'regenerate_code' }, 'system')
    return {
      code: `// Resonance generated module\n// Query: ${query}\n// Mode: ${mode}\n\nexport const resonanceResult = ${JSON.stringify({ query, mode }, null, 2)};\n`,
      architecture: 'Autonomous Lazy Resonance Memory Architecture',
      confidence: Math.min(95, 60 + result.matches.length * 5),
      improvements: result.matches.length ? ['Used resonant memory matches'] : ['Add artifacts to memory for stronger regeneration'],
      sourceNodes: result.matches.map((m) => m.id),
    }
  }

  public getLoadedNodes(): NodeState[] { return Array.from(this.mesh.values()) }
  public getAllMeshNodes(): NodeState[] { return this.getLoadedNodes() }
  public getMeshState(address: Address): NodeState | undefined { return this.mesh.get(this.addressToKey(address)) }
  public getGlobalCoherence(): number { return this.globalCoherence }
  public getPersonality() { return this.personality }
  public setAttitude(attitude: 'curious' | 'playful' | 'serious' | 'mystical' | 'analytical'): void { this.personality.attitude = attitude }
  public getMorphState(): number { return this.personality.morphState }
  public getTickCount(): number { return this.tickCount }
  public isAutonomous(): boolean { return this.running }
  public getSuperBaseEntries(): SuperBaseEntry[] { return Array.from(this.superBase.values()) }
  public getSuperBaseSize(): number { return this.superBase.size }

  private addNode(address: Address, coherence: number): void {
    const key = this.addressToKey(address)
    if (this.loadedNodeKeys.has(key)) return
    this.mesh.set(key, {
      address,
      baseState: 'STABLE',
      tension: Math.random() * 0.3,
      coherence,
      modifications: ['gain', 'noise', 'bleed', 'magnitude', 'sensitivity', 'resonance'].map((type) => ({ type, value: Math.random(), active: Math.random() > 0.5 })),
      senses: ['sight', 'taste', 'touch', 'smell', 'sound', 'proprioception'].map((type) => ({ type, intensity: Math.random(), data: null })),
      connectingPoints: ['input', 'output', 'memory', 'lateral', 'temporal', 'field'].map((type) => ({ type, connected: null, strength: 0 })),
      lastUpdated: Date.now(),
    })
    this.loadedNodeKeys.add(key)
  }

  private activateAddress(address: Address): void {
    this.addNode(address, 0.65)
    const node = this.mesh.get(this.addressToKey(address))
    if (!node) return
    node.baseState = 'RESONANT'
    node.tension = clamp(node.tension + 0.12)
    node.coherence = clamp(node.coherence + 0.08)
    this.updateGlobalCoherence()
  }

  private retrieveMultipleFromSuperBase(address: Address, input: unknown, limit: number): SuperBaseEntry[] {
    const queryText = JSON.stringify(input).toLowerCase()
    return Array.from(this.superBase.values())
      .map((entry) => ({ entry, score: this.calculateResonanceScore(address, entry.address) + this.semanticScore(queryText, entry) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ entry, score }) => ({ ...entry, metadata: { ...entry.metadata, resonanceScore: score } }))
  }

  private semanticScore(queryText: string, entry: SuperBaseEntry): number {
    const content = JSON.stringify(entry.content).toLowerCase()
    const words = queryText.match(/\w+/g) ?? []
    return words.length ? words.filter((word) => content.includes(word)).length / words.length : 0
  }

  private calculateResonanceScore(a: Address, b: Address): number {
    let score = 1
    if (a.mesh === b.mesh) score += 0.2
    if (a.layer === b.layer) score += 0.2
    if (a.center === b.center) score += 0.15
    if (a.line === b.line) score += 0.15
    return score
  }

  private calculateResonanceAddress(input: unknown, profile: PersonalityProfile): Address {
    const hash = this.hashInput({ input, userId: profile.userId })
    return {
      mesh: hash % 5,
      layer: Math.floor(hash / 5) % 13,
      center: Math.floor(hash / 65) % 9,
      node: Math.floor(hash / 585) % 64,
      line: (Math.floor(hash / 37440) % 6) + 1,
      color: Math.floor(hash / 224640) % 6,
      tone: Math.floor(hash / 1347840) % 6,
      zodiac: Math.floor(hash / 8087040) % 12,
      house: Math.floor(hash / 97044480) % 12,
      dimension: (hash % 1000) / 1000,
      arcDegree: this.calculateArcDegree(),
    }
  }

  private hashInput(input: unknown): number {
    const str = JSON.stringify(input)
    let hash = 0
    for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
    return Math.abs(hash)
  }

  private calculateArcDegree(): number {
    const now = new Date()
    return ((now.getMinutes() * 6) + now.getSeconds() * 0.1) % 360
  }

  private updateGlobalCoherence(): void {
    const nodes = this.getLoadedNodes()
    this.globalCoherence = nodes.length ? nodes.reduce((sum, node) => sum + node.coherence, 0) / nodes.length : 0.5
    this.personality.morphState = this.globalCoherence
    this.personality.attitude = this.globalCoherence > 0.7 ? 'mystical' : this.globalCoherence < 0.35 ? 'analytical' : 'curious'
  }

  private getOrCreateProfile(userId: string): PersonalityProfile {
    const existing = this.personalities.get(userId)
    if (existing) return existing
    const profile = this.defaultProfile(userId)
    this.personalities.set(userId, profile)
    return profile
  }

  private defaultProfile(userId = 'system'): PersonalityProfile {
    return { userId, birthChart: {}, preferences: {}, learningHistory: [], adaptationLevel: 0.5 }
  }

  private generateResponse(entry: SuperBaseEntry | null): string {
    const wit = this.personality.wit[Math.floor(Math.random() * this.personality.wit.length)]
    return `${entry ? 'Memory found' : 'No direct memory match yet'}. ${wit}. Coherence: ${(this.globalCoherence * 100).toFixed(0)}%.`
  }

  private addressToKey(address: Address): string {
    return `${address.mesh}_${address.layer}_${address.center}_${address.node}_${address.line}`
  }
}

let orchestratorInstance: ResonanceOrchestrator | null = null

export function getResonanceOrchestrator(): ResonanceOrchestrator {
  if (!orchestratorInstance) orchestratorInstance = new ResonanceOrchestrator(undefined, true)
  orchestratorInstance.startAutonomousLoop()
  return orchestratorInstance
}

export function resetResonanceOrchestrator(): void {
  orchestratorInstance?.stopAutonomousLoop()
  orchestratorInstance = null
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value))
}

export default ResonanceOrchestrator
