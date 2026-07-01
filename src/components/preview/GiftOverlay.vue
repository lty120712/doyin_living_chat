<script setup>
import { state } from '../../store/liveStore.js'
import GiftIcon from './GiftIcon.vue'

function overlayStyle(g, i, total) {
  const offsetX = (i - (total - 1) / 2) * 60
  const offsetY = (i - (total - 1) / 2) * 20
  const rot = (i - (total - 1) / 2) * 8
  const scale = 1 - i * 0.06
  return {
    transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) rotate(${rot}deg) scale(${scale})`,
    zIndex: 20 + i,
  }
}
</script>

<template>
  <div class="giftOverlay" v-for="(g, i) in state.activeGiftOverlays" :key="g.id">
    <div class="giftBg" :style="{ background: `radial-gradient(ellipse at center, ${g.color}44, transparent 70%)` }"></div>
    <div class="giftInner" :style="overlayStyle(g, i, state.activeGiftOverlays.length)">
      <span class="giftBigIcon">
        <GiftIcon :type="g.giftId" :color="g.color" />
      </span>
      <span class="giftBigText" :style="{ color: g.color }">{{ g.name }}</span>
      <span class="giftBigSub">{{ g.sub }}</span>
    </div>
  </div>
</template>

<style scoped>
.giftOverlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  pointer-events: none;
}
.giftBg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.giftInner {
  position: absolute;
  left: 50%;
  top: 50%;
  text-align: center;
  transition: opacity .3s;
}
.giftBigIcon {
  font-size: 140px;
  display: block;
  animation: giftBounce .6s ease-out;
}
.giftBigIcon :deep(svg) {
  width: 140px;
  height: 140px;
  filter: drop-shadow(0 0 30px currentColor);
}
.giftBigText {
  display: block;
  font-size: 48px;
  font-weight: bold;
  text-shadow: 0 0 30px currentColor, 0 0 60px rgba(255, 255, 255, .2);
  margin-top: 4px;
}
.giftBigSub {
  display: block;
  color: #fff;
  font-size: 26px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, .8);
  margin-top: 6px;
}
@keyframes giftBounce {
  0% { transform: scale(0) rotate(-30deg); }
  60% { transform: scale(1.3) rotate(8deg); }
  100% { transform: scale(1) rotate(0deg); }
}
</style>
