import { config } from '../config'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.wrap} aria-label="页脚">
      <div className={styles.inner}>
        <div className={styles.brand}>{config.brandName}</div>
        <div className={styles.contact}>
          <div>微信：{config.wechatId}</div>
          <div>电话：{config.phone}</div>
        </div>
        <div className={styles.note}>{config.footer.compliance}</div>
      </div>
    </footer>
  )
}

