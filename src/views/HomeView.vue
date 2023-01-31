<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import BlockComponent from '@/components/BlockComponent.vue';
import Vector2 from '@/ts/Vector2';
import Config from '@/ts/Config';

class Block {
  public id: number;
  public pos: Vector2;
  constructor(id: number, pos: Vector2) {
    this.id = id;
    this.pos = pos;
  }
}

const blocks = ref<Block[]>([]);
const n = ref<number>(4);
const m = ref<number>(5);
const containerWidth = ref<number>(0);
const containerHeight = ref<number>(0);

for (let i = 0; i < n.value; i++) {
  for (let j = 0; j < m.value; j++) {
    blocks.value.push(new Block(i * m.value + j, new Vector2(i, j)));
  }
}

const container = ref<HTMLDivElement | null>(null);

const blockOuterSize = computed(() =>
  Math.min(containerHeight.value / (n.value + Config.blockGap),
    containerWidth.value / (m.value + Config.blockGap))
);

const blockGap = computed(() => (blockOuterSize.value * Config.blockGap));

const resize = () => {
  const dom = container.value as HTMLDivElement;
  containerWidth.value = dom.offsetWidth;
  containerHeight.value = dom.offsetHeight;
  console.log(containerWidth.value, containerHeight.value);
};

onMounted(() => {
  resize();
  window.addEventListener('resize', resize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
});
</script>

<template>
  <div ref="container" class="outer">
    <div class="inner">
      <BlockComponent :size="blockOuterSize - blockGap" :x="block.pos.x * blockOuterSize + blockGap"
        :y="block.pos.y * blockOuterSize + blockGap" :content="block.id.toString()" v-for="block in blocks"
        :key="block.id" style="position: absolute" />
    </div>
  </div>
</template>

<style scoped>
.outer {
  width: 100%;
  height: 100%;
}

.inner {
  height: v-bind("blockOuterSize * n + blockGap");
  width: v-bind("blockOuterSize * m + blockGap");
}
</style>