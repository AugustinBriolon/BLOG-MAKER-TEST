'use client'

import {useEffect, useRef, useState} from 'react'
import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {Rotate3d, Move, Eye, Layers, Compass, ZoomIn} from 'lucide-react'
import {motion, AnimatePresence} from 'framer-motion'

// Hotspots on the authentic Yamaha XSR Sport Heritage platform
const HOTSPOTS = [
  {
    id: 'headlight',
    title: 'Phare Rond Full LED & Cockpit',
    badge: 'SIGNATURE FASTER SONS',
    desc: 'Optique circulaire emblématique de la lignée Sport Heritage, alliant design 80s vintage et technologie Full LED.',
    pos: new THREE.Vector3(0, 0.85, 0.85),
    camTarget: new THREE.Vector3(0, 0.8, 0.8),
    camPos: new THREE.Vector3(0.5, 0.95, 1.5),
  },
  {
    id: 'tank',
    title: 'Réservoir Rétro Échancré',
    badge: 'ALUMINIUM BROSSÉ',
    desc: 'Réservoir sculpté avec découpes de genoux caractéristiques inspiré des machines de Grand Prix Yamaha des années 1980.',
    pos: new THREE.Vector3(0, 0.8, 0.1),
    camTarget: new THREE.Vector3(0, 0.75, 0.1),
    camPos: new THREE.Vector3(1.1, 1.1, 0.6),
  },
  {
    id: 'engine',
    title: 'Moteur Crossplane Apparent',
    badge: 'ARCHITECTURE NAKED',
    desc: 'Bloc moteur totalement mis en valeur sans carénage plastique, délivrant une vivacité et une sonorité caractéristiques.',
    pos: new THREE.Vector3(0, 0.45, 0.0),
    camTarget: new THREE.Vector3(0, 0.45, 0.0),
    camPos: new THREE.Vector3(1.3, 0.55, 0.8),
  },
  {
    id: 'exhaust',
    title: 'Échappement & Arrière Épuré',
    badge: 'LIGNE SOUS LE MOTEUR',
    desc: 'Centralisation optimale des masses et boucle arrière minimaliste typique de l’esprit Café Racer contemporain.',
    pos: new THREE.Vector3(-0.2, 0.25, -0.3),
    camTarget: new THREE.Vector3(-0.2, 0.3, -0.2),
    camPos: new THREE.Vector3(-1.3, 0.45, 1.0),
  },
]

// Livery options that adjust materials matching official Yamaha colorways
const LIVERIES = [
  {
    name: 'Legend Red (Officiel 2025)',
    tag: 'MILLÉSIME 2025',
    tankColor: 0xd91d24, // authentic racing scarlet red
    accentColor: 0xf8fafc, // crisp white speedblocks & gold calipers
  },
  {
    name: 'Legend Blue (Sonauto GP 80s)',
    tag: 'SARRON HERITAGE',
    tankColor: 0x1e3a8a, // deep racing blue
    accentColor: 0xf59e0b, // gold wheels/accents
  },
  {
    name: 'Midnight Black & Gold',
    tag: 'DARK STEALTH',
    tankColor: 0x111115, // deep satin black
    accentColor: 0xd97706, // metallic gold
  },
  {
    name: 'Historic White Speedblock',
    tag: 'RACING CLASSIC',
    tankColor: 0xf8fafc, // racing pearl white
    accentColor: 0xdc2626, // red speedblock
  },
]

