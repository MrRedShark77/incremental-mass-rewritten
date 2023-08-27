const WORMHOLE = {
    step(x,t,i) {
        if (i > 0 && x.eq(0)) return E(0)

        const p = tmp.evo.wormhole_power, pp = Decimal.div(2,p)

        x = Decimal.pow(p.add(1.5),x.root(pp)).root(pp).add(t).pow(pp).log(p.add(1.5)).pow(pp)

        return isNaN(x.mag) ? E(0) : x.max(0)
    },
    calcGain(x,dt) {
        return this.step(x,dt).sub(x)
    },
    calc(dt) {
        const evo = OURO.evolution, unls = tmp.evo.wormhole_unls, mass = player.evo.wh.mass
        if (evo >= 2) if (player.mainUpg.atom.includes(6)) player.evo.wh.fabric = player.evo.wh.fabric.add(tmp.bh.dm_gain.mul(dt))

        for (let i = 0; i < unls; i++) mass[i] = WORMHOLE.step(mass[i],tmp.evo.wormhole_mult[i].mul(dt),i)
    },
    temp() {
        const unls = this.unlLength
        tmp.evo.wormhole_unls = unls
        tmp.evo.wormhole_power = Decimal.div(1,appleEffect('wh_loss'))

        const mass = player.evo.wh.mass
        const fabric_mult = player.evo.wh.fabric.add(1)
        const wh_power = E(2)

        for (let [i,e] of Object.entries(this.effects)) {
            i = parseInt(i)
            let m = mass[i]
            tmp.evo.wormhole_eff[i] = e[0](i < unls ? m : E(1))
            tmp.evo.wormhole_mult[i] = m.add(10).log10().pow(wh_power).mul(fabric_mult)
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
                tmp.el[id+'-mass'].setHTML(formatMass(m)+"<br>"+m.formatGain(this.calcGain(m,mult.div(FPS),i).mul(FPS)))
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