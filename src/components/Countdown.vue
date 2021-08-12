<template>
  <div class="countdown">
    <div class="countdown-item">
      <div class="countdown-value" :class="{stop: count == 0}">{{count}}</div>
    </div>
    <div class="countdown-letters">
      <div class="countdown-letter countdown-letter-1">Н</div>
      <div class="countdown-letter countdown-letter-2">А</div>
      <div class="countdown-letter countdown-letter-3">Ч</div>
      <div class="countdown-letter countdown-letter-4">И</div>
      <div class="countdown-letter countdown-letter-5">Н</div>
      <div class="countdown-letter countdown-letter-6">А</div>
      <div class="countdown-letter countdown-letter-7">Е</div>
      <div class="countdown-letter countdown-letter-8">М</div>
    </div>
  </div>
</template>

<script lang="ts">
import soundPlayer from '../utils/SoundPlayer';

import { Options, Vue } from 'vue-class-component';

@Options({

  emits: ['expired'],

  props: {
    from: {type: Number, default: 3}
  },

  data: () =>({
    count: 3,
    timerId: null
  }),

  methods: {
    decrease() {
      if (this.count > 1) {
        this.count --;
        soundPlayer.playSfx('countdown');
      }
      else {
        this.count = 0;
        this.$emit('expired');
        soundPlayer.playSfx('countdown_over');
        clearInterval(this.timerId);
      }

    }
  },

  mounted() {
    this.count = this.from;
    soundPlayer.playSfx('countdown');
    this.timerId = setInterval(this.decrease, 1000);
  },

  beforeUnmount() {
    clearInterval(this.timerId);
  }
})
export default class Countdown extends Vue {
  from!: number
}
</script>


<style lang="scss">

.countdown {

  position: fixed;
  background: rgb(55,55,55,.5);
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: countdown-appear .2s ease-in;

  &-value {
    transition: all .3s ease-in-out;
    font-size: 12vmin;
    font-weight: bolder;
    color: #fff;
    background: var(--c_purple);
    width: 20vmin;
    height: 20vmin;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    border: 1vmin solid #fff;
    animation: countdown-anim .95s ease-out infinite;
  }

  &-value.stop {
    animation: none;
    background: var(--c_orange);
  }

  &-letters {
    display: flex;
    justify-content: center;
    position: fixed;
    height: 40vmin;
    width: 50vmin;
  }

  &-letter {
    margin-right: 10px;
    font-size: 4vmin;
    font-weight: bold;
    color: #fff;
    background: var(--c_purple);
    height: 5vmin;
    width: 5vmin;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    animation: countdown-letter-anim .4s ease-in-out infinite alternate;
  }

  @for $i from 1 through 8 {

    &-letter-#{$i} {
      animation-duration: #{math.random()/2+.3}s;
    }

  }

}

@keyframes countdown-appear {
  0% {
    transform: scaleX(0);
  }

  100% {
    transform: scaleX(1);
  }
}

@keyframes countdown-anim {

  0% {
    transform: rotateY(0deg);
  }

  100% {
    transform: rotateY(360deg);
  }

}

@keyframes countdown-letter-anim {

  0% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(10px);
  }

}

</style>