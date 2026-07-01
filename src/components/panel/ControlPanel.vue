<script setup>
import BasicSettings from './BasicSettings.vue'
import GuestSettings from './GuestSettings.vue'
import DanmakuSettings from './DanmakuSettings.vue'
import LikeSettings from './LikeSettings.vue'
import GiftSettings from './GiftSettings.vue'
import ExportButton from './ExportButton.vue'
import DataSettings from './DataSettings.vue'
</script>

<template>
  <div class="panel">
    <h2 class="panel-title">🎛 直播间编辑器</h2>
    <BasicSettings />
    <GuestSettings />
    <DanmakuSettings />
    <LikeSettings />
    <GiftSettings />
    <DataSettings />
    <ExportButton />
  </div>
</template>

<style scoped>
.panel {
  width: 380px;
  min-width: 380px;
  height: 100vh;
  background: #16213e;
  color: #eee;
  overflow-y: auto;
  padding: 20px;
  border-left: 2px solid #0f3460;
}
.panel::-webkit-scrollbar {
  width: 6px;
}
.panel::-webkit-scrollbar-thumb {
  background: #0f3460;
  border-radius: 3px;
}
.panel-title {
  font-size: 18px;
  color: #ff2d55;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #ff2d55;
}
</style>
