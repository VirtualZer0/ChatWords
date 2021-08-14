<template>
  <div class="letter-visual">
    <div
      class="letter-visual-self" :class="{
        red: letter.fake && letter.uncovered,
        animated: uncoverAnim,
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
    letter: Object
  },

  data: () => ({
    uncoverAnim: false
  }),

  computed: {
    displayedLetter () {
      if (this.letter.hidden && !this.letter.uncovered) {
        return '?';
      }
      else {
        return this.letter.letter;
      }
    }
  },

  watch: {
    "letter.uncovered" () {

      this.uncoverAnim = true;
      setTimeout(() => this.uncoverAnim = false, 1100);
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
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--c_purple-advanced);
    color: var(--c_bg);
    width: 25px;
    height: 25px;
    font-size: 18px;
    border-radius: 100%;
    right: -7px;
    bottom: -7px;
  }

  &-self.animated {
    transition: color .3s ease-out;
    animation: letter-visual-uncover ease-in-out 1s;
  }

}

@keyframes letter-visual-uncover {

  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(2);
  }

  100% {
    transform: scale(1);
  }

}
</style>