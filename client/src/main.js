import Vue from 'vue'
import App from './App'
import store from './store';
import http_client from './util/http_client';
import Socket from './util/socket/client';

import tabBar from 'components/tabbar.vue'
import head from 'components/head.vue'
import loading1 from 'components/loading1.vue'
Vue.component('tab-bar',tabBar)
Vue.component('head-bar',head)
Vue.component('load-panl1',loading1)

import VueSimpleMarkdown from 'vue-simple-markdown'
import 'vue-simple-markdown/dist/vue-simple-markdown.css'
Vue.use(VueSimpleMarkdown)

// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
// Vue.use(mavonEditor)

const socket = new Socket(store)

Vue.prototype.$socket = socket;
Vue.prototype.$http = http_client;


App.mpType = 'app'


const app = new Vue({
  store,
  ...App
})
app.$mount()
