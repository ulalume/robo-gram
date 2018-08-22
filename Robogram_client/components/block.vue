<template lang="pug">
	.block(:class="[block.type, block.method, block.param]")
		template(v-if="parentBlock!=null")
			.cornerLine(v-if="parentBlock.type=='branch' && routeIndex==1 && index==0"
				:style="{left: cornerLeft + 'px', width: cornerWidth + 'px'}")
			.line(v-else)
			.label_true(v-if="parentBlock.type=='branch' && routeIndex==0 && index==0"): span ○
			.label_false(v-if="parentBlock.type=='branch' && routeIndex==1 && index==0"): span ×
		.infoWrapper
			.info
				.blockContent(:id="block.id" @click="onClick" :class="blockClass(block)" :style="getBlockStyle(block)")
					//- .label {{block.label}}
					//- .param(v-if="block.param != null") {{block.param.label}}
					.delete(v-if="block.type=='branch' || block.type=='method'" @click="remove") ×
				template(v-if="block.type == 'method' || block.type == 'branch'")
					.methodSelector(v-if="block.isOpen && params[block.method]!=null && params[block.method].length>0")
						.methods
							.method(v-for="param in params[block.method]"
								@click="selectParam(param)")
								//- img.icon(:src="param.icon")
								.label {{param.label}}
				template(v-if="block.type == 'addNew'")
					.methodSelector(v-if="block.isOpen")
						.methods
							.method(v-for="method in methods"
								:class="method.type"
								@click="add(method)")
								img.icon(:src="method.icon")
								.label(:class="method.method") {{method.label}}
		template(v-if="block.type == 'branch'")
			.routes
				.route(v-for="route, ri in block.routes")
					template(v-for="child, ci in route")
						template(v-if="ci==0")
							Block(
								:parentRoute="route"
								:index="ci"
								:block="child"
								:parentBlock="block"
								:routeIndex="ri"
								@clicked="closeSubPanel")
						template(v-else)
							Block(
								:parentRoute="route"
								:index="ci"
								:block="child"
								:parentBlock="child"
								:routeIndex="ri"
								@clicked="closeSubPanel")
