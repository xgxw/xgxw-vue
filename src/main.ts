import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import { message } from 'ant-design-vue'

Vue.config.productionTip = false

Vue.prototype.$message = message;
message.config({
  maxCount: 2
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
