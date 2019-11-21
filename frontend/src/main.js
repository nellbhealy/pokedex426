import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import axios from 'axios';

Vue.config.productionTip = false;
Vue.prototype.router = router;
Vue.prototype.pubRoot = new axios.create({
  baseURL: "http://localhost:3000/"
});


new Vue({
  router,
  vuetify,
  render: h => h(App),
  data: {
    header: 'Log in to gain full access',
    user: '',
    jwt: '',
  }
}).$mount('#app');
