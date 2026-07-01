<script setup>
import { state, parseNum } from '../../store/liveStore.js'

function updateStats() {
  state.likeCount = parseNum(state._likeInit || '3.2万')
  state.commentCount = parseNum(state._commentInit || '892')
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
</style>
