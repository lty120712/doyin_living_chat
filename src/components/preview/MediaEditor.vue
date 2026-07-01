<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { state } from '../../store/liveStore.js'

const modalVisible = computed({
  get: () => state.mediaEditorVisible,
  set: (v) => { if (!v) close() },
})

const media = computed(() => {
  if (state.mediaEditorTarget === 'host') return state.hostMedia
  if (state.mediaEditorTarget === 'guest' && state.guests[state.mediaEditorIndex]) {
    return state.guests[state.mediaEditorIndex].media
  }
  return null
})

const scale = ref(1)
const offsetX = ref(50)
const offsetY = ref(50)
const cropLeft = ref(0)
const cropTop = ref(0)
const cropRight = ref(0)
const cropBottom = ref(0)

const videoRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const timelineRef = ref(null)

function initFromMedia() {
  const m = media.value
  if (!m) return
  scale.value = m.scale || 1
  offsetX.value = m.offsetX ?? 50
  offsetY.value = m.offsetY ?? 50
  cropLeft.value = m.cropLeft ?? 0
  cropTop.value = m.cropTop ?? 0
  cropRight.value = m.cropRight ?? 0
  cropBottom.value = m.cropBottom ?? 0
  currentTime.value = 0
  isPlaying.value = false
}

watch(modalVisible, (v) => {
  if (v) initFromMedia()
})

function apply() {
  const m = media.value
  if (!m) return
  m.scale = scale.value
  m.offsetX = offsetX.value
  m.offsetY = offsetY.value
  m.cropLeft = cropLeft.value
  m.cropTop = cropTop.value
  m.cropRight = cropRight.value
  m.cropBottom = cropBottom.value
  close()
}

function close() {
  if (videoRef.value) videoRef.value.pause()
  state.mediaEditorVisible = false
  state.mediaEditorTarget = null
  state.mediaEditorIndex = -1
}

function resetAll() {
  scale.value = 1
  offsetX.value = 50
  offsetY.value = 50
  cropLeft.value = 0
  cropTop.value = 0
  cropRight.value = 0
  cropBottom.value = 0
}

function resetCrop() {
  cropLeft.value = 0
  cropTop.value = 0
  cropRight.value = 0
  cropBottom.value = 0
}

function onWheel(e) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.05 : 0.05
  scale.value = Math.max(0.3, Math.min(5, scale.value + delta))
}

// Drag to pan - unlimited movement
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const dragOffset = ref({ x: 0, y: 0 })

