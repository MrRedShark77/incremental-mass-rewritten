const CHARGERS = [
    {
        req: E(1e100),
        cost: E(10),
        desc: `
        Multiply all matters gain by 1e10, and square mass of black hole gain.
        `,
    },{
        req: E('e1000'),
        cost: E(1000),
        desc: `
        ???.
        `,
    },
]

function startC16() {
    if (player.chal.active == 16) {
        CHALS.exit()
    }
    else {
        CHALS.enter(16)
    }
}

function hasCharger(i) { return player.dark.c16.charger.includes(i) }

function buyCharger(i) {
    if (hasCharger(i)) return;

    let c = CHARGERS[i], cost = c.cost

    if (player.dark.c16.shard.gte(cost)) {
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
    if (!tmp.c16active || player.bh.mass.lt('e100')) return E(0)

    let x = Decimal.pow(10,player.bh.mass.max(1).log10().div(100).root(3).sub(1))

    return x.floor()
}

function updateC16Temp() {
    tmp.c16.shardGain = corruptedShardGain()
}

function updateC16HTML() {
    let bh = player.dark.c16.bestBH, cs = player.dark.c16.shard
    tmp.el.bestBH.setHTML(formatMass(player.dark.c16.bestBH))

    for (let i in CHARGERS) {
        i = parseInt(i)

        let c = CHARGERS[i], id = 'charger'+i

        let req = bh.gte(c.req)

        tmp.el[id+"_req"].setHTML(`Requires: <b>${formatMass(c.req)}</b> of black hole.`)
        tmp.el[id+"_cost"].setHTML(`Cost: <b>${c.cost.format(0)}</b> Corrupted Shard.`)

        tmp.el[id+"_req"].setDisplay(!req)
        tmp.el[id+"_desc"].setDisplay(req)
        tmp.el[id+"_cost"].setDisplay(req && !hasCharger(i))

        tmp.el[id+"_div"].setClasses({btn: true, full: true, charger: true, locked: !req || cs.lt(c.cost) || hasCharger(i)})
    }
}