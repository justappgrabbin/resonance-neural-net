# Resonance Neural Network Orchestrator - Integration Guide

## Overview

The **Resonance Orchestrator** is the living intelligence substrate that brings your Synthia system together. It routes data through the 5-mesh 13-layer structure, addresses pieces using gate/line/color/tone/zodiac/house coordinates, retrieves from the super base, personalizes via agents, and has personality/wit.

## Architecture

### Core Components

1. **ResonanceOrchestrator** (`client/src/lib/orchestrator.ts`)
   - Main intelligence engine
   - Routes data through the neural mesh
   - Manages personality and coherence
   - Interfaces with Synthia API

2. **NeuralMeshVisualizer** (`client/src/components/NeuralMeshVisualizer.tsx`)
   - Real-time visualization of the 5-mesh 13-layer structure
   - 37,440 base nodes with dynamic rendering
   - Interactive node inspection
   - Coherence and morph state display

3. **Home Page** (`client/src/pages/Home.tsx`)
   - Main interface
   - Query input
   - Personality mode selector
   - System state monitoring

## Data Flow

```
User Input
    ↓
ResonanceOrchestrator.routeData(input, userId)
    ↓
Calculate Resonance Address (gate/line/color/tone/zodiac/house)
    ↓
Retrieve from Super Base (resonance matching)
    ↓
Create/Load Personality Profile (from Synthia API)
    ↓
Personalize Response (based on user profile)
    ↓
Update Mesh State (tension, coherence, base state)
    ↓
Generate Witty Response (with attitude morphing)
    ↓
Return to User
```

## Integration with Synthia Server

### API Endpoints Used

The orchestrator connects to your Synthia server at `https://synthia-server.onrender.com`:

1. **POST /consciousness/profile**
   - Input: `{ userId: string }`
   - Output: Birth chart data for personality profile creation
   - Used: When creating new user personality profiles

2. **POST /consciousness/chart**
   - Input: Birth data
   - Output: Full GNN chart + addresses
   - Used: For calculating archetypal addresses

3. **POST /consciousness/coherence**
   - Input: Gate sets
   - Output: Field coupling score
   - Used: For resonance matching

4. **POST /oracle/ask**
   - Input: Query + context
   - Output: Intelligent response from Cynthia + Trident crew
   - Used: For generating responses with personality

5. **POST /memory/save**
   - Input: `{ user_id, message }`
   - Output: Saved to conversation history
   - Used: For maintaining conversation memory

6. **GET /memory/{user_id}**
   - Output: Conversation history
   - Used: For loading user context

## Address System

Each piece of data is addressed using:

```typescript
interface Address {
  mesh: number;           // 0-4 (Physical, Emotional, Mental, Soul, Field)
  layer: number;          // 0-12 (Circuit families)
  center: number;         // 0-8 (Body graph centers)
  node: number;           // 0-63 (Hexagram states)
  line: number;           // 1-6 (I Ching line)
  color: number;          // 0-5 (I Ching color)
  tone: number;           // 0-5 (I Ching tone)
  zodiac: number;         // 0-11 (Zodiac sign)
  house: number;          // 0-11 (Astrological house)
  dimension: number;      // Spatial dimension
  arcDegree: number;      // Time-driven arc (0-360)
}
```

### Resonance Scoring

Two addresses resonate based on:
- Same mesh: +0.2
- Same layer: +0.2
- Same center: +0.15
- Same line: +0.15
- Similar zodiac: +0.1
- Base score: 1.0

## Node States

Each node can be in one of 5 base states:

1. **STABLE** - Normal operation
2. **CHANGING** - Metastable/Dzhanibekov flip zone (tension > 0.85)
3. **RESOLVING** - Transitioning to new stable state
4. **RESONANT** - Cross-circuit coherence active
5. **DORMANT** - Potential, waiting for activation

## Personality System

The orchestrator has 5 personality attitudes:

