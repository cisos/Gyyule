import { useState } from 'react'
import styles from './Img.module.css'

export function Img({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [bad, setBad] = useState(false)
  if (bad) return <div className={`${styles.fallback} ${className ?? ''}`} aria-label={alt} />
  return <img className={className} src={src} alt={alt} onError={() => setBad(true)} loading="lazy" />
}

