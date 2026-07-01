<script setup>
import { state } from '../../store/liveStore.js'
</script>

<template>
  <div class="pkBar">
    <span class="pkLabel">{{ state.pkLabel }}</span>
  </div>
</template>

<style scoped>
.pkBar {
  position: absolute;
  left: 0;
  right: 0;
  top: 1430px;
  height: 40px;
  background: #141414;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pkLabel {
  background: #ff2d55;
  color: #fff;
  font-size: 26px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  padding: 0 40px;
  border-radius: 25px;
  box-shadow: 0 0 0 4px #ff2d55;
  position: relative;
  z-index: 6;
}
</style>
