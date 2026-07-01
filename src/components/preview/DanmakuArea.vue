<script setup>
import { state } from '../../store/liveStore.js'
</script>

<template>
  <div class="danmuArea">
    <div class="dm" v-for="dm in state.danmuList" :key="dm.id">
      <span class="dmUser">{{ dm.user }}：</span>{{ dm.text }}
    </div>
  </div>
</template>

<style scoped>
.danmuArea {
  position: absolute;
  left: 24px;
  right: 180px;
  bottom: 85px;
  z-index: 4;
  display: flex;
  flex-direction: column-reverse;
  gap: 4px;
  pointer-events: none;
  max-height: 280px;
  overflow: hidden;
  padding: 6px 8px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 12px;
  background: rgba(0, 0, 0, .08);
}
.dm {
  background: rgba(0, 0, 0, .45);
  color: #fff;
  font-size: 22px;
  padding: 6px 12px;
  border-radius: 12px;
  animation: dmSlide .3s ease-out;
  backdrop-filter: blur(4px);
  width: fit-content;
  max-width: 100%;
  flex-shrink: 0;
}
.dmUser {
  color: #ffd92c;
  font-weight: bold;
}
@keyframes dmSlide {
  0% { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
}
</style>
