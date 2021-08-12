// Vuex TS support
import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';
import { RootState } from './store/classes/RootState'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<RootState>;
  }
}