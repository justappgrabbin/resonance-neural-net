/**
 * SELF-ASSEMBLING RESONANCE ORCHESTRATOR v8.0 — AUTONOMOUS EDITION
 *
 * Canonical frontend orchestrator.
 * Autonomy is ON by default and the Synthia server is the default API base.
 */

export const CANON = {
  MESH_COUNT: 5,
  LAYER_COUNT: 13,
  CENTER_COUNT: 9,
  NODE_COUNT: 64,
  LINE_COUNT: 6,
  COLOR_COUNT: 6,
  TONE_COUNT: 6,
  ZODIAC_COUNT: 12,
  HOUSE_COUNT: 12,
  TICKS_PER_MINUTE: 72,
  ARCSEC_PER_HEX: 20250,
  NODES_PER_PLANET: 69120,
  SEED_GATES: [10, 20, 34, 57] as const,
  BASE_STATES: ['STABLE', 'CHANGING', 'RESOLVING', 'RESONANT', 'DORMANT'] as const,
  MOD_TYPES: ['gain', 'noise', 'bleed', 'magnitude', 'sensitivity', 'resonance'] as const,
  SENSE_TYPES: ['sight', 'taste', 'touch', 'smell', 'sound', 'proprioception'] as const,
  POINT_TYPES: ['input', 'output', 'memory', 'lateral', 'temporal', 'field'] as const,
  ATTITUDES: ['curious', 'playful', 'serious', 'mystical', 'analytical'] as const,
} as const

export type MeshIndex = 0 | 1 | 2 | 3 | 4
export type LayerIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
export type CenterIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type NodeIndex = number
export type LineIndex = 1 | 2 | 3 | 4 | 5 | 6
export type ColorIndex = 0 | 1 | 2 | 3 | 4 | 5
export type ToneIndex = 0 | 1 | 2 | 3 | 4 | 5
export type ZodiacIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type HouseIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type BaseState = (typeof CANON.BASE_STATES)[number]
export type ModType = (typeof CANON.MOD_TYPES)[number]
export type SenseType = (typeof CANON.SENSE_TYPES)[number]
export type PointType = (typeof CANON.POINT_TYPES)[number]
export type Attitude = (typeof CANON.ATTITUDES)[number]
export type RegenerationMode = 'exact' | 'cleaned' | 'improved'

export interface ResonanceConfig {
  baseTickIntervalMs: number
  adaptiveTickRate: boolean
  minTickIntervalMs: number
  maxTickIntervalMs: number
  maxLoadedNodes: number
  proximityRadius: number
  maxNeighborScan: number
  tensionAccumulationRate: number
  tensionDecayRate: number
  coherenceDecayRate: number
  coherenceBoostResonant: number
  senseDecayRate: number
  connectionDecayRate: number
  noiseIntervalTicks: number
  learningIntervalTicks: number
  stableToChangingThreshold: number
  changingToResolvingThreshold: number
  resolvingToStableThreshold: number
  neighborResonanceThreshold: number
  changingMutationRate: number
  resonantSenseBoost: number
  dormantWakeRate: number
  witPool: string[]
  defaultAttitude: Attitude
  attitudeMorphThresholds: { mystical: number; analytical: number }
  apiBase: string
  autoStart: boolean
  mcpEndpoint: string
  mcpEnabled: boolean
  maxDocumentSize: number
  embeddingDimension: number
  chunkSize: number
  chunkOverlap: number
  codeGenEnabled: boolean
  codeGenModel: string
  codeGenMaxTokens: number
  autoDiscoveryInterval: number
  autoWireEnabled: boolean
}

export const DEFAULT_CONFIG: ResonanceConfig = {
  baseTickIntervalMs: 250,
  adaptiveTickRate: true,
  minTickIntervalMs: 100,
  maxTickIntervalMs: 1000,
  maxLoadedNodes: 1000,
  proximityRadius: 2,
  maxNeighborScan: 24,
  tensionAccumulationRate: 0.01,
  tensionDecayRate: 0.001,
  coherenceDecayRate: 0.001,
  coherenceBoostResonant: 0.05,
  senseDecayRate: 0.002,
  connectionDecayRate: 0.001,
  noiseIntervalTicks: 100,
  learningIntervalTicks: 50,
  stableToChangingThreshold: 0.85,
  changingToResolvingThreshold: 0.95,
  resolvingToStableThreshold: 0.5,
  neighborResonanceThreshold: 1.5,
  changingMutationRate: 0.1,
  resonantSenseBoost: 0.02,
  dormantWakeRate: 0.001,
  witPool: [
    'Oh, you stink like a fish 🐟',
    'Interesting choice, very... you',
    'The universe is listening',
    'That resonates with something deep',
    'I see what you did there',
    'The coherence just spiked',
    'Patterns are emerging from the noise',
    'The mesh is whispering your name',
    'A node just woke up for you',
    'Reality bends at the edges',
    'Your signal cuts through the noise',
    'The field aligns with your intent',
  ],
  defaultAttitude: 'curious',
  attitudeMorphThresholds: { mystical: 0.7, analytical: 0.3 },
  apiBase: 'https://synthia-server.onrender.com',
  autoStart: true,
  mcpEndpoint: 'https://synthia-server.onrender.com/mcp',
  mcpEnabled: false,
  maxDocumentSize: 10 * 1024 * 1024,
  embeddingDimension: 384,
  chunkSize: 512,
  chunkOverlap: 50,
  codeGenEnabled: true,
  codeGenModel: 'default',
  codeGenMaxTokens: 4096,
  autoDiscoveryInterval: 500,
  autoWireEnabled: true,
}

export interface Address {
  mesh: MeshIndex
  layer: LayerIndex
  center: CenterIndex
  node: NodeIndex
  line: LineIndex
  color: ColorIndex
  tone: ToneIndex
  zodiac: ZodiacIndex
  house: HouseIndex
  dimension: number
  arcDegree: number
}

export interface Modification {
  type: ModType
  value: number
  active: boolean
  origin: 'seed' | 'morph' | 'external' | 'resonance'
  createdAt: number
}

export interface Sense {
  type: SenseType
  intensity: number
  data: unknown
  lastStimulus: number
}

