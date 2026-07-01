<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { state, initAudience } from '../../store/liveStore.js'
import TopBar from './TopBar.vue'
import HostVideo from './HostVideo.vue'
import GuestContainer from './GuestContainer.vue'
import PkBar from './PkBar.vue'
import Subtitle from './Subtitle.vue'
import DanmakuArea from './DanmakuArea.vue'
import InputArea from './InputArea.vue'
import Actions from './Actions.vue'
import HeartRain from './HeartRain.vue'
import GiftOverlay from './GiftOverlay.vue'
import GiftToast from './GiftToast.vue'
import GiftPicker from './GiftPicker.vue'
import RankPanel from './RankPanel.vue'
import MediaEditor from './MediaEditor.vue'

const liveRef = ref(null)
const previewRef = ref(null)

function fitStage() {
  if (!liveRef.value || !previewRef.value) return
  const pw = previewRef.value.clientWidth - 20
  const ph = previewRef.value.clientHeight - 20
  const s = Math.min(pw / 1080, ph / 1920)
  liveRef.value.style.transform = `scale(${s})`
}

onMounted(() => {
  fitStage()
  initAudience()
  window.addEventListener('resize', fitStage)
})
onUnmounted(() => {
  window.removeEventListener('resize', fitStage)
})
</script>

<template>
  <div class="preview" ref="previewRef">
    <div class="stage">
      <div id="live" ref="liveRef">
        <TopBar />
        <HostVideo />
        <GuestContainer />
        <PkBar v-if="state.guests.length > 0" />
        <Subtitle />
        <DanmakuArea />
        <InputArea />
        <Actions />
        <HeartRain />
        <GiftToast />
        <GiftOverlay />
        <GiftPicker />
        <RankPanel />
      </div>
    </div>
    <MediaEditor />
  </div>
</template>

<style scoped>
.preview {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #111;
  overflow: hidden;
  position: relative;
}
.stage {
  display: flex;
  justify-content: center;
  align-items: center;
}
#live {
  position: relative;
  width: 1080px;
  height: 1920px;
  transform-origin: center center;
  background: transparent;
  overflow: hidden;
}
</style>
