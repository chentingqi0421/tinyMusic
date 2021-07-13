<template>
	<div class="hot">
		<div class="hothead">
			<img src="../assets/img/hottop.jpg" alt="" />
			<div class="font">
				<div class="fontimg"></div>
				<p class="date">更新日期:{{ updateDate | formatDate }}</p>
			</div>
		</div>
		<ul class="hotlist">
			<GeneralList v-for="(item, k) in hotMusicList" :list="hotMusicList" :item="item" :key="item.id">
				<div class="leftnum">{{k+1 | formatNum}}</div>
			</GeneralList>
		</ul>
		<Loading v-show="hotMusicList.length==0" />
		<p class="more" @click="more()">查看更多 <span class="iconfont icon-right"></span></p>
	</div>
</template>
<script>
	import Loading from "../components/Loading";
	import GeneralList from "../components/GeneralList";
	export default {
		name: "Hot",
		components: {
			Loading,
			GeneralList,
		},
		data() {
			return {
				updateDate: new Date(),
				hotMusicList: [],
				num: 0,
			};
		},
		created() {
			this.$emit('index', 1);
			this.loadMusic();
		},
		methods: {
			loadMusic() {
				// 存音乐id的数组
				let musicids = [];
				// 当前页数加1
				this.num++;
				this.axios
					.get("/top/list?idx=1")
					.then((data) => {
						// console.log('data==>', data.data)
						this.updateDate = data.data.playlist.updateTime; //获取更新日期
						musicids = data.data.playlist.trackIds.slice(
							20 * (this.num - 1),
							20 * this.num
						);
					})
					.then(() => {
						//继续发起请求
						// 遍历数据里面的所有id，获取每首的详细信息
						for (let v of musicids) {
							this.axios.get("song/detail?ids=" + v.id).then((data) => {
								// 根据所需要的数据(歌名-id-作者-专辑-之前组件音质判断在item.song.privilege.maxbr-)，整理格式要跟主件的数据结构匹配，推入数组里
								// console.log(data.data);
								this.hotMusicList.push({
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
					});
			},
			more() {
				// 点击加载更多继续调用加载
				this.loadMusic(this);
			}
		},
		filters: {
			formatDate(value) {
				let d = new Date(value);
				let month = d.getMonth() + 1;
				let date = d.getDate();
				date = date < 10 ? "0" + date : date;
				return (month < 10 ? "0" + month : month) + "月" + date + "日";
			},
			// 格式化编号，小于10加0
			formatNum(val) {
				return val < 10 ? "0" + val : val;
			}
		},
		// beforeRouteEnter(to, from, next) { //路由进入之前会执行
		// 	// 进入之前重置一下num和数组，不缓存之前点击的更多的歌曲
		// 	next((vm) => {
		// 		vm.num = 0;
		// 		// 加载之前清空数组
		// 		vm.hotMusicList = [];
		// 		vm.loadMusic(vm);
		// 	});
		// }
	};
</script>
<style lang="less" scoped>
	.hot {
		background: #fcfcfd;

		.hothead {
			position: relative;
			width: 100%;
			height: 200px;

			img {
				width: 100%;
				height: 100%;
				display: block;
			}

			.font {
				position: absolute;
				width: 140px;
				height: 100px;
				top: 50%;
				left: 20px;
				transform: translateY(-50%);
			}

			.fontimg {
				position: absolute;
				top: 0;
				left: 0px;
				width: 140px;
				height: 67px;
				background: url(../assets/img/index_icon_2x.png);
				background-position: -24px -30px;
				background-size: 166px 97px;
			}

			.date {
				position: absolute;
				bottom: 0;
				font-size: 12px;
				left: 20px;
				line-height: 33px;
				color: white;
			}
		}

		li:nth-of-type(1) .leftnum,
		li:nth-of-type(2) .leftnum,
		li:nth-of-type(3) .leftnum {
			color: red;
		}

		.leftnum {
			width: 40px;
			text-align: center;
			font-size: 17px;
			color: #999;
			line-height: 53px;
			margin-left: -10px;
		}

		.more {
			color: #999;
			font-size: 15px;
			line-height: 50px;
			cursor: pointer;
		}
	}
</style>
