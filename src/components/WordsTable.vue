<template>
  <div class="words-table">
    <div class="words-table-word" :class="{uncovered: word.uncovered, failed: word.failed}" v-for="word in words" :key="word.word" @click="openWiktionary(word)">
      <div class="words-table-letters">
        <span class="letter" v-for="(letter, key) in word.word" :key="key" :data-letter="letter">{{letter}}</span>
      </div>
      <div class="words-table-nickname">
        {{word.player}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Word from '@/utils/game/Word';
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    words: Array
  },

  methods: {
    openWiktionary(word: Word) {
      if (!word.uncovered) return;
      window.open(`https://ru.wiktionary.org/wiki/${word.word}`, '_blank')
    }
  }
})
export default class WordsTable extends Vue {
  words!: Word[]
}
</script>


<style lang="scss">

.words-table {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32%, 1fr));
  grid-template-rows: repeat(auto-fill, 50px);
  grid-auto-flow: column;
  row-gap: 16px;
  column-gap: 20px;
  padding: 20px;
  @include basic-neumorph-shadow(8px, 16px, 0);
  border-radius: 30px;

  &-word {
    display: flex;
    justify-content: space-between;
    padding: 14px;
    align-items: center;
    @include basic-neumorph-shadow(0px, 0px, 1);
    border-radius: 15px;
    transition: all .2s ease-in-out;
  }

  &-letters {
    display: flex;
    color: var(--c_purple);

    .letter {
      width: 34px;
      height: 31px;
      font-size: 28px;
      padding-bottom: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      font-weight: 500;
      border: 1px solid var(--c_purple);
      background: var(--c_purple);
      margin-right: 8px;
      transition: all .2s ease-in-out;
    }
  }

  &-nickname {
    color: var(--c_orange);
    opacity: 0;
    transform: scale(3);
    max-width: 200px;
    height: 20px;
    font-size: 18.5px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    transition: all .3s ease-in-out;

  }

  &-word.uncovered {
    @include basic-neumorph-shadow(4px, 8px, 1);
    cursor: pointer;

    .letter {
      background: rgba(0,0,0,0);
    }

    .letter::before {
      content: attr(data-letter);
      position: absolute;
      opacity: 0;
      animation: words-table-word .4s ease-out;
    }

    .words-table-nickname {
      overflow: hidden;
      opacity: 1;
      transform: scale(1);
      text-shadow: 0px 0px 10px rgba(0,0,0,0);
    }
  }

  &-word.failed {
    .letter {
      color: var(--c_red);
      border-color: var(--c_red);
    }
  }
}

@keyframes words-table-word {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(4);
    opacity: 0;
  }
}

</style>