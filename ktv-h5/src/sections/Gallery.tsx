import { useMemo } from 'react'
import { config } from '../config'
import { Img } from '../components/Img.tsx'
import { publicUrl } from '../lib/publicUrl'
import styles from './Gallery.module.css'

function pickRandom<T>(arr: T[], n: number) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, Math.max(0, Math.min(n, a.length)))
}

export function Gallery() {
  const imgs = useMemo(
    () => pickRandom([...config.galleryImages] as string[], config.galleryDisplayCount ?? 6),
    [],
  )

  return (
    <section className={styles.wrap} aria-label="相册">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.title}>相册</div>
        </div>
        <div className={styles.grid}>
          {imgs.map((src) => (
            <Img key={src} className={styles.img} src={publicUrl(src)} alt="相册图片" />
          ))}
        </div>
      </div>
    </section>
  )
}

