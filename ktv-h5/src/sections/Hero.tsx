import { config } from '../config'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.kicker}>{config.hero.kicker}</div>
        <h1 className={styles.title}>{config.hero.title}</h1>
        <p className={styles.subtitle}>{config.hero.subtitle}</p>

        <div className={styles.pills}>
          {config.hero.bullets.map((b) => (
            <div key={b} className={styles.pill}>
              {b}
            </div>
          ))}
        </div>

        <div className={styles.notice}>{config.hero.notice}</div>

        <div className={styles.contact}>
          <div className={styles.line}>
            <span className={styles.label}>姓名</span>
            <span className={styles.value}>{config.contactName}</span>
          </div>
          <div className={styles.line}>
            <span className={styles.label}>微信</span>
            <span className={styles.value}>{config.wechatId}</span>
          </div>
          <div className={styles.line}>
            <span className={styles.label}>电话</span>
            <span className={styles.value}>{config.phone}</span>
          </div>
          <div className={styles.line}>
            <span className={styles.label}>宗旨</span>
            <span className={styles.value}>{config.budgetText}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

