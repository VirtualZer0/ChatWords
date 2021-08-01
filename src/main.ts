import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import i18n from './i18n'

import 'normalize.css'
import '@mdi/font/css/materialdesignicons.min.css'

createApp(App)
  .use(i18n)
  .use(store)
  .use(router)
  .mount('#app');


/*fetch('/words/ru.txt')
.then(res => res.text())
.then(res => {
  words = res.split(',');
  console.log(words);
});*/