export interface ConnectingPoint {
  type: PointType
  connected: Address | null
  strength: number
  bandwidth: number
  latency: number
}

export interface NodeState {
  address: Address
  baseState: BaseState
  tension: number
  modifications: Modification[]
  senses: Sense[]
  connectingPoints: ConnectingPoint[]
  coherence: number
  lastUpdated: number
  birthTick: number
  activationCount: number
}

export interface SuperBaseEntry {
  id: string
  address: Address
  content: unknown
  metadata: Record<string, unknown> & {
    gate?: number
    line?: number
    codon?: string
    timestamp: number
    resonanceScore?: number
    source?: string
    confidence?: number
  }
}

export interface PersonalityProfile {
  userId: string
  birthChart: Record<string, unknown>
  preferences: Record<string, unknown>
  learningHistory: Array<{ timestamp: number; input: unknown; address: Address; coherence: number }>
  adaptationLevel: number
  lastInteraction: number
  interactionCount: number
}

export interface DocumentChunk {
  id: string
  sourceId: string
  content: string
  embedding: number[]
  address: Address
  metadata: { startChar: number; endChar: number; lineNumber: number; fileType: string; confidence: number }
}

export interface IngestedDocument {
  id: string
  filename: string
  contentType: string
  size: number
  chunks: DocumentChunk[]
  ingestedAt: number
  meshNodes: string[]
}

export interface RAGQuery {
  query: string
  topK: number
  meshFilter?: Address
  minConfidence?: number
}

export interface RAGResult {
  chunks: DocumentChunk[]
  combinedContext: string
  meshResonance: number
}

export interface MCPTool {
  name: string
  description: string
  parameters: Record<string, unknown>
  endpoint: string
  enabled: boolean
  lastUsed: number
  successRate: number
}

export interface MCPRequest { tool: string; params: Record<string, unknown>; correlationId: string }
export interface MCPResponse { correlationId: string; result: unknown; error?: string; latency: number }

export interface CodeArtifact {
  id: string
  filename: string
  language: string
  content: string
  generatedFrom: string
  meshAddress: Address
  dependencies: string[]
  tested: boolean
  testResults?: string
}

export interface CodeRequest { intent: string; context: string; language: string; constraints?: string[] }

export interface DiscoveredComponent {
  id: string
  name: string
  type: 'server' | 'client' | 'database' | 'api' | 'tool' | 'unknown'
  endpoint: string
  status: 'online' | 'offline' | 'degraded'
  capabilities: string[]
  lastSeen: number
  meshAddress: Address
}

export interface AssemblyPlan {
  components: DiscoveredComponent[]
  connections: Array<{ from: string; to: string; type: PointType; strength: number }>
  gaps: string[]
  confidence: number
}

export interface RoutingTrace {
  tickCount: number
  hashPath: string
  resonanceScore: number
  personalizationDepth: number
  meshNodesTouched: number
  superBaseMatches: number
  elapsedMs: number
  ragQuery?: RAGQuery
  ragChunksRetrieved?: number
  mcpToolsUsed?: string[]
  mcpLatency?: number
  codeGenerated?: boolean
  codeArtifactId?: string
}

export interface RoutingResult {
  address: Address
  response: string
  superBaseEntry: SuperBaseEntry | null
  coherence: number
  morphState: number
  personality: { attitude: Attitude; wit: string }
  trace: RoutingTrace
  matches: SuperBaseEntry[]
  ragResult?: RAGResult
  codeArtifact?: CodeArtifact
  assemblyPlan?: AssemblyPlan
}

export type RouteResult = RoutingResult

export interface SystemMetrics {
  tickCount: number
  isRunning: boolean
  currentTickInterval: number
  globalCoherence: number
  loadedNodeCount: number
  totalNodeCapacity: number
  activeConnections: number
  attractorCount: number
  personalityCount: number
  superBaseSize: number
  averageNodeAge: number
  loadFactor: number
  documentsIngested: number
  totalChunks: number
  toolsAvailable: number
  toolsOnline: number
  artifactsGenerated: number
  componentsDiscovered: number
  assemblyHealth: number
}

export function hashInput(input: unknown): number {
  const str = JSON.stringify(input)
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
  }
  return Math.abs(hash >>> 0)
}

export function calculateArcDegree(): number {
  const now = new Date()
  return ((now.getMinutes() * 6) + now.getSeconds() * 0.1) % 360
}

export function calculateResonanceScore(addr1: Address, addr2: Address): number {
  let score = 1.0
  if (addr1.mesh === addr2.mesh) score += 0.2
  if (addr1.layer === addr2.layer) score += 0.2
  if (addr1.center === addr2.center) score += 0.15
  if (addr1.line === addr2.line) score += 0.15
  if (addr1.node === addr2.node) score += 0.1
  if (addr1.color === addr2.color) score += 0.08
  if (addr1.tone === addr2.tone) score += 0.08
  const zodiacDiff = Math.abs(addr1.zodiac - addr2.zodiac)
  score += (1 - Math.min(zodiacDiff, CANON.ZODIAC_COUNT - zodiacDiff) / 6) * 0.1
  const houseDiff = Math.abs(addr1.house - addr2.house)
  score += (1 - Math.min(houseDiff, CANON.HOUSE_COUNT - houseDiff) / 6) * 0.05
  return score
}

export function addressToKey(address: Address): string {
  return `${address.mesh}_${address.layer}_${address.center}_${address.node}_${address.line}`
}

export function clamp01(value: number): number { return Math.max(0, Math.min(1, value)) }

export function random01(seed?: number): number {
  if (seed !== undefined) {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }
  return Math.random()
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let magA = 0
  let magB = 0
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }
  return dot / ((Math.sqrt(magA) * Math.sqrt(magB)) || 1)
}

