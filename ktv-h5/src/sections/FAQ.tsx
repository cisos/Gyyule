import { useState } from 'react'
import { config } from '../config'
import styles from './FAQ.module.css'

export function FAQ() {
  const [open, setOpen] = useState<Record<number, boolean>>({})
  return (
    <section className={styles.wrap} aria-label="常见问题">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.title}>常见问题</div>
        </div>
        <div className={styles.list}>
          {config.faq.map((it, idx) => {
            const isOpen = !!open[idx]
            return (
              <button
                key={it.q}
                className={styles.item}
                type="button"
                onClick={() => setOpen((p) => ({ ...p, [idx]: !p[idx] }))}
                aria-expanded={isOpen}
              >
                <div className={styles.qRow}>
                  <div className={styles.q}>{it.q}</div>
                  <div className={styles.chev}>{isOpen ? '–' : '+'}</div>
                </div>
                {isOpen ? <div className={styles.a}>{it.a}</div> : null}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

