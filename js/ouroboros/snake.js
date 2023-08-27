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
		auto: 0,
		cam_pos: {x: 320, y: 240},

		snakes: [{
			bodies: [
				[{x: 0, y: -1},'0h'],
				[{x: 0, y: 0},'00'],
				[{x: 0, y: 1},'00'],
				[{x: 0, y: 2},'00'],
				[{x: 0, y: 3},'0t'],
			],
			len: 5,
			move: 0,
			moves: 0
		}],
		max_apples: 10,
		apples: [],
		new_apples: [],
	
		size: [16, 10],
		images: {},

		move: 0,
		boom: {},
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
		'0h': 12, '1h': 10, '2h': 13, '3h': 11, // Head
		'0t': 17, '1t': 15, '2t': 16, '3t': 14, // Tail
		'00': 3,  '22': 3,  '11': 2,  '33': 2,  // Line
		'32': 5,  '01': 5,  '23': 0,  '10': 0,  // Curve
		'12': 4,  '03': 4,  '30': 1,  '21': 1,
	},
	objectIDs: {
		'strawberry': 30,
		'aim': 40,
		'combo': 41,
		'adjoin': 42,
		'frenzy': 43,
		'purify': 44,
	},
	appleTiers: 10,
}

const TIMED_POWERUPS = ["aim", "combo", "frenzy", "purify"]
function onPowerup(i) {
	if (TIMED_POWERUPS.includes(i)) {
		snake.powerup = i
		snake.powerup_time = hasElement(81, 1) ? 30 : 15
	}
	switch (i) {
		case 'adjoin':
			for (let x of snake.apples) {
				if (Math.random() < 0.5 - 0.1 * x.tier) continue
				if (x.type == "powerup") continue
				let n = getNewSnakePosition({...x}, SNAKE_HELPER.movement[Math.randomInt(0, 4)])
				if (isSnakeOccupied(n)) break
				snake.new_apples.push(n)
			}
			break;
		case 'frenzy':
			if (Math.random() < 0.5) boomSnake(true)
			break;
	}
}

function calcSnake(dt) {
	snake.time += dt
	snake.auto += dt
	if (OURO.evo >= 2) player.ouro.energy = Math.min(player.ouro.energy + dt / 5, 500)
	if (snake.time >= SNAKE_HELPER.speed[player.options.snake_speed]) {
		snake.time = 0
		snakeStep()
	}
	if (snake.powerup_time > 0) {
		snake.powerup_time = Math.max(snake.powerup_time-dt,0)
		if (snake.powerup_time <= 0) snake.powerup = null
	}
}

function snakeMove(s, you) {
	// Movement
	let gs = snake
	if (you) s.move = snake.move
	else if (s.moves == 0) s.move = Math.randomInt(0,3)

	let head_move = {...s.bodies[0][0]}
	let m = SNAKE_HELPER.movement[s.move], p = you ? gs.powerup : ""
	if (s.paralyzed > 0) s.paralyzed--
	else getNewSnakePosition(head_move, m)

	// Apple Feeding
	let keep = []
	gs.apples.forEach((x,w) => {
		let special = x.type == "powerup" || x.tier >= 4
		let aim_range = p == "aim" && !special ? 2 : 0
		if (Math.abs(x.x - head_move.x) + Math.abs(x.y - head_move.y) <= aim_range && (you || !special)) {
			feedSomething(x,w,you)
			feedSomethingOnSnake(s,you)
		} else keep.push(x)
	})

	// Enemy Killing
	if (you) gs.snakes.forEach((se, i) => {
		if (i == 0) return

		let spliced = false
		se.bodies.forEach((bd, i2) => {
			if (Math.abs(head_move.x - bd[0].x) + Math.abs(head_move.y - bd[0].y) <= (p == "aim" ? 2 : 0)) spliced = true
		})
		if (spliced) {
			for (let bd of se.bodies) gs.new_apples.push({
				x: bd[0].x,
				y: bd[0].y,
				type: "apple",
				tier: rollAppleTier(Math.max(1, s.len - 4))
			})
			gs.snakes.splice(i, 1)
		}
	})
	gs.apples = keep.concat(gs.new_apples).splice(0,30)
	gs.new_apples = []

	// Snake Move
	let move_max = you ? calcMaxMoves() : hasElement(87,1) ? 8 : 6
	s.moves++
	if (s.moves >= move_max) {
		s.moves = 0
		s.len = Math.max(s.len - 1, you ? 5 : 2)
		if (you) gs.move_max = calcMaxMoves()
	}

	// Please fix the rendering issue.
	let op = s.bodies[0][1]
	s.bodies = [[head_move]].concat(s.bodies).splice(0, s.len)
	s.bodies[0][1] = s.move + "h"
	if (s.bodies.length > 1) s.bodies[1][1] = s.move + op[0]
	if (s.bodies.length == s.len) s.bodies[s.len-1][1] = s.bodies[s.len-1][1][0] + "t"
}

