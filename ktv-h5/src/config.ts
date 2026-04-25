export type FAQItem = { q: string; a: string }
export type ReviewItem = { text: string }

export const config = {
  brandName: '贵阳商务KTV订房-王澳',
  contactName: '王澳',
  city: '贵阳',
  wechatId: 'Gyyule',
  phone: '18990141870',
  budgetText: '花最少的钱，享最好的服务',
  perksText: '礼遇可谈（以当天为准）',
  perksList: ['免房费', '送果盘', '送啤酒'] as const,

  share: {
    title: '贵阳商务KTV订房｜王澳',
    description: '预算友好 · 礼遇可谈（以当天为准）· 透明沟通 · 快速确认',
    ogImage: '/share-thumb.png',
  },

  shareReward: {
    title: '分享送好礼',
    subtitle: '最高2000优惠（以当天为准）',
    shareText:
      '分享送好礼最高2000优惠（以当天为准）。\n\n贵阳商务KTV订房-王澳\n微信：Gyyule\n电话：18990141870\n\n点开链接可直接咨询：',
    /**
     * 弹窗里的二维码：`public` 目录下的文件名，例如 `wechat-qr.JPG` 或 `share-modal-qr.png`。
     * 改成 `null` 则二维码为「当前页面链接」（自动生成）。
     */
    modalQrImage: 'share-wecom-qr.png' as string | null,
    /** 使用 `modalQrImage` 时，二维码下方这行字 */
    modalQrHint: '扫一扫添加微信',
  },

  hero: {
    kicker: '【贵阳】KTV驻场一站式安排，贵阳最靠谱全程有保障',
    title: '贵阳商务KTV订房',
    subtitle: '预算友好、沟通清晰、到店更安心。礼遇可谈（以当天为准），提前确认更省心。',
    bullets: ['一键加微信', '电话直拨', '方案更清晰', '分享领礼遇'],
    notice: '温馨提示：礼遇与房态以当天为准，具体以沟通确认为准。',
  },

  sellingPoints: [
    { title: '低价酒模式', desc: '1280元可享全房型畅饮' },
    { title: '无任何隐形消费', desc: '多少人就花多少钱，没有额外费用' },
    { title: '小时计费模式', desc: '按小时计费，玩到几点算几点，不浪费一分钱' },
    { title: '新人报道', desc: '全场人数100+，新店开业，优惠多多' },
    { title: '包间有保障', desc: '提前沟通，无任何定金，到店直接开房无需等待' },
  ],

  reviews: [
    { text: '新茶挺多的，玩起来不尴尬。' },
    { text: '贵阳这边算体验不错的。' },
    { text: '小王安排挺快，回得也快。' },
    { text: '省心，他这点做到了。' },
    { text: '没有一直推贵的，这点我喜欢。' },
    { text: '人挺实在，不坑。' },
    { text: '临时订的，也没翻车。' },
    { text: '沟通顺，安排顺，到店也顺。' },
    { text: '我就一句话：稳。' },
    { text: '不会乱承诺，挺靠谱。' },
  ] satisfies ReviewItem[],

  galleryImages: [
    '/gallery/1.JPG',
    '/gallery/2.JPG',
    '/gallery/3.JPG',
    '/gallery/4.JPG',
    '/gallery/5.JPG',
    '/gallery/6.JPG',
  ],
  galleryDisplayCount: 6,

  howToBook: [
    { title: '发我需求', desc: '人数 + 到店时间 + 预算 + 偏好（安静/热闹/商务）。' },
    { title: '我来匹配', desc: '按房态与预算给你可选方案，礼遇可谈（以当天为准）。' },
    { title: '确认到店', desc: '确认地址/时间/房型，到了更省心。' },
  ],

  faq: [
    {
      q: '礼遇有哪些？',
      a: '常见礼遇：免房费/送果盘/送啤酒等。礼遇可谈（以当天为准），以沟通确认为准。',
    },
    {
      q: '怎么最快确认？',
      a: '发我：人数 + 到店时间 + 预算（1000-2000）+ 偏好。我会按房态给到合适方案。',
    },
    { q: '可以电话沟通吗？', a: '可以，点击底部“电话直拨”即可直接拨打。' },
    {
      q: '分享怎么领礼遇？',
      a: '点击底部“分享送好礼”，通过系统分享发给朋友/群。对方点开链接后，带截图或说明来源来咨询，我会按当天房态给你安排与礼遇说明（以当天为准）。',
    },
    { q: '海报怎么保存？', a: '点击底部“生成海报”，在预览中可下载；也可长按图片保存到相册后转发。' },
  ] satisfies FAQItem[],

  footer: {
    compliance: '本页面为订房咨询信息展示，具体以沟通确认为准。礼遇可谈（以当天为准）。',
  },

  askTemplate: (wechatId: string, phone: string) =>
    `你好，我想咨询贵阳商务KTV订房：\n` +
    `1）人数：\n` +
    `2）到店时间：\n` +
    `3）预算：1000-2000（可微调）\n` +
    `4）偏好：安静/热闹/偏商务/包间大小\n` +
    `微信：${wechatId}\n` +
    `电话：${phone}\n`,
} as const

