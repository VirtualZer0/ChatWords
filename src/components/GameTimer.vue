<template>
  <div class="game-timer">
    <div class="game-timer-icon mdi mdi-timer-sand-full"/>
    <div class="game-timer-bar">
      <div
        class="game-timer-line"
        :class="{danger: timeAlmostOver}"
        :style="{width: `${time * 99 / max +1}%`}"/>
    </div>
  </div>
</template>

<script lang="ts">
import soundPlayer from '@/utils/SoundPlayer';
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    max: {type: Number, default: 150}
  },

  emits: ['expired', 'almost-over'],

  data: () => ({
    timerId: null,
    timeAlmostOver: false,
    time: 60*2
  }),

  methods: {

    decrease() {
      if (this.time > 0) {
        this.time --;

        if (this.time == 20) {
          this.timeAlmostOver = true;
          this.$emit('almost-over');
        }

        if (
          (
            this.time <= 20
            && this.time % 5 == 0
          )
          || this.time <= 5

        ) {
          soundPlayer.playSfx('time_almost_over');
        }
      } else {
        this.$emit('expired');
        clearInterval(this.timerId);
      }
    }

  },

  watch: {
    '$store.state.gameState.lvlGenerated' (val) {
      if (val) {
        clearInterval(this.timerId);
        this.time = 150;
        this.timeAlmostOver = false;
        this.timerId = setInterval(this.decrease, 1000);
      }
    }
  },

  mounted () {
    this.timerId = setInterval(this.decrease, 1000);
  },

  beforeUnmount () {
    clearInterval(this.timerId);
  }
})

export default class GameTimer extends Vue {
  max!: number
}
</script>


<style lang="scss">

.game-timer {
  width: 100%;
  display: flex;
  align-items: center;

  &-icon {
    font-size: 32px;
    color: var(--c_purple);
    margin-right: 20px;
  }

  &-bar {
    display: flex;
    align-items: center;
    width: calc(100% - 52px);
    height: 32px;
    @include basic-neumorph-shadow(18px, 30px, 1);
    border-radius: 20px;
    padding: 0 6px;
  }

  &-line {
    width: 100%;
    height: 22px;
    background: var(--c_purple);
    border-radius: 20px;
    transition: width 1s linear;
  }

  &-line.danger {
    animation: game-timer-danger .75s ease-in-out infinite alternate;
  }

  @keyframes game-timer-danger {
    0% {
      background: var(--c_purple);
    }

    100% {
      background: var(--c_red);
    }
  }
}

</style>