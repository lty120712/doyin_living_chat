import { reactive, computed } from 'vue'
import defaultConfig from '../data/defaultConfig.json'

function parseNum(s) {
  if (typeof s !== 'string') s = String(s)
  s = s.replace(/[^0-9.万千k]/g, '')
  if (s.includes('万')) return Math.round(parseFloat(s) * 10000)
  if (s.includes('k')) return Math.round(parseFloat(s) * 1000)
  return parseInt(s) || 0
}

function fmtNum(n) {
  if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '万'
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

const guestColors = ['#5292ff', '#ffd400', '#ff6b9d', '#00c9a7', '#a855f7', '#f97316']

const giftList = [
  { id: 'heart', name: '小心心', price: '1', color: '#ff2d55' },
  { id: 'lollipop', name: '棒棒糖', price: '9', color: '#ff6b9d' },
  { id: 'flower', name: '鲜花', price: '10', color: '#f97316' },
  { id: 'beer', name: '大啤酒', price: '99', color: '#f59e0b' },
  { id: 'kiss', name: '亲吻', price: '99', color: '#ec4899' },
  { id: 'popper', name: '礼花筒', price: '199', color: '#8b5cf6' },
  { id: 'crane', name: '纸鹤', price: '299', color: '#06b6d4' },
  { id: 'world', name: '环游世界', price: '399', color: '#3b82f6' },
  { id: 'train', name: '浪漫列车', price: '399', color: '#ef4444' },
  { id: 'porsche', name: '保时捷', price: '1200', color: '#64748b' },
  { id: 'sportcar', name: '跑车', price: '1200', color: '#f43f5e' },
  { id: 'castle', name: '梦幻城堡', price: '3000', color: '#a855f7' },
  { id: 'jet', name: '私人飞机', price: '3000', color: '#0284c7' },
  { id: 'unicorn', name: '独角兽', price: '8888', color: '#e11d48' },
  { id: 'dragon', name: '龙', price: '10000', color: '#dc2626' },
  { id: 'rocket', name: '火箭', price: '10001', color: '#ea580c' },
  { id: 'douyin1', name: '抖音1号', price: '10001', color: '#2563eb' },
  { id: 'carnival', name: '嘉年华', price: '30000', color: '#c026d3' },
]

const defaultAudience = defaultConfig.audience

const state = reactive({
  roomTitle: defaultConfig.room?.title || '主播的直播间',
  hostName: defaultConfig.room?.hostName || '主播',
  subtitle: defaultConfig.room?.subtitle || '',
  viewers: defaultConfig.room?.viewers || '1.2万',
  pkLabel: defaultConfig.room?.pkLabel || '多人连麦',
  placeholder: defaultConfig.room?.placeholder || '说点什么...',
  likeCount: 32000,
  commentCount: 892,
  _likeInit: '3.2万',
  _commentInit: '892',
  guests: [],
  guestCounter: 0,

  audience: [...defaultAudience.map(a => ({ name: a.name, avatar: a.avatar, contribution: a.contribution || 0, texts: [...(a.texts || [])] }))],
  danmuAutoRunning: false,
  danmuFreq: 4000,
  danmuSentCount: 0,

  likeAutoRunning: false,
  likeFreq: 1000,
  likeBatch: 1,

  lianmaiSeconds: 0,

  giftPickerVisible: false,
  giftToastText: '',
  giftToastVisible: false,
  activeGiftOverlays: [],
  giftAutoRunning: false,
  giftAutoFreq: 5000,
  giftAutoGiftIndex: 0,
  giftSentCount: 0,

  danmuList: [],
  hearts: [],
  rankPanelVisible: false,

  currentTime: '',
})

const rankList = computed(() => [...state.audience].sort((a, b) => b.contribution - a.contribution))

function initAudience() {
  state.audience = defaultAudience.map(a => ({
    name: a.name, avatar: a.avatar, contribution: a.contribution || 0,
    texts: [...(a.texts || [])],
  }))
}

function bumpRandomRanker(amount) {
  if (state.audience.length === 0) return
  const idx = Math.floor(Math.random() * state.audience.length)
  state.audience[idx].contribution += amount
}

function updateClock() {
  const d = new Date()
  const h = d.getHours()
  const m = d.getMinutes()
  state.currentTime = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m
}

function initStats() {
  state.likeCount = parseNum(state._likeInit || '3.2万')
  state.commentCount = parseNum(state._commentInit || '892')
}

function getHostLayout(count) {
  if (count === 0) return { left: 110, top: 50, width: 860, height: 1370 }
  if (count === 1) return { left: 24, top: 88, width: 620, height: 1340 }
  if (count <= 3) return { left: 24, top: 88, width: 540, height: 1200 }
  if (count <= 6) return { left: 24, top: 88, width: 460, height: 1040 }
  if (count <= 10) return { left: 24, top: 88, width: 380, height: 860 }
  if (count <= 16) return { left: 24, top: 88, width: 320, height: 720 }
  if (count <= 24) return { left: 24, top: 88, width: 280, height: 580 }
  return { left: 24, top: 88, width: 250, height: 480 }
}

function getGuestLayout(count) {
  if (count === 0) return []

  const CANVAS_W = 1080, CANVAS_H = 1920
  const MARGIN = 24, GAP = 8
  const HOST_TOP = 88
  const BOTTOM_GUARD = 540

  const host = getHostLayout(count)
  const layouts = []

  if (count <= 6) {
    const availW = CANVAS_W - MARGIN - host.width - GAP * 2
    const guestW = Math.min(400, availW)
    const availH = CANVAS_H - HOST_TOP - BOTTOM_GUARD

    if (count === 1) {
      const gh = Math.min(640, availH)
      layouts.push({ left: MARGIN + host.width + GAP, top: HOST_TOP + (availH - gh) / 2, width: guestW, height: gh })
    } else if (count === 2 || count === 3) {
      const gh = Math.min(count === 2 ? 580 : 380, (availH - GAP * (count - 1)) / count)
      for (let i = 0; i < count; i++) {
        layouts.push({ left: MARGIN + host.width + GAP, top: HOST_TOP + i * (gh + GAP), width: guestW, height: gh })
      }
    } else {
      const cols = 2
      const rows = Math.ceil(count / cols)
      const cw = Math.min(190, (availW - GAP) / cols)
      const ch = Math.min(260, (availH - GAP * (rows - 1)) / rows)
      for (let i = 0; i < count; i++) {
        const col = i % cols
        const row = Math.floor(i / cols)
        layouts.push({
          left: MARGIN + host.width + GAP + col * (cw + GAP),
          top: HOST_TOP + row * (ch + GAP),
          width: cw,
          height: ch,
        })
      }
    }
    return layouts
  }

  const guestRight = CANVAS_W - MARGIN
  const hostRight = host.left + host.width
  const hostBottom = host.top + host.height

  const rightAvailW = guestRight - hostRight - GAP
  const fullAvailW = guestRight - MARGIN
  const belowAvailH = CANVAS_H - hostBottom - GAP - BOTTOM_GUARD

  let cols = count <= 10 ? 3 : count <= 16 ? 4 : count <= 24 ? 5 : 6
  let cw = Math.floor((fullAvailW - GAP * (cols - 1)) / cols)
  let ch = Math.floor((belowAvailH + host.height - GAP * (Math.ceil(count / cols) - 1)) / Math.ceil(count / cols))
  cw = Math.max(90, cw)
  ch = Math.max(120, ch)

  const rightCols = rightAvailW > cw ? Math.min(cols, Math.floor((rightAvailW + GAP) / (cw + GAP))) : 0
  const rightRows = rightCols > 0 ? Math.min(Math.floor(host.height / (ch + GAP)), Math.ceil(count / rightCols)) : 0
  const zoneA = Math.min(count, rightRows * rightCols)

  const fullCols = Math.floor((fullAvailW + GAP) / (cw + GAP))
  const zoneB = count - zoneA

  if (zoneB > 0) {
    const zoneBRows = Math.ceil(zoneB / fullCols)
    const maxCh = Math.floor((belowAvailH - GAP * (zoneBRows - 1)) / zoneBRows)
    ch = Math.min(ch, maxCh)
    ch = Math.max(100, ch)
  }

  let placed = 0

  for (let r = 0; r < rightRows && placed < count; r++) {
    for (let c = 0; c < rightCols && placed < count; c++) {
      const cellH = Math.min(ch, host.height - r * (ch + GAP) - GAP)
      layouts.push({
        left: hostRight + GAP + c * (cw + GAP),
        top: HOST_TOP + r * (ch + GAP),
        width: cw,
        height: Math.max(80, cellH),
      })
      placed++
    }
  }

  let row = 0
  while (placed < count) {
    for (let c = 0; c < fullCols && placed < count; c++) {
      layouts.push({
        left: MARGIN + c * (cw + GAP),
        top: hostBottom + GAP + row * (ch + GAP),
        width: cw,
        height: ch,
      })
      placed++
    }
    row++
  }

  return layouts
}

function addGuest() {
  state.guestCounter++
  state.guests.push({ name: '嘉宾' + state.guestCounter })
}

function removeGuest(idx) {
  state.guests.splice(idx, 1)
  if (state.guests.length === 0) {
    state.lianmaiSeconds = 0
  }
}

function removeAllGuests() {
  state.guests = []
  state.lianmaiSeconds = 0
  state.guestCounter = 0
}

function updateGuestName(idx, val) {
  if (state.guests[idx]) {
    state.guests[idx].name = val
  }
}

function addDanmu(user, text) {
  const dm = { user, text, id: Date.now() + Math.random() }
  state.danmuList.push(dm)
  state.commentCount++
  if (state.danmuList.length > 7) {
    state.danmuList.shift()
  }
  setTimeout(() => {
    const idx = state.danmuList.findIndex(d => d.id === dm.id)
    if (idx !== -1) state.danmuList.splice(idx, 1)
  }, 7000)
}

function randomDanmuUserText() {
  const u = state.audience[Math.floor(Math.random() * state.audience.length)]
  if (!u) return { user: '观众', text: '...' }
  const texts = u.texts && u.texts.length > 0 ? u.texts : ['...']
  const t = texts[Math.floor(Math.random() * texts.length)]
  return { user: u.name, text: t }
}

function addLike() {
  state.likeCount++
  const heart = {
    id: Date.now() + Math.random(),
    left: 84 + Math.random() * 12,
    top: 13 + Math.random() * 6,
    color: ['#ff2d55', '#ff6b9d', '#ff92b4', '#fff', '#ffd92c'][Math.floor(Math.random() * 5)],
    fontSize: 28 + Math.random() * 24,
  }
  state.hearts.push(heart)
  setTimeout(() => {
    const idx = state.hearts.findIndex(h => h.id === heart.id)
    if (idx !== -1) state.hearts.splice(idx, 1)
  }, 2200)
}

function likeBatchFn(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => addLike(), i * 80)
  }
}

