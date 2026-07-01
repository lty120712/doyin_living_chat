<script setup>
import { computed } from 'vue'
import { state, guestColors, getGuestLayout } from '../../store/liveStore.js'

const layoutArr = computed(() => getGuestLayout(state.guests.length))

function guestBorderRadius(size) {
  const minDim = Math.min(size.width, size.height)
  if (minDim < 150) return 12
  if (minDim < 250) return 18
  return 28
}

function guestBorderWidth(size) {
  const minDim = Math.min(size.width, size.height)
  if (minDim < 150) return 2
  if (minDim < 250) return 3
  return 4
}
</script>

<template>
  <div class="guest" v-for="(g, i) in state.guests" :key="i"
    :style="{
      position: 'absolute',
      left: layoutArr[i]?.left + 'px',
      top: layoutArr[i]?.top + 'px',
      width: layoutArr[i]?.width + 'px',
      height: layoutArr[i]?.height + 'px',
    }">
    <video autoplay muted loop src=""
      :poster="`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${layoutArr[i]?.width}' height='${layoutArr[i]?.height}'%3E%3Crect fill='%2300ff00' width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' fill='%2300aa00' font-size='28' text-anchor='middle' dy='.3em'%3E${g.name}画面%3C/text%3E%3C/svg%3E`"
      :style="{
        borderRadius: guestBorderRadius(layoutArr[i]) + 'px',
        borderWidth: guestBorderWidth(layoutArr[i]) + 'px',
      }">
    </video>
    <div class="guestNameTag" :style="{
      borderLeftColor: guestColors[i % guestColors.length],
      fontSize: (Math.min(layoutArr[i]?.width || 100, layoutArr[i]?.height || 100) < 150 ? 12 : 18) + 'px',
      padding: (Math.min(layoutArr[i]?.width || 100, layoutArr[i]?.height || 100) < 150 ? '2px 8px' : '4px 14px'),
      borderRadius: (Math.min(layoutArr[i]?.width || 100, layoutArr[i]?.height || 100) < 150 ? '10px' : '20px'),
    }">
      {{ g.name }}
    </div>
  </div>
</template>

<style scoped>
.guest video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #00ff00;
  border: 4px solid rgba(255, 255, 255, .85);
}
.guestNameTag {
  position: absolute;
  left: 8px;
  bottom: 8px;
  background: rgba(0, 0, 0, .5);
  color: #fff;
  backdrop-filter: blur(4px);
  white-space: nowrap;
}
</style>
