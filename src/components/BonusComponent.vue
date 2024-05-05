<script setup lang="ts">
import Bonus from '@/assets/icons/Bonus.vue';
import { Config } from '@/ts/Config';
import type { Page } from '@/ts/Page';
import { computed } from 'vue';

const props = defineProps<{
  page: Page;
}>();

const outer_style = computed(() => ({
  marginTop: Config.header.getHeight() + 'px',
  opacity: props.page.bonus.show ? "1" : "0"
}));
</script>
<template>
  <div class="bonus-component" :style="outer_style">
    <Bonus :width="40" :height="40" color="grey" />
    <span class="bonus-text">{{ page.bonus.content }}</span>
  </div>
</template>
<style scoped>
.bonus-component {
  position: relative;
  display: inline;
  text-align: right;
  line-height: 0;
  padding: 10px;
  border-bottom: 2px solid lightgrey;
  float: right;
  transition: 0.5s opacity;
  background-color: #ffffff80;
  z-index: 100;
}

.bonus-text {
  padding: 10px;
  line-height: 20px;
  font-size: 20px;
  display: inline;
  float: right;
}
</style>
