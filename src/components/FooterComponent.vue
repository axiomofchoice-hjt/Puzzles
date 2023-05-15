<script setup lang="ts">
import { Config } from '@/ts/Config';
import type { Footer } from '@/ts/Footer';
import { Task } from '@/ts/Task';
import { computed } from 'vue';

const props = defineProps<{ footer: Footer; }>();

const footerStyle = computed(() => ({
  height: Config.footer.getHeight() - 2 + 'px',
  backgroundColor: props.footer.all_ok ? 'lightgreen' : 'white',
}));
const textStyle = {
  paddingTop: Config.footer.top + 'px',
  paddingBottom: Config.footer.bottom + 'px',
  paddingLeft: Config.footer.leftRight + 'px',
  paddingRight: Config.footer.leftRight + 'px',
  lineHeight: Config.footer.fontSize + 'px',
  fontSize: Config.footer.fontSize + 'px',
};
</script>

<template>
  <div class="footer-component" :style="footerStyle">
    <div class="footer-component-text" :style="textStyle" style="text-align: center">
      <span class="footer-task" v-for="(task, index) in footer.tasks" :key="index"
        :style="{ color: task.ok() ? '#080' : task.fail() ? 'red' : 'black' }">[{{ task.now }}/{{ task.max }}]</span>
    </div>
    <div class="footer-component-text" :style="textStyle" style="text-align: right; font-family: msyh subset, 微软雅黑;">
      <a href="https://github.com/axiomofchoice-hjt/Puzzles" target="_blank"
        style="color: grey; font-size: 15px; text-decoration: none; pointer-events: auto;">
        Github<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px"
          viewBox="0 0 100 100" width="15" height="15"
          style="display: inline; position: relative; font-size: 15px; bottom: -2px; margin-left: 3px;">
          <path fill="currentColor"
            d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z">
          </path>
          <polygon fill="currentColor"
            points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9">
          </polygon>
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
.footer-component {
  position: absolute;
  bottom: 0.2pt;
  width: 100%;
  border-top: 2px solid lightgray;
}

.footer-component-text {
  position: absolute;
  width: 100%;
  height: 100%;
  font-family: Arial;
  box-sizing: border-box;
}

.footer-task {
  font-family: consolas subset, consolas;
  bottom: 2px;
  position: relative;
}
</style>