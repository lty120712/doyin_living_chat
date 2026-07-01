<script setup>
import { state, updateClock } from '../../store/liveStore.js'
import LiveIcons from './LiveIcons.vue'
import { onMounted, onUnmounted } from 'vue'

let clockTimer = null
onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 10000)
})
onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})

function toggleRank() {
  state.rankPanelVisible = !state.rankPanelVisible
}
</script>

<template>
  <div class="topBar">
    <div class="topBarRight">
      <span class="rankBtn" @click="toggleRank" :class="{ active: state.rankPanelVisible }">
        🏆 榜
      </span>
      <span class="onlineCount">
        <LiveIcons name="person" />
        {{ state.viewers }}
      </span>
      <span class="closeBtn">
        <LiveIcons name="close" />
      </span>
    </div>
  </div>

  <div class="hostTopInfo">
    <span class="liveTag">
      <LiveIcons name="liveDot" />
      直播
    </span>
    <span class="currTime">{{ state.currentTime }}</span>
    <span class="roomTitle">{{ state.roomTitle }}</span>
  </div>
</template>

<style scoped>
.topBar {
  position: absolute;
  left: 24px;
  right: 24px;
  top: 18px;
  height: 52px;
  display: flex;
  align-items: center;
  z-index: 10;
  pointer-events: none;
}
.topBarRight {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}
.rankBtn {
  background: rgba(0, 0, 0, .55);
  color: #ffd92c;
  font-size: 20px;
  height: 36px;
  line-height: 36px;
  padding: 0 14px;
  border-radius: 18px;
  cursor: pointer;
  pointer-events: auto;
  transition: .2s;
  font-weight: bold;
}
.rankBtn:hover,
.rankBtn.active {
  background: rgba(255, 217, 44, .2);
}
.onlineCount {
  background: rgba(0, 0, 0, .55);
  color: #fff;
  font-size: 22px;
  height: 36px;
  line-height: 36px;
  padding: 0 14px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
.onlineCount :deep(svg) {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.closeBtn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, .5);
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
}
.closeBtn :deep(svg) {
  width: 16px;
  height: 16px;
}
.hostTopInfo {
  position: absolute;
  left: 12px;
  top: 12px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 6px;
  pointer-events: none;
}
.liveTag {
  background: #ff2d55;
  color: #fff;
  font-weight: bold;
  font-size: 22px;
  height: 38px;
  line-height: 38px;
  padding: 0 16px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}
.liveTag :deep(svg) {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
.currTime {
  color: #fff;
  font-size: 20px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, .8);
  opacity: .85;
}
.roomTitle {
  color: #fff;
  font-size: 22px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, .8);
}
</style>
