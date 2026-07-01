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

const canvasScale = computed(() => {
  const tw = state.mediaEditorTW || 620
  const th = state.mediaEditorTH || 1340
  return Math.min(780 / tw, 460 / th)
})
const canvasW = computed(() => Math.round((state.mediaEditorTW || 620) * canvasScale.value))
const canvasH = computed(() => Math.round((state.mediaEditorTH || 1340) * canvasScale.value))

const scale = ref(1), scaleInput = ref('100')
const offsetX = ref(0), offsetXInput = ref('0')
const offsetY = ref(0), offsetYInput = ref('0')
const rotation = ref(0), rotationInput = ref('0')
const cropL = ref(0), cropLInput = ref('0')
const cropT = ref(0), cropTInput = ref('0')
const cropR = ref(0), cropRInput = ref('0')
const cropB = ref(0), cropBInput = ref('0')

const videoRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0), duration = ref(0)
const timelineRef = ref(null)

const isDragging = ref(false)

function syncInputs() {
  scaleInput.value = String(Math.round(scale.value * 100))
  offsetXInput.value = String(offsetX.value)
  offsetYInput.value = String(offsetY.value)
  rotationInput.value = String(rotation.value)
  cropLInput.value = String(cropL.value); cropTInput.value = String(cropT.value)
  cropRInput.value = String(cropR.value); cropBInput.value = String(cropB.value)
}

function parseInput(v, min, max, fallback) {
  const n = parseInt(v)
  if (isNaN(n)) return fallback
  return Math.max(min, Math.min(max, n))
}

function initFromMedia() {
  const m = media.value
  if (!m) return
  const s = canvasScale.value
  scale.value = m.scale || 1
  offsetX.value = Math.round((m.offsetX ?? 0) * s)
  offsetY.value = Math.round((m.offsetY ?? 0) * s)
  rotation.value = m.rotation ?? 0
  cropL.value = m.cropLeft ?? 0; cropT.value = m.cropTop ?? 0
  cropR.value = m.cropRight ?? 0; cropB.value = m.cropBottom ?? 0
  currentTime.value = 0; isPlaying.value = false
  syncInputs()
}

watch(modalVisible, (v) => { if (v) initFromMedia() })

function apply() {
  const m = media.value
  if (!m) return
  const s = canvasScale.value
  Object.assign(m, {
    scale: scale.value,
    offsetX: Math.round(offsetX.value / s),
    offsetY: Math.round(offsetY.value / s),
    rotation: rotation.value,
    cropLeft: cropL.value,
    cropTop: cropT.value,
    cropRight: cropR.value,
    cropBottom: cropB.value,
  })
  close()
}

let closing = false

function close() {
  closing = true
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.removeAttribute('src')
    videoRef.value.load()
  }
  state.mediaEditorVisible = false
  state.mediaEditorTarget = null
  state.mediaEditorIndex = -1
  setTimeout(() => { closing = false }, 100)
}

function resetAll() {
  scale.value = 1; offsetX.value = 0; offsetY.value = 0; rotation.value = 0
  cropL.value = 0; cropT.value = 0; cropR.value = 0; cropB.value = 0
  syncInputs()
}

// ─── wheel zoom ───
function onWheel(e) {
  e.preventDefault()
  const d = e.deltaY > 0 ? -5 : 5
  scale.value = Math.max(1, Math.min(1000, Math.round((scale.value * 100 + d) / 5) * 5)) / 100
  syncInputs()
}

// ─── canvas pan ───
let panStart = { x: 0, y: 0 }
let panOff = { x: 0, y: 0 }

function startPan(e) {
  if (e.target.closest('.cch')) return // don't pan when dragging crop handles
  isDragging.value = true
  panStart = { x: e.clientX, y: e.clientY }
  panOff = { x: offsetX.value, y: offsetY.value }
  document.addEventListener('mousemove', onPan)
  document.addEventListener('mouseup', stopPan)
}
function onPan(e) {
  if (!isDragging.value) return
  const dx = (e.clientX - panStart.x) / scale.value
  const dy = (e.clientY - panStart.y) / scale.value
  offsetX.value = Math.round(panOff.x + dx)
  offsetY.value = Math.round(panOff.y + dy)
  syncInputs()
}
function stopPan() {
  isDragging.value = false
  document.removeEventListener('mousemove', onPan)
  document.removeEventListener('mouseup', stopPan)
}

// ─── crop handle drag ───
let cropDrag = { dir: '', start: 0 }
function startCrop(dir, e) {
  e.stopPropagation(); e.preventDefault()
  const vals = { t: cropT, b: cropB, l: cropL, r: cropR }
  const v = vals[dir]
  cropDrag = { dir, start: e['client' + (dir === 't' || dir === 'b' ? 'Y' : 'X')], val: v.value }
  document.addEventListener('mousemove', onCrop)
  document.addEventListener('mouseup', stopCrop)
}
function onCrop(e) {
  const axis = cropDrag.dir === 't' || cropDrag.dir === 'b' ? 'clientY' : 'clientX'
  const delta = (e[axis] - cropDrag.start) * (cropDrag.dir === 'b' || cropDrag.dir === 'r' ? -1 : 1)
  const newVal = Math.max(0, Math.min(100, Math.round(cropDrag.val + delta / 3)))
  const map = { t: cropT, b: cropB, l: cropL, r: cropR }
  map[cropDrag.dir].value = newVal
  syncInputs()
}
function stopCrop() {
  document.removeEventListener('mousemove', onCrop)
  document.removeEventListener('mouseup', stopCrop)
}

