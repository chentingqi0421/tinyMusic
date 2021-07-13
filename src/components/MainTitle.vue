<template>
	<!-- slot占位，Recommend标签里的内容放进来 -->
	<h2 class="title ximai">
		<slot></slot>
	</h2>
</template>
<style scoped>
	.title {
		width: 100%;
		color: #111;
		text-align: left;
		border-left: 2px solid #E91E63;
		padding-left: 9px;
		margin: 14px 0px;
		font-size: 17px;
	}
</style>
