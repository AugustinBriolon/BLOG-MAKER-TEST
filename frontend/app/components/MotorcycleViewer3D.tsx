'use client'

import {useEffect, useRef, useState, useCallback} from 'react'
import {
  Rotate3d,
  Move,
  Eye,
  Layers,
  Compass,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react'
import {motion, AnimatePresence} from 'framer-motion'

// Official Yamaha XSR 900 (2025 Sport Heritage) 360° Studio assets (36 frames)
const TOTAL_FRAMES = 36

const LIVERIES = [
  {
    id: 'legend_red',
    name: 'Legend Red (Officiel 2025)',
    tag: 'MILLÉSIME 2025 HERO',
    colorHex: '#dc2626',
    accentHex: '#f8fafc',
    description: 'Le rouge de course historique Yamaha réinterprété avec plaques blanches et jantes dorées.',
    getUrl: (frameIndex: number) => {
      const idxStr = String(frameIndex + 1).padStart(3, '0')
      return `https://cdn2.yamaha-motor.eu/prod/product-assets/2025/XS850/2025-Yamaha-XS850-EU-Legend_Red-360-Degrees-${idxStr}-03.jpg`
    },
  },
  {
    id: 'midnight_black',
    name: 'Midnight Black & Gold',
    tag: 'DARK STEALTH',
    colorHex: '#18181b',
    accentHex: '#d97706',
    description: 'Noir profond satiné et brillant rehaussé de touches dorées et bronze.',
    getUrl: (frameIndex: number) => {
      const idxStr = String(frameIndex + 1).padStart(3, '0')
      return `https://cdn2.yamaha-motor.eu/prod/product-assets/2025/XS850/2025-Yamaha-XS850-EU-Midnight_Black-360-Degrees-${idxStr}-03.jpg`
    },
  },
]

// Hotspots mapped to specific 360° view angles (frame index 0..35)
const HOTSPOTS = [
  {
    id: 'headlight',
    title: 'Phare Rond Full LED & Cockpit TFT 5"',
    targetFrame: 0, // Face avant / 3/4 avant
    badge: 'SIGNATURE FASTER SONS',
    desc: 'Optique circulaire iconique et nouvel écran couleur TFT 5 pouces avec navigation virage par virage Garmin.',
  },
  {
    id: 'engine',
    title: 'Moteur CP3 890 cm³ EU5+',
    targetFrame: 9, // Profil droit (moteur et embrayage)
    badge: '119 CH // 93 NM',
    desc: '3-cylindres Crossplane à calage 120°, boîte à air acoustique accordée et couple explosif à bas et mi-régimes.',
  },
  {
    id: 'tail',
    title: 'Boucle Arrière & Selle Café Racer',
    targetFrame: 18, // Arrière / 3/4 arrière
    badge: 'DESIGN GRAND PRIX 80S',
    desc: 'Dosseret profilé inspiré des motos de course historiques avec feu arrière LED intégré sous la selle.',
  },
  {
    id: 'deltabox',
    title: 'Cadre Deltabox CF & Bras Long',
    targetFrame: 27, // Profil gauche (châssis et transmission)
    badge: 'CF DIE-CAST +55 MM',
    desc: 'Structure en aluminium coulé sous pression ultra-rigide associée à un bras oscillant rallongé pour un guidage millimétré.',
  },
]

export default function MotorcycleViewer3D() {
  const [selectedLivery, setSelectedLivery] = useState(0)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const [isAutoSpin, setIsAutoSpin] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const processedCacheRef = useRef<Record<string, HTMLCanvasElement[]>>({})
  const dragStartXRef = useRef(0)
  const dragStartFrameRef = useRef(0)
  const velocityRef = useRef(0)
  const animFrameIdRef = useRef<number | null>(null)

  const activeLivery = LIVERIES[selectedLivery]

  // Preload and remove white background for all 36 frames of the selected livery
  useEffect(() => {
    const liveryId = activeLivery.id
    if (!processedCacheRef.current[liveryId]) {
      processedCacheRef.current[liveryId] = []
    }

    let loaded = 0
    setLoadedCount(0)

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = activeLivery.getUrl(i)

      img.onload = () => {
        // Process image to eliminate studio white background
        const offscreen = document.createElement('canvas')
        offscreen.width = img.naturalWidth
        offscreen.height = img.naturalHeight
        const ctx = offscreen.getContext('2d', {willReadFrequently: true})

        if (ctx) {
          ctx.drawImage(img, 0, 0)
          try {
            const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height)
            const data = imgData.data

            for (let p = 0; p < data.length; p += 4) {
              const r = data[p]
              const g = data[p + 1]
              const b = data[p + 2]

              const min = Math.min(r, g, b)
              const max = Math.max(r, g, b)
              const diff = max - min

              // Studio white background detection: high brightness & low saturation
              if (min > 220 && diff < 20) {
                if (min >= 245) {
                  // Pure white studio backdrop -> 100% transparent
                  data[p + 3] = 0
                } else {
                  // Soft feathering edge for clean anti-aliased silhouette
                  const factor = (245 - min) / 25
                  data[p + 3] = Math.round(factor * 255)
                }
              }
            }

            ctx.putImageData(imgData, 0, 0)
          } catch {
            // Fallback if CORS prevents pixel reading
          }
        }

        processedCacheRef.current[liveryId][i] = offscreen
        loaded++
        setLoadedCount(loaded)

        if (i === currentFrame) {
          renderFrame(currentFrame)
        }
      }
    }
  }, [selectedLivery])

  // Draw current transparent frame onto canvas
  const renderFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const liveryId = activeLivery.id
      const processed = processedCacheRef.current[liveryId]?.[frameIndex]

      if (processed && processed.width > 0) {
        if (canvas.width !== processed.width || canvas.height !== processed.height) {
          canvas.width = processed.width
          canvas.height = processed.height
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(processed, 0, 0, canvas.width, canvas.height)
      }
    },
    [activeLivery, selectedLivery],
  )

  useEffect(() => {
    renderFrame(currentFrame)
  }, [currentFrame, renderFrame])

  // Mouse & Touch Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    setIsAutoSpin(false)
    dragStartXRef.current = e.clientX
    dragStartFrameRef.current = currentFrame
    velocityRef.current = 0
    if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - dragStartXRef.current
    const sensitivity = 8 // pixels per frame
    const frameDelta = Math.floor(deltaX / sensitivity)

    let nextFrame = (dragStartFrameRef.current - frameDelta) % TOTAL_FRAMES
    if (nextFrame < 0) nextFrame += TOTAL_FRAMES

    velocityRef.current = -deltaX * 0.05
    setCurrentFrame(nextFrame)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    // Inertia simulation
    const applyInertia = () => {
      if (Math.abs(velocityRef.current) > 0.1) {
        setCurrentFrame((prev) => {
          let next = (prev + Math.round(velocityRef.current)) % TOTAL_FRAMES
          if (next < 0) next += TOTAL_FRAMES
          return next
        })
        velocityRef.current *= 0.88 // damping
        animFrameIdRef.current = requestAnimationFrame(applyInertia)
      }
    }
    applyInertia()
  }

  // Auto-spin option
  useEffect(() => {
    if (!isAutoSpin) return
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % TOTAL_FRAMES)
    }, 70)
    return () => clearInterval(interval)
  }, [isAutoSpin])

  // Hotspot Navigation (smoothly spin to the designated frame)
  const goToHotspot = (spot: (typeof HOTSPOTS)[number]) => {
    setActiveHotspot(spot.id)
    setIsAutoSpin(false)
    const target = spot.targetFrame
    const current = currentFrame
    const diff = (target - current + TOTAL_FRAMES) % TOTAL_FRAMES
    const step = diff > TOTAL_FRAMES / 2 ? -1 : 1

    let count = 0
    const maxSteps = diff > TOTAL_FRAMES / 2 ? TOTAL_FRAMES - diff : diff
    if (maxSteps === 0) return

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        let n = (prev + step) % TOTAL_FRAMES
        if (n < 0) n += TOTAL_FRAMES
        return n
      })
      count++
      if (count >= maxSteps) {
        clearInterval(interval)
      }
    }, 35)
  }

  const progressPct = Math.round((loadedCount / TOTAL_FRAMES) * 100)
  const angleDegrees = Math.round((currentFrame / TOTAL_FRAMES) * 360)

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[750px] lg:h-[860px] bg-gradient-to-b from-[#08080b] via-[#0d0d12] to-[#08080b] rounded-3xl border border-white/[0.08] overflow-hidden select-none shadow-2xl"
    >
      {/* Background Cyber Studio Grids & Neon Backlight */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20 transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 50% 55%, ${activeLivery.colorHex}66 0%, transparent 60%)`,
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Top HUD Banner */}
      <div className="absolute top-6 inset-x-6 flex flex-wrap items-center justify-between gap-4 z-20 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-amber-500/40 bg-black/80 px-4 py-1.5 font-mono text-xs text-amber-300 font-bold backdrop-blur shadow-lg shadow-amber-500/10">
            <Rotate3d className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{animationDuration: '6s'}} />
            <span>YAMAHA XSR 900 // STUDIO 360° 4K</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[11px] text-zinc-400 backdrop-blur">
            <Move className="h-3 w-3 text-zinc-500" />
            <span>GLISSER 360° • LOUPE ZOOM 4K • FOND DÉTOURÉ</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <a
            href="https://www.yamaha-motor.eu/fr/fr/motorcycles/sport-heritage/pdp/xsr900/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-full border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-xs font-mono text-red-300 hover:text-white px-3.5 py-1.5 transition-colors backdrop-blur flex items-center gap-1.5 font-bold"
          >
            <span>YAMAHA EU OFFICIEL ↗</span>
          </a>

          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-mono transition-all backdrop-blur flex items-center gap-1.5 ${
              isAutoSpin
                ? 'border-amber-400 bg-amber-400 text-black font-bold shadow-lg shadow-amber-400/20'
                : 'border-white/10 bg-black/70 hover:bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <Compass className="h-3 w-3" />
            <span>{isAutoSpin ? 'ARRÊTER ROTATION' : 'AUTO-ROTATION'}</span>
          </button>
        </div>
      </div>

      {/* Main 360 Canvas Viewport */}
      <div
        className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-300 ${
          isZoomed ? 'scale-130' : 'scale-100'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Realistic Floor Contact Shadow */}
        <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[72%] h-14 bg-black/90 blur-2xl rounded-[100%] pointer-events-none" />

        <canvas
          ref={canvasRef}
          className="relative z-10 max-w-[92%] max-h-[82%] object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.95)] transition-opacity duration-300"
          style={{opacity: loadedCount > 0 ? 1 : 0}}
        />

        {/* Loading Overlay */}
        {loadedCount < TOTAL_FRAMES && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md z-30 transition-opacity">
            <div className="w-64 space-y-3 text-center">
              <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
                <span>CHARGEMENT STUDIO 360° 4K</span>
                <span className="text-amber-400 font-bold">{progressPct}%</span>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-200"
                  style={{width: `${progressPct}%`}}
                />
              </div>
              <span className="font-mono text-[10px] text-zinc-500 block">
                {loadedCount} / {TOTAL_FRAMES} CLICHÉS HAUTE DÉFINITION
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Angle Telemetry Compass */}
      <div className="absolute right-6 top-24 z-20 pointer-events-none hidden sm:flex flex-col items-end gap-1">
        <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
          [ ANGLE AZIMUT // {angleDegrees}° ]
        </span>
        <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur">
          <span className="text-amber-400 font-bold">FRAME {String(currentFrame + 1).padStart(2, '0')}</span>
          <span className="text-zinc-600">/</span>
          <span>{TOTAL_FRAMES}</span>
        </div>
      </div>

      {/* Floating Hotspots Left Panel */}
      <div className="absolute left-6 bottom-24 z-20 space-y-2 pointer-events-auto max-w-xs">
        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">
          [ POINTS CLÉS YAMAHA 2025 ]
        </span>

        <div className="flex flex-col gap-1.5">
          {HOTSPOTS.map((spot) => {
            const isActive = activeHotspot === spot.id
            return (
              <button
                key={spot.id}
                onClick={() => goToHotspot(spot)}
                className={`cursor-pointer text-left px-3.5 py-2 rounded-xl font-mono text-xs transition-all backdrop-blur flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-amber-400 text-black font-bold shadow-lg shadow-amber-400/25 scale-102'
                    : 'bg-black/70 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-900/90 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isActive ? 'bg-black animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span>{spot.title}</span>
                </div>
                <Eye className="h-3 w-3 opacity-60" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Hotspot Detailed Card Popover */}
      <AnimatePresence>
        {activeHotspot && (
          <motion.div
            initial={{opacity: 0, y: 15, scale: 0.95}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 10, scale: 0.95}}
            className="absolute left-6 sm:left-auto sm:right-6 bottom-24 z-20 max-w-sm p-4 rounded-2xl bg-zinc-950/95 border border-white/15 backdrop-blur-xl shadow-2xl text-zinc-200"
          >
            {(() => {
              const spot = HOTSPOTS.find((h) => h.id === activeHotspot)
              if (!spot) return null
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
                      {spot.badge}
                    </span>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      className="cursor-pointer text-zinc-500 hover:text-white text-xs font-mono"
                    >
                      FERMER ✕
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{spot.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">{spot.desc}</p>
                </div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Center Control Bar */}
      <div className="absolute bottom-6 inset-x-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 pointer-events-none">
        {/* Livery Selector Tabs */}
        <div className="pointer-events-auto flex items-center gap-2 bg-black/80 border border-white/10 rounded-2xl p-1.5 backdrop-blur shadow-2xl">
          <Layers className="h-3.5 w-3.5 text-zinc-500 ml-2 mr-1" />
          {LIVERIES.map((livery, idx) => {
            const isSelected = selectedLivery === idx
            return (
              <button
                key={livery.id}
                onClick={() => setSelectedLivery(idx)}
                className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-zinc-800 text-white font-bold border border-white/20 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border border-white/30"
                  style={{backgroundColor: livery.colorHex}}
                />
                <span>{livery.name}</span>
              </button>
            )
          })}
        </div>

        {/* Step Navigation & Zoom Toggle */}
        <div className="pointer-events-auto flex items-center gap-2 bg-black/80 border border-white/10 rounded-2xl p-1.5 backdrop-blur shadow-2xl">
          <button
            onClick={() => setCurrentFrame((prev) => (prev - 1 + TOTAL_FRAMES) % TOTAL_FRAMES)}
            className="cursor-pointer p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Angle précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Interactive Frame Scrubber Slider */}
          <input
            type="range"
            min={0}
            max={TOTAL_FRAMES - 1}
            value={currentFrame}
            onChange={(e) => setCurrentFrame(parseInt(e.target.value, 10))}
            className="w-24 sm:w-32 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />

          <button
            onClick={() => setCurrentFrame((prev) => (prev + 1) % TOTAL_FRAMES)}
            className="cursor-pointer p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Angle suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-white/10 mx-1" />

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className={`cursor-pointer p-2 rounded-xl text-xs font-mono transition-colors flex items-center gap-1.5 ${
              isZoomed ? 'bg-amber-400 text-black font-bold' : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
            title="Zoom 4K"
          >
            {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            <span className="hidden sm:inline">{isZoomed ? 'DÉZOOM' : 'LOUPE 4K'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
