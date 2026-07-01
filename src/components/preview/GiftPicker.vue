<script setup>
import { state, giftList, sendGift } from '../../store/liveStore.js'
import LiveIcons from './LiveIcons.vue'
import GiftIcon from './GiftIcon.vue'

function close() {
  state.giftPickerVisible = false
}

function selectGift(gift) {
  sendGift(gift)
  close()
}
</script>

<template>
  <div class="giftPicker" :class="{ show: state.giftPickerVisible }">
    <span class="gpClose" @click="close">
      <LiveIcons name="close" />
    </span>
    <div class="gpTitle">🎁 选择礼物</div>
    <div class="gpGrid">
      <div class="gpItem" v-for="g in giftList" :key="g.id" @click="selectGift(g)" :style="{ '--gift-color': g.color }">
        <div class="gpIconWrap">
          <GiftIcon :type="g.id" :color="g.color" />
        </div>
        <div class="gpName">{{ g.name }}</div>
        <div class="gpPrice">🪙 {{ g.price }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.giftPicker {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 440px;
  background: rgba(20, 20, 40, .96);
  z-index: 25;
  border-radius: 30px 30px 0 0;
  padding: 20px;
  display: none;
  backdrop-filter: blur(10px);
  overflow-y: auto;
}
.giftPicker.show {
  display: block;
}
.gpTitle {
  color: #fff;
  font-size: 22px;
  margin-bottom: 14px;
}
.gpGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.gpItem {
  background: rgba(255, 255, 255, .04);
  border-radius: 14px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: .2s;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.gpItem:hover {
  border-color: var(--gift-color);
  background: color-mix(in srgb, var(--gift-color) 15%, transparent);
}
.gpIconWrap {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gpIconWrap :deep(svg) {
  width: 52px;
  height: 52px;
}
.gpName {
  color: #ccc;
  font-size: 13px;
  white-space: nowrap;
}
.gpPrice {
  color: #ffd92c;
  font-size: 11px;
}
.gpClose {
  position: absolute;
  right: 20px;
  top: 20px;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gpClose :deep(svg) {
  width: 20px;
  height: 20px;
}
.gpClose:hover {
  color: #fff;
}
</style>
