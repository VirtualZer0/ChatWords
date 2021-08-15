<template>
  <div class="screen main-screen">
    <countdown v-if="countdownStarted" @expired="startGame" :from="5"/>
    <header class="main-screen-header">
      <logo/>
      <theme-switcher/>
    </header>
    <main class="main-screen-main">
      <div class="main-screen-splashes">
        <img src="/img/splashes/chat.png" class="main-screen-splashes-img"/>
        <div class="main-screen-splashes-text">
          {{$t('splashText1')}}
        </div>
      </div>
      <div class="main-screen-login">
        <div class="main-screen-login-title">{{$t('loginTitle')}}</div>
        <input type="text" v-model="twitchChannel" name="twitchChannel" class="main-screen-login-input"/>
        <button class="main-screen-login-button" :class="{pressed: buttonPressed}" @click="startCountdown">{{$t('startGame')}}</button>
      </div>
    </main>
    <footer class="main-screen-footer">
      <div class="main-screen-footer-info">
        <div class="main-screen-footer-info-title">
          {{$store.state.bestLevel}} {{$t('level')}}
        </div>
        <div class="main-screen-footer-info-subtitle">
          {{$t('record')}}
        </div>
      </div>

      <div class="main-screen-footer-info">
        <div class="main-screen-footer-info-title">
          {{$t('createdBy')}}
        </div>
        <a target="_blank" href="https://github.com/VirtualZer0/ChatWords" class="main-screen-footer-info-subtitle">
          {{$t('withOpenSource')}}
        </a>
      </div>

      <div class="main-screen-footer-info">
        <div class="main-screen-footer-info-title">
          {{$store.state.currentWordsCount}} {{$t('words')}}
        </div>
        <div class="main-screen-footer-info-subtitle">
          {{$t('nowInDatabase')}}
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import Logo from '@/components/Logo.vue'
import Countdown from '@/components/Countdown.vue';

import twitch from '../services/twitchConnect';
import genWorker from '../utils/GenWorker'

@Options({
  components: {
    ThemeSwitcher, Logo, Countdown
  },

  data: () => ({
    twitchChannel: '',
    countdownStarted: false,
    buttonPressed: false
  }),

  methods: {
    startCountdown() {
      this.buttonPressed = true;

      genWorker.postMessage({
        type: 'genLevel',
        payload: {
          level: 1,
          settings: {
            useFakeLetters: true,
            useHiddenLetters: true
          }
        }
      })

      if (this.twitchChannel != '') {
        this.twitchChannel = this.twitchChannel.replace('https://www.twitch.tv/', '');
        twitch.setChannel(this.twitchChannel);

        if (twitch.connected) {
          twitch.close();
        }

        twitch.events.onConnect = () => {
          this.countdownStarted = true;
          this.$store.dispatch('setChannel', this.twitchChannel);
        }

        twitch.connect();
      }
    },

    startGame() {
      this.$router.push('/game');
    }
  },

  mounted () {
    this.twitchChannel = this.$store.state.channel;
  }
})
export default class Main extends Vue {}
</script>

<style lang="scss">

.main-screen {

  display: grid;
  height: 100vh;
  grid-template-rows: 1fr 2.5fr 1fr;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
  }

  &-main {
    background: var(--c_purple);
    display: grid;
    padding: 60px 90px;
    grid-template-columns: .8fr 1fr;
    color: #fff;
  }

  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;

    &-info {
      text-align: center;

      &-title {
        font-size: 36px;
        font-weight: bolder;
        color: var(--c_orange);
        margin-bottom: 6px;
      }

      &-subtitle {
        color: var(--c_purple);
        font-size: 21px;
        font-weight: 300;
      }
    }
  }

  &-splashes {

    display: flex;
    align-items: center;
    padding-right: 5%;

    &-img {
      width: 18vmax;
      object-fit: contain;
    }

    &-text {
      font-size: 1.5vw;
      margin-left: -40px;
      margin-top: -100px;
      max-width: calc(340px + 3vw);
      font-weight: bold;
    }
  }

  &-login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &-title {
      font-size: 32px;
      font-weight: 500;
      margin-bottom: 40px;
    }

    &-input {
      padding: 0px 10px;
      outline: none;
      border: none;
      border-radius: 20px;
      height: 60px;
      width: 78%;
      margin-bottom: 60px;
      background-color: #E6E9EF;
      @include basic-neumorph-shadow(18px, 30px, 1, #D1D9E6, #FFFFFF);
      font-size: 28px;
    }

    &-button {
      transition: box-shadow .1s ease-in-out;
      width: 50%;
      height: 75px;
      @include trans-neumorph-shadow(6px, 12px, 0, #7A6CCC, #A492FF);
      border-radius: 25px;
      font-size: 28px;
      font-weight: bold;
    }

    &-button.pressed {
      @include trans-neumorph-shadow(6px, 12px, 1, #7A6CCC, #A492FF);
    }
  }

}

</style>