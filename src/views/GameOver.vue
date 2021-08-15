<template>
  <div class="screen gameover-screen">
    <countdown v-if="countdownStarted" @expired="startGame" :from="3"/>
    <header class="gameover-screen-header">

      <logo/>

      <div class="gameover-screen-title">
        {{$t('gameOver')}}

        <div class="gameover-screen-level">
          <span
            class="mdi"
            :class="$store.state.bestLevel < $store.state.gameState.lvlNumber ? 'mdi-star mdi-spin' : 'mdi-puzzle'"/>

          {{$t('level')[0].toUpperCase() + $t('level').slice(1)}}
          {{$store.state.gameState.lvlNumber}}

          <span v-if="$store.state.bestLevel < $store.state.gameState.lvlNumber">{{$t('newBestLevel')}}</span>
        </div>

      </div>

    </header>

    <main class="gameover-screen-main">
      <players-table/>
    </main>

    <footer class="gameover-screen-footer">
      <button class="gameover-screen-retry" @click="startCountdown"><span class="mdi mdi-refresh"/>Заново</button>
      <button class="gameover-screen-exit" @click="exit"><span class="mdi mdi-exit-to-app"/>Выход</button>
    </footer>
  </div>
</template>

<script lang="ts">
import Player from '@/utils/game/Player';
import { Options, Vue } from 'vue-class-component';

import Logo from '../components/Logo.vue'
import PlayersTable from '../components/PlayersTable.vue'
import Countdown from '../components/Countdown.vue'

import genWorker from '../utils/GenWorker'

@Options({
  components: {
    Logo, PlayersTable, Countdown
  },

  data: () => ({
    countdownStarted: false
  }),

  methods: {
    resetGame() {
      this.$store.dispatch('resetGameState');
    },

    startCountdown() {
      this.resetGame();
      genWorker.postMessage({
        type: 'genLevel',
        payload: {
          level: 1,
          settings: {
            useFakeLetters: this.$store.state.useFakeLetters,
            useHiddenLetters: this.$store.state.useHiddenLetters
          }
        }
      });

      this.countdownStarted = true;
    },

    startGame() {

      this.$router.push('/game');
    },

    exit() {
      this.resetGame();
      this.$router.push('/');
    }
  },
})
export default class GameOver extends Vue {}
</script>

<style lang="scss">

.gameover-screen {

  &-header {
    padding: 24px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }

  &-main {
    margin-bottom: 20px;
    min-height: 40vh;
  }

  &-footer {
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-title {
    padding: 10px 20px;
    font-size: 38px;
    color: var(--c_red);
    margin-top: 30px;
    border-radius: 20px;
    font-weight: bolder;
    border: 1px solid var(--c_red);
    animation: game-over-floating 1s ease-in-out infinite alternate;
  }

  &-level {
    text-align: center;
    font-size: 21px;
    margin-top: 8px;
    color: var(--c_orange);

    .mdi {
      margin-right: 6px;
    }
  }

  &-retry, &-exit {
    transition: box-shadow .1s ease-in-out;
    width: 220px;
    height: 75px;
    @include trans-neumorph-shadow(4px, 8px, 0);
    border-radius: 25px;
    font-size: 28px;
    font-weight: bold;
    transition: all .1s ease-in-out;

    .mdi {
      margin-right: 12px;
    }
  }

  &-retry:active, &-exit:active {
    @include trans-neumorph-shadow(4px, 8px, 1);
  }

  &-retry {
    margin-right: 30px;
    color: var(--c_orange);
  }

  &-exit {
    color: var(--c_red);
  }
}

@keyframes game-over-floating {
  0% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(20px);
  }
}
</style>