/**
 * Legacy orchestrator-6 path.
 *
 * Replaced by the canonical v8 self-assembling autonomous orchestrator at:
 *   client/src/lib/orchestrator.ts
 *
 * Valuable v6 behavior preserved in v8:
 * - autonomous heartbeat
 * - lazy seed-gate initialization
 * - 1000-node browser-safe cap
 * - bounded neighbor scan
 * - node tension/coherence/state transitions
 * - attractors and connection weights
 * - SuperBase address routing
 * - Synthia server default wiring
 */

export * from './client/src/lib/orchestrator'
export { default } from './client/src/lib/orchestrator'
