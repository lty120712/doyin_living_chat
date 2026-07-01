<script setup>
import { state, rankList } from '../../store/liveStore.js'
import LiveIcons from '../preview/LiveIcons.vue'

function fmtContribution(n) {
  if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '万'
  return String(Math.floor(n))
}

function closePanel() {
  state.rankPanelVisible = false
}
</script>

<template>
  <Transition name="rankSlide">
    <div class="rankWrapper" v-if="state.rankPanelVisible">
      <div class="rankBackdrop" @click="closePanel"></div>
      <div class="rankPanel" @click.stop>
      <div class="rankHeader">
        <div class="rankTabs">
          <span class="rankTab active">本场贡献</span>
        </div>
        <span class="rankClose" @click="closePanel">
          <LiveIcons name="close" />
        </span>
      </div>

      <div class="topThree" v-if="rankList.length >= 3">
        <div class="top3Item top2" v-if="rankList[1]">
          <div class="top3Avatar" :style="{ background: rankList[1].avatar }">{{ rankList[1].name[0] }}</div>
          <div class="top3Name">{{ rankList[1].name }}</div>
          <div class="top3Contribution">{{ fmtContribution(rankList[1].contribution) }}🎖</div>
          <div class="top3Medal">🥈</div>
        </div>
        <div class="top3Item top1" v-if="rankList[0]">
          <div class="top3Avatar crown" :style="{ background: rankList[0].avatar }">{{ rankList[0].name[0] }}</div>
          <div class="top3Name">{{ rankList[0].name }}</div>
          <div class="top3Contribution">{{ fmtContribution(rankList[0].contribution) }}🎖</div>
          <div class="top3Crown">👑</div>
        </div>
        <div class="top3Item top3" v-if="rankList[2]">
          <div class="top3Avatar" :style="{ background: rankList[2].avatar }">{{ rankList[2].name[0] }}</div>
          <div class="top3Name">{{ rankList[2].name }}</div>
          <div class="top3Contribution">{{ fmtContribution(rankList[2].contribution) }}🎖</div>
          <div class="top3Medal">🥉</div>
        </div>
      </div>

      <div class="rankListScroll">
        <div class="rankItem" v-for="(item, i) in rankList.slice(3)" :key="i">
          <span class="rankNum">{{ i + 4 }}</span>
          <span class="rankAvatar" :style="{ background: item.avatar }">{{ item.name[0] }}</span>
          <span class="rankName">{{ item.name }}</span>
          <span class="rankValue">{{ fmtContribution(item.contribution) }}</span>
        </div>
      </div>
    </div>
    </div>
  </Transition>
</template>

<style scoped>
.rankWrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 29;
}
.rankBackdrop {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 29;
  background: rgba(0, 0, 0, .25);
}
.rankPanel {
  position: absolute;
  right: 0;
  top: 0;
  width: 400px;
  height: 100%;
  background: rgba(10, 10, 30, .65);
  z-index: 30;
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(255, 255, 255, .06);
  backdrop-filter: blur(12px);
}
.rankHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 12px;
}
.rankTabs {
  display: flex;
  gap: 0;
}
.rankTab {
  color: #888;
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 6px;
}
.rankTab.active {
  color: #ffd92c;
  border-bottom: 2px solid #ffd92c;
}
.rankClose {
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.rankClose :deep(svg) {
  width: 20px;
  height: 20px;
}
.rankClose:hover {
  color: #fff;
}
.topThree {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 12px;
  padding: 8px 16px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, .04);
}
.top3Item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.top3Avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  border: 2px solid rgba(255, 255, 255, .3);
}
.top1 .top3Avatar {
  width: 72px;
  height: 72px;
  font-size: 28px;
  border-color: #ffd92c;
  box-shadow: 0 0 20px rgba(255, 217, 44, .4);
}
.top3Crown {
  font-size: 28px;
  margin-top: -8px;
}
.top3Medal {
  font-size: 24px;
}
.top3Name {
  color: #ccc;
  font-size: 13px;
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.top3Contribution {
  color: #ffd92c;
  font-size: 11px;
}
.rankListScroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 0 20px;
}
.rankItem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, .03);
}
.rankNum {
  width: 28px;
  text-align: center;
  color: #666;
  font-size: 14px;
  font-weight: bold;
}
.rankAvatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
}
.rankName {
  flex: 1;
  color: #ccc;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rankValue {
  color: #ffd92c;
  font-size: 13px;
  flex-shrink: 0;
}
.rankSlide-enter-active {
  transition: transform .35s ease-out;
}
.rankSlide-leave-active {
  transition: transform .25s ease-in;
}
.rankSlide-enter-from,
.rankSlide-leave-to {
  transform: translateX(100%);
}
</style>
