<script setup lang="ts">
import { BlockValue, type Block } from '@/ts/Block';
import { Config } from '@/ts/Config';
import type { Color } from '@/ts/Color';
import { reactive, computed, watch } from 'vue';
import { Vec } from '@/ts/Vec';
import { Animate } from '@/ts/Animate';
import _ from 'lodash';

const props = defineProps<
  {
    press_space: boolean;
    block: Block;
  }>();
const state: {
  size: number,
  pos: Vec,
  value: BlockValue,
  color: Color,
  background: Color,
  rotate: number,
  opacity: number,
  mouseOver: boolean,
  // mousePressing: boolean;
  // backgroundOpacity: number,
  textOpacity: number,
  relativeSize: number,
} = reactive({
  size: props.block.size,
  pos: props.block.pos.clone(),
  value: props.block.value.clone(),
  color: props.block.color.clone(),
  background: props.block.background.clone(),
  rotate: props.block.rotate,
  opacity: props.block.opacity,
  mouseOver: false,
  // mousePressing: false,
  // backgroundOpacity: 1,
  textOpacity: 1,
  relativeSize: 1,
});

const mouseEnterBackground = computed(() =>
  state.background.isLight ? state.background.toDark(Config.mouseEnterOpacity) : state.background.toLight(Config.mouseEnterLightChange)
);

const realBackground = computed(() =>
  (state.mouseOver || props.press_space) && props.block.clickable
    ? mouseEnterBackground.value
    : state.background
);

watch(props.block, (block) => {
  Animate.to(state, { size: block.size });
  Animate.to(state.background, { r: block.background.r, g: block.background.g, b: block.background.b });
  Animate.to(state.color, { r: block.color.r, g: block.color.g, b: block.color.b });
  Animate.to(state.pos, { x: block.pos.x, y: block.pos.y });
  Animate.to(state, { rotate: block.rotate });
  Animate.to(state, { opacity: block.opacity });

  if (block.imm_value !== null) {
    state.value = block.imm_value;
    block.imm_value = null;
  }
  if (!BlockValue.eq(block.value, state.value)) {
    if (block.value.isNum() && state.value.isNum()) {
      Animate.to(state.value, { value: block.value.num });
    } else if (state.value.empty()) {
      state.value = block.value.clone();
      state.textOpacity = 0;
      Animate.to(state, { textOpacity: 1 }, { ease: 'power1.in' });
    } else if (block.value.empty()) {
      Animate.to(state, { textOpacity: 0 }, {
        ease: 'power1.in', onComplete: () => {
          state.value = block.value.clone();
          state.textOpacity = 1;
        }
      });
    } else {
      Animate.toQuick(state, { textOpacity: 0.5 }, {
        ease: 'power1.in',
        onComplete: () => {
          state.value = block.value.clone();
          Animate.toQuick(state, { textOpacity: 1 }, { ease: 'power1.in' });
        }
      });
    }
  }
});

const compute_size = computed(() => state.size * state.relativeSize);
const textTooLong = computed(() => state.value.realText.length > 3);
const div0Pos = computed(() => new Vec(
  state.pos.x * Config.blockSize + Config.blockGap,
  state.pos.y * Config.blockSize + Config.blockGap
));
const div0Style = computed(() => ({
  width: state.size + 'px',
  height: state.size + 'px',
  top: div0Pos.value.x + 'px',
  left: div0Pos.value.y + 'px',
  opacity: state.opacity.toString(),
  transform: "rotate(" + state.rotate + "deg)",
  backgroundColor: 'transparent'
}));
const divStyle = computed(() => ({
  width: compute_size.value + 'px',
  height: compute_size.value + 'px',
  top: Config.blockSize * (1 - state.relativeSize) / 2 + 'px',
  left: Config.blockSize * (1 - state.relativeSize) / 2 + 'px',
  borderRadius: props.block.round ? '100%' : '0',
  backgroundColor: realBackground.value.toString(1),
}));
const pStyle = computed(() => ({
  lineHeight: compute_size.value + 'px',
  fontSize: compute_size.value * (textTooLong.value ? 0.3 : 0.425) + 'px',
  color: state.color.toString(state.textOpacity),
  // borderRadius: props.block.round ? '100%' : '0'
  // cursor: props.block.clickable ? 'pointer' : 'auto'
}));
const svg_out_style = computed(() => ({
}));

