<template>
  <!-- 抖音风格点赞爱心 -->
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="name==='heart'" class="live-icon">
    <path d="M24 42C24 42 6 28.5 6 16.5C6 10.5 10.5 6 16.5 6C20.1 6 23.1 7.8 24 10.5C24.9 7.8 27.9 6 31.5 6C37.5 6 42 10.5 42 16.5C42 28.5 24 42 24 42Z" fill="currentColor"/>
    <path d="M24 42C24 42 6 28.5 6 16.5C6 10.5 10.5 6 16.5 6C20.1 6 23.1 7.8 24 10.5C24.9 7.8 27.9 6 31.5 6C37.5 6 42 10.5 42 16.5C42 28.5 24 42 24 42Z" fill="url(#heartGrad)" opacity="0.4"/>
    <defs>
      <linearGradient id="heartGrad" x1="6" y1="6" x2="42" y2="42"><stop stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    </defs>
  </svg>

  <!-- 抖音风格评论气泡 -->
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" v-else-if="name==='comment'">
    <path d="M42 12C42 9.79086 40.2091 8 38 8H10C7.79086 8 6 9.79086 6 12V32C6 34.2091 7.79086 36 10 36H33L42 44V12Z" fill="currentColor" opacity="0.25"/>
    <path d="M40 12C40 10.3431 38.6569 9 37 9H11C9.34315 9 8 10.3431 8 12V30C8 31.6569 9.34315 33 11 33H32L40 39V12Z" fill="currentColor"/>
    <circle cx="17" cy="21" r="2.5" fill="#fff" opacity="0.5"/>
    <circle cx="24" cy="21" r="2.5" fill="#fff" opacity="0.5"/>
    <circle cx="31" cy="21" r="2.5" fill="#fff" opacity="0.5"/>
  </svg>

  <!-- 抖音风格礼物盒 -->
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" v-else-if="name==='gift'">
    <rect x="8" y="18" width="32" height="24" rx="4" fill="currentColor"/>
    <rect x="8" y="18" width="32" height="4" fill="#fff" opacity="0.3"/>
    <path d="M24 6L28 14H20L24 6Z" fill="currentColor"/>
    <path d="M8 14H40V18H8V14Z" fill="currentColor" opacity="0.7"/>
    <rect x="8" y="14" width="32" height="2" fill="#fff" opacity="0.3"/>
    <rect x="22" y="6" width="4" height="12" rx="2" fill="currentColor"/>
    <path d="M18 14C16.3431 14 14 11.5 16 8C17 6 19.5 5.5 22 7" stroke="currentColor" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M30 14C31.6569 14 34 11.5 32 8C31 6 28.5 5.5 26 7" stroke="currentColor" stroke-width="2" fill="none" opacity="0.6"/>
  </svg>

  <!-- 抖音风格分享箭头 -->
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" v-else-if="name==='share'">
    <path d="M24 4L24 28" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M16 12L24 4L32 12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M14 22C10 22 8 24 8 28V36C8 40 10 42 14 42H34C38 42 40 40 40 36V28C40 24 38 22 34 22" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>
  </svg>

  <!-- 关闭按钮 X -->
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" v-else-if="name==='close'">
    <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  </svg>

  <!-- 直播圆点 -->
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" v-else-if="name==='liveDot'">
    <circle cx="12" cy="12" r="10" fill="#ff2d55"/>
    <circle cx="12" cy="12" r="6" fill="#fff" opacity="0.4"/>
    <circle cx="12" cy="12" r="3" fill="#fff"/>
  </svg>

  <!-- 人物/观众图标 -->
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" v-else-if="name==='person'">
    <circle cx="12" cy="8" r="4" fill="currentColor"/>
    <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22" fill="currentColor" opacity="0.5"/>
  </svg>

  <!-- 发送按钮 -->
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" v-else-if="name==='send'">
    <path d="M5 12L3 21L21 12L3 3L5 12ZM5 12H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>
</template>

<script setup>
defineProps({
  name: { type: String, required: true }
})
</script>

<style scoped>
.live-icon {
  width: 1em;
  height: 1em;
}
</style>
