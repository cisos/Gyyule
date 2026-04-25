import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { track } from './analytics'
import { config } from './config'
import { BottomBar } from './components/BottomBar'
import { PosterModal } from './components/PosterModal'
import { ShareModal } from './components/ShareModal'
import { useToast } from './components/toast'
import { copyText } from './lib/clipboard'
import { generatePoster } from './lib/poster'
import { FAQ } from './sections/FAQ'
import { Footer } from './sections/Footer'
import { Gallery } from './sections/Gallery'
import { Hero } from './sections/Hero'
import { HowToBook } from './sections/HowToBook'
import { SellingPoints } from './sections/SellingPoints'
import styles from './App.module.css'
import { ReviewMarquee } from './components/ReviewMarquee'

function App() {
  const toast = useToast()
  const [shareOpen, setShareOpen] = useState(false)
  const [posterOpen, setPosterOpen] = useState(false)
  const [posterUrl, setPosterUrl] = useState<string | null>(null)
  const posterBlobRef = useRef<Blob | null>(null)

  const askTemplate = useMemo(() => config.askTemplate(config.wechatId, config.phone), [])
  const shareUrl = useMemo(() => window.location.href, [])

  useEffect(() => {
    track('page_view', { title: config.share.title })
  }, [])

  const onCopyWechat = useCallback(async () => {
    track('click_copy_wechat', { wechatId: config.wechatId })
    const ok = await copyText(config.wechatId)
    toast.show(ok ? '微信号已复制' : '复制失败，请手动选择复制', ok ? 'success' : 'error')
  }, [toast])

  const onCallPhone = useCallback(() => {
    track('click_call_phone', { phone: config.phone })
    try {
      window.location.href = `tel:${config.phone}`
    } catch {
      toast.show('拨号失败，请手动拨打', 'error')
    }
  }, [toast])

  const onCopyTemplate = useCallback(async () => {
    track('click_copy_template')
    const ok = await copyText(askTemplate)
    toast.show(ok ? '询问模板已复制' : '复制失败，请手动选择复制', ok ? 'success' : 'error')
  }, [toast, askTemplate])

  const onOpenShareReward = useCallback(() => {
    track('click_share_reward')
    setShareOpen(true)
  }, [])

  const onCloseShare = useCallback(() => {
    setShareOpen(false)
  }, [])

  const onCopyShareLink = useCallback(async () => {
    track('click_copy_share_link')
    const ok = await copyText(shareUrl)
    toast.show(ok ? '链接已复制' : '复制失败，请手动复制地址栏链接', ok ? 'success' : 'error')
  }, [toast, shareUrl])

  const onSystemShare = useCallback(async () => {
    track('click_system_share')
    const payload = `${config.shareReward.shareText}${shareUrl}`
    try {
      if (navigator.share) {
        await navigator.share({
          title: config.share.title,
          text: payload,
          url: shareUrl,
        })
        toast.show('已调用系统分享', 'success')
        return
      }
    } catch (e) {
      track('system_share_failed', { message: e instanceof Error ? e.message : String(e) })
    }
    const ok = await copyText(payload)
    toast.show(ok ? '已复制分享文案与链接' : '分享失败，请手动复制链接', ok ? 'success' : 'error')
  }, [toast, shareUrl])

  const onGeneratePoster = useCallback(async () => {
    track('click_generate_poster')
    toast.show('生成海报中…', 'info')
    try {
      const res = await generatePoster()
      posterBlobRef.current = res.blob
      setPosterUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return res.objectUrl
      })
      setPosterOpen(true)
      toast.show('海报已生成', 'success')
      track('poster_generated', { w: res.width, h: res.height })
    } catch (e) {
      toast.show('海报生成失败，请稍后重试', 'error')
      track('poster_generate_failed', { message: e instanceof Error ? e.message : String(e) })
    }
  }, [toast])

  const onClosePoster = useCallback(() => {
    setPosterOpen(false)
  }, [])

  const onDownloadPoster = useCallback(() => {
    track('click_download_poster')
    if (!posterBlobRef.current || !posterUrl) return
    const a = document.createElement('a')
    a.href = posterUrl
    a.download = `海报-${config.wechatId}.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }, [posterUrl])

  useEffect(() => {
    return () => {
      if (posterUrl) URL.revokeObjectURL(posterUrl)
    }
  }, [posterUrl])

  return (
    <div className={styles.app}>
      <div className={styles.topLine} aria-hidden="true" />
      <Hero />
      <SellingPoints />
      <ReviewMarquee reviews={config.reviews} speedPxPerSec={72} />
      <Gallery />
      <HowToBook />
      <FAQ />
      <Footer />

      <BottomBar
        phone={config.phone}
        onCopyWechat={onCopyWechat}
        onCallPhone={onCallPhone}
        onCopyTemplate={onCopyTemplate}
        onShareReward={onOpenShareReward}
        onGeneratePoster={onGeneratePoster}
      />

      <ShareModal
        open={shareOpen}
        url={shareUrl}
        onClose={onCloseShare}
        onShare={onSystemShare}
        onCopyLink={onCopyShareLink}
      />

      <PosterModal
        open={posterOpen}
        imageUrl={posterUrl}
        onClose={onClosePoster}
        onDownload={onDownloadPoster}
      />
    </div>
  )
}

export default App
