<script setup>
import { ref, onMounted } from 'vue'
import { exportConfigJSON, importConfigJSON, buildConfigJSON } from '../../store/liveStore.js'

const configJson = ref('')
const fileInput = ref(null)
const msg = ref('')
const ok = ref(false)
const visible = ref(false)

function open() {
  configJson.value = buildConfigJSON()
  msg.value = ''
  visible.value = true
}

function handleApply() {
  const result = importConfigJSON(configJson.value)
  ok.value = result
  msg.value = result ? '应用成功' : 'JSON 格式有误'
  setTimeout(() => { msg.value = '' }, 2000)
}

function handleRefresh() {
  configJson.value = buildConfigJSON()
  msg.value = ''
}

function handleExport() {
  configJson.value = exportConfigJSON()
  msg.value = '已导出'
  ok.value = true
  setTimeout(() => { msg.value = '' }, 2000)
}

function handleImportClick() {
  fileInput.value?.click()
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    configJson.value = ev.target.result
    const result = importConfigJSON(ev.target.result)
    ok.value = result
    msg.value = result ? '导入成功' : 'JSON 格式有误'
    setTimeout(() => { msg.value = '' }, 2000)
  }
  reader.readAsText(file)
  e.target.value = ''
}
</script>

<template>
  <a-card title="📋 JSON 配置" :bordered="false" class="section-card">
    <a-space direction="vertical" fill>
      <span style="font-size:12px;color:#888">在线编辑观众 / 语录 / 房间设置</span>
      <a-button type="primary" long @click="open" style="background:#ff2d55;border-color:#ff2d55">打开 JSON 编辑器</a-button>
    </a-space>
  </a-card>

  <a-modal
    v-model:visible="visible"
    title="JSON 配置编辑器"
    :width="900"
    :footer="false"
    :mask-closable="true"
    unmount-on-close
  >
    <a-space direction="vertical" fill style="width:100%">
      <a-textarea
        v-model="configJson"
        :auto-size="{ minRows: 16, maxRows: 22 }"
        style="font-family:'Cascadia Code','Fira Code',Consolas,monospace;font-size:13px;width:100%;line-height:1.5"
        placeholder="在此编辑 JSON 配置"
      />
      <a-space fill style="margin-top:8px">
        <a-button type="primary" size="medium" @click="handleApply" style="background:#ff2d55;border-color:#ff2d55">应用</a-button>
        <a-button size="medium" @click="handleRefresh">刷新</a-button>
        <a-button size="medium" @click="handleExport">导出文件</a-button>
        <a-button size="medium" @click="handleImportClick">导入文件</a-button>
      </a-space>
      <input ref="fileInput" type="file" accept=".json" style="display:none" @change="handleFileChange" />
      <span v-if="msg" style="font-size:13px" :style="{ color: ok ? '#4ade80' : '#ef4444' }">{{ msg }}</span>
    </a-space>
  </a-modal>
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
