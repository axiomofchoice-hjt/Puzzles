<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue';
import PuzzleComponent from '@/components/PuzzleComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import { Route } from '@/ts/Route';
import { WindowResize } from '@/ts/WindowResize';
import { Page } from '@/ts/Page';
import { Stages } from '@/stages';
import stageHome from '@/stages/Home';
import type { Stage } from '@/ts/Stage';
import ButtonsComponent from '@/components/ButtonsComponent.vue';
import { PuzzleCookies } from '@/ts/PuzzleCookies';
import { Key, KeyPress } from '@/ts/KeyPress';
import BonusComponent from '@/components/BonusComponent.vue';

stageHome.stageCount = Stages.count;

const page: Page = reactive(new Page());

let stage: { value?: Stage; } = {};

onMounted(() => {
  WindowResize.init(page);
  PuzzleCookies.init(Stages.count);
});

const updateCookies = () => {
  if (page.footer.all_ok && !Route.isHome()) {
    PuzzleCookies.set(page.header.level as number - 1);
  }
};

KeyPress.init((event: KeyboardEvent) => {
  // console.log(event.code);
  if (event.code === 'KeyR' && !Route.isHome()) {
    restartClick();
  }
  if (event.code === 'Escape' || event.code === 'Backspace') {
    Route.toHome();
  }
  if (event.code === 'Space') {
    page.puzzle.press_space = true;
  }
  stage.value?.keyPress(new Key(event));
  updateCookies();
}, (event: KeyboardEvent) => {
  if (event.code === 'Space') {
    page.puzzle.press_space = false;
  }
});
Route.init(() => {
  if (Route.isHome()) {
    page.header.level = null;
  } else {
    page.header.level = +Route.path;
  }
  page.drop();
  nextTick(() => { stage.value = Stages.getStage(page); });
});

onBeforeUnmount(() => {
  page.drop();
  WindowResize.drop();
  Route.drop();
  KeyPress.drop();
});

const puzzleClick = (id: number) => {
  stage.value?.click(id);
  updateCookies();
};

const restartClick = () => {
  if (!Route.isHome()) {
    Route.update();
  } else {
    if (confirm("清除所有记录？")) {
      PuzzleCookies.clear();
      Route.update();
    }
  }
};
</script>

<template>
  <div :ref="(el) => { if (el) { page.dom = el as HTMLDivElement; } }"
    style="width: 100%; height: 100%;">
    <HeaderComponent :header="page.header" />
    <PuzzleComponent :page="page" @puzzle-click="puzzleClick" />
    <FooterComponent :footer="page.footer" />
    <BonusComponent :page="page" />
    <ButtonsComponent :page="page" @back="Route.toHome" @restart="restartClick" />
  </div>
</template>