// ─── video ───
function togglePlay() {
  if (closing) return
  const v = videoRef.value; if (!v) return
  if (v.paused) {
    const p = v.play()
    if (p) p.catch(() => {})
    isPlaying.value = true
  } else {
    v.pause(); isPlaying.value = false
  }
}
function onTimeUpdate() { if (videoRef.value) currentTime.value = videoRef.value.currentTime }
function onLoadedMetadata() { if (videoRef.value) duration.value = videoRef.value.duration }
function seek(e) {
  if (!timelineRef.value || !videoRef.value) return
  const rect = timelineRef.value.getBoundingClientRect()
  videoRef.value.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * duration.value
}
function restart() {
  if (videoRef.value) { videoRef.value.currentTime = 0; videoRef.value.pause() }
  currentTime.value = 0; isPlaying.value = false
}
function fmtTime(t) { if (!isFinite(t) || t < 0) return '0:00'; const m = Math.floor(t/60); const s = Math.floor(t%60); return `${m}:${String(s).padStart(2,'0')}` }

onUnmounted(() => { document.removeEventListener('mousemove', onPan); document.removeEventListener('mouseup', stopPan); document.removeEventListener('mousemove', onCrop); document.removeEventListener('mouseup', stopCrop) })

// ─── input handlers ───
function onScaleInput(v) { scale.value = Math.max(1, Math.min(1000, parseInput(v, 1, 1000, 100))) / 100; syncInputs() }
function onOffsetXInput(v) { offsetX.value = parseInput(v, -2000, 2000, 0); syncInputs() }
function onOffsetYInput(v) { offsetY.value = parseInput(v, -2000, 2000, 0); syncInputs() }
function onRotationInput(v) { rotation.value = parseInput(v, -360, 360, 0); syncInputs() }
function onCropLInput(v) { cropL.value = Math.max(0, Math.min(100, parseInt(v)||0)); syncInputs() }
function onCropTInput(v) { cropT.value = Math.max(0, Math.min(100, parseInt(v)||0)); syncInputs() }
function onCropRInput(v) { cropR.value = Math.max(0, Math.min(100, parseInt(v)||0)); syncInputs() }
function onCropBInput(v) { cropB.value = Math.max(0, Math.min(100, parseInt(v)||0)); syncInputs() }
</script>

