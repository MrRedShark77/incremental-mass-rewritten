var diff = 0;
var date = Date.now();
var player
var tmp = {
    
}

const FORMS = {
    massGain() {
        let x = E(1)
        x = x.add(tmp.upgs.mass[1]?tmp.upgs.mass[1].eff.eff:1)
        if (player.ranks.rank.gte(6)) x = x.mul(RANKS.effect.rank[6]())
        if (player.ranks.rank.gte(13)) x = x.mul(3)
        x = x.mul(tmp.tickspeedEffect.eff||E(1))
        if (player.ranks.tier.gte(2)) x = x.pow(1.15)
        return x
    },
    tickspeed: {
        cost(x=player.tickspeed) { return E(2).pow(x).floor() },
        can() { return player.rp.points.gte(this.cost()) },
        buy() {
            if (this.can()) {
                player.rp.points = player.rp.points.sub(this.cost())
                player.tickspeed = player.tickspeed.add(1)
            }
        },
        buyMax() { 
            if (this.can()) {
                if (player.rp.points.lt(1)) return
                let bulk = player.rp.points.max(1).log(2).add(1).floor()
                player.tickspeed = bulk
                player.rp.points = player.rp.points.sub(this.cost(bulk.sub(1)))
            }
        },
        effect() {
            let step = E(1.5)
            if (player.ranks.tier.gte(4)) step = step.add(RANKS.effect.tier[4]())
            if (player.ranks.rank.gte(41)) step = step.add(RANKS.effect.rank[41]())
            let eff = step.pow(player.tickspeed)
            return {step: step, eff: eff}
        },
    },
    rp: {
        gain() {
            if (player.mass.lt(1e15)) return E(0)
            let gain = player.mass.div(1e15).root(3)
            if (player.ranks.rank.gte(14)) gain = gain.mul(2)
            if (player.ranks.rank.gte(46)) gain = gain.mul(RANKS.effect.rank[46]())
            return gain.floor()
        },
        reset() {
            if (tmp.rp.can) if (confirm("Are you sure to reset?")) {
                player.rp.points = player.rp.points.add(this.gain())
                player.rp.unl = true
                this.doReset()
            }
        },
        doReset() {
            player.ranks[RANKS.names[RANKS.names.length-1]] = E(0)
            RANKS.doReset[RANKS.names[RANKS.names.length-1]]()
        }
    },
    reset_msg: {
        msgs: {
            rp: "Require 1e9 tonne of mass to reset previous features for gain Rage Powers",
        },
        set(id) { player.reset_msg = this.msgs[id] },
        reset() { player.reset_msg = "" },
    },
}