function snakeStep() {
	// Snakes
	let s = snake
	if (Math.random() < 0.1 && OURO.evo >= 3 && s.snakes.length < 3) {
		let even = Math.random() > 0.5
		s.snakes.push({
			bodies: [[{ x: even ? -8 : 7, y: 0 }, "1h"]],
			moves: 1,
			move: even ? 1 : 3,
			len: 2
		})
	}

	s.move_max = calcMaxMoves()
	for (var i = s.snakes.length - 1; i >= 0; i--) snakeMove(s.snakes[i], i == 0)

	// Occupation [ Snakes only ]
	s.occupy = []
	for (var sn of s.snakes) {
		for (var bd of sn.bodies) {
			s.occupy.push({ x: bd[0].x, y: bd[0].y })
		}
	}

	// Boom
	if (s.boom.range != undefined) s.boom.range++

	let keep = []
	s.snakes.forEach((se, i) => {
		if (i == 0) return
		if (Math.max(se.bodies[0][0].x - s.boom.x) + Math.abs(se.bodies[0][0].y - s.boom.y) == s.boom.range) se.paralyzed = 30
	})
	s.apples.forEach((x,w) => {
		let special = x.type == "powerup" || x.tier >= 4
		if (Math.abs(x.x - s.boom.x) + Math.abs(x.y - s.boom.y) == s.boom.range && !special) feedSomething(x,w,true)
		else keep.push(x)
	})
	s.apples = keep

	// Apple Spawn
	let max_apples = 8
	if (s.powerup == "frenzy") max_apples += 4
	if (hasElement(79, 1) && s.powerup != "aim") max_apples += 4
	if (s.apples.length < max_apples) spawnApples()

	// Auto-Moving
	if (s.auto >= 5) {
		let head = s.snakes[0].bodies[0][0]
		s.apples.forEach((x,w) => {
			if (x.x == head.x && x.y < head.y) s.move = 0
			if (x.x > head.x && x.y == head.y) s.move = 1
			if (x.x == head.x && x.y > head.y) s.move = 2
			if (x.x < head.x && x.y == head.y) s.move = 3
		})
	}
}

function isSnakeOccupied(p) {
	return snake.occupy.concat(snake.apples).concat(snake.new_apples).findIndex(x => x.x == p.x && x.y == p.y) != -1
}

function spawnApples() {
	var len = Math.min(Math.max(Math.log10(1 / Math.random()) * (snake.powerup == "combo" ? 2 : 1) + 1, 1), 4)
	var origin
	var s = snake.size
	while (!origin) {
		let rp = { x: Math.randomInt(0,s[0])-Math.floor(s[0]/2), y: Math.randomInt(0,s[1])-Math.floor(s[1]/2) }
		if (!isSnakeOccupied(rp)) origin = rp
	}

	let berry = Math.random() < 1/3, luck = 1 / Math.random(), rot = Math.randomInt(0,4)
	for (var i = 1; i <= len; i++) {
		let type = "apple", tier
		if (OURO.evo >= 2 && Math.random() < (hasElement(81, 1) ? 1/25 : 1/50)) {
			let POWERUPS = ["aim", "combo", "adjoin", "frenzy", "purify"]
			let powerup = POWERUPS[Math.randomInt(0, POWERUPS.length)]
			type = "powerup"
			tier = powerup
		} else if (berry && type != "powerup") type = "berry"
		else tier = rollAppleTier(luck) //Elund - Green Apples

		snake.apples.push({...origin, type, tier})
		getNewSnakePosition(origin, SNAKE_HELPER.movement[rot])
		if (isSnakeOccupied(origin)) break
	}
}

