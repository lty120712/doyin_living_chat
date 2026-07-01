<script setup>
import { onMounted } from 'vue'
import LivePreview from './components/preview/LivePreview.vue'
import ControlPanel from './components/panel/ControlPanel.vue'
import { updateClock, initStats } from './store/liveStore.js'

onMounted(() => {
  initStats()
  updateClock()
  setInterval(updateClock, 10000)
})
</script>

<template>
  <div class="app-container">
    <LivePreview />
    <ControlPanel />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}
</style>