const mouseleave = () => {
  state.mouseOver = false;
  Animate.toQuick(state, { relativeSize: 1 });
};
const mouseover = (event: MouseEvent) => {
  state.mouseOver = true;
  if ((event.buttons & 1) && props.block.clickable) {
    Animate.toQuick(state, { relativeSize: Config.mouseDownSize / Config.blockSize });
  }
};
const mousedown = (event: MouseEvent) => {
  if ((event.buttons & 1) && props.block.clickable) {
    Animate.toQuick(state, { relativeSize: Config.mouseDownSize / Config.blockSize });
  }
};
const emit = defineEmits(['puzzle-click']);
const click = (event: MouseEvent) => {
  Animate.toQuick(state, { relativeSize: 1 });
  // console.log(event);
  if (event.button == 0 && props.block.clickable) {
    emit('puzzle-click', props.block.id);
  }
};
</script>

<template>
  <div :class="{ button: block.clickable }" style="z-index: -100; pointer-events: auto;" :style="div0Style"
    @mouseup="click" @mousedown="mousedown" @mouseover="mouseover" @mouseleave="mouseleave"
    v-show="state.opacity > 0.01">
    <div :style="divStyle" style="overflow: hidden; position: absolute;">
      <p class="p" :style="pStyle" v-if="state.value.isNum() || state.value.isStr()">{{ state.value.realText }}</p>
      <div class="svg_out" v-else-if="state.value.isArrow()" :style="svg_out_style">
        <svg t="1675604206248" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="1375" :width="compute_size * Config.arrowRelativeSize" :height="compute_size * Config.arrowRelativeSize"
          :style="{ padding: compute_size * (1 - Config.arrowRelativeSize) / 2 + 'px', transform: 'rotate(' + state.value.value + 'deg)' }">
          <path
            d="M554.666667 268.8v601.6h-85.333334V268.8L337.066667 401.066667 277.333333 341.333333 512 106.666667 746.666667 341.333333l-59.733334 59.733334L554.666667 268.8z"
            :fill="state.color.toString(state.textOpacity)" p-id="1376">
          </path>
        </svg>
      </div>
      <div class="svg_out" v-else-if="state.value.isStar()" :style="svg_out_style">
        <svg t="1715955767375" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="1498" :width="compute_size * Config.arrowRelativeSize" :height="compute_size * Config.arrowRelativeSize"
          :style="{ padding: compute_size * (1 - Config.arrowRelativeSize) / 2 + 'px' }">
          <path
            d="M781.186088 616.031873q17.338645 80.573705 30.59761 145.848606 6.119522 27.537849 11.219124 55.075697t9.689243 49.976096 7.649402 38.247012 4.079681 19.888446q3.059761 20.398406-9.179283 27.027888t-27.537849 6.629482q-5.099602 0-14.788845-3.569721t-14.788845-5.609562l-266.199203-155.027888q-72.414343 42.836653-131.569721 76.494024-25.498008 14.278884-50.486056 28.557769t-45.386454 26.517928-35.187251 20.398406-19.888446 10.199203q-10.199203 5.099602-20.908367 3.569721t-19.378486-7.649402-12.749004-14.788845-2.039841-17.848606q1.01992-4.079681 5.099602-19.888446t9.179283-37.737052 11.729084-48.446215 13.768924-54.055777q15.298805-63.23506 34.677291-142.788845-60.175299-52.015936-108.111554-92.812749-20.398406-17.338645-40.286853-34.167331t-35.697211-30.59761-26.007968-22.438247-11.219124-9.689243q-12.239044-11.219124-20.908367-24.988048t-6.629482-28.047809 11.219124-22.438247 20.398406-10.199203l315.155378-28.557769 117.290837-273.338645q6.119522-16.318725 17.338645-28.047809t30.59761-11.729084q10.199203 0 17.848606 4.589641t12.749004 10.709163 8.669323 12.239044 5.609562 10.199203l114.231076 273.338645 315.155378 29.577689q20.398406 5.099602 28.557769 12.239044t8.159363 22.438247q0 14.278884-8.669323 24.988048t-21.928287 26.007968z"
            :fill="state.color.toString(state.textOpacity)" p-id="1499"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.p {
  position: absolute;
  text-align: center;
  /* font-family: Arial; */
  font-family: msyh subset, 微软雅黑;
  margin: 0;
  width: 100%;
  height: 100%;
}

.svg_out {
  position: absolute;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
