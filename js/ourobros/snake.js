/* EDITED by AAREX */

Math.lerp = function (x0,x1,t) {
	return x0 + (x1 - x0) * Math.min(1, Math.max(0, t))
}

Math.randomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}

function newSnakeData() {
	let s = {
		time: 0,
		moves: 0,
		cam_pos: {x: 320, y: 240},
		bodies: [
			[{x: 0, y: -1},'0h'],
			[{x: 0, y: 0},'00'],
			[{x: 0, y: 1},'00'],
			[{x: 0, y: 2},'00'],
			[{x: 0, y: 3},'0t'],
		],
		len: 5,
	
		max_apples: 10,
		apples: [],
	
		size: [16, 10],
		move: 0,
		images: {},

		powerup: null,
		powerup_time: 0,
	}
	return s
}

var snake = newSnakeData()

const SNAKE_HELPER = {
	images: ['arrow_image','snake_texture'],
	movement: [{x: 0, y: -1},{x: 1, y: 0},{x: 0, y: 1},{x: -1, y: 0}],
	arrow_movement: [{x: 0, y: -1},{x: 2, y: 0},{x: 1, y: 2},{x: -1, y: 1}],
	speed: [1/3,1/4,1/5,1/6],
	connectToTextureID: {
		'0h': 10, '1h': 8,  '2h': 11, '3h': 9,  // Head
		'0t': 15, '1t': 13, '2t': 14, '3t': 12, // Tail
		'00': 3,  '22': 3,  '11': 2,  '33': 2,  // Line
		'32': 5,  '01': 5,  '23': 0,  '10': 0,  // Curve
		'12': 4,  '03': 4,  '30': 1,  '21': 1,
	},
	objectIDs: {
		'apple': 6,
		'green_apple': 16,
		'strawberry': 17,

		'aim': 18,
		'combo': 19,
		'adjoin': 20,
		'frenzy': 21,
		'purify': 22,
	},
	appleTiers: [null,'apple','green_apple'],
}

const TIMED_POWERUPS = ["combo", "frenzy", "purify"]
function onPowerup(i) {
	if (!snake.powerup && TIMED_POWERUPS.includes(i)) {
		snake.powerup = i
		snake.powerup_time = 30
	}
	switch (i) {
		case 'adjoin':
			snake.apples.forEach(x => {
				if (x.type == 'apple') for (let d of SNAKE_HELPER.movement) {
					let type, tier, origin
					let s = snake.size

					origin = {x: x.x + d.x, y: x.y + d.y}

					if (origin.x < -s[0]/2 || origin.x > s[0]/2-1 || origin.y < -s[1]/2 || origin.y > s[1]/2-1) continue;

					type = 'apple'
					tier = Math.min(1 + Math.floor(-Math.log2(Math.random())),SNAKE_HELPER.appleTiers.length-1)

					snake.apples.push({...origin, type, tier})
				}
			})
		break;
	}
}

function calcSnake(dt) {
	snake.time += dt
	if (snake.time >= SNAKE_HELPER.speed[player.options.snake_speed]) {
		//console.log(snake.time,dt)
		snake.time = 0
		snakeStep()
	}
	if (snake.powerup_time > 0) {
		snake.powerup_time = Math.max(snake.powerup_time-dt,0)
		if (snake.powerup_time <= 0) snake.powerup = null
	}
}

function snakeStep() {
	let head_move = {...snake.bodies[0][0]}

	let m = SNAKE_HELPER.movement[snake.move], p = snake.powerup
	getNewSnakePosition(head_move, m)

	// Apple Feeding
	/*
	let w = snake.apples.findIndex(x => x.x == head_move.x && x.y == head_move.y), w2 = w >= 0 && snake.len < 10
	if (w >= 0) {
		feedSomething(snake.apples[w],w)
		snake.moves = 0
		snake.apples.splice(w,1)
	}
	*/

	let keep = []

	snake.apples.forEach((x,w) => {
		if (x.x == head_move.x && x.y == head_move.y) {
			feedSomething(x,w)
			snake.moves = 0
		} else keep.push(x)
	})

	snake.apples = keep

	let mult = p === 'combo' ? 1.5 : 1

	// Snake Move
	snake.move_max = snake.len == 5 ? 1/0 : Math.round((25 - snake.len * 2) * mult)
	snake.moves++
	if (snake.moves >= snake.move_max) {
		snake.moves = 0
		snake.len--
        snake.move_max = snake.len == 5 ? 1/0 : Math.round((25 - snake.len * 2) * mult)
	}

	// Please fix the rendering issue.
	let op = snake.bodies[0][1]
	snake.bodies = [[head_move]].concat(snake.bodies).splice(0, snake.len)
	snake.bodies[0][1] = snake.move + "h"
	if (snake.bodies.length > 1) snake.bodies[1][1] = snake.move + op[0]
	if (snake.bodies.length == snake.len) snake.bodies[snake.len-1][1] = snake.bodies[snake.len-1][1][0] + "t"

	// Apple Spawn
	if (snake.apples.length < snake.max_apples) spawnApples()
}

