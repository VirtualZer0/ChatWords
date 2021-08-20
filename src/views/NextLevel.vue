<template>
  <div class="screen nextlevel-screen">
    <countdown v-if="countdownStarted" @expired="startGame" :from="3"/>
    <header class="nextlevel-screen-header">

      <logo/>

      <div class="nextlevel-screen-stars">
        <div class="nextlevel-screen-star star1 mdi mdi-star"/>
        <div class="nextlevel-screen-star star2 mdi mdi-star" v-if="stars >= 2"/>
        <div class="nextlevel-screen-star star3 mdi mdi-star" v-if="stars == 3"/>
      </div>

      <div class="nextlevel-screen-title">
        {{$t('levelComplete')}}

        <div class="nextlevel-screen-level">
          <span class="mdi mdi-play"/>

          {{$t('nextLevel')}}:
          {{nextLevel}}

          <span v-if="$store.state.bestLevel < $store.state.gameState.lvlNumber">{{$t('newBestLevel')}}</span>
        </div>

      </div>

    </header>

    <main class="nextlevel-screen-main">
      <players-table/>
    </main>

    <footer class="nextlevel-screen-footer">
      <button class="nextlevel-screen-retry" @click="startCountdown"><span class="mdi mdi-motion-play-outline"/>{{$t('next')}}</button>
      <button class="nextlevel-screen-exit" @click="exit"><span class="mdi mdi-exit-to-app"/>{{$t('exit')}}</button>
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
    countdownStarted: false,
    stars: 1,
    nextLevel: 0
  }),

  methods: {
    resetGame() {
      this.$store.dispatch('resetGameState');
    },

    startCountdown() {
      this.$store.dispatch('setLevelNumber', this.$store.state.gameState.lvlNumber + this.stars);
      this.$store.dispatch('setGenLevelState', false);

      genWorker.postMessage({
        type: 'genLevel',
        payload: {
          level: this.$store.state.gameState.lvlNumber,
          settings: {
            useFakeLetters: this.$store.state.useFakeLetters,
            useHiddenLetters: this.$store.state.useHiddenLetters
          }
        }
      });

      this.countdownStarted = true;
    },

    startGame() {
      this.$store.dispatch('resetLastPlayerPoints');
      this.$router.push('/game');
    },

    exit() {
      this.resetGame();
      this.$router.push('/');
    }
  },

  beforeMount() {
    if (!this.$store.state.gameStarted) {
      this.$router.push('/');
      return;
    }

    const ratio = this.$store.state.gameState.earnedPoints/this.$store.state.gameState.lvlData.maxPoints;

    if (ratio >= .75 && ratio < .87) {
      this.stars = 2;
      this.nextLevel = this.$store.state.gameState.lvlNumber + 2;
    }
    else if (ratio >= .87) {
      this.stars = 3;
      this.nextLevel = this.$store.state.gameState.lvlNumber + 3;
    }
    else {
      this.nextLevel = this.$store.state.gameState.lvlNumber + 1;
    }

    this.$store.dispatch('saveSettings');
  },
})
export default class NextLevel extends Vue {}
</script>

<style lang="scss">

.nextlevel-screen {

  &-header {
    padding: 24px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
  }

  &-main {
    margin-bottom: 20px;
    min-height: 40vh;
  }

  &-footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-title {
    font-size: 38px;
    color: var(--c_orange);
    margin-top: 15px;
    border-radius: 20px;
    font-weight: bolder;
  }

  &-level {
    text-align: center;
    font-size: 21px;
    margin-top: 12px;

    .mdi {
      margin-right: 6px;
    }
  }

  &-stars {
    font-size: 100px;
    color: var(--c_orange);
    display: flex;
    margin-top: 15px;
  }

  &-star {
    animation: star-appear .3s ease-in-out .3s forwards;
    opacity: 0;
  }

  .star1, .star3 {
    margin-top: 10px;
  }

  .star2 {
    margin-top: -10px;
    animation-delay: .6s;
  }

  .star3 {
    animation-delay: .9s;
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

@keyframes star-appear {
  0% {
    transform: scale(3);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity:1;
  }
}
</style>