<template>
  <!-- 小心心 -->
  <svg v-if="type==='heart'" viewBox="0 0 64 64" fill="none">
    <path d="M32 56C32 56 8 38 8 22C8 14 14 8 22 8C26.8 8 30.8 10.4 32 14C33.2 10.4 37.2 8 42 8C50 8 56 14 56 22C56 38 32 56 32 56Z" :fill="color"/>
  </svg>

  <!-- 棒棒糖 -->
  <svg v-else-if="type==='lollipop'" viewBox="0 0 64 64" fill="none">
    <circle cx="26" cy="26" r="18" :fill="color"/>
    <path d="M26 8C22 8 6 22 6 26" :stroke="color" stroke-width="3" stroke-linecap="round"/>
    <circle cx="26" cy="26" r="12" fill="none" :stroke="color" stroke-width="2" opacity="0.4"/>
    <circle cx="26" cy="26" r="6" fill="none" :stroke="color" stroke-width="2" opacity="0.6"/>
  </svg>

  <!-- 鲜花 -->
  <svg v-else-if="type==='flower'" viewBox="0 0 64 64" fill="none">
    <line x1="32" y1="52" x2="32" y2="32" :stroke="color" stroke-width="3" stroke-linecap="round"/>
    <circle cx="22" cy="24" r="10" :fill="color" opacity="0.7"/>
    <circle cx="42" cy="24" r="10" :fill="color" opacity="0.7"/>
    <circle cx="32" cy="14" r="10" :fill="color" opacity="0.7"/>
    <circle cx="32" cy="34" r="10" :fill="color" opacity="0.7"/>
    <circle cx="32" cy="24" r="6" fill="#fff" opacity="0.3"/>
  </svg>

  <!-- 大啤酒 -->
  <svg v-else-if="type==='beer'" viewBox="0 0 64 64" fill="none">
    <rect x="16" y="12" width="26" height="40" rx="6" :fill="color"/>
    <rect x="42" y="16" width="10" height="32" rx="4" :fill="color" opacity="0.7"/>
    <rect x="18" y="8" width="22" height="6" rx="2" :fill="color" opacity="0.6"/>
    <rect x="20" y="20" width="18" height="6" rx="3" fill="#fff" opacity="0.4"/>
    <rect x="20" y="30" width="14" height="4" rx="2" fill="#fff" opacity="0.3"/>
  </svg>

  <!-- 亲吻 -->
  <svg v-else-if="type==='kiss'" viewBox="0 0 64 64" fill="none">
    <path d="M32 48C32 48 18 36 18 24C18 16 24 10 32 10C40 10 46 16 46 24C46 36 32 48 32 48Z" :fill="color" opacity="0.5"/>
    <path d="M24 28C24 30 28 32 30 28" :stroke="color" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M34 28C36 32 40 30 40 28" :stroke="color" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M30 36C30 39 34 40 34 36" :stroke="color" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  </svg>

  <!-- 礼花筒 -->
  <svg v-else-if="type==='popper'" viewBox="0 0 64 64" fill="none">
    <rect x="22" y="30" width="20" height="28" rx="4" :fill="color"/>
    <rect x="20" y="24" width="24" height="8" rx="3" :fill="color" opacity="0.8"/>
    <path d="M30 14L32 4L34 14" :stroke="color" stroke-width="3" stroke-linecap="round"/>
    <circle cx="26" cy="10" r="2" :fill="color" opacity="0.6"/>
    <circle cx="38" cy="8" r="2" :fill="color" opacity="0.6"/>
    <circle cx="34" cy="16" r="2" :fill="color" opacity="0.4"/>
    <circle cx="40" cy="14" r="1.5" :fill="color" opacity="0.5"/>
  </svg>

  <!-- 纸鹤 -->
  <svg v-else-if="type==='crane'" viewBox="0 0 64 64" fill="none">
    <path d="M32 4L48 28L32 22L16 28Z" :fill="color" opacity="0.4"/>
    <path d="M32 22L32 52" :stroke="color" stroke-width="2" stroke-linecap="round"/>
    <path d="M32 22L14 46" :stroke="color" stroke-width="2" stroke-linecap="round"/>
    <path d="M32 22L50 46" :stroke="color" stroke-width="2" stroke-linecap="round"/>
    <path d="M32 22L22 40" :stroke="color" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <path d="M32 22L42 40" :stroke="color" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <path d="M32 22L10 32" :stroke="color" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
    <path d="M32 22L54 32" :stroke="color" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
  </svg>

  <!-- 环游世界 -->
  <svg v-else-if="type==='world'" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="24" :fill="color" opacity="0.15"/>
    <circle cx="32" cy="32" r="24" :stroke="color" stroke-width="2.5" fill="none"/>
    <ellipse cx="32" cy="32" rx="12" ry="24" :stroke="color" stroke-width="1.5" fill="none" opacity="0.6"/>
    <line x1="8" y1="32" x2="56" y2="32" :stroke="color" stroke-width="1.5" opacity="0.6"/>
    <circle cx="32" cy="16" r="5" :fill="color" opacity="0.3"/>
    <circle cx="48" cy="22" r="4" :fill="color" opacity="0.3"/>
    <circle cx="20" cy="42" r="4" :fill="color" opacity="0.3"/>
  </svg>

  <!-- 浪漫列车 -->
  <svg v-else-if="type==='train'" viewBox="0 0 64 64" fill="none">
    <rect x="6" y="24" width="52" height="22" rx="6" :fill="color"/>
    <rect x="10" y="28" width="14" height="10" rx="3" fill="#fff" opacity="0.3"/>
    <rect x="28" y="28" width="14" height="10" rx="3" fill="#fff" opacity="0.3"/>
    <rect x="46" y="28" width="8" height="10" rx="3" fill="#fff" opacity="0.3"/>
    <circle cx="18" cy="52" r="5" :fill="color" opacity="0.7"/>
    <circle cx="46" cy="52" r="5" :fill="color" opacity="0.7"/>
    <circle cx="18" cy="52" r="2.5" fill="#fff" opacity="0.3"/>
    <circle cx="46" cy="52" r="2.5" fill="#fff" opacity="0.3"/>
  </svg>

  <!-- 保时捷 -->
  <svg v-else-if="type==='porsche'" viewBox="0 0 64 64" fill="none">
    <path d="M10 38L16 20H48L54 38L52 44H12Z" :fill="color"/>
    <rect x="14" y="28" width="16" height="10" rx="3" fill="#fff" opacity="0.3"/>
    <rect x="34" y="28" width="16" height="10" rx="3" fill="#fff" opacity="0.3"/>
    <circle cx="18" cy="48" r="6" :fill="color" opacity="0.7"/>
    <circle cx="46" cy="48" r="6" :fill="color" opacity="0.7"/>
    <circle cx="18" cy="48" r="3" fill="#fff" opacity="0.3"/>
    <circle cx="46" cy="48" r="3" fill="#fff" opacity="0.3"/>
  </svg>

  <!-- 跑车 -->
  <svg v-else-if="type==='sportcar'" viewBox="0 0 64 64" fill="none">
    <path d="M8 34L14 16H50L56 34L52 42H12Z" :fill="color"/>
    <path d="M24 16L18 34H46L40 16" :fill="color" opacity="0.6"/>
    <circle cx="18" cy="46" r="5" :fill="color" opacity="0.7"/>
    <circle cx="46" cy="46" r="5" :fill="color" opacity="0.7"/>
    <circle cx="18" cy="46" r="2.5" fill="#fff" opacity="0.3"/>
    <circle cx="46" cy="46" r="2.5" fill="#fff" opacity="0.3"/>
  </svg>

  <!-- 梦幻城堡 -->
  <svg v-else-if="type==='castle'" viewBox="0 0 64 64" fill="none">
    <rect x="18" y="26" width="28" height="30" rx="3" :fill="color"/>
    <rect x="14" y="22" width="8" height="10" rx="2" :fill="color" opacity="0.8"/>
    <rect x="42" y="22" width="8" height="10" rx="2" :fill="color" opacity="0.8"/>
    <rect x="28" y="12" width="8" height="18" rx="2" :fill="color" opacity="0.9"/>
    <path d="M28 12L32 4L36 12" :fill="color" opacity="0.9"/>
    <rect x="24" y="34" width="6" height="6" rx="2" fill="#fff" opacity="0.3"/>
    <rect x="34" y="34" width="6" height="6" rx="2" fill="#fff" opacity="0.3"/>
    <rect x="29" y="26" width="6" height="4" rx="2" fill="#fff" opacity="0.3"/>
  </svg>

  <!-- 私人飞机 -->
  <svg v-else-if="type==='jet'" viewBox="0 0 64 64" fill="none">
    <path d="M8 36L24 16H40L56 36L50 44H14Z" :fill="color"/>
    <ellipse cx="18" cy="34" rx="4" ry="6" fill="#fff" opacity="0.3"/>
    <ellipse cx="32" cy="34" rx="3" ry="5" fill="#fff" opacity="0.3"/>
    <ellipse cx="46" cy="34" rx="4" ry="6" fill="#fff" opacity="0.3"/>
    <path d="M56 36L60 30" :stroke="color" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M56 38L62 42" :stroke="color" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <path d="M8 36L4 30" :stroke="color" stroke-width="2.5" stroke-linecap="round"/>
  </svg>

  <!-- 独角兽 -->
  <svg v-else-if="type==='unicorn'" viewBox="0 0 64 64" fill="none">
    <path d="M32 24C32 24 16 16 16 34C16 46 32 54 32 56C32 54 48 46 48 34C48 16 32 24 32 24Z" :fill="color" opacity="0.4"/>
    <path d="M32 24L28 8L36 8L32 24Z" :fill="color"/>
    <circle cx="28" cy="34" r="3" fill="#fff" opacity="0.4"/>
    <circle cx="36" cy="34" r="3" fill="#fff" opacity="0.4"/>
    <path d="M24 42C26 44 30 46 32 46C34 46 38 44 40 42" :stroke="color" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>

  <!-- 龙 -->
  <svg v-else-if="type==='dragon'" viewBox="0 0 64 64" fill="none">
    <path d="M16 28C16 16 32 12 48 24C56 30 54 44 46 48C38 52 28 50 22 44" :stroke="color" stroke-width="3" fill="none"/>
    <path d="M16 28C12 22 8 8 8 8C8 8 16 12 22 20" :stroke="color" stroke-width="3" fill="none"/>
    <circle cx="42" cy="30" r="3" :fill="color"/>
    <path d="M12 12L16 8" :stroke="color" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    <path d="M8 14L12 10" :stroke="color" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  </svg>

  <!-- 火箭 -->
  <svg v-else-if="type==='rocket'" viewBox="0 0 64 64" fill="none">
    <path d="M32 4L22 34H42Z" :fill="color"/>
    <rect x="26" y="34" width="12" height="16" rx="4" :fill="color" opacity="0.8"/>
    <path d="M24 50L22 56L32 52L42 56L40 50" :fill="color" opacity="0.6"/>
    <circle cx="32" cy="24" r="5" fill="#fff" opacity="0.3"/>
    <path d="M20 14L16 6L22 10" :fill="color" opacity="0.5"/>
    <path d="M44 14L48 6L42 10" :fill="color" opacity="0.5"/>
  </svg>

  <!-- 抖音1号 -->
  <svg v-else-if="type==='douyin1'" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="28" :fill="color" opacity="0.15"/>
    <circle cx="32" cy="32" r="28" :stroke="color" stroke-width="3" fill="none"/>
    <text x="32" y="40" text-anchor="middle" :fill="color" font-size="28" font-weight="bold" font-family="sans-serif">1</text>
  </svg>

  <!-- 嘉年华 -->
  <svg v-else-if="type==='carnival'" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="28" :fill="color" opacity="0.2"/>
    <path d="M20 22L28 12L36 22L44 14L40 26L52 24L44 34L56 36L46 40L52 50L40 44L36 54L28 46L24 54L22 44L14 48L20 38L10 34L20 30Z" :fill="color" opacity="0.5"/>
    <circle cx="32" cy="32" r="14" :fill="color"/>
    <circle cx="32" cy="32" r="7" fill="#fff" opacity="0.3"/>
    <text x="32" y="37" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold" font-family="sans-serif">嘉</text>
  </svg>

  <!-- default gift box -->
  <svg v-else viewBox="0 0 64 64" fill="none">
    <rect x="8" y="24" width="48" height="34" rx="6" :fill="color"/>
    <path d="M32 6L38 22H26L32 6Z" :fill="color" opacity="0.6"/>
    <path d="M8 24H56" :stroke="color" stroke-width="3" opacity="0.7"/>
    <rect x="8" y="22" width="48" height="6" rx="3" :fill="color" opacity="0.8"/>
    <rect x="30" y="8" width="4" height="18" rx="2" :fill="color"/>
    <path d="M20 18C16 18 12 14 14 10C16 7 20 8 24 10" :stroke="color" stroke-width="2" fill="none" opacity="0.5"/>
    <path d="M44 18C48 18 52 14 50 10C48 7 44 8 40 10" :stroke="color" stroke-width="2" fill="none" opacity="0.5"/>
  </svg>
</template>

<script setup>
defineProps({
  type: { type: String, required: true },
  color: { type: String, default: '#ff2d55' }
})
</script>
