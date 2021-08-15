<template>
<router-view v-slot="{ Component }">
  <transition name="change-screen" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import wordsDictionaryCollection from './utils/WordsDictionaryCollection';
import genWorker from './utils/GenWorker';

declare global {
  interface Window { words: any; }
}

@Options({

  methods: {

    handleGenWorkerResponse(ev: {data: {type: string, payload: any}}) : void {

      switch (ev.data.type) {

        case 'loadDictionaryDone':
          this.$store.dispatch('setCurrentWordsCount', ev.data.payload.wordsCount);
          break;

        case 'genLevelDone':
          this.$store.dispatch('setLevel', ev.data.payload.level);
          break;

      }

    }

  },

  mounted() {

    this.$store.dispatch('loadSettings');

    genWorker.onmessage = this.handleGenWorkerResponse;

    genWorker.postMessage({
      type: 'loadDictionary',
      payload: {
        name: 'ru',
        source: 'ru'
      }
    });

    if (!localStorage['theme']) {
      localStorage['theme'] = 'light';
    }

    if (localStorage['theme'] == 'dark') {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
    else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }

  }
})
export default class Main extends Vue {}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';

.change-screen-enter-active,
.change-screen-leave-active {
  transition: all 0.5s ease;
}


.change-screen-enter-from,
.change-screen-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

</style>
