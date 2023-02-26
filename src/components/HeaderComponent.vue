<script setup lang="ts">
import { Config } from '@/ts/Config';
import type { Header } from '@/ts/Header';

defineProps<{ header: Header; }>();
const headerStyle = {
  height: Config.header.getHeight() - 2 + 'px',
  // paddingTop: Config.header.top + 'px',
  // paddingBottom: Config.header.bottom + 'px',
  // paddingLeft: Config.header.leftRight + 'px',
  // paddingRight: Config.header.leftRight + 'px',
};
const textStyle = {
  paddingTop: Config.header.top + 'px',
  paddingBottom: Config.header.bottom + 'px',
  paddingLeft: Config.header.leftRight + 'px',
  paddingRight: Config.header.leftRight + 'px',
  lineHeight: Config.header.fontSize + 'px',
  fontSize: Config.header.fontSize + 'px',
};
</script>

<template>
  <div class="header-component" :style="headerStyle">
    <div class="header-component-text" :style="textStyle" style="text-align: left">Blockchallenge</div>
    <div class="header-component-text" :style="textStyle" style="text-align: center">
      {{ header.message }}
    </div>
    <div class="header-component-text" :style="textStyle" style="text-align: right">
      {{ typeof header.level === 'number' ? '第 ' + header.level + ' 关' : '' }}
    </div>
  </div>
</template>

<style scoped>
.header-component {
  position: absolute;
  width: 100%;
  border-bottom: 2px solid lightgray;
  background-color: white;
}

.header-component-text {
  position: absolute;
  width: 100%;
  height: 100%;
  font-family: Arial;
  box-sizing: border-box;
}
</style>