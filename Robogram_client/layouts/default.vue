<template lang="pug">
	.site
		.main
			nuxt
</template>
<script>
	export default{}
</script>
<style lang="stylus">
	@import "~assets/stylus/reset"
	@import "~assets/stylus/base"
	@import "~assets/stylus/extends"
	@import "~assets/stylus/mixins"
	@import "~assets/stylus/variables"
	html, body
		width 100%
		height 100%
	#__nuxt, #__layout
		height 100%
	.site
		width 100%
		height 100%
		flexbox()
		flex-direction column
		.main
			height 50%
			flex-grow 1
</style>
