const WORMHOLE = {
    step(x,t,i) {
        if (i != player.evo.wh.origin && x.eq(0)) return E(0)

        let p = tmp.evo.wh.power, pp = Decimal.mul(2,p)
        if (CHALS.inChal(8)) pp = pp.div(2)

        x = Decimal.pow(p.add(1.5), x.root(pp)).root(pp).add(t).pow(pp).log(p.add(1.5)).pow(pp)
        return isNaN(x.mag) ? E(0) : x.max(0)
    },
    calcGain(x,dt) {
        return this.step(x,dt).sub(x)
    },
    calc(dt) {
        const evo = EVO.amt, unls = tmp.evo.wh.unls, mass = player.evo.wh.mass
        if (player.qu.en.hr[0]) player.evo.wh.fabric = player.evo.wh.fabric.div(E(10).pow(dt).pow(player.qu.en.hr[3]))
        else if (tmp.passive >= 2) player.evo.wh.fabric = player.evo.wh.fabric.add(tmp.bh.dm_gain.mul(dt))

        if (FORMS.bh.unl()) {
            for (let i = 0; i < Math.min(unls, player.evo.wh.origin == 6 ? 7 : 6); i++) mass[i] = WORMHOLE.step(mass[i],tmp.evo.wh.mult[i].mul(dt),i)
        }
    },
    mult(i) {
        let r = E(1)
		r = player.evo.wh.fabric.add(1)
		r = r.mul(player.evo.wh.mass[i].add(10).log10().pow(2))

		if (hasElement(125)) r = expMult(r, 1.1)
		if (hasElement(158)) r = expMult(r, 1.05)

		if (hasTree("bh1")) r = r.pow(treeEff("bh1"))
		if (tmp.sn.boson) r = r.pow(tmp.sn.boson.upgs.photon[5].effect)
		r = r.pow(glyphUpgEff(2)).pow(wormholeEffect(6))

        let ne = nebulaEff("cyan")
        r = expMult(r.pow(ne[0]??1),ne[1]??1)

		if (i == 6) {
			r = r.add(1).log10()
			r = r.mul(player.evo.wh.mass[6].add(10).log10())
            if (hasCharger(6)) r = r.mul(player.dark.c16.shard.max(1).log10().div(2).max(1))
		}

        return r
    },
    total() {
        let r = E(0)
        if (EVO.amt >= 2) for (let m of player.evo.wh.mass) r = r.add(m)
        return r
    },
    temp() {
        const unls = this.unlLength
        tmp.evo.wh.unls = unls

        let p = appleEffect('wh_loss', E(1))
        if (hasElement(63)) p = p.mul(1.2)
        tmp.evo.wh.power = p

		tmp.evo.wh.mult = []
        for (let [i,e] of Object.entries(this.effects)) {
            tmp.evo.wh.eff[i] = e[0](i < unls ? player.evo.wh.mass[i] : E(1))
            tmp.evo.wh.mult[i] = this.mult(i)
        }
    },
    html() {
        const unls = tmp.evo.wh.unls, wh = player.evo.wh, mass = wh.mass

        for (let i = 0; i < WORMHOLE.maxLength; i++) {
            let unl = i < unls, id = 'wormhole'+i

            tmp.el[id+'-div'].setDisplay(unl)
            if (unl) {
                if (WORMHOLE.choose_origin) {
                    tmp.el[id+'-div'].setClasses({ ["wormhole-div"]: true, none: i != wh.origin })
                    tmp.el[id+'-id'].setHTML("")
                    tmp.el[id+'-effect'].setHTML("")
                    tmp.el[id+'-mult'].setHTML(wh.origin == i ? "[Origin]" : "")
                    tmp.el[id+'-mass'].setHTML("#" + (i+1))
                } else {
                    const m = mass[i], mult = tmp.evo.wh.mult[i]
                    tmp.el[id+'-div'].setClasses({ ["wormhole-div"]: true, anti: i == 6, none: m.eq(0) && i < 6, auto: wh.auto[i] })
                    tmp.el[id+'-id'].setHTML(i == 6 ? `` : `#${i+1} - Click to ${i != wh.origin ? (this.canAuto(i) ? "toggle automation" : "merge with #" + (wh.origin + 1)) : "split"}`)
                    tmp.el[id+'-mult'].setHTML(formatMult(tmp.evo.wh.mult[i]))
                    tmp.el[id+'-effect'].setHTML(this.effects[i][1](tmp.evo.wh.eff[i]))

                    let h = ``
                    if (i < 6) h = `${formatMass(m)}<br>${m.formatGain(this.calcGain(m,mult.div(FPS),i).mul(FPS),1)}`
                    else h = `<b class='saved_text'>${formatMass(m)} anti-mass</b>`
                    tmp.el[id+'-mass'].setHTML(h)
                }
            }
        }

        tmp.el["wormhole_origin"].setDisplay(player.atom.unl || EVO.amt >= 3)
        tmp.el["wormhole_rate_div"].setDisplay(tmp.sn.unl || EVO.amt >= 3)
        tmp.el["wormhole_rate"].setHTML(formatPercent(wh.rate, 0))
    },

    get unlLength() {
        if (hasCharger(1)) return 7
        if (player.dark.unl) return 6
        if (quUnl() || player.evo.cosmo.unl) return 5
        if (tmp.sn.boson) return 4
        if (player.atom.unl) return 3
        return 2
    },
    maxLength: 7,

    effects: [
        [
            m => {
                m = hasUpgrade("atom", 12) ? m.add(1).pow(.3) : m.add(1).log10().add(1).pow(2)
                return m.min(Number.MAX_VALUE)
            },
            x => `Boost meditation levels by <b>${formatMult(x,2)}</b>.`,
        ],[
            m => hasElement(133) ? m.div(1e15).add(1).root(5) : m.add(1).root(5),
            x => `Boost ${hasElement(133) ? "Stronger" : "Booster"}'s power by <b>${formatMult(x,2)}</b>`,
        ],[
            m => m.add(1).root(hasUpgrade("atom", 12) ? 5 : 10),
            x => `Gain more Calm Power. <b>${formatMult(x,2)}</b>`,
        ],[
            m => m.add(1).log10().div(5).add(1).pow(hasElement(150) ? -.2 : hasElement(125) ? -.15 : -.1),
            x => `Reduce Meditation's softcap weakness <b>${formatReduction(x)}</b>`,
        ],[
            m => E(1).sub(m.add(1).log10().div(hasElement(player.qu.rip.active ? 149 : 133) ? 40 : 50).add(1).pow(-.4)).mul(1.1).toNumber(),
            x => `Raise Fabric. <b>+^${format(x,2)}</b>`,
        ],[
            m => m.add(1).log10().div(40).add(1).sqrt().softcap(3,0.5,0),
            x => `Raise meditation levels. <b>^${format(x,2)}</b>`+softcapHTML(x,3),
        ],[
            m => {
                m = m.mul(tmp.c16.in && EVO.amt < 4 ? 1e-3 : 1e-4).pow(tmp.c16.in || EVO.amt >= 4 ? .5 : 1).add(1)
                if (EVO.amt == 3) m = expMult(m,0.5)
                return m
            },
            x => `Raise Wormhole formula. <b>^${format(x,2)}</b>`,
        ],
    ],

    get autoUnl() { return hasElement(80, 1) },
    canAuto(i) {
		let o = player.evo.wh.origin
        return this.autoUnl && i != 6 && o != i && (o == 6 || player.evo.wh.mass[i].eq(0) || player.evo.wh.auto[i])
    },
}

