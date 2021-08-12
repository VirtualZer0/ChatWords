import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import {store, key} from './store'
import i18n from './i18n'

import 'normalize.css'
import '@mdi/font/css/materialdesignicons.min.css'

import soundPlayer from './utils/SoundPlayer';

createApp(App)
  .use(i18n)
  .use(store, key)
  .use(router)
  .mount('#app');

soundPlayer.loadSfx();