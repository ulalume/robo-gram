<template lang="pug">
	.l-container-standard
		slot.l-header(name="header")
		slot.l-body(name="body")
		slot.l-footer(name="footer")
</template>
<style lang="stylus" scoped>
	@import "~assets/stylus/mixins"
	.l-container-standard
		width 100%
		height 100%
		flexbox()
		flex-direction column
		&>.l-header, &>.l-footer
			flex-shrink 0
		&>.l-body
			flex-grow 1
</style>
