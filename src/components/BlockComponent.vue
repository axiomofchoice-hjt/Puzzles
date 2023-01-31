<script setup lang="ts">
import type Vector2 from '@/ts/Vector2';
defineProps<
  {
    size: number,
    x: number,
    y: number,
    content: string;
  }>();
</script>

<template>
  <div class="block-component">{{ content }}</div>
</template>

<style scoped>
.block-component {
  width: v-bind("size + 'px'");
  height: v-bind("size + 'px'");
  top: v-bind("x + 'px'");
  left: v-bind("y + 'px'");
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: v-bind("size * 0.4 + 'px'");
  line-height: v-bind("size + 'px'");
  background-color: rgb(179, 179, 179);
}
</style>