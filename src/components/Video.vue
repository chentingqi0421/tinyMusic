<template>
	<div class="video">
		<van-nav-bar :title="title" @click-right="cross" :border="false">
			<template #title>
				<p style="color: #fff;margin-top: 3px;font-weight: bold;">{{title}}</p>
				<p style="color: #dfdfdf;font-size: 12px;">
					<span v-for="(item,index) in artists" :key="index">
						<span v-if="index == 0">{{item.name}}</span>
						<span v-else-if="index != 0">/{{item.name}}</span>
					</span>
				</p>
			</template>
			<template #right>
				<span>
					<van-icon name="cross" size="24" color="#868686" /></span>
			</template>
		</van-nav-bar>
		<vueMiniPlayer ref="vueMiniPlayer" :video="video" :mutex="true" />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				artists: [],
				video: {
					url: '',
					cover: '',
					muted: false,
					loop: false,
					preload: 'auto',
					poster: '',
					volume: 1,
					autoplay: false,
				},
			}
		},
		created() {
			let mvid = this.$store.state.mvID;
			this.getVideoInfo(mvid);
		},
		methods: {
			//关闭视频播放弹窗
			cross() {
				this.$store.commit('isEnMV', false);
				this.$store.commit('changeplaystatus', false);
			},
			//获取视频信息
			getVideoInfo(mvid) {
				this.axios.get(`/mv/detail?mvid=${mvid}`).then((res) => {
					this.title = res.data.data.name;
					this.artists = res.data.data.artists;
					this.video.url = res.data.data.brs[480];
					this.video.cover = res.data.data.cover;
				});
			}
		}
	}
</script>

<style lang="less">
	.video {
		position: fixed;
		top: 200px;
		left: 5%;
		width: 90%;
		border-radius: 24px;
		overflow: hidden;

		.van-nav-bar {
			background-color: #2a2a2a;
		}

		.vm-player[data-v-5bbaf828] {
			background-color: #2a2a2a;
		}
	}
</style>