</template>
<script>
	import Bus from "~/assets/scripts/bus"

	export default {
		name: "Block",
		props: {
			parentBlock: Object,
			parentRoute: Array,
			index: Number,
			routeIndex: Number,
			block : Object,
		},
		data(){
			return {
				mounted: false,
				parentPos: 0,
				myPos: 0,
				methods: [
					{ icon:"/images/icons_option_move.svg", type: "method", label: "前進", method: "move", isOpen: false,
						param: { icon: "/images/icons_move.svg", label: "top", value: 0 } },
					{ icon:"/images/icons_option_rotate.svg", type: "method", label: "回転", method: "rotate", isOpen: false,
						param: { icon: "/images/icons_rotate_left.svg", label: "左に90度", value: 0 }, },
					{ icon:"/images/icons_option_attack.svg", type: "method", label: "攻撃", method: "attack", isOpen: false,
						param: { icon: "/images/icons_attack.svg", label: "近接", value: 0 }, },
					{ icon:"/images/icons_option_search.svg", type: "branch", label: "索敵", method: "search", isOpen: false,
						param: { icon: "/images/icons_search.svg", label: "正面", value: 0 },
						routes: [[{ id: 0, type: "addNew", label: "+", isOpen: false }],[{ id: 0, type: "addNew", label: "+", isOpen: false }]] },
					{ icon:"/images/icons_option_dice.svg", type: "branch", label: "確率", method: "dice", isOpen: false,
						param: { icon: "/images/icons_dice_1_2.svg", label: "20%", value: 2 },
						routes: [[{ id: 0, type: "addNew", label: "+", isOpen: false }],[{ id: 0, type: "addNew", label: "+", isOpen: false }]] },
				],
				params : {
					move: [
						{ icon: "/images/icons_move.svg", label: "top", value: 0 },
						{ icon: "/images/icons_move_right.svg", label: "top", value: 1 },
						{ icon: "/images/icons_move_bottom.svg", label: "top", value: 2 },
						{ icon: "/images/icons_move_left.svg", label: "top", value: 3 },
					],
					rotate: [
						{ icon: "/images/icons_rotate_left.svg", label: "左に90度", value: 0 },
						{ icon: "/images/icons_rotate_right.svg",label: "右に90度", value: 1 },
					],
					attack: [
						{ icon: "/images/icons_attack.svg", label: "近接", value: 0 },
					],
					dice: [
						{ icon: "/images/icons_dice_1_2.svg", label: "20%", value: 2 },
						{ icon: "/images/icons_dice_1_3.svg", label: "50%", value: 3 },
						{ icon: "/images/icons_dice_1_4.svg", label: "80%", value: 4 },
					],
					search: [
						{ icon: "/images/icons_search.svg", label: "正面", value: 0 },
						{ icon: "/images/icons_search_right.svg", label: "左方向", value: 1 },
						{ icon: "/images/icons_search_bottom.svg", label: "下", value: 2 },
						{ icon: "/images/icons_search_left.svg", label: "左方向", value: 3 },
					]
				}
			}
		},
		computed: {
			life(){		return Bus.life },
			activeId(){ return Bus.activeMethod },
			cornerWidth(){ return this.myPos - this.parentPos - 40 + 3 },
			cornerLeft(){ return this.cornerWidth * -1 + 50 + 3 }
		},
		methods: {
			getBlockStyle(block){
				if(block.param!=null && block.param.icon!=null){
					return {'background-image': 'url('+block.param.icon+')'}
				}
			},
			blockClass(block){
				var cls = []
				cls.push(block.type)
				cls.push(block.method)
				if(block.param!=null) cls.push('param-'+block.param.value)
				if(block.id==this.activeId && this.life>0) cls.push("active")
				return cls
			},
			calcParentPos(){
				if(this.mounted && this.parentBlock!=null){
					var elm = $(".blockContent#"+this.parentBlock.id)
					if(elm!=null && $(elm).offset()!=null && $(elm).offset().left!=undefined) this.parentPos = $(elm).offset().left + $("#blockPanel").scrollLeft()
				}
			},
			calcMyPos(){
				if(this.mounted){
					var elm = $(".blockContent#"+this.block.id)
					if(elm!=null && $(elm).offset()!=null && $(elm).offset().left!=undefined) this.myPos = $(elm).offset().left + $("#blockPanel").scrollLeft()
				}
			},
			onClick(){
				Bus.$emit("closeSubPanel")
				switch(this.block.type){
					case "method":
					case "branch":
						var index = -1
						this.params[this.block.method].forEach((param, i)=>{
							// console.log(param.value + ', '+this.block.param.value);
							if(param.value == this.block.param.value) index = i
						})
						if(index < this.params[this.block.method].length-1) index++
						else index = 0
						this.block.param = this.params[this.block.method][index]
						break
					case "addNew":
						if(this.block.isOpen){
						}else{
							this.block.isOpen = true
							if( $(this.$el).offset().top + 200 > $(window).height() ){
								setTimeout(()=>{
									var d = $(window).height() - $(this.$el).offset().top + 200
									$("#blockPanel").scrollTop($("#blockPanel").scrollTop() + d)
								}, 1)
							}
							var d = $(this.$el).offset().left - $(window).width()/2 + 40
							$("#blockPanel").animate({scrollLeft: $("#blockPanel").scrollLeft() + d}, 250, 'swing')
						}
						break
				}
			},
			add(node){
				Bus.$emit("closeSubPanel")
				switch(node.type){
					case "method":
						node.id = Bus.count
						this.parentRoute.splice(this.parentRoute.length-1, 0, node)
						Bus.count++
						setTimeout(()=>{Bus.$emit("addedNewNode")}, 1)
						break
					case "branch":
						node.id = Bus.count
						Bus.count++
						node.routes[0][0].id = Bus.count
						Bus.count++
						node.routes[1][0].id = Bus.count
						Bus.count++
						this.parentRoute.pop()
						this.parentRoute.push(node)
						setTimeout(()=>{Bus.$emit("addedNewNode")}, 1)
						break
				}
				$("#blockPanel").animate({scrollTop: ($("#blockPanel").scrollTop()+120)}, 300, 'swing')
			},
			selectParam(param){
				if(param.value=="delete"){
					this.remove()
				}else{
					this.block.param = param
					this.block.isOpen = false
				}
			},
			closeSubPanel(){
				this.block.isOpen = false
			},
			remove(){
				if(this.block.type=="method"){
					this.parentRoute.splice(this.index, 1)
				}
				if(this.block.type=="branch"){
					this.parentRoute.splice(this.index, 1)
				}
				setTimeout(()=>{
					Bus.$emit("addedNewNode")
				}, 0)
				if(this.parentRoute.length == 0 || this.parentRoute[this.parentRoute.length-1].type!='branch'&&this.parentRoute[this.parentRoute.length-1].type!='addNew'){
					this.parentRoute.push({id: Bus.count, type: "addNew", label: "+", isOpen: false })
					Bus.count++
				}
			},
		},
		created(){
			Bus.$on("closeSubPanel", this.closeSubPanel)
			Bus.$on("addedNewNode", ()=>{
				this.calcParentPos()
				this.calcMyPos()
			})
		},
		mounted(){
			this.mounted = true
			this.calcParentPos()
			this.calcMyPos()
		}
	}
