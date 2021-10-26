var diff = 0;
var date = Date.now();
var player
var tmp = {
    tab: 0,
    stab: [],
}
for (let x = 0; x < TABS[1].length; x++) tmp.stab.push(0)

const ST_NAMES = [
    ["","U","D","T","Qa","Qt","Sx","Sp","Oc","No"],
    ["","Dc","Vg","Tg","Qag","Qtg","Sxg","Spg","Ocg","Nog"],
    ["","Ce","De","Te","Qae","Qte","Sxe","Spe","Oce","Noe"],
    ["","Mi","Mc","Na","Pc"],
]
const CONFIRMS = ['rp', 'bh', 'atom']

const FORMS = {
    massGain() {
        let x = E(1)
        x = x.add(tmp.upgs.mass[1]?tmp.upgs.mass[1].eff.eff:1)
        if (player.ranks.rank.gte(6)) x = x.mul(RANKS.effect.rank[6]())
        if (player.ranks.rank.gte(13)) x = x.mul(3)
        x = x.mul(tmp.tickspeedEffect.eff||E(1))
        if (player.bh.unl) x = x.mul(tmp.bh.effect)
        if (player.mainUpg.bh.includes(10)) x = x.mul(tmp.upgs.main?tmp.upgs.main[2][10].effect:E(1))
        x = x.mul(tmp.atom.particles[0].powerEffect.eff1)
        x = x.mul(tmp.atom.particles[1].powerEffect.eff2)
        if (player.ranks.rank.gte(380)) x = x.mul(RANKS.effect.rank[380]())
        x = x.mul(tmp.stars.effect)
        if (player.ranks.tier.gte(2)) x = x.pow(1.15)
        if (player.ranks.rank.gte(180)) x = x.pow(1.025)
        if (!CHALS.inChal(3)) x = x.pow(tmp.chal.eff[3])
        if (player.md.active) {
            x = expMult(x,0.8)
            if (player.atom.elements.includes(28)) x = x.pow(1.5)
        }
        return x.softcap(tmp.massSoftGain,tmp.massSoftPower,0).softcap(tmp.massSoftGain2,tmp.massSoftPower2,0)
    },
    massSoftGain() {
        let s = E(1.5e156)
        if (CHALS.inChal(3)) s = s.div(1e150)
        if (CHALS.inChal(4)) s = s.div(1e100)
        if (player.mainUpg.bh.includes(7)) s = s.mul(tmp.upgs.main?tmp.upgs.main[2][7].effect:E(1))
        if (player.mainUpg.rp.includes(13)) s = s.mul(tmp.upgs.main?tmp.upgs.main[1][13].effect:E(1))
        return s
    },
    massSoftPower() {
        let p = E(1/3)
        if (CHALS.inChal(3)) p = p.mul(4)
        if (CHALS.inChal(7)) p = p.mul(6)
        if (player.mainUpg.bh.includes(11)) p = p.mul(0.9)
        if (player.ranks.rank.gte(800)) p = p.mul(RANKS.effect.rank[800]())
        return E(1).div(p.add(1))
    },
    massSoftGain2() {
        let s = E('1.5e1000056')
        return s
    },
    massSoftPower2() {
        let p = E(0.25)
        return p
    },
    tickspeed: {
        cost(x=player.tickspeed) { return E(2).pow(x).floor() },
        can() { return player.rp.points.gte(tmp.tickspeedCost) && !CHALS.inChal(2) && !CHALS.inChal(6) },
        buy() {
            if (this.can()) {
                if (!player.mainUpg.atom.includes(2)) player.rp.points = player.rp.points.sub(tmp.tickspeedCost).max(0)
                player.tickspeed = player.tickspeed.add(1)
            }
        },
        buyMax() { 
            if (this.can()) {
                if (!player.mainUpg.atom.includes(2)) player.rp.points = player.rp.points.sub(tmp.tickspeedCost).max(0)
                player.tickspeed = tmp.tickspeedBulk
            }
        },
        effect() {
            let bouns = E(0)
            if (player.atom.unl) bouns = bouns.add(tmp.atom.atomicEff)
            let step = E(1.5)
                step = step.add(tmp.chal.eff[6])
                step = step.add(tmp.chal.eff[2])
                step = step.add(tmp.atom.particles[0].powerEffect.eff2)
                if (player.ranks.tier.gte(4)) step = step.add(RANKS.effect.tier[4]())
                if (player.ranks.rank.gte(40)) step = step.add(RANKS.effect.rank[40]())
                step = step.mul(tmp.md.mass_eff)
            let eff = step.pow(player.tickspeed.add(bouns))
            if (player.atom.elements.includes(18)) eff = eff.pow(tmp.elements.effect[18])
            if (player.ranks.tetr.gte(3)) eff = eff.pow(1.05)
            return {step: step, eff: eff, bouns: bouns}
        },
        autoUnl() { return player.mainUpg.bh.includes(5) },
        autoSwitch() { player.autoTickspeed = !player.autoTickspeed },
    },
    rp: {
        gain() {
            if (player.mass.lt(1e15) || CHALS.inChal(7)) return E(0)
            let gain = player.mass.div(1e15).root(3)
            if (player.ranks.rank.gte(14)) gain = gain.mul(2)
            if (player.ranks.rank.gte(45)) gain = gain.mul(RANKS.effect.rank[45]())
            if (player.ranks.tier.gte(6)) gain = gain.mul(RANKS.effect.tier[6]())
            if (player.mainUpg.bh.includes(6)) gain = gain.mul(tmp.upgs.main?tmp.upgs.main[2][6].effect:E(1))
            gain = gain.mul(tmp.atom.particles[1].powerEffect.eff1)
            if (player.mainUpg.bh.includes(8)) gain = gain.pow(1.15)
            gain = gain.pow(tmp.chal.eff[4])
            if (CHALS.inChal(4)) gain = gain.root(10)
            if (player.md.active) gain = expMult(gain,0.8)
            return gain.floor()
        },
        reset() {
            if (tmp.rp.can) if (player.confirms.rp?confirm("Are you sure to reset?"):true) {
                player.rp.points = player.rp.points.add(tmp.rp.gain)
                player.rp.unl = true
                this.doReset()
            }
        },
        doReset() {
            player.ranks[RANKS.names[RANKS.names.length-1]] = E(0)
            RANKS.doReset[RANKS.names[RANKS.names.length-1]]()
        },
    },
    bh: {
        see() { return player.rp.unl },
        DM_gain() {
            let gain = player.rp.points.div(1e20)
            if (CHALS.inChal(7)) gain = player.mass.div(1e180)
            if (gain.lt(1)) return E(0)
            gain = gain.root(4)
            if (CHALS.inChal(7)) gain = gain.root(6)
            gain = gain.mul(tmp.atom.particles[2].powerEffect.eff1)
            if (CHALS.inChal(8)) gain = gain.root(8)
            gain = gain.pow(tmp.chal.eff[8])
            if (player.md.active) gain = expMult(gain,0.8)
            return gain.floor()
        },
        massGain() {
            let x = player.bh.mass.add(1).pow(0.33).mul(this.condenser.effect().eff)
            if (player.mainUpg.rp.includes(11)) x = x.mul(tmp.upgs.main?tmp.upgs.main[1][11].effect:E(1))
            if (player.mainUpg.bh.includes(14)) x = x.mul(tmp.upgs.main?tmp.upgs.main[2][14].effect:E(1))
            if (player.atom.elements.includes(46)) x = x.mul(tmp.elements.effect[46])
            if (CHALS.inChal(8)) x = x.root(8)
            x = x.pow(tmp.chal.eff[8])
            if (player.md.active) x = expMult(x,0.8)
            return x.softcap(tmp.bh.massSoftGain, tmp.bh.massSoftPower, 0)
        },
        massSoftGain() {
            let s = E(1.5e156)
            if (player.mainUpg.atom.includes(6)) s = s.mul(tmp.upgs.main?tmp.upgs.main[3][6].effect:E(1))
            return s
        },
        massSoftPower() {
            let p = E(1)
            return E(1).div(p.add(1))
        },
        reset() {
            if (tmp.bh.dm_can) if (player.confirms.bh?confirm("Are you sure to reset?"):true) {
                player.bh.dm = player.bh.dm.add(tmp.bh.dm_gain)
                player.bh.unl = true
                this.doReset()
            }
        },
        doReset() {
            let keep = []
            for (let x = 0; x < player.mainUpg.rp.length; x++) if ([3,5,6].includes(player.mainUpg.rp[x])) keep.push(player.mainUpg.rp[x])
            player.mainUpg.rp = keep
            player.rp.points = E(0)
            player.tickspeed = E(0)
            player.bh.mass = E(0)
            FORMS.rp.doReset()
        },
        effect() {
            let x = player.mainUpg.atom.includes(12)
            ?player.bh.mass.add(1).pow(1.25)
            :player.bh.mass.add(1).root(4)
            return x
        },
        condenser: {
            autoSwitch() { player.bh.autoCondenser = !player.bh.autoCondenser },
            autoUnl() { return player.mainUpg.atom.includes(2) },
            can() { return player.bh.dm.gte(tmp.bh.condenser_cost) && !CHALS.inChal(6) },
            buy() {
                if (this.can()) {
                    player.bh.dm = player.bh.dm.sub(tmp.bh.condenser_cost).max(0)
                    player.bh.condenser = player.bh.condenser.add(1)
                }
            },
            buyMax() {
                if (this.can()) {
                    player.bh.condenser = tmp.bh.condenser_bulk
                    player.bh.dm = player.bh.dm.sub(tmp.bh.condenser_cost).max(0)
                }
            },
            effect() {
                let pow = E(2)
                    pow = pow.add(tmp.chal.eff[6])
                    if (player.mainUpg.bh.includes(2)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[2][2].effect:E(1))
                    pow = pow.add(tmp.atom.particles[2].powerEffect.eff2)
                    if (player.mainUpg.atom.includes(11)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[3][11].effect:E(1))
                let eff = pow.pow(player.bh.condenser.add(tmp.bh.condenser_bouns))
                return {pow: pow, eff: eff}
            },
            bouns() {
                let x = E(0)
                if (player.mainUpg.bh.includes(15)) x = x.add(tmp.upgs.main?tmp.upgs.main[2][15].effect:E(0))
                return x
            },
        },
    },
    reset_msg: {
        msgs: {
            rp: "Require over 1e9 tonne of mass to reset previous features for gain Rage Powers",
            dm: "Require over 1e20 Rage Power to reset all previous features for gain Dark Matters",
            atom: "Require over 1e100 uni of black hole to reset all previous features for gain Atoms & Quarks",
            md: "Dilate mass, then cancel",
        },
        set(id) { player.reset_msg = this.msgs[id] },
        reset() { player.reset_msg = "" },
    },
}

