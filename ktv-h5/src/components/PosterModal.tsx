import { useEffect } from 'react'
import styles from './PosterModal.module.css'

export function PosterModal({
  open,
  imageUrl,
  onClose,
  onDownload,
}: {
  open: boolean
  imageUrl: string | null
  onClose: () => void
  onDownload: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.mask} role="dialog" aria-modal="true" aria-label="海报预览">
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>海报已生成</div>
          <button className={styles.close} type="button" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>

        <div className={styles.hint}>
          下载后可转发；也可<strong>长按图片保存</strong>到相册。
        </div>

        <div className={styles.preview}>
          {imageUrl ? <img className={styles.img} src={imageUrl} alt="海报预览" /> : <div className={styles.skeleton} />}
        </div>

        <div className={styles.actions}>
          <button className={styles.btnGhost} type="button" onClick={onClose}>
            关闭
          </button>
          <button className={styles.btn} type="button" onClick={onDownload} disabled={!imageUrl}>
            下载海报
          </button>
        </div>
      </div>
    </div>
  )
}

