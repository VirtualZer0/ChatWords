<template>
  <div class="letters-table">
    <letter-visual v-for="(letter, key) in $store.state.gameState.letters" :letter="letter" :key="key"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import LetterVisual from '../components/LetterVisual.vue'

@Options({
  components: {
    LetterVisual
  }
})
export default class LettersTable extends Vue {}
</script>


<style lang="scss">

.letters-table {
  display: flex;
  background: var(--c_purple);
  padding: 15px 25px;
  border-radius: 30px;

  .letter-visual {
    margin-right: 20px;
  }

  .letter-visual:last-child {
    margin-right: 0;
  }
}

</style>