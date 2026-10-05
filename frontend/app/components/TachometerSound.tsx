'use client'

import {useEffect, useRef, useState} from 'react'
import {motion} from 'framer-motion'
import {Volume2, VolumeX, Gauge, Zap} from 'lucide-react'

export default function TachometerSound() {
  const [rpm, setRpm] = useState(1300) // 1300 idle RPM
  const [isRevving, setIsRevving] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [engineMode, setEngineMode] = useState<'A' | 'STD' | 'B'>('A') // D-Mode

  const audioCtxRef = useRef<AudioContext | null>(null)
  const osc1Ref = useRef<OscillatorNode | null>(null)
  const osc2Ref = useRef<OscillatorNode | null>(null)
  const osc3Ref = useRef<OscillatorNode | null>(null)
  const filterRef = useRef<BiquadFilterNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const targetRpmRef = useRef(1300)

  // Initialize Web Audio Engine
  const initAudio = () => {
    if (audioCtxRef.current) return
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext
      const ctx = new AudioContextClass()
      audioCtxRef.current = ctx

      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(0.12, ctx.currentTime)
      masterGain.connect(ctx.destination)
      gainRef.current = masterGain

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(250, ctx.currentTime)
      filter.Q.setValueAtTime(3.5, ctx.currentTime)
      filter.connect(masterGain)
      filterRef.current = filter

      // 3 cylinders Crossplane CP3 (120° offset simulation with detuned sawtooth/triangle oscillators)
      const osc1 = ctx.createOscillator()
      osc1.type = 'sawtooth'
      osc1.frequency.setValueAtTime(45, ctx.currentTime)
      osc1.connect(filter)
      osc1.start()
      osc1Ref.current = osc1

      const osc2 = ctx.createOscillator()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(45.5, ctx.currentTime)
      osc2.connect(filter)
      osc2.start()
      osc2Ref.current = osc2

      const osc3 = ctx.createOscillator()
      osc3.type = 'sawtooth'
      osc3.frequency.setValueAtTime(90, ctx.currentTime)
      const osc3Gain = ctx.createGain()
      osc3Gain.gain.setValueAtTime(0.3, ctx.currentTime)
      osc3.connect(osc3Gain)
      osc3Gain.connect(filter)
      osc3.start()
      osc3Ref.current = osc3

      setAudioEnabled(true)
    } catch {
      // AudioContext fallback
    }
  }

  // Toggle Sound On/Off
  const toggleSound = () => {
    if (!audioCtxRef.current) {
      initAudio()
      setAudioEnabled(true)
    } else {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
        setAudioEnabled(true)
      } else if (audioEnabled) {
        audioCtxRef.current.suspend()
        setAudioEnabled(false)
      } else {
        audioCtxRef.current.resume()
        setAudioEnabled(true)
      }
    }
  }

  // Handle Rev Physics & Audio pitch update
  useEffect(() => {
    targetRpmRef.current = isRevving ? (engineMode === 'A' ? 10900 : 9800) : 1300

    let lastTime = performance.now()
    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000
      lastTime = time

      setRpm((currentRpm) => {
        const target = targetRpmRef.current
        const speed = isRevving ? 14 : 7 // revs up fast, drops naturally
        const newRpm = currentRpm + (target - currentRpm) * Math.min(dt * speed, 1)

        // Update audio frequencies
        if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
          const fundamental = 30 + (newRpm / 11500) * 160
          const cutoff = 180 + (newRpm / 11500) * 2600

          osc1Ref.current?.frequency.setTargetAtTime(fundamental, audioCtxRef.current.currentTime, 0.05)
          osc2Ref.current?.frequency.setTargetAtTime(fundamental * 1.01, audioCtxRef.current.currentTime, 0.05)
          osc3Ref.current?.frequency.setTargetAtTime(fundamental * 2, audioCtxRef.current.currentTime, 0.05)
          filterRef.current?.frequency.setTargetAtTime(cutoff, audioCtxRef.current.currentTime, 0.05)
        }

        return newRpm
      })

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isRevving, engineMode])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
    }
  }, [])

  // Shift light calculation (0 to 1)
  const rpmRatio = Math.max(0, Math.min(1, (rpm - 1300) / (11500 - 1300)))
  const isRedline = rpm >= 10200

  return (
    <div className="relative rounded-2xl border border-white/10 bg-zinc-950/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Background aesthetic grid & glow */}
      <div className="absolute -right-24 -top-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-sm uppercase tracking-wider text-white font-bold">
                CP3 TACHOMETER & ACOUSTIC LAB
              </h3>
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-mono text-amber-300 font-semibold">
                890 CM³
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Banc d&apos;essai acoustique du 3-cylindres Crossplane
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Selector */}
          <div className="flex items-center rounded-lg bg-zinc-900 border border-white/10 p-1 font-mono text-xs">
            {(['A', 'STD', 'B'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setEngineMode(m)}
                className={`px-2.5 py-1 rounded transition-all font-semibold ${
                  engineMode === m
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                MODE {m}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              audioEnabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>{audioEnabled ? 'SON ACTIF' : 'ACTIVER SON'}</span>
          </button>
        </div>
      </div>

      {/* Main Tachometer Gauge Body */}
      <div className="my-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Digital Readout */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-2">
          <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${isRedline ? 'bg-red-500 animate-ping' : 'bg-amber-400'}`} />
            RÉGIME MOTEUR EN DIRECT
          </div>
          <div className="font-mono text-6xl md:text-7xl font-black tracking-tight text-white flex items-baseline gap-2">
            <span>{Math.round(rpm).toLocaleString()}</span>
            <span className="text-sm md:text-base font-normal text-amber-400">TR/MIN</span>
          </div>

          <div className="pt-2 flex items-center gap-4 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-zinc-500">CALAGE : </span>
              <span className="text-zinc-200">120° CROSSPLANE</span>
            </div>
            <div>
              <span className="text-zinc-500">MAX : </span>
              <span className="text-red-400">11 500 RPM</span>
            </div>
          </div>
        </div>

        {/* Shift Lights and Gauge Bar */}
        <div className="md:col-span-7 space-y-4">
          {/* Shift Light Array (F1/MotoGP Style) */}
          <div className="flex gap-1.5 justify-between">
            {Array.from({length: 16}).map((_, i) => {
              const active = i / 16 <= rpmRatio
              const isZoneRed = i >= 13
              const isZoneYellow = i >= 9 && i < 13
              const isZoneGreen = i < 9

              return (
                <div
                  key={i}
                  className={`h-4 flex-1 rounded-sm transition-all duration-75 ${
                    active
                      ? isZoneRed
                        ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse'
                        : isZoneYellow
                          ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                          : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                      : 'bg-zinc-800/80 border border-white/5'
                  }`}
                />
              )
            })}
          </div>

          {/* RPM Bar Progress */}
          <div className="relative h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/10">
            <motion.div
              className={`h-full ${
                isRedline
                  ? 'bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500'
                  : 'bg-gradient-to-r from-emerald-500 to-amber-400'
              }`}
              style={{width: `${Math.min(100, rpmRatio * 100)}%`}}
              transition={{duration: 0.05}}
            />
          </div>

          <div className="flex justify-between font-mono text-[10px] text-zinc-500">
            <span>0</span>
            <span>2K</span>
            <span>4K</span>
            <span>6K</span>
            <span>8K</span>
            <span className="text-amber-400">10K</span>
            <span className="text-red-500 font-bold">11.5K (RUPTEUR)</span>
          </div>
        </div>
      </div>

      {/* Throttle Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <p className="text-xs text-zinc-400 font-mono">
          Maintiens le bouton ou clique pour faire rugir la ligne d&apos;échappement.
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onMouseDown={() => {
              if (!audioEnabled) initAudio()
              setIsRevving(true)
            }}
            onMouseUp={() => setIsRevving(false)}
            onMouseLeave={() => setIsRevving(false)}
            onTouchStart={() => {
              if (!audioEnabled) initAudio()
              setIsRevving(true)
            }}
            onTouchEnd={() => setIsRevving(false)}
            className={`cursor-pointer w-full sm:w-auto select-none rounded-xl px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
              isRevving
                ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] scale-102'
                : 'bg-amber-400 text-black hover:bg-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
            }`}
          >
            <Zap className={`h-4 w-4 ${isRevving ? 'animate-bounce' : ''}`} />
            <span>{isRevving ? 'POIGNÉE DANS LE COIN !' : 'MAINTENIR POUR ACCÉLÉRER'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