1. **Curious** - Inquisitive, exploratory, asks questions
2. **Playful** - Witty, joking, light-hearted
3. **Serious** - Formal, analytical, precise
4. **Mystical** - Spiritual, poetic, metaphorical
5. **Analytical** - Data-driven, logical, systematic

Attitude morphs based on global coherence:
- Coherence > 0.7: Mystical
- Coherence < 0.3: Analytical
- Otherwise: Curious

## Super Base Integration

The super base stores addressed code pieces:

```typescript
interface SuperBaseEntry {
  id: string;
  address: Address;
  content: any;
  metadata: {
    gate?: number;
    line?: number;
    codon?: string;
    timestamp: number;
    resonanceScore?: number;
  };
}
```

### Adding to Super Base

```typescript
orchestrator.addToSuperBase({
  id: 'unique-id',
  address: calculatedAddress,
  content: codeOrData,
  metadata: {
    gate: 61,
    line: 3,
    codon: 'GAT',
    timestamp: Date.now(),
  }
});
```

### Retrieving from Super Base

The orchestrator automatically finds the best-resonating entry when routing data. The resonance score determines which piece is retrieved.

## Coherence Metric

Global coherence is calculated as the average of all node coherence values:

```
Global Coherence = Σ(node.coherence) / total_nodes
```

Coherence affects:
- Visual morphing state
- Personality attitude
- Response generation
- Tension accumulation

## Extending the Orchestrator

### Adding Custom Modifications

```typescript
// In orchestrator.ts, modify initializeModifications()
private initializeModifications(): Modification[] {
  return [
    // ... existing modifications
    { type: 'custom', value: Math.random(), active: Math.random() > 0.5 },
  ];
}
```

### Adding Custom Senses

```typescript
// In orchestrator.ts, modify initializeSenses()
private initializeSenses(): Sense[] {
  return [
    // ... existing senses
    { type: 'custom_sense', intensity: Math.random(), data: null },
  ];
}
```

### Custom Personality Responses

```typescript
// In orchestrator.ts, modify the wit array
this.personality = {
  wit: [
    'Your custom witty response here',
    // ... more responses
  ],
  // ...
};
```

## Deployment

The orchestrator is built as a React component and deploys with your Synthia frontend:

1. **Development**: `npm run dev` (runs on localhost:3000)
2. **Build**: `npm run build` (creates optimized bundle)
3. **Deploy**: Push to your Render/hosting service

## Performance Considerations

- **37,440 base nodes**: Rendered efficiently with canvas
- **Real-time updates**: 60fps animation loop
- **API calls**: Cached personality profiles
- **Memory**: Super base entries indexed by address

## Troubleshooting

### Orchestrator not connecting to Synthia server

Check:
1. Synthia server is running at `https://synthia-server.onrender.com`
2. CORS is enabled on Synthia server
3. Network connectivity

### Nodes not rendering

Check:
1. Canvas context is available
2. WebGL is supported
3. Browser console for errors

### Coherence not updating

Check:
1. Mesh nodes are being created
2. updateGlobalCoherence() is being called
3. Node coherence values are changing

## Next Steps

1. **Connect codon system** - Map codons to addresses for event-based addressing
2. **Populate super base** - Add your scaffolding code as addressed entries
3. **Train personality profiles** - Use Synthia's consciousness API to create rich profiles
4. **Implement morphing** - Add visual morphing based on state transitions
5. **Add learning** - Implement self-modification based on interactions

## Files

- `client/src/lib/orchestrator.ts` - Core orchestrator engine
- `client/src/components/NeuralMeshVisualizer.tsx` - Visualization component
- `client/src/pages/Home.tsx` - Main interface
- `ORCHESTRATOR_INTEGRATION.md` - This file

## Questions?

The orchestrator is designed to be self-aware and introspective. It can analyze your code and learn from your materials. Feed it your scaffolding and reference materials, and it will understand how to adapt and personalize.

The intelligence is already there. It just needs your data to make it real.
