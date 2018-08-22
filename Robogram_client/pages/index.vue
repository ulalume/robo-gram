<template lang="pug">
	.page(:class="{buruburu: isBuruburu}")
		.header
			.status
				.lamps.left
					.lamp(:class="{active: !isAlive}") 開発中
					.lamp(:class="{active: isAlive}") 出撃中
				.icon(@click="setRandomColor")
					svg(viewBox="0 0 16 16" x="0px" y="0px" style="enable-background:new 0 0 16 16;")
						path(class="st0" :style="{fill: color}" d="M13,3.5H3C1.6,3.5,0.5,4.6,0.5,6v7c0,1.4,1.1,2.5,2.5,2.5h10c1.4,0,2.5-1.1,2.5-2.5V6C15.5,4.6,14.4,3.5,13,3.5z")
						path(class="st1" d="M13,3.5H3C1.6,3.5,0.5,4.6,0.5,6v7c0,1.4,1.1,2.5,2.5,2.5h10c1.4,0,2.5-1.1,2.5-2.5V6C15.5,4.6,14.4,3.5,13,3.5z")
						path(class="st2" :style="{fill: color}" d="M5.5,0.5h5v10h-5V0.5z")
				.lamps.right
					.lamp(:class="{active: life > 0}") 耐久
					.lamp.hp(:class="{active: life > 0}") ●
					.lamp.hp(:class="{active: life > 1}") ●
					.lamp.hp(:class="{active: life > 2}") ●
		.content
			.panels
				.blockPanel#blockPanel
					.blocks
						template(v-for="block, index in blocks")
							template(v-if="index==0")
								Block(
									:parentRoute="blocks"
									:index="index"
									:routeIndex="0"
									:block="block")
							template(v-else)
								Block(
									:parentRoute="blocks"
									:index="index"
									:parentBlock="blocks[index-1]"
									:routeIndex="0"
									:block="block")
						.spacer-bottom
		.footer
			.runButton(@click="createRobot" :class="{active: robotCode.length>0 && robotCode[0]!=lastSendValue, disabled: robotCode.length==0}")
				button
					template(v-if="isAlive==0") ロボット出撃
					template(v-else) プログラムアップデート
</template>
<script>
	import Block from "~/components/block"

	import Bus from "~/assets/scripts/bus"
	import { attack, move, turn, dice, search } from "~/assets/scripts/robotAction"

	import io from 'socket.io-client'

	export default {
		components: { Block },
		data(){
			return {
				bus: Bus,
				color: "",
				isAlive: false,
				lastSendValue: null,
				mounted: false,
				connection: null,
				isBuruburu: false,
				options: {
					method: [
						{ icon:"/images/icons_option_move.svg", type: "method", label: "前進", method: "move", isOpen: false,
						param: null },
						{ icon:"/images/icons_option_rotate.svg", type: "method", label: "回転", method: "rotate", isOpen: false,
							param: { label: "左に90度", value: 0 }, },
						{ icon:"/images/icons_option_attack.svg", type: "method", label: "攻撃", method: "attack", isOpen: false,
							param: { label: "近接", value: 0 }, },
						{ icon:"/images/icons_option_search.svg", type: "branch", label: "索敵", method: "search", isOpen: false,
							param: { label: "正面", value: 0 },
							routes: [[{ id: 0, type: "addNew", label: "+", isOpen: false }],[{ id: 0, type: "addNew", label: "+", isOpen: false }]] },
						{ icon:"/images/icons_option_dice.svg", type: "branch", label: "確率", method: "dice", isOpen: false,
							param: { label: "20%", value: 2 },
							routes: [[{ id: 0, type: "addNew", label: "+", isOpen: false }],[{ id: 0, type: "addNew", label: "+", isOpen: false }]] }
					]
				}
			}
		},
		computed: {
			blocks(){	return Bus.blocks },
			count(){	return Bus.count },
			life(){		return Bus.life },
			robotCode(){
				var robotCode = this.build(this.blocks, [])
				return robotCode
			},
			pickerTop(){
				if(Bus.openBlock.id!=-1){
					return $(".blockContent#"+Bus.openBlock.id).offset().top + 60
				}
				return -100
			},
			pickerLeft(){
				if(Bus.openBlock.id!=-1){
					return $(window).width() * 0.1
				}
				return 0
			},
			isChanged(){
				if(this.robotCode.length==0) return false
				return JSON.parse(JSON.stringify(this.robotCode[0])) != JSON.parse(JSON.stringify(this.lastSendValue))
			}
		},
		methods: {
			build(route, codes){
				var arr = []
				var prevCode = null
				route.forEach((block)=>{
					var code = this.makeCode(block)
					if(code!=null){
						if(arr.length == 0 ) arr.push(code)
						else prevCode.childs.push(code)
						prevCode = code
					}
				})
				return arr
			},
			makeCode(block){
				var code = {
					node_id: block.id,
					item: null,
					childs: []
				}
				switch(block.method){
					case "attack": 	code.item = attack(block.param.value);	break;
					case "move": 	code.item = move(block.param.value);	break;
					case "rotate": 	code.item = turn(block.param.value);	break;
					case "dice": 	code.item = dice(block.param.value);	break;
					case "search": 	code.item = search(block.param.value);	break;
				}
				switch(block.type){
					case "method":
						return code
					case "branch":
						code.childs = [
							this.build(block.routes[0], [])[0],
							this.build(block.routes[1], [])[0]
						]
						return code
				}
				return null
			},
			createRobot() {
				if(this.robotCode.length > 0){
					this.isAlive = true
					this.connection.emit("createRobot",
						{
							node: this.robotCode[0],
							color: this.color
						}
					)
					this.lastSendValue = JSON.parse(JSON.stringify(this.robotCode[0]))
					console.log(this.robotCode[0]);
				}
			},
			onOpen(event){
                console.log("open")
			},
			onClose(event){
				this.connection.startConnection()
			},
			setRandomColor(){
				const randomHighLuminanceColor = ()=>{
					while(true) {
						var r = Math.round(255 * Math.random());
						var g = Math.round(255 * Math.random());
						var b = Math.round(255 * Math.random());
						var lum = luminance([r,g,b]);
						if (lum > 120) {
							break;
						}
					}
					return "#" + ((r << 16) + (g << 8) + b).toString(16);
				}
				const luminance = (rgba)=>{
					var r = 0.298912;
					var g = 0.586611;
					var b = 0.114478;
					return Math.floor(r * rgba[0] + g * rgba[1] + b * rgba[2])
				}
				this.color = randomHighLuminanceColor()
			}
		},
		created(){
			this.setRandomColor()
		},
		mounted(){
			if("WebSocket" in window){
				//this.connection = io.connect("https://robo-gram.glitch.me")
    			//this.connection = io.connect("https://athena.softdevice.jp")
			    this.connection = io.connect("http://localhost:3000")
				this.connection.on("connect", this.onOpen)
				this.connection.on("disconnect", this.onClose)
				this.connection.on("onChangeNowPanel", (data)=>{
					Bus.activeMethod = data.panelId
				})
				this.connection.on("onChangeNowLife", (data)=>{
					if(data.life < Bus.life){
						if(window.navigator!=null){
							if(window.navigator.vibrate!=null) window.navigator.vibrate(1000)
							if(window.navigator.mozVibrate!=null) window.navigator.mozVibrate(1000)
							if(window.navigator.webkitVibrate!=null) window.navigator.webkitVibrate(1000)
						}
						this.isBuruburu = true
						setTimeout(()=>{
							this.isBuruburu = false
						}, 1000)
					}
					Bus.life = data.life
					if(Bus.life == 0) this.isAlive = false
				})
			}else{
				alert("このブラウザでは遊べないよ")
			}
			this.mounted = true
			window.addEventListener('beforeunload', function(e) {
				if(this.connection != null){
					this.connection.disconnect()
				}
			}, false);
		}
	}
