<script setup>
import { state } from '../../store/liveStore.js'
</script>

<template>
  <div class="giftToast" v-show="state.giftToastVisible">
    {{ state.giftToastText }}
  </div>
</template>

<style scoped>
.giftToast {
  position: absolute;
  left: 50%;
  top: 620px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, rgba(255, 45, 85, .9), rgba(255, 100, 130, .9));
  color: #fff;
  font-size: 26px;
  padding: 12px 32px;
  border-radius: 40px;
  z-index: 16;
  white-space: nowrap;
  animation: toastIn .4s ease-out;
  font-weight: bold;
  box-shadow: 0 0 40px rgba(255, 45, 85, .3);
}
@keyframes toastIn {
  0% { opacity: 0; transform: translateX(-50%) translateY(30px) scale(.8); }
  100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}
</style>