export function createAddress(partial: Partial<Address> = {}): Address {
  return {
    mesh: (partial.mesh ?? 0) as MeshIndex,
    layer: (partial.layer ?? 0) as LayerIndex,
    center: (partial.center ?? 4) as CenterIndex,
    node: partial.node ?? 0,
    line: (partial.line ?? 1) as LineIndex,
    color: (partial.color ?? 0) as ColorIndex,
    tone: (partial.tone ?? 0) as ToneIndex,
    zodiac: (partial.zodiac ?? 0) as ZodiacIndex,
    house: (partial.house ?? 0) as HouseIndex,
    dimension: partial.dimension ?? random01(),
    arcDegree: partial.arcDegree ?? calculateArcDegree(),
  }
}

export function createModification(type: ModType, seed?: number): Modification {
  return { type, value: random01(seed), active: random01(seed ? seed + 1 : undefined) > 0.5, origin: 'seed', createdAt: Date.now() }
}

export function createSense(type: SenseType, seed?: number): Sense {
  return { type, intensity: random01(seed), data: null, lastStimulus: 0 }
}

export function createConnectingPoint(type: PointType): ConnectingPoint {
  return { type, connected: null, strength: 0, bandwidth: random01(), latency: Math.floor(random01() * 50) }
}

export function createNodeState(partial: Partial<NodeState> = {}): NodeState {
  const address = partial.address ?? createAddress()
  const seed = hashInput(address)
  return {
    address,
    baseState: partial.baseState ?? 'STABLE',
    tension: partial.tension ?? random01(seed) * 0.3,
    modifications: partial.modifications ?? CANON.MOD_TYPES.map((t, i) => createModification(t, seed + i)),
    senses: partial.senses ?? CANON.SENSE_TYPES.map((t, i) => createSense(t, seed + i + 10)),
    connectingPoints: partial.connectingPoints ?? CANON.POINT_TYPES.map((t) => createConnectingPoint(t)),
    coherence: partial.coherence ?? (random01(seed + 20) * 0.7 + 0.3),
    lastUpdated: Date.now(),
    birthTick: partial.birthTick ?? 0,
    activationCount: partial.activationCount ?? 0,
  }
}

function nowMs(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now()
}

async function headWithTimeout(url: string, timeoutMs = 3000): Promise<Response> {
  const controller = new AbortController()
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { method: 'HEAD', signal: controller.signal })
  } finally {
    globalThis.clearTimeout(timeout)
  }
}

export class ResonanceOrchestrator {
  private mesh = new Map<string, NodeState>()
  private superBase = new Map<string, SuperBaseEntry>()
  private personalities = new Map<string, PersonalityProfile>()
  private connectionWeights = new Map<string, number>()
  private pathUsageHistory = new Map<string, number>()
  private attractors = new Map<string, number>()
  private loadedNodeKeys = new Set<string>()
  private seedGates: readonly number[] = CANON.SEED_GATES
  private globalCoherence = 0.5
  private currentTime = Date.now()
  private tickCount = 0
  private isRunning = false
  private tickInterval: ReturnType<typeof setTimeout> | undefined
  private currentTickIntervalMs: number
  private personality: { witPool: string[]; currentWitIndex: number; attitude: Attitude; morphState: number }
  private config: ResonanceConfig
  private documents = new Map<string, IngestedDocument>()
  private chunks = new Map<string, DocumentChunk>()
  private mcpTools = new Map<string, MCPTool>()
  private codeArtifacts = new Map<string, CodeArtifact>()
  private discoveredComponents = new Map<string, DiscoveredComponent>()
  private assemblyPlan: AssemblyPlan | null = null
  private onTickCallbacks: Array<(metrics: SystemMetrics) => void> = []
  private onStateChangeCallbacks: Array<(node: NodeState, oldState: BaseState) => void> = []
  private onRouteCallbacks: Array<(result: RoutingResult) => void> = []
  private onIngestCallbacks: Array<(doc: IngestedDocument) => void> = []
  private onCodeGenCallbacks: Array<(artifact: CodeArtifact) => void> = []
  private onDiscoveryCallbacks: Array<(comp: DiscoveredComponent) => void> = []

  constructor(configOrApiBase: Partial<ResonanceConfig> | string = {}, autoStart?: boolean) {
    const compatConfig = typeof configOrApiBase === 'string'
      ? { apiBase: configOrApiBase, autoStart: autoStart ?? true }
      : configOrApiBase

    this.config = { ...DEFAULT_CONFIG, ...compatConfig, autoStart: compatConfig.autoStart ?? true }
    this.currentTickIntervalMs = this.config.baseTickIntervalMs
    this.personality = {
      witPool: [...this.config.witPool],
      currentWitIndex: Math.floor(random01() * this.config.witPool.length),
      attitude: this.config.defaultAttitude,
      morphState: 0,
    }

    this.initializeMeshLazy()
    if (this.config.autoStart) this.startAutonomousLoop()
  }

  public startAutonomousLoop(): void {
    if (this.isRunning) return
    this.isRunning = true

    const tick = () => {
      if (!this.isRunning) return
      const startTime = nowMs()
      this.tick()
      const elapsed = nowMs() - startTime

      if (this.config.adaptiveTickRate) {
        const loadFactor = elapsed / this.currentTickIntervalMs
        if (loadFactor > 0.8 && this.currentTickIntervalMs < this.config.maxTickIntervalMs) {
          this.currentTickIntervalMs = Math.min(this.config.maxTickIntervalMs, this.currentTickIntervalMs * 1.1)
        } else if (loadFactor < 0.2 && this.currentTickIntervalMs > this.config.minTickIntervalMs) {
          this.currentTickIntervalMs = Math.max(this.config.minTickIntervalMs, this.currentTickIntervalMs * 0.95)
        }
      }

      this.tickInterval = globalThis.setTimeout(tick, this.currentTickIntervalMs)
    }

    this.tickInterval = globalThis.setTimeout(tick, this.currentTickIntervalMs)
  }

  public stopAutonomousLoop(): void {
    if (this.tickInterval !== undefined) globalThis.clearTimeout(this.tickInterval)
    this.tickInterval = undefined
    this.isRunning = false
  }

