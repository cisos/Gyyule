import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './ReviewMarquee.module.css'

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const m = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!m) return
    const onChange = () => setReduced(!!m.matches)
    onChange()
    m.addEventListener?.('change', onChange)
    return () => m.removeEventListener?.('change', onChange)
  }, [])
  return reduced
}

export function ReviewMarquee({
  reviews,
  speedPxPerSec = 72,
}: {
  reviews: { text: string }[]
  speedPxPerSec?: number
}) {
  const prefersReduced = usePrefersReducedMotion()
  const items = useMemo(() => {
    const base = shuffle(reviews)
    return [...base, ...base]
  }, [reviews])

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const xRef = useRef(0)
  const pausedRef = useRef(false)
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<{ startX: number; startOffset: number } | null>(null)

  useEffect(() => {
    if (prefersReduced) return
    const loop = (ts: number) => {
      if (!trackRef.current) return
      if (pausedRef.current) {
        lastTsRef.current = ts
        rafRef.current = requestAnimationFrame(loop)
        return
      }
      const last = lastTsRef.current ?? ts
      const dt = Math.min(32, ts - last)
      lastTsRef.current = ts
      xRef.current -= (speedPxPerSec * dt) / 1000
      const trackW = trackRef.current.scrollWidth
      const half = trackW / 2
      if (half > 0 && -xRef.current >= half) xRef.current += half
      trackRef.current.style.transform = `translate3d(${xRef.current}px,0,0)`
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastTsRef.current = null
    }
  }, [prefersReduced, speedPxPerSec])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onDown = (e: PointerEvent) => {
      pausedRef.current = true
      setDragging(true)
      dragRef.current = { startX: e.clientX, startOffset: xRef.current }
      el.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current || !trackRef.current) return
      const dx = e.clientX - dragRef.current.startX
      xRef.current = dragRef.current.startOffset + dx
      trackRef.current.style.transform = `translate3d(${xRef.current}px,0,0)`
    }
    const onUp = () => {
      dragRef.current = null
      setDragging(false)
      pausedRef.current = false
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <section className={styles.wrap} aria-label="用户评价">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.title}>用户评价</div>
          <div className={styles.sub}>真实反馈 · 仅供参考</div>
        </div>
        <div
          ref={viewportRef}
          className={`${styles.viewport} ${dragging ? styles.dragging : ''}`}
          aria-label="滚动评价"
        >
          <div ref={trackRef} className={styles.track}>
            {items.map((r, idx) => (
              <div key={`${idx}_${r.text}`} className={styles.card}>
                <div className={styles.text}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

