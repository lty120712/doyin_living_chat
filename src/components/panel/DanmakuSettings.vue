<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { state, addDanmu, randomDanmuUserText, defaultAudience } from '../../store/liveStore.js'

const selUser = ref('')
const selText = ref('')
const customUser = ref(false)
const customText = ref(false)

const audienceNames = computed(() => state.audience.map(a => a.name))
const selectedAudience = computed(() => state.audience.find(a => a.name === selUser.value))
const audienceTexts = computed(() => selectedAudience.value?.texts || [])

function sendDanmu() {
  const user = selUser.value || '观众'
  const text = selText.value
  if (!text) return
  addDanmu(user, text)
}

function addRandom() {
  const dm = randomDanmuUserText()
  addDanmu(dm.user, dm.text)
  if (state.danmuAutoRunning) state.danmuSentCount++
}

let danmuAutoTimer = null

function autoStart() {
  if (danmuAutoTimer) return
  state.danmuAutoRunning = true
  danmuAutoTimer = setInterval(() => { addRandom() }, state.danmuFreq)
}

function autoStop() {
  if (danmuAutoTimer) { clearInterval(danmuAutoTimer); danmuAutoTimer = null }
  state.danmuAutoRunning = false
}

function autoRestart() { autoStop(); autoStart() }

function selectUser(name) {
  selUser.value = name
  customUser.value = false
}

function selectText(t) {
  selText.value = t
  customText.value = false
}

onUnmounted(() => { autoStop() })
</script>

<template>
  <a-card title="💬 弹幕互动" :bordered="false" class="section-card">
    <a-space direction="vertical" fill>
      <span style="font-size:12px;color:#888">选择用户</span>
      <a-space fill>
        <a-select v-model="selUser" allow-search allow-clear placeholder="选择或搜索用户" size="small" style="flex:1" @change="selectUser">
          <a-option v-for="a in state.audience" :key="a.name" :value="a.name">{{ a.name }}</a-option>
        </a-select>
        <a-button size="small" @click="customUser = true; selUser = ''">自定义</a-button>
      </a-space>
      <a-input v-if="customUser || (!selUser && audienceNames.length === 0)" v-model="selUser" placeholder="输入用户昵称" size="small" />

      <span style="font-size:12px;color:#888;margin-top:4px">选择语录</span>
      <a-space fill>
        <a-select v-model="selText" allow-search allow-clear placeholder="选择用户语录" size="small" style="flex:1" :disabled="!selectedAudience">
          <a-option v-for="t in audienceTexts" :key="t" :value="t">{{ t }}</a-option>
        </a-select>
        <a-button size="small" @click="customText = true; selText = ''">自定义</a-button>
      </a-space>
      <a-input v-if="customText || !selText" v-model="selText" placeholder="手动输入弹幕内容" size="small" @keydown.enter="sendDanmu" />

      <a-space>
        <a-button type="primary" size="small" @click="sendDanmu" style="background:#ff2d55;border-color:#ff2d55">发送</a-button>
        <a-button size="small" @click="addRandom">随机1条</a-button>
      </a-space>

      <a-space direction="vertical" fill style="margin-top:4px">
        <span style="font-size:12px;color:#888">自动弹幕</span>
        <a-space>
          <a-button :type="state.danmuAutoRunning ? 'secondary' : 'primary'" status="success" size="small" @click="autoStart">▶ 开</a-button>
          <a-button status="danger" size="small" @click="autoStop">⏹ 关</a-button>
          <a-select v-model="state.danmuFreq" size="small" style="width:120px" @change="autoRestart">
            <a-option :value="1000">每1秒</a-option>
            <a-option :value="2000">每2秒</a-option>
            <a-option :value="4000">每4秒</a-option>
            <a-option :value="7000">每7秒</a-option>
            <a-option :value="12000">每12秒</a-option>
            <a-option :value="20000">每20秒</a-option>
          </a-select>
        </a-space>
      </a-space>

      <a-space fill style="justify-content:space-between">
        <span style="font-size:12px;color:#888">状态: <span :style="{ color: state.danmuAutoRunning ? '#4ade80' : '#888' }">{{ state.danmuAutoRunning ? '运行中' : '停止' }}</span></span>
        <span style="font-size:12px;color:#888">已发 {{ state.danmuSentCount }} 条</span>
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
