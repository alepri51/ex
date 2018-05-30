import 'vuetify/dist/vuetify.min.css';
import '../public/css/fontawesome.min.css';
import '../public/css/custom.css';

import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
