<script setup lang="ts">
import BlockComponent from './BlockComponent.vue';
import { Config } from '@/ts/Config';
import type { Page } from '@/ts/Page';
import { computed, watch, reactive, ref } from 'vue';
import { Vec } from '@/ts/Vec';

const props = defineProps<{
  page: Page;
}>();

const puzzle = props.page.puzzle;
const scale = computed(() =>
  Math.max(
    0,
    Math.min(
      0.8,
      (props.page.width - (Config.buttons.size + Config.buttons.right) * 2)
      / props.page.puzzle.width,
      (props.page.height - Config.header.getHeight() - Config.footer.getHeight())
      / props.page.puzzle.height
    )
  )
);

const divStyle = computed(() => ({
  height: puzzle.height + 'px',
  width: puzzle.width + 'px',
  top: props.page.puzzle_pos.x + 'px',
  left: props.page.puzzle_pos.y + 'px',
  transform: 'scale(' + scale.value + ', ' + scale.value + ')',
}));
</script>

<template>
  <div :style="divStyle" style="position: absolute;" class="puzzle-component">
    <BlockComponent :press_space="puzzle.press_space" :block="block" v-for="block in page.puzzle.blocks" :key="block.id"
      style="position: absolute" @puzzle-click="(id) => { $emit('puzzle-click', id); }" />
    <svg :width="puzzle.width" :height="puzzle.height" :viewBox="'0 0 ' + puzzle.width + ' ' + puzzle.height" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <line v-for="line in puzzle.lines" :key="line.id" :x1="line.pos[0].y" :y1="line.pos[0].x" :x2="line.pos[1].y"
        :y2="line.pos[1].x" :style="{ stroke: line.color.toString(line.opacity), strokeWidth: line.width }"
        stroke-linecap="round" />
    </svg>
  </div>
</template>
