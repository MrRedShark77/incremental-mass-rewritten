const ORB = {
    req() {
        let t = player.inf.c18.orb
        let r = this.requirement[t]||EINF

        return r
    },
    unl() {
        let x = E(0)
        if (player.inf.c18.orb.gte(1)) x += 2
        if (player.inf.c18.orb.gte(1)) x += 2
        return x
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
requirement: [E('e1.060e10'),E('e1.45e10'),E('e1.63e10'),mlt(159000),mlt(1000000),mlt(1e9)],
canBuy(x) {
    let u = this.upgs[x]
    let res = player.inf.c18.orb
    return res.gte(u.cost) && (!hasOrbUpg(x))
},
buyUpg(x) {
    if (hasOrbUpg(i)) return;
    if (this.canBuy(x)) {
        let u = this.upgs[x]
        player.inf.c18.upgs.push(x)
    }
},
upgs: [

    {
        desc: `Unlock an ability to buy Ranks in C18.`,
        cost: E(1),
    },
    {
        desc: `Now you can get Rage Points and Buy Tickspeeds in C18.`,
        cost: E(2),
    },
    {
        desc: `Each Fragment will boost each other.`,
        cost: E(3),
    },
    {
        desc: `[ct1] is much more better.`,
        cost: E(4),
    },
    {
        desc: `Unlock Last Modificators [ENDGAME].`,
        cost: E(5),
    },
],
}
function updateOrbTemp() {
    tmp.orbCost = ORB.req()
    tmp.orbGain = ORB.gain()
}
function setupOrbHTML() {
    let table = new Element('orbUpgs_table')
    let h = ``

    for (let i in ORB.upgs) {
        let c = ORB.upgs[i]

        h += `
        <button onclick="ORB.buyUpg(${i})" class="btn full orbUpg" id="orbUpg${i}_div" style="font-size: 12px;">
            <div id="orbUpg${i}_desc" style="min-height: 80px">${c.desc}</div>
            <div id="orbUpg${i}_cost"></div>
        </button>
        `
    }
    table.setHTML(h)
}
function hasOrbUpg(i) { return player.inf.c18.upgs.includes(i) }
function updateOrbHTML() {
    
    for (let i in ORB.upgs) {
        i = parseInt(i)
    let c = ORB.upgs[i], id = 'orbUpg'+i
    let unl = ORB.unl()
    tmp.el[id+"_div"].setDisplay(i<unl)
    tmp.el[id+"_cost"].setHTML(`Cost: <b>${c.cost.format(0)}</b> Orbs of Creation.`)
    tmp.el[id+'_cost'].setDisplay(!hasOrbUpg(i))
    tmp.el[id+"_desc"].setHTML(c.desc)

    tmp.el[id+"_div"].setClasses({btn: true, full: true, orbUpg: true, locked:  player.inf.c18.orb.lt(c.cost)|| hasOrbUpg(i)})
}
}
