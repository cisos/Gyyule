import { config } from '../config'
import styles from './HowToBook.module.css'

export function HowToBook() {
  return (
    <section className={styles.wrap} aria-label="怎么订">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.title}>怎么订</div>
        </div>
        <div className={styles.steps}>
          {config.howToBook.map((s, idx) => (
            <div key={s.title} className={styles.step}>
              <div className={styles.num}>{idx + 1}</div>
              <div className={styles.right}>
                <div className={styles.stepTitle}>{s.title}</div>
                <div className={styles.desc}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

