<template>
  <div class="letter-visual">
    <div
      class="letter-visual-self" :class="{
        red: letter.fake && letter.uncovered,
        orange: letter.hidden
      }">
      {{displayedLetter}}
    </div>
    <div class="letter-visual-points">{{letter.points}}</div>
  </div>
</template>

<script lang="ts">
import Letter from '@/utils/game/Letter';
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    letter: Letter
  },

  computed: {
    displayedLetter () {
      if (this.letter.hidden && !this.letter.uncovered) {
        return '?';
      }
      else {
        return this.letter.letter;
      }
    }
  }
})
export default class LetterVisual extends Vue {
  letter!: Letter
}
</script>


<style lang="scss">

.letter-visual {
  position: relative;
  width: 65px;
  height: 65px;
  background: var(--c_bg);
  color: var(--c_purple);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
  font-weight: bolder;
  font-size: 45px;

  &-points {
    position: absolute;
    background: var(--c_purple-advanced);
    color: var(--c_bg);
    width: 25px;
    height: 25px;
    font-size: 21px;
    text-align: center;
    border-radius: 100%;
    right: -7px;
    bottom: -7px;
  }

}

</style>