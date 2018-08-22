export const attack = (value) => {
	// near: 0
	// far: 1
	return {
		id: "attack",
		pattern: value
	}
}

export const move = (value) => {
	return {
		id: "move",
		pattern: value
	}
}

export const turn = (value) => {
	// 	left: 0
	// 	right: 1
	return {
		id: "turn",
		turnTo: value
	}
}

export const dice = (max)=>{
	return {
		id: "random",
		min: 1,
		max: max
	}
}

export const search = (pattern)=>{
	// all: 0,
	// left: 1,
	// right: 2
	return {
		id: "search",
		pattern: pattern
	}
}
