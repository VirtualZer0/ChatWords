<template>
  <div class="screen gameover-screen">
    <header class="gameover-screen-header">
      <logo/>

      <div class="gameover-screen-title">
        <div class="gameover-screen-title-line-1" v-html="$t('gameInfo')"/>
        <div class="gameover-screen-title-line-1" v-html="secondLineMessage"/>
      </div>

      <div class="gameover-screen-progress">
        <div class="gameover-screen-progress-level">
          <div class="title">{{$store.state.gameState.lvlNumber}}</div>
          <div class="subtitle">{{$t('level')}}</div>
        </div>

        <div class="gameover-screen-progress-points" :class="{orange: points >= donePoints}">
          <div class="title">{{points}}/{{maxPoints}}</div>
          <div class="subtitle">{{$t('points')}}</div>
          <div class="subcircle"/>
          <svg class="subprogress" viewPort="0 0 180 180" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle
              class="subprogress-circle" r="75" cx="90" cy="90"
              stroke-dasharray="565.48"
              :stroke-dashoffset="progressStroke"
              :class="{done: points >= donePoints}"/>
          </svg>
        </div>
      </div>
    </header>
    <main class="gameover-screen-main">
      <letters-table class="gameover-screen-letters" :letters="letters"/>
      <game-timer class="gameover-screen-timer" @expired="endGame" @almost-over="uncoverLetters"/>
      <words-table class="gameover-screen-words" :words="words"/>
    </main>
    <footer class="gameover-screen-footer">
      <div class="gameover-screen-footer-new-word">
        <b class="orange">DuckOnTruck</b> {{$t('playerAddWord')}} <b class="orange">ТВУЗЯК</b>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Logo from '../components/Logo.vue'

@Options({
  components: {
    Logo
  },

  data: () => ({
  }),

  methods: {

  },

  mounted() {

  },
})
export default class GameOver extends Vue {}
</script>

<style lang="scss">

.gameover-screen {

  &-header {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    padding: 24px 12px;
  }

  &-main {
    margin-top: -45px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 32px;
  }

  &-footer {
    padding-top: 25px;
    color: var(--c_purple);
    font-size: 28px;
    text-align: center;
    animation: new-word-message-appear .3s ease-in-out;

    &-new-word.disappear {
      animation: new-word-message-appear .3s ease-in-out reverse;
    }
  }

  &-progress {
    display: flex;
    justify-content: flex-end;
    color: var(--c_purple);

    &-level, &-points {

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .title {
        font-size: 28px;
        font-weight: bold;
        z-index: 10;
      }

      .subtitle {
        z-index: 10;
      }

    }

    &-level {
      margin-right: 42px;
    }

    &-points {
      position: relative;
      width: 180px;
      height: 180px;
      box-sizing: border-box;
      box-shadow: inset 6px 6px 14px var(--c_shadow-1), inset -5px -7px 12px var(--c_shadow-2);
      border-radius: 100%;

      .subcircle {
        position: absolute;
        background: var(--c_bg);
        width: 160px;
        height: 160px;
        border-radius: 100%;
        z-index: 2;
      }

      .subprogress {
        position: absolute;
        transform: rotateZ(-90deg);
        width: 180px;
        height: 180px;

        &-circle {
          stroke: var(--c_purple);
          stroke-width: 30px;
          transition: stroke-dashoffset .2s ease-in-out;
          // max - 95, min - 566
        }

        &-circle.done {
          stroke: var(--c_orange);
        }
      }
    }
  }

  &-title {
    font-size: 28px;
    font-weight: bold;
    color: var(--c_purple);
    align-self: center;
    text-align: center;
    padding: 0 20px;

    &-line-1 {
      margin-bottom: 12px;
    }
  }

  &-letters, &-timer {

    margin-bottom: 25px;

  }

  &-words {
    min-height: 400px;
    width: calc(100% - 48px);
  }

}

@keyframes new-word-message-appear {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}
</style>