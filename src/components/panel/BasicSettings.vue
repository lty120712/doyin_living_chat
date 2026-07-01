<script setup>
import { ref } from 'vue'
import { state, parseNum, getHostLayout } from '../../store/liveStore.js'
import VideoControls from './VideoControls.vue'

const hostFileInput = ref(null)

function updateStats() {
  state.likeCount = parseNum(state._likeInit || '3.2万')
  state.commentCount = parseNum(state._commentInit || '892')
}

function openHostFile() {
  hostFileInput.value?.click()
}

function editHostMedia() {
  if (!state.hostMedia) return
  const h = getHostLayout(state.guests.length)
  state.mediaEditorTW = h.width
  state.mediaEditorTH = h.height
  state.mediaEditorTarget = 'host'
  state.mediaEditorIndex = -1
  state.mediaEditorVisible = true
}

function handleHostFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  const type = file.type.startsWith('video/') ? 'video' : 'image'
  state.hostMedia = { type, url, name: file.name }
  e.target.value = ''
}

function clearHostMedia() {
  if (state.hostMedia?.url) URL.revokeObjectURL(state.hostMedia.url)
  state.hostMedia = null
}
</script>

<template>
  <a-card title="📋 基本设置" :bordered="false" class="section-card">
    <a-form layout="vertical" :model="state" size="small">
      <a-form-item label="直播间标题">
        <a-input v-model="state.roomTitle" />
      </a-form-item>
      <a-form-item label="主播名称">
        <a-input v-model="state.hostName" />
      </a-form-item>
      <a-form-item label="主播画面">
        <div style="width:100%;display:flex;flex-direction:column;gap:4px">
          <div class="mediaRow">
            <a-button size="small" @click="openHostFile">选择文件</a-button>
            <a-button v-if="state.hostMedia" size="small" @click="editHostMedia">编辑</a-button>
            <a-button v-if="state.hostMedia" size="small" status="danger" @click="clearHostMedia">清除</a-button>
          </div>
          <span v-if="state.hostMedia" class="mediaName">{{ state.hostMedia.name }}</span>
          <VideoControls v-if="state.hostMedia?.type === 'video'" :media="state.hostMedia" label="主播视频" />
        </div>
        <input ref="hostFileInput" type="file" accept="image/*,video/*" style="display:none" @change="handleHostFile" />
      </a-form-item>
      <a-form-item label="字幕文字">
        <a-input v-model="state.subtitle" />
      </a-form-item>
      <a-form-item label="在线人数">
        <a-input v-model="state.viewers" />
      </a-form-item>
      <a-form-item label="连线状态文字">
        <a-input v-model="state.pkLabel" />
      </a-form-item>
      <a-form-item label="底部占位文字">
        <a-input v-model="state.placeholder" />
      </a-form-item>
      <a-form-item label="点赞数（初始值）">
        <a-input v-model="state._likeInit" @input="updateStats" />
      </a-form-item>
      <a-form-item label="评论数（初始值）">
        <a-input v-model="state._commentInit" @input="updateStats" />
      </a-form-item>
    </a-form>
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
.section-card :deep(.arco-form-item) {
  margin-bottom: 8px;
}
.section-card :deep(.arco-form-item-label) {
  color: #888;
  font-size: 12px;
}
.mediaRow {
  display: flex;
  gap: 6px;
}
.mediaName {
  font-size: 11px;
  color: #888;
  margin-top: 3px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
