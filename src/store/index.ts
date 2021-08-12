import { createStore, Store } from 'vuex'
import { InjectionKey } from 'vue'
import { RootState } from './classes/RootState';
import Letter from '@/utils/game/Letter';

export const key: InjectionKey<Store<RootState>> = Symbol()

export const store = createStore<RootState>({
  state: {
    currentWordsCount: 0,
    bestLevel: 0,
    channel: '',

    useFakeLetters: true,
    useHiddenLetters: true,
    useHiddenWords: true,

    gameState: {
      letters: [
        new Letter({letter: 'Т', points: 4}),
        new Letter({ letter: 'В', points: 2 }),
        new Letter({ letter: 'У', points: 1 }),
        new Letter({ letter: 'З', points: 1 }),
        new Letter({ letter: 'Я', points: 2 }),
        new Letter({ letter: 'К', points: 3 }),
      ],
      words: [],
      players: [],

      level: 1,
      points: 0,
      maxPoints: 0,
      donePoints: 0,

      time: 2*60
    }

  },

  mutations: {
    SET_CURRENT_WORDS_COUNT(state, payload: number) {
      state.currentWordsCount = payload;
    },

    SET_SAVED_SETTINGS(state, payload: any) {

      state.bestLevel = payload.bestLevel;
      state.useFakeLetters = payload.useFakeLetter;
      state.useHiddenLetters = payload.useFakeLetters;
      state.useHiddenWords = payload.useHiddenWords;
      state.channel = payload.channel;

    },

    SET_CHANNEL(state, payload: string) {
      state.channel = payload
    }
  },

  actions: {
    setCurrentWordsCount({commit}, payload: number) {
      commit('SET_CURRENT_WORDS_COUNT', payload);
    },

    loadSettings({commit, dispatch}, payload: any) {

      if (localStorage['settings']) {
        commit('SET_SAVED_SETTINGS', JSON.parse(localStorage['settings']));
      }
      else {
        dispatch('saveSettings');
      }

    },

    saveSettings({state}) {

      localStorage.setItem('settings', JSON.stringify({
        bestLevel: state.bestLevel,
        useFakeLetters: state.useFakeLetters,
        useHiddenLetters: state.useHiddenLetters,
        useHiddenWords: state.useHiddenWords,
        channel: state.channel
      }));

    },

    setChannel({dispatch, commit}, payload: string) {

      commit('SET_CHANNEL', payload);
      dispatch('saveSettings');

    }
  },

  modules: {
  }
})
