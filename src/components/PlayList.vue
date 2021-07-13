<template>
	<div class="playList">
		<div class="musicList">
			<div class="row" v-for="(item,index) in musicList" :key="index" @click="switchMusic(index)">
				<div v-if="item.id != $store.state.musicID" class="clearfix">
					<div class="fl">
						<span>
							<span class="title">{{item.name}}</span>
							<span> - </span>
							<span>{{item.song.artists[0].name}}</span>
							<span v-for="(ar,i) in item.song.artists" :key="i">
								<span v-if="i != 0">/{{ar.name}}</span>
							</span>
							&nbsp;
							<span class="sq" v-if="item.song.privilege.maxbr > 320000"></span>
						</span>
					</div>
					<div class="fr" v-if="type == 'like'">
						<van-icon name="like" color="#E91E63" size="20" @click.stop.self="delLike(index)" />
					</div>
					<div class="fr" v-if="type == 'playHistory'">
						<Icon type="md-trash" size="20" color="#5B5B5B" @click.stop.self="delHistory(index)" />
					</div>
				</div>
				<div style="color: #E91E63;" v-else class="clearfix">
					<div class="fl">
						<span class="title" style="color: #E91E63;">{{item.name}}</span>
						<span> - </span>
						<span>{{item.song.artists[0].name}}</span>
						<span v-for="(ar,i) in item.song.artists" :key="i">
							<span v-if="i != 0">/{{ar.name}}</span>
						</span>
						&nbsp;
						<span class="sq" v-if="item.song.privilege.maxbr > 320000"></span>
					</div>
					<div class="fr" v-if="type == 'playList'">
						<span class="playing" :class="{ paused: !$store.state.isPlay }">
							<i></i>
							<i></i>
							<i></i>
							<i></i>
						</span>
					</div>
					<div class="fr" v-if="type == 'like'">
						<van-icon name="like" color="#E91E63" size="20" @click.stop.self="delLike(index)" />
					</div>
					<div class="fr" v-if="type == 'playHistory'">
						<Icon type="md-trash" size="20" color="#5B5B5B" @click.stop.self="delHistory(index)" />
					</div>
				</div>
				<van-divider v-if="index != (musicList.length - 1)" />
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'playList',
		props: ['musicList', 'type'],
		data() {
			return {}
		},
		created() {
			// if (this.type == 'playHistory') {
			// 	console.log(this.musicList, this.$store.state.musicID);
			// }
		},
		methods: {
			//点击播放列表音乐切换音乐
			switchMusic(index) {
				if (this.$store.state.musicIndex == index) {
					this.$store.commit('changeplaystatus', !this.$store.state.isPlay);
				} else {
					this.$store.commit('changeplaystatus', true);
					this.$store.commit("changemusicIndex", index);
					this.$store.commit("changemusicID", this.$store.state.musicList[index].id);
					this.$store.commit("changemusicList", this.musicList);
				}
			},
			delLike(index) {
				let collection = JSON.parse(localStorage.getItem('collection')).data;
				let set = new Set(collection);
				set.delete(collection[index]);
				collection = [...set];
				localStorage.setItem('collection', JSON.stringify({
					data: collection
				}));
				this.$store.commit('changeLikeMusic', collection);
			},
			delHistory(index) {
				let playHistory = JSON.parse(localStorage.getItem('playHistory')).data;
				let set = new Set(playHistory);
				set.delete(playHistory[index]);
				playHistory = [...set];
				localStorage.setItem('playHistory', JSON.stringify({
					data: playHistory
				}));
				this.$store.commit('changePlayHistory', playHistory);
			},
		},
	}
</script>

<style lang="less">
	.playList {
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
