const CHARGERS = [
    {
        req: E(1e100),
        cost: E(3),
        desc: `
        Multiply all matters gain by 1e10, and square mass of black hole gain.
        `,
    },{
        req: E('e1000'),
        cost: E(1000),
        desc: `
        Unlock the Unstable Black Hole that boosts normal black hole. (in black hole tab)
        `,
    },{
        req: E('e4500'),
        cost: E(15000),
        desc: `
        Unstable Black Hole's effect is 50% stronger. (after overflow)
        `,
    },{
        req: E('e30000'),
        cost: E(1e7),
        desc: `
        Remove all pre-Meta scalings from Supernova. [Neut-Muon]'s effect is now changed. Denullify C5's effect, but it's changed.
        `,
    },{
        req: E('e33000'),
        cost: E(5e8),
        desc: `
        Dark Shadow's first reward is overpowered. Remove all scalings from Tickspeed, but nullify [Tau]'s effect.
        `,
    },{
        req: E('e77000'),
        cost: E(5e10),
        desc: `
        Unlock Exotic Atoms in Atom tab, and unlock new elements' layer.
        `,
    },{
        req: E('ee6'),
        cost: E(1e26),
        desc: `
        Remove all scalings from BHC. [Neut-Tau]'s effect no longer affects BHC's cheapness. In C16, BHC is 1,000,000x cheaper.
        `,
    },{
        req: E('e1.6e6'),
        cost: E(5e30),
        desc: `
        Remove all scalings from Cosmic Ray. [Neut-Tau]'s effect now re-affects BHC's cheapness, but its effect is MASSIVELY weaker.
        `,
    },{
        req: E('e3.9e9'),
        cost: E(1e270),
        desc: `
        Remove all scalings from Tetr. However, Hybridized Uran-Astatine's first effect no longer affects it. Tetr is 500x cheaper in C16.
        `,
    },{
        req: E('e4e10'),
        cost: E('e400'),
        desc: `
        De-corrupt 40th, 64th, 67th, 150th, 199th, 200th, and 204th elements.
        `, // 40,64,67,150,199,200,204
    },
]

const UNSTABLE_BH = {
    gain() {
        let x = tmp.unstable_bh.fvm_eff.eff||E(1)

        let ea=exoticAEff(1,0)

        if (Array.isArray(ea)) x = x.mul(ea[0])
        else                   x = x.mul(ea)

        x = x.pow(getFragmentEffect('bh'))
        if (hasElement(39,1)) x = x.pow(ea[1])

        return x
    },
    getProduction(x,gain) {

        return Decimal.pow(10,x.max(0).root(tmp.unstable_bh.p.mul(2))).add(gain).log(10).pow(tmp.unstable_bh.p.mul(2))
    },
    calcProduction() {
        let bh = player.bh.unstable

        return this.getProduction(bh,tmp.unstable_bh.gain.mul(tmp.preInfGlobalSpeed)).sub(bh)
    },
    effect() {
        let x = player.bh.unstable.add(1)

        if (tmp.c16active) x = x.root(3)

        if (!hasAscension(0,3)) x = overflow(x,10,0.5)

        x = x.pow(theoremEff('bh',4))

        if (hasCharger(2)) x = x.pow(1.5)

        return x
    },
    fvm: {
        can() { return tmp.c16active && player.bh.dm.gte(tmp.unstable_bh.fvm_cost) },
        buy() {
            if (this.can()) player.bh.fvm = player.bh.fvm.add(1)
        },
        buyMax() {
            if (this.can()) player.bh.fvm = player.bh.fvm.max(tmp.unstable_bh.fvm_bulk)
        },
        effect() {
            let lvl = player.bh.fvm

            let pow = E(2)

            if (hasPrestige(2,28)) pow = pow.mul(prestigeEff(2,28))

            if (tmp.inf_unl) pow = pow.mul(theoremEff('bh',3))

            let eff = pow.pow(lvl)

            return {pow: pow, eff: eff}
        },
    },
}

function startC16() {
    if (player.chal.active == 16) {
        CHALS.exit()
    }
    else {
        CHALS.exit()
        CHALS.enter(16)

        addQuote(10)
    }
}

function hasCharger(i) { return player.dark.c16.charger.includes(i) }

function buyCharger(i) {
    if (hasCharger(i)) return;

    let c = CHARGERS[i], cost = c.cost

    if (player.dark.c16.shard.gte(cost) && !tmp.c16active) {
        player.dark.c16.shard = player.dark.c16.shard.sub(cost).max(0)

        player.dark.c16.charger.push(i)

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
            <div id="charger${i}_desc" style="min-height: 80px">${c.desc}</div>
            <div id="charger${i}_cost"></div>
        </button>
        `
    }

    table.setHTML(h)
}

function corruptedShardGain() {
    let bh = player.bh.mass

    if (hasElement(232)) bh = player.dark.c16.bestBH.max('e100')
    else if (!tmp.c16active || bh.lt('e100')) return E(0)

    let x = Decimal.pow(10,overflow(bh.max(1).log10(),1e9,0.5).div(100).root(hasElement(223) ? 2.9 : 3).sub(1))

    if (hasPrestige(3,4)) x = x.mul(prestigeEff(3,4))

    x = x.mul(exoticAEff(0,0))

    return x.floor()
}

function updateC16Temp() {
    tmp.c16.shardGain = corruptedShardGain()
}

function updateC16HTML() {
    let c16 = tmp.c16active
    let bh = player.dark.c16.bestBH, cs = player.dark.c16.shard
    tmp.el.bestBH.setHTML(formatMass(player.dark.c16.bestBH))

    let e = hasInfUpgrade(15)?12:8

    for (let i in CHARGERS) {
        i = parseInt(i)

        let c = CHARGERS[i], id = 'charger'+i

        tmp.el[id+"_div"].setDisplay(i<e)

        if (i>=e) continue;

        let req = bh.gte(c.req)

        tmp.el[id+"_req"].setHTML(`Requires: <b>${formatMass(c.req)}</b> of black hole.`)
        tmp.el[id+"_cost"].setHTML(`Cost: <b>${c.cost.format(0)}</b> Corrupted Shard.`)

        tmp.el[id+"_req"].setDisplay(!req)
        tmp.el[id+"_desc"].setDisplay(req)
        tmp.el[id+"_cost"].setDisplay(req && !hasCharger(i))

        tmp.el[id+"_div"].setClasses({btn: true, full: true, charger: true, locked: !req || cs.lt(c.cost) || hasCharger(i) || c16})
    }
}

const CORRUPTED_ELEMENTS = [40,64,67,150,162,187,199,200,204] // 40,64,67,150,199,200,204