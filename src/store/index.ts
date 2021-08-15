import { createStore, Store } from 'vuex'
import { InjectionKey } from 'vue'
import { RootState } from './classes/RootState';
import Letter from '@/utils/game/Letter';
import Level from '@/utils/game/Level';
import Player from '@/utils/game/Player';

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
      players: [],

      lvlData: new Level({}),
      lvlNumber: 1,
      lvlGenerated: false,

      earnedPoints: 0,

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
    },

    SET_GEN_LEVEL_STATE(state, payload: boolean) {
      state.gameState.lvlGenerated = payload;
    },

    SET_LEVEL(state, payload: Level) {
      state.gameState.lvlData = payload;
      if (state.bestLevel < state.gameState.lvlNumber) {
        state.bestLevel = state.gameState.lvlNumber;
      }
    },

    SET_LEVEL_NUMBER(state, payload: number) {
      state.gameState.lvlNumber = payload;
    },

    APPLY_PLAYER_POINTS(state, payload: {[key: string]: number}) {

      for (const [key, value] of Object.entries(payload)) {
        let player = state.gameState.players.find(storedPlayer => storedPlayer.name == key);
        if (player) {
          player.addPoints(value);
        }
        else {
          player = new Player(key);
          player.addPoints(value);
          state.gameState.players.push(player);
        }
      }

    },

    APPLY_EARNED_POINTS (state, payload: number) {
      state.gameState.earnedPoints = payload;
    },

    RESET_LAST_PLAYER_POINTS(state) {
      state.gameState.players.forEach(player => {
        player.lastPoints = 0;
      });
    },

    RESET_GAME_STATE(state) {
      if (state.bestLevel < state.gameState.lvlNumber) {
        state.bestLevel = state.gameState.lvlNumber;
      }
      state.gameState.lvlNumber = 1;
      state.gameState.players = [];
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

    },

    setGenLevelState({commit}, payload: boolean) {
      commit('SET_GEN_LEVEL_STATE', payload);
    },

    setLevel({dispatch, commit}, payload: Level) {
      commit('SET_LEVEL', payload);
      dispatch('setGenLevelState', true);
    },

    setLevelNumber({ commit }, payload: number) {
      commit('SET_LEVEL_NUMBER', payload);
    },

    applyPlayerPoints({commit}, payload: {[key: string]: number}) {
      commit('APPLY_PLAYER_POINTS', payload);
    },

    applyEarnedPoints({ commit }, payload: number) {
      commit('APPLY_EARNED_POINTS', payload);
    },

    resetLastPlayerPoints({ commit }) {
      commit('RESET_LAST_PLAYER_POINTS');
    },

    resetGameState({commit, dispatch}) {
      commit('RESET_GAME_STATE');
      dispatch('saveSettings');
    }
  },

  modules: {}
})
