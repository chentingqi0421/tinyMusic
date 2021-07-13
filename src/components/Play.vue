<template>
	<div class="player" v-if="musicID">
		<div class="smallplayer" @click="openFull">
			<audio ref="musicplayer" :src="`https://music.163.com/song/media/outer/url?id=${musicID}.mp3`" autoplay @timeupdate="timeupdate"></audio>
			<div :class="['imgbox',{'stopanimate':!isPlay}]">
				<img :src="song.al.picUrl+'?imageView&thumbnail=50y50&quality=15&tostatic=0'" v-show="song.al.picUrl" />
			</div>
			<div class="song">
				<div><span class="name">{{song.name}}</span></div>
				<div>
					<span v-for="(item,index) in song.ar" :key="index">
						<span v-if="index == 0">{{item.name}}</span>
						<span v-else-if="index != 0">/{{item.name}}</span>
					</span>
				</div>
			</div>
			<div class="right">
				<van-circle color="#E91E63" layer-color="#f4f4f5" v-model="currentRate" :speed="100" size="40px" stroke-width="100">
					<van-icon name="play" size="20" v-show="!isPlay" @click.stop.self="start" />
					<van-icon name="pause" size="20" v-show="isPlay" @click.stop.self="pause" />
				</van-circle>
				<div class="list" @click.stop="openMusiclist">
					<Icon type="md-menu" size="24" />
				</div>
			</div>
		</div>

		<div class="full" v-show="isFull">
			<div class="bg"></div>
			<div class="top">
				<span class="icon-revoke" @click="isFull=!isFull">
					<Icon type="ios-arrow-back" size="30" />
				</span>
				<div class="title">
					<div class="songname"><span>{{song.name}}</span></div>
					<div class="ablum">
						<span v-for="(item,index) in song.ar" :key="index">
							<span v-if="index == 0">{{item.name}}</span>
							<span v-else-if="index != 0">/{{item.name}}</span>
						</span>
					</div>
				</div>
				<span class="icon-like">
					<van-icon name="like-o" size="30" v-show="!isLike" @click="like" />
					<van-icon name="like" color="#E91E63" size="30" v-show="isLike" @click="like" />
				</span>
			</div>

			<div class="middle" @click="toggleplaypage" v-show="!fullgeci">
				<div class="disk">
					<div :class="['bigimgbox',{'stopanimate':!isPlay}]">
						<img :src="`${song.al.picUrl}?imageView&thumbnail=400y400&quality=50&tostatic=0`" v-show="song.al.picUrl!=''">
					</div>
				</div>
				<div class="geci">
					<ul :style="`transform:translateY(${currIndex*-40}px)`">
						<li v-for="(v,i) in lrcArr" :key="i" :class="{active:i==currIndex}">{{v.str}}</li>
					</ul>
				</div>
			</div>

			<!-- 歌词中部切换成满屏歌词 -->
			<div class="middle1" @click="toggleplaypage" v-show="fullgeci">
				<ul :style="`transform:translateY(${gecimove*-40}px)`" v-if="lrcArr != ''">
					<li v-for="(v,i) in lrcArr" :key="i" :class="{active:i==currIndex}">
						<span @click.self.stop="gecijump(i)"> {{v.str}}</span>
					</li>
				</ul>
				<div class="noLrc" v-else>
					暂无歌词
				</div>
			</div>
			<!-- 歌词中部切换 -->

			<div class="bottom">
				<div class="progress">
					<div class="top2 ximai">
						<span class="start">{{nowtime}}</span>
						<van-slider active-color="black" bar-height="4" v-model="sliderValue" @change="sliderChange" />
						<span class="end">{{subtime}}</span>
					</div>
				</div>

				<div class="control">
					<div @click="targetPattern">
						<span v-show="pattern[0].show" class="iconfont icon-circulation" style="font-size: 28px;"></span>
						<span v-show="pattern[1].show" class="iconfont icon-single-circulation" style="font-size: 28px;"></span>
						<span v-show="pattern[2].show" class="iconfont icon-random" style="font-size: 22px;"></span>
					</div>
					<div class="prevMusic" @click="prevMusic">
						<span class="iconfont icon-step-backward" style="font-size: 22px;"></span>
					</div>
					<div class="isPlay">
						<span class="iconfont icon-play" v-show="!isPlay" @click="start" style="font-size: 28px;"></span>
						<span class="iconfont icon-pause" v-show="isPlay" @click="pause" style="font-size: 28px;"></span>
					</div>
					<div class="nextMusic" @click="nextMusic">
						<span class="iconfont icon-step-forward" style="font-size: 22px;"></span>
					</div>
					<div @click="openMusiclist">
						<span class="iconfont icon-music-list"></span>
					</div>
				</div>

			</div>
		</div>

		<!-- 播放列表 -->
		<van-popup v-model="popupShow" position="bottom" round :style="{ height: '50%' }">
			<playList :musicList="$store.state.musicList"></playList>
		</van-popup>
		<!-- <Drawer :closable="false" placement="right" v-model="popupShow" width="70">
			<playList :musicList="$store.state.musicList"></playList>
		</Drawer> -->
	</div>
