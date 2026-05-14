import React, { useEffect, useMemo, useRef, useState } from 'react'
import NeuralMeshVisualizer from '@/components/NeuralMeshVisualizer'
import ResonanceOrchestrator from '@/lib/orchestrator'
import { BrowserMRNNEngine, type MRNNQueryResult } from '@/lib/mrnn-symbolic-engine'

const SYNTHIA_BASE = 'https://synthia-server.onrender.com'
const mrnnEngine = new BrowserMRNNEngine()

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
  const [mrnnAddress, setMrnnAddress] = useState('B3.T4.C2.G57.L3')
  const [mrnnResult, setMrnnResult] = useState<MRNNQueryResult>(() => mrnnEngine.query('B3.T4.C2.G57.L3') ?? mrnnEngine.routeSignal('field boot'))
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const orch = new ResonanceOrchestrator({ apiBase: SYNTHIA_BASE, mcpEndpoint: `${SYNTHIA_BASE}/mcp`, autoStart: true })
    orch.startAutonomousLoop()
    setOrchestrator(orch)
    return () => orch.stopAutonomousLoop()
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 750)
    return () => window.clearInterval(timer)
  }, [])

  const metrics = useMemo(() => orchestrator?.getMetrics(), [orchestrator, tick])

  const runMRNNQuery = (value: string) => {
    const exact = mrnnEngine.query(value)
    const result = exact ?? mrnnEngine.routeSignal(value)
    setMrnnResult(result)
    setMrnnAddress(result.address)
    return result
  }

  const sendToSynthiaDrop = async (filename: string, content: string, contentType: string) => {
    const res = await fetch(`${SYNTHIA_BASE}/api/drop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, content, context: { source: 'mrnn-field-uploader', contentType, requestedFlow: 'analyze_structure_infer_intent_assign_ontological_address_queue_integration_then_apply_or_deploy' } }),
    })
    if (!res.ok) throw new Error(await res.text().catch(() => `Synthia drop failed: ${res.status}`))
    return res.json()
  }

  const ingestFiles = async (files: FileList | null) => {
    if (!files || !orchestrator) return
    for (const file of Array.from(files)) {
      const id = `${file.name}-${Date.now()}`
      setUploads((items) => [{ id, name: file.name, status: 'pending', message: 'Reading file...' }, ...items])
      try {
        const text = await file.text()
        const localMRNN = runMRNNQuery(`${file.name}\n${text.slice(0, 2000)}`)
        setUploads((items) => items.map((item) => item.id === id ? { ...item, message: 'Analyzing structure + intent...' } : item))
        const [doc, drop] = await Promise.all([orchestrator.ingestDocument(file.name, text, file.type || 'text/plain'), sendToSynthiaDrop(file.name, text, file.type || 'text/plain')])
        const address = drop?.address || drop?.ontological_address || drop?.gnn_analysis?.address || localMRNN.address
        const mode = drop?.recommended_mode || drop?.mode || drop?.gnn_analysis?.mode || localMRNN.resonance
        const confidence = drop?.confidence || drop?.gnn_analysis?.confidence || null
        setUploads((items) => items.map((item) => item.id === id ? { ...item, status: 'ingested', message: [`v8 chunks: ${doc.chunks.length}`, mode ? `mode: ${mode}` : null, address ? `address: ${typeof address === 'string' ? address : JSON.stringify(address)}` : null, confidence ? `confidence: ${Math.round(confidence * 100)}%` : null, `integration: ${drop?.auto_integration ? 'queued' : 'review'}`].filter(Boolean).join(' · ') } : item))
      } catch (error) {
        setUploads((items) => items.map((item) => item.id === id ? { ...item, status: 'error', message: error instanceof Error ? error.message : 'Could not ingest file' } : item))
      }
    }
  }

  const ask = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!orchestrator || !input.trim()) return
    const message = input.trim()
    const localMRNN = runMRNNQuery(message)
    setInput('')
    try {
      const speech = await fetch(`${SYNTHIA_BASE}/mrnn/speech/speak`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, translator: 'voice', train: true, mrnn_address: localMRNN.address }) }).then((res) => res.ok ? res.json() : null).catch(() => null)
      const routed = await orchestrator.routeData(message, 'field-user')
      setResponse(speech?.text || routed.response || localMRNN.meaning)
    } catch (error) {
      setResponse(error instanceof Error ? `${localMRNN.meaning} · ${error.message}` : localMRNN.meaning)
    }
  }

  if (!orchestrator) {
    return <div className="grid min-h-screen place-items-center bg-[#05030a] text-[#c084fc] font-mono"><div className="rounded-3xl border border-[#8b5cf6]/30 bg-black/50 px-7 py-5 shadow-[0_0_60px_rgba(139,92,246,0.22)] backdrop-blur-xl">Booting MRNN v8...</div></div>
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05030a] text-[#f3e8ff] font-mono">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(139,92,246,0.32),transparent_34%),radial-gradient(circle_at_82%_72%,rgba(20,241,217,0.17),transparent_32%),linear-gradient(135deg,rgba(8,3,18,0.96),rgba(4,3,10,0.98))]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(168,85,247,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,.05)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute inset-0 z-0 opacity-90 mix-blend-screen"><NeuralMeshVisualizer orchestrator={orchestrator} width={1200} height={800} interactive /></div>

      <header className="relative z-10 m-4 inline-block max-w-[min(610px,calc(100vw-2rem))] rounded-[2rem] border border-[#8b5cf6]/30 bg-[#08030f]/72 p-5 shadow-[0_0_70px_rgba(139,92,246,0.24)] backdrop-blur-2xl">
        <div className="mb-3 flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-[#14f1d9] shadow-[0_0_18px_rgba(20,241,217,.8)]" /><div className="text-xs uppercase tracking-[0.38em] text-[#14f1d9]">Resonance OS</div></div>
        <h1 className="text-4xl font-black tracking-[-0.08em] text-[#f3e8ff] drop-shadow-[0_0_22px_rgba(192,132,252,.45)]">The Field</h1>
        <p className="mt-1 text-xs uppercase tracking-[0.26em] text-[#b79ad6]">MRNN Morphing Interface</p>
        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 text-xs text-[#f3e8ff]/80 sm:grid-cols-3">
          <span>Autonomy <b className={orchestrator.isAutonomous() ? 'text-[#14f1d9]' : 'text-[#ff5c8a]'}>{orchestrator.isAutonomous() ? 'ON' : 'OFF'}</b></span><span>Ticks <b className="text-[#c084fc]">{orchestrator.getTickCount()}</b></span><span>Coherence <b className="text-[#14f1d9]">{((metrics?.globalCoherence ?? 0) * 100).toFixed(1)}%</b></span><span>Nodes <b className="text-[#c084fc]">{metrics?.loadedNodeCount ?? 0}</b></span><span>Docs <b className="text-[#c084fc]">{metrics?.documentsIngested ?? 0}</b></span><span>Chunks <b className="text-[#14f1d9]">{metrics?.totalChunks ?? 0}</b></span>
        </div>
      </header>

      <aside className="absolute right-4 top-4 z-20 w-[min(360px,calc(100vw-2rem))] rounded-[2rem] border border-[#14f1d9]/25 bg-[#070212]/76 p-4 shadow-[0_0_60px_rgba(20,241,217,0.10),0_0_80px_rgba(139,92,246,0.20)] backdrop-blur-2xl">
        <div className="text-[11px] uppercase tracking-[0.32em] text-[#14f1d9]">MRNN Address</div>
        <form className="mt-3 flex gap-2" onSubmit={(event) => { event.preventDefault(); runMRNNQuery(mrnnAddress) }}><input value={mrnnAddress} onChange={(event) => setMrnnAddress(event.target.value)} className="min-w-0 flex-1 rounded-2xl border border-[#8b5cf6]/25 bg-black/45 px-3 py-2 text-xs text-[#f3e8ff] outline-none focus:border-[#14f1d9]" placeholder="B3.T4.C2.G57.L3" /><button className="rounded-2xl bg-[#14f1d9] px-3 py-2 text-xs font-black text-[#05030a]" type="submit">Map</button></form>
        <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">{Object.entries(mrnnResult.rawAddress).map(([key, value]) => <div key={key} className="rounded-2xl border border-white/10 bg-white/[0.045] p-2"><div className="text-[9px] uppercase text-[#b79ad6]">{key}</div><div className="text-[#f3e8ff]">{value}</div></div>)}</div>
        <div className="mt-4 rounded-3xl border border-[#8b5cf6]/25 bg-[#8b5cf6]/8 p-3"><div className="text-lg font-black text-[#c084fc]">{String(mrnnResult.layers.base.name ?? 'MRNN')}</div><div className="text-sm text-[#f3e8ff]/85">{mrnnResult.meaning}</div><div className="mt-2 text-xs text-[#b79ad6]">{mrnnResult.resonance}</div><div className="mt-2 text-xs text-[#14f1d9]">{mrnnResult.frequency.toFixed(2)} Hz · phase {mrnnResult.phase.toFixed(3)}</div></div>
      </aside>

      <section className="absolute bottom-4 left-4 z-20 w-[min(430px,calc(100vw-2rem))] rounded-[2rem] border border-[#8b5cf6]/30 bg-[#08030f]/78 p-4 shadow-[0_0_70px_rgba(20,241,217,0.11),0_0_80px_rgba(139,92,246,0.22)] backdrop-blur-2xl">
        <div className={`mb-4 cursor-pointer rounded-3xl border border-dashed p-5 text-center transition ${isDragging ? 'border-[#14f1d9] bg-[#14f1d9]/10 shadow-[0_0_24px_rgba(20,241,217,.25)]' : 'border-[#c084fc]/35 bg-[#8b5cf6]/8 hover:border-[#14f1d9]/55 hover:bg-[#14f1d9]/5'}`} onClick={() => fileRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); void ingestFiles(event.dataTransfer.files) }}><input ref={fileRef} type="file" multiple className="hidden" onChange={(event) => void ingestFiles(event.target.files)} /><div className="text-3xl text-[#c084fc] drop-shadow-[0_0_20px_rgba(192,132,252,.45)]">⬡</div><div className="text-sm font-bold text-[#f3e8ff]">Drop files into the field</div><div className="text-xs text-[#b79ad6]/80">Structure, intent, address, and integration path.</div></div>
        {uploads.length > 0 && <div className="mb-4 max-h-36 space-y-2 overflow-y-auto pr-1">{uploads.slice(0, 5).map((item) => <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 text-xs"><div className="flex justify-between gap-2"><span className="truncate text-[#f3e8ff]">{item.name}</span><span className={item.status === 'ingested' ? 'text-[#14f1d9]' : item.status === 'error' ? 'text-[#ff5c8a]' : 'text-[#c084fc]'}>{item.status}</span></div>{item.message && <div className="mt-1 text-[11px] text-[#b79ad6]/75">{item.message}</div>}</div>)}</div>}
        <form onSubmit={ask} className="space-y-3"><textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Speak to the field..." className="min-h-24 w-full resize-none rounded-3xl border border-[#8b5cf6]/25 bg-[#05030a]/90 p-3 text-sm text-[#f3e8ff] placeholder:text-[#b79ad6]/45 outline-none focus:border-[#14f1d9]/70 focus:ring-2 focus:ring-[#14f1d9]/20" /><button className="w-full rounded-3xl bg-gradient-to-r from-[#8b5cf6] via-[#c084fc] to-[#14f1d9] py-3 font-black text-[#05030a] shadow-[0_0_24px_rgba(139,92,246,.28)] transition hover:brightness-110" type="submit">Send to MRNN</button></form>
        {response && <div className="mt-4 rounded-3xl border border-[#14f1d9]/25 bg-[#14f1d9]/6 p-3 text-sm text-[#f3e8ff]/90 shadow-[0_0_24px_rgba(20,241,217,.12)]">{response}</div>}
      </section>
    </div>
  )
}
