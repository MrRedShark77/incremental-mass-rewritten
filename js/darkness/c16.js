const CHARGERS = [
    {
        get req() { return E(EVO.amt >= 1 ? 1e65 : 1e90) },
        cost: E(3),
        desc: `Multiply all matters gain by 1e10, and square mass of black hole gain.`,
    },{
        req: E('e1000'),
        cost: E(1000),
        get desc() { return EVO.amt >= 2 ? `Unlock Anti-Wormhole.<br><b class='saved_text'>[ Evolved Exotic ]</b>` : `Unlock the Unstable Black Hole that boosts normal black hole. (in black hole tab)` },
    },{
        req: E('e4500'),
        cost: E(15000),
        get desc() { return EVO.amt >= 2 ? `Anti-Wormhole boosts Corrupted Shards before logarithmic boost.` : `Unstable Black Hole's effect is 50% stronger. (after overflow)` },
    },{
        req: E('e30000'),
        cost: E(1e7),
        desc: `Remove all pre-Meta scalings from Supernova. [Neut-Muon]'s effect is now changed. Denullify C5's effect, but it's changed.`,
    },{
        req: E('e33000'),
        get cost() { return E(EVO.amt >= 4 ? 5e6 : EVO.amt >= 2 ? 2e7 : 5e8) },
        desc: `Dark Shadow's first reward is overpowered. Remove all scalings from Tickspeed, but nullify [Tau]'s effect.`,
    },{
        req: E('e77000'),
        get cost() { return [E(5e10), E(5e10), E(5e7), E(1e14), E(5e9)][EVO.amt] },
        get desc() { return EVO.amt >= 3 ? `Unlock Exotic Protostars.<br><b class='saved_text'>[ Evolved Exotic ]</b>` : `Unlock Exotic Atoms in Atom tab, and unlock new elements' layer.` },
    },{
        req: E('ee6'),
        get cost() { return E(EVO.amt >= 4 ? 1e7 : EVO.amt >= 2 ? 3e10 : 1e26) },
        get desc() { return EVO.amt >= 2 ? `Corrupted Shards formula is better. Corrupted Shards boost Anti-Wormhole.` : `Remove all scalings from BHC. [Neut-Tau]'s effect no longer affects BHC's cheapness. In C16, BHC is 1,000,000x cheaper.` },
    },{
        req: E('e1.6e6'),
        get cost() { return E(EVO.amt >= 2 ? 2e17 : 5e30) },
        get desc() { return EVO.amt >= 2 ? `Muon-Catalyzed Fusion Tier weakens Mass Upgrade scalings. In C16, this weakens Extreme Scaling too.` : `Remove all scalings from Cosmic Ray. [Neut-Tau]'s effect now re-affects BHC's cheapness, but its effect is MASSIVELY weaker.` },
    },{
        req: E('e3.9e9'),
        cost: E(1e270),
        desc: `Remove all scalings from Tetr. However, Hybridized Uran-Astatine's first effect no longer affects it. Tetr is 500x cheaper in C16.`,
    },{
        req: E('e4e10'),
        cost: E('e400'),
        desc: `De-corrupt 40th, 64th, 67th, 150th, 199th, 200th, and 204th elements.`, // 40,64,67,150,199,200,204
    },
]

const UNSTABLE_BH = {
    gain() {
        let x = BUILDINGS.eff('fvm')

        let ea=exoticAEff(1,0)

        if (Array.isArray(ea)) x = x.mul(ea[0])
        else                   x = x.mul(ea)

        x = x.pow(getFragmentEffect('bh'))
        if (hasElement(39,1)) x = x.pow(ea[1])

        return x
    },
    getProduction(x,gain) {
        return E(10).pow(x.max(0).root(tmp.unstable_bh.p.mul(2))).add(gain).log10().pow(tmp.unstable_bh.p.mul(2))
    },
    calcProduction() {
        let bh = player.bh.unstable

        return this.getProduction(bh,tmp.unstable_bh.gain.mul(tmp.preInfGlobalSpeed)).sub(bh)
    },
    effect() {
        let x = player.bh.unstable.add(1)
        if (tmp.c16.in) x = x.root(3)
        if (!hasAscension(0,3)) x = overflow(x,10,0.5)

        x = x.pow(theoremEff('bh',4))
        if (hasCharger(2)) x = x.pow(1.5)
        if (hasElement(57,1) && !tmp.c16.in) x = x.pow(10)

        return x
    },
}

function startC16() {
    if (player.chal.active == 16 && !player.options.auto_retry) CHALS.exit()
    else {
        CHALS.exit()
        CHALS.enter(16)
    }
}

function canCharge(i) { return EVO.amt >= 2 ? !EVO.isFed("ch"+i) : !tmp.c16.in && player.dark.c16.bestBH.gte(CHARGERS[i].req) }
function hasCharger(i) { return player.dark.c16.charger.includes(i) }
function buyCharger(i) {
    if (hasCharger(i)) return;
    if (!canCharge(i)) return;

    let c = CHARGERS[i], cost = c.cost
    if (player.dark.c16.shard.gte(cost)) {
        player.dark.c16.shard = player.dark.c16.shard.sub(cost).max(0)
        player.dark.c16.charger.push(i)
		if (i === [-1,-1,2,5].includes(EVO.amt) && !tmp.inf_unl) playSavedAnimation()

        updateC16HTML()
    }
}