</template>
<script>
	import playList from "./PlayList.vue";
	export default {
		props: ["musicID", "musicIndex", "musicList", "store"],
		components: {
			playList
		},
		data() {
			return {
				currentRate: 0,
				sliderValue: 0,
				song: {
					al: {
						picUrl: "",
					},
					name: null,
					ar: [{
						name: ""
					}],
				},
				lrcArr: [],
				isFull: false,
				currIndex: 0,
				subtime: "00:00:00",
				nowtime: "00:00:00",
				fullgeci: false,
				moveflag: false,
				popupShow: false,
				pattern: [{
					title: '顺序播放',
					show: true
				}, {
					title: '单曲循环',
					show: false
				}, {
					title: '随机播放',
					show: false
				}],
				patternIndex: 0,
				isLike: false
			};
		},
		created() {
			this.selectLike();
		},
		methods: {
			openFull() {
				this.isFull = true;
				this.selectLike();
			},
			playHistory() {
				if (localStorage.getItem('playHistory') == null) {
					localStorage.setItem('playHistory', JSON.stringify({
						data: []
					}));
				}

				let playHistory = JSON.parse(localStorage.getItem('playHistory')).data;
				for (let i = 0; i < playHistory.length; i++) {
					if (playHistory[i].id == this.$store.state.musicID) {
						return;
					}
				}
				let music = this.$store.state.musicList[this.$store.state.musicIndex];
				playHistory.push(music);
				localStorage.setItem('playHistory', JSON.stringify({
					data: playHistory
				}));
				this.$store.commit('changePlayHistory', playHistory);
			},
			selectLike() {
				if (localStorage.getItem('collection') != null) {
					let collection = JSON.parse(localStorage.getItem('collection')).data;
					for (let i = 0; i < collection.length; i++) {
						if (collection[i].id == this.$store.state.musicID) {
							this.isLike = true;
							return
						}
					}
				}
				this.isLike = false;
			},
			like() {
				if (localStorage.getItem('collection') == null) {
					localStorage.setItem('collection', JSON.stringify({
						data: []
					}));
				}

				let collection = JSON.parse(localStorage.getItem('collection')).data;

				for (let i = 0; i < collection.length; i++) {
					if (collection[i].id == this.song.id) {
						let set = new Set(collection);
						set.delete(collection[i]);
						collection = [...set];
						localStorage.setItem('collection', JSON.stringify({
							data: collection
						}));
						this.$store.commit('changeLikeMusic', collection);
						this.isLike = false;
						return;
					}
				}
				this.isLike = true;
				let music = this.$store.state.musicList[this.$store.state.musicIndex];
				collection.push(music);
				localStorage.setItem('collection', JSON.stringify({
					data: collection
				}));
				this.$store.commit('changeLikeMusic', collection);
			},
			//切换播放模式
			targetPattern() {
				if (this.patternIndex == (this.pattern.length - 1)) {
					this.patternIndex = 0;
				} else {
					this.patternIndex++;
				}
				this.pattern.map(v => {
					v.show = false;
				});
				this.pattern[this.patternIndex].show = true;
			},
			//监听音乐进度条
			sliderChange(value) {
				let alltime = this.$refs.musicplayer.duration;
				let nowtime = value / 100 * alltime;
				this.$refs.musicplayer.currentTime = nowtime;
			},
			//切换上一首音乐
			prevMusic() {
				this.$store.commit('changeplaystatus', true);
				let index = this.$store.state.musicIndex;
				if (index > 0) {
					this.$store.commit("changemusicIndex", index - 1);
					this.$store.commit("changemusicID", this.$store.state.musicList[index - 1].id);
				} else {
					this.$store.commit("changemusicIndex", this.$store.state.musicList.length - 1);
					this.$store.commit("changemusicID", this.$store.state.musicList[this.$store.state.musicList.length - 1].id);
				}
			},
			//切换下一首音乐
			nextMusic() {
				this.$store.commit('changeplaystatus', true);
				let index = this.$store.state.musicIndex;
				if (index < this.$store.state.musicList.length - 1) {
					this.$store.commit("changemusicIndex", index + 1);
					this.$store.commit("changemusicID", this.$store.state.musicList[index + 1].id);
				} else {
					this.$store.commit("changemusicIndex", 0);
					this.$store.commit("changemusicID", this.$store.state.musicList[0].id);
				}
			},
			//单曲循环
			singleCirculation() {
				this.$refs.musicplayer.currentTime = 0;
				this.$store.commit('changeplaystatus', true);
				this.$refs.musicplayer.play();
			},
			//随机播放
			randomMusic() {
				let musicIndex = this.$store.state.musicIndex;
				let index = 0;
				do {
					index = this.randomNum(0, this.$store.state.musicList.length);
				} while (index == musicIndex);
				this.$store.commit('changeplaystatus', true);
				this.$store.commit("changemusicIndex", index);
				this.$store.commit("changemusicID", this.$store.state.musicList[index].id);
			},
			//生成随机数
			randomNum(minNum, maxNum) {
				return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
			},
			//打开播放列表
			openMusiclist() {
				this.popupShow = true;
			},
			//监听音乐播放
			timeupdate(event) {
				// 获取播放器
				let audio = event.target;
				// 获取当前时间
				let now = audio.currentTime;
				// 获取歌曲时间总长度
				let total = audio.duration;

				if (now == total) { //播放完了
					// 修改当前状态
					let patternIndex = this.patternIndex;
					switch (patternIndex) {
						case 0:
							this.nextMusic();
							break;
						case 1:
							this.singleCirculation();
							break;
						case 2:
							this.randomMusic();
					}
				}

				this.currentRate = now / total * 100;
				this.sliderValue = now / total * 100;

				// 把时间转化成分钟的
				this.nowtime = this.format(now);
				if (isNaN(total)) {
					this.subtime = '00:00';
					// this.$store.commit('changeplaystatus', false);
					// this.$toast('找不到资源，请切换其它歌曲');
					// this.nextMusic();
					// location.reload();
					// return;
				} else {
					this.subtime = this.format(total);
				}

				// 遍历数组
				for (let i = 0; i < this.lrcArr.length; i++) {
					// 判断是否是最后一项，因为最后一项没有下一项
					if (i == this.lrcArr.length - 1) {
						// 让他等于最后一项，退出当前循环，不往下执行
						this.currIndex = i;
						continue;
					}
					let nowt = this.lrcArr[i].time;
					let nextt = this.lrcArr[i + 1].time;
					// 判断当前播放时间在数组前后项范围内，当前时间>=前一项 && 当前时间<后一项
					if (nowt <= now && nextt > now) {
						// 拿到当前的i更新给currIndex
						this.currIndex = i;
						// 退出循环,加快运行效率
						break;
					}
					// 计算进度条百分比，更新长度
				}
			},
			// 格式化时间方法
			format(seconds) {
				// 转化合并为小时
				//   var hour = parseInt(seconds / 3600);
				//   hour = hour < 10 ? "0" + hour : hour;
				// 转化合并为分钟
				// console.log('seconds', typeof seconds, seconds)
				var min = parseInt(seconds / 60 % 60);
				min = min < 10 ? "0" + min : min;
				// 转化合并为秒
				// console.log('min', typeof min, min)
				var second = parseInt(seconds % 60);
				second = second < 10 ? "0" + second : second;
				// 返回拼接的时间字符串
				return `${min}:${second}`;
			},
			pause() {
				this.$store.commit('changeplaystatus', false);
				this.$refs.musicplayer.pause();
			},
			start() {
				if (this.musicID) { //有歌曲id才可以点
					this.$store.commit('changeplaystatus', true);
					this.$refs.musicplayer.play();
				}
			},
			toggleplaypage() { //点击播放页中间切换歌词页
				// 切换歌词页开关
				this.fullgeci = !this.fullgeci;
			},
			gecijump(k) {
				// 拿到当前数组点击下标的时间
				let time = this.lrcArr[k].time;
				// 利用ref找到播放器，把拿到的时间更新给播放器
				this.$refs.musicplayer.currentTime = time;
			},
		},
		watch: {
			store(val) {
				console.log(val);
				this.selectLike();
			},
			musicID(val) { //监听歌曲id根据id获取歌曲详细信息.
				// id改变点击重新到播放页面，不到歌词页
				this.fullgeci = false;
				this.axios.get("/song/detail?ids=" + val).then((data) => {
					this.song = data.data.songs[0];
				});
				//   请求歌词信息，请求地址改变写全
				this.axios.get("http://music.kele8.cn/lyric?id=" + val).then((lrcdata) => {
					if (lrcdata.data.lrc != undefined) {
						let lrc = lrcdata.data.lrc.lyric;
						// 根据换行符号裁切
						let lrcarrs = lrc.split(/\n/);
						let reg = /\[(\d+):(\d+\.\d+)\](.+)/;
						//   遍历数据，过滤成【时间，歌词】格式
						let arr = lrcarrs.map(v => {
							//   获取匹配项集合
							var a = v.match(reg);
							if (a) { //如果有匹配项
								//   时间合并成以秒为单位
								var t = parseInt(a[1] * 60) + parseFloat(a[2]);
								// 将每个对象给新数组
								return {
									time: t,
									str: a[3]
								}
							} else { //正则匹配不到返回flase，防止有些是空歌词
								return false;
							}
						})
						// console.log(lrcarrs);
						// 在过滤一遍选掉为false的项
						this.lrcArr = arr.filter((item) => {
							if (item) return true;
							return false;
						})

					} else {
						this.lrcArr = [];
					}
				})

				this.isLike = false;
				this.selectLike();
				this.playHistory();

				return val;
			},
			isPlay() {
				this.$nextTick(() => { //监听当前是否在播放状态，控制播放
					// 因为播放器播放是在停止播放图标控制，如果当前是暂停点击歌曲列表会把当前状态改成播放，但播放器因为id没变没有播放，导致图标空转
					if (this.isPlay) {
						this.$refs.musicplayer.play();
					} else {
						this.$refs.musicplayer.pause();
					}
				})
			}
		},
		computed: {
			isPlay() { //获取全局属性是否在播放
				return this.$store.state.isPlay;
			},
			gecimove() {
				let moveindex = 0;
				if (this.currIndex > 2) {
					// 因为初始给了120上边距，所以要等3个歌词后才开始动 
					moveindex = this.currIndex - 2;
				}
				return moveindex
			}
		},
		mounted() {},
	};
