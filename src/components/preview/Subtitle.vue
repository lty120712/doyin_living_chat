<script setup>
import { state, subtitleTop } from '../../store/liveStore.js'
</script>

<template>
  <div class="subtitle" :style="{ top: subtitleTop }" v-if="state.subtitle">
    {{ state.subtitle }}
  </div>
</template>

<style scoped>
.subtitle {
  position: absolute;
  left: 0;
  top: 1500px;
  width: 100%;
  text-align: center;
  font-size: 52px;
  font-weight: bold;
  color: #fff;
  text-shadow: 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000;
}
</style>