</script>
<style lang="stylus" scoped>
	@import "~assets/stylus/extends"
	@import "~assets/stylus/mixins"
	@import "~assets/stylus/variables"
	.page
		position relative
		size 100vw 100vh
		& > .header
			width 100%
			height 40px
			background-color #192734
			flexbox()
			justify-content space-between
			align-items center

		.footer
			position absolute
			bottom 20px
			left 0
			width 100%
			height 50px
			padding 0 20px
			z-index 1500
		& > .content
			height calc(100% - 40px)

	.panels
		flexbox()
		height 100%
		overflow hidden

	.blockPanel
		position relative
		flex-grow 1
		width 50%
		height 100%
		overflow scroll
		padding 0
		.blocks
			display inline-block
			min-width 100%
			min-height 100%
			padding 0 calc(50vw - 50px)
			background-image url("/images/icons_cell.svg")
			background-size 100px
			background-color #F8F8FF
		.spacer-bottom
			width 100%
			height 100px
	.lines
		position absolute
		top 0
		left 0

	.runButton
		size 100% 100%
		max-width 400px
		margin 0 auto
		button
			animate()
			size 100% 100%
			border none
			border-radius 4px
			background-color #29C84E
			color #DFF4D7
			border-bottom 5px solid #29A54E
			color white
			cursor pointer
			font-size Medium
			outline none
			transform translateY(0)
		&:active button
			height calc(100% - 3px)
			background-color #29A54E
			border-bottom 2px solid #29A54E
			transform translateY(3px)
		&.disabled button
			height calc(100% - 3px)
			background-color #ddd
			border-bottom 2px solid #ccc
			transform translateY(3px)

	textarea
		position absolute
		width 300px
		right 50px
		top 20px
		height 80vh
		font-size Small

	.status
		width 100%
		flexbox()
		align-items center
		justify-content space-between
		.lamps
			&.left
				padding-left 20px
				justify-content flex-start
				.lamp
					margin-right 10px
			&.right
				padding-right 20px
				justify-content flex-end
				.lamp
					margin-left 10px
		.icon
			flex-shrink 0
			flexbox()
			align-items center
			size 40px 40px
			padding 8px
			img, svg
				size 100% 100%
				.st0
					fill #FFFFFF
				.st1
					fill none
					stroke #192734
					stroke-miterlimit 10
				.st2
					fill #FFFFFF
					stroke #192734
					stroke-miterlimit 10
		.lamps
			flexbox()
			align-items center
			.lamp
				animate()
				color #405A70
				line-height 1em
				&.hp
					font-size 25px
					margin-left 5px
				&.active
					color #DDE6ED
					text-shadow 0 0 15px rgba(#DDE6ED, .8)
	.buruburu
		animation hurueru .1s  infinite
	@keyframes hurueru
		0% {transform: translate(0px, 0px) rotateZ(0deg)}
		25% {transform: translate(2px, 2px) rotateZ(1deg)}
		50% {transform: translate(0px, 2px) rotateZ(0deg)}
		75% {transform: translate(2px, 0px) rotateZ(-1deg)}
		100% {transform: translate(0px, 0px) rotateZ(0deg)}
</style>