function startDrag(e) {
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  dragOffset.value = { x: offsetX.value, y: offsetY.value }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e) {
  if (!isDragging.value) return
  const dx = (e.clientX - dragStart.value.x) / (2 * scale.value)
  const dy = (e.clientY - dragStart.value.y) / (2 * scale.value)
  offsetX.value = Math.max(-50, Math.min(150, dragOffset.value.x - dx))
  offsetY.value = Math.max(-50, Math.min(150, dragOffset.value.y - dy))
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function togglePlay() {
  const v = videoRef.value
  if (!v) return
  if (v.paused) { v.play(); isPlaying.value = true }
  else { v.pause(); isPlaying.value = false }
}

function onTimeUpdate() {
  if (videoRef.value) currentTime.value = videoRef.value.currentTime
}

function onLoadedMetadata() {
  if (videoRef.value) duration.value = videoRef.value.duration
}

function seek(e) {
  if (!timelineRef.value || !videoRef.value) return
  const rect = timelineRef.value.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  videoRef.value.currentTime = ratio * duration.value
}

function restart() {
  if (videoRef.value) { videoRef.value.currentTime = 0; videoRef.value.pause() }
  currentTime.value = 0
  isPlaying.value = false
}

function fmtTime(t) {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<template>
  <a-modal v-model:visible="modalVisible" title="媒体编辑器" :width="860" :footer="false" :mask-closable="true" unmount-on-close @cancel="close">
    <div v-if="media" class="editorWrap">
      <div class="previewArea" @wheel="onWheel">
        <div class="previewInner" :style="{
          transform: `scale(${scale})`,
          transformOrigin: '50% 50%',
          marginLeft: `${offsetX - 50}%`,
          marginTop: `${offsetY - 50}%`,
          clipPath: `inset(${cropTop}% ${cropRight}% ${cropBottom}% ${cropLeft}%)`,
        }">
          <video v-if="media.type === 'video'" ref="videoRef" :src="media.url"
            autoplay muted loop @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"
            @mousedown.prevent="startDrag" class="editorMedia" />
          <img v-else :src="media.url" @mousedown.prevent="startDrag" class="editorMedia" />
        </div>
        <div class="cropIndicators">
          <div class="cropLine top" :style="{ top: cropTop + '%' }"></div>
          <div class="cropLine bottom" :style="{ bottom: cropBottom + '%' }"></div>
          <div class="cropLine left" :style="{ left: cropLeft + '%' }"></div>
          <div class="cropLine right" :style="{ right: cropRight + '%' }"></div>
        </div>
      </div>

      <div class="controls">
        <div class="controlSection">
          <span class="sectionTitle">缩放 &amp; 位置</span>
          <div class="controlRow">
            <span class="label">缩放</span>
            <input type="range" min="30" max="500" :value="scale * 100" @input="scale = $event.target.value / 100" class="slider" />
            <span class="value">{{ Math.round(scale * 100) }}%</span>
          </div>
          <div class="controlRow">
            <span class="label">左右</span>
            <input type="range" min="-50" max="150" v-model.number="offsetX" class="slider" />
            <span class="value">{{ offsetX }}%</span>
          </div>
          <div class="controlRow">
            <span class="label">上下</span>
            <input type="range" min="-50" max="150" v-model.number="offsetY" class="slider" />
            <span class="value">{{ offsetY }}%</span>
          </div>
          <a-button size="mini" @click="resetAll">重置全部</a-button>
        </div>

        <div class="controlSection">
          <span class="sectionTitle">裁剪</span>
          <div class="controlRow">
            <span class="label">上</span>
            <input type="range" min="0" max="50" v-model.number="cropTop" class="slider" />
            <span class="value">{{ cropTop }}%</span>
          </div>
          <div class="controlRow">
            <span class="label">下</span>
            <input type="range" min="0" max="50" v-model.number="cropBottom" class="slider" />
            <span class="value">{{ cropBottom }}%</span>
          </div>
          <div class="controlRow">
            <span class="label">左</span>
            <input type="range" min="0" max="50" v-model.number="cropLeft" class="slider" />
            <span class="value">{{ cropLeft }}%</span>
          </div>
          <div class="controlRow">
            <span class="label">右</span>
            <input type="range" min="0" max="50" v-model.number="cropRight" class="slider" />
            <span class="value">{{ cropRight }}%</span>
          </div>
          <a-button size="mini" @click="resetCrop">重置裁剪</a-button>
        </div>

        <div v-if="media.type === 'video'" class="controlSection">
          <span class="sectionTitle">视频控制</span>
          <div class="controlRow">
            <a-space>
              <a-button size="small" @click="restart">⏮</a-button>
              <a-button size="small" @click="togglePlay">{{ isPlaying ? '⏸' : '▶' }}</a-button>
            </a-space>
            <span class="time">{{ fmtTime(currentTime) }} / {{ fmtTime(duration) }}</span>
          </div>
          <div ref="timelineRef" class="timeline" @click="seek">
            <div class="timelineFill" :style="{ width: duration ? (currentTime / duration * 100) + '%' : '0%' }"></div>
          </div>
        </div>
      </div>

      <div class="editorFooter">
        <a-button @click="close">取消</a-button>
        <a-button type="primary" @click="apply" style="background:#ff2d55;border-color:#ff2d55">应用</a-button>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
.editorWrap { display: flex; flex-direction: column; gap: 12px; }
.previewArea {
  width: 100%; height: 320px; background: #0a0a0a; border-radius: 8px; overflow: hidden;
  position: relative; display: flex; align-items: center; justify-content: center; cursor: grab;
}
.previewArea:active { cursor: grabbing; }
.previewInner { width: 100%; height: 100%; transition: transform .1s, margin .1s; }
.editorMedia { width: 100%; height: 100%; object-fit: contain; pointer-events: none; user-select: none; }
.cropIndicators { position: absolute; inset: 0; pointer-events: none; }
.cropLine { position: absolute; background: rgba(255, 45, 85, .5); z-index: 5; }
.cropLine.top, .cropLine.bottom { left: 0; right: 0; height: 2px; }
.cropLine.left, .cropLine.right { top: 0; bottom: 0; width: 2px; }
.controls { display: flex; flex-direction: column; gap: 8px; }
.controlSection { background: rgba(255, 255, 255, .03); border-radius: 6px; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; }
.sectionTitle { font-size: 12px; color: #ff2d55; font-weight: bold; margin-bottom: 2px; }
.controlRow { display: flex; align-items: center; gap: 8px; }
.label { font-size: 12px; color: #888; width: 36px; flex-shrink: 0; }
.slider { flex: 1; accent-color: #ff2d55; height: 4px; }
.value { font-size: 12px; color: #ccc; width: 40px; text-align: right; }
.timeline { width: 100%; height: 6px; background: rgba(255,255,255,.15); border-radius: 3px; cursor: pointer; margin-top: 6px; overflow: hidden; }
.timelineFill { height: 100%; background: #ff2d55; border-radius: 3px; transition: width .1s; }
.time { font-size: 12px; color: #888; margin-left: auto; }
.editorFooter { display: flex; justify-content: flex-end; gap: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.06); }
</style>
