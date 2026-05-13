/**
 * NEURAL MESH VISUALIZER
 *
 * Real-time visualization of the 5-mesh 13-layer neural structure.
 * Displays loaded nodes, connections, coherence, and morphing state.
 */

import React, { useEffect, useRef, useState } from 'react'
import '@/lib/orchestratorMorphStatePatch'
import { ResonanceOrchestrator, NodeState, Address } from '@/lib/orchestrator'

interface NeuralMeshVisualizerProps {
  orchestrator: ResonanceOrchestrator
  width?: number
  height?: number
  interactive?: boolean
}

function getMeshColor(mesh: number): string {
  const colors = [
    '#FF6B6B', // Physical - Red
    '#f5c518', // Emotional - Amber
    '#10d474', // Mental - Emerald
    '#FFA07A', // Soul - Salmon
    '#c084fc', // Field - Violet
  ]
  return colors[mesh] || '#FFFFFF'
}

function getNodePosition(address: Address, centerX: number, centerY: number) {
  const meshRadius = 50 + address.mesh * 40
  const angle = ((address.layer * 30 + address.center * 40) * Math.PI) / 180
  const arcRotation = (address.arcDegree * Math.PI) / 180

  return {
    x: centerX + meshRadius * Math.cos(angle + arcRotation),
    y: centerY + meshRadius * Math.sin(angle + arcRotation),
  }
}

function getStablePersonalityText(orchestrator: ResonanceOrchestrator): string {
  const personality = orchestrator.getPersonality()

  if ('currentWit' in personality && typeof personality.currentWit === 'string') {
    return personality.currentWit
  }

  if ('wit' in personality && Array.isArray(personality.wit)) {
    return personality.wit[0] ?? 'The mesh is listening'
  }

  return `Attitude: ${personality.attitude ?? 'curious'}`
}

