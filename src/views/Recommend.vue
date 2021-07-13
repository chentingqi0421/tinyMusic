<template>
	<div class="recommend">
		<MainTitle>推荐歌单</MainTitle>
		<!-- 遍历推荐歌单数组 -->
		<Loading v-show="recommendMusicList.length==0"></Loading>
		<ul class="recommendList">
			<router-link v-for="rem in recommendMusicList" :key="rem.id" tag="li" :to="`/gedan/${rem.id}`">
				<div>
					<img :src="`${rem.picUrl}?imageView&thumbnail=200y200&quality=50&tostatic=0`" />
					<p class="bf">
						<span class="iconfont icon-V"></span>{{ rem.playCount | formatNum }}
					</p>
				</div>
				<p class="recomtitle">{{ rem.name }}</p>
			</router-link>
			<MainTitle>最新音乐</MainTitle>
			<MusicItem :newMusicList="newMusicList">
			</MusicItem>
		</ul>
	</div>
</template>
<script>
	import MainTitle from "../components/MainTitle";
	import MusicItem from "../components/MusicItem";
	import Loading from "../components/Loading";
	export default {
		name: "Recommend",
		components: {
			MainTitle,
			MusicItem,
			Loading
		},
		data() {
			return {
				// 储存推荐歌单数组
				recommendMusicList: [],
				// 储存最新音乐数组
				newMusicList: [],
			};
		},
		created() {
			this.$emit('index', 0);
			this.axios
				.get("/personalized?limit=6")
				.then((response) => {
					this.recommendMusicList = response.data.result;
				})
			//获取推荐新歌
			this.axios
				.get("/personalized/newsong")
				.then((response) => {
					// console.log(response)
					this.newMusicList = response.data.result;
				})
		},
		filters: {
			//过滤器
			formatNum(value) {
				//过滤播放次数转成万单位
				return (value / 10000).toFixed(1) + "万";
			},
		},
	};
</script>
<style lang="less" scoped>
	.recommend {
		background: #fcfcfd;
		padding-top: 1px;
	}

	ul.recommendList {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		li {
			width: 33%;
			margin-bottom: 20px;

			div {
				position: relative;

				.bf {
					top: 2px;
					right: 3px;
					font-size: 12px;
					position: absolute;
					line-height: 20px;
					color: white;
					text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);

					.icon-V {
						font-size: 13px;
						margin-right: 2px;
					}
				}
			}

			.recomtitle {
				font-size: 12px;
				text-align: left;
				padding: 6px 2px 0 6px;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				text-overflow: ellipsis;
				word-break: break-all;
			}
		}
	}
</style>
