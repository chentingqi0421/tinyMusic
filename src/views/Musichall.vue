<template>
	<div class="jplist">
		<Listitem v-for="(item,index) in list" :key="index" :items="item.data">
			<h2 class="ximai">{{item.title}}</h2>
		</Listitem>
	</div>
</template>
<script>
	import Listitem from "../components/Listitem";
	export default {
		name: "musichall",
		components: {
			Listitem,
		},
		data() {
			return {
				huayu: [],
				liuxing: [],
				yaogun: [],
				minyao: [],
				qingyinyue: [],
				list: []
			};
		},
		created() {
			this.$emit('index', 2);
			//获取歌单分类
			this.axios.get("/playlist/hot").then((data) => {
				data.data.tags.map((v, i) => {
					this.list.push({
						title: v.name,
						data: []
					})
					//获取歌单
					this.axios.get(`/top/playlist?limit=6&order=hot&cat=${v.name}`).then((res) => {
						this.list[i].data = res.data.playlists;
					});
				})
			});
		},
	};
</script>
<style lang="less" scoped>
	.jplist {
		width: 100%;

		h2 {
			font-size: 18px;
			color: #333;
			line-height: 50px;
			text-align: left;
			letter-spacing: 1px;
			margin-left: 15px;
		}
	}
</style>
