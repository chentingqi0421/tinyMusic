<template>
	<div class="playHistory">
		<PlayList :musicList="$store.state.playHistory" type="playHistory"></PlayList>
	</div>
</template>

<script>
	import PlayList from "../components/PlayList.vue";
	export default {
		name: 'playHistory',
		components: {
			PlayList
		},
		data() {
			return {}
		},
		created() {
			if (localStorage.getItem('playHistory') != null) {
				this.$store.commit('changePlayHistory', JSON.parse(localStorage.getItem('playHistory')).data);
			}
		},
	}
</script>

<style lang="less">
	.like {}
</style>