function spawnApples() {
	let evo = OURO.evolution

	var len = Math.min(Math.max(Math.log2(0.2 / Math.random()), 1), 4) //Aarex - Get Line Length
	var origin
	var s = snake.size
	while (!origin) {
		let rx = Math.randomInt(0,s[0])-Math.floor(s[0]/2), ry = Math.randomInt(0,s[1])-Math.floor(s[1]/2)
		if (snake.bodies.findIndex(x => x[0].x == rx && x[0].y == ry) == -1 && snake.apples.findIndex(x => x.x == rx && x.y == ry) == -1) origin = {x: rx, y: ry}
	}

	for (var i = 1; i <= len; i++) {
		let type, tier

		if (evo >= 2 && Math.random() < 0.05) {
			let POWERUPS = ["combo", "adjoin", "frenzy", "purify"]
			let powerup = POWERUPS[Math.randomInt(0, POWERUPS.length)]
			type = "powerup"
			tier = powerup
		} else {
			type = Math.random() < 1/4 && snake.powerup !== 'frenzy' ? "berry" : "apple" //Elund - Strawberries
			tier = Math.min((snake.powerup === 'purify' ? 2 : 1) + Math.floor(-Math.log2(Math.random())),SNAKE_HELPER.appleTiers.length-1) //Elund - Green Apples
		}

		snake.apples.push({...origin, type, tier})
		getNewSnakePosition(origin, SNAKE_HELPER.movement[Math.randomInt(0,4)])
	}
}

function drawSnake() {
	let ctx = snake.canvas_ctx

	ctx.clearRect(0,0,640,480)

	ctx.font = "16px consolas";

	for (let i = 0; i < snake.apples.length; i++) {
		let a = snake.apples[i], x = a.x * 32 + snake.cam_pos.x, y = a.y * 32 + snake.cam_pos.y

		let tx

		switch (a.type) {
			case 'apple':
				tx = SNAKE_HELPER.objectIDs[SNAKE_HELPER.appleTiers[a.tier]]
			break;
			case 'berry':
				tx = SNAKE_HELPER.objectIDs.strawberry
			break;
			case 'powerup':
				tx = SNAKE_HELPER.objectIDs[a.tier]
			break;
		}

		ctx.save()
		ctx.translate(x - 16, y - 16)
		ctx.drawImage(snake.images.snake_texture,tx%8*32,Math.floor(tx/8)*32,32,32,0,0,32,32)
		ctx.restore()
	}

	for (let i = snake.len - 1; i >= 0; i--) {
		let b = snake.bodies[i]

		if (!b) continue
		
		let x = b[0].x * 32 + snake.cam_pos.x, y = b[0].y * 32 + snake.cam_pos.y

		let tx = SNAKE_HELPER.connectToTextureID[b[1]]

		if (tx != 7) {
			ctx.save()
			ctx.translate(x - 16, y - 16)
			ctx.drawImage(snake.images.snake_texture,tx%8*32,Math.floor(tx/8)*32,32,32,0,0,32,32)
			ctx.restore()
		}
	}

	let s = snake.size

	ctx.strokeStyle = "white";
	ctx.lineWidth = 4;
	ctx.strokeRect(snake.cam_pos.x - Math.floor(s[0]/2) * 32 - 16, snake.cam_pos.y - Math.floor(s[1]/2) * 32 - 16, s[0] * 32, s[1] * 32)

	if (snake.images.arrow_image) {
		let am = SNAKE_HELPER.arrow_movement[snake.move]

		ctx.save()
		ctx.translate((snake.bodies[0][0].x + am.x) * 32 - 16 + snake.cam_pos.x, (snake.bodies[0][0].y + am.y) * 32 - 16 + snake.cam_pos.y);
		ctx.rotate(Math.PI * snake.move / 2);
		ctx.drawImage(snake.images.arrow_image,0,0)
		ctx.restore()
	}
}

function setupSnake() {
	for (let i in SNAKE_HELPER.images) {
		snake.images[SNAKE_HELPER.images[i]] = document.getElementById(SNAKE_HELPER.images[i])
	}

	snake.canvas = document.getElementById('snake_canvas')
	snake.canvas_ctx = document.getElementById('snake_canvas').getContext('2d')
}

function getNewSnakePosition(p, m) {
	let s = snake.size
	for (var [i, ii] of Object.entries(Object.keys(m))) {
		if (m[ii] != 0) {
			let mx = Math.floor((s[i] - Math.max(0,-m[ii]))/2) * m[ii]
			p[ii] = (p[ii] + m[ii] + mx) % (s[i] * m[ii]) - mx
		}
	}
	return p
}

function feedSomething(obj,target) {
	switch (obj.type) {
		case 'apple':
			player.ouro.apple = player.ouro.apple.add(tmp.ouro.apple_gain.mul(Decimal.pow(3, obj.tier-1)))
			if (snake.len < 10) snake.len++
		break;
		case 'berry':
			player.ouro.berry = player.ouro.berry.add(tmp.ouro.berry_gain)
		break;
		case 'powerup':
			onPowerup(obj.tier)
		break;
	}
}

function appleGain() {
	let x = Decimal.max(1,snake.len-5)
	if (hasElement(68,1)) x = x.mul(muElemEff(68)[0])
	x = x.pow(escrowBoost('apple'))
	return x.round()
}

function berryGain() {
	let x = Decimal.max(1,snake.len-5)
	if (hasElement(68,1)) x = x.mul(muElemEff(68)[1])
	return x.round()
}

function appleEffects() {
	let a = player.ouro.apple, eff = {}, evo = OURO.evolution

	eff.mass = expMult(a.add(1),a.add(1).log10().add(1))
	if (player.rp.unl) eff.cp = a.add(1).pow(hasElement(75,1)?.6:.5)
	if (player.dark.unl) eff.dark = a.add(1).pow(.5)
	if (tmp.darkRunUnlocked) eff.glyph = a.add(1).log10().add(1).root(2)

	if (evo >= 2) {
		if (player.bh.unl) {
			eff.cp_lvl = a.add(1).pow(.1)
			eff.fabric = a.add(1).pow(.2)
			eff.wh_loss = Decimal.pow(.99,a.add(1).log10().overflow(2,0.5))
		}
	}

	return eff
}

function appleEffect(id,def=1) { return tmp.ouro.apple_eff[id] ?? def }