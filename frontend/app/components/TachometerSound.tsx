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
    <div className="relative rounded-2xl border border-white/[0.08] bg-zinc-950 p-6 md:p-8 overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-black text-white">
            <Gauge className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                CP3 TACHOMÈTRE & LABO ACOUSTIQUE
              </h3>
              <span className="rounded border border-white/[0.08] bg-black px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                890 CM³
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">
              Synthèse acoustique en temps réel du vilebrequin calé à 120°
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Selector */}
          <div className="flex items-center rounded-lg bg-black border border-white/[0.08] p-1 font-mono text-[11px]">
            {(['A', 'STD', 'B'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setEngineMode(m)}
                className={`px-2.5 py-1 rounded transition-all font-semibold cursor-pointer ${
                  engineMode === m
                    ? 'bg-white text-black'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                MODE {m}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-[11px] font-medium transition-all cursor-pointer ${
              audioEnabled
                ? 'bg-white text-black border-white'
                : 'bg-black border-white/[0.08] text-zinc-400 hover:text-white'
            }`}
          >
            {audioEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>{audioEnabled ? 'SON ACTIF' : 'ACTIVER SON'}</span>
          </button>
        </div>
      </div>

      {/* Main Tachometer Gauge Body */}
      <div className="my-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Digital Readout */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-2">
          <div className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${isRedline ? 'bg-red-500 animate-ping' : 'bg-white'}`} />
            RÉGIME MOTEUR EN DIRECT
          </div>
          <div className="font-mono text-6xl md:text-7xl font-black tracking-tight text-white flex items-baseline gap-2">
            <span>{Math.round(rpm).toLocaleString()}</span>
            <span className="text-xs font-normal text-zinc-500">TR/MIN</span>
          </div>

          <div className="pt-2 flex items-center gap-4 text-xs font-mono text-zinc-500">
            <div>
              <span>CALAGE : </span>
              <span className="text-zinc-300">120° CP3</span>
            </div>
            <div>
              <span>RUPTEUR : </span>
              <span className="text-zinc-300">11 500 RPM</span>
            </div>
          </div>
        </div>

        {/* Shift Lights and Gauge Bar */}
        <div className="md:col-span-7 space-y-4">
          {/* Shift Light Array */}
          <div className="flex gap-1 justify-between">
            {Array.from({length: 16}).map((_, i) => {
              const active = i / 16 <= rpmRatio
              const isZoneRed = i >= 13
              const isZoneYellow = i >= 9 && i < 13

              return (
                <div
                  key={i}
                  className={`h-3 flex-1 rounded-[1px] transition-all duration-75 ${
                    active
                      ? isZoneRed
                        ? 'bg-red-500'
                        : isZoneYellow
                          ? 'bg-white'
                          : 'bg-zinc-300'
                      : 'bg-zinc-900 border border-white/[0.04]'
                  }`}
                />
              )
            })}
          </div>

          {/* RPM Bar Progress */}
          <div className="relative h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/[0.08]">
            <motion.div
              className={`h-full ${
                isRedline
                  ? 'bg-red-500'
                  : 'bg-white'
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
            <span>10K</span>
            <span className="text-red-400">11.5K RUPTEUR</span>
          </div>
        </div>
      </div>

      {/* Throttle Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
        <p className="text-xs text-zinc-400 font-mono">
          Maintenez le bouton ou cliquez pour simuler la montée en régime de l&apos;échappement.
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
            className={`cursor-pointer w-full sm:w-auto select-none rounded-lg px-8 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
              isRevving
                ? 'bg-red-500 text-white'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>{isRevving ? 'POIGNÉE EN COIN !' : 'MAINTENIR POUR ACCÉLÉRER'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
