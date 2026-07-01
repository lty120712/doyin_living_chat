<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  media: { type: Object, default: null },
  label: { type: String, default: '' },
})

const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const videoEl = ref(null)
const barRef = ref(null)
const isDragging = ref(false)

let targetVideo = null

function findVideo() {
  const videos = document.querySelectorAll('.hostMedia, .guestMedia')
  for (const v of videos) {
    if (v.src === props.media?.url) {
      targetVideo = v
      bindVideo(v)
      return
    }
  }
}

function bindVideo(v) {
  if (!v) return
  videoEl.value = v
  v.addEventListener('timeupdate', onTimeUpdate)
  v.addEventListener('loadedmetadata', onLoadedMeta)
  v.addEventListener('play', () => { isPlaying.value = true })
  v.addEventListener('pause', () => { isPlaying.value = false })
  if (!v.paused) isPlaying.value = true
  if (v.duration) { duration.value = v.duration; currentTime.value = v.currentTime }
}

function onTimeUpdate() {
  if (videoEl.value && !isDragging.value) {
    currentTime.value = videoEl.value.currentTime
  }
}

function onLoadedMeta() {
  if (videoEl.value) duration.value = videoEl.value.duration
}

function togglePlay() {
  videoEl.value?.paused ? videoEl.value.play() : videoEl.value?.pause()
}

function restart() {
  const v = videoEl.value
  if (v) { v.currentTime = 0; v.pause() }
  currentTime.value = 0
  isPlaying.value = false
}

function scrub(e) {
  if (!barRef.value || !videoEl.value) return
  const rect = barRef.value.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  videoEl.value.currentTime = ratio * duration.value
  currentTime.value = videoEl.value.currentTime
}

function startDrag(e) {
  isDragging.value = true
  scrub(e)
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e) {
  scrub(e)
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function fmtTime(t) {
  if (!isFinite(t) || t < 0) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

watch(() => props.media, (m) => {
  if (m?.type === 'video') setTimeout(() => findVideo(), 200)
  else { targetVideo = null; videoEl.value = null }
}, { immediate: true })

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  if (targetVideo) {
    targetVideo.removeEventListener('timeupdate', onTimeUpdate)
    targetVideo.removeEventListener('loadedmetadata', onLoadedMeta)
  }
})
</script>

<template>
  <div v-if="media?.type === 'video'" class="videoControls">
    <span v-if="label" class="controlLabel">{{ label }}</span>
    <div class="btnRow">
      <a-button size="mini" @click="restart">⏮</a-button>
      <a-button size="mini" @click="togglePlay">{{ isPlaying ? '⏸' : '▶' }}</a-button>
      <span class="timeCurrent">{{ fmtTime(currentTime) }}</span>
      <span class="timeSep">/</span>
      <span class="timeTotal">{{ fmtTime(duration) }}</span>
    </div>
    <div ref="barRef" class="progressTrack" @mousedown="startDrag">
      <div class="progressFill" :style="{ width: duration ? (currentTime / duration * 100) + '%' : '0%' }">
        <div class="progressThumb"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.videoControls {
  background: rgba(255, 255, 255, .04);
  border-radius: 6px;
  padding: 8px 10px;
  margin-top: 6px;
}
.controlLabel {
  font-size: 11px;
  color: #888;
  display: block;
  margin-bottom: 6px;
}
.btnRow {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.timeCurrent {
  font-size: 12px;
  color: #fff;
  margin-left: auto;
  min-width: 36px;
  text-align: right;
}
.timeSep {
  font-size: 12px;
  color: #555;
}
.timeTotal {
  font-size: 12px;
  color: #888;
  min-width: 36px;
}
.progressTrack {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, .12);
  border-radius: 3px;
  cursor: pointer;
  overflow: visible;
  position: relative;
}
.progressFill {
  height: 100%;
  background: #ff2d55;
  border-radius: 3px;
  position: relative;
  min-width: 0;
  transition: width .05s linear;
}
.progressThumb {
  position: absolute;
  right: -6px;
  top: -3px;
  width: 12px;
  height: 12px;
  background: #ff2d55;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0,0,0,.5);
  opacity: 0;
  transition: opacity .15s;
}
.progressTrack:hover .progressThumb {
  opacity: 1;
}
</style>