const giftQueue = []
const MAX_OVERLAYS = 5

function playOverlay(gift) {
  state.activeGiftOverlays.push(gift)
  setTimeout(() => {
    const idx = state.activeGiftOverlays.findIndex(g => g.id === gift.id)
    if (idx !== -1) state.activeGiftOverlays.splice(idx, 1)
    if (giftQueue.length > 0) {
      playOverlay(giftQueue.shift())
    }
  }, 2500)
}

let giftToastTimer = null

function sendGift(gift) {
  const overlayGift = { id: Date.now() + Math.random(), giftId: gift.id, name: gift.name, sub: '感谢赠送', color: gift.color }
  if (state.activeGiftOverlays.length < MAX_OVERLAYS) {
    playOverlay(overlayGift)
  } else {
    giftQueue.push(overlayGift)
  }
  bumpRandomRanker(parseInt(gift.price) || 1)
  state.giftToastText = `🎉 送出 ${gift.name} ×1`
  state.giftToastVisible = true
  if (giftToastTimer) clearTimeout(giftToastTimer)
  giftToastTimer = setTimeout(() => { state.giftToastVisible = false }, 3000)
}

// ─── 导入导出 ───
function exportConfigJSON() {
  const data = {
    audience: state.audience.map(a => ({
      name: a.name, avatar: a.avatar, contribution: a.contribution, texts: [...(a.texts || [])],
    })),
    room: {
      title: state.roomTitle,
      hostName: state.hostName,
      subtitle: state.subtitle,
      viewers: state.viewers,
      pkLabel: state.pkLabel,
      placeholder: state.placeholder,
    },
  }
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'douyin_config.json'
  a.click()
  URL.revokeObjectURL(url)
  return json
}

