<template>
	<div id="app" :class="{playershow:$store.state.musicID!=0}" ref="app">
		<keep-alive>
			<router-view />
		</keep-alive>
		<Play v-show="!$store.state.enMV" :musicID="$store.state.musicID" :store="$store"></Play>
		<mvPlayer v-if="$store.state.enMV"></mvPlayer>
	</div>
</template>
<script>
	import Play from "./components/Play";
	import mvPlayer from "./components/Video.vue";
	export default {
		components: {
			Play,
			mvPlayer
		},
		data() {
			return {
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
				],
			}
		},
		created() {},
		methods: {
			onchange(index) {
				let path = this.tabbar[index].path;
				this.$router.replace({
					path
				});
			}
		}
	};
</script>
<style>
	@import url("./assets/font/font-awesome-4.7.0/css/font-awesome.min.css");
	@import url("./assets/font/ali/iconfont.css");

	@font-face {
		font-family: ximai;
		src: url(./assets/font/ximai.ttf);
	}

	#app {
		-webkit-tap-highlight-color: transparent;
		max-width: 750px;
		margin: 0 auto;
		/* font-family: Avenir, Helvetica, Arial, sans-serif; */
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: red;
		/* font-family: ximai; */
	}

	.ximai {
		font-family: ximai;
	}

	img {
		width: 100%;
		height: auto;
		display: block;
	}

	.playershow {
		padding-bottom: 50px;
	}

	.fl {
		float: left;
	}

	.fr {
		float: right;
	}

	.clearfix::after {
		content: '';
		display: block;
		clear: both;
	}

	.flex {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.flex-between {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
