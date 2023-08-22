const WORMHOLE = {
    step(i,m,dt) {
        let p = tmp.evo.wormhole_power, mul = tmp.evo.wormhole_mult[i], div = m.div(mul)
		if (div.gt(p)) div = E(2).pow(div.div(p).sub(1)).mul(p)
		let rev = div.add(dt)
		if (rev.gt(p)) rev = rev.div(p).log(2).add(1).mul(p)
		rev = rev.mul(mul)

		if (i > 0 && m.eq(0)) return E(0)
		if (isNaN(rev.mag)) return m
        return rev
    },
    calcGain(i) {
		let m = player.evo.wh.mass[i]
        return this.step(i,m,1).sub(m)
    },
    calc(dt) {
        const evo = OURO.evolution, unls = tmp.evo.wormhole_unls, mass = player.evo.wh.mass
        if (evo >= 2) if (player.mainUpg.atom.includes(6)) player.evo.wh.fabric = player.evo.wh.fabric.add(tmp.bh.dm_gain.mul(dt))

        for (let i = 0; i < unls; i++) mass[i] = WORMHOLE.step(i,mass[i],dt)
    },
    temp() {
        const unls = this.unlLength
        tmp.evo.wormhole_unls = unls
        tmp.evo.wormhole_power = Decimal.pow(2,appleEffect('wh_loss'))

        const mass = player.evo.wh.mass
        const fabric_mult = expMult(player.evo.wh.fabric.mul(10), 0.3).div(10)
        const wh_power = E(2)

        for (let [i,e] of Object.entries(this.effects)) {
            i = parseInt(i)
            let m = mass[i]
            tmp.evo.wormhole_eff[i] = e[0](i < unls ? m : E(1))
            tmp.evo.wormhole_mult[i] = fabric_mult.mul(m.add(10).log10())
        }
    },
    html() {
        const unls = tmp.evo.wormhole_unls, mass = player.evo.wh.mass

        for (let i = 0; i < WORMHOLE.maxLength; i++) {
            let unl = i < unls, id = 'wormhole'+i

            tmp.el[id+'-div'].setDisplay(unl)
            if (unl) {
                let m = mass[i]
                const mult = tmp.evo.wormhole_mult[i]

                tmp.el[id+'-mult'].setHTML(formatMult(mult,2))
                tmp.el[id+'-mass'].setHTML(formatMass(m)+"<br>"+formatGain(m, WORMHOLE.calcGain(i), true))
                tmp.el[id+'-effect'].setHTML(this.effects[i][1](tmp.evo.wormhole_eff[i]))
            }
        }
    },

    get unlLength() {
		if (player.atom.unl) return 3
		return 2
    },
    maxLength: 6,

    effects: [
        [
            m => m.div(10).add(1).sqrt(),
            x => `Boost mediation levels by <b>${formatMult(x,2)}</b>.`,
        ],[
            m => m.div(100).add(1),
            x => `Boost Booster's power by <b>${formatMult(x,2)}</b>`,
        ],[
            m => m.add(10).log10(),
            x => `Gain more Calm Power. <b>${formatMult(x,2)}</b>`,
        ],[
            m => E(1),
            x => `Placeholder. <b>${formatMult(x,2)}</b>`,
        ],[
            m => E(1),
            x => `Placeholder. <b>${formatMult(x,2)}</b>`,
        ],[
            m => E(1),
            x => `Placeholder. <b>${formatMult(x,2)}</b>`,
        ],

        /*
        [
            m => {
                let x = E(1)
                return x
            },
            x => `Placeholder. <b>${formatMult(x,2)}</b>`,
        ],
        */
    ],
}

function wormholeEffect(id,def=E(1)) { return id<tmp.evo.wormhole_unls && tmp.evo.wormhole_eff[id] ? tmp.evo.wormhole_eff[id] : def }

function activateWormhole(id) {
    const unls = tmp.evo.wormhole_unls

    if (unls == 1) return;

    const mass = player.evo.wh.mass

    if (id == 0) {
		let sum = E(0), toAdd = mass[0].mul(.4/(unls-1))
        for (let x = 1; x < unls; x++) {
			sum = sum.add(toAdd.sub(mass[x]).max(0))
			mass[x] = mass[x].max(toAdd);
		}
        mass[0] = mass[0].sub(sum.div(2))
    } else {
        mass[0] = mass[0].add(mass[id]);
        mass[id] = E(0)
    }
}

function setupWormholeHTML() {
    let h = ''

    for (let i = 0; i < WORMHOLE.maxLength; i++) {
        h += `
        <div class='wormhole-div' id='wormhole${i}-div' onclick="activateWormhole(${i})">
            <div class='wh-id'>#${i+1} - Click to ${i ? "merge with #1" : "split"}</div>
            <div id='wormhole${i}-mult' class='wh-mult'>A</div>
            <div id='wormhole${i}-mass' class='wh-mass'>B</div>
            <div id='wormhole${i}-effect' class='wh-effect'>C</div>
        </div>
        `
    }

    new Element('wormhole_table').setHTML(h)
}