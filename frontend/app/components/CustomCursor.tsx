'use client'

import {useEffect, useState} from 'react'
import {motion} from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({x: -100, y: -100})
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only enable on fine pointer devices (desktop)
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({x: e.clientX, y: e.clientY})
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target?.closest('a') ||
        target?.closest('button') ||
        target?.closest('[role="button"]') ||
        target?.closest('input')
      ) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <>
      {/* Small precision dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{type: 'spring', damping: 40, stiffness: 600, mass: 0.1}}
      />

      {/* Outer magnetic ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-white/30 pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - (isHovered ? 24 : 16),
          y: mousePosition.y - (isHovered ? 24 : 16),
          width: isHovered ? 48 : 32,
          height: isHovered ? 48 : 32,
          scale: isHovered ? 1.2 : 1,
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.25)',
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0)',
        }}
        transition={{type: 'spring', damping: 25, stiffness: 300, mass: 0.2}}
      />
    </>
  )
}
