'use client'

import {useEffect, useRef, useState, useCallback} from 'react'
import {
  Rotate3d,
  Move,
  Eye,
  Compass,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
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
    accentHex: '#f59e0b',
    description: 'Le rouge de course historique Yamaha réinterprété avec plaques blanches, carters noirs et jantes dorées SpinForged.',
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
    id: 'cockpit',
    title: 'Phare Rond Full LED & TFT 5"',
    targetFrame: 0, // Face avant / 3/4 avant
    badge: 'SIGNATURE FASTER SONS',
    desc: 'Optique circulaire emblématique et nouveau combiné couleur TFT 5 pouces avec navigation Garmin et connectivité MyRide.',
  },
  {
    id: 'engine',
    title: 'Moteur CP3 890 cm³ EU5+',
    targetFrame: 9, // Profil droit
    badge: '119 CH // 93 NM',
    desc: '3-cylindres Crossplane calé à 120°, boîte à air acoustique accordée et couple ravageur disponible dès les bas régimes.',
  },
  {
    id: 'tail',
    title: 'Boucle Arrière & Selle Café Racer',
    targetFrame: 18, // 3/4 arrière
    badge: 'DESIGN GRAND PRIX 80S',
    desc: 'Dosseret profilé inspiré des motos de course avec feu arrière LED intégré discrètement sous la selle.',
  },
  {
    id: 'deltabox',
    title: 'Cadre Deltabox CF & Bras +55 mm',
    targetFrame: 27, // Profil gauche
    badge: 'CF DIE-CAST // ULTRA RIGIDE',
    desc: 'Structure en aluminium coulé sous pression à parois fines de 1,7 mm, gage de stabilité chirurgicale en courbe rapide.',
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
  const imagesCacheRef = useRef<Record<string, HTMLImageElement[]>>({})
  const dragStartXRef = useRef(0)
  const dragStartFrameRef = useRef(0)
  const velocityRef = useRef(0)
  const animFrameIdRef = useRef<number | null>(null)

  const activeLivery = LIVERIES[selectedLivery]

  const currentFrameRef = useRef(currentFrame)
  useEffect(() => {
    currentFrameRef.current = currentFrame
  }, [currentFrame])

  // Draw current frame onto canvas
  const renderFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const liveryId = activeLivery.id
      const cache = imagesCacheRef.current[liveryId]
      const img = cache ? cache[frameIndex] : null

      if (img && img.complete && img.naturalWidth > 0) {
        if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
    },
    [activeLivery],
  )

  const renderFrameRef = useRef(renderFrame)
  useEffect(() => {
    renderFrameRef.current = renderFrame
  }, [renderFrame])

  // Preload frames into memory for ultra-smooth rendering
  useEffect(() => {
    const liveryId = activeLivery.id
    if (!imagesCacheRef.current[liveryId]) {
      imagesCacheRef.current[liveryId] = []
    }

    let loaded = 0
    let isCancelled = false

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = activeLivery.getUrl(i)

      img.onload = () => {
        if (isCancelled) return
        loaded++
        setLoadedCount(loaded)
        if (i === currentFrameRef.current) {
          renderFrameRef.current(currentFrameRef.current)
        }
      }
      imagesCacheRef.current[liveryId][i] = img
    }

    return () => {
      isCancelled = true
    }
  }, [activeLivery])

  useEffect(() => {
    renderFrame(currentFrame)
  }, [currentFrame, renderFrame])

  // Mouse & Touch Drag Handlers (smooth 360 rotation with inertia)
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
    const sensitivity = 9 // pixels per frame
    const frameDelta = Math.floor(deltaX / sensitivity)

    let nextFrame = (dragStartFrameRef.current - frameDelta) % TOTAL_FRAMES
    if (nextFrame < 0) nextFrame += TOTAL_FRAMES

    velocityRef.current = -deltaX * 0.045
    setCurrentFrame(nextFrame)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    // Inertia simulation
    const applyInertia = () => {
      if (Math.abs(velocityRef.current) > 0.08) {
        setCurrentFrame((prev) => {
          let next = (prev + Math.round(velocityRef.current)) % TOTAL_FRAMES
          if (next < 0) next += TOTAL_FRAMES
          return next
        })
        velocityRef.current *= 0.9 // gentle damping
        animFrameIdRef.current = requestAnimationFrame(applyInertia)
      }
    }
    applyInertia()
  }

  // Auto-spin showroom mode
  useEffect(() => {
    if (!isAutoSpin) return
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % TOTAL_FRAMES)
    }, 75)
    return () => clearInterval(interval)
  }, [isAutoSpin])

  // Hotspot Navigation (smooth spin to designated frame)
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
      className="relative w-full rounded-3xl border border-white/[0.12] bg-[#09090d] p-3 sm:p-5 shadow-2xl select-none"
    >
      {/* Outer Studio Frame Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-black/80 px-4 py-1.5 font-mono text-xs text-amber-300 font-bold backdrop-blur shadow-lg shadow-amber-500/10">
            <Rotate3d className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{animationDuration: '6s'}} />
            <span>YAMAHA XSR 900 // STUDIO OFFICIEL 360° 4K</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[11px] text-zinc-400">
            <Move className="h-3 w-3 text-zinc-500" />
            <span>GLISSER POUR TOURNER • INERTIE PHYSIQUE • LOUPE ZOOM</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            <span>{isAutoSpin ? 'ARRÊTER' : 'AUTO-ROTATION'}</span>
          </button>
        </div>
      </div>

      {/* Contemporary Light Studio Cyclorama Capsule (Architectural Stage) */}
      <div className="relative w-full h-[620px] sm:h-[720px] lg:h-[800px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] shadow-inner flex items-center justify-center">
        {/* Soft Studio Floor Reflection & Grid */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-zinc-300/40 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Studio Spotlight Cone */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-56 bg-radial-gradient from-white/70 to-transparent blur-2xl pointer-events-none" />

        {/* Telemetry Angle Compass (Top Right Inside Stage) */}
        <div className="absolute right-5 top-5 z-20 pointer-events-none hidden sm:flex flex-col items-end gap-1">
          <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
            [ ORIENTATION // {angleDegrees}° ]
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-700 bg-white/80 px-3 py-1.5 rounded-xl border border-zinc-300/80 shadow-sm backdrop-blur">
            <span className="text-zinc-900 font-bold">VUE {String(currentFrame + 1).padStart(2, '0')}</span>
            <span className="text-zinc-400">/</span>
            <span>{TOTAL_FRAMES}</span>
          </div>
        </div>

        {/* Interactive Canvas Viewport */}
        <div
          className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-300 ${
            isZoomed ? 'scale-125' : 'scale-100'
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <canvas
            ref={canvasRef}
            className="max-w-[94%] max-h-[88%] object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.18)] transition-opacity duration-200"
            style={{opacity: loadedCount > 0 ? 1 : 0}}
          />

          {/* Loading Screen */}
          {loadedCount < TOTAL_FRAMES && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-30 transition-opacity">
              <div className="w-64 space-y-3 text-center">
                <div className="flex items-center justify-between font-mono text-xs text-zinc-700">
                  <span className="font-bold">STUDIO 360° 4K</span>
                  <span className="text-amber-600 font-bold">{progressPct}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-red-600 transition-all duration-200"
                    style={{width: `${progressPct}%`}}
                  />
                </div>
                <span className="font-mono text-[10px] text-zinc-500 block">
                  {loadedCount} / {TOTAL_FRAMES} CLICHÉS HAUTE RÉSOLUTION
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hotspots Floating Overlay (Left Bottom Inside Stage) */}
        <div className="absolute left-5 bottom-5 z-20 space-y-2 pointer-events-auto max-w-xs">
          <span className="font-mono text-[10px] text-zinc-600 font-bold uppercase tracking-widest block mb-1">
            [ POINTS CLÉS 2025 ]
          </span>

          <div className="flex flex-col gap-1.5">
            {HOTSPOTS.map((spot) => {
              const isActive = activeHotspot === spot.id
              return (
                <button
                  key={spot.id}
                  onClick={() => goToHotspot(spot)}
                  className={`cursor-pointer text-left px-3.5 py-2 rounded-xl font-mono text-xs transition-all flex items-center justify-between gap-3 shadow-sm ${
                    isActive
                      ? 'bg-zinc-900 text-amber-300 font-bold scale-102 border border-amber-400/40 shadow-md'
                      : 'bg-white/85 border border-zinc-200/90 text-zinc-800 hover:bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isActive ? 'bg-amber-400 animate-pulse' : 'bg-zinc-400'
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
              className="absolute left-5 sm:left-auto sm:right-5 bottom-20 z-20 max-w-sm p-4 rounded-2xl bg-zinc-900/95 border border-white/15 text-zinc-200 shadow-2xl backdrop-blur-xl"
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
                        className="cursor-pointer text-zinc-400 hover:text-white text-xs font-mono"
                      >
                        ✕
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{spot.title}</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed font-light">{spot.desc}</p>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage Center Bottom Scrubber Controls */}
        <div className="absolute bottom-5 right-5 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-2 z-20 pointer-events-auto bg-white/90 border border-zinc-300/80 rounded-2xl p-1.5 shadow-lg backdrop-blur">
          <button
            onClick={() => setCurrentFrame((prev) => (prev - 1 + TOTAL_FRAMES) % TOTAL_FRAMES)}
            className="cursor-pointer p-2 rounded-xl text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors"
            title="Angle précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Scrubber slider */}
          <input
            type="range"
            min={0}
            max={TOTAL_FRAMES - 1}
            value={currentFrame}
            onChange={(e) => setCurrentFrame(parseInt(e.target.value, 10))}
            className="w-24 sm:w-36 accent-zinc-900 cursor-pointer h-1.5 bg-zinc-300 rounded-lg"
          />

          <button
            onClick={() => setCurrentFrame((prev) => (prev + 1) % TOTAL_FRAMES)}
            className="cursor-pointer p-2 rounded-xl text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors"
            title="Angle suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-zinc-300 mx-1" />

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className={`cursor-pointer p-2 rounded-xl text-xs font-mono transition-colors flex items-center gap-1.5 ${
              isZoomed
                ? 'bg-zinc-900 text-white font-bold'
                : 'text-zinc-800 hover:text-black hover:bg-zinc-100'
            }`}
            title="Loupe Zoom"
          >
            {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            <span className="hidden sm:inline font-bold">{isZoomed ? 'DÉZOOM' : 'LOUPE'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Livery Selector Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest mr-1">
            COLORIS OFFICIELE 2025 :
          </span>
          <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-2xl p-1 backdrop-blur">
            {LIVERIES.map((livery, idx) => {
              const isSelected = selectedLivery === idx
              return (
                <button
                  key={livery.id}
                  onClick={() => setSelectedLivery(idx)}
                  className={`cursor-pointer flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    isSelected
                      ? 'bg-zinc-800 text-white font-bold border border-white/20 shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-white/40"
                    style={{backgroundColor: livery.colorHex}}
                  />
                  <span>{livery.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <p className="font-mono text-xs text-zinc-500 text-center sm:text-right">
          {activeLivery.description}
        </p>
      </div>
    </div>
  )
}
