<template>
	<div class="station">
		<!-- 轮播图 -->
		<div class="banner">
			<van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
				<van-swipe-item v-for="(item,k) in banner" :key="k" @click="openVideo(item.id)"><img :src="item.picUrl" alt=""></van-swipe-item>
			</van-swipe>
		</div>

		<!-- 最新MV -->
		<div class="listitem">
			<h2 class="ximai">最新MV</h2>
			<ul class="ul">
				<li v-for="item in mvfirst" :key="item.id" @click="openVideo(item.id)">
					<div class="imgbox">
						<img :src="`${item.cover}?imageView&thumbnail=200y200&quality=50&tostatic=0`" />
						<p class="iconbox">
							<span class="iconfont icon-bofang"></span>
							{{ item.playCount | formatnum }}
						</p>
					</div>
					<span class="secondtitle">{{ item.name }}</span>
				</li>
			</ul>
			<Loading v-show="mvfirst.length==0" />
		</div>
	</div>
</template>
<script>
	// import Listitem from "../components/Listitem";
	import Loading from "../components/Loading.vue";
	export default {
		name: "musichall",
		components: {
			Loading
		},
		data() {
			return {
				show: false,
				banner: [],
				list: [],
				mvfirst: [],

			};
		},
		created() {
			this.$emit('index', 3);

			// 获取推荐MV
			this.axios.get('/personalized/mv').then((res) => {
				this.banner = res.data.result;
			});

			// 获取最新MV
			this.axios.get('/mv/first').then((res) => {
				this.mvfirst = res.data.data;
			});

		},
		methods: {
			// 打开视频播放器
			openVideo(id) {
				this.$store.commit('changeplaystatus', false);
				this.$store.commit('isEnMV', true);
				this.$store.commit('changemvID', id);
			}
		},
		filters: {
			formatnum(value) {
				//过滤播放次数转成万单位
				return (value / 10000).toFixed(1) + "万";
			},
		},
	};
</script>
<style lang="less" scoped>
	.station {
		.banner {
			padding: 0 20px;

			.van-swipe {
				border-radius: 20px;

				.van-swipe-item {
					border: none;
					border-radius: 20px;
				}

				img {
					width: 100%;
					height: 200px;
					border-radius: 20px;
				}
			}
		}

		.listitem {
			width: 100%;

			h2 {
				font-size: 18px;
				// font-weight: 700;
				color: #333;
				line-height: 50px;
				text-align: left;
				letter-spacing: 1px;
				margin-left: 15px;
			}

			.ul {
				margin-left: 10px;
				display: flex;
				flex-wrap: wrap;

				li {
					width: 33.3%;
					padding: 0 5px;
					box-sizing: border-box;
					list-style: none;
					margin-bottom: 10px;

					.imgbox {
						width: 100%;
						border-radius: 10px;
						overflow: hidden;
						position: relative;
						margin-bottom: 5px;
					}

					.secondtitle {
						font-size: 12px;
						line-height: 20px;
						margin: 0 5px;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
						text-align: left;
					}

					.iconbox {
						display: inline-block;
						position: absolute;
						top: 4px;
						right: 5px;
						padding: 0 5px;
						font-size: 12px;
						background: rgba(0, 0, 0, 0.3);
						line-height: 16px;
						border-radius: 10px;
						color: #eee;

						.icon-bofang {
							font-size: 12px;
							margin-right: 2px;
						}
					}
				}
			}
		}

		.fixed {
			position: fixed;
			width: 100%;
			top: 0;
			bottom: 0;
			background-color: red;
			z-index: 100;
		}
	}
</style>
