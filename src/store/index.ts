import { createStore } from 'vuex'

export default createStore({
  state: {
    currentWordsCount: 0
  },
  mutations: {
    SET_CURRENT_WORDS_COUNT(state, payload: number) {
      state.currentWordsCount = payload;
    }
  },
  actions: {
    setCurrentWordsCount({commit}, payload: number) {
      commit('SET_CURRENT_WORDS_COUNT', payload);
    }
  },
  modules: {
  }
})
