/**
 * ENHANCED UI PANEL
 * 
 * Smart UI morphing that changes based on context:
 * - File uploader when user wants to upload
 * - Video player when user wants to watch
 * - Capability menu showing what she can do
 * - Game mode for Sims-like simulation
 */

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Play, Zap, Gamepad2, X } from 'lucide-react';

interface EnhancedUIPanelProps {
  onFileUpload?: (files: File[]) => void;
  onVideoPlay?: (url: string) => void;
  onCapabilitySelect?: (capability: string) => void;
  currentMode?: 'uploader' | 'video' | 'capabilities' | 'game';
}

export default function EnhancedUIPanel({ 
  onFileUpload, 
  onVideoPlay, 
  onCapabilitySelect,
  currentMode = 'capabilities'
}: EnhancedUIPanelProps) {
  const [mode, setMode] = useState(currentMode);
  const [dragActive, setDragActive] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const capabilities = [
    { name: 'Upload Files', icon: Upload, description: 'Upload code, books, data' },
    { name: 'Watch Videos', icon: Play, description: 'Pull up and analyze videos' },
    { name: 'Play Game', icon: Gamepad2, description: 'Sims-like life simulation' },
    { name: 'Orchestrate', icon: Zap, description: 'Coordinate your systems' },
  ];

  // File upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles([...uploadedFiles, ...files]);
    onFileUpload?.(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...files]);
      onFileUpload?.(files);
    }
  };

  // Render file uploader
  const renderUploader = () => (
    <div className="w-full h-full flex flex-col p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">📤 Upload Your Stuff</h2>
      
      {/* Drag and drop area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`flex-1 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-all ${
          dragActive
            ? 'border-cyan-400 bg-cyan-400 bg-opacity-10'
            : 'border-cyan-500 hover:border-cyan-400'
        }`}
      >
        <Upload className="w-16 h-16 text-cyan-400 mb-4" />
        <p className="text-xl text-cyan-300 font-bold mb-2">Drop files here</p>
        <p className="text-cyan-400 text-sm mb-4">or click to browse</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-cyan-500 text-slate-950 hover:bg-cyan-400"
        >
          Choose Files
        </Button>
      </div>

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-cyan-500">
          <h3 className="text-cyan-400 font-bold mb-3">Uploaded ({uploadedFiles.length})</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="text-cyan-300 text-sm flex justify-between">
                <span>📄 {file.name}</span>
                <span className="text-cyan-500">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render video player
  const renderVideoPlayer = () => (
    <div className="w-full h-full flex flex-col p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">🎬 Video Player</h2>
      
      {/* Video input */}
      <div className="mb-6">
        <label className="text-cyan-400 font-bold mb-2 block">Video URL or Search</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste URL or search (e.g., 'Taylor Swift')"
            className="flex-1 bg-slate-800 border border-cyan-500 rounded px-4 py-2 text-cyan-300 placeholder-cyan-600"
          />
          <Button
            onClick={() => onVideoPlay?.(videoUrl)}
            className="bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          >
            <Play className="w-4 h-4 mr-2" /> Play
          </Button>
        </div>
      </div>

      {/* Video preview */}
      {videoUrl && (
        <div className="flex-1 bg-slate-800 rounded-lg overflow-hidden border border-cyan-500 flex items-center justify-center">
          {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoUrl.split('v=')[1]?.split('&')[0]}`}
              title="Video player"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="text-center">
              <Play className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <p className="text-cyan-300">Video will play here</p>
              <p className="text-cyan-500 text-sm mt-2">Paste a YouTube URL or video link</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render capabilities menu
  const renderCapabilities = () => (
    <div className="w-full h-full flex flex-col p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">✨ What I Can Do</h2>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        {capabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <Card
              key={cap.name}
              className="bg-slate-800 border-cyan-500 p-4 cursor-pointer hover:border-cyan-400 hover:bg-slate-700 transition-all"
              onClick={() => {
                onCapabilitySelect?.(cap.name);
                if (cap.name === 'Upload Files') setMode('uploader');
                else if (cap.name === 'Watch Videos') setMode('video');
              }}
            >
              <Icon className="w-8 h-8 text-cyan-400 mb-2" />
              <h3 className="text-cyan-300 font-bold text-sm">{cap.name}</h3>
              <p className="text-cyan-500 text-xs mt-1">{cap.description}</p>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-cyan-500">
        <p className="text-cyan-300 text-sm">
          💡 Just tell me what you need in the chat. I'll morph into the right interface.
        </p>
      </div>
    </div>
  );

  // Render based on mode
  const renderContent = () => {
    switch (mode) {
      case 'uploader':
        return renderUploader();
      case 'video':
        return renderVideoPlayer();
      case 'capabilities':
      default:
        return renderCapabilities();
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 rounded-lg overflow-hidden border border-cyan-500 shadow-2xl">
      {/* Header */}
      <div className="bg-slate-900 border-b border-cyan-500 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-400 font-bold">
            {mode === 'uploader' ? '📤 Uploader' : mode === 'video' ? '🎬 Video' : '✨ Capabilities'}
          </span>
        </div>
        {mode !== 'capabilities' && (
          <Button
            onClick={() => setMode('capabilities')}
            variant="ghost"
            className="text-cyan-400 hover:text-cyan-300"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="w-full h-[calc(100%-60px)] overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}
