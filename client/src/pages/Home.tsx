import React, { useEffect, useMemo, useRef, useState } from 'react'
import NeuralMeshVisualizer from '@/components/NeuralMeshVisualizer'
import ResonanceOrchestrator from '@/lib/orchestrator'

const SYNTHIA_BASE = 'https://synthia-server.onrender.com'

type UploadItem = {
  id: string
  name: string
  status: 'pending' | 'ingested' | 'error'
  message?: string
}

export default function Home() {
  const [orchestrator, setOrchestrator] = useState<ResonanceOrchestrator | null>(null)
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [tick, setTick] = useState(0)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const orch = new ResonanceOrchestrator({
      apiBase: SYNTHIA_BASE,
      mcpEndpoint: `${SYNTHIA_BASE}/mcp`,
      autoStart: true,
    })
    orch.startAutonomousLoop()
    setOrchestrator(orch)
    return () => orch.stopAutonomousLoop()
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 750)
    return () => window.clearInterval(timer)
  }, [])

  const metrics = useMemo(() => orchestrator?.getMetrics(), [orchestrator, tick])

  const ingestFiles = async (files: FileList | null) => {
    if (!files || !orchestrator) return

    for (const file of Array.from(files)) {
      const id = `${file.name}-${Date.now()}`
      setUploads((items) => [{ id, name: file.name, status: 'pending' }, ...items])

      try {
        const text = await file.text()
        await orchestrator.ingestDocument(file.name, text, file.type || 'text/plain')
        setUploads((items) => items.map((item) => item.id === id ? { ...item, status: 'ingested', message: 'Ingested into v8 memory mesh' } : item))
      } catch (error) {
        setUploads((items) => items.map((item) => item.id === id ? { ...item, status: 'error', message: error instanceof Error ? error.message : 'Could not ingest file' } : item))
      }
    }
  }

  const ask = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!orchestrator || !input.trim()) return

    const message = input.trim()
    setInput('')

    try {
      const speech = await fetch(`${SYNTHIA_BASE}/mrnn/speech/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, translator: 'voice', train: true }),
      }).then((res) => res.ok ? res.json() : null).catch(() => null)

      const routed = await orchestrator.routeData(message, 'field-user')
      setResponse(speech?.text || routed.response || 'The field received it, but the speech layer is not wired yet.')
    } catch (error) {
      setResponse(error instanceof Error ? error.message : 'Route failed')
    }
  }

  if (!orchestrator) {
    return <div className="min-h-screen bg-[#050509] text-[#f5c518] grid place-items-center font-mono">Booting MRNN v8...</div>
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050509] text-[#f7e7b2] font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,197,24,0.12),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(16,212,116,0.10),transparent_35%)]" />

      <div className="absolute inset-0 z-0">
        <NeuralMeshVisualizer orchestrator={orchestrator} width={1200} height={800} interactive />
      </div>

      <header className="relative z-10 m-4 inline-block rounded-2xl border border-[#c9a84c]/30 bg-black/65 p-4 backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.35em] text-[#c9a84c]">MRNN Orchestrator OS</div>
        <h1 className="text-3xl font-black text-[#f5c518]">The Field</h1>
        <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-1 text-xs text-[#f7e7b2]/80">
          <span>Autonomy: <b className={orchestrator.isAutonomous() ? 'text-[#10d474]' : 'text-[#ff5959]'}>{orchestrator.isAutonomous() ? 'ON' : 'OFF'}</b></span>
          <span>Ticks: {orchestrator.getTickCount()}</span>
          <span>Coherence: {((metrics?.globalCoherence ?? 0) * 100).toFixed(1)}%</span>
          <span>Nodes: {metrics?.loadedNodeCount ?? 0}</span>
          <span>Docs: {metrics?.documentsIngested ?? 0}</span>
          <span>Chunks: {metrics?.totalChunks ?? 0}</span>
        </div>
      </header>

      <section className="absolute bottom-4 left-4 z-20 w-[min(430px,calc(100vw-2rem))] rounded-3xl border border-[#c9a84c]/30 bg-black/75 p-4 shadow-2xl backdrop-blur-xl">
        <div
          className={`mb-4 cursor-pointer rounded-2xl border border-dashed p-5 text-center ${isDragging ? 'border-[#10d474] bg-[#10d474]/10' : 'border-[#c9a84c]/35 bg-[#c9a84c]/5'}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => { event.preventDefault(); setIsDragging(false); void ingestFiles(event.dataTransfer.files) }}
        >
          <input ref={fileRef} type="file" multiple className="hidden" onChange={(event) => void ingestFiles(event.target.files)} />
          <div className="text-2xl">⬡</div>
          <div className="text-sm font-bold text-[#f5c518]">Drop files into the field</div>
          <div className="text-xs text-[#f7e7b2]/55">Readable files are ingested into v8 memory so the system can route with context.</div>
        </div>

        {uploads.length > 0 && (
          <div className="mb-4 max-h-28 space-y-2 overflow-y-auto">
            {uploads.slice(0, 5).map((item) => (
              <div key={item.id} className="flex justify-between gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-xs">
                <span className="truncate">{item.name}</span>
                <span className={item.status === 'ingested' ? 'text-[#10d474]' : item.status === 'error' ? 'text-[#ff5959]' : 'text-[#f5c518]'}>{item.status}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={ask} className="space-y-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Speak to the field..."
            className="min-h-24 w-full resize-none rounded-2xl border border-[#c9a84c]/25 bg-[#07070d]/90 p-3 text-sm text-[#f7e7b2] placeholder:text-[#f7e7b2]/35 outline-none focus:ring-2 focus:ring-[#f5c518]/30"
          />
          <button className="w-full rounded-2xl bg-[#f5c518] py-3 font-black text-black hover:bg-[#ffd84f]" type="submit">Send to MRNN</button>
        </form>

        {response && <div className="mt-4 rounded-2xl border border-[#10d474]/20 bg-[#10d474]/5 p-3 text-sm text-[#f7e7b2]/90">{response}</div>}
      </section>
    </div>
  )
}