function setupC16HTML() {
    let table = new Element('chargers_table')
    let h = ``

    for (let i in CHARGERS) {
        let c = CHARGERS[i]

        h += `
        <button onclick="buyCharger(${i})" class="btn full charger" id="charger${i}_div" style="font-size: 12px;">
            <div id="charger${i}_req"></div>
            <div id="charger${i}_desc" style="min-height: 80px"></div>
            <div id="charger${i}_cost"></div>
        </button>
        `
    }

    table.setHTML(h)
}

function corruptedShardGain() {
	let x
	if (EVO.amt >= 2) {
		let e = 25, dil = 3
		if (hasElement(223) && EVO.amt >= 3) e -= 5
		if (hasCharger(6)) e -= 5
		if (EVO.amt >= 4) e *= 2, dil = 2

		x = expMult((hasElement(232) ? player.dark.c16.bestBH : WORMHOLE.total()).add(1).root(e), dil)
		if (hasCharger(2)) {
			let y = player.evo.wh.mass[6].div(5e3).pow(2).max(1)
			if (EVO.amt >= 4) y = y.log10().add(1)
			if (EVO.amt >= 3) y = expMult(y, 0.5)
			x = x.mul(y)
		}
		x = x.mul(x.log10().mul(2).add(1).pow(2))
		if (hasPrestige(3,4)) x = x.mul(prestigeEff(3,4))
		x = x.mul(exoticAEff(0,0))
        x = x.pow(nebulaEff('purple'))
	} else {
		let bh = player.bh.mass, req = EVO.amt >= 1 ? 1e65 : 1e90
		if (hasElement(232)) bh = player.dark.c16.bestBH.max(req)
		else if (!tmp.c16.in || bh.lt(req)) return E(0)

		let w = 1
		if (hasUpgrade('br',25)) w *= 0.8

		x = bh.max(1).log10()
		x = E(10).pow(x.overflow(1e70,(1/3)**w).overflow(1e9,0.5**w).div(Math.log10(req)).root(hasElement(223) ? 2.9 : 3).sub(1))
		if (hasPrestige(3,4)) x = x.mul(prestigeEff(3,4))
		x = x.mul(exoticAEff(0,0))
		x = x.overflow('ee12',0.25)
	}
	x = x.mul(x.add(1).log10().add(1).pow(2)).pow(CSEffect('c16_exp'))

    return x.floor()
}

function updateC16Temp() {
	tmp.c16.best_bh_eff = EVO.amt >= 2 ? expMult(player.dark.c16.bestBH.root(2), 2/3) : player.dark.c16.bestBH.add(1).log10()
    tmp.c16.shardGain = corruptedShardGain()
}

function updateC16HTML() {
    let evo2 = EVO.amt >= 2, c16 = tmp.c16.in
    let bh = player.dark.c16.bestBH, cs = player.dark.c16.shard
    tmp.el.bestBH.setHTML(formatMass(player.dark.c16.bestBH))
    tmp.el.c16_info.setDisplay(!evo2)

    let e = hasInfUpgrade(15)?12:8
    for (let i in CHARGERS) {
        i = parseInt(i)
        let c = CHARGERS[i], id = 'charger'+i
        tmp.el[id+"_div"].setDisplay(i<e)
        if (i>=e) continue;

        let req = canCharge(i), has = hasCharger(i)

        tmp.el[id+"_req"].setHTML(EVO.fed_msg[tmp.ouro.fed["ch"+i]] ?? `Req: <b>${formatMass(c.req)}</b> of black hole.`)
        tmp.el[id+"_cost"].setHTML(`Cost: <b>${c.cost.format(0)}</b> Corrupted Shard`)

        tmp.el[id+"_req"].setDisplay(!req)
        tmp.el[id+"_desc"].setDisplay(req)
        tmp.el[id+"_desc"].setHTML(c.desc)
        tmp.el[id+"_cost"].setDisplay(req && !has)

        tmp.el[id+"_div"].setClasses({btn: true, full: true, charger: true, bought: has, locked: !has && (!req || cs.lt(c.cost))})
    }
}

const CORRUPTED_ELEMENTS = [40,64,67,150,162,187,199,200,204,305]

let C16_ANI = {
	squares: [],
	last: 0,
	time: 0,
	get on() { return tmp.c16.in && !CHALS.inChal(20) }
}

function drawC16() {
	let now = Date.now(), dt = now - C16_ANI.last
	let c16c = C16_ANI

	c16c.last = now
	if (dt >= 10000) return
	dt /= 1e3

	c16c.time += dt
	if (c16c.on && c16c.time && c16c.squares.length < 50) {
		c16c.squares.push({ x: -10, y: Math.random() * 100, size: Math.randomInt(10, 20), color: Math.randomInt(0,3), speed: Math.randomInt(10, 40) })
		c16c.time = c16c.time % 1
	}

	if (!c16c.squares.length) return
	if (!c16c.ctx) {
		c16c.canvas = document.getElementById('c16_ctx')
		c16c.ctx = c16c.canvas.getContext('2d')
		resizeCanvas()
	}
	c16c.ctx.clearRect(0, 0, c16c.canvas.width, c16c.canvas.height)

	let new_sq = []
	for (let sq of c16c.squares) {
		if (!c16c.on) {
			sq.speed += dt * 50
			sq.size -= dt * 5
		}
		sq.x += dt * sq.speed
		if (sq.x > 110) continue
		let sqx = sq.x / 100 * c16c.canvas.width, sqy = sq.y / 100 * c16c.canvas.height
		c16c.ctx.fillStyle = ["black", "#d33", "#33d"][sq.color]
		c16c.ctx.fillRect(sqx, sqy, sq.size, sq.size)
		new_sq.push(sq)
	}
	c16c.squares = new_sq
}