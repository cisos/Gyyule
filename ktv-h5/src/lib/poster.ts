import QRCode from 'qrcode'
import { config } from '../config'
import { publicUrl } from './publicUrl'

export type PosterResult = {
  blob: Blob
  objectUrl: string
  width: number
  height: number
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

async function getWechatQrImage(): Promise<HTMLImageElement> {
  try {
    return await loadImage(publicUrl('wechat-qr.png'))
  } catch {
    try {
      return await loadImage(publicUrl('wechat-qr.jpg'))
    } catch {
      try {
        return await loadImage(publicUrl('wechat-qr.JPG'))
      } catch {
        const dataUrl = await QRCode.toDataURL(config.wechatId, {
          margin: 1,
          width: 520,
          color: { dark: '#EDE7FF', light: '#00000000' },
        })
        return await loadImage(dataUrl)
      }
    }
  }
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
  stroke?: string,
) {
  roundRectPath(ctx, x, y, w, h, r)
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = 2
    ctx.stroke()
  }
}

function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const iw = img.naturalWidth || img.width
  const ih = img.naturalHeight || img.height
  const s = Math.min(w / iw, h / ih)
  const dw = iw * s
  const dh = ih * s
  const dx = x + (w - dw) / 2
  const dy = y + (h - dh) / 2
  ctx.drawImage(img, dx, dy, dw, dh)
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.replace(/\s+/g, ' ').trim().split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (ctx.measureText(next).width <= maxWidth) line = next
    else {
      if (line) lines.push(line)
      line = w
    }
  }
  if (line) lines.push(line)
  return lines
}

function wrapCN(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = []
  let line = ''
  for (const ch of text) {
    const next = line + ch
    if (ctx.measureText(next).width <= maxWidth) line = next
    else {
      if (line) lines.push(line)
      line = ch
    }
  }
  if (line) lines.push(line)
  return lines
}

function randomInviteCode5(): string {
  return String(Math.floor(10000 + Math.random() * 90000))
}

function getOrCreateInviteCodeForPhone(phone: string) {
  const key = `__invite_code_phone_${phone}`
  try {
    const existing = localStorage.getItem(key)
    if (existing && /^\d{5}$/.test(existing)) return existing
    const next = randomInviteCode5()
    localStorage.setItem(key, next)
    return next
  } catch {
    // localStorage 不可用时，退化为本次随机
    return randomInviteCode5()
  }
}