const NeuralMeshVisualizer: React.FC<NeuralMeshVisualizerProps> = ({
  orchestrator,
  width = 1200,
  height = 800,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const frameCountRef = useRef(0)
  const [selectedNode, setSelectedNode] = useState<NodeState | null>(null)
  const [meshNodes, setMeshNodes] = useState<NodeState[]>(() => orchestrator.getLoadedNodes())
  const [coherence, setCoherence] = useState(() => orchestrator.getGlobalCoherence())
  const [morphState, setMorphState] = useState(() => orchestrator.getMorphState())
  const [autonomous, setAutonomous] = useState(() => orchestrator.isAutonomous())
  const [tickCount, setTickCount] = useState(() => orchestrator.getTickCount())
  const [personalityText, setPersonalityText] = useState(() => getStablePersonalityText(orchestrator))

  const renderMesh = React.useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const centerX = width / 2
      const centerY = height / 2
      const visibleNodes = meshNodes.slice(0, 1000)

      ctx.fillStyle = '#0a0e27'
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = 'rgba(245, 197, 24, 0.12)'
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        const radius = 50 + i * 40
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()
      }

      visibleNodes.forEach((nodeState) => {
        const { x, y } = getNodePosition(nodeState.address, centerX, centerY)
        const nodeColor = getMeshColor(nodeState.address.mesh)

        if (nodeState.baseState === 'CHANGING') {
          ctx.fillStyle = '#FFFF00'
          ctx.shadowColor = '#FFFF00'
          ctx.shadowBlur = 20
        } else if (nodeState.baseState === 'RESONANT') {
          ctx.fillStyle = '#00FF00'
          ctx.shadowColor = '#00FF00'
          ctx.shadowBlur = 15
        } else {
          ctx.fillStyle = nodeColor
          ctx.shadowColor = nodeColor
          ctx.shadowBlur = 5 + nodeState.tension * 10
        }

        const nodeSize = 2 + nodeState.coherence * 3
        ctx.beginPath()
        ctx.arc(x, y, nodeSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        if (nodeState.tension > 0.5) {
          ctx.strokeStyle = `rgba(255, 100, 100, ${nodeState.tension})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(x, y, nodeSize + 3, 0, Math.PI * 2)
          ctx.stroke()
        }
      })

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < visibleNodes.length; i += 24) {
        const node1 = visibleNodes[i]
        const pos1 = getNodePosition(node1.address, centerX, centerY)

        for (let j = i + 1; j < Math.min(i + 10, visibleNodes.length); j++) {
          const node2 = visibleNodes[j]
          if (node1.address.layer !== node2.address.layer) continue
          const pos2 = getNodePosition(node2.address, centerX, centerY)
          ctx.beginPath()
          ctx.moveTo(pos1.x, pos1.y)
          ctx.lineTo(pos2.x, pos2.y)
          ctx.stroke()
        }
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
      ctx.fill()

      const coherenceRadius = 250 + coherence * 50
      ctx.strokeStyle = `rgba(245, 197, 24, ${coherence})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, coherenceRadius, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = 'rgba(255, 255, 255, 0.82)'
      ctx.font = '14px monospace'
      ctx.fillText(`Autonomy: ${autonomous ? 'ON' : 'OFF'}`, 20, 30)
      ctx.fillText(`Ticks: ${tickCount}`, 20, 50)
      ctx.fillText(`Coherence: ${(coherence * 100).toFixed(1)}%`, 20, 70)
      ctx.fillText(`Nodes: ${visibleNodes.length}`, 20, 90)
      ctx.fillText(`Morph: ${(morphState * 100).toFixed(1)}%`, 20, 110)

      ctx.fillStyle = 'rgba(255, 200, 100, 0.92)'
      ctx.font = 'bold 16px monospace'
      ctx.fillText(personalityText, 20, height - 20)
    },
    [autonomous, coherence, height, meshNodes, morphState, personalityText, tickCount, width]
  )

  const animate = React.useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      renderMesh(ctx)

      if (frameCountRef.current % 10 === 0) {
        setMeshNodes(orchestrator.getLoadedNodes())
        setCoherence(orchestrator.getGlobalCoherence())
        setMorphState(orchestrator.getMorphState())
        setAutonomous(orchestrator.isAutonomous())
        setTickCount(orchestrator.getTickCount())
        setPersonalityText(getStablePersonalityText(orchestrator))
      }
      frameCountRef.current++
    }
    animationRef.current = requestAnimationFrame(animate)
  }, [orchestrator, renderMesh])

  useEffect(() => {
    orchestrator.startAutonomousLoop()
    animate()
    return () => {
      if (animationRef.current !== undefined) cancelAnimationFrame(animationRef.current)
    }
  }, [animate, orchestrator])

  const handleCanvasClick = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!interactive || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top
      const centerX = width / 2
      const centerY = height / 2
      let nearestNode: NodeState | null = null
      let minDistance = Infinity

      meshNodes.forEach((nodeState) => {
        const { x, y } = getNodePosition(nodeState.address, centerX, centerY)
        const distance = Math.sqrt((x - clickX) ** 2 + (y - clickY) ** 2)

        if (distance < minDistance && distance < 10) {
          minDistance = distance
          nearestNode = nodeState
        }
      })

      setSelectedNode(nearestNode)
    },
    [height, interactive, meshNodes, width]
  )

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        className="border border-amber-500 rounded-lg cursor-crosshair bg-slate-950 block"
      />

      {selectedNode && (
        <div className="bg-slate-900 border border-amber-500 rounded-lg p-4 text-amber-100 font-mono text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>Mesh: {selectedNode.address.mesh}</div>
            <div>Layer: {selectedNode.address.layer}</div>
            <div>Center: {selectedNode.address.center}</div>
            <div>Node: {selectedNode.address.node}</div>
            <div>Line: {selectedNode.address.line}</div>
            <div>State: {selectedNode.baseState}</div>
            <div>Tension: {(selectedNode.tension * 100).toFixed(1)}%</div>
            <div>Coherence: {(selectedNode.coherence * 100).toFixed(1)}%</div>
            <div>Zodiac: {selectedNode.address.zodiac}</div>
            <div>House: {selectedNode.address.house}</div>
            <div>Arc Degree: {selectedNode.address.arcDegree.toFixed(1)}°</div>
            <div>Color: {selectedNode.address.color}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 text-amber-100 font-mono text-xs">
        <div className="bg-slate-900 border border-amber-500 rounded p-2">
          <div className="text-amber-400">Autonomy</div>
          <div className="text-lg">{autonomous ? 'ON' : 'OFF'}</div>
        </div>
        <div className="bg-slate-900 border border-amber-500 rounded p-2">
          <div className="text-amber-400">Coherence</div>
          <div className="text-lg">{(coherence * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-slate-900 border border-amber-500 rounded p-2">
          <div className="text-amber-400">Morph</div>
          <div className="text-lg">{(morphState * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-slate-900 border border-amber-500 rounded p-2">
          <div className="text-amber-400">Nodes</div>
          <div className="text-lg">{meshNodes.length}</div>
        </div>
      </div>
    </div>
  )
}

export default NeuralMeshVisualizer
