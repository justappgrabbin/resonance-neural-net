import { ResonanceOrchestrator } from './orchestrator'

type MorphStateReadable = {
  getMorphState?: () => number
  getPersonality?: () => { morphState?: number; attitude?: string; currentWit?: string; wit?: string[] }
  getMetrics?: () => { globalCoherence?: number; morphState?: number }
  getGlobalCoherence?: () => number
}

function finiteOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function readMorphState(instance: MorphStateReadable): number {
  const existing = instance.getMorphState
  if (typeof existing === 'function' && existing !== ResonanceOrchestrator.prototype.getMorphState) {
    const value = finiteOrNull(existing.call(instance))
    if (value !== null) return value
  }

  const personality = instance.getPersonality?.()
  const personalityMorph = finiteOrNull(personality?.morphState)
  if (personalityMorph !== null) return personalityMorph

  const metrics = instance.getMetrics?.()
  const metricsMorph = finiteOrNull(metrics?.morphState)
  if (metricsMorph !== null) return metricsMorph

  const metricsCoherence = finiteOrNull(metrics?.globalCoherence)
  if (metricsCoherence !== null) return metricsCoherence

  const coherence = finiteOrNull(instance.getGlobalCoherence?.())
  return coherence ?? 0
}

declare module './orchestrator' {
  interface ResonanceOrchestrator {
    getMorphState(): number
  }
}

if (typeof ResonanceOrchestrator.prototype.getMorphState !== 'function') {
  ResonanceOrchestrator.prototype.getMorphState = function getMorphState(this: ResonanceOrchestrator): number {
    return readMorphState(this as MorphStateReadable)
  }
}

export { readMorphState }