function wormholeEffect(id,def=E(1)) { return id<tmp.evo.wh.unls && tmp.evo.wh.eff[id] ? tmp.evo.wh.eff[id] : def }

function activateWormhole(id, auto) {
    const wh = player.evo.wh, mass = wh.mass
    if (!auto && WORMHOLE.choose_origin) {
        wh.origin = id
        wh.auto[id] = false
        WORMHOLE.choose_origin = false
        return
    } else if (!auto && WORMHOLE.canAuto(id)) {
        wh.auto[id] = !wh.auto[id]
    } else if (id != 6 && wh.origin != 6) {
		if (id == wh.origin) {
			if (CHALS.inChal(6)) return
			splitWormhole(wh.origin, auto ? "auto" : "")
		} else {
			let toAdd = mass[id].mul(auto ? 1 : wh.rate)
			mass[wh.origin] = mass[wh.origin].add(toAdd)
			mass[id] = mass[id].sub(toAdd)
		}
	}
}

function splitWormhole(origin, mode) {
    let wh = player.evo.wh, mass = wh.mass
    let split = []
    for (let x = 0; x < 6; x++) if (x != origin && (mode != "auto" || wh.auto[x])) split.push(x)

    let sum = E(0), toAdd = mass[origin].mul(.4/split.length)
    for (let x of split) {
        sum = sum.add(toAdd.sub(mass[x]).max(0))
        mass[x] = mass[x].max(toAdd);
    }
    mass[origin] = mass[origin].sub(sum)
    if (tmp.evo.wh.unls > 6 && tmp.c16.in) mass[6] = mass[6].add(sum.add(1).log10().mul(tmp.evo.wh.mult[6]))
}

function setupWormholeHTML() {
    let h = ''
    for (let i = 0; i < WORMHOLE.maxLength; i++) {
        h += `<div class='wormhole-div' id='wormhole${i}-div' onclick="activateWormhole(${i})">
            <div id='wormhole${i}-id' class='wh-id'></div>
            <div id='wormhole${i}-mult' class='wh-mult'>A</div>
            <div id='wormhole${i}-mass' class='wh-mass'>B</div>
            <div id='wormhole${i}-effect' class='wh-effect'>C</div>
        </div>`
    }

    new Element('wormhole_table').setHTML(h)
}