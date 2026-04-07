/**
 * SIMS-LIKE GAME
 * 
 * Life simulation game where your character lives in a world,
 * makes choices, learns, and interacts with other characters.
 * Based on your design (gate/line/color/tone).
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Brain, Zap, Home, Users, TrendingUp } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  gate: number;
  line: number;
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'tired';
  energy: number;
  happiness: number;
  skills: { [key: string]: number };
  location: 'home' | 'work' | 'park' | 'cafe' | 'library';
  age: number;
  relationships: { [key: string]: number };
}

interface GameState {
  character: Character;
  time: number; // 0-24 hours
  day: number;
  money: number;
  events: string[];
}

export default function SimsGame() {
  const [gameState, setGameState] = useState<GameState>({
    character: {
      id: 'player-' + Math.random().toString(36).substr(2, 9),
      name: 'You',
      gate: Math.floor(Math.random() * 64) + 1,
      line: Math.floor(Math.random() * 6) + 1,
      mood: 'neutral',
      energy: 80,
      happiness: 70,
      skills: { creativity: 50, logic: 50, empathy: 50, courage: 50 },
      location: 'home',
      age: 25,
      relationships: {},
    },
    time: 8,
    day: 1,
    money: 1000,
    events: ['Game started!'],
  });

  const [showCharacterCreation, setShowCharacterCreation] = useState(true);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // Game loop - update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const newState = { ...prev };
        
        // Time progression
        newState.time += 0.5;
        if (newState.time >= 24) {
          newState.time = 0;
          newState.day += 1;
        }

        // Energy and happiness decay
        newState.character.energy = Math.max(0, newState.character.energy - 0.1);
        newState.character.happiness = Math.max(0, newState.character.happiness - 0.05);

        // Mood based on stats
        if (newState.character.energy < 20) {
          newState.character.mood = 'tired';
        } else if (newState.character.happiness > 80) {
          newState.character.mood = 'excited';
        } else if (newState.character.happiness < 30) {
          newState.character.mood = 'sad';
        } else {
          newState.character.mood = 'neutral';
        }

        return newState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const performAction = (action: string) => {
    setGameState((prev) => {
      const newState = { ...prev };
      const char = newState.character;

      switch (action) {
        case 'sleep':
          newState.character.energy = Math.min(100, char.energy + 50);
          newState.time = 8;
          newState.events.push('You slept well!');
          break;
        case 'work':
          newState.character.energy = Math.max(0, char.energy - 30);
          newState.character.happiness = Math.max(0, char.happiness - 10);
          newState.money += 100;
          newState.character.skills.logic = Math.min(100, char.skills.logic + 2);
          newState.events.push('You worked hard and earned $100');
          break;
        case 'create':
          newState.character.energy = Math.max(0, char.energy - 20);
          newState.character.happiness = Math.min(100, char.happiness + 20);
          newState.character.skills.creativity = Math.min(100, char.skills.creativity + 3);
          newState.events.push('You created something beautiful!');
          break;
        case 'socialize':
          newState.character.energy = Math.max(0, char.energy - 15);
          newState.character.happiness = Math.min(100, char.happiness + 30);
          newState.character.skills.empathy = Math.min(100, char.skills.empathy + 2);
          newState.events.push('You made new friends!');
          break;
        case 'learn':
          newState.character.energy = Math.max(0, char.energy - 25);
          newState.character.happiness = Math.min(100, char.happiness + 10);
          newState.character.skills.logic = Math.min(100, char.skills.logic + 3);
          newState.events.push('You learned something new!');
          break;
        case 'relax':
          newState.character.energy = Math.min(100, char.energy + 30);
          newState.character.happiness = Math.min(100, char.happiness + 15);
          newState.events.push('You relaxed and felt better');
          break;
      }

      return newState;
    });
    setSelectedAction(null);
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😢';
      case 'excited':
        return '🤩';
      case 'tired':
        return '😴';
      default:
        return '😐';
    }
  };

  const getLocationEmoji = (location: string) => {
    switch (location) {
      case 'home':
        return '🏠';
      case 'work':
        return '💼';
      case 'park':
        return '🌳';
      case 'cafe':
        return '☕';
      case 'library':
        return '📚';
      default:
        return '📍';
    }
  };

  if (showCharacterCreation) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">🎮 Resonance Life Sim</h1>
        <p className="text-cyan-300 text-center mb-8 max-w-md">
          Create a character based on your design and live a life in the resonance network.
          Make choices, learn, grow, and connect with others.
        </p>

        <Card className="bg-slate-800 border-cyan-500 p-8 max-w-md w-full">
          <div className="space-y-4">
            <div>
              <label className="text-cyan-400 font-bold block mb-2">Your Name</label>
              <input
                type="text"
                defaultValue="You"
                className="w-full bg-slate-700 border border-cyan-500 rounded px-4 py-2 text-cyan-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-cyan-400 font-bold block mb-2">Gate (1-64)</label>
                <input
                  type="number"
                  min="1"
                  max="64"
                  defaultValue={gameState.character.gate}
                  className="w-full bg-slate-700 border border-cyan-500 rounded px-4 py-2 text-cyan-300"
                />
              </div>
              <div>
                <label className="text-cyan-400 font-bold block mb-2">Line (1-6)</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  defaultValue={gameState.character.line}
                  className="w-full bg-slate-700 border border-cyan-500 rounded px-4 py-2 text-cyan-300"
                />
              </div>
            </div>

            <Button
              onClick={() => setShowCharacterCreation(false)}
              className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold"
            >
              Start Game
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const char = gameState.character;
  const timeOfDay = gameState.time < 12 ? 'Morning' : gameState.time < 18 ? 'Afternoon' : 'Evening';

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 p-6 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-cyan-400">
            {getMoodEmoji(char.mood)} {char.name}
          </h2>
          <p className="text-cyan-500">
            Day {gameState.day} • {timeOfDay} ({gameState.time.toFixed(1)}:00) • Gate {char.gate} Line {char.line}
          </p>
        </div>
        <div className="text-right">
          <p className="text-cyan-400 font-bold text-xl">${gameState.money}</p>
          <p className="text-cyan-500">Age {char.age}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-slate-800 border-cyan-500 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-cyan-400 font-bold">Energy</span>
          </div>
          <div className="w-full bg-slate-700 rounded h-3">
            <div
              className="bg-red-500 h-3 rounded transition-all"
              style={{ width: `${char.energy}%` }}
            />
          </div>
          <p className="text-cyan-500 text-sm mt-1">{char.energy.toFixed(0)}%</p>
        </Card>

        <Card className="bg-slate-800 border-cyan-500 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-cyan-400 font-bold">Happiness</span>
          </div>
          <div className="w-full bg-slate-700 rounded h-3">
            <div
              className="bg-yellow-500 h-3 rounded transition-all"
              style={{ width: `${char.happiness}%` }}
            />
          </div>
          <p className="text-cyan-500 text-sm mt-1">{char.happiness.toFixed(0)}%</p>
        </Card>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5" /> Skills
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(char.skills).map(([skill, level]) => (
            <div key={skill} className="bg-slate-800 border border-cyan-500 rounded p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-cyan-300 text-sm capitalize font-bold">{skill}</span>
                <span className="text-cyan-500 text-xs">{level.toFixed(0)}</span>
              </div>
              <div className="w-full bg-slate-700 rounded h-2">
                <div
                  className="bg-cyan-500 h-2 rounded transition-all"
                  style={{ width: `${level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6">
        <h3 className="text-cyan-400 font-bold mb-3">What do you want to do?</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'sleep', label: '😴 Sleep', icon: '🛏️' },
            { id: 'work', label: '💼 Work', icon: '💰' },
            { id: 'create', label: '🎨 Create', icon: '✨' },
            { id: 'socialize', label: '👥 Socialize', icon: '💬' },
            { id: 'learn', label: '📚 Learn', icon: '🧠' },
            { id: 'relax', label: '🧘 Relax', icon: '☮️' },
          ].map((action) => (
            <Button
              key={action.id}
              onClick={() => performAction(action.id)}
              className={`flex flex-col items-center gap-1 py-4 ${
                selectedAction === action.id
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-cyan-400 border border-cyan-500 hover:border-cyan-400'
              }`}
            >
              <span className="text-xl">{action.icon}</span>
              <span className="text-xs font-bold">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Events */}
      <div>
        <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Recent Events
        </h3>
        <div className="bg-slate-800 border border-cyan-500 rounded p-4 max-h-32 overflow-y-auto">
          {gameState.events.slice(-5).map((event, idx) => (
            <p key={idx} className="text-cyan-300 text-sm mb-2">
              ✓ {event}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
