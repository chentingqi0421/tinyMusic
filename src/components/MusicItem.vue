<!-- 最新音乐列表主件 -->
<template>
	<div class="newlistbox">
		<ul class="newMusicList">
			<GeneralList v-for="item in newMusicList" :list="newMusicList" :item="item" :key="item.id">
			</GeneralList>
		</ul>
		<Loading v-if="newMusicList.length == 0"></Loading>
	</div>
</template>
<script>
	import Loading from "../components/Loading";
	import GeneralList from "../components/GeneralList";
	export default {
		name: "MusicItem",
		components: {
			Loading,
			GeneralList
		},
		props: {
			newMusicList: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		created() {},
	};
</script>
<style lang="less" scoped>
	.newlistbox {
		width: 100%;
	}

	.newMusicList {
		width: 100%;

		.footbg {
			width: 100%;

			img {
				display: block;
				width: 100%;
				height: auto;
			}
		}
	}
</style>
