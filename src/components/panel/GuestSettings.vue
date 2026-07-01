<script setup>
import { ref } from 'vue'
import { state, addGuest, removeGuest, removeAllGuests, guestColors } from '../../store/liveStore.js'
import VideoControls from './VideoControls.vue'

const guestFileInputs = ref([])

function batchAdd(n) {
  for (let i = 0; i < n; i++) addGuest()
}

function openGuestFile(idx) {
  guestFileInputs.value[idx]?.click()
}

function handleGuestFile(idx, e) {
  const file = e.target.files[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  const type = file.type.startsWith('video/') ? 'video' : 'image'
  state.guests[idx].media = { type, url, name: file.name }
  e.target.value = ''
}

function clearGuestMedia(idx) {
  const g = state.guests[idx]
  if (g?.media?.url) URL.revokeObjectURL(g.media.url)
  if (g) g.media = null
}

function editGuestMedia(idx) {
  if (!state.guests[idx]?.media) return
  state.mediaEditorTarget = 'guest'
  state.mediaEditorIndex = idx
  state.mediaEditorVisible = true
}

function setRef(el, idx) {
  if (el) guestFileInputs.value[idx] = el
}
</script>

<template>
  <a-card title="👥 连麦嘉宾 ({{ state.guests.length }}/32)" :bordered="false" class="section-card">
    <div class="guestListScroll">
      <div class="guestItem" v-for="(g, i) in state.guests" :key="i"
        :style="{ borderLeftColor: guestColors[i % guestColors.length] }">
        <a-input v-model="state.guests[i].name" size="mini" placeholder="嘉宾名称" style="margin-bottom:4px" />
        <div class="guestMediaRow">
          <a-button size="mini" @click="openGuestFile(i)">{{ g.media ? '更换' : '选画面' }}</a-button>
          <a-button v-if="g.media" size="mini" @click="editGuestMedia(i)">编辑</a-button>
          <a-button v-if="g.media" size="mini" status="danger" @click="clearGuestMedia(i)">清除</a-button>
        </div>
        <span v-if="g.media" class="guestMediaName">{{ g.media.name }}</span>
        <VideoControls v-if="g.media?.type === 'video'" :media="g.media" :label="g.name" />
        <input :ref="(el) => setRef(el, i)" type="file" accept="image/*,video/*" style="display:none" @change="handleGuestFile(i, $event)" />
        <a-button status="danger" size="mini" long @click="removeGuest(i)" style="margin-top:4px">✕ 移除</a-button>
      </div>
    </div>
    <a-space fill style="margin-top:6px">
      <a-button type="primary" status="success" size="small" @click="addGuest" :disabled="state.guests.length >= 32">＋1</a-button>
      <a-button size="small" @click="batchAdd(5)" :disabled="state.guests.length >= 32">＋5</a-button>
      <a-button size="small" @click="batchAdd(10)" :disabled="state.guests.length >= 32">＋10</a-button>
      <a-button size="small" @click="batchAdd(32 - state.guests.length)" :disabled="state.guests.length >= 32">加满</a-button>
    </a-space>
    <a-button status="danger" size="small" long style="margin-top:8px" @click="removeAllGuests" :disabled="state.guests.length === 0">一键移除全部嘉宾</a-button>
  </a-card>
</template>

<style scoped>
.section-card {
  margin-bottom: 16px;
  background: rgba(255, 255, 255, .05) !important;
  border-radius: 10px !important;
}
.section-card :deep(.arco-card-header) {
  color: #aaa;
  font-size: 14px;
}
.section-card :deep(.arco-card-body) {
  padding: 10px 14px 14px;
}
.guestListScroll {
  max-height: 260px;
  overflow-y: auto;
}
.guestItem {
  background: rgba(255, 255, 255, .03);
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 6px;
  border-left: 3px solid #0f3460;
}
.guestMediaRow {
  display: flex;
  gap: 4px;
  margin-bottom: 2px;
}
.guestMediaName {
  font-size: 10px;
  color: #666;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 2px;
}
</style>
