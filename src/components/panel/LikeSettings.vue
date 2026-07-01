<script setup>
import { onUnmounted } from 'vue'
import { state, likeBatchFn } from '../../store/liveStore.js'

let likeTimer = null

function likeStart() {
  if (likeTimer) return
  state.likeAutoRunning = true
  likeTimer = setInterval(() => { likeBatchFn(state.likeBatch) }, state.likeFreq)
}

function likeStop() {
  if (likeTimer) { clearInterval(likeTimer); likeTimer = null }
  state.likeAutoRunning = false
}

function likeRestart() { likeStop(); likeStart() }

onUnmounted(() => { likeStop() })
</script>

<template>
  <a-card title="❤️ 点赞控制" :bordered="false" class="section-card">
    <a-space direction="vertical" fill>
      <a-space fill>
        <a-space direction="vertical" style="flex:1">
          <span style="font-size:12px;color:#888">状态</span>
          <a-space>
            <a-button :type="state.likeAutoRunning ? 'secondary' : 'primary'" status="success" size="small" @click="likeStart">▶ 开</a-button>
            <a-button status="danger" size="small" @click="likeStop">⏹ 关</a-button>
          </a-space>
        </a-space>
        <a-space direction="vertical" style="flex:1">
          <span style="font-size:12px;color:#888">频率</span>
          <a-select v-model="state.likeFreq" size="small" @change="likeRestart">
            <a-option :value="200">每秒5次</a-option>
            <a-option :value="500">每秒2次</a-option>
            <a-option :value="1000">每秒1次</a-option>
            <a-option :value="2000">每2秒1次</a-option>
            <a-option :value="5000">每5秒1次</a-option>
          </a-select>
        </a-space>
      </a-space>

      <a-space fill style="align-items:center">
        <span style="font-size:12px;color:#888">单次数量</span>
        <a-select v-model="state.likeBatch" size="small" style="flex:1" @change="likeRestart">
          <a-option :value="1">1个</a-option>
          <a-option :value="2">2个</a-option>
          <a-option :value="3">3个</a-option>
          <a-option :value="5">5个</a-option>
        </a-select>
        <span style="font-size:12px;color:#888;white-space:nowrap">
          当前: <span :style="{ color: state.likeAutoRunning ? '#4ade80' : '#888' }">{{ state.likeAutoRunning ? '运行中' : '停止' }}</span>
        </span>
      </a-space>
    </a-space>
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
</style>
