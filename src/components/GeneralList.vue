<!--通用的音乐列表-->
<template>
	<!-- 点击触发父事件的的自定义事件，把id传过去 -->
	<li @click="playMusic">
		<!-- 存编号的站位 -->
		<slot></slot>
		<div class="left">
			<div>{{ item.name }}</div>
			<p>
				<span class="sq" v-if="item.song.privilege.maxbr > 320000"></span>
				<!-- 遍历循环所有的歌手信息，拿到名字 -->
				<span v-for="(singger, k) in item.song.artists" :key="k">
					<!-- 如果有多个歌手，下标大于0的后面全加/ -->
					<b v-show="k>0"> / </b>{{ singger.name }}
				</span> - {{ item.song.album.name }}
			</p>
		</div>
		<div class="right">
			<!-- {{item.id}} -->
			<span class="playing" :class="{ paused: !$store.state.isPlay }" v-if="$store.state.musicID == item.id">
				<i></i>
				<i></i>
				<i></i>
				<i></i>
			</span>
			<!-- <span v-else class="icon"></span> -->
		</div>
	</li>
</template>
<script>
	export default {
		props: {
			item: {
				type: Object,
				default: function() {
					return {
						name: '',
					}
				}
			},
			list: null
		},
		data() {
			return {
				paused: false
			}
		},
		created() {
			// console.log(this.item.song.artists)
		},
		methods: {
			playMusic() {
				//把音乐信息传递给Vue实例里面playingMusic全局属性.
				// console.log('list==>',this.list)
				this.list.map((v, i) => {
					if (v.id == this.item.id) {
						this.$store.commit("changemusicIndex", i);
					}
				})
				this.$store.commit("changemusicID", this.item.id);
				this.$store.commit('changeplaystatus', true);
				this.$store.commit("changemusicList", this.list);
			}
		}
	};
</script>
<style lang="less" scoped>
	ul {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		li {
			display: flex;
			margin-top: 10px;
			padding-left: 10px;

			.leftnum {
				width: 40px;
				text-align: center;
				font-size: 17px;
				color: #999;
				line-height: 53px;
				margin-left: -10px;
			}

			div.left {
				flex: 1;
				text-align: left;
				border-bottom: 1px solid #eee;

				div {
					font-size: 17px;
					color: black;
				}

				p {
					font-size: 12px;
					color: #888;
					padding: 5px 0px;
					line-height: 20px;
				}

				.sq {
					display: inline-block;
					width: 12px;
					height: 8px;
					background: url(../assets/img/index_icon_2x.png);
					background-size: 166px 97px;
					margin-right: 4px;
				}
			}

			div.right {
				// width: 30px;
				// height: 30px;
				border-bottom: 1px solid #ddd;
				padding: 0px 5px;
				margin-right: 5px;
				display: flex;
				align-items: center;
				justify-content: center;

				// img{
				// 	width: 100%;
				// 	height: 100%;
				// }
				.icon {
					display: inline-block;
					width: 22px;
					height: 22px;
					background-image: url(../assets/img/index_icon_2x.png);
					background-position: -24px 0px;
					background-size: 166px 97px;
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

		.footimg {
			width: 100%;

			img {
				display: block;
				width: 100%;
				height: auto;
			}
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
</style>
