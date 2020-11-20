import Vue from 'vue'
import App from './App.vue'
import router from './router.js'

// bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BootstrapVue } from 'bootstrap-vue'
Vue.use(BootstrapVue);

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon);

// toastr
import VueToastr from "vue-toastr";
Vue.use(VueToastr, {
  defaultPosition: 'toast-bottom-right', 
  defaultStyle: {
    "opacity": "1",
    "box-shadow": "none"
  }
});

// vuelidate
import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

// google chart
import VueGoogleCharts from 'vue-google-charts'
Vue.use(VueGoogleCharts);


// backend service
import MinerServices from './services/MinerServices.js';
Vue.prototype.$minerServices = new MinerServices();

// ---

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