</script>
<style lang="less" scoped>
	.player {
		position: relative;
		width: 100%;
		height: 60px;
		border-top: 1px solid #dee;
		position: fixed;
		bottom: 0;
		z-index: 99;

		.smallplayer {
			width: 100%;
			height: 60px;
			display: flex;
			background: #fcfdff;
			justify-content: space-between;
			color: #fcfdff;

			.song {
				div {
					width: 200px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}

		.full {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			z-index: 99;
			display: flex;
			background-color: #F7F8FA;
			flex-direction: column;
			overflow: hidden;

			.top {
				width: 100%;
				height: 100px;
				padding-top: 10px;
				box-sizing: border-box;
				display: flex;

				.icon-revoke {
					margin-left: 8px;
					line-height: 80px;
				}

				.icon-like {
					margin-right: 8px;
					line-height: 80px;
				}

				.icon {}

				.title {
					flex: 1;
					line-height: 30px;
					overflow: hidden;

					.songname {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 100%;
						font-size: 18px;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.ablum {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 100%;
						font-size: 14px;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}

			.middle1 {
				margin-top: 120px;

				.noLrc {
					font-size: 20px;
				}
			}

			.middle,
			.middle1 {
				width: 100%;
				flex: 1;
				flex-direction: column;
				box-sizing: border-box;
				padding: 20px 0;
				box-sizing: border-box;
				margin-top: 10px;
				overflow: hidden;
				// color: #fcfcfd;

				.disk {
					width: 300px;
					height: 300px;
					margin: 0 auto;
					box-sizing: border-box;

					.bigimgbox {
						position: relative;
						width: 100%;
						height: 300px;
						background: url("../assets/img/disk.png")no-repeat center;
						background-size: 300px;
						border-radius: 50%;
						overflow: hidden;
						box-shadow: 0 0 0px 8px rgba(255, 255, 255, 0.3);
						animation: xuanzhuang 6s linear infinite;

						&.stopanimate {
							animation-play-state: paused;
						}
					}

					img {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						width: 220px;
						height: 220px;
						border-radius: 50%;
						display: block;
						border: 8px solid #141313;
					}
				}

				.geci {
					height: 80px;
					margin-top: 30px;
					overflow: hidden;
				}

				ul {
					transition: transform 0.2s;

					li {
						line-height: 40px;
						font-size: 16px;
						padding: 0 10px;
						box-sizing: border-box;
						color: #888;

						span {
							display: inline-block;
							height: 40px;
						}

						&.active {
							font-size: 18px;
							color: #E91E63;
						}
					}
				}
			}

			.bottom {
				width: 100%;
				height: 120px;
				// color: #fcfcfd;
				margin-bottom: 10px;

				.progress {
					width: 100%;
					height: 50px;

					.top2 {
						position: relative;
						display: flex;
						align-items: center;
						height: 50px;
						width: 100%;
						font-size: 16px;

						.start,
						.end {
							width: 60px;
							font-size: 13px;
							user-select: none;
							text-align: center;
							margin: 0 10px;
						}


					}
				}

				.control {
					width: 100%;
					height: 70px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 10px;
					// color: #728C98;
					// color: #d6dee7;

					div {
						width: 60px;
						height: 60px;
						display: flex;
						justify-content: center;
						align-items: center;

						// font-size: 30px;
						.iconfont {
							font-size: 25px;
							color: #333333;
						}

						// border-radius: 50%;
						// background-color: rgba(255, 255, 255, 0.5);
						// box-shadow: 1rem 1rem 4rem rgba(78, 134, 165, 0.09), 0.5rem 0.5rem 2rem rgba(78, 134, 165, 0.09), -0.5rem -1.5rem 2rem white, inset 1rem 1rem 2.3rem rgba(78, 134, 165, 0.05), 0px 0px 0.1rem #FFFFFF, inset 0.1rem 0.1rem 0 #FFFFFF;
					}
				}
			}

		}

		.song {
			flex: 1;
			height: 60px;
			margin-left: 70px;
			text-align: left;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			display: flex;
			flex-direction: column;
			justify-content: center;
			font-size: 12px;
			font-weight: 200;
			color: #888;

			.name {
				font-size: 16px;
				color: black;
			}

			.singger {
				font-size: 14px;
				color: #888;
			}
		}

		.right {
			line-height: 60px;
			// width: 100px;
			// margin-right: 10px;
			display: flex;
			align-items: center;
			color: black;

			.van-circle {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 10px;
			}

			.list {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 40px;
				height: 40px;
				line-height: 40px;
				font-size: 30px;
				text-align: center;
				margin-right: 10px;
			}
		}

		.imgbox {
			position: absolute;
			left: 10px;
			bottom: 5px;
			width: 50px;
			height: 50px;
			border-radius: 50%;
			background: #56575b url(../assets/img/disk.png) center;
			background-size: 50px 50px;
			transform-origin: 50% 50%;
			animation: rotate 6s linear infinite;

			&.stopanimate {
				animation-play-state: paused;
			}

			img {
				position: absolute;
				top: 5px;
				left: 5px;
				width: 40px;
				height: 40px;
				overflow: hidden;
				border-radius: 50%;
				display: block;
			}
		}

		.musicList {
			font-size: 12px;
			padding-top: 16px;
			color: #5b5b5b;
			text-align: left;

			.row {
				min-height: 50px;
				margin: 0 10px;

				.title {
					font-size: 14px;
					color: black;
				}

				&.active {
					color: red;
				}

				.sq {
					display: inline-block;
					width: 12px;
					height: 8px;
					background: url(../assets/img/index_icon_2x.png);
					background-size: 166px 97px;
					margin-right: 4px;
				}

				.playing {
					display: flex;
					//  等距离对其
					justify-content: space-around;
					//  底端对齐
					align-items: flex-end;

					i {
						width: 3px;
						margin: 0 1px;
						height: 25px;
						background-color: #E91E63;
						//  设置变换的起点位置
						transform-origin: center bottom;
						//  动画
						animation: playing 0.6s linear -0.2s infinite alternate-reverse;

						&:first-of-type {
							//设置动画延迟时间
							animation-delay: 0s;
						}

						&:last-of-type {
							animation-delay: -0.4s;
						}
					}

					&.paused {
						i {
							//  动画播放状态
							animation-play-state: paused;
						}
					}
				}
			}
		}

		@keyframes rotate {
			0% {
				transform: rotate(0deg);
			}

			100% {
				transform: rotate(360deg);
			}
		}

		@keyframes playing {
			from {
				transform: scaleY(1);
			}

			to {
				transform: scaleY(0.2);
			}
		}

	}
</style>