const UPGS = {
    mass: {
        cols: 3,
        temp() {
            if (!tmp.upgs.mass) tmp.upgs.mass = {}
            for (let x = this.cols; x >= 1; x--) {
                if (!tmp.upgs.mass[x]) tmp.upgs.mass[x] = {}
                let data = this.getData(x)
                tmp.upgs.mass[x].cost = data.cost
                tmp.upgs.mass[x].bulk = data.bulk
                
                tmp.upgs.mass[x].bouns = this[x].bouns?this[x].bouns():E(0)
                tmp.upgs.mass[x].eff = this[x].effect(player.massUpg[x]||E(0))
                tmp.upgs.mass[x].effDesc = this[x].effDesc(tmp.upgs.mass[x].eff)
            }
        },
        autoSwitch(x) {
            player.autoMassUpg[x] = !player.autoMassUpg[x]
        },
        buy(x, manual=false) {
            let cost = manual ? this.getData(x).cost : tmp.upgs.mass[x].cost
            if (player.mass.gte(cost)) {
                player.mass = player.mass.sub(cost)
                if (!player.massUpg[x]) player.massUpg[x] = E(0)
                player.massUpg[x] = player.massUpg[x].add(1)
            }
        },
        buyMax(x) {
            let bulk = tmp.upgs.mass[x].bulk
            let cost = tmp.upgs.mass[x].cost
            if (player.mass.gte(cost)) {
                if (!player.massUpg[x]) player.massUpg[x] = E(0)
                player.massUpg[x] = player.massUpg[x].max(bulk.floor().max(player.massUpg[x].plus(1)))
                player.mass = player.mass.sub(cost)
            }
        },
        getData(i) {
            let upg = this[i]
            let inc = upg.inc
            if (i == 1 && player.ranks.rank.gte(2)) inc = inc.pow(0.8)
            if (i == 2 && player.ranks.rank.gte(3)) inc = inc.pow(0.8)
            if (i == 3 && player.ranks.rank.gte(4)) inc = inc.pow(0.8)
            if (player.ranks.tier.gte(3)) inc = inc.pow(0.8)
            let lvl = player.massUpg[i]||E(0)
            let cost = inc.pow(lvl).mul(upg.start)
            let bulk = player.mass.div(upg.start).max(1).log(inc).add(1).floor()
            if (player.mass.lt(upg.start)) bulk = E(0)

            if (scalingActive("massUpg", lvl.max(bulk), "super")) {
                let start = getScalingStart("super", "massUpg");
                let power = getScalingPower("super", "massUpg");
                let exp = E(2.5).pow(power);
                cost =
                    inc.pow(
                        lvl.pow(exp).div(start.pow(exp.sub(1)))
                    ).mul(upg.start)
                bulk = player.mass
                    .div(upg.start)
                    .max(1)
                    .log(inc)
                    .times(start.pow(exp.sub(1)))
                    .root(exp)
                    .add(1)
                    .floor();
            }
            return {cost: cost, bulk: bulk}
        },
        1: {
            unl() { return player.ranks.rank.gte(1) },
            title: "Muscler",
            start: E(10),
            inc: E(1.5),
            effect(x) {
                let step = E(1)
                if (player.ranks.rank.gte(3)) step = step.add(RANKS.effect.rank[3]())
                step = step.mul(tmp.upgs.mass[2]?tmp.upgs.mass[2].eff.eff:1)
                let ret = step.mul(x.add(tmp.upgs.mass[1].bouns))
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+formatMass(eff.step),
                    eff: "+"+formatMass(eff.eff)+" to mass gain"
                }
            },
            bouns() {
                let x = E(0)
                if (player.mainUpg.rp.includes(1)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][1].effect:E(0))
                if (player.mainUpg.rp.includes(2)) x = x.add(tmp.upgs.mass[2].bouns)
                return x
            },
        },
        2: {
            unl() { return player.ranks.rank.gte(2) },
            title: "Booster",
            start: E(100),
            inc: E(4),
            effect(x) {
                let step = E(2)
                if (player.ranks.rank.gte(5)) step = step.add(RANKS.effect.rank[5]())
                step = step.pow(tmp.upgs.mass[3]?tmp.upgs.mass[3].eff.eff:1)
                let ret = step.mul(x.add(tmp.upgs.mass[2].bouns)).add(1)
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+format(eff.step)+"x",
                    eff: "x"+format(eff.eff)+" to Muscler Power"
                }
            },
            bouns() {
                let x = E(0)
                if (player.mainUpg.rp.includes(2)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][2].effect:E(0))
                return x
            },
        },
        3: {
            unl() { return player.ranks.rank.gte(3) },
            title: "Stronger",
            start: E(1000),
            inc: E(9),
            effect(x) {
                let ss = E(10)
                if (player.ranks.rank.gte(34)) ss = ss.mul(1.2)
                let step = E(1)
                let ret = step.mul(x.add(tmp.upgs.mass[3].bouns)).add(1).softcap(ss,0.5,0)
                return {step: step, eff: ret, ss: ss}
            },
            effDesc(eff) {
                return {
                    step: "+^"+format(eff.step),
                    eff: "^"+format(eff.eff)+" to Booster Power"
                }
            },
            bouns() {
                let x = E(0)
                if (player.mainUpg.rp.includes(7)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][7].effect:E(0))
                return x
            },
        },
    },
    main: {
        temp() {
            if (!tmp.upgs.main) tmp.upgs.main = {}
            for (let x = 1; x <= UPGS.main.cols; x++) {
                if (!tmp.upgs.main[x]) tmp.upgs.main[x] = {}
                for (let y = 1; y <= UPGS.main[x].lens; y++) if (UPGS.main[x][y].effDesc) tmp.upgs.main[x][y] = { effect: UPGS.main[x][y].effect(), effDesc: UPGS.main[x][y].effDesc() }
            }
        },
        ids: [null, 'rp'],
        cols: 1,
        over(x,y) { player.main_upg_msg = [x,y] },
        reset() { player.main_upg_msg = [0,0] },
        1: {
            title: "Rage Upgrades",
            res: "Rage Powers",
            unl() { return player.rp.unl },
            can(x) { return player.rp.points.gte(this[x].cost) && !player.mainUpg.rp.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.rp.points = player.rp.points.sub(this[x].cost)
                    player.mainUpg.rp.push(x)
                }
            },
            lens: 8,
            1: {
                desc: "Booster adds Musclar.",
                cost: E(1),
                effect() {
                    let ret = E(player.massUpg[2]||0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Musclar"
                },
            },
            2: {
                desc: "Stronger adds Booster.",
                cost: E(10),
                effect() {
                    let ret = E(player.massUpg[3]||0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Booster"
                },
            },
            3: {
                desc: "You can automatically buys mass upgrades.",
                cost: E(25),
            },
            4: {
                desc: "Ranks no longer resets anything.",
                cost: E(50),
            },
            5: {
                desc: "You can automatically rank up.",
                cost: E(1e4),
            },
            6: {
                desc: "You can automatically tier up.",
                cost: E(1e5),
            },
            7: {
                desc: "For every 3 tickspeeds adds Stronger.",
                cost: E(1e7),
                effect() {
                    let ret = player.tickspeed.div(3).floor()
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Stronger"
                },
            },
            8: {
                desc: "Super Mass Upgrades scaling weaker by Rage Points.",
                cost: E(1e15),
                effect() {
                    let ret = E(0.9).pow(player.rp.points.max(1).log10().max(1).log10().pow(1.25))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(E(1).sub(x).mul(100))+"% weaker"
                },
            },
        },  
    },
}

