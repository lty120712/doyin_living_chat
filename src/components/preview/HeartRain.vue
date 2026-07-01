<script setup>
import { state } from '../../store/liveStore.js'
</script>

<template>
  <div class="heartRain">
    <div class="heart" v-for="h in state.hearts" :key="h.id"
      :style="{
        left: h.left + '%',
        top: h.top + '%',
        color: h.color,
        fontSize: h.fontSize + 'px',
      }">
      ♥
    </div>
  </div>
</template>

<style scoped>
.heartRain {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 15;
  pointer-events: none;
}
.heart {
  position: absolute;
  z-index: 15;
  animation: floatHeart 2.2s ease-out forwards;
  filter: drop-shadow(0 3px 10px rgba(255, 45, 85, .4));
}
@keyframes floatHeart {
  0% { opacity: 1; transform: translate(0, 0) scale(.5); }
  15% { opacity: 1; transform: translate(-8px, -30px) scale(1.1); }
  50% { opacity: .85; transform: translate(-30px, -120px) scale(.9); }
  80% { opacity: .4; transform: translate(-20px, -200px) scale(.7); }
  100% { opacity: 0; transform: translate(0, -300px) scale(.4); }
}
</style>
