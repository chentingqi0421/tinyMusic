<template>
	<div class="like">
		<PlayList :musicList="$store.state.likeMusic" type="like"></PlayList>
	</div>
</template>

<script>
	import PlayList from "../components/PlayList.vue";
	export default {
		name: 'like',
		components: {
			PlayList
		},
		data() {
			return {}
		},
		created() {
			if (localStorage.getItem('collection') != null) {
				this.$store.commit('changeLikeMusic', JSON.parse(localStorage.getItem('collection')).data);
			}
		},
		watch:{
			$store(val){
				console.log('val-->',val);
			}
		}
	}
</script>

<style lang="less">
	.like {}
</style>
