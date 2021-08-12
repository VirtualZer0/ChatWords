<template>
  <div class="words-table">
    <div class="words-table-word uncovered" v-for="n in 21" :key="n">
      <div class="words-table-letters">
        <span class="letter">Т</span>
        <span class="letter">В</span>
        <span class="letter">У</span>
        <span class="letter">З</span>
        <span class="letter">Я</span>
        <span class="letter">К</span>
      </div>
      <div class="words-table-nickname">
        DuckOnTruck
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({

})
export default class WordsTable extends Vue {}
</script>


<style lang="scss">

.words-table {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32%, 1fr));
  grid-template-rows: repeat(auto-fill, 50px);
  row-gap: 16px;
  column-gap: 20px;
  padding: 20px;
  @include basic-neumorph-shadow(10px, 14px, 0);
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
      width: 32px;
      height: 32px;
      font-size: 28px;
      border-radius: 10px;
      font-weight: bold;
      border: 1px solid var(--c_purple);
      background: var(--c_purple);
      margin-right: 8px;
      text-align: center;
      transition: all .2s ease-in-out;
    }
  }

  &-nickname {
    color: var(--c_orange);
    max-width: 200px;
    height: 20px;
    font-size: 18.5px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &-word.uncovered {
    @include basic-neumorph-shadow(8px, 12px, 1);

    .letter {
      background: rgba(0,0,0,0);
    }
  }
}

</style>