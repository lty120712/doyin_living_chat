<script setup>
import { state } from '../../store/liveStore.js'
import LiveIcons from './LiveIcons.vue'
</script>

<template>
  <div class="inputArea">
    <span class="placeholder">{{ state.placeholder }}</span>
    <span class="sendBtn">
      <LiveIcons name="gift" />
    </span>
  </div>
</template>

<style scoped>
.inputArea {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
  height: 60px;
  border-radius: 30px;
  background: rgba(30, 30, 30, .85);
  z-index: 5;
  display: flex;
  align-items: center;
  padding: 0 24px;
  color: #888;
  font-size: 26px;
}
.placeholder {
  flex: 1;
}
.sendBtn {
  position: absolute;
  right: 6px;
  top: 6px;
  height: 48px;
  line-height: 48px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: #ff2d55;
  color: #fff;
  cursor: pointer;
}
.sendBtn :deep(svg) {
  width: 24px;
  height: 24px;
}
</style>
