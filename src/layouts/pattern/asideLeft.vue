<template lang="pug">
	.l-container-asideleft
		slot.l-aside(name="aside")
		slot.l-main(name="main")
</template>
<style lang="stylus" scoped>
	@import "~assets/stylus/mixins"
	.l-container-asideleft
		width 100%
		height 100%
		flexbox()
		&>.l-aside
			flex-shrink 0
		&>.l-body
			flex-grow 1
</style>
