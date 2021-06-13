import Vue from 'vue'
import app from './app.vue'
import './registerServiceWorker'
import router from './router';
import { store } from './store'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faHome,
  faTrashAlt,
  faTag,
  faPaperclip,
  faArrowRight,
  faMinus
} from '@fortawesome/free-solid-svg-icons'
import {
  faCheckSquare,
  faSquare,
  faComment,
  faUser,
  faClock
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './styles/main.scss'
import Vue2TouchEvents from 'vue2-touch-events'

library.add(
  faHome,
  faTrashAlt,
  faCheckSquare,
  faSquare,
  faComment,
  faUser,
  faTag,
  faPaperclip,
  faArrowRight,
  faMinus,
  faClock
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Vue2TouchEvents)

Vue.use(require('vue-moment'));

import VCalendar from 'v-calendar';
Vue.use(VCalendar)


Vue.use(ElementUI);

const debug = process.env.NODE_ENV !== 'production';
Vue.config.productionTip = debug;

Vue.mixin({
  methods: {
    $clone: require('rfdc')({ proto: true }),
  }
})

new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app')