export async function generatePoster(): Promise<PosterResult> {
  const width = 1080
  const height = 1920
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  const bg = ctx.createLinearGradient(0, 0, 0, height)
  bg.addColorStop(0, '#05050A')
  bg.addColorStop(0.55, '#0B0A12')
  bg.addColorStop(1, '#05050A')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  const glow1 = ctx.createRadialGradient(width * 0.18, height * 0.2, 20, width * 0.18, height * 0.2, 820)
  glow1.addColorStop(0, 'rgba(168, 85, 247, .22)')
  glow1.addColorStop(0.5, 'rgba(59, 130, 246, .10)')
  glow1.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow1
  ctx.fillRect(0, 0, width, height)

  const glow2 = ctx.createRadialGradient(width * 0.85, height * 0.86, 20, width * 0.85, height * 0.86, 900)
  glow2.addColorStop(0, 'rgba(34, 211, 238, .12)')
  glow2.addColorStop(0.55, 'rgba(168, 85, 247, .10)')
  glow2.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow2
  ctx.fillRect(0, 0, width, height)

  const pad = 76
  const top = 86

  ctx.font = '700 30px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  const pillText = '一站式对接 · 省心靠谱'
  const pillW = ctx.measureText(pillText).width + 44
  const pillH = 54
  fillRoundRect(ctx, pad, top, pillW, pillH, 18, 'rgba(255,255,255,.08)', 'rgba(255,255,255,.10)')
  ctx.fillStyle = 'rgba(255,255,255,.86)'
  ctx.fillText(pillText, pad + 22, top + 37)

  ctx.font = '900 96px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,.96)'
  ctx.fillText(`${config.city}商务KTV订房`, pad, top + 170)

  ctx.font = '800 42px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  ctx.fillStyle = 'rgba(235,225,255,.86)'
  ctx.fillText(`${config.contactName} · ${config.brandName}`, pad, top + 240)

  const panelX = pad
  const panelY = top + 300
  const panelW = width - pad * 2
  const panelH = 860
  fillRoundRect(ctx, panelX, panelY, panelW, panelH, 34, 'rgba(255,255,255,.06)', 'rgba(255,255,255,.10)')

  ctx.font = '900 46px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,.88)'
  ctx.fillText('咨询方式', panelX + 44, panelY + 96)

  const leftX = panelX + 44
  const leftY = panelY + 130
  const leftW = 420
  const cardH = 152
  const gap = 18
  const cardFill = 'rgba(0,0,0,.22)'
  const cardStroke = 'rgba(255,255,255,.10)'

  const drawKV = (i: number, k: string, v: string) => {
    const y = leftY + i * (cardH + gap)
    fillRoundRect(ctx, leftX, y, leftW, cardH, 26, cardFill, cardStroke)
    ctx.font = '800 30px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,.66)'
    ctx.fillText(k, leftX + 28, y + 56)
    ctx.font = '900 44px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,.92)'
    ctx.fillText(v, leftX + 28, y + 112)
  }

  drawKV(0, '微信', config.wechatId)
  drawKV(1, '电话', config.phone)

  const principleY = leftY + 2 * (cardH + gap)
  fillRoundRect(ctx, leftX, principleY, leftW, cardH, 26, cardFill, cardStroke)
  ctx.font = '800 30px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,.66)'
  ctx.fillText('宗旨', leftX + 28, principleY + 56)
  ctx.font = '900 36px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,.92)'
  const maxTextW = leftW - 56
  const lines = wrapCN(ctx, config.budgetText, maxTextW).slice(0, 2)
  ctx.fillText(lines[0] ?? '', leftX + 28, principleY + 106)
  if (lines[1]) ctx.fillText(lines[1], leftX + 28, principleY + 146)

  const chipsY = principleY + cardH + 18
  let chipX = leftX
  const chipH = 56
  ctx.font = '900 30px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  for (const chip of config.perksList) {
    const w = ctx.measureText(chip).width + 46
    fillRoundRect(ctx, chipX, chipsY, w, chipH, 20, 'rgba(192,132,252,.18)', 'rgba(192,132,252,.32)')
    ctx.fillStyle = 'rgba(235,225,255,.92)'
    ctx.fillText(chip, chipX + 23, chipsY + 38)
    chipX += w + 12
    if (chipX + 140 > leftX + leftW) break
  }
  ctx.font = '700 24px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,.58)'
  ctx.fillText(config.perksText, leftX, chipsY + 92)

  const qrSize = 420
  const qrX = panelX + panelW - 44 - qrSize
  const qrY = panelY + 160
  fillRoundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 30, 'rgba(255,255,255,.07)', 'rgba(255,255,255,.10)')

  const qrImg = await getWechatQrImage()
  fillRoundRect(ctx, qrX, qrY, qrSize, qrSize, 26, 'rgba(255,255,255,.92)')
  ctx.save()
  roundRectPath(ctx, qrX, qrY, qrSize, qrSize, 26)
  ctx.clip()
  drawContain(ctx, qrImg, qrX + 18, qrY + 18, qrSize - 36, qrSize - 36)
  ctx.restore()

  ctx.font = '900 34px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,.86)'
  ctx.fillText('扫码加微信', qrX, qrY + qrSize + 70)
  ctx.font = '700 26px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,.60)'
  ctx.fillText('咨询更快确认', qrX, qrY + qrSize + 112)

  const bottomY = panelY + panelH + 130
  ctx.font = '900 44px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,.92)'
  ctx.fillText('保存相册后加微信咨询', pad, bottomY)

  ctx.font = '700 28px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,.62)'
  const desc = '分享送好礼，最高2000优惠。'
  const descLines = wrapLines(ctx, desc, width - pad * 2)
  ctx.fillText(descLines[0] ?? '', pad, bottomY + 56)

  const inviteCode = getOrCreateInviteCodeForPhone(config.phone)
  ctx.font = '900 32px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  ctx.fillStyle = 'rgba(235,225,255,.84)'
  ctx.fillText(`邀请码：${inviteCode}`, pad, bottomY + 108)

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => {
      if (!b) reject(new Error('toBlob failed'))
      else resolve(b)
    }, 'image/png')
  })
  const objectUrl = URL.createObjectURL(blob)
  return { blob, objectUrl, width, height }
}

