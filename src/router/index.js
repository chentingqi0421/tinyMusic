import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'Main',
		component: Main,
		children: [{
				path: '/', //路由默认匹配的首页
				name: 'Recommend',
				component: () => import('../views/Recommend.vue'),
			}, {
				path: '/hot',
				name: 'Hot',
				component: () => import('../views/Hot.vue'),
			}, {
				path: '/musichall',
				name: 'Musichall',
				component: () => import('../views/Musichall.vue'),
			},
			{
				path: '/mv',
				name: 'MV',
				component: () => import('../views/MV.vue'),
			},
		]
	},
	{
		path: '/search',
		name: 'Search',
		component: () => import('../views/Search.vue'),
	},
	{
		path: '/gedan/:id',
		name: 'Gedan',
		props: true,
		component: () => import('../views/Gedan.vue'),
	},
	{
		path: '/user',
		name: 'User',
		component: () => import('../views/User.vue'),
	}
]

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes
})

export default router
