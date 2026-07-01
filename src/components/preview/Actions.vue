<script setup>
import { state, actionsStyle, fmtNum, addLike } from '../../store/liveStore.js'
import LiveIcons from './LiveIcons.vue'

function openPicker() {
  state.giftPickerVisible = true
}
</script>

<template>
  <div class="actions" :style="actionsStyle">
    <div class="act act-like" @click="addLike()">
      <LiveIcons name="heart" />
      <span>{{ fmtNum(state.likeCount) }}</span>
    </div>
    <div class="act act-comment">
      <LiveIcons name="comment" />
      <span>{{ fmtNum(state.commentCount) }}</span>
    </div>
    <div class="act act-gift" @click="openPicker">
      <LiveIcons name="gift" />
    </div>
    <div class="act act-share">
      <LiveIcons name="share" />
    </div>
  </div>
</template>

<style scoped>
.actions {
  position: absolute;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}
.act {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 34px;
  cursor: pointer;
  transition: transform .15s;
  box-shadow: 0 6px 24px rgba(0, 0, 0, .35);
}
.act :deep(svg) {
  width: 38px;
  height: 38px;
}
.act:active {
  transform: scale(.82);
}
.act span {
  font-size: 19px;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, .5);
  font-weight: bold;
}
.act-like {
  background: linear-gradient(135deg, #ff4470, #ff2d55);
}
.act-comment {
  background: linear-gradient(135deg, #4dc9f6, #0284c7);
}
.act-gift {
  background: linear-gradient(135deg, #f59e0b, #ea580c);
}
.act-share {
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
}
</style>
