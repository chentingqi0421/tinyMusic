<template>
	<div class="loadingbox">
		<div class="loadtip"></div>
		<div class="loadtip"></div>
		<div class="loadtip"></div>
	</div>
</template>
<style lang="less" scoped>
	.loadingbox {
		width: 30px;
		display: flex;
		margin: 0 auto;
		height: 15vh;
		justify-content: space-between;
		align-items: center;
	}

	.loadtip {
		width: 5px;
		height: 30px;
		background: #E91E63;
		transform-origin: center bottom;
		animation: load 0.5s infinite alternate-reverse;

		&:first-of-type {
			animation-delay: -0.4s; //延迟时间 负数直接跳过. 0.2
		}

		&:last-of-type {
			animation-delay: -0.2s; //延迟时间 负数直接跳过. 0.4
		}
	}

	@keyframes load {
		0% {
			transform: scaleY(0.2);
		}

		100% {
			transform: scaleY(1);
		}
	}
</style>
