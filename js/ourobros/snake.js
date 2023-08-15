Math.lerp = function (x0,x1,t) {
    return x0 + (x1 - x0) * Math.min(1, Math.max(0, t))
}

Math.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

var snake = {
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

    max_apples: 5,
    apples: [],

    size: [12, 8],
    move: 0,
    images: {},
}

const SNAKE_HELPER = {
    images: ['arrow_image','snake_texture'],
    movement: [{x: 0, y: -1},{x: 1, y: 0},{x: 0, y: 1},{x: -1, y: 0}],
    arrow_movement: [{x: 0, y: -1},{x: 2, y: 0},{x: 1, y: 2},{x: -1, y: 1}],
    connectToTextureID: {
        '0h': 10, '1h': 8,  '2h': 11, '3h': 9,  // Head

        '0t': 15, '1t': 13, '2t': 14, '3t': 12, // Tail

        '00': 3,  '22': 3,  '11': 2,  '33': 2,  // Line

        '10': 5,  '23': 5,  '01': 0,  '32': 0,  // Curve
        '21': 4,  '30': 4,  '03': 1,  '12': 1,
    },
}

function calcSnake(dt) {
    snake.time += dt

    if (snake.time >= 1/3) {
        snake.time = 0
        snakeStep()
    }

    snake.cam_pos.x = Math.lerp(snake.cam_pos.x, 320-snake.bodies[0][0].x * 32, 0.1);
    snake.cam_pos.y = Math.lerp(snake.cam_pos.y, 240-snake.bodies[0][0].y * 32, 0.1);
}

function snakeStep() {
    let s = snake.size, head_move = {}

    // Snake Move

    let m = SNAKE_HELPER.movement[snake.move]

    if (m.x != 0) {
        let mx = Math.floor((s[0] - Math.max(0,-m.x))/2) * m.x
        head_move.x = (snake.bodies[0][0].x + m.x + mx) % (s[0] * m.x) - mx
    } else head_move.x = snake.bodies[0][0].x
    if (m.y != 0) {
        let my = Math.floor((s[1] - Math.max(0,-m.y))/2) * m.y
        head_move.y = (snake.bodies[0][0].y + m.y + my) % (s[1] * m.y) - my
    } else head_move.y = snake.bodies[0][0].y

    let w = snake.apples.findIndex(x => x.x == head_move.x && x.y == head_move.y), w2 = w >= 0 && snake.bodies.length < 10 // Check if snake now feeds apple

    if (w >= 0) {
        feedSomething('apple',w)
    }

    if (w2) {
        let b0 = snake.bodies[0]
        let ns = [{x: b0[0].x, y: b0[0].y}, snake.bodies[1][1][1].repeat(2)] // make unique
        snake.bodies = [b0,ns,...snake.bodies.splice(1,snake.bodies.length-1)]
        b0[0] = head_move
    } else for (let i = snake.bodies.length-1; i >= 0; i--) {
        let b = snake.bodies[i]
        
        if (i == 0) {
            b[0] = head_move
        } else {
            let pb = snake.bodies[i-1]

            b[0].x = pb[0].x
            b[0].y = pb[0].y
        }
    }

    if (snake.bodies.length > 5) {
        snake.moves++

        if (snake.moves >= 15) {
            snake.moves = 0

            snake.bodies.pop()
        }
    }

    for (let i = 0; i < (w2 ? 2 : snake.bodies.length); i++) {
        let b = snake.bodies[i]
        if (i == 0) b[1] = snake.move + 'h'
        else {
            let pb = snake.bodies[i-1]
            if (i == snake.bodies.length-1) b[1] = pb[1][0] + 't'
            else b[1] = b[1][1] + pb[1][0]
        }
    }

    // Apple Spawn

    if (snake.apples.length < snake.max_apples) {
        let attempts = 0

        while (attempts < 100) {
            let rx = Math.randomInt(0,s[0])-Math.floor(s[0]/2), ry = Math.randomInt(0,s[1])-Math.floor(s[1]/2)

            if (snake.bodies.findIndex(x => x[0].x == rx && x[0].y == ry) == -1 && snake.apples.findIndex(x => x.x == rx && x.y == ry) == -1) {
                snake.apples.push({x: rx, y: ry});
                break
            }

            attempts++
        }
    }
}

function drawSnake() {
    let ctx = snake.canvas_ctx

    ctx.clearRect(0,0,640,480)

    ctx.font = "16px consolas";

    for (let i = 0; i < snake.apples.length; i++) {
        let a = snake.apples[i], x = a.x * 32 + snake.cam_pos.x, y = a.y * 32 + snake.cam_pos.y

        ctx.save()
        ctx.translate(x - 16, y - 16)
        ctx.drawImage(snake.images.snake_texture,64,32,32,32,0,0,32,32)
        ctx.restore()
    }

    for (let i = snake.bodies.length - 1; i >= 0; i--) {
        let b = snake.bodies[i], x = b[0].x * 32 + snake.cam_pos.x, y = b[0].y * 32 + snake.cam_pos.y

        let tx = SNAKE_HELPER.connectToTextureID[b[1]]

        if (tx != 7) {
            ctx.save()
            ctx.translate(x - 16, y - 16)
            ctx.drawImage(snake.images.snake_texture,tx%4*32,Math.floor(tx/4)*32,32,32,0,0,32,32)
            ctx.restore()
        }

        /*

        ctx.fillStyle = "limegreen";

        ctx.fillRect(x - 13, y - 13, 26, 26)

        ctx.fillStyle = "black";

        ctx.fillText(b[1], x - 11, y + 11)

        */
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

function feedSomething(obj,target) {
    switch (obj) {
        case 'apple':
            player.ouro.apple = player.ouro.apple.add(tmp.ouro.apple_gain)

            snake.moves = 0
            snake.apples.splice(target,1)
        break;
    }
}

function appleGain() {
    let x = Decimal.max(1,snake.bodies.length-5)

    if (hasElement(68,1)) x = x.mul(muElemEff(68))

    return x.round()
}

function appleEffects() {
    let a = player.ouro.apple, eff = {}

    eff.mass = expMult(a.add(1),a.add(1).log10().add(1))
    if (player.rp.unl) eff.cp = a.add(1).root(2)

    return eff
}

function appleEffect(id,def=1) { return tmp.ouro.apple_eff[id] ?? def }