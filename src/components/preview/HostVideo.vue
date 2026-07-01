<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { state, soloHostStyle, lianmaiTimerVisible } from '../../store/liveStore.js'
import LiveIcons from './LiveIcons.vue'

let timerId = null
let startTime = 0
const timerText = ref('连麦 00:00')

function fmtTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `连麦 ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function startTimer() {
  if (timerId) return
  startTime = Date.now()
  timerId = setInterval(() => {
    const sec = Math.floor((Date.now() - startTime) / 1000)
    timerText.value = fmtTime(sec)
  }, 500)
}

function stopTimer() {
  if (timerId) { clearInterval(timerId); timerId = null }
}

onMounted(() => { startTimer() })
onUnmounted(() => { stopTimer() })
</script>

<template>
  <div class="host" :style="soloHostStyle">
    <video autoplay muted loop src=""
      poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='620' height='1340'%3E%3Crect fill='%2300ff00' width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' fill='%2300aa00' font-size='40' text-anchor='middle' dy='.3em'%3E主播画面%3C/text%3E%3C/svg%3E">
    </video>
    <div class="viewerTag">
      <LiveIcons name="person" />
      {{ state.viewers }}
    </div>
    <div class="nameTag">
      <span class="dot"></span>
      <span>{{ state.hostName }}</span>
    </div>
    <div class="lianmaiTimer" v-show="lianmaiTimerVisible">{{ timerText }}</div>
  </div>
</template>

<style scoped>
.host {
  position: absolute;
  overflow: hidden;
}
.host video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #00ff00;
  border-radius: 32px;
  border: 5px solid rgba(255, 255, 255, .9);
}
.nameTag {
  position: absolute;
  left: 24px;
  bottom: 24px;
  background: rgba(0, 0, 0, .6);
  color: #fff;
  padding: 10px 24px;
  border-radius: 40px;
  font-size: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.nameTag .dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ff2d55;
  display: inline-block;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .3; }
}
.viewerTag {
  position: absolute;
  right: 24px;
  top: 24px;
  background: rgba(0, 0, 0, .6);
  color: #fff;
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 24px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.viewerTag :deep(svg) {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.lianmaiTimer {
  position: absolute;
  left: 24px;
  top: 56px;
  background: rgba(0, 0, 0, .55);
  color: #fff;
  padding: 6px 16px;
  border-radius: 10px;
  font-size: 20px;
  z-index: 3;
  backdrop-filter: blur(4px);
}
</style>
