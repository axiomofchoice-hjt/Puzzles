<script setup lang="ts">
import BackButton from '@/assets/icons/BackButton.vue';
import RestartButton from '@/assets/icons/RestartButton.vue';
import TipButton from '@/assets/icons/TipButton.vue';
import { Config } from '@/ts/Config';
import type { Page } from '@/ts/Page';
import { computed } from 'vue';

const props = defineProps<{ page: Page; }>();
defineEmits(['back', 'restart']);

const buttonStyle = {
  padding: (Config.buttons.size - Config.buttons.svgSize) / 2 + 'px',
  marginBottom: (Config.buttons.gap) + 'px'
};

const { back, restart, tip } = props.page.buttons;

const tipContentStyle = computed(() => ({
  right: Config.buttons.size + 'px',
  // height: Config.buttons.size + 'px',
  fontSize: Config.buttons.tipFontSize + 'px',
  lineHeight: Config.buttons.tipFontSize + 'px',
  margin: (Config.buttons.size - Config.buttons.tipHeight) / 2 + 'px 0',
  padding: (Config.buttons.tipHeight - Config.buttons.tipFontSize) / 2 - 2 + 'px',
  opacity: (tip.show && tip.hover ? "1" : "0")
}));
</script>
<template>
  <div style="position: absolute;" :style="{ top: page.buttons_pos.x + 'px', left: page.buttons_pos.y + 'px' }">
    <div class="button-component" :style="buttonStyle" @mouseover="back.hover = true" @mouseout="back.hover = false"
      @click="$emit('back')" v-show="back.show">
      <BackButton :width="Config.buttons.svgSize" :height="Config.buttons.svgSize" :color="back.color" />
    </div>
    <div class="button-component" :style="buttonStyle" @mouseover="restart.hover = true" @mouseout="restart.hover = false"
      @click="$emit('restart')" v-show="restart.show">
      <RestartButton :width="Config.buttons.svgSize" :height="Config.buttons.svgSize" :color="restart.color" />
    </div>
    <div class="tip-content" :style="tipContentStyle">{{ page.buttons.tip_content }}</div>
    <div class="button-component" :style="buttonStyle" @mouseover="tip.hover = true" @mouseout="tip.hover = false"
      v-show="tip.show">
      <TipButton :width="Config.buttons.svgSize" :height="Config.buttons.svgSize" :color="tip.color" />
    </div>
  </div>
</template>
<style scoped>
.button-component {
  font-size: 0;
  pointer-events: auto;
  /* border: 1px solid black; */
  /* border-radius: 50%; */
}

.tip-content {
  position: absolute;
  transition: 0.5s opacity ease;
  background-color: #ffffff80;
  border-top: 2px solid lightgrey;
  border-bottom: 2px solid lightgrey;
  white-space: nowrap;
  font-family: msyh subset, 微软雅黑;
}
</style>