function rollAppleTier(luck = 1) {
	let r = E(Math.random()).div(luck).log(1/10).max(0).add(1).floor()
	return Math.min(r.toNumber(), OURO.evo >= 2 ? 3 + OURO.evo : 2)
}

function drawSnake() {
	let ctx = snake.canvas_ctx
	ctx.clearRect(0,0,640,480)

	for (let a of snake.apples) {
		let x = a.x * 32 + snake.cam_pos.x, y = a.y * 32 + snake.cam_pos.y, tx
		switch (a.type) {
			case 'apple':
				tx = 20+a.tier-1
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
		ctx.drawImage(snake.images.snake_texture,tx%10*32,Math.floor(tx/10)*32,32,32,0,0,32,32)
		ctx.restore()
	}

	let you = snake.snakes[0], head = you.bodies[0][0]
	for (let sn of snake.snakes) {
		for (let i = sn.len - 1; i >= 0; i--) {
			let b = sn.bodies[i]
			if (!b) continue
			
			let x = b[0].x * 32 + snake.cam_pos.x, y = b[0].y * 32 + snake.cam_pos.y
			let tx = SNAKE_HELPER.connectToTextureID[b[1]]
			if (tx != 7) {
				ctx.save()
				ctx.translate(x - 16, y - 16)
				ctx.drawImage(snake.images.snake_texture,tx%10*32,Math.floor(tx/10)*32,32,32,0,0,32,32)
				ctx.restore()
			}
		}
	}

	let s = snake.size
	ctx.strokeStyle = "white";
	ctx.lineWidth = 4;
	ctx.strokeRect(snake.cam_pos.x - Math.floor(s[0]/2) * 32 - 16, snake.cam_pos.y - Math.floor(s[1]/2) * 32 - 16, s[0] * 32, s[1] * 32)

	if (snake.boom.range > 0 && snake.boom.range < 20) drawDiamond("red", snake.boom)
	if (snake.powerup == "aim") drawDiamond("green", {...head, range: 2})

	if (snake.images.arrow_image) {
		let am = SNAKE_HELPER.arrow_movement[snake.move]

		ctx.save()
		ctx.translate((head.x + am.x) * 32 - 16 + snake.cam_pos.x, (head.y + am.y) * 32 - 16 + snake.cam_pos.y);
		ctx.rotate(Math.PI * snake.move / 2);
		ctx.drawImage(snake.images.arrow_image,0,0)
		ctx.restore()
	}
}

function drawDiamond(clr, data) {
	let ctx = snake.canvas_ctx
	ctx.strokeStyle = clr;
	ctx.beginPath()
	ctx.moveTo(snake.cam_pos.x + data.x * 32, snake.cam_pos.y + (data.y + data.range) * 32)
	ctx.lineTo(snake.cam_pos.x + (data.x + data.range) * 32, snake.cam_pos.y + data.y * 32)
	ctx.lineTo(snake.cam_pos.x + data.x * 32, snake.cam_pos.y + (data.y - data.range) * 32)
	ctx.lineTo(snake.cam_pos.x + (data.x - data.range) * 32, snake.cam_pos.y + data.y * 32)
	ctx.lineTo(snake.cam_pos.x + data.x * 32, snake.cam_pos.y + (data.y + data.range) * 32)
	ctx.stroke()
}

function setupSnake() {
	for (let i in SNAKE_HELPER.images) snake.images[SNAKE_HELPER.images[i]] = document.getElementById(SNAKE_HELPER.images[i])
	snake.canvas = document.getElementById('snake_canvas')
	snake.canvas_ctx = document.getElementById('snake_canvas').getContext('2d')
}

function recordMovement(i) {
	snake.move = i
	snake.auto = 0
}

function boomSnake(auto, head) {
	if (!auto) {
		if (player.ouro.energy < 200) return
		player.ouro.energy -= 200
	}

	if (head === undefined) head = snake.snakes[0].bodies[0][0]
	snake.boom = {
		x: head.x,
		y: head.y,
		range: -1
	}
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

function calcMaxMoves() {
	let r = snake.snakes[0].len == 5 ? 1/0 : 20 - snake.snakes[0].len
	if (hasElement(82,1)) r += 5
	if (snake.powerup == "combo") r *= 1.5
	return Math.round(r)
}

function feedSomethingOnSnake(s, you) {
	s.len = Math.min(s.len + 1, 10)
	s.moves = -1
	if (you) {
		snake.auto = 0
		if (OURO.evo >= 2) player.ouro.energy = Math.min(player.ouro.energy + Math.max(1, s.len - 7) * (snake.powerup == "frenzy" ? 2 : 1), 500)
	}
}

function feedSomething(obj,target,you) {
	if (!you) return
	switch (obj.type) {
		case 'apple':
			player.ouro.apple = player.ouro.apple.add(tmp.ouro.apple_gain.mul(Decimal.pow(3, obj.tier-1)))
		break;
		case 'berry':
			player.ouro.berry = player.ouro.berry.add(tmp.ouro.berry_gain)
		break;
		case 'powerup':
			onPowerup(obj.tier)
		break;
	}
	if (snake.powerup == "purify") {
		for (let x of snake.apples) {
			if (x.type != "apple") continue
			x.tier = Math.max(x.tier, rollAppleTier(hasElement(83,1) ? Math.max(1, snake.snakes[0].len - 4) : 1))
		}
	}
}

function appleGain() {
	let x = Decimal.max(1,snake.snakes[0].len-5)
	if (hasElement(82,1)) x = x.pow(2)
	if (hasElement(68,1)) x = x.mul(muElemEff(68)[0])
	if (hasElement(71,1)) x = x.mul(2)
	if (OURO.evo >= 2 && hasElement(59)) x = x.mul(10)

	x = x.pow(escrowBoost('apple'))
	if (hasElement(89,1)) x = x.pow(1.1)
	return x.round()
}

function berryGain() {
	let x = E(300).pow(OURO.evo - 1)
	if (hasElement(68,1)) x = x.mul(muElemEff(68)[1])
	if (hasElement(71,1)) x = x.mul(2)
	return x.round()
}

function appleEffects() {
	let a = player.ouro.apple, eff = {}, evo = OURO.evo

	eff.mass = [expMult(a.div(10).add(1), a.div(100).add(1).log10().add(1)), a.div(1e8).add(1).pow(2)]
	eff.cp = a.div(10).add(1).pow(hasElement(90,1)?.8:hasElement(76,1)?.6:.5)
	if (player.atom.unl) eff.cp_lvl = a.add(1).pow(.1)

	if (evo >= 2 && player.bh.unl) {
		eff.fabric = a.div(100).add(1).pow(1/3)
		eff.wh_loss = a.add(1).log10().add(1).pow(.2)
	}
	if (evo >= 3 && player.atom.unl) {
		eff.ps = a.div(1e3).add(1).pow(1/4)
		eff.ps_dim = a.div(1e3).add(1).pow(-1/6)
	}
	if (evo <= 6 && player.dark.unl) {
		eff.dark = a.div(1e6).add(1).cbrt()
		eff.glyph = a.div(1e4).add(1).log10().add(1).root(2)
	}

	return eff
}

function appleEffect(id,def=1) { return tmp.ouro.apple_eff[id] ?? def }