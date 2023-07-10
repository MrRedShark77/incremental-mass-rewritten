const UPGS = {
    mass: {
        cols: 4,
        temp() {
            tmp.massFP = 1;
            for (let x = this.cols; x >= 1; x--) {
                let d = tmp.upgs.mass
                let data = this.getData(x)
                d[x].cost = data.cost
                d[x].bulk = data.bulk
                
                d[x].bonus = this[x].bonus?this[x].bonus():E(0)
                d[x].eff = this[x].effect(player.massUpg[x]||E(0))
                d[x].effDesc = this[x].effDesc(d[x].eff)
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
            let d = tmp.upgs.mass[x]
            let bulk = d.bulk
            let cost = d.cost
            if (player.mass.gte(cost)) {
                let m = player.massUpg[x]
                if (!m) m = E(0)
                m = m.max(bulk.floor().max(m.plus(1)))
                player.massUpg[x] = m
                if (!player.mainUpg.bh.includes(1)) player.mass = player.mass.sub(cost)
            }
        },
        getData(i) {
            let upg = this[i]
            let inc = upg.inc
            let start = upg.start
            let lvl = player.massUpg[i]||E(0)
            let cost, bulk = E(0), fp

            if (i==4) {
                if (hasInfUpgrade(2)) start = E(1e10)
                let pow = 1.5
                cost = Decimal.pow(10,Decimal.pow(inc,lvl.scaleEvery('massUpg4').pow(pow)).mul(start))
                if (player.mass.gte('ee100')) bulk = player.mass.max(1).log10().div(start).max(1).log(inc).max(0).root(pow).scaleEvery('massUpg4',true).add(1).floor()
            } else {
                fp = tmp.massFP
                
                if (i == 1 && player.ranks.rank.gte(2)) inc = inc.pow(0.8)
                if (i == 2 && player.ranks.rank.gte(3)) inc = inc.pow(0.8)
                if (i == 3 && player.ranks.rank.gte(4)) inc = inc.pow(0.8)
                if (player.ranks.tier.gte(3)) inc = inc.pow(0.8)
                cost = inc.pow(lvl.div(fp).scaleEvery("massUpg")).mul(start)
                bulk = E(0)
                if (player.mass.gte(start)) bulk = player.mass.div(start).max(1).log(inc).scaleEvery("massUpg",true).mul(fp).add(1).floor()
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
                let ret = step.mul(x.add(tmp.upgs.mass[1].bonus))
                if (hasElement(209)) ret = ret.pow(elemEffect(209))
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+formatMass(eff.step),
                    eff: "+"+formatMass(eff.eff)+" to mass gain"
                }
            },
            bonus() {
                let x = E(0)
                if (player.mainUpg.rp.includes(1)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][1].effect:E(0))
                if (player.mainUpg.rp.includes(2)) x = hasAscension(0,1)?x.mul(tmp.upgs.mass[2].bonus.add(1)):x.add(tmp.upgs.mass[2].bonus)
                x = x.mul(getEnRewardEff(4))
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
                let ret = step.mul(x.add(tmp.upgs.mass[2].bonus)).add(1)//.softcap("ee14",0.95,2)
                if (hasElement(203)) ret = ret.pow(elemEffect(203))
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+format(eff.step)+"x",
                    eff: "x"+format(eff.eff)+" to Muscler Power"
                }
            },
            bonus() {
                let x = E(0)
                if (player.mainUpg.rp.includes(2)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][2].effect:E(0))
                if (player.mainUpg.rp.includes(7)) x = hasAscension(0,1)?x.mul(tmp.upgs.mass[3].bonus.add(1)):x.add(tmp.upgs.mass[3].bonus)
                x = x.mul(getEnRewardEff(4))
                return x
            },
        },
        3: {
            unl() { return player.ranks.rank.gte(3) || player.mainUpg.atom.includes(1) },
            title: "Stronger",
            start: E(1000),
            inc: E(9),
            effect(x) {
                let xx = hasAscension(0,1)?x.add(1).mul(tmp.upgs.mass[3].bonus.add(1)):x.add(tmp.upgs.mass[3].bonus)
                if (hasElement(81)) xx = xx.pow(1.1)
                let ss = E(10)
                if (player.ranks.rank.gte(34)) ss = ss.add(2)
                if (player.mainUpg.bh.includes(9)) ss = ss.add(tmp.upgs.main?tmp.upgs.main[2][9].effect:E(0))
                let step = E(1)
                if (player.ranks.tetr.gte(2)) step = step.add(RANKS.effect.tetr[2]())
                if (player.mainUpg.rp.includes(9)) step = step.add(0.25)
                if (player.mainUpg.rp.includes(12)) step = step.add(tmp.upgs.main?tmp.upgs.main[1][12].effect:E(0))
                if (hasElement(4)) step = step.mul(tmp.elements.effect[4])
                if (player.md.upgs[3].gte(1)) step = step.mul(tmp.md.upgs[3].eff)
                step = step.pow(tmp.upgs.mass[4]?tmp.upgs.mass[4].eff.eff:1)

                let sp = 0.5
                if (player.mainUpg.atom.includes(9)) sp *= 1.15
                if (player.ranks.tier.gte(30)) sp *= 1.1
                let sp2 = 0.1
                let ss2 = E(5e15)
                if (hasBeyondRank(7,42)) ss2 = ss2.mul(1.15)
                let sp3 = hasPrestige(0,12)?0.525:0.5
                if (hasElement(85)) {
                    sp2 **= 0.9
                    ss2 = ss2.mul(3)
                }
                if (hasElement(149)) {
                    sp **= 0.5
                    sp3 **= 0.9
                }
                if (hasElement(150)) {
                    sp **= 0.9
                    sp3 **= 0.925
                }
                step = step.softcap(1e43,hasElement(160)?0.85:0.75,0)
                let ret = step.mul(xx.mul(hasElement(80)?25:1)).add(1).softcap(ss,sp,0).softcap(1.8e5,sp3,0)
                ret = ret.mul(tmp.prim.eff[0])
                if (!player.ranks.pent.gte(15)) ret = ret.softcap(ss2,sp2,0)

                let o = ret
                let os = E('e115'), os2 = E('e1555')
                let op = E(.5), op2 = E(0.25)

                if (hasElement(210)) os = os.mul(elemEffect(210))

                if (hasBeyondRank(3,1)) op = op.pow(beyondRankEffect(3,1))
                if (hasElement(289)) {
                    os = os.mul(elemEffect(289))
                    os2 = os2.mul(elemEffect(289))
                }

                ret = overflow(ret,os,op)

                ret = overflow(ret,os2,op2)
                tmp.overflow.stronger = calcOverflow(o,ret,os)
                tmp.overflow_start.stronger = [os,os2]
                tmp.overflow_power.stronger = [op,op2]
                
                return {step: step, eff: ret, ss: ss}
            },
            effDesc(eff) {
                return {
                    step: "+^"+format(eff.step),
                    eff: "^"+format(eff.eff)+" to Booster Power"+(eff.eff.gte(eff.ss)?` <span class='soft'>(softcapped${eff.eff.gte(1.8e5)?eff.eff.gte(5e15)&&!player.ranks.pent.gte(15)?"^3":"^2":""})</span>`:"")
                }
            },
            bonus() {
                let x = E(0)
                if (player.mainUpg.rp.includes(7)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][7].effect:0)
                x = x.mul(getEnRewardEff(4))
                return x
            },
        },
        4: {
            unl() { return hasElement(202) || hasInfUpgrade(2) },
            title: "Overpower",
            start: E(1e100),
            inc: E(1.5),
            effect(i) {
                let xx = hasAscension(0,1)?i.add(1).mul(tmp.upgs.mass[4].bonus.add(1)):i.add(tmp.upgs.mass[4].bonus)
                
                let step = E(.005)
                if (hasUpgrade('rp',17)) step = step.add(.005)
                if (tmp.inf_unl) step = step.add(theoremEff('atom',2,0))

                if (hasUpgrade('rp',19)) step = step.mul(upgEffect(1,19,0))
                if (player.inf.nm) step = step.add(tmp.nm_base_eff)
                let ss = E(10)
                let ss2 = E(50)
                if (hasBeyondRank(7,78)) ss2 = ss2.mul(1.15)
                if (hasBeyondRank(10,1)) ss2 = ss2.mul(beyondRankEffect(10,1))
                let x = step.mul(xx).add(1).softcap(ss,0.5,0).softcap(ss2,0.15,0)
                
                return {step: step, eff: x, ss: ss, ss2: ss2}
            },
            effDesc(eff) {
                return {
                    step: "+^"+format(eff.step),
                    eff: "^"+format(eff.eff)+" to Stronger Power"+(eff.eff.gte(eff.ss)?` <span class='soft'>(softcapped${eff.eff.gte(eff.ss2)?"^2":""})</span>`:"")
                }
            },
            bonus() {
                let x = E(0)
                if (hasUpgrade('atom',20)) x = x.add(upgEffect(3,20))
                if (tmp.inf_unl) x =x.add(theoremEff('proto',5))
                return x
            },
        },
    },
    main: {
        temp() {
            for (let x = 1; x <= this.cols; x++) {
                for (let y = 1; y <= this[x].lens; y++) {
                    let u = this[x][y]
                    if (u.effDesc) tmp.upgs.main[x][y] = { effect: u.effect(), effDesc: u.effDesc() }
                }
            }
        },
        ids: [null, 'rp', 'bh', 'atom', 'br'],
        cols: 4,
        over(x,y) { player.main_upg_msg = [x,y] },
        reset() { player.main_upg_msg = [0,0] },
        1: {
            title: "Rage Upgrades",
            res: "Rage Power",
            getRes() { return player.rp.points },
            unl() { return player.rp.unl },
            can(x) { return player.rp.points.gte(this[x].cost) && !player.mainUpg.rp.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.rp.points = player.rp.points.sub(this[x].cost)
                    player.mainUpg.rp.push(x)
                }
            },
            auto_unl() { return player.mainUpg.bh.includes(5) || tmp.inf_unl },
            lens: 20,
            1: {
                desc: "Boosters add Musclers.",
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
                desc: "Strongers add Boosters.",
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
                desc: "You can automatically buy mass upgrades.",
                cost: E(25),
            },
            4: {
                desc: "Ranks no longer reset anything.",
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
                desc: "For every 3 tickspeeds add Stronger.",
                cost: E(1e7),
                effect() {
                    let ret = hasAscension(0,1)?player.tickspeed.div(3).add(1).mul(hasElement(38)?tmp.elements.effect[38].add(1):1):player.tickspeed.div(3).add(hasElement(38)?tmp.elements.effect[38]:0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Stronger"
                },
            },
            8: {
                desc: "Super and Hyper mass upgrade scalings are weaker based on Rage Power.",
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
                desc: "Stronger power is increased by +^0.25.",
                cost: E(1e31),
            },
            10: {
                unl() { return player.bh.unl },
                desc: "Super Rank scaling is 20% weaker.",
                cost: E(1e43),
            },
            11: {
                unl() { return player.chal.unl },
                desc: "Black Hole mass's gain is boosted by Rage Point.",
                cost: E(1e72),
                effect() {
                    let ret = player.rp.points.add(1).root(10).softcap('e4000',0.1,0)
                    return overflow(ret.softcap("e1.5e31",0.95,2),'ee185',0.5)
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+(x.gte("e4000")?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            12: {
                unl() { return player.chal.unl },
                desc: "OoMs of Rage powers increase stronger power at a reduced rate.",
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
                desc: "Mass boosts Atom gain.",
                cost: E('e480'),
                effect() {
                    let ret = player.mass.max(1).log10().pow(1.25)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
                },
            },
            16: {
                unl() { return tmp.moreUpgs || tmp.inf_unl },
                desc: `Remove tickspeed power's softcap.`,
                cost: E('e1.8e91'),
            },
            17: {
                unl() { return tmp.mass4Unl || tmp.inf_unl },
                desc: `Overpower power is increased by 0.005.`,
                cost: E('e7.75e116'),
            },
            18: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Fading matter's upgrade applies to rage powers gain at a reduce rate.`,
                cost: E('e1.5e128'),
                effect() {
                    let x = Decimal.pow(10,tmp.matters.upg[12].eff.max(1).log10().pow(.8))
                    return overflow(x,1e20,0.5)
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            19: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Supernovas boost overpower power.`,
                cost: E('e6e144'),
                effect() {
                    let x = player.supernova.times.add(1).log10().div(10).add(1)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
                },
            },
            20: {
                unl() { return player.dark.exotic_atom.tier>0 || tmp.inf_unl },
                desc: `Corrupted Shards boost normal mass gain.`,
                cost: E('e2e357'),
                effect() {
                    let x = player.dark.c16.totalS.add(1)
                    return overflow(x,10,0.5).pow(2)
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
        },
        2: {
            title: "Black Hole Upgrades",
            res: "Dark Matter",
            getRes() { return player.bh.dm },
            unl() { return player.bh.unl },
            auto_unl() { return player.mainUpg.atom.includes(2) || tmp.inf_unl },
            can(x) { return player.bh.dm.gte(this[x].cost) && !player.mainUpg.bh.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.bh.dm = player.bh.dm.sub(this[x].cost)
                    player.mainUpg.bh.push(x)
                }
            },
            lens: 20,
            1: {
                desc: "Mass Upgardes no longer spend mass.",
                cost: E(1),
            },
            2: {
                desc: "Tickspeeds boost BH Condenser Power.",
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
                desc: "Tiers no longer reset anything.",
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
                desc: "Mass gain softcap starts later based on mass of Black Hole.",
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
                desc: "Stronger Effect's softcap starts later based on unspent Dark Matters.",
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
                desc: "Hyper Tickspeed scales 15% weaker.",
                cost: E(1e120),
            },
            13: {
                unl() { return player.atom.unl },
                desc: "Quark gain is multiplied by 10.",
                cost: E(1e180),
            },
            14: {
                unl() { return player.atom.unl },
                desc: "Neutron Powers boost mass of Black Hole gain.",
                cost: E(1e210),
                effect() {
                    let ret = player.atom.powers[1].add(1).pow(2)
                    return overflow(ret,'ee108',0.25).min('ee110')
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            15: {
                unl() { return player.atom.unl },
                desc: "Atomic Powers add Black Hole Condensers at a reduced rate.",
                cost: E('e420'),
                effect() {
                    let ret = player.atom.atomic.add(1).log(5).softcap(2e9,0.25,0).softcap(1e10,0.1,0)
                    return ret.floor()
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)
                },
            },
            16: {
                unl() { return tmp.moreUpgs || tmp.inf_unl },
                desc: `Red matter's upgrade applies to mass gain at a reduced rate.`,
                cost: E('e5e101'),
                effect() {
                    let x = tmp.matters.upg[0].eff.max(1).pow(0.75)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            17: {
                unl() { return tmp.moreUpgs || tmp.inf_unl },
                desc: `Violet matter's upgrade applies to collapsed stars at a reduced rate.`,
                cost: E('e4e113'),
                effect() {
                    let x = tmp.matters.upg[4].eff.max(1).log10().add(1).pow(2)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            18: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Make black hole's effect stronger.`,
                cost: E('e1.5e156'),
            },
            19: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Mass of black hole boosts accelerator power at an extremely reduced rate.`,
                cost: E('e3e201'),
                effect() {
                    let x = player.bh.mass.add(1).log10().add(1).log10().add(1).root(6)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
                },
            },
            20: {
                unl() { return player.dark.c16.first || tmp.inf_unl },
                desc: `Corrupted Shards boost mass of black hole gain.`,
                cost: E('e1e273'),
                effect() {
                    let x = player.dark.c16.totalS.add(1)
                    return overflow(x,10,0.5).pow(3)
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
        },
        3: {
            title: "Atom Upgrades",
            res: "Atom",
            getRes() { return player.atom.points },
            unl() { return player.atom.unl },
            can(x) { return player.atom.points.gte(this[x].cost) && !player.mainUpg.atom.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.atom.points = player.atom.points.sub(this[x].cost)
                    player.mainUpg.atom.push(x)
                }
            },
            auto_unl() { return hasTree("qol1") || tmp.inf_unl },
            lens: 20,
            1: {
                desc: "Start with Mass upgrades unlocked.",
                cost: E(1),
            },
            2: {
                desc: "You can automatically buy BH Condenser and upgrades. Tickspeed no longer spends Rage Powers.",
                cost: E(100),
            },
            3: {
                desc: "[Tetr Era] Unlock Tetr.",
                cost: E(25000),
            },
            4: {
                desc: "Keep challenges 1-4 on reset. BH Condensers add Cosmic Rays Power at a reduced rate.",
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
                desc: "Tickspeed boosts each particle powers gain.",
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
                desc: "Atomic Powers boost Quark gain.",
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
                desc: "Dilated mass also boosts BH Condenser & Cosmic Ray powers at a reduced rate.",
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
            },
            13: {
                unl() { return (player.md.break.active && player.qu.rip.active) || hasElement(128) },
                desc: "Cosmic Ray effect softcap starts x10 later.",
                cost: E('e3.2e11'),
            },
            14: {
                unl() { return (player.md.break.active && player.qu.rip.active) || hasElement(128) },
                desc: "Tickspeed, Black Hole Condenser and Cosmic Ray scalings up to Meta start x10 later.",
                cost: E('e4.3e13'),
            },
            15: {
                unl() { return (player.md.break.active && player.qu.rip.active) || hasElement(128) },
                desc: "Reduce Cosmic Ray scaling by 20%.",
                cost: E('e3.4e14'),
            },
            16: {
                unl() { return tmp.moreUpgs || tmp.inf_unl },
                desc: `Quark Overflow starts ^10 later.`,
                cost: E('e3e96'),
            },
            17: {
                unl() { return tmp.moreUpgs || tmp.inf_unl },
                desc: `Pink matter's upgrade applies to quark gain at a reduced rate.`,
                cost: E('e7.45e98'),
                effect() {
                    let x = tmp.matters.upg[2].eff.max(1).log10().add(1)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            18: {
                unl() { return tmp.mass4Unl || tmp.inf_unl },
                desc: `Neutron Power's second effect now provides an expontial boost and applies to mass of black hole.`,
                cost: E('e4.2e120'),
            },
            19: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Yellow matter's upgrade applies to dilated mass overflow at a reduced rate.`,
                cost: E('e8e139'),
                effect() {
                    let x = expMult(tmp.matters.upg[9].eff,1/3)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)+" later"
                },
            },
            20: {
                unl() { return player.dark.c16.first || tmp.inf_unl },
                desc: `Atomic Powers add Overpowers at an extremely reduced rate.`,
                cost: E('e2.7e186'),
                effect() {
                    let x = player.atom.atomic.add(1).log10().add(1).log10().root(2)
                    return overflow(x,10,0.5).floor()
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)
                },
            },
        },
        4: {
            title: "Big Rip Upgrades",
            res: "Death Shard",
            getRes() { return player.qu.rip.amt },
            unl() { return player.qu.rip.first },
            can(x) { return player.qu.rip.amt.gte(this[x].cost) && !player.mainUpg.br.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.qu.rip.amt = player.qu.rip.amt.sub(this[x].cost)
                    player.mainUpg.br.push(x)
                }
            },
            auto_unl() { return hasElement(132) || tmp.inf_unl },
            lens: 20,
            1: {
                desc: `Start with Hydrogen-1 unlocked in Big Rip.`,
                cost: E(5),
            },
            2: {
                desc: `Mass Upgrades & Ranks are no longer nerfed by 8th QC modifier.`,
                cost: E(10),
            },
            3: {
                desc: `Pre-Quantum Global Speed is raised based on Death Shards (before division).`,
                cost: E(50),
                effect() {
                    let x = player.qu.rip.amt.add(1).log10().div(25).add(1)
                    return x.softcap(30,0.5,0)
                },
                effDesc(x=this.effect()) { return "^"+format(x)+x.softcapHTML(30) },
            },
            4: {
                desc: `Start with 2 tiers of each Fermion in Big Rip.`,
                cost: E(250),
            },
            5: {
                desc: `Root Star Booster’s starting cost by 10. Star Booster’s base is increased based on Death Shards.`,
                cost: E(2500),
                effect() {
                    let x = player.qu.rip.amt.add(1).log10().add(1).pow(3)
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            6: {
                desc: `Start with all Radiation features unlocked.`,
                cost: E(15000),
            },
            7: {
                desc: `Hybridized Uran-Astatine is twice as effective in Big Rip.`,
                cost: E(100000),
            },
            8: {
                desc: `Passively gain 10% of Quantum Foams & Death Shards you would get from resetting each second.`,
                cost: E(750000),
            },
            9: {
                desc: `Unlock Break Dilation and Prestige (in the mass tab).`,
                cost: E(1e7),
            },
            10: {
                unl() { return player.md.break.active || tmp.inf_unl },
                desc: `Chromas are 10% stronger.`,
                cost: E(2.5e8),
            },
            11: {
                unl() { return player.md.break.active || tmp.inf_unl },
                desc: `Prestige Level no longer resets anything.`,
                cost: E(1e10),
            },
            12: {
                unl() { return player.md.break.active || tmp.inf_unl },
                desc: `Mass gain softcap^5 starts later based on Atom.`,
                cost: E(1e16),
                effect() {
                    let x = player.atom.points.add(1).log10().add(1).log10().add(1).root(3)
                    return x
                },
                effDesc(x=this.effect()) { return "^"+format(x)+" later" },
            },
            13: {
                unl() { return player.md.break.active || tmp.inf_unl },
                desc: `Death Shard gain is boosted based on Prestige Base.`,
                cost: E(1e17),
                effect() {
                    let x = (tmp.prestiges.base||E(1)).add(1).log10().tetrate(1.5).add(1)
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            14: {
                unl() { return player.md.break.active || tmp.inf_unl },
                desc: `Super Fermion Tier starts 10 later (after QC8 nerf).`,
                cost: E(1e22),
            },
            15: {
                unl() { return player.md.break.active || tmp.inf_unl },
                desc: `Blueprint Particles boost Pre-Quantum Global Speed slightly.`,
                cost: E(1e24),
            },
            16: {
                unl() { return tmp.moreUpgs || tmp.inf_unl },
                desc: `Unsoftcap the first effect from Alpha, Omega & Sigma particles. They're stronger.`,
                cost: E(1e273),
            },
            17: {
                unl() { return tmp.mass4Unl || tmp.inf_unl },
                desc: `Dark matter raises atoms gain at a reduced rate.`,
                cost: E('e386'),
                effect() {
                    let x = Decimal.pow(1.1,player.bh.dm.add(1).log10().add(1).log10())
                    return x
                },
                effDesc(x=this.effect()) { return "^"+format(x) },
            },
            18: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Chromas gain is boosted by mass.`,
                cost: E('e408'),
                effect() {
                    let x = Decimal.pow(2,player.mass.add(1).log10().add(1).log10().pow(1.5))
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            19: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Red Matters reduce Pre-Renown requirements slightly.`,
                cost: E('e463'),
                effect() {
                    let x = player.dark.matters.amt[0].add(1).log10().add(1).log10().add(1).log10().div(60).add(1).toNumber()
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x)+" cheaper" },
            },
            20: {
                unl() { return player.dark.c16.first || tmp.inf_unl },
                desc: `Total corrupted Shards boost dark rays gain.`,
                cost: E('e784'),
                effect() {
                    let x = player.dark.c16.totalS.add(1)
                    return overflow(x,10,0.5).pow(1.25)
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
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

function hasUpgrade(id,x) { return player.mainUpg[id].includes(x) }
function upgEffect(id,x,def=E(1)) { return tmp.upgs.main[id][x]?tmp.upgs.main[id][x].effect:def }
function resetMainUpgs(id,keep=[]) {
    let k = []
    let id2 = UPGS.main.ids[id]
    for (let x = 0; x < player.mainUpg[id2].length; x++) if (keep.includes(player.mainUpg[id2][x])) k.push(player.mainUpg[id2][x])
    player.mainUpg[id2] = k
}