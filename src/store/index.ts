import Vue from 'vue';
import Vuex from 'vuex';
import command from './command'
import article from './article'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    article,
    command
  },
});