const UPGS = {
    mass: {
        cols: 3,
        autoOnly: [0,1,2],
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
                if (!player.mainUpg.bh.includes(1)) player.mass = player.mass.sub(cost)
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
                if (!player.mainUpg.bh.includes(1)) player.mass = player.mass.sub(cost)
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
            if (scalingActive("massUpg", lvl.max(bulk), "hyper")) {
                let start = getScalingStart("super", "massUpg");
                let power = getScalingPower("super", "massUpg");
                let start2 = getScalingStart("hyper", "massUpg");
                let power2 = getScalingPower("hyper", "massUpg");
                let exp = E(2.5).pow(power);
                let exp2 = E(5).pow(power);
                cost =
                    inc.pow(
                        lvl.pow(exp2).div(start2.pow(exp2.sub(1))).pow(exp).div(start.pow(exp.sub(1)))
                    ).mul(upg.start)
                bulk = player.mass
                    .div(upg.start)
                    .max(1)
                    .log(inc)
                    .times(start.pow(exp.sub(1)))
                    .root(exp)
                    .times(start2.pow(exp2.sub(1)))
                    .root(exp2)
                    .add(1)
                    .floor();
            }
            return {cost: cost, bulk: bulk}
        },
        1: {
            unl() { return player.ranks.rank.gte(1) || player.mainUpg.atom.includes(1) },
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
            unl() { return player.ranks.rank.gte(2) || player.mainUpg.atom.includes(1) },
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
                if (player.mainUpg.rp.includes(7)) x = x.add(tmp.upgs.mass[3].bouns)
                return x
            },
        },
        3: {
            unl() { return player.ranks.rank.gte(3) || player.mainUpg.atom.includes(1) },
            title: "Stronger",
            start: E(1000),
            inc: E(9),
            effect(x) {
                let ss = E(10)
                if (player.ranks.rank.gte(34)) ss = ss.add(2)
                if (player.mainUpg.bh.includes(9)) ss = ss.add(tmp.upgs.main?tmp.upgs.main[2][9].effect:E(0))
                let step = E(1).add(RANKS.effect.tetr[2]())
                if (player.mainUpg.rp.includes(9)) step = step.add(0.25)
                if (player.mainUpg.rp.includes(12)) step = step.add(tmp.upgs.main?tmp.upgs.main[1][12].effect:E(0))
                if (player.atom.elements.includes(4)) step = step.mul(tmp.elements.effect[4])
                if (player.md.upgs[3].gte(1)) step = step.mul(tmp.md.upgs[3].eff)
                let sp = 0.5
                if (player.mainUpg.atom.includes(9)) sp *= 1.15
                if (player.ranks.tier.gte(30)) sp *= 1.1
                let ret = step.mul(x.add(tmp.upgs.mass[3].bouns)).add(1).softcap(ss,sp,0).softcap(1.8e5,0.5,0)
                return {step: step, eff: ret, ss: ss}
            },
            effDesc(eff) {
                return {
                    step: "+^"+format(eff.step),
                    eff: "^"+format(eff.eff)+" to Booster Power"+(eff.eff.gte(eff.ss)?` <span class='soft'>(softcapped${eff.eff.gte(1.8e5)?"^2":""})</span>`:"")
                }
            },
            bouns() {
                let x = E(0)
                if (player.mainUpg.rp.includes(7)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][7].effect:0)
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
        ids: [null, 'rp', 'bh', 'atom'],
        cols: 3,
        over(x,y) { player.main_upg_msg = [x,y] },
        reset() { player.main_upg_msg = [0,0] },
        1: {
            title: "Rage Upgrades",
            res: "Rage Power",
            unl() { return player.rp.unl },
            can(x) { return player.rp.points.gte(this[x].cost) && !player.mainUpg.rp.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.rp.points = player.rp.points.sub(this[x].cost)
                    player.mainUpg.rp.push(x)
                }
            },
            auto_unl() { return player.mainUpg.bh.includes(5) },
            lens: 15,
            1: {
                desc: "Boosters adds Musclers.",
                cost: E(1),
                effect() {
                    let ret = E(player.massUpg[2]||0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Musclers"
                },
            },
            2: {
                desc: "Strongers adds Boosters.",
                cost: E(10),
                effect() {
                    let ret = E(player.massUpg[3]||0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Boosters"
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
                    let ret = player.tickspeed.div(3).add(player.atom.elements.includes(38)?tmp.elements.effect[38]:0).floor()
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Stronger"
                },
            },
            8: {
                desc: "Super Mass Upgrades scaling is weaker by Rage Points.",
                cost: E(1e15),
                effect() {
                    let ret = E(0.9).pow(player.rp.points.max(1).log10().max(1).log10().pow(1.25).softcap(2.5,0.5,0))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(E(1).sub(x).mul(100))+"% weaker"+(x.log(0.9).gte(2.5)?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            9: {
                unl() { return player.bh.unl },
                desc: "Stronger Power is added +^0.25.",
                cost: E(1e31),
            },
            10: {
                unl() { return player.bh.unl },
                desc: "Super Rank scaling is 20% weaker.",
                cost: E(1e43),
            },
            11: {
                unl() { return player.chal.unl },
                desc: "Black Hole mass's gain is boosted by Rage Points.",
                cost: E(1e72),
                effect() {
                    let ret = player.rp.points.add(1).root(10).softcap('e4000',0.1,0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+(x.gte("e4000")?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            12: {
                unl() { return player.chal.unl },
                desc: "For every OoM of Rage Powers adds Stronger Power at a reduced rate.",
                cost: E(1e120),
                effect() {
                    let ret = player.rp.points.max(1).log10().softcap(200,0.75,0).div(1000)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+^"+format(x)+(x.gte(0.2)?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            13: {
                unl() { return player.chal.unl },
                desc: "Mass gain softcap starts 3x later for every Rank you have.",
                cost: E(1e180),
                effect() {
                    let ret = E(3).pow(player.ranks.rank)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
                },
            },
            14: {
                unl() { return player.atom.unl },
                desc: "Hyper Tickspeed starts 50 later.",
                cost: E('e320'),
            },
            15: {
                unl() { return player.atom.unl },
                desc: "Mass boost Atom gain.",
                cost: E('e480'),
                effect() {
                    let ret = player.mass.max(1).log10().pow(1.25)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
                },
            },
        },
        2: {
            title: "Black Hole Upgrades",
            res: "Dark Matter",
            unl() { return player.bh.unl },
            auto_unl() { return player.mainUpg.atom.includes(2) },
            can(x) { return player.bh.dm.gte(this[x].cost) && !player.mainUpg.bh.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.bh.dm = player.bh.dm.sub(this[x].cost)
                    player.mainUpg.bh.push(x)
                }
            },
            lens: 15,
            1: {
                desc: "Mass Upgardes no longer spends mass.",
                cost: E(1),
            },
            2: {
                desc: "Tickspeeds boosts BH Condenser Power.",
                cost: E(10),
                effect() {
                    let ret = player.tickspeed.add(1).root(8)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            3: {
                desc: "Super Mass Upgrade scales later based on mass of Black Hole.",
                cost: E(100),
                effect() {
                    let ret = player.bh.mass.max(1).log10().pow(1.5).softcap(100,1/3,0).floor()
                    return ret.min(400)
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" later"+(x.gte(100)?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            4: {
                desc: "Tiers no longer resets anything.",
                cost: E(1e4),
            },
            5: {
                desc: "You can automatically buy tickspeed and Rage Power upgrades.",
                cost: E(5e5),
            },
            6: {
                desc: "Gain 100% of Rage Power gained from reset per second. Rage Powers are boosted by mass of Black Hole.",
                cost: E(2e6),
                effect() {
                    let ret = player.bh.mass.max(1).log10().add(1).pow(2)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            7: {
                unl() { return player.chal.unl },
                desc: "Mass gain softcap start later based on mass of Black Hole.",
                cost: E(1e13),
                effect() {
                    let ret = player.bh.mass.add(1).root(3)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x later"
                },
            },
            8: {
                unl() { return player.chal.unl },
                desc: "Raise Rage Power gain by 1.15.",
                cost: E(1e17),
            },
            9: {
                unl() { return player.chal.unl },
                desc: "Stronger Effect's softcap start later based on unspent Dark Matters.",
                cost: E(1e27),
                effect() {
                    let ret = player.bh.dm.max(1).log10().pow(0.5)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x)+" later"
                },
            },
            10: {
                unl() { return player.chal.unl },
                desc: "Mass gain is boosted by OoM of Dark Matters.",
                cost: E(1e33),
                effect() {
                    let ret = E(2).pow(player.bh.dm.add(1).log10().softcap(11600,0.5,0))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+(x.max(1).log2().gte(11600)?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            11: {
                unl() { return player.atom.unl },
                desc: "Mass gain softcap is 10% weaker.",
                cost: E(1e80),
            },
            12: {
                unl() { return player.atom.unl },
                desc: "Hyper Mass Upgrade & Tickspeed scales 15% weaker.",
                cost: E(1e120),
            },
            13: {
                unl() { return player.atom.unl },
                desc: "Quark gain is multiplied by 10.",
                cost: E(1e180),
            },
            14: {
                unl() { return player.atom.unl },
                desc: "Neturon Powers boosts mass of Black Hole gain.",
                cost: E(1e210),
                effect() {
                    let ret = player.atom.powers[1].add(1).pow(2)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            15: {
                unl() { return player.atom.unl },
                desc: "Atomic Powers adds Black Hole Condensers at a reduced rate.",
                cost: E('e420'),
                effect() {
                    let ret = player.atom.atomic.add(1).log(5)
                    return ret.floor()
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)
                },
            },
        },
        3: {
            title: "Atom Upgrades",
            res: "Atom",
            unl() { return player.atom.unl },
            can(x) { return player.atom.points.gte(this[x].cost) && !player.mainUpg.atom.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.atom.points = player.atom.points.sub(this[x].cost)
                    player.mainUpg.atom.push(x)
                }
            },
            lens: 12,
            1: {
                desc: "Start with Mass upgrades unlocked.",
                cost: E(1),
            },
            2: {
                desc: "You can automatically buy BH Condenser and upgrades. Tickspeed no longer spent Rage Powers.",
                cost: E(100),
            },
            3: {
                desc: "[Tetr Era] Unlock Tetr.",
                cost: E(25000),
            },
            4: {
                desc: "Keep 1-4 Challenge on reset. BH Condensers adds Gamma Rays Power at a reduced rate.",
                cost: E(1e10),
                effect() {
                    let ret = player.bh.condenser.pow(0.8).mul(0.01)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x)+"x"
                },
            },
            5: {
                desc: "You can automatically Tetr up. Super Tier starts 10 later.",
                cost: E(1e16),
            },
            6: {
                desc: "Gain 100% of Dark Matters gained from reset per second. Mass gain from Black Hole softcap starts later based on Atomic Powers.",
                cost: E(1e18),
                effect() {
                    let ret = player.atom.atomic.add(1).pow(0.5)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x later"
                },
            },
            7: {
                desc: "Tickspeed boost each particle powers gain.",
                cost: E(1e25),
                effect() {
                    let ret = E(1.025).pow(player.tickspeed)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            8: {
                desc: "Atomic Powers boosts Quark gain.",
                cost: E(1e35),
                effect() {
                    let ret = player.atom.atomic.max(1).log10().add(1)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            9: {
                desc: "Stronger effect softcap is 15% weaker.",
                cost: E(2e44),
            },
            10: {
                desc: "Tier requirement is halved. Hyper Rank starts later based on Tiers you have.",
                cost: E(5e47),
                effect() {
                    let ret = player.ranks.tier.mul(2).floor()
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" later"
                },
            },
            11: {
                unl() { return MASS_DILATION.unlocked() },
                desc: "Dilated mass also boost BH Condenser & Gamma Ray powers at a reduced rate.",
                cost: E('e1640'),
                effect() {
                    let ret = player.md.mass.max(1).log10().add(1).pow(0.1)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            12: {
                unl() { return MASS_DILATION.unlocked() },
                desc: "Mass from Black Hole effect is better.",
                cost: E('e2015'),
                effect() {
                    let ret = E(1)
                    return ret
                },
            },
        },
    },
}

/*
1: {
    desc: "Placeholder.",
    cost: E(1),
    effect() {
        let ret = E(1)
        return ret
    },
    effDesc(x=this.effect()) {
        return format(x)+"x"
    },
},
*/

function loop() {
    diff = Date.now()-date;
    updateTemp()
    updateHTML()
    calc(diff/1000*tmp.offlineMult,diff/1000);
    date = Date.now();
    player.offline.current = date
}

function format(ex, acc=4, type=player.options.notation) {
    ex = E(ex)
    neg = ex.lt(0)?"-":""
    if (ex.mag == Infinity) return neg + 'Infinity'
    if (Number.isNaN(ex.mag)) return neg + 'NaN'
    if (ex.lt(0)) ex = ex.mul(-1)
    if (ex.eq(0)) return ex.toFixed(acc)
    let e = ex.log10().floor()
    switch (type) {
        case "sc":
            if (e.lt(4)) {
                return neg+ex.toFixed(Math.max(Math.min(acc-e.toNumber(), acc), 0))
            } else {
                let m = ex.div(E(10).pow(e))
                return neg+(e.log10().gte(9)?'':m.toFixed(4))+'e'+format(e, 0, "sc")
            }
        case "st":
            if (e.lt(3)) {
                return neg+ex.toFixed(Math.max(Math.min(acc-e.toNumber(), acc), 0))
            } else {
                if (e.gte(3e15+3)) return "e"+format(e, acc, "st")
                let str = e.div(3).floor().sub(1).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').split(" ")
                let final = ""
                let m = ex.div(E(10).pow(e.div(3).floor().mul(3)))
                str.forEach((arr, i) => {
                    let ret = ""
                    arr.split('').forEach((v, j) => {
                        if (i == str.length - 1) ret = (Number(arr) < 3 ? ["K", "M", "B"][v] : ST_NAMES[arr.length-j-1][v]) + ret 
                        else if (Number(arr) > 1) ret = ST_NAMES[arr.length-j-1][v] + ret
                    })
                    final += (i > 0 && Number(arr) > 0 ? "-" : "") + ret + (i < str.length - 1 && Number(arr) > 0 ? ST_NAMES[3][str.length-i-1] : "")
                });
                return neg+(e.log10().gte(9)?'':(m.toFixed(E(3).sub(e.sub(e.div(3).floor().mul(3))).add(1).toNumber())+" "))+final
            }
        default:
            return neg+FORMATS[type].format(ex)
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

function formatTime(ex,type="s") {
    ex = E(ex)
    if (ex.gte(86400)) return format(ex.div(86400).floor(),0)+":"+formatTime(ex.mod(86400),'d')
    if (ex.gte(3600)||type=="d") return (ex.div(3600).gte(10)||type!="d"?"":"0")+format(ex.div(3600).floor(),0)+":"+formatTime(ex.mod(3600),'h')
    if (ex.gte(60)||type=="h") return (ex.div(60).gte(10)||type!="h"?"":"0")+format(ex.div(60).floor(),0)+":"+formatTime(ex.mod(60),'m')
    return (ex.gte(10)||type!="m" ?"":"0")+format(ex)
}

function expMult(a,b) { return E(a).gte(1) ? E(10).pow(E(a).log10().pow(b)) : E(0) }

function capitalFirst(str) {
	if (str=="" || str==" ") return str
	return str
		.split(" ")
		.map(x => x[0].toUpperCase() + x.slice(1))
		.join(" ");
}