  public async ingestDocument(filename: string, content: string, contentType = 'text/plain'): Promise<IngestedDocument> {
    if (content.length > this.config.maxDocumentSize) throw new Error(`Document exceeds max size: ${this.config.maxDocumentSize}`)
    const docId = `doc_${hashInput(filename + Date.now())}`
    const chunks = this.chunkDocument(docId, content, contentType)
    const meshNodes: string[] = []

    for (const chunk of chunks) {
      chunk.embedding = this.generateEmbedding(chunk.content)
      const address = this.calculateResonanceAddress(chunk.content, this.defaultProfile('system'))
      chunk.address = address
      this.loadNodesInProximity(address, 1)
      const key = addressToKey(address)
      meshNodes.push(key)
      this.chunks.set(chunk.id, chunk)
      this.addToSuperBase({ id: chunk.id, address, content: chunk.content, metadata: { timestamp: Date.now(), source: filename, confidence: 0.9 } })
    }

    const doc: IngestedDocument = { id: docId, filename, contentType, size: content.length, chunks, ingestedAt: Date.now(), meshNodes }
    this.documents.set(docId, doc)
    this.onIngestCallbacks.forEach((cb) => cb(doc))
    return doc
  }

  public async queryRAG(query: RAGQuery): Promise<RAGResult> {
    const queryEmbedding = this.generateEmbedding(query.query)
    const scored = Array.from(this.chunks.values())
      .map((chunk) => ({ chunk, score: cosineSimilarity(queryEmbedding, chunk.embedding) }))
      .filter((s) => s.score > (query.minConfidence ?? 0.6))
      .sort((a, b) => b.score - a.score)
      .slice(0, query.topK)

    const chunks = scored.map((s) => s.chunk)
    const combinedContext = chunks.map((c) => c.content).join('\n\n---\n\n')
    const meshResonance = query.meshFilter
      ? scored.reduce((sum, s) => sum + calculateResonanceScore(query.meshFilter!, s.chunk.address), 0) / (scored.length || 1)
      : 0

    return { chunks, combinedContext, meshResonance }
  }

  public registerMCPTool(tool: MCPTool): void { this.mcpTools.set(tool.name, tool) }