function loop() {
    diff = Date.now()-date;
    updateTemp()
    calc(diff/1000);
    updateHTML()
    date = Date.now();
}

function format(ex, acc=4) {
    ex = E(ex)
    neg = ex.lt(0)?"-":""
    if (ex.mag == Infinity) return neg + 'Infinity'
    if (ex.lt(0)) ex = ex.mul(-1)
    if (ex.eq(0)) return ex.toFixed(acc)
    let e = ex.log10().floor()
    if (e.lt(4)) {
        return neg+ex.toFixed(Math.max(Math.min(acc-e.toNumber(), acc), 0))
    } else {
        let m = ex.div(E(10).pow(e))
        return neg+(e.log10().gte(9)?'':m.toFixed(4))+'e'+format(e, 0, "sc")
    }
}

function formatMass(ex) {
    ex = E(ex)
    if (ex.gte(E(1.5e56).mul('ee9'))) return format(ex.div(1.5e56).log10().div(1e9)) + ' mlt'
    if (ex.gte(1.5e56)) return format(ex.div(1.5e56)) + ' uni'
    if (ex.gte(2.9835e45)) return format(ex.div(2.9835e45)) + ' MMWG'
    if (ex.gte(1.989e33)) return format(ex.div(1.989e33)) + ' M☉'
    if (ex.gte(5.972e27)) return format(ex.div(5.972e27)) + ' M⊕'
    if (ex.gte(1.619e20)) return format(ex.div(1.619e20)) + ' MME'
    if (ex.gte(1e6)) return format(ex.div(1e6)) + ' tonne'
    if (ex.gte(1e3)) return format(ex.div(1e3)) + ' kg'
    return format(ex) + ' g'
}

function formatGain(amt, gain, isMass=false) {
    let f = isMass?formatMass:format
	if (gain.gte(1e100) && gain.gt(amt)) return "(+"+format(gain.max(1).log10().sub(amt.max(1).log10().max(1)).times(50))+" OoMs/sec)"
	else return "(+"+f(gain)+"/sec)"
}

function capitalFirst(str) {
	if (str=="" || str==" ") return str
	return str
		.split(" ")
		.map(x => x[0].toUpperCase() + x.slice(1))
		.join(" ");
}

setInterval(loop, 50)