const ORB = {
    req() {
        let t = player.inf.c18.orb
        let r = this.requirement[t]||EINF

        return r
    },
    gain() {
        let x = E(0)
        if (player.mass.gte(tmp.orbCost) && (CHALS.inChal(18))) x = E(1)
        return x
    },
    getOrb() {
        if (player.mass.gte(tmp.orbCost) && (CHALS.inChal(18))) player.inf.c18.orb = player.inf.c18.orb.add(tmp.orbGain)
        if (player.chal.active == 18) {
            CHALS.exit()
        }
        else {
            CHALS.exit()
            CHALS.enter(18)
    
            addQuote(12)
        }
    },
requirement: [E('e11000000000'),E('1e17000000000'),E('1e245000000000'),E('1e36000000000'),E('1e4000000000')],
canBuy(x) {
    let u = this.upgs[x]
    let res = player.inf.c18.orb
    return res.gte(u.cost)
},
buyUpg(x) {
    if (this.canBuy(x)) {
        let u = this.upgs[x]
        player.inf.c18.upgs.push(x)
    }
},
upgs: [
    null,
    {
        desc: `Unlock an ability to buy Rank in C18, up to 100.`,
        unl() {return player.inf.c18.orb.gte(1)},
        cost: E(1),
    },
    {
        desc: `Hardened Challenge scaling is 25% weaker.`,
        unl() {return player.inf.c18.orb.gte(2)},
        cost: E(2),
    },
],
}
function updateOrbTemp() {
    tmp.orbCost = ORB.req()
    tmp.orbGain = ORB.gain()
}
function setuoOrbHTML() {
    let table = new Element('orbUpgs_table')
    let h = ``

    for (let i in ORB.upgs) {
        let c = ORB.upgs[i]

        h += `
        <button onclick="buyUpg(${i})" class="btn full orbUpg" id="orbUpg${i}_div" style="font-size: 12px;">
            <div id="orbUpg${i}_desc" style="min-height: 80px">${c.desc}</div>
            <div id="orbUpg${i}_cost"></div>
        </button>
        `
    }
    table.setHTML(h)
}
function updateOrbHTML() {
    
    for (let i in ORB.upgs) {
    let c = ORB.upgs[x], id = 'orbUpg'+i
    let unl = c.unl()
    i = parseInt(i)
    let el = tmp.el[id+`_div`]
    if (el) {
    tmp.el[id+"_div"].setDisplay(unl)
    tmp.el[id+"_cost"].setHTML(`Cost: <b>${c.cost.format(0)}</b> Orbs of Creation.`)
    tmp.el[id+"_desc"].setHTML(c.desc)

    tmp.el[id+"_div"].setClasses({btn: true, full: true, orbUpg: true, locked:  player.inf.c18.orb.lt(c.cost)})
    }
}
}
