<template>
	<div class="box">
		<div class="top ximai">
			<p class="return">
				<span class="iconfont icon-left" @click="huitui"></span>
				<span class="gedan">歌单</span>
			</p>

			<div class="bg" :style="{ background: `url('${gedanmsg.coverImgUrl}')` }"></div>
			<div class="imgbox">
				<img :src="`${gedanmsg.coverImgUrl}?imageView&thumbnail=200y200&quality=50&tostatic=0`" />
				<span class="icon">歌单</span>
				<span class="num"><span class="iconfont icon-V"></span>{{ gedanmsg.playCount | formatNum }}</span>
			</div>
			<div class="rightbox">
				<div class="title">{{ gedanmsg.name }}</div>
				<div class="photo">
					<img :src="`${gedanmsg.avatarUrl}?imageView&thumbnail=50y50&quality=50&tostatic=0`" />
					<span class="art"> {{ gedanmsg.nickname }}</span>
				</div>
			</div>
		</div>

		<div class="middle">
			<MainTitle>歌曲列表</MainTitle>
			<!-- <div class="songlist">歌曲列表</div> -->
			<ul>
				<GeneralList v-for="(item, k) in songList" :list="songList" :item="item" :key="item.id">
					<div class="leftnum">{{ (k + 1) | format }}</div>
				</GeneralList>
			</ul>
			<Loading v-show="songList.length == 0"></Loading>
			<div class="more" @click="more()">加载更多
				<span class="iconfont icon-right"></span>
			</div>
		</div>
	</div>
</template>
<script>
	import MainTitle from "../components/MainTitle";
	import GeneralList from "../components/GeneralList";
	import Loading from "../components/Loading";
	// import MainTitle from "../components/MainTitle.vue";
	export default {
		name: "Gedan",
		props: ["id"],
		data() {
			return {
				songList: [],
				gedanmsg: [],
				num: 0,
			};
		},
		components: {
			GeneralList,
			Loading,
			MainTitle
		},
		created() {
			this.loadgedan();
		},
		watch: {
			id(newValue) {
				this.songList = [];
				this.gedanmsg = [];
				this.num = 0;
				this.id = newValue;
				this.loadgedan();
			}
		},
		methods: {
			huitui() {
				this.$router.back();
			},
			more() {
				// 点击加载更多继续调用加载
				this.loadgedan(this);
			},
			loadgedan() {
				let musicids = [];
				// 当前页数加1
				this.num++;
				this.axios
					.get("/playlist/detail?id=" + this.id)
					.then((data) => {
						console.log('data=>', data.data);
						if (data.data.code == 200) {
							this.gedanmsg = data.data.playlist;
							// 因为拿3级目录会报错，把要的数据jia到2级
							this.gedanmsg.avatarUrl = this.gedanmsg.creator.avatarUrl;
							this.gedanmsg.nickname = this.gedanmsg.creator.nickname;
							musicids = data.data.playlist.trackIds.slice(
								20 * (this.num - 1),
								20 * this.num
							);
						}

					})
					.then(() => {
						//继续发起请求
						// 遍历数据里面的所有id，获取每首的详细信息
						for (let v of musicids) {
							this.axios.get("song/detail?ids=" + v.id).then((data) => {
								// 根据所需要的数据(歌名-id-作者-专辑-之前组件音质判断在item.song.privilege.maxbr-)，整理格式要跟主件的数据结构匹配，推入数组里
								this.songList.push({
									// 歌曲名
									name: data.data.songs[0].name,
									// id
									id: data.data.songs[0].id,
									// 是否是高音质
									song: {
										privilege: {
											maxbr: data.data.privileges[0].maxbr,
										},
										// 歌手信息数组
										artists: data.data.songs[0].ar,
										// 专辑名字
										album: {
											name: data.data.songs[0].al.name
										},
									},
								});
							});
						}
						console.log(this.songList);
					});
			},
		},
		filters: {
			//过滤器
			formatNum(value) {
				//过滤播放次数转成万单位
				return (value / 10000).toFixed(1) + "万";
			},
			// 格式化编号，小于10加0
			format(val) {
				return val < 10 ? "0" + val : val;
			},
		},
	};
</script>
<style lang="less" scoped>
	.box {
		width: 100%;

		.top {
			position: relative;
			height: 230px;
			display: flex;
			padding-bottom: 20px;
			align-items: center;
			flex-wrap: wrap;
			overflow: hidden;

			.return {
				position: relative;
				width: 100%;
				height: 40px;
				line-height: 40px;
				color: #fcfcfd;
				font-size: 20px;
				text-align: center;

				.gedan {
					width: 100%;
				}

				.icon-left {
					position: absolute;
					top: 0;
					left: 10px;
					width: 40px;
					height: 0px;
					text-align: left;
					font-size: 25px;
				}
			}

			.bg {
				position: absolute;
				width: 100%;
				height: 100%;
				opacity: 1;
				background-repeat: no-repeat;
				z-index: -1;
				background-size: cover;
				background-position: 50%;
				filter: blur(20px) brightness(0.8);
				transform: scale(1.5);
			}

			.imgbox {
				width: 150px;
				height: 150px;
				position: relative;
				margin-left: 10px;
				background: skyblue;
				color: #ffeeff;
				line-height: 20px;

				.icon {
					display: inline-block;
					position: absolute;
					width: 40px;
					height: 20px;
					left: 0;
					background: red;
					top: 10px;
					font-size: 12px;
					border-radius: 0 10px 10px 0;
				}

				.num {
					position: absolute;
					display: inline-block;
					font-size: 12px;
					height: 20px;
					top: 0;
					padding: 0 5px;
					right: 0;
					background: rgba(0, 0, 0, 0.1);

					.icon-V {
						margin-right: 2px;
						font-size: 14px;
					}
				}
			}

			.rightbox {
				flex: 1;
				height: 150px;
				margin-right: 10px;
				margin-left: 10px;
				text-align: left;

				.title {
					font-size: 18px;
					line-height: 40px;
					color: #ffeeff;
				}

				.photo {
					margin-top: 20px;
					height: 30px;
					font-size: 14px;
					line-height: 30px;
					color: #ddd;

					img {
						vertical-align: top;
						display: inline-block;
						width: 30px;
						height: 30px;
						border-radius: 50%;
						margin-right: 5px;
					}
				}
			}
		}

		.middle {
			.songlist {
				height: 24px;
				background: #eeeff0;
				font-size: 12px;
				text-align: left;
				line-height: 24px;
				text-indent: 10px;
			}
		}

		.more {
			color: #999;
			font-size: 15px;
			line-height: 50px;
			cursor: pointer;
		}
	}
</style>