  public async callMCPTool(request: MCPRequest): Promise<MCPResponse> {
    const tool = this.mcpTools.get(request.tool)
    if (!tool) return { correlationId: request.correlationId, result: null, error: `Tool ${request.tool} not found`, latency: 0 }

    const start = nowMs()
    try {
      const response = await fetch(`${this.config.mcpEndpoint}/${request.tool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.params),
      })
      const result = await response.json()
      const latency = nowMs() - start
      tool.lastUsed = Date.now()
      tool.successRate = tool.successRate * 0.9 + 0.1
      return { correlationId: request.correlationId, result, latency }
    } catch (error) {
      const latency = nowMs() - start
      tool.successRate = tool.successRate * 0.9
      return { correlationId: request.correlationId, result: null, error: String(error), latency }
    }
  }

  public async generateCode(request: CodeRequest): Promise<CodeArtifact> {
    const ragResult = await this.queryRAG({ query: request.intent, topK: 5, minConfidence: 0.7 })
    const artifactId = `code_${hashInput(request.intent + Date.now())}`
    const content = this.composeCode(request, ragResult.combinedContext)
    const artifact: CodeArtifact = {
      id: artifactId,
      filename: `generated_${artifactId}.${request.language}`,
      language: request.language,
      content,
      generatedFrom: request.intent,
      meshAddress: createAddress(),
      dependencies: this.extractDependencies(content),
      tested: false,
    }
    this.codeArtifacts.set(artifactId, artifact)
    this.onCodeGenCallbacks.forEach((cb) => cb(artifact))
    return artifact
  }

  public async discoverComponents(): Promise<DiscoveredComponent[]> {
    const discovered: DiscoveredComponent[] = []
    const endpoints = [
      { url: this.config.apiBase, name: 'synthia-server', type: 'api' as const },
      { url: this.config.mcpEndpoint, name: 'mcp-server', type: 'tool' as const },
    ]

    for (const ep of endpoints) {
      try {
        const response = await headWithTimeout(ep.url, 3000)
        const comp: DiscoveredComponent = {
          id: `comp_${hashInput(ep.url)}`,
          name: ep.name,
          type: ep.type,
          endpoint: ep.url,
          status: response.ok ? 'online' : 'degraded',
          capabilities: [],
          lastSeen: Date.now(),
          meshAddress: createAddress(),
        }
        this.discoveredComponents.set(comp.id, comp)
        discovered.push(comp)
        this.onDiscoveryCallbacks.forEach((cb) => cb(comp))
      } catch {
        const comp: DiscoveredComponent = {
          id: `comp_${hashInput(ep.url)}`,
          name: ep.name,
          type: ep.type,
          endpoint: ep.url,
          status: 'offline',
          capabilities: [],
          lastSeen: Date.now(),
          meshAddress: createAddress(),
        }
        this.discoveredComponents.set(comp.id, comp)
      }
    }

    return discovered
  }

  public async buildAssemblyPlan(): Promise<AssemblyPlan> {
    const components = Array.from(this.discoveredComponents.values())
    const connections: AssemblyPlan['connections'] = []
    for (let i = 0; i < components.length; i++) {
      for (let j = i + 1; j < components.length; j++) {
        const a = components[i]
        const b = components[j]
        connections.push({ from: a.id, to: b.id, type: 'lateral', strength: a.type === b.type ? 0.3 : 0.8 })
      }
    }
    const gaps: string[] = []
    if (!components.some((c) => c.type === 'api')) gaps.push('api-gateway')
    if (!components.some((c) => c.type === 'database')) gaps.push('persistence-layer')
    const plan: AssemblyPlan = { components, connections, gaps, confidence: components.length > 0 ? 0.7 : 0.1 }
    this.assemblyPlan = plan
    return plan
  }

  public async routeData(input: unknown, userId: string): Promise<RoutingResult> {
    this.startAutonomousLoop()
    const startTime = nowMs()
    const profile = this.getOrCreateProfile(userId)
    profile.lastInteraction = Date.now()
    profile.interactionCount++

    const address = this.calculateResonanceAddress(input, profile)
    this.loadNodesInProximity(address, this.config.proximityRadius)

    let ragResult: RAGResult | undefined
    if (this.documents.size > 0 && typeof input === 'string' && input.length > 10) {
      ragResult = await this.queryRAG({ query: input, topK: 3, minConfidence: 0.6 })
    }

    const matches = this.retrieveMultipleFromSuperBase(address, input, 5)
    const superBaseEntry = matches[0] ?? null

    let mcpToolsUsed: string[] | undefined
    let mcpLatency: number | undefined
    if (this.config.mcpEnabled && typeof input === 'string') {
      for (const [name, tool] of this.mcpTools) {
        if (input.toLowerCase().includes(name.toLowerCase()) && tool.enabled) {
          const mcpRes = await this.callMCPTool({ tool: name, params: { query: input }, correlationId: `corr_${Date.now()}` })
          mcpToolsUsed = [name]
          mcpLatency = mcpRes.latency
          break
        }
      }
    }

    const personalized = this.personalizeResponse(superBaseEntry, profile, ragResult)
    this.updateMeshState(address, input)
    const response = this.generateResponse(personalized, profile, ragResult)

    let codeArtifact: CodeArtifact | undefined
    let codeGenerated = false
    if (this.config.codeGenEnabled && typeof input === 'string' && /\b(code|build|create|generate|implement)\b/i.test(input)) {
      codeArtifact = await this.generateCode({ intent: input, context: ragResult?.combinedContext ?? '', language: 'typescript' })
      codeGenerated = true
    }

    const trace: RoutingTrace = {
      tickCount: this.tickCount,
      hashPath: addressToKey(address),
      resonanceScore: superBaseEntry?.metadata.resonanceScore ?? 0,
      personalizationDepth: profile.adaptationLevel,
      meshNodesTouched: this.mesh.size,
      superBaseMatches: matches.length,
      elapsedMs: nowMs() - startTime,
      ragQuery: ragResult ? { query: String(input), topK: 3 } : undefined,
      ragChunksRetrieved: ragResult?.chunks.length ?? 0,
      mcpToolsUsed,
      mcpLatency,
      codeGenerated,
      codeArtifactId: codeArtifact?.id,
    }

    const result: RoutingResult = {
      address,
      response,
      superBaseEntry,
      coherence: this.globalCoherence,
      morphState: this.personality.morphState,
      personality: { attitude: this.personality.attitude, wit: this.personality.witPool[this.personality.currentWitIndex] },
      trace,
      matches,
      ragResult,
      codeArtifact,
      assemblyPlan: this.assemblyPlan ?? undefined,
    }

    profile.learningHistory.push({ timestamp: Date.now(), input, address, coherence: this.globalCoherence })
    this.onRouteCallbacks.forEach((cb) => cb(result))
    return result
  }

  public async regenerateFromMemory(query: string, mode: RegenerationMode = 'improved') {
    const route = await this.routeData({ query, mode, task: 'regenerate_code' }, 'system')
    return {
      code: route.codeArtifact?.content ?? this.composeCode({ intent: query, context: route.ragResult?.combinedContext ?? '', language: 'typescript' }, route.ragResult?.combinedContext ?? ''),
      architecture: 'Self-Assembling Resonance Orchestrator v8.0',
      confidence: Math.min(95, 60 + route.matches.length * 5 + (route.ragResult?.chunks.length ?? 0) * 5),
      improvements: route.matches.length ? ['Used resonant memory matches'] : ['Add artifacts to memory for stronger regeneration'],
      sourceNodes: route.matches.map((m) => m.id),
      trace: route.trace,
    }
  }

  public getMetrics(): SystemMetrics {
    const now = Date.now()
    let totalAge = 0
    let activeConnections = 0
    this.mesh.forEach((node) => {
      totalAge += Math.max(0, now - node.lastUpdated)
      activeConnections += node.connectingPoints.filter((cp) => cp.connected !== null).length
    })
    return {
      tickCount: this.tickCount,
      isRunning: this.isRunning,
      currentTickInterval: this.currentTickIntervalMs,
      globalCoherence: this.globalCoherence,
      loadedNodeCount: this.mesh.size,
      totalNodeCapacity: this.config.maxLoadedNodes,
      activeConnections,
      attractorCount: this.attractors.size,
      personalityCount: this.personalities.size,
      superBaseSize: this.superBase.size,
      averageNodeAge: this.mesh.size > 0 ? totalAge / this.mesh.size : 0,
      loadFactor: this.mesh.size / this.config.maxLoadedNodes,
      documentsIngested: this.documents.size,
      totalChunks: this.chunks.size,
      toolsAvailable: this.mcpTools.size,
      toolsOnline: Array.from(this.mcpTools.values()).filter((t) => t.successRate > 0.5).length,
      artifactsGenerated: this.codeArtifacts.size,
      componentsDiscovered: this.discoveredComponents.size,
      assemblyHealth: this.assemblyPlan?.confidence ?? 0,
    }
  }

  public onTick(callback: (metrics: SystemMetrics) => void): () => void { this.onTickCallbacks.push(callback); return () => this.removeCallback(this.onTickCallbacks, callback) }
  public onStateChange(callback: (node: NodeState, oldState: BaseState) => void): () => void { this.onStateChangeCallbacks.push(callback); return () => this.removeCallback(this.onStateChangeCallbacks, callback) }
  public onRoute(callback: (result: RoutingResult) => void): () => void { this.onRouteCallbacks.push(callback); return () => this.removeCallback(this.onRouteCallbacks, callback) }
  public onIngest(callback: (doc: IngestedDocument) => void): () => void { this.onIngestCallbacks.push(callback); return () => this.removeCallback(this.onIngestCallbacks, callback) }
  public onCodeGen(callback: (artifact: CodeArtifact) => void): () => void { this.onCodeGenCallbacks.push(callback); return () => this.removeCallback(this.onCodeGenCallbacks, callback) }
  public onDiscovery(callback: (comp: DiscoveredComponent) => void): () => void { this.onDiscoveryCallbacks.push(callback); return () => this.removeCallback(this.onDiscoveryCallbacks, callback) }

  public getLoadedNodes(): NodeState[] { return Array.from(this.mesh.values()) }
  public getAllMeshNodes(): NodeState[] { return this.getLoadedNodes() }
  public getMeshState(address: Address): NodeState | undefined { return this.mesh.get(addressToKey(address)) }
  public getGlobalCoherence(): number { return this.globalCoherence }
  public getPersonality() { return { attitude: this.personality.attitude, morphState: this.personality.morphState, currentWit: this.personality.witPool[this.personality.currentWitIndex], witPoolSize: this.personality.witPool.length } }
  public setAttitude(attitude: Attitude): void { this.personality.attitude = attitude }
  public getMorphState(): number { return this.personality.morphState }
  public getTickCount(): number { return this.tickCount }
  public isAutonomous(): boolean { return this.isRunning }
  public getAttractors(): Map<string, number> { return new Map(this.attractors) }
  public getConnectionWeights(): Map<string, number> { return new Map(this.connectionWeights) }
  public getConfig(): ResonanceConfig { return { ...this.config } }
  public updateConfig(updates: Partial<ResonanceConfig>): void { this.config = { ...this.config, ...updates } }
  public addToSuperBase(entry: SuperBaseEntry): void { this.superBase.set(entry.id, entry) }
  public getSuperBaseEntries(): SuperBaseEntry[] { return Array.from(this.superBase.values()) }
  public getSuperBaseSize(): number { return this.superBase.size }
  public getDocuments(): IngestedDocument[] { return Array.from(this.documents.values()) }
  public getCodeArtifacts(): CodeArtifact[] { return Array.from(this.codeArtifacts.values()) }
  public getDiscoveredComponents(): DiscoveredComponent[] { return Array.from(this.discoveredComponents.values()) }
  public getAssemblyPlan(): AssemblyPlan | null { return this.assemblyPlan }

  public storeArtifactUnderstanding(artifact: { id: string; understanding?: unknown; originalName?: string; language?: string }): SuperBaseEntry | null {
    if (!artifact.understanding) return null
    const address = this.calculateResonanceAddress(artifact, this.defaultProfile('system'))
    const entry: SuperBaseEntry = {
      id: `artifact_${artifact.id}`,
      address,
      content: artifact.understanding,
      metadata: { gate: address.node + 1, line: address.line, codon: `${address.node + 1}.${address.line}.${address.color}.${address.tone}`, timestamp: Date.now(), sourceArtifact: artifact.id, artifactName: artifact.originalName, language: artifact.language, contentType: 'understanding' },
    }
    this.addToSuperBase(entry)
    this.loadNodesInProximity(address, 2)
    return entry
  }

  public storeCodeChunks(artifactId: string, chunks: string[], language = 'typescript'): SuperBaseEntry[] {
    return chunks.map((chunk, index) => {
      const address = this.calculateResonanceAddress({ artifactId, chunk, index }, this.defaultProfile('system'))
      const entry: SuperBaseEntry = { id: `chunk_${artifactId}_${index}`, address, content: { artifactId, chunkIndex: index, content: chunk, language }, metadata: { timestamp: Date.now(), sourceArtifact: artifactId, contentType: 'source_chunk' } }
      this.addToSuperBase(entry)
      return entry
    })
  }

  private tick(): void {
    this.tickCount++
    this.currentTime = Date.now()
    this.mesh.forEach((nodeState) => this.updateNodeState(nodeState))
    this.propagateSignals()
    this.applyMorphingPhysics()
    this.decayStates()
    this.introduceNoise()
    this.updateGlobalCoherence()
    this.learnFromPatterns()

    if (this.config.autoWireEnabled && this.tickCount % this.config.autoDiscoveryInterval === 0) {
      this.discoverComponents().catch(() => undefined)
    }

    const metrics = this.getMetrics()
    this.onTickCallbacks.forEach((cb) => cb(metrics))
  }

  private updateNodeState(nodeState: NodeState): void {
    const oldState = nodeState.baseState
    const internalPressure = this.calculateInternalPressure(nodeState)
    nodeState.tension = clamp01(nodeState.tension + internalPressure * this.config.tensionAccumulationRate)

    if (nodeState.tension > this.config.stableToChangingThreshold && nodeState.baseState === 'STABLE') nodeState.baseState = 'CHANGING'
    else if (nodeState.tension > this.config.changingToResolvingThreshold && nodeState.baseState === 'CHANGING') {
      nodeState.baseState = 'RESOLVING'
      nodeState.address.line = ((nodeState.address.line % CANON.LINE_COUNT) + 1) as LineIndex
      nodeState.tension = 0.3
    } else if (nodeState.baseState === 'RESOLVING' && nodeState.tension < this.config.resolvingToStableThreshold) nodeState.baseState = 'STABLE'

    nodeState.coherence = Math.max(0.1, nodeState.coherence - this.config.coherenceDecayRate)
    if (this.calculateNeighborResonance(nodeState) > this.config.neighborResonanceThreshold) {
      nodeState.baseState = 'RESONANT'
      nodeState.coherence = clamp01(nodeState.coherence + this.config.coherenceBoostResonant)
    }
    nodeState.lastUpdated = this.currentTime
    if (nodeState.baseState !== oldState) this.onStateChangeCallbacks.forEach((cb) => cb(nodeState, oldState))
  }

  private calculateInternalPressure(nodeState: NodeState): number {
    const activeModifications = nodeState.modifications.filter((m) => m.active).length
    const avgSenseIntensity = nodeState.senses.reduce((sum, s) => sum + s.intensity, 0) / nodeState.senses.length
    const unconnectedPoints = nodeState.connectingPoints.filter((cp) => cp.connected === null).length
    const age = Math.max(0, this.currentTime - nodeState.lastUpdated)
    return clamp01((activeModifications / CANON.MOD_TYPES.length) * 0.3 + avgSenseIntensity * 0.2 + (unconnectedPoints / CANON.POINT_TYPES.length) * 0.2 + (1 - nodeState.coherence) * 0.1 + Math.min(age / 60000, 1) * 0.1)
  }

  private calculateNeighborResonance(nodeState: NodeState): number {
    let totalResonance = 0
    let neighborCount = 0
    for (const otherNode of this.mesh.values()) {
      if (otherNode === nodeState || otherNode.address.layer !== nodeState.address.layer) continue
      const score = calculateResonanceScore(nodeState.address, otherNode.address)
      if (score > this.config.neighborResonanceThreshold) {
        totalResonance += score
        neighborCount++
        if (neighborCount >= this.config.maxNeighborScan) break
      }
    }
    return neighborCount > 0 ? totalResonance / neighborCount : 0
  }

  private propagateSignals(): void {
    const signalMap = new Map<string, number>()
    this.mesh.forEach((nodeState, key) => signalMap.set(key, nodeState.coherence * (nodeState.baseState === 'RESONANT' ? 1.5 : 1)))
    this.mesh.forEach((nodeState) => {
      nodeState.connectingPoints.forEach((point) => {
        if (!point.connected) return
        point.strength = clamp01(point.strength + (signalMap.get(addressToKey(point.connected)) || 0) * 0.01)
      })
    })
  }

  private applyMorphingPhysics(): void {
    this.mesh.forEach((nodeState) => {
      if (nodeState.baseState === 'CHANGING') {
        nodeState.modifications.forEach((mod) => {
          mod.value = clamp01(mod.value + (Math.random() - 0.5) * this.config.changingMutationRate)
          mod.origin = 'morph'
        })
      }
      if (nodeState.baseState === 'RESONANT') nodeState.senses.forEach((sense) => { sense.intensity = clamp01(sense.intensity + this.config.resonantSenseBoost) })
      if (nodeState.baseState === 'DORMANT') nodeState.coherence = Math.min(0.5, nodeState.coherence + this.config.dormantWakeRate)
    })
  }

  private decayStates(): void {
    this.mesh.forEach((nodeState) => {
      nodeState.tension = Math.max(0, nodeState.tension - this.config.tensionDecayRate)
      nodeState.senses.forEach((sense) => { sense.intensity = Math.max(0, sense.intensity - this.config.senseDecayRate) })
      nodeState.connectingPoints.forEach((point) => { point.strength = Math.max(0, point.strength - this.config.connectionDecayRate) })
    })
  }

  private introduceNoise(): void {
    if (this.tickCount % this.config.noiseIntervalTicks !== 0 || this.mesh.size === 0) return
    const randomNodeIndex = Math.floor(Math.random() * this.mesh.size)
    let index = 0
    this.mesh.forEach((nodeState) => {
      if (index === randomNodeIndex) {
        nodeState.tension = clamp01(nodeState.tension + Math.random() * 0.1)
        const senseIdx = Math.floor(Math.random() * nodeState.senses.length)
        nodeState.senses[senseIdx].intensity = clamp01(nodeState.senses[senseIdx].intensity + Math.random() * 0.2)
      }
      index++
    })
  }

  private learnFromPatterns(): void {
    if (this.tickCount % this.config.learningIntervalTicks !== 0) return
    this.mesh.forEach((nodeState, key) => {
      if (nodeState.baseState === 'STABLE' && nodeState.coherence > 0.6) {
        const attractorKey = `${nodeState.address.mesh}_${nodeState.address.layer}_${nodeState.address.center}`
        this.attractors.set(attractorKey, (this.attractors.get(attractorKey) || 0) + 1)
      }
      nodeState.connectingPoints.forEach((point) => {
        if (point.connected && nodeState.baseState === 'RESONANT') {
          const connectionKey = `${key}_${addressToKey(point.connected)}`
          this.connectionWeights.set(connectionKey, (this.connectionWeights.get(connectionKey) || 1) * 1.01)
        }
      })
    })
  }

  private updateGlobalCoherence(): void {
    const nodes = Array.from(this.mesh.values())
    this.globalCoherence = nodes.length ? nodes.reduce((sum, node) => sum + node.coherence, 0) / nodes.length : 0.5
    this.personality.morphState = this.globalCoherence
    if (this.globalCoherence > this.config.attitudeMorphThresholds.mystical) this.personality.attitude = 'mystical'
    else if (this.globalCoherence < this.config.attitudeMorphThresholds.analytical) this.personality.attitude = 'analytical'
    else this.personality.attitude = 'curious'
  }

  private initializeMeshLazy(): void {
    for (const gate of this.seedGates) {
      for (let layer = 0; layer < CANON.LAYER_COUNT; layer++) {
        const address = createAddress({ mesh: 0, layer: layer as LayerIndex, center: 4, node: gate - 1, line: 1 })
        const nodeState = createNodeState({ address, baseState: 'STABLE', coherence: 0.8, birthTick: this.tickCount })
        const key = addressToKey(address)
        this.mesh.set(key, nodeState)
        this.loadedNodeKeys.add(key)
      }
    }
  }

  public loadNodesInProximity(centerAddress: Address, radius: number = this.config.proximityRadius): void {
    const boundedRadius = Math.max(0, Math.min(6, radius))
    for (let center = 0; center < CANON.CENTER_COUNT && this.mesh.size < this.config.maxLoadedNodes; center++) {
      for (let offset = -boundedRadius; offset <= boundedRadius && this.mesh.size < this.config.maxLoadedNodes; offset++) {
        const address = createAddress({ ...centerAddress, center: center as CenterIndex, node: (centerAddress.node + offset + CANON.NODE_COUNT) % CANON.NODE_COUNT, line: (((centerAddress.line + offset + 5) % CANON.LINE_COUNT) + 1) as LineIndex })
        const key = addressToKey(address)
        if (!this.loadedNodeKeys.has(key)) {
          this.mesh.set(key, createNodeState({ address, birthTick: this.tickCount }))
          this.loadedNodeKeys.add(key)
        }
      }
    }
  }

  private calculateResonanceAddress(input: unknown, profile: PersonalityProfile): Address {
    const combined = hashInput(input) ^ hashInput(profile.userId)
    return createAddress({
      mesh: (combined % CANON.MESH_COUNT) as MeshIndex,
      layer: (Math.floor(combined / 5) % CANON.LAYER_COUNT) as LayerIndex,
      center: (Math.floor(combined / 65) % CANON.CENTER_COUNT) as CenterIndex,
      node: Math.floor(combined / 585) % CANON.NODE_COUNT,
      line: ((Math.floor(combined / 37440) % CANON.LINE_COUNT) + 1) as LineIndex,
      color: (Math.floor(combined / 224640) % CANON.COLOR_COUNT) as ColorIndex,
      tone: (Math.floor(combined / 1347840) % CANON.TONE_COUNT) as ToneIndex,
      zodiac: (Math.floor(combined / 8087040) % CANON.ZODIAC_COUNT) as ZodiacIndex,
      house: (Math.floor(combined / 97044480) % CANON.HOUSE_COUNT) as HouseIndex,
    })
  }

  private retrieveMultipleFromSuperBase(address: Address, input: unknown, limit: number): SuperBaseEntry[] {
    const queryText = JSON.stringify(input).toLowerCase()
    return Array.from(this.superBase.values())
      .map((entry) => ({ entry, score: calculateResonanceScore(address, entry.address) + this.semanticScore(queryText, entry) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ entry, score }) => ({ ...entry, metadata: { ...entry.metadata, resonanceScore: score } }))
  }

  private semanticScore(queryText: string, entry: SuperBaseEntry): number {
    const content = JSON.stringify(entry.content).toLowerCase()
    const words = queryText.match(/\w+/g) ?? []
    return words.length ? words.filter((word) => content.includes(word)).length / words.length : 0
  }

  private personalizeResponse(entry: SuperBaseEntry | null, profile: PersonalityProfile, ragResult?: RAGResult): unknown {
    if (!entry && !ragResult) return { content: "The pattern hasn't crystallized yet. Let me listen deeper.", personalized: false }
    const adapted: Record<string, unknown> = entry && typeof entry.content === 'object' && entry.content !== null ? { ...(entry.content as Record<string, unknown>) } : { content: entry?.content }
    if (ragResult) {
      adapted.ragContext = ragResult.combinedContext
      adapted.ragConfidence = ragResult.chunks.length > 0 ? 0.8 : 0
    }
    adapted.tone = profile.adaptationLevel > 0.7 ? 'intimate' : profile.adaptationLevel < 0.3 ? 'formal' : 'conversational'
    return { content: adapted, personalized: true, adaptationLevel: profile.adaptationLevel }
  }

  private updateMeshState(address: Address, _input: unknown): void {
    const key = addressToKey(address)
    if (!this.mesh.has(key)) this.loadNodesInProximity(address, 1)
    const nodeState = this.mesh.get(key)
    if (!nodeState) return
    nodeState.tension = clamp01(nodeState.tension + 0.1)
    nodeState.activationCount++
    if (nodeState.tension > this.config.stableToChangingThreshold && nodeState.baseState === 'STABLE') nodeState.baseState = 'CHANGING'
    nodeState.coherence = Math.max(0, nodeState.coherence - 0.05)
    nodeState.lastUpdated = Date.now()
    this.updateGlobalCoherence()
  }

  private generateResponse(_personalized: unknown, _profile: PersonalityProfile, ragResult?: RAGResult): string {
    this.personality.currentWitIndex = (this.personality.currentWitIndex + 1) % this.personality.witPool.length
    const wit = this.personality.witPool[this.personality.currentWitIndex]
    const context = ragResult && ragResult.chunks.length > 0 ? ` | Knowledge: ${ragResult.chunks.length} chunks` : ''
    return `${wit} (Coherence: ${(this.globalCoherence * 100).toFixed(0)}% | Attitude: ${this.personality.attitude}${context})`
  }

  private getOrCreateProfile(userId: string): PersonalityProfile {
    const existing = this.personalities.get(userId)
    if (existing) return existing
    const profile = this.defaultProfile(userId)
    this.personalities.set(userId, profile)
    return profile
  }

  private defaultProfile(userId = 'system'): PersonalityProfile {
    return { userId, birthChart: {}, preferences: {}, learningHistory: [], adaptationLevel: 0.5, lastInteraction: Date.now(), interactionCount: 0 }
  }

  private chunkDocument(docId: string, content: string, contentType: string): DocumentChunk[] {
    const chunks: DocumentChunk[] = []
    let start = 0
    let chunkIndex = 0
    while (start < content.length) {
      const end = Math.min(start + this.config.chunkSize, content.length)
      const chunkContent = content.slice(start, end)
      chunks.push({
        id: `chunk_${docId}_${chunkIndex}`,
        sourceId: docId,
        content: chunkContent,
        embedding: [],
        address: createAddress(),
        metadata: { startChar: start, endChar: end, lineNumber: content.slice(0, start).split('\n').length, fileType: contentType, confidence: 0.8 },
      })
      if (end === content.length) break
      start = Math.max(0, end - this.config.chunkOverlap)
      chunkIndex++
    }
    return chunks
  }

  private generateEmbedding(text: string): number[] {
    const hash = hashInput(text)
    return Array.from({ length: this.config.embeddingDimension }, (_, i) => Math.sin(hash * (i + 1) * 0.1) * 0.5 + 0.5)
  }

  private composeCode(request: CodeRequest, context: string): string {
    return `// Generated from: "${request.intent}"\n// Context: ${context.slice(0, 200)}...\n// Language: ${request.language}\n\nexport function generatedFunction() {\n  console.log("Generated from ResonanceOrchestrator v8");\n  return true;\n}\n`
  }

  private extractDependencies(code: string): string[] {
    const deps: string[] = []
    const importMatches = code.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g)
    if (importMatches) {
      importMatches.forEach((match) => {
        const dep = match.match(/from\s+['"]([^'"]+)['"]/)?.[1]
        if (dep) deps.push(dep)
      })
    }
    return [...new Set(deps)]
  }

  private removeCallback<T>(callbacks: T[], callback: T): void {
    const idx = callbacks.indexOf(callback)
    if (idx >= 0) callbacks.splice(idx, 1)
  }
}

let orchestratorInstance: ResonanceOrchestrator | null = null

export function getResonanceOrchestrator(): ResonanceOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new ResonanceOrchestrator({ apiBase: DEFAULT_CONFIG.apiBase, autoStart: true })
  }
  orchestratorInstance.startAutonomousLoop()
  return orchestratorInstance
}

export function resetResonanceOrchestrator(): void {
  orchestratorInstance?.stopAutonomousLoop()
  orchestratorInstance = null
}

export default ResonanceOrchestrator
