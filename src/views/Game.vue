<template>
  <div class="screen game-screen">
    <header class="game-screen-header">
      <logo/>

      <div class="game-screen-title">
        <div class="game-screen-title-line-1" v-html="$t('gameInfo')"/>
        <div class="game-screen-title-line-1" v-html="secondLineMessage"/>
      </div>

      <div class="game-screen-progress">
        <div class="game-screen-progress-level">
          <div class="title">{{/*$store.state.gameState.lvlNumber*/lvlNum}}</div>
          <div class="subtitle">{{$t('level')}}</div>
        </div>

        <div class="game-screen-progress-points" :class="{orange: points >= donePoints}">
          <div class="title">{{points}}/{{donePoints}}</div>
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
    <main class="game-screen-main">
      <letters-table class="game-screen-letters" :letters="letters"/>
      <game-timer class="game-screen-timer" @expired="endGame" @almost-over="uncoverLetters"/>
      <words-table class="game-screen-words" :words="words"/>
    </main>
    <footer class="game-screen-footer">
      <div class="game-screen-footer-new-word" :class="{animated: newWordAppear}" v-html="newWordMessage"/>
    </footer>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { reactive } from 'vue';

import twitch from '../services/twitchConnect';

import Logo from '../components/Logo.vue'
import LettersTable from '../components/LettersTable.vue';
import GameTimer from '../components/GameTimer.vue';
import WordsTable from '../components/WordsTable.vue';

import Letter from '@/utils/game/Letter';
import Level from '@/utils/game/Level';
import Word from '@/utils/game/Word';
import { TextMessage } from '@/services/streamEvents';
import soundPlayer from '@/utils/SoundPlayer';

import genWorker from '../utils/GenWorker';

@Options({
  components: {
    Logo, LettersTable, GameTimer,
    WordsTable
  },

  data: () => ({
    letters: [],
    words: [],
    players: {},

    points: 0,
    donePoints: 0,
    maxPoints: 0,

    shuffleTimerId: null,
    timeOut: false,
    wordsLeft: 0,

    newWordMessage: '',
    newWordAppear: false,

    // Temporary level count
    lvlNum: 1
  }),

  methods: {
    shuffleLetters() {
      for (var i = this.letters.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = this.letters[i];
        this.letters[i] = this.letters[j];
        this.letters[j] = temp;
      }
    },

    loadLevel() {
      this.letters = reactive(this.$store.state.gameState.lvlData.letters);
      this.words = reactive(this.$store.state.gameState.lvlData.words);
      this.donePoints = this.$store.state.gameState.lvlData.donePoints;
      this.maxPoints = this.$store.state.gameState.lvlData.maxPoints;
      this.wordsLeft = this.words.length;

      this.shuffleLetters();
      console.log(this.words);
    },

    endGame() {
      this.timeOut = true;
      this.uncoverAllWords();

      this.$store.dispatch('applyPlayerPoints', this.players);

      setTimeout(this.points >= this.donePoints ? this.nextLevel : this.gameOver, 3000);
    },

    nextLevel() {
      soundPlayer.playSfx('level_complete');

      // Temporary loop
      this.$store.dispatch('setGenLevelState', false);
      this.lvlNum ++;
      genWorker.postMessage({
        type: 'genLevel',
        payload: {
          level: this.lvlNum,
          settings: {
            useFakeLetters: true,
            useHiddenLetters: true
          }
        }
      });

      this.points = 0;
      this.timeOut = false;
    },

    gameOver() {
      soundPlayer.playSfx('game_over');
      this.$router.push('/');
    },

    uncoverLetters () {
      this.letters.forEach((letter: Letter) => {
        if (!letter.uncovered && (letter.fake || letter.hidden))
          letter.uncovered = true;
      });
    },

    uncoverAllWords() {
      this.words.forEach((word: Word) => {
        if (!word.uncovered) {
          word.failed = true;
          word.uncovered = true;
        }
      });
    },

    showMessage (nickname: string, word: string) {
      this.newWordMessage =`<b class="orange">${nickname}</b> ${this.$t('playerAddWord')} <b class="orange">${word.toUpperCase()}</b>`;
      this.newWordAppear = true;
      setTimeout(() => this.newWordAppear = false, 2000);
    },

    newMessage(msg: TextMessage) {

      if (this.timeOut) return;

      this.words.forEach((word: Word) => {

        if (!word.uncovered && word.word == msg.text.toLowerCase()) {
          word.uncovered = true;
          word.player = msg.userName;
          this.points += word.points;
          this.wordsLeft --;
          console.log(this.wordsLeft);
          this.showMessage(msg.userName, word.word);

          if (!this.players[msg.userName]) {
            this.players[msg.userName] = 0;
          }

          this.players[msg.userName] += word.points;

          soundPlayer.playSfx('correct_letter');

          // Check if hidden letters will be found
          word.word.split('').forEach(wLetter => {
            const letter = this.letters.find((fLetter: Letter) => fLetter.letter == wLetter) as Letter;
            if (letter.hidden && !letter.uncovered)
              letter.uncovered = true;
          });
        }

      });

      if (this.wordsLeft == 0) {
        setTimeout(this.nextLevel, 1000);
      }

      // Check fake letters uncovering
      let uncoveredFakeLetters = this.letters.filter((letter: Letter) => letter.fake && !letter.uncovered);

      if (uncoveredFakeLetters.length == 0) return;

      if (this.wordsLeft/this.words.length < .75 && (uncoveredFakeLetters.length == 2 || this.$store.state.gameState.lvlNumber <= 27)) {
        uncoveredFakeLetters[0].uncovered = true;
      }

      if (this.wordsLeft/this.words.length < .55 && uncoveredFakeLetters.length == 1) {
        uncoveredFakeLetters[0].uncovered = true;
      }

    }
  },

  computed: {
    // Linear interpolation for circle progress bar stroke
    progressStroke () {
      return (
        this.points * -471
        / this.maxPoints
      ) + 566
    },

    secondLineMessage() {
      if (this.$store.state.gameState.lvlNumber <= 7) {
        return this.$t('gameNoModificators');
      }

      if (this.$store.state.gameState.lvlNumber > 7 && this.$store.state.gameState.lvlNumber <= 14) {
        return this.$t('gameModificator1Red');
      }

      if (this.$store.state.gameState.lvlNumber > 14 && this.$store.state.gameState.lvlNumber <= 27) {
        return this.$t('gameModificator1Red1Orange');
      }

      if (this.$store.state.gameState.lvlNumber > 27 && this.$store.state.gameState.lvlNumber <= 34) {
        return this.$t('gameModificator2Red1Orange');
      }

      return this.$t('gameModificator2Red2Orange');
    }
  },

  watch: {
    '$store.state.gameState.lvlGenerated' (val) {
      if (val) {
        this.loadLevel();
      }
    }
  },

  // Get data from store
  beforeMount() {
    this.loadLevel();
    twitch.events.onMessage = this.newMessage;
  },

  mounted() {
    this.$store.dispatch('resetLastPlayerPoints');
    this.shuffleTimerId = setInterval(this.shuffleLetters, 10000);
  },

  beforeUnmount() {
    clearInterval(this.shuffleTimerid);
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

    &-new-word {
      transform: scale(0);
    }

    &-new-word.animated {
      animation: new-word-message-anim 1.9s ease-in-out;
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

@keyframes new-word-message-anim {
  0% {
    transform: scale(0)
  }

  45% {
    transform: scale(1)
  }

  55% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}
</style>