function importConfigJSON(jsonStr) {
  try {
    const data = JSON.parse(jsonStr)
    if (data.audience && Array.isArray(data.audience)) {
      state.audience = data.audience.map(a => ({
        name: a.name || '',
        avatar: a.avatar || '#888',
        contribution: a.contribution || 0,
        texts: Array.isArray(a.texts) ? [...a.texts] : [],
      }))
    }
    if (data.room) {
      const r = data.room
      if (r.title) state.roomTitle = r.title
      if (r.hostName) state.hostName = r.hostName
      if (r.subtitle !== undefined) state.subtitle = r.subtitle
      if (r.viewers) state.viewers = r.viewers
      if (r.pkLabel) state.pkLabel = r.pkLabel
      if (r.placeholder) state.placeholder = r.placeholder
    }
    return true
  } catch (e) {
    return false
  }
}

function buildConfigJSON() {
  return JSON.stringify({
    audience: state.audience.map(a => ({
      name: a.name, avatar: a.avatar, contribution: a.contribution, texts: [...(a.texts || [])],
    })),
    room: {
      title: state.roomTitle,
      hostName: state.hostName,
      subtitle: state.subtitle,
      viewers: state.viewers,
      pkLabel: state.pkLabel,
      placeholder: state.placeholder,
    },
  }, null, 2)
}

const soloHostStyle = computed(() => {
  const h = getHostLayout(state.guests.length)
  return { left: h.left + 'px', top: h.top + 'px', width: h.width + 'px', height: h.height + 'px' }
})

const isSolo = computed(() => state.guests.length === 0)
const subtitleTop = computed(() => state.guests.length === 0 ? '1480px' : '1500px')
const actionsStyle = computed(() => {
  if (state.guests.length === 0) {
    return { left: '884px', top: '240px' }
  }
  return { right: '16px', top: '280px' }
})
const lianmaiTimerVisible = computed(() => state.guests.length > 0)

export {
  state,
  guestColors,
  giftList,
  defaultAudience,
  rankList,
  parseNum,
  fmtNum,
  getGuestLayout,
  getHostLayout,
  addGuest,
  removeGuest,
  removeAllGuests,
  updateGuestName,
  addDanmu,
  randomDanmuUserText,
  addLike,
  likeBatchFn,
  sendGift,
  initAudience,
  bumpRandomRanker,
  exportConfigJSON,
  importConfigJSON,
  buildConfigJSON,
  updateClock,
  initStats,
  soloHostStyle,
  isSolo,
  subtitleTop,
  actionsStyle,
  lianmaiTimerVisible,
}