</script>
<style lang="stylus" scoped>
	@import "~assets/stylus/extends"
	@import "~assets/stylus/mixins"
	@import "~assets/stylus/variables"
	.block
		position relative
		text-align center
		.type
			font-size Small
		.label
			font-weight bold
		.param
			font-size Small
	.start
		& > .infoWrapper > .info
			height 40px
			margin-top 60px
			.blockContent
				margin 0 auto
				size 40px 40px
				border-radius 50%
				background-color #ddd
	.branch, .method, .addNew
		& > .infoWrapper > .info > .blockContent
			color white
			border none
			border-radius 5px
			background-size 80px
			&.start
				background-image url("/images/icons_start.svg")
			&.move, &.rotate
				box-shadow 0 0 10px rgba(#03a9f5, .8)
			&.search, &.dice
				box-shadow 0 0 10px rgba(#fdae3a, .8)
			&.attack
				box-shadow 0 0 10px rgba(#ea407a, .8)
			&.addNew
				background-image url("/images/icons_add.svg")
			&:hover
				z-index 1000
			&.active
				box-shadow 0 0 30px rgba(#29C84E, 1)
		& > .delete
			color white

	.infoWrapper
		padding 10px 10px
	.info
		position relative
		size 80px 80px
		.blockContent
			position relative
			size 100% 100%
			cursor pointer
			flexbox()
			flex-direction column
			align-items center
			justify-content center
			z-index 100
			&:hover
				.delete
					opacity 1
			& > .delete
				animate()
				position absolute
				top 1px
				right 1px
				size 20px 20px
				content 'x'
				color white
				opacity 1
			&.active
				box-shadow 0 0 20px #149114

	.routes
		min-width 100px
		min-height 100px
		flexbox()
		justify-content flex-start

	.methodSelector
		position absolute
		z-index 2000
		bottom -50px
		left -110px
		background-color white
		border-radius 4px
		box-shadow 0 0 10px rgba(#192734, .8)
		.methods
			flexbox()
			.method
				min-width 60px
				flexbox()
				flex-direction column
				align-items center
				justify-content center
				cursor pointer
				padding 2px 10px
				.icon
					position relative
					top 1px
				.label
					position relative
					top -2px
					font-size ExtraSmall
					font-weight normal
					color #192734
					&.move, &.rotate
						color #046587
					&.search, &.dice
						color #7F4F0F
					&.attack
						color #7A173D
				&:hover
					background-color #ddd

	.line, .cornerLine, .label_true, .label_false
		position absolute
		z-index 0
	.line
		z-index 0
		left calc(-10px + 4px)
		top -10px
		width calc(20px + 40px)
		height 20px
		// border-right 6px solid #8A8B8D
		&:before
			z-index 1
			position absolute
			content ''
			background-color #ddd
			box-shadow 0 0 30px rgba(#29C84E, 0)
			top 0
			right 0
			height 100%
			width 6px
		.active:before
			background-color #56F195
			box-shadow 0 0 30px rgba(#29C84E, .8)
	.cornerLine
		z-index 0
		left calc(-10px + 0px)
		top calc(-10px - 40px - 4px)
		width calc(20px + 40px + 6px)
		height 70px
		&:before, &:after
			z-index 1
			position absolute
			content ''
			background-color #ddd
			box-shadow 0 0 30px rgba(#29C84E, 0)
		.active:before, .active&:after
			background-color #56F195
			box-shadow 0 0 30px rgba(#29C84E, .8)
		&:before
			top 0px
			left 0
			width 100%
			height 6px
		&:after
			top 0px
			right 0px
			height 100%
			width 6px
	.label_true, .label_false
		font-size 0.7em
		lineHeight 10px
		height 14px
		left calc(20px + 40px - 17px)
		top -7px
		width 15px
		background-color #ddd
		border-radius 7px
		color white
		span
			display block
			width 15px
			position relative
			top -0.5px
			text-align center
	.label_true
		background-color #ddd
	.label_false
		background-color #ddd


	.picker
		position absolute
		bottom 0
		width 100vw
		height 30vh
</style>
