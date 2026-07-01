<script setup>
function exportHTML() {
  const html = document.documentElement.outerHTML
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'douyin_live_export.html'
  a.click()
}
</script>

<template>
  <a-card title="💾 导出" :bordered="false" class="section-card">
    <a-button type="primary" long @click="exportHTML" style="background:#ff2d55;border-color:#ff2d55">
      📥 导出当前为独立HTML
    </a-button>
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
