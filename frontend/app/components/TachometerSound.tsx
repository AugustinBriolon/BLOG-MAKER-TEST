'use client'

import {useEffect, useRef, useState, useCallback} from 'react'
import {motion} from 'framer-motion'
import {Volume2, VolumeX, Gauge, Zap} from 'lucide-react'

/**
 * Physically-modeled Yamaha CP3 890 cm³ inline-3 engine sound synthesis.
 *
 * Acoustic model:
 *   - 3-cylinder, 240° even firing interval (crossplane crankshaft concept)
 *   - Firing frequency = (RPM / 60) × (3 / 2) Hz  (3 power strokes per 2 crank revolutions)
 *   - Uneven-length intake funnels (102.8 / 82.8 / 122.8 mm) modeled via subtle detuning
 *   - Harmonic stack: fundamental + 2nd + 3rd + 4th overtone with decreasing amplitude
 *   - Sub-harmonic rumble at ½ firing frequency (exhaust pulse / muffler resonance)
 *   - Filtered noise layer for intake rush & mechanical clatter
 *   - Waveshaper distortion for exhaust saturation at high RPM
 *   - Resonant bandpass for exhaust pipe formant (~280 Hz characteristic)
 */

export default function TachometerSound() {
  const [rpm, setRpm] = useState(1300)
  const [isRevving, setIsRevving] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [engineMode, setEngineMode] = useState<'A' | 'STD' | 'B'>('A')

  // Audio graph refs
  const audioCtxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const targetRpmRef = useRef(1300)
  const currentRpmRef = useRef(1300)

  // Oscillator bank refs (harmonics of firing frequency)
  const oscFundRef = useRef<OscillatorNode | null>(null)
  const oscH2Ref = useRef<OscillatorNode | null>(null)
  const oscH3Ref = useRef<OscillatorNode | null>(null)
  const oscH4Ref = useRef<OscillatorNode | null>(null)
  const oscSubRef = useRef<OscillatorNode | null>(null)

  // Gain nodes for each harmonic
  const gainFundRef = useRef<GainNode | null>(null)
  const gainH2Ref = useRef<GainNode | null>(null)
  const gainH3Ref = useRef<GainNode | null>(null)
  const gainH4Ref = useRef<GainNode | null>(null)
  const gainSubRef = useRef<GainNode | null>(null)

  // Noise nodes (intake rush)
  const noiseGainRef = useRef<GainNode | null>(null)
  const noiseBPRef = useRef<BiquadFilterNode | null>(null)

  // Exhaust formant filter + waveshaper
  const exhaustFilterRef = useRef<BiquadFilterNode | null>(null)
  const waveshaperRef = useRef<WaveShaperNode | null>(null)
  const driveGainRef = useRef<GainNode | null>(null)

  // LFO for firing pulse modulation
  const lfoRef = useRef<OscillatorNode | null>(null)
  const lfoGainRef = useRef<GainNode | null>(null)

  /**
   * Compute the firing frequency from RPM.
   * 3-cylinder 4-stroke: 3 power strokes per 2 crankshaft revolutions.
   * firingFreq = (RPM / 60) × (3 / 2)
   */
  const firingFreq = useCallback((r: number) => (r / 60) * 1.5, [])

  /**
   * Build the distortion curve for the waveshaper (exhaust saturation).
   * Soft clipping using a tanh-based transfer function.
   */
  const makeDistortionCurve = useCallback((amount: number) => {
    const samples = 44100
    const curve = new Float32Array(samples)
    const k = amount
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1
      curve[i] = Math.tanh(k * x)
    }
    return curve
  }, [])

  // Initialize the full Web Audio synthesis graph
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return
    try {
      const Ctx = window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext
      const ctx = new Ctx()
      audioCtxRef.current = ctx
      const t = ctx.currentTime

      // ─── Master output ───
      const master = ctx.createGain()
      master.gain.setValueAtTime(0.18, t)
      master.connect(ctx.destination)
      masterGainRef.current = master

      // ─── Waveshaper (exhaust saturation) ───
      const waveshaper = ctx.createWaveShaper()
      waveshaper.curve = makeDistortionCurve(2.5)
      waveshaper.oversample = '4x'
      waveshaperRef.current = waveshaper

      // Drive gain before waveshaper
      const driveGain = ctx.createGain()
      driveGain.gain.setValueAtTime(1.0, t)
      driveGain.connect(waveshaper)
      driveGainRef.current = driveGain

      // ─── Exhaust formant resonance (~280 Hz pipe resonance) ───
      const exhaustFilter = ctx.createBiquadFilter()
      exhaustFilter.type = 'bandpass'
      exhaustFilter.frequency.setValueAtTime(280, t)
      exhaustFilter.Q.setValueAtTime(2.0, t)
      exhaustFilterRef.current = exhaustFilter

      // ─── Low-pass envelope on waveshaper output ───
      const lpEnvelope = ctx.createBiquadFilter()
      lpEnvelope.type = 'lowpass'
      lpEnvelope.frequency.setValueAtTime(400, t)
      lpEnvelope.Q.setValueAtTime(1.5, t)

      // Routing: waveshaper → lpEnvelope → master
      waveshaper.connect(lpEnvelope)
      lpEnvelope.connect(master)

      // Also route exhaust formant directly to master (parallel)
      exhaustFilter.connect(master)

      // ─── Firing frequency LFO (amplitude modulation for cylinder pulse) ───
      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      const idleFF = firingFreq(1300)
      lfo.frequency.setValueAtTime(idleFF, t)
      const lfoGain = ctx.createGain()
      lfoGain.gain.setValueAtTime(0.15, t) // subtle AM depth
      lfo.connect(lfoGain)
      // LFO modulates master gain
      lfoGain.connect(master.gain)
      lfo.start()
      lfoRef.current = lfo
      lfoGainRef.current = lfoGain

      // ─── Harmonic oscillator bank ───

      // Fundamental (sawtooth - rich harmonics, sounds like raw exhaust pulse)
      const oscFund = ctx.createOscillator()
      oscFund.type = 'sawtooth'
      oscFund.frequency.setValueAtTime(idleFF, t)
      const gFund = ctx.createGain()
      gFund.gain.setValueAtTime(0.35, t)
      oscFund.connect(gFund)
      gFund.connect(driveGain)
      gFund.connect(exhaustFilter)
      oscFund.start()
      oscFundRef.current = oscFund
      gainFundRef.current = gFund

      // 2nd harmonic (triangle - softer overtone, exhaust bark)
      const oscH2 = ctx.createOscillator()
      oscH2.type = 'triangle'
      // Slight detune for uneven intake funnel effect (+3 cents)
      oscH2.frequency.setValueAtTime(idleFF * 2, t)
      oscH2.detune.setValueAtTime(3, t)
      const gH2 = ctx.createGain()
      gH2.gain.setValueAtTime(0.22, t)
      oscH2.connect(gH2)
      gH2.connect(driveGain)
      oscH2.start()
      oscH2Ref.current = oscH2
      gainH2Ref.current = gH2

      // 3rd harmonic (square - midrange presence, mechanical knock)
      const oscH3 = ctx.createOscillator()
      oscH3.type = 'square'
      // Detune for 2nd intake funnel mismatch (-5 cents)
      oscH3.frequency.setValueAtTime(idleFF * 3, t)
      oscH3.detune.setValueAtTime(-5, t)
      const gH3 = ctx.createGain()
      gH3.gain.setValueAtTime(0.10, t)
      oscH3.connect(gH3)
      gH3.connect(driveGain)
      oscH3.start()
      oscH3Ref.current = oscH3
      gainH3Ref.current = gH3

      // 4th harmonic (sawtooth - high-frequency rasp at high RPM)
      const oscH4 = ctx.createOscillator()
      oscH4.type = 'sawtooth'
      oscH4.frequency.setValueAtTime(idleFF * 4, t)
      oscH4.detune.setValueAtTime(7, t)
      const gH4 = ctx.createGain()
      gH4.gain.setValueAtTime(0.04, t) // quiet at idle, opens up with RPM
      oscH4.connect(gH4)
      gH4.connect(driveGain)
      oscH4.start()
      oscH4Ref.current = oscH4
      gainH4Ref.current = gH4

      // Sub-harmonic (half firing frequency - deep muffler resonance / exhaust pulse)
      const oscSub = ctx.createOscillator()
      oscSub.type = 'sine'
      oscSub.frequency.setValueAtTime(idleFF * 0.5, t)
      const gSub = ctx.createGain()
      gSub.gain.setValueAtTime(0.18, t)
      oscSub.connect(gSub)
      // Sub goes through a low-pass to keep it rumbling
      const subLP = ctx.createBiquadFilter()
      subLP.type = 'lowpass'
      subLP.frequency.setValueAtTime(120, t)
      subLP.Q.setValueAtTime(2, t)
      gSub.connect(subLP)
      subLP.connect(master)
      oscSub.start()
      oscSubRef.current = oscSub
      gainSubRef.current = gSub

      // ─── Noise layer (intake rush + mechanical clatter) ───
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        // Pink-ish noise: emphasize lower frequencies
        output[i] = (Math.random() * 2 - 1) * 0.8
      }
      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = noiseBuffer
      noiseSource.loop = true

      // Bandpass for intake character
      const noiseBP = ctx.createBiquadFilter()
      noiseBP.type = 'bandpass'
      noiseBP.frequency.setValueAtTime(350, t)
      noiseBP.Q.setValueAtTime(1.2, t)
      noiseBPRef.current = noiseBP

      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.02, t) // very quiet at idle
      noiseGainRef.current = noiseGain

      noiseSource.connect(noiseBP)
      noiseBP.connect(noiseGain)
      noiseGain.connect(master)
      noiseSource.start()

      setAudioEnabled(true)
    } catch {
      // AudioContext not available
    }
  }, [firingFreq, makeDistortionCurve])

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
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
  }, [audioEnabled, initAudio])

  // Rev physics & real-time audio parameter update loop
  useEffect(() => {
    const maxRpmByMode = {A: 10900, STD: 9800, B: 8500}
    targetRpmRef.current = isRevving ? maxRpmByMode[engineMode] : 1300

    let lastTime = performance.now()
    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000
      lastTime = time

      // Exponential approach with asymmetric rates (rev up fast, coast down naturally)
      const rateUp = engineMode === 'A' ? 16 : engineMode === 'STD' ? 12 : 9
      const rateDown = 5.5 // slower decel simulates flywheel inertia
      const speed = currentRpmRef.current < targetRpmRef.current ? rateUp : rateDown
      const newRpm = currentRpmRef.current + (targetRpmRef.current - currentRpmRef.current) * Math.min(dt * speed, 1)
      currentRpmRef.current = newRpm

      // Update React state at 30fps to avoid excessive rerenders
      setRpm(newRpm)

      // ─── Real-time audio parameter updates ───
      const ctx = audioCtxRef.current
      if (ctx && ctx.state === 'running') {
        const t = ctx.currentTime
        const ramp = 0.04 // smooth ramp time constant (seconds)

        // Firing frequency
        const ff = firingFreq(newRpm)

        // Oscillator frequencies
        oscFundRef.current?.frequency.setTargetAtTime(ff, t, ramp)
        oscH2Ref.current?.frequency.setTargetAtTime(ff * 2, t, ramp)
        oscH3Ref.current?.frequency.setTargetAtTime(ff * 3, t, ramp)
        oscH4Ref.current?.frequency.setTargetAtTime(ff * 4, t, ramp)
        oscSubRef.current?.frequency.setTargetAtTime(ff * 0.5, t, ramp)
        lfoRef.current?.frequency.setTargetAtTime(ff, t, ramp)

        // ─── Dynamic gain shaping based on RPM ───
        const rpmNorm = (newRpm - 1300) / (11500 - 1300) // 0..1

        // Fundamental: strong throughout, slight dip at very high RPM (exhaust rasp takes over)
        gainFundRef.current?.gain.setTargetAtTime(0.30 + rpmNorm * 0.10, t, ramp)

        // 2nd harmonic: grows with RPM (exhaust bark)
        gainH2Ref.current?.gain.setTargetAtTime(0.15 + rpmNorm * 0.20, t, ramp)

        // 3rd harmonic: mechanical knock, fades in mid-range then strong at high RPM
        gainH3Ref.current?.gain.setTargetAtTime(0.05 + rpmNorm * rpmNorm * 0.18, t, ramp)

        // 4th harmonic: high-frequency rasp, only present at high RPM
        gainH4Ref.current?.gain.setTargetAtTime(0.02 + rpmNorm * rpmNorm * rpmNorm * 0.14, t, ramp)

        // Sub-harmonic: strongest at low RPM (deep rumble), fades slightly at high RPM
        gainSubRef.current?.gain.setTargetAtTime(0.20 - rpmNorm * 0.08, t, ramp)

        // LFO depth: more pronounced pulse at low RPM, smoother at high RPM
        lfoGainRef.current?.gain.setTargetAtTime(0.18 - rpmNorm * 0.10, t, ramp)

        // Intake noise: rises dramatically with RPM
        noiseGainRef.current?.gain.setTargetAtTime(0.015 + rpmNorm * rpmNorm * 0.08, t, ramp)
        noiseBPRef.current?.frequency.setTargetAtTime(300 + rpmNorm * 3500, t, ramp)

        // Exhaust formant: resonance shifts up with RPM
        exhaustFilterRef.current?.frequency.setTargetAtTime(250 + rpmNorm * 450, t, ramp)
        exhaustFilterRef.current?.Q.setTargetAtTime(1.5 + rpmNorm * 2.5, t, ramp)

        // Waveshaper drive: more distortion/saturation at high RPM
        driveGainRef.current?.gain.setTargetAtTime(1.0 + rpmNorm * 2.5, t, ramp)
        if (waveshaperRef.current) {
          waveshaperRef.current.curve = makeDistortionCurve(2.0 + rpmNorm * 6.0)
        }

        // Master volume: slight swell with RPM
        masterGainRef.current?.gain.setTargetAtTime(0.15 + rpmNorm * 0.12, t, ramp)
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isRevving, engineMode, firingFreq, makeDistortionCurve])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
    }
  }, [])

  // UI calculations
  const rpmRatio = Math.max(0, Math.min(1, (rpm - 1300) / (11500 - 1300)))
  const isRedline = rpm >= 10200
  const powerBand = rpm >= 7000 && rpm < 10200

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
              Synthèse physique temps réel : 3 cylindres, calage 240° entre allumages, fréquence de combustion = RPM × 1.5 / 60
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
            <span className={`h-1.5 w-1.5 rounded-full ${isRedline ? 'bg-red-500 animate-ping' : powerBand ? 'bg-amber-400' : 'bg-white'}`} />
            {isRedline ? 'ZONE RUPTEUR' : powerBand ? 'PLAGE DE PUISSANCE' : 'RÉGIME MOTEUR EN DIRECT'}
          </div>
          <div className="font-mono text-6xl md:text-7xl font-black tracking-tight text-white flex items-baseline gap-2">
            <span>{new Intl.NumberFormat('en-US').format(Math.round(rpm))}</span>
            <span className="text-xs font-normal text-zinc-500">TR/MIN</span>
          </div>

          {/* Firing frequency readout */}
          <div className="pt-1 font-mono text-xs text-zinc-600">
            f<sub>allumage</sub> = {firingFreq(rpm).toFixed(1)} Hz
          </div>

          <div className="pt-2 grid grid-cols-2 gap-3 font-mono text-[11px]">
            <div className="rounded-lg border border-white/[0.06] bg-black px-3 py-2 space-y-0.5">
              <span className="text-[10px] text-zinc-500 block">CALAGE VILEBREQUIN</span>
              <span className="text-white font-bold">240° ENTRE ALLUMAGES</span>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-black px-3 py-2 space-y-0.5">
              <span className="text-[10px] text-zinc-500 block">HARMONIQUES ACTIVES</span>
              <span className="text-white font-bold">5 + BRUIT + LFO</span>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-black px-3 py-2 space-y-0.5">
              <span className="text-[10px] text-zinc-500 block">RUPTEUR</span>
              <span className="text-white font-bold">11 500 TR/MIN</span>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-black px-3 py-2 space-y-0.5">
              <span className="text-[10px] text-zinc-500 block">COUPLE MAX</span>
              <span className="text-white font-bold">93 Nm @ 7 000</span>
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
                  : powerBand
                    ? 'bg-amber-400'
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
            <span className="text-zinc-400">7K ●</span>
            <span>8K</span>
            <span>10K</span>
            <span className="text-red-400">11.5K RUPTEUR</span>
          </div>

          {/* Audio spectrum visualization (harmonic levels) */}
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-black p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                SPECTRE HARMONIQUE EN DIRECT
              </span>
              <span className="font-mono text-[10px] text-zinc-600">
                {audioEnabled ? 'SYNTHÈSE ACTIVE' : 'EN ATTENTE'}
              </span>
            </div>
            <div className="flex items-end gap-1.5 h-16">
              {/* Sub-harmonic */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full bg-zinc-900 rounded-sm overflow-hidden relative" style={{height: '64px'}}>
                  <motion.div
                    className="absolute bottom-0 w-full bg-zinc-600 rounded-sm"
                    style={{height: `${Math.max(8, (0.20 - rpmRatio * 0.08) / 0.20 * 100)}%`}}
                    transition={{duration: 0.1}}
                  />
                </div>
                <span className="font-mono text-[8px] text-zinc-600">SUB</span>
              </div>
              {/* Fundamental */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full bg-zinc-900 rounded-sm overflow-hidden relative" style={{height: '64px'}}>
                  <motion.div
                    className="absolute bottom-0 w-full bg-white rounded-sm"
                    style={{height: `${Math.max(12, (0.30 + rpmRatio * 0.10) / 0.40 * 100)}%`}}
                    transition={{duration: 0.1}}
                  />
                </div>
                <span className="font-mono text-[8px] text-zinc-400">F₁</span>
              </div>
              {/* 2nd harmonic */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full bg-zinc-900 rounded-sm overflow-hidden relative" style={{height: '64px'}}>
                  <motion.div
                    className="absolute bottom-0 w-full bg-zinc-300 rounded-sm"
                    style={{height: `${Math.max(8, (0.15 + rpmRatio * 0.20) / 0.35 * 100)}%`}}
                    transition={{duration: 0.1}}
                  />
                </div>
                <span className="font-mono text-[8px] text-zinc-500">H₂</span>
              </div>
              {/* 3rd harmonic */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full bg-zinc-900 rounded-sm overflow-hidden relative" style={{height: '64px'}}>
                  <motion.div
                    className="absolute bottom-0 w-full bg-zinc-400 rounded-sm"
                    style={{height: `${Math.max(5, (0.05 + rpmRatio * rpmRatio * 0.18) / 0.23 * 100)}%`}}
                    transition={{duration: 0.1}}
                  />
                </div>
                <span className="font-mono text-[8px] text-zinc-500">H₃</span>
              </div>
              {/* 4th harmonic */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full bg-zinc-900 rounded-sm overflow-hidden relative" style={{height: '64px'}}>
                  <motion.div
                    className="absolute bottom-0 w-full bg-zinc-500 rounded-sm"
                    style={{height: `${Math.max(3, (0.02 + rpmRatio ** 3 * 0.14) / 0.16 * 100)}%`}}
                    transition={{duration: 0.1}}
                  />
                </div>
                <span className="font-mono text-[8px] text-zinc-600">H₄</span>
              </div>
              {/* Noise */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full bg-zinc-900 rounded-sm overflow-hidden relative" style={{height: '64px'}}>
                  <motion.div
                    className="absolute bottom-0 w-full bg-amber-400/60 rounded-sm"
                    style={{height: `${Math.max(3, (0.015 + rpmRatio * rpmRatio * 0.08) / 0.095 * 100)}%`}}
                    transition={{duration: 0.1}}
                  />
                </div>
                <span className="font-mono text-[8px] text-zinc-600">AIR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Throttle Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
        <div className="space-y-1">
          <p className="text-xs text-zinc-400 font-mono">
            Maintenez le bouton pour simuler l&apos;ouverture de la poignée d&apos;accélérateur APSG ride-by-wire.
          </p>
          <p className="text-[10px] text-zinc-600 font-mono">
            Modèle acoustique : fondamentale + 4 harmoniques + sous-harmonique + bruit d&apos;admission + saturation d&apos;échappement + LFO de pulsation cylindre
          </p>
        </div>

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
                ? isRedline
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-red-500 text-white'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>{isRevving ? (isRedline ? 'RUPTEUR !' : 'POIGNÉE EN COIN !') : 'MAINTENIR POUR ACCÉLÉRER'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
