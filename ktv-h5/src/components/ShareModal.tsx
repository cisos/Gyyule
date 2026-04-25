import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { config } from '../config'
import styles from './ShareModal.module.css'

function useShareQrDataUrl(open: boolean, url: string) {
  const key = `__share_qr_${url}`
  const cached = useMemo(() => {
    try {
      return sessionStorage.getItem(key)
    } catch {
      return null
    }
  }, [key])

  const [dataUrl, setDataUrl] = useState<string | null>(cached)

  useEffect(() => {
    if (!open) return
    if (dataUrl) return
    let cancelled = false
    ;(async () => {
      const u = await QRCode.toDataURL(url, {
        margin: 1,
        width: 420,
        color: { dark: '#EDE7FF', light: '#00000000' },
      })
      if (cancelled) return
      setDataUrl(u)
      try {
        sessionStorage.setItem(key, u)
      } catch {
        // ignore
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, url, dataUrl, key])

  return dataUrl
}

export function ShareModal({
  open,
  url,
  onClose,
  onShare,
  onCopyLink,
}: {
  open: boolean
  url: string
  onClose: () => void
  onShare: () => void
  onCopyLink: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const qr = useShareQrDataUrl(open, url)
  if (!open) return null

  return (
    <div className={styles.mask} role="dialog" aria-modal="true" aria-label="分享送好礼">
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>{config.shareReward.title}</div>
          <button className={styles.close} type="button" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>

        <div className={styles.sub}>{config.shareReward.subtitle}</div>

        <div className={styles.body}>
          <div className={styles.qrBox}>
            {qr ? <img className={styles.qr} src={qr} alt="分享二维码" /> : <div className={styles.qrSkel} />}
            <div className={styles.qrHint}>扫一扫也能打开链接</div>
          </div>

          <div className={styles.tips}>
            <div className={styles.tipTitle}>怎么分享</div>
            <div className={styles.tipItem}>1）点“系统分享”发给朋友/群</div>
            <div className={styles.tipItem}>2）朋友点开链接后，可直接加微信/电话咨询</div>
            <div className={styles.tipNote}>说明：优惠/礼遇以当天为准，具体以沟通确认为准。</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnGhost} type="button" onClick={onCopyLink}>
            复制链接
          </button>
          <button className={styles.btn} type="button" onClick={onShare}>
            系统分享
          </button>
        </div>
      </div>
    </div>
  )
}

