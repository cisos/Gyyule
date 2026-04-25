import { config } from '../config'
import styles from './SellingPoints.module.css'

export function SellingPoints() {
  return (
    <section className={styles.wrap} aria-label="五大卖点">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.title}>五大卖点</div>
        </div>
        <div className={styles.list}>
          {config.sellingPoints.map((sp) => (
            <div key={sp.title} className={styles.card}>
              <div className={styles.cardTitle}>{sp.title}</div>
              <div className={styles.cardDesc}>{sp.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

