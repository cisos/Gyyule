import styles from './BottomBar.module.css'

export function BottomBar({
  phone,
  onCopyWechat,
  onCallPhone,
  onCopyTemplate,
  onShareReward,
  onGeneratePoster,
}: {
  phone: string
  onCopyWechat: () => void
  onCallPhone: () => void
  onCopyTemplate: () => void
  onShareReward: () => void
  onGeneratePoster: () => void
}) {
  return (
    <div className={styles.wrap} aria-label="快捷操作">
      <div className={styles.bar}>
        <button className={styles.btn} type="button" onClick={onCopyWechat}>
          <span className={styles.icon} aria-hidden="true">
            ⧉
          </span>
          复制微信号
        </button>
        <a
          className={styles.btn}
          href={`tel:${phone}`}
          onClick={(e) => {
            e.preventDefault()
            onCallPhone()
          }}
        >
          <span className={styles.icon} aria-hidden="true">
            ☎
          </span>
          电话直拨
        </a>
        <button className={styles.btn} type="button" onClick={onCopyTemplate}>
          <span className={styles.icon} aria-hidden="true">
            ✎
          </span>
          复制询问模板
        </button>
        <button className={`${styles.btn} ${styles.primary}`} type="button" onClick={onShareReward}>
          <span className={styles.icon} aria-hidden="true">
            ⤴
          </span>
          分享送好礼最高2000优惠
        </button>
        <button className={styles.btn} type="button" onClick={onGeneratePoster}>
          <span className={styles.icon} aria-hidden="true">
            ⬇
          </span>
          生成海报
        </button>
      </div>
      <div className={styles.safeSpace} aria-hidden="true" />
    </div>
  )
}