export default function MotorcycleViewer3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const [selectedLivery, setSelectedLivery] = useState(0)
  const isInteractingRef = useRef(false)

  const controlsRef = useRef<OrbitControls | null>(null)
  const modelGroupRef = useRef<THREE.Group | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const materialsMapRef = useRef<{tankMeshes: THREE.Mesh[]; wheelMeshes: THREE.Mesh[]}>({
    tankMeshes: [],
    wheelMeshes: [],
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x08080b, 0.12)

    const width = container.clientWidth
    const height = container.clientHeight

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    camera.position.set(2.4, 1.2, 2.6)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 1.8
    controls.maxDistance = 5.5
    controls.maxPolarAngle = Math.PI / 2 + 0.02 // do not dip beneath floor
    controls.minPolarAngle = Math.PI / 6
    controls.target.set(0, 0.45, 0)
    controlsRef.current = controls

    controls.addEventListener('start', () => {
      isInteractingRef.current = true
    })
    controls.addEventListener('end', () => {
      isInteractingRef.current = false
    })

    // Studio Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    // Key light (overhead cool white)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 3.2)
    keyLight.position.set(4, 6, 3)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 2048
    keyLight.shadow.mapSize.height = 2048
    keyLight.shadow.camera.near = 0.5
    keyLight.shadow.camera.far = 15
    keyLight.shadow.bias = -0.0005
    scene.add(keyLight)

    // Fill rim light (warm golden amber)
    const amberRimLight = new THREE.DirectionalLight(0xf59e0b, 2.5)
    amberRimLight.position.set(-4, 3, -3)
    scene.add(amberRimLight)

    // Cool blue backlight for racing contrast
    const blueBackLight = new THREE.DirectionalLight(0x3b82f6, 1.8)
    blueBackLight.position.set(2, 2, -4)
    scene.add(blueBackLight)

    // Ground reflector shadow disc
    const groundGeo = new THREE.PlaneGeometry(12, 12)
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x08080b,
      roughness: 0.8,
      metalness: 0.2,
    })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.02
    ground.receiveShadow = true
    scene.add(ground)

    // Ground cyber grid ring
    const gridHelper = new THREE.GridHelper(10, 20, 0xf59e0b, 0x27272a)
    gridHelper.position.y = -0.01
    scene.add(gridHelper)

    // Load 3D GLB Model
    const modelGroup = new THREE.Group()
    scene.add(modelGroup)
    modelGroupRef.current = modelGroup

    const loader = new GLTFLoader()
    const modelUrl = '/models/xsr900.glb'

    const tankMeshes: THREE.Mesh[] = []
    const wheelMeshes: THREE.Mesh[] = []

    loader.load(
      modelUrl,
      (gltf) => {
        const root = gltf.scene

        // Compute bounding box and normalize scale & center
        const box = new THREE.Box3().setFromObject(root)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())

        // Target bike length ~ 2.1 units in Three.js coordinates
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2.1 / maxDim
        root.scale.setScalar(scale)

        // Center on X and Z, align base of tires with Y = 0
        root.position.x = -center.x * scale
        root.position.z = -center.z * scale
        root.position.y = -box.min.y * scale

        // Enhance materials
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            mesh.castShadow = true
            mesh.receiveShadow = true

            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial
              mat.envMapIntensity = 1.4

              // Detect bodywork / tank vs wheels for livery customizing
              const name = (mesh.name || '').toLowerCase()
              if (
                name.includes('tank') ||
                name.includes('body') ||
                name.includes('fairing') ||
                name.includes('carrosserie') ||
                name.includes('cover')
              ) {
                tankMeshes.push(mesh)
              } else if (name.includes('wheel') || name.includes('rim') || name.includes('jante')) {
                wheelMeshes.push(mesh)
              }
            }
          }
        })

        materialsMapRef.current = {tankMeshes, wheelMeshes}
        modelGroup.add(root)

        // Initial rotation angle (3/4 front dynamic pose)
        modelGroup.rotation.y = 0.75

        setIsLoaded(true)
      },
      (xhr) => {
        if (xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100)
          setLoadingProgress(percent)
        } else {
          setLoadingProgress(70)
        }
      },
      (error) => {
        console.error('Error loading 3D model:', error)
        setIsLoaded(true) // fail gracefully
      },
    )

    // Mouse movement parallax state
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Scroll interaction: rotate model smoothly as user scrolls down the page
    let scrollRotationOffset = 0
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = Math.max(1000, document.body.scrollHeight - window.innerHeight)
      const scrollFraction = Math.min(1, scrollY / maxScroll)

      // Turn the bike across 360 degrees as user scrolls through the content
      scrollRotationOffset = scrollFraction * Math.PI * 2.2
    }
    window.addEventListener('scroll', handleScroll, {passive: true})

    // Resize handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // Target rotation & camera lerping
    const baseRotation = 0.75
    let currentRotation = 0.75

    // Animation Loop
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)

      // If user is not dragging with mouse, apply subtle mouse parallax + scroll rotation
      if (modelGroupRef.current) {
        if (!isInteractingRef.current) {
          const targetRot = baseRotation + scrollRotationOffset + mouseX * 0.25
          currentRotation = THREE.MathUtils.lerp(currentRotation, targetRot, 0.05)
          modelGroupRef.current.rotation.y = currentRotation

          // Subtle breathing floating tilt
          modelGroupRef.current.rotation.x = THREE.MathUtils.lerp(
            modelGroupRef.current.rotation.x,
            mouseY * 0.08,
            0.05,
          )
        }
      }

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      controls.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Apply livery material colors when changed
  useEffect(() => {
    const livery = LIVERIES[selectedLivery]
    const {tankMeshes, wheelMeshes} = materialsMapRef.current

    tankMeshes.forEach((mesh) => {
      if (mesh.material) {
        const mat = (mesh.material as THREE.MeshStandardMaterial).clone()
        mat.color.setHex(livery.tankColor)
        mat.metalness = 0.75
        mat.roughness = 0.25
        mesh.material = mat
      }
    })

    wheelMeshes.forEach((mesh) => {
      if (mesh.material) {
        const mat = (mesh.material as THREE.MeshStandardMaterial).clone()
        mat.color.setHex(livery.accentColor)
        mat.metalness = 0.9
        mat.roughness = 0.2
        mesh.material = mat
      }
    })
  }, [selectedLivery])

  // Camera fly-to hotspot
  const goToHotspot = (hotspot: (typeof HOTSPOTS)[number]) => {
    setActiveHotspot(hotspot.id)
    if (!controlsRef.current || !cameraRef.current) return

    const controls = controlsRef.current
    const camera = cameraRef.current

    // Animate camera and target
    const startCamPos = camera.position.clone()
    const targetCamPos = hotspot.camPos
    const startTarget = controls.target.clone()
    const targetTarget = hotspot.camTarget

    const duration = 1200
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const elapsed = timestamp - startTimestamp
      const progress = Math.min(1, elapsed / duration)
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3)

      camera.position.lerpVectors(startCamPos, targetCamPos, ease)
      controls.target.lerpVectors(startTarget, targetTarget, ease)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }

  // Reset Camera View
  const resetCamera = () => {
    setActiveHotspot(null)
    if (!controlsRef.current || !cameraRef.current) return
    const controls = controlsRef.current
    const camera = cameraRef.current

    const startPos = camera.position.clone()
    const targetPos = new THREE.Vector3(2.4, 1.2, 2.6)
    const startTarget = controls.target.clone()
    const targetTarget = new THREE.Vector3(0, 0.45, 0)

    let progress = 0
    const startTime = performance.now()
    const step = (now: number) => {
      progress = Math.min(1, (now - startTime) / 1000)
      const ease = 1 - Math.pow(1 - progress, 3)
      camera.position.lerpVectors(startPos, targetPos, ease)
      controls.target.lerpVectors(startTarget, targetTarget, ease)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  return (
    <div className="relative w-full h-[650px] md:h-[750px] rounded-3xl border border-white/10 bg-gradient-to-b from-[#0e0e13] via-[#09090c] to-[#060608] overflow-hidden shadow-2xl">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.6}}
            className="absolute inset-0 bg-[#08080b] flex flex-col items-center justify-center gap-4 z-30"
          >
            <div className="h-12 w-12 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />
            <div className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
              INITIALISATION DU MODÈLE 3D TEMPS RÉEL... {loadingProgress}%
            </div>
            <div className="w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300 rounded-full"
                style={{width: `${loadingProgress}%`}}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top HUD Overlay Banner */}
      <div className="absolute top-6 inset-x-6 flex flex-wrap items-center justify-between gap-4 pointer-events-none z-20">
        <div className="flex items-center gap-3">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 font-mono text-xs text-amber-300 font-bold backdrop-blur">
            <Rotate3d className="h-3.5 w-3.5" />
            <span>3D INTERACTIF // WEBGL ACADEMY</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[11px] text-zinc-400 backdrop-blur">
            <Move className="h-3 w-3 text-zinc-500" />
            <span>GLISSER : ROTATION 360° • SCROLL : CINÉMATIQUE</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <a
            href="https://www.yamaha-motor.eu/fr/fr/motorcycles/sport-heritage/pdp/xsr900/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-xs font-mono text-red-300 hover:text-white px-3 py-1.5 transition-colors backdrop-blur flex items-center gap-1.5"
          >
            <span>YAMAHA EU OFFICIEL ↗</span>
          </a>
          <button
            onClick={resetCamera}
            className="cursor-pointer rounded-full border border-white/10 bg-black/70 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white px-3.5 py-1.5 transition-colors backdrop-blur flex items-center gap-1.5"
          >
            <Compass className="h-3 w-3" />
            <span>RÉINITIALISER</span>
          </button>
        </div>
      </div>

      {/* Floating Hotspot Buttons (Left Panel) */}
      <div className="absolute left-6 bottom-24 z-20 space-y-2 pointer-events-auto max-w-xs">
        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">
          [ POINTS D&apos;INTÉRÊT CHÂSSIS & MOTEUR ]
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
                    : 'bg-black/60 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-900/80 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="h-3 w-3 opacity-70" />
                  <span>{spot.title}</span>
                </div>
                <span className={`text-[10px] ${isActive ? 'text-black/80' : 'text-zinc-500'}`}>
                  {spot.badge}
                </span>
              </button>
            )
          })}
        </div>

        {/* Hotspot details card popup */}
        <AnimatePresence>
          {activeHotspot && (
            <motion.div
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: 5}}
              className="mt-3 p-4 rounded-2xl border border-amber-500/30 bg-black/90 backdrop-blur-xl text-xs space-y-2 shadow-2xl"
            >
              {(() => {
                const spot = HOTSPOTS.find((h) => h.id === activeHotspot)
                if (!spot) return null
                return (
                  <>
                    <div className="flex items-center justify-between text-amber-400 font-mono font-bold">
                      <span>{spot.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20">
                        {spot.badge}
                      </span>
                    </div>
                    <p className="text-zinc-300 font-light leading-relaxed">
                      {spot.desc}
                    </p>
                  </>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Bar: Livery Customizer */}
      <div className="absolute bottom-6 inset-x-6 flex flex-wrap items-center justify-between gap-4 pointer-events-none z-20">
        {/* Livery Selector */}
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-black/80 p-2 backdrop-blur-xl">
          <span className="font-mono text-[11px] text-zinc-400 px-2 flex items-center gap-1.5">
            <Layers className="h-3 w-3 text-amber-400" />
            LIVRÉE :
          </span>

          <div className="flex gap-1.5">
            {LIVERIES.map((liv, idx) => (
              <button
                key={liv.name}
                onClick={() => setSelectedLivery(idx)}
                className={`cursor-pointer px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all ${
                  selectedLivery === idx
                    ? 'bg-amber-400 text-black shadow'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {liv.tag}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom hints */}
        <div className="hidden md:flex items-center gap-3 font-mono text-[11px] text-zinc-500 bg-black/50 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur">
          <ZoomIn className="h-3 w-3 text-zinc-400" />
          <span>MOLETTE POUR ZOONER • DOUBLE CLIC POUR CENTRER</span>
        </div>
      </div>
    </div>
  )
}
