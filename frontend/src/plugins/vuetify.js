import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import {VCol} from 'vuetify/lib';

const opts= {VCol}
Vue.use(Vuetify, opts);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
});
