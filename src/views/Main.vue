<template>
	<div class="main">
		<div class="header">
			<Icon type="md-menu" size="24" @click="openDrawer" />
			<span class="ximai">微音乐</span>
			<Icon type="md-search" size="24" @click="toSearch" />
		</div>
		<Tabs v-model="currentIndex" @on-click="onChange">
			<TabPane ref="tab" v-for="(item,index) in tabbar" :value="tabbar[0].title" :label="item.title" :key="index">
				<div :class="[view,{active:!isActive}]" :style="{height:viewHeight}">
					<keep-alive>
						<router-view @index="changeIndex" />
					</keep-alive>
				</div>
			</TabPane>
		</Tabs>
		<Drawer placement="left" v-model="drawerShow" width="100" :styles="styles">
			<div class="drawer">
				<div class="tabs flex">
					<div class="tab" @click="show = true" :class="{active:show}">收藏列表</div>
					<Switch size="large" />
					<div class="tab" @click="show = false" :class="{active:!show}">播放历史</div>
				</div>

				<div class="content">
					<Like v-show="show"></Like>
					<PlayHistory v-show="!show"></PlayHistory>
				</div>
			</div>

			<!-- <div class="drawer">
				<Icon type="ios-contact-outline" size="70" />
				<p>未登录</p>
			</div> -->
		</Drawer>
	</div>
</template>

<script>
	import Like from './Like.vue';
	import PlayHistory from './PlayHistory.vue';
	export default {
		components: {
			Like,
			PlayHistory
		},
		data() {
			return {
				routeIndex: 0,
				drawerShow: false,
				currentIndex: 0,
				tabbar: [{
						title: '推荐',
						path: '/'
					},
					{
						title: '热歌榜',
						path: '/hot'
					},
					{
						title: '音乐馆',
						path: '/musichall'
					},
					{
						title: 'MV',
						path: '/mv'
					},
				],
				viewHeight: 0,
				view: 'view',
				isActive: true,
				show: true,
				styles: {
					position: 'relative'
				}
			}
		},
		created() {
			this.viewHeight = (window.innerHeight - 76) + 'px';
		},
		mounted() {
			// console.log(this.$refs.tab);
		},
		watch: {
			'$store.state.musicID': function() {
				this.isActive = false;
			},
			'$store.state.enMV': function(value) {
				this.isActive = value;
			}
		},
		methods: {
			changeIndex(index) {
				this.currentIndex = index;
			},
			onChange(index) {
				let path = this.tabbar[index].path;
				if (this.$route.path != path) {
					this.$router.replace({
						path
					});
				}
			},
			openDrawer() {
				this.drawerShow = true;
			},
			toSearch() {
				this.$router.push({
					name: 'Search'
				})
			},
		},
		// watch: {
		// 	$store(val) {
		// 		console.log('val-->', val);
		// 	}
		// }
	}
</script>

<style lang="less">
	.main {
		position: fixed;
		width: 100%;
		top: 0;
		

		.header {
			padding: 5px 10px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			span {
				font-size: 18px;
			}
		}

		.view {
			padding-top: 8px;
			overflow-y: auto;

			&.active {
				padding-bottom: 60px;
			}
		}


		/deep/ .ivu-drawer-wrap .tab {
			margin: 5px 10px;
		}

		/deep/ .ivu-tabs-bar {
			border: none;
			margin: 0;
		}

		/deep/ .ivu-tabs-nav-scroll {
			display: flex;
			justify-content: center;
		}

		/deep/ .ivu-tabs-nav {
			font-family: ximai;
			color: #aaa;
		}

		/deep/ .ivu-tabs-nav .ivu-tabs-tab-active {
			color: #000000;
		}

		/deep/ .ivu-tabs-nav .ivu-tabs-tab:hover {
			color: #000000;
		}

		/deep/ .ivu-tabs-ink-bar {
			background-color: #E91E63;
		}
	}

	.drawer {
		.tabs {
			position: absolute;
			top: 0;
			width: calc(100% - 32px);
			height: 50px;
			line-height: 30px;
			color: #aaa;

			.tab {
				margin: 10px 20px;
				padding: 0 10px;

				&.active {
					color: #FFFFFF;
					background-color: #E91E63;
				}
			}


			.tab:nth-of-type(1) {
				&.active {
					border-radius: 0 10px 10px 10px;
				}
			}

			.tab:nth-of-type(2) {
				&.active {
					border-radius: 10px 0 10px 10px;
				}
			}
		}

		.content {
			margin-top: 50px;
		}
	}
</style>