<template>
  <a-modal v-model:visible="modalVisible" title="媒体编辑器" :width="900" :footer="false" :mask-closable="true" unmount-on-close @cancel="close">
    <div v-if="media" class="editorWrap">
      <!-- 预览画布 - 等比缩放的竖屏 -->
      <div class="previewOuter">
        <div class="previewArea" :style="{ width: canvasW + 'px', height: canvasH + 'px' }" @wheel="onWheel" @mousedown="startPan">
          <div class="previewInner" :style="{
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            clipPath: `inset(${cropT}% ${cropR}% ${cropB}% ${cropL}%)`,
          }">
            <video v-if="media.type === 'video'" ref="videoRef" :src="media.url" muted loop
              @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata" class="editorMedia" />
            <img v-else :src="media.url" class="editorMedia" />
          </div>
          <div class="cropHandles">
            <div class="cch cch-t" @mousedown="startCrop('t', $event)"></div>
            <div class="cch cch-b" @mousedown="startCrop('b', $event)"></div>
            <div class="cch cch-l" @mousedown="startCrop('l', $event)"></div>
            <div class="cch cch-r" @mousedown="startCrop('r', $event)"></div>
          </div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="controls">
        <div class="ctrl">
          <span class="sec">缩放</span>
          <div class="row"><span class="lbl">%</span><input type="range" min="10" max="1000" :value="scale*100" @input="scale=$event.target.value/100; syncInputs()" class="sl" /><input class="num" :value="scaleInput" @input="onScaleInput($event.target.value)" /></div>
        </div>
        <div class="ctrl">
          <span class="sec">旋转</span>
          <div class="row"><span class="lbl">°</span><input type="range" min="-360" max="360" v-model.number="rotation" @input="syncInputs()" class="sl" /><input class="num" :value="rotationInput" @input="onRotationInput($event.target.value)" /></div>
        </div>
        <div class="ctrl">
          <span class="sec">位置 X</span>
          <div class="row"><span class="lbl">px</span><input type="range" min="-2000" max="2000" v-model.number="offsetX" @input="syncInputs()" class="sl" /><input class="num" :value="offsetXInput" @input="onOffsetXInput($event.target.value)" /></div>
        </div>
        <div class="ctrl">
          <span class="sec">位置 Y</span>
          <div class="row"><span class="lbl">px</span><input type="range" min="-2000" max="2000" v-model.number="offsetY" @input="syncInputs()" class="sl" /><input class="num" :value="offsetYInput" @input="onOffsetYInput($event.target.value)" /></div>
        </div>
        <div class="ctrl">
          <span class="sec">裁上</span>
          <div class="row"><span class="lbl">%</span><input type="range" min="0" max="100" v-model.number="cropT" @input="syncInputs()" class="sl" /><input class="num" :value="cropTInput" @input="onCropTInput($event.target.value)" /></div>
        </div>
        <div class="ctrl">
          <span class="sec">裁下</span>
          <div class="row"><span class="lbl">%</span><input type="range" min="0" max="100" v-model.number="cropB" @input="syncInputs()" class="sl" /><input class="num" :value="cropBInput" @input="onCropBInput($event.target.value)" /></div>
        </div>
        <div class="ctrl">
          <span class="sec">裁左</span>
          <div class="row"><span class="lbl">%</span><input type="range" min="0" max="100" v-model.number="cropL" @input="syncInputs()" class="sl" /><input class="num" :value="cropLInput" @input="onCropLInput($event.target.value)" /></div>
        </div>
        <div class="ctrl">
          <span class="sec">裁右</span>
          <div class="row"><span class="lbl">%</span><input type="range" min="0" max="100" v-model.number="cropR" @input="syncInputs()" class="sl" /><input class="num" :value="cropRInput" @input="onCropRInput($event.target.value)" /></div>
        </div>
      </div>

      <div class="btnRow">
        <a-button size="mini" @click="resetAll">重置全部</a-button>
      </div>

      <div v-if="media.type === 'video'" class="vidCtrl">
        <div class="row">
          <a-space><a-button size="small" @click="restart">⏮</a-button><a-button size="small" @click="togglePlay">{{ isPlaying?'⏸':'▶' }}</a-button></a-space>
          <span class="time">{{ fmtTime(currentTime) }} / {{ fmtTime(duration) }}</span>
        </div>
        <div ref="timelineRef" class="tl" @click="seek"><div class="tlf" :style="{width:duration?(currentTime/duration*100)+'%':'0%'}"></div></div>
      </div>

      <div class="footer">
        <a-button @click="close">取消</a-button>
        <a-button type="primary" @click="apply" style="background:#ff2d55;border-color:#ff2d55">应用</a-button>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
.editorWrap{display:flex;flex-direction:column;gap:8px}
.previewOuter{display:flex;justify-content:center;align-items:center}
.previewArea{background:repeating-conic-gradient(#1a1a1a 0% 25%,#222 0% 50%) 50%/20px 20px;border-radius:6px;overflow:hidden;position:relative;cursor:grab;border:2px solid rgba(255,45,85,.4)}
.previewArea:active{cursor:grabbing}
.previewInner{width:100%;height:100%}
.editorMedia{width:100%;height:100%;object-fit:contain;pointer-events:none;user-select:none}
.cropHandles{position:absolute;inset:0;pointer-events:none}
.cch{position:absolute;pointer-events:auto;z-index:5;background:rgba(255,45,85,.15)}
.cch-t{top:0;left:0;right:0;height:8px;cursor:n-resize}
.cch-b{bottom:0;left:0;right:0;height:8px;cursor:s-resize}
.cch-l{left:0;top:0;bottom:0;width:8px;cursor:w-resize}
.cch-r{right:0;top:0;bottom:0;width:8px;cursor:e-resize}
.controls{display:flex;flex-wrap:wrap;gap:4px}
.ctrl{background:rgba(255,255,255,.03);border-radius:4px;padding:3px 6px;display:flex;flex-direction:column;gap:1px;min-width:210px}
.sec{font-size:10px;color:#ff2d55;font-weight:bold}
.row{display:flex;align-items:center;gap:4px}
.lbl{font-size:10px;color:#666;width:14px;text-align:right;flex-shrink:0}
.sl{flex:1;accent-color:#ff2d55;height:3px}
.num{width:46px;padding:1px 4px;border:none;border-radius:3px;background:rgba(255,255,255,.08);color:#ccc;font-size:11px;text-align:center;outline:none}
.num:focus{box-shadow:0 0 0 1px #ff2d55}
.btnRow{display:flex;gap:6px}
.vidCtrl{background:rgba(255,255,255,.03);border-radius:4px;padding:6px 8px}
.tl{width:100%;height:5px;background:rgba(255,255,255,.12);border-radius:2px;cursor:pointer;margin-top:4px;overflow:hidden}
.tlf{height:100%;background:#ff2d55;border-radius:2px}
.time{font-size:11px;color:#888;margin-left:auto}
.footer{display:flex;justify-content:flex-end;gap:8px;padding-top:6px;border-top:1px solid rgba(255,255,255,.06)}
</style>
