<template>
	<!-- 精品歌单 -->
	<div class="listitem">
		<slot></slot>
		<ul class="ul">
			<router-link tag="li" v-for="item in items" :key="item.id" :to="`/gedan/${item.id}`">
				<div class="imgbox">
					<img class="img" :src="`${item.coverImgUrl}?imageView&thumbnail=200y200&quality=50&tostatic=0`" />
					<p class="iconbox">
						<span class="iconfont icon-bofang"></span>
						{{ item.playCount | formatnum }}
					</p>
				</div>
				<span class="secondtitle">{{ item.name }}</span>
			</router-link>
		</ul>
		<Loading v-show="items.length==0" />
	</div>
</template>
<script>
	import Loading from './Loading';
	export default {
		name: "Listitem",
		components: {
			Loading
		},
		props: {
			items: {
				type: Array,
				default: function() {
					return [];
				},
			},
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
	.listitem {
		width: 100%;

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
</style>
