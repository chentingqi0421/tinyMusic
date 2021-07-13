import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
// import config from './config'

import 'lib-flexible/flexible'

import vueMiniPlayer from 'vue-mini-player'
import 'vue-mini-player/lib/vue-mini-player.css'
Vue.use(vueMiniPlayer)

import 'vant/lib/index.css'
import {
	Icon,
	Divider,
	Circle,
	Slider,
	Toast,
	NavBar,
	Swipe,
	SwipeItem,
	Popup
} from 'vant'

Vue.use(Icon)
	.use(Divider)
	.use(Circle)
	.use(Slider)
	.use(Toast)
	.use(NavBar)
	.use(Swipe)
	.use(SwipeItem)
	.use(Popup)

import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
Vue.use(ViewUI)

// Vue.component('Tab', Tab)
// 	.component('Tabs', Tabs)

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
