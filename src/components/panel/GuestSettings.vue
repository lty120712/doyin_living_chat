<script setup>
import { state, addGuest, removeGuest, removeAllGuests, guestColors } from '../../store/liveStore.js'

function batchAdd(n) {
  for (let i = 0; i < n; i++) addGuest()
}
</script>

<template>
  <a-card title="👥 连麦嘉宾 ({{ state.guests.length }}/32)" :bordered="false" class="section-card">
    <div class="guestListScroll">
      <div class="guestItem" v-for="(g, i) in state.guests" :key="i"
        :style="{ borderLeftColor: guestColors[i % guestColors.length] }">
        <a-input v-model="state.guests[i].name" size="mini" placeholder="嘉宾名称" style="margin-bottom:4px" />
        <a-button status="danger" size="mini" long @click="removeGuest(i)">✕</a-button>
      </div>
    </div>
    <a-space fill style="margin-top:6px">
      <a-button type="primary" status="success" size="small" @click="addGuest" :disabled="state.guests.length >= 32">＋1</a-button>
      <a-button size="small" @click="batchAdd(5)" :disabled="state.guests.length >= 32">＋5</a-button>
      <a-button size="small" @click="batchAdd(10)" :disabled="state.guests.length >= 32">＋10</a-button>
      <a-button size="small" @click="batchAdd(32 - state.guests.length)" :disabled="state.guests.length >= 32">加满</a-button>
    </a-space>
    <a-button status="danger" size="small" long style="margin-top:8px" @click="removeAllGuests" :disabled="state.guests.length === 0">
      一键移除全部嘉宾
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
.guestListScroll {
  max-height: 200px;
  overflow-y: auto;
}
.guestItem {
  background: rgba(255, 255, 255, .03);
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 6px;
  border-left: 3px solid #0f3460;
}
</style>
