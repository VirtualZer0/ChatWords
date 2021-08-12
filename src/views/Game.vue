<template>
  <div class="screen game-screen">
    <header class="game-screen-header">
      <logo/>

      <div class="game-screen-title">
        <div class="game-screen-title-line-1" v-html="$t('gameInfo')"/>
        <div class="game-screen-title-line-1" v-html="$t('gameNoModificators')"/>
      </div>

      <div class="game-screen-progress">
        <div class="game-screen-progress-level">
          <div class="title">{{$store.state.gameState.level}}</div>
          <div class="subtitle">{{$t('level')}}</div>
        </div>

        <div class="game-screen-progress-points" :class="{orange: $store.state.gameState.points >= $store.state.gameState.donePoints}">
          <div class="title">{{$store.state.gameState.points}}/{{$store.state.gameState.maxPoints}}</div>
          <div class="subtitle">{{$t('points')}}</div>
          <div class="subcircle"/>
          <svg class="subprogress" viewPort="0 0 180 180" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle
              class="subprogress-circle" r="75" cx="90" cy="90"
              stroke-dasharray="565.48"
              :stroke-dashoffset="progressStroke"
              :class="{done: $store.state.gameState.points >= $store.state.gameState.donePoints}"/>
          </svg>
        </div>
      </div>
    </header>
    <main class="game-screen-main">
      <letters-table class="game-screen-letters"/>
      <game-timer class="game-screen-timer"/>
      <words-table class="game-screen-words"/>
    </main>
    <footer class="game-screen-footer">
      <div class="game-screen-footer-new-word">
        <b class="orange">DuckOnTruck</b> {{$t('playerAddWord')}} <b class="orange">ТВУЗЯК</b>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Logo from '../components/Logo.vue'
import LettersTable from '../components/LettersTable.vue';
import GameTimer from '../components/GameTimer.vue';
import WordsTable from '../components/WordsTable.vue';

import Letter from '@/utils/game/Letter';

@Options({
  components: {
    Logo, LettersTable, GameTimer,
    WordsTable
  },

  data: () => ({
    letters: new Letter({
      letter: 'a'
    }),

    letters2: new Letter({
      letter: 'е'
    }),
  }),

  methods: {

  },

  computed: {
    // Linear interpolation for circle progress bar stroke
    progressStroke () {
      return (
        this.$store.state.gameState.points * -471
        / this.$store.state.gameState.maxPoints
      ) + 566
    }
  },

  // This page mounted only if the game is active,
  // so we can generate game data right here
  mounted() {
    2+2;
  }
})
export default class Game extends Vue {}
</script>

<style lang="scss">

.game-screen {

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