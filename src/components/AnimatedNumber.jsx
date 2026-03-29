import { useEffect, useMemo, useRef, useState } from 'react'

function useCountUp(target, { durationMs = 450 } = {}) {
  const t = Number.isFinite(target) ? target : 0
  const [value, setValue] = useState(t)
  const rafRef = useRef(0)
  const fromRef = useRef(t)
  const startRef = useRef(0)
  const lastTargetRef = useRef(t)

  useEffect(() => {
    if (lastTargetRef.current === t) return
    lastTargetRef.current = t

    cancelAnimationFrame(rafRef.current)
    fromRef.current = value
    startRef.current = performance.now()

    const tick = (now) => {
      const elapsed = now - startRef.current
      const p = Math.min(1, elapsed / durationMs)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      const next = fromRef.current + (t - fromRef.current) * eased
      setValue(next)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [t, durationMs, value])

  return value
}

export default function AnimatedNumber({ value, format, className }) {
  const animated = useCountUp(value)
  const text = useMemo(() => (format ? format(animated) : String(animated)), [animated, format])
  return <span className={className}>{text}</span>
}

