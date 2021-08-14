<template>
  <div class="letters-table">
    <transition-group name="letters-table-anim" tag="div" class="letters-table-container">
    <letter-visual v-for="letter in letters" :letter="letter" :key="letter.id"/>
    </transition-group>
  </div>
</template>

<script lang="ts">
import Letter from '@/utils/game/Letter';
import { Options, Vue } from 'vue-class-component';
import LetterVisual from '../components/LetterVisual.vue'

@Options({
  components: {
    LetterVisual
  },

  props: {
    letters: Array
  }
})
export default class LettersTable extends Vue {
  letters!: Letter[]
}
</script>


<style lang="scss">

.letters-table {
  background: var(--c_purple);
  padding: 15px 25px;
  border-radius: 30px;

  .letter-visual {
    margin-right: 20px;
  }

  .letter-visual:last-child {
    margin-right: 0;
  }

  &-container {
    display: flex;
  }

  &-anim-move {
    transition: transform .5s;
  }
}

</style>