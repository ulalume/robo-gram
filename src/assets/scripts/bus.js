import Vue from 'vue'

var bus = new Vue({
	data(){
		return {
			color: "#409EFF",
			count: 2,
			openBlock: {
				id: -1,
				node: null,
				parentNode: null,
			},
			activeMethod: -1,
			life: 3,
			blocks: [
				{ id: 0, type: "start", label: "開始地点" },
				{ id: 1, type: "addNew", label: "+", isOpen: false },
			]
		}
	},
})

export default bus
