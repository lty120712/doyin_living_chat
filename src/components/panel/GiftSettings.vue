<script setup>
import { onUnmounted } from 'vue'
import { state, giftList, sendGift } from '../../store/liveStore.js'
import GiftIcon from '../preview/GiftIcon.vue'

let giftAutoTimer = null

function autoStart() {
  if (giftAutoTimer) return
  state.giftAutoRunning = true
  giftAutoTimer = setInterval(() => {
    const g = giftList[state.giftAutoGiftIndex]
    if (g) sendGift(g)
    state.giftSentCount++
  }, state.giftAutoFreq)
}

function autoStop() {
  if (giftAutoTimer) { clearInterval(giftAutoTimer); giftAutoTimer = null }
  state.giftAutoRunning = false
}

function autoRestart() { autoStop(); autoStart() }

onUnmounted(() => { autoStop() })
</script>

<template>
  <a-card title="🎁 礼物" :bordered="false" class="section-card">
    <a-space direction="vertical" fill>
      <a-button type="primary" long @click="state.giftPickerVisible = true" style="background:#ff2d55;border-color:#ff2d55">打开礼物面板</a-button>
      <a-space wrap>
        <a-button v-for="g in giftList.slice(0, 6)" :key="g.id" shape="circle" size="small" @click="sendGift(g)" :style="{ borderColor: g.color, color: g.color }">
          <GiftIcon :type="g.id" :color="g.color" />
        </a-button>
      </a-space>

      <a-divider margin="8px" />

      <span style="font-size:12px;color:#888">自动刷礼物</span>
      <a-space fill>
        <a-button :type="state.giftAutoRunning ? 'secondary' : 'primary'" status="success" size="small" @click="autoStart">▶ 开</a-button>
        <a-button status="danger" size="small" @click="autoStop">⏹ 关</a-button>
      </a-space>

      <a-space fill>
        <a-select v-model="state.giftAutoFreq" size="small" style="flex:1" @change="autoRestart">
          <a-option :value="500">每秒2次</a-option>
          <a-option :value="1000">每秒1次</a-option>
          <a-option :value="2000">每2秒1次</a-option>
          <a-option :value="3000">每3秒1次</a-option>
          <a-option :value="5000">每5秒1次</a-option>
          <a-option :value="8000">每8秒1次</a-option>
        </a-select>
        <a-select v-model="state.giftAutoGiftIndex" size="small" style="flex:1" @change="autoRestart">
          <a-option v-for="(g, i) in giftList" :key="g.id" :value="i">{{ g.name }}</a-option>
        </a-select>
      </a-space>

      <a-space fill style="justify-content:space-between">
        <span style="font-size:12px;color:#888">状态: <span :style="{ color: state.giftAutoRunning ? '#4ade80' : '#888' }">{{ state.giftAutoRunning ? '运行中' : '停止' }}</span></span>
        <span style="font-size:12px;color:#888">已送 {{ state.giftSentCount }} 个</span>
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
