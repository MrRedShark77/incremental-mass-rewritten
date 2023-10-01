/* BUILDINGS.JS: ORIGINAL BY AAREX, EDITED BY MRREDSHARK77 */

const BUILDINGS_DATA = {
    mass_1: {
        name: "Muscler",
		icon: "mass_upg1",
        scale: "massUpg",

        get isUnlocked() { return player.ranks.rank.gte(1) || hasUpgrade("atom",1) },
        get autoUnlocked() { return EVO.amt >= 1 || hasUpgrade('rp',3) },
        get noSpend() { return hasUpgrade('bh',1) },

        get res() { return player.mass },
        set res(v) { player.mass = v },

        cost(x=this.level) { return getMassUpgradeCost(1, x) },
        get bulk() { return getMassUpgradeBulk(1, this.res) },

        get_cost: x => formatMass(x),

        get beMultiplicative() { return hasAscension(0,1) },

        effect(x) {
            let power = E(2)
            if (player.ranks.rank.gte(3)) power = power.add(RANKS.effect.rank[3]())
            power = power.mul(BUILDINGS.eff('mass_2'))
            power = power.mul(tmp.evo.meditation_eff.mass1??1)

            let effect = power.mul(x)
            if (hasElement(209)) effect = effect.pow(elemEffect(209))

            return {power, effect}
        },

        get bonus() {
            let x = E(0)
			if (hasUpgrade("rp",1)) {
				x = x.add(upgEffect(1,1,0))
				if (hasUpgrade("rp",2)) x = hasAscension(0,1)?x.mul(tmp.build.mass_2.bonus.add(1)):x.add(tmp.build.mass_2.bonus)
			}
            x = x.mul(getEnRewardEff(4))
            return x
        },

        get_power: x => "+"+formatMass(x.power),
        get_effect: x => "+"+formatMass(x.effect)+" to mass gain",
    },
    mass_2: {
        name: "Booster",
		icon: "mass_upg2",
        scale: "massUpg",

        get isUnlocked() { return player.ranks.rank.gte(2) || hasUpgrade("atom",1) },
        get autoUnlocked() { return EVO.amt >= 1 || hasUpgrade('rp',3) },
        get noSpend() { return hasUpgrade('bh',1) },

        get res() { return player.mass },
        set res(v) { player.mass = v },

        cost(x=this.level) { return getMassUpgradeCost(2, x) },
        get bulk() { return getMassUpgradeBulk(2, this.res) },

        get_cost: x => formatMass(x),

        get beMultiplicative() { return hasAscension(0,1) },

        effect(x) {
            let step = E(2)
            if (player.ranks.rank.gte(5)) step = step.add(RANKS.effect.rank[5]())
            step = step.mul(tmp.evo.meditation_eff.mass2??1)
            step = step.mul(wormholeEffect(1))
            step = step.pow(BUILDINGS.eff('mass_3'))

            let ret = step.mul(x).add(1)
            if (hasElement(203)) ret = ret.pow(elemEffect(203))

            return {power: step, effect: ret}
        },

        get bonus() {
            let x = E(0)
            if (hasUpgrade("rp",2)) x = x.add(upgEffect(1,2,0))
            if (hasUpgrade("rp",7)) x = hasAscension(0,1)?x.mul(tmp.build.mass_3.bonus.add(1)):x.add(tmp.build.mass_3.bonus)
            x = x.mul(getEnRewardEff(4))
            return x
        },

        get_power: x => "+"+format(x.power)+"x",
        get_effect: x => formatMult(x.effect)+" to Muscler Power",
    },
    mass_3: {
        name: "Stronger",
		icon: "mass_upg3",
        scale: "massUpg",

        get isUnlocked() { return player.ranks.rank.gte(3) || hasUpgrade("atom",1) },
        get autoUnlocked() { return EVO.amt >= 1 || hasUpgrade('rp',3) },
        get noSpend() { return hasUpgrade('bh',1) },

        get res() { return player.mass },
        set res(v) { player.mass = v },

        cost(x=this.level) { return getMassUpgradeCost(3, x) },
        get bulk() { return getMassUpgradeBulk(3, this.res) },

        get_cost: x => formatMass(x),

        forceEffect: true,

        get beMultiplicative() { return hasAscension(0,1) },

        effect(x) {
            let post_x = hasElement(8,1) && EVO.amt >= 2
            if (hasElement(81)) x = x.pow(1.1)
			if (EVO.amt < 2 && hasElement(80)) x = x.mul(hasElement(80)?25:1)

			let ss = E(10)
            if (player.ranks.rank.gte(34)) ss = ss.add(2)
            if (hasUpgrade("bh",9)) ss = ss.add(upgEffect(2,9,0))

            let step = E(1)
            if (player.ranks.tetr.gte(2)) step = step.add(RANKS.effect.tetr[2]())
            if (hasUpgrade("rp",9)) step = step.add(0.25)
            if (hasUpgrade("rp",12)) step = step.add(upgEffect(1,12,0))
            if (EVO.amt >= 1) step = step.mul(tmp.evo.meditation_eff.mass3??1)
            if (hasElement(4)) step = step.mul(elemEffect(4))
            if (hasMDUpg(3)) step = step.mul(mdEff(3))
			step = step.mul(nebulaEff("red"))
            step = step.pow(BUILDINGS.eff('mass_4'))

            let sp = 0.5
            if (hasUpgrade("atom",9)) sp *= 1.15
            if (player.ranks.tier.gte(30)) sp *= 1.1
            let sp2 = 0.1
            let ss2 = E(5e15)
            let sp3 = hasPrestige(0,12)?0.525:0.5
            if (hasElement(85)) {
                sp2 **= 0.9
                ss2 = ss2.mul(3)
            }
            if (hasElement(149) && EVO.amt < 2) {
                sp **= 0.5
                sp3 **= 0.9
            }
            if (hasElement(150) && EVO.amt < 2) {
                sp **= 0.9
                sp3 **= 0.925
            }
            if (EVO.amt) {
                let w = tmp.evo.meditation_eff.mass3_softcap??1
                sp = Decimal.pow(sp,w)
                sp2 = Decimal.pow(sp2,w)
                sp3 = Decimal.pow(sp3,w)
            }
			if (EVO.amt < 2) step = step.softcap(1e43,hasElement(160)?0.85:0.75,0)

            let ret = step.mul(post_x ? 1 : x).add(1).softcap(ss,sp,0).softcap(1.8e5,sp3,0)
            ret = ret.mul(tmp.qu.prim.eff[0])
			if (QCs.active() && EVO.amt >= 4) ret = ret.mul(tmp.qu.qc.eff[9])
            if (!player.ranks.pent.gte(15)) ret = ret.softcap(ss2,sp2,0)

            let o = ret
            let os = E(EVO.amt >= 2 ? 'e70' : 'e115').mul(getFragmentEffect('mass')), os2 = E(EVO.amt >= 2 ? 'e600' : 'e1555')
            let op = E(.5), op2 = E(0.25)
            if (hasElement(210)) os = os.mul(elemEffect(210))
            if (hasElement(27,1)) {
                let w = muElemEff(27)
                os = os.mul(w)
                os2 = os2.mul(w)
            }
            if (tmp.inf_unl) {
                os = os.mul(GPEffect(6))
                os2 = os2.mul(GPEffect(6))
            }
            if (hasBeyondRank(3,1)) op = op.pow(beyondRankEffect(3,1))
            if (hasElement(264)) {
                let w = elemEffect(264)
                op = op.pow(w)
                op2 = op2.pow(w)
            }
            if (hasUpgrade('rp',23)) {
                op = op.pow(0.85)
                op2 = op2.pow(0.85)
            }
            if (tmp.inf_unl && EVO.amt >= 4) op = op.pow(theoremEff("mass", 4))

            ret = overflow(ret,os,op)
            ret = overflow(ret,os2,op2)

            tmp.overflow.stronger = calcOverflow(o,ret,os)
            tmp.overflow_start.stronger = [os,os2]
            tmp.overflow_power.stronger = [op,op2]
			if (post_x) ret = ret.mul(x.div(tmp.c16.in ? 1 : 1e135).max(1).sqrt())

            return {power: step, effect: ret, ss}
        },

        get bonus() {
            let x = E(0)
            if (hasUpgrade("rp",7)) x = x.add(upgEffect(1,7,0))
            x = x.mul(getEnRewardEff(4))
            return x
        },

        get_power: x => "+^"+format(x.power),
        get_effect: x => formatPow(x.effect)+" to Booster Power"+(x.effect.gte(x.ss)?` <span class='soft'>(softcapped${x.effect.gte(1.8e5)?x.effect.gte(5e15)&&!player.ranks.pent.gte(15)?"^3":"^2":""})</span>`:""),
    },
    mass_4: {
        name: "Overpower",
		icon: "mass_upg4",
        scale: "massUpg4",

        get isUnlocked() { return hasElement(202) || hasInfUpgrade(2) },
        get autoUnlocked() { return true },
        get noSpend() { return true },

        get res() { return player.mass },
        set res(v) { player.mass = v },

        cost(x=this.level) { return getMassUpgradeCost(4, x) },
        get bulk() { return getMassUpgradeBulk(4, this.res) },

        get_cost: x => formatMass(x),

        effect(x) {
            let step = E(.005)
            if (hasUpgrade('rp',17)) step = step.add(.005)
            if (tmp.inf_unl) step = step.add(theoremEff('atom',2,0))
            if (hasUpgrade('rp',19)) step = step.mul(upgEffect(1,19,0))

            let ss = EVO.amt >= 4 ? EINF : E(10)
            let eff = step.mul(x).add(1).softcap(ss,0.5,0)                
            return {power: step, effect: eff, ss}
        },

        get bonus() {
            return hasUpgrade('atom',20) ? upgEffect(3,20,0) : E(0)
        },

        get_power: x => "+^"+format(x.power,4),
        get_effect: x => formatPow(x.effect,4)+" to Stronger Power"+x.effect.softcapHTML(x.ss),
    },
    tickspeed: {
        name: "Tickspeed",
		icon: "tickspeed",
        scale: "tickspeed",

        get isUnlocked() { return tmp.rp.unl },
        get autoUnlocked() { return hasUpgrade("bh",5) },
        get noSpend() { return hasUpgrade("atom",2) },

        get allowPurchase() { return !CHALS.inChal(2) && !CHALS.inChal(6) && !CHALS.inChal(10) },
        get res() { return player.rp.points },
        set res(v) { player.rp.points = v },

        cost(x=this.level) {
            let fp = E(1)

            if (hasElement(248)) fp = fp.mul(getEnRewardEff(0))

            return Decimal.pow(2,x.div(fp).scaleEvery('tickspeed'))
        },
        get bulk() {
            let fp = E(1)

            if (hasElement(248)) fp = fp.mul(getEnRewardEff(0))

            return this.res.max(1).log(2).scaleEvery('tickspeed',true).mul(fp).add(1).floor()
        },
        get_cost: x => format(x,0) + " Rage Power",
        get beMultiplicative() { return hasAscension(0,1) },

        effect(x) {
            let t = x, step = E(1), ss = E(1e50), eff = E(1), eff_bottom = E(1)

            if (CHALS.inChal(17)) return {power: step, effect: eff, ss, eff_bottom}

            if (hasElement(63)) t = t.mul(25)
            t = t.mul(tmp.qu.prim.eff[1][1])
            t = t.mul(radBoostEff(1))

            step = E(1.5)
            step = step.add(tmp.chal.eff[6])
            step = step.add(tmp.chal.eff[2])
            if (tmp.atom.unl) step = step.add(tmp.atom.particles[0].powerEffect.eff2)
            if (player.ranks.tier.gte(4)) step = step.add(RANKS.effect.tier[4]())
            if (player.ranks.rank.gte(40)) step = step.add(RANKS.effect.rank[40]())
            if (tmp.sn.boson) step = step.mul(tmp.sn.boson.effect.z_boson[0])
            if (tmp.atom.unl) step = tmp.md.bd3 ? step.pow(tmp.md.mass_eff) : step.mul(tmp.md.mass_eff)
            if (hasElement(191)) step = step.pow(elemEffect(191))
            if (tmp.sn.boson) step = step.pow(tmp.qu.chroma_eff[0])
            if (hasTree("t1")) step = step.pow(1.15)

            ss = ss.mul(radBoostEff(13))
            let p = 0.1
            if (hasElement(86)) {
                ss = ss.pow(2)
                p **= 0.5
            }
            if (hasPrestige(0,6)) ss = ss.pow(100)
            if (hasElement(102)) ss = ss.pow(100)
            step = step.softcap(ss,p,0,hasUpgrade('rp',16))

            if (hasBeyondRank(2,4)) step = step.pow(BUILDINGS.eff('accelerator'))
            if (hasBeyondRank(3,32)) step = step.pow(elemEffect(18))            
            eff = step.pow(t.mul(hasElement(80)?25:1))

            if (!hasElement(199) || CHALS.inChal(15)) {
                if (hasElement(18)) eff = eff.pow(elemEffect(18))
                if (player.ranks.tetr.gte(3)) eff = eff.pow(1.05)
                if (hasElement(150)) eff = expMult(eff,1.6)
            }

            eff_bottom = eff
			if (hasElement(199) && !CHALS.inChal(15)){
				eff = eff.add(9).log10().add(9).log10().pow(BUILDINGS.eff('accelerator').mul(0.1));
				eff_bottom = eff_bottom.pow(BUILDINGS.eff('accelerator'));
				if (player.ranks.tetr.gte(3)) eff = eff.pow(1.05),eff_bottom = eff_bottom.pow(1.05);
			}
            return {power: step, effect: eff, ss, eff_bottom}
        },

        get bonus() {
            let x = E(0)
            if (tmp.atom.unl) x = x.add(tmp.atom.atomicEff[0])
            x = x.mul(getEnRewardEff(4))
            return x
        },

        get_power(x) {
			let r = E(x.power || 1)
			return (r.gte(10) ? formatMult(r) : formatPercent(r.sub(1))) + r.softcapHTML(x.ss, hasUpgrade('rp',16))
		},
        get_effect: x => (hasElement(199) && !CHALS.inChal(15) ? formatPow(x.effect) : formatMult(x.effect)) + " to mass gain",
    },
    accelerator: {
        name: "Accelerator",
		icon: "accelerator",

        get isUnlocked() { return tmp.rp.unl && hasElement(199) },
        get autoUnlocked() { return true },
        get noSpend() { return true },

        get res() { return player.rp.points },
        set res(v) { player.rp.points = v },

        cost(x=this.level) {
            return E(10).pow(Decimal.pow(1.5,x))
        },
        get bulk() {
            return this.res.max(1).log10().max(1).log(1.5).add(1).floor()
        },

        get_cost: x => format(x,0) + " Rage Power",

        effect(x) {
            let step = E(0.0004)
            if (tmp.inf_unl) step = step.add(theoremEff('atom',3,0))
            step = step.mul(tmp.dark.abEff.accelPow||1)
            if (hasElement(205)) step = step.mul(elemEffect(205))
            if (hasUpgrade('bh',19)) step = step.mul(upgEffect(2,19))
            if (CHALS.inChal(17)) step = E(0)

            let ss = E(100), sp = 0.5
            if (hasElement(259)) sp = 0.56

            let eff = x.mul(step).add(1)
            eff = overflow(eff,ss,sp).overflow(25000,hasBeyondRank(20,1) ? 0.4 : 1/3)
            return {power: step, effect: eff, ss}
        },

        get bonus() {
            let x = E(0)

            return x
        },

        get_power: x => "+^"+format(x.power),
        get_effect: x => formatPow(x.effect)+" to Tickspeed Effect"+E(x.effect).softcapHTML(x.ss),
    },
    bhc: {
        name: "Black Hole Condenser",
		icon: "bhCondenser",
        scale: "bh_condenser",

        get isUnlocked() { return tmp.bh.unl },
        get autoUnlocked() { return hasUpgrade("atom",2) },
        get noSpend() { return player.atom.unl },

        get allowPurchase() { return !CHALS.inChal(6) && !CHALS.inChal(10) },

        get res() { return player.bh.dm },
        set res(v) { player.bh.dm = v },

        cost(x=this.level) {
            let fp = hasCharger(6) ? 1 : fermEff(1, 5)
            if (hasCharger(6) && tmp.c16.in) fp *= 1e6

            let fp2 = E(1)
            if (hasElement(248)) fp2 = fp2.mul(getEnRewardEff(0))

            return Decimal.pow(1.75,x.div(fp2).scaleEvery('bh_condenser',false,[1,1,1,fp]))
        },
        get bulk() {
            let fp = hasCharger(6) ? 1 : fermEff(1, 5)
            if (hasCharger(6) && tmp.c16.in) fp *= 1e6

            let fp2 = E(1)

            if (hasElement(248)) fp2 = fp2.mul(getEnRewardEff(0))

            return this.res.max(1).log(1.75).scaleEvery('bh_condenser',true,[1,1,1,fp]).mul(fp2).add(1).floor()
        },

        get_cost: x => format(x,0) + " Dark Matter",

        get beMultiplicative() { return hasAscension(0,42) },

        effect(x) {
            let pow = E(2)
			pow = pow.add(tmp.chal.eff[6])
			if (hasUpgrade("bh",2)) pow = pow.mul(upgEffect(2,2))
			if (tmp.atom.unl) pow = pow.add(tmp.atom.particles[2].powerEffect.eff2)
			if (hasUpgrade("atom",11)) pow = pow.mul(upgEffect(3,11))
			if (tmp.sn.boson) pow = pow.mul(tmp.sn.boson.upgs.photon[1].effect)
			pow = pow.mul(tmp.qu.prim.eff[2][1])
			pow = pow.mul(getEnRewardEff(3)[1])
			pow = pow.mul(escrowBoost("bhc"))
			if (hasTree('bs5')) pow = pow.mul(tmp.sn.boson.effect.z_boson[0])
			if (hasTree("bh2")) pow = pow.pow(1.15)
            if (hasElement(129)) pow = pow.pow(elemEffect(18))
            if (hasBeyondRank(2,4)) pow = pow.pow(BUILDINGS.eff('accelerator'))            
            if (CHALS.inChal(17)) pow = E(1)

            x = x.mul(radBoostEff(5))
            let eff = pow.pow(x)

            let os = tmp.c16.in ? E('ee150') : E('ee10000'), op = E(0.5), o = eff
            if (hasUpgrade('bh',21)) os = expMult(os, 2)
            eff = overflow(eff,os,op,2)
            tmp.overflow.BHCEffect = calcOverflow(o,eff,os,2)
            tmp.overflow_start.BHCEffect = [os]
            return {power: pow, effect: eff}
        },

        get bonus() {
            let x = E(0)
            if (hasUpgrade("bh",15)) x = x.add(upgEffect(2,15,0))
            x = x.mul(getEnRewardEff(4))
            return x
        },

        get_power: x => formatMult(x.power),
        get_effect: x => formatMult(x.effect)+" to mass of black hole",
    },
    fvm: {
        name: "False Vacuum Manipulator",
		icon: "fvm",
        scale: "fvm",

        get isUnlocked() { return tmp.bh.unl && hasCharger(1) },
        get autoUnlocked() { return true },
        get noSpend() { return true },

        get allowPurchase() { return tmp.c16.in || hasElement(277) },
        denyPurchaseText: " outside C16",

        get res() { return player.bh.dm },
        set res(v) { player.bh.dm = v },

        cost(x=this.level) {
            let p = 1.5
            if (hasBeyondRank(1,137)) p **= 0.8

            return E(10).pow(x.scaleEvery('fvm',false).pow(p)).mul(1e300)
        },
        get bulk() {
            let p = 1.5
            if (hasBeyondRank(1,137)) p **= 0.8

            return this.res.div(1e300).max(1).log10().root(p).scaleEvery('fvm',true).add(1).floor()
        },

        get_cost: x => format(x,0) + " Dark Matter",

        effect(x) {
            let lvl = x

            let pow = E(2)

            if (hasPrestige(2,28)) pow = pow.mul(prestigeEff(2,28))

            if (tmp.inf_unl) pow = pow.mul(theoremEff('bh',3))

            let eff = pow.pow(lvl)

            return {power: pow, effect: eff}
        },

        get bonus() {
            let x = E(0)

            return x
        },

        get_power: x => formatMult(x.power),
        get_effect: x => formatMult(x.effect)+" to Unstable BH production speed",
    },
    cosmic_ray: {
        name: "Cosmic Ray",
		icon: "gamma_ray",
        scale: "gamma_ray",

        get isUnlocked() { return player.atom.unl && EVO.amt < 3 },
        get autoUnlocked() { return hasElement(18) },
        get noSpend() { return hasElement(18) },

        get res() { return player.atom.points },
        set res(v) { player.atom.points = v },

        cost(x=this.level) {
            let fp = fermEff(1, 5)

            let fp2 = E(1)

            if (hasElement(248)) fp2 = fp2.mul(getEnRewardEff(0))

            return Decimal.pow(2,x.div(fp2).scaleEvery("gamma_ray",false,[1,1,1,fp]))
        },
        get bulk() {
            let fp = fermEff(1, 5)

            let fp2 = E(1)

            if (hasElement(248)) fp2 = fp2.mul(getEnRewardEff(0))

            return this.res.max(1).log(2).scaleEvery("gamma_ray",true,[1,1,1,fp]).mul(fp2).add(1).floor()
        },

        get_cost: x => format(x,0) + " Atom",

        effect(x) {
            let t = x
            t = t.mul(radBoostEff(10))
            let pow = E(2)
            if (hasUpgrade("atom",4)) pow = pow.add(upgEffect(3,14,0))
            if (hasUpgrade("atom",11)) pow = pow.mul(upgEffect(3,11))
            if (hasTree("gr1")) pow = pow.mul(treeEff("gr1"))
            if (tmp.sn.boson) pow = pow.mul(tmp.sn.boson.upgs.gluon[1].effect)
            pow = pow.mul(tmp.qu.prim.eff[3][1])
            pow = pow.mul(getEnRewardEff(3)[1])
            if (hasTree('bs5')) pow = pow.mul(tmp.sn.boson.effect.z_boson[0])
            if (hasTree("gr2")) pow = pow.pow(1.25)
            if (hasElement(129)) pow = pow.pow(elemEffect(18))

            if (hasBeyondRank(2,4)) pow = pow.pow(BUILDINGS.eff('accelerator'))

            let eff = pow.pow(t).sub(1)

            if (CHALS.inChal(17)) {
                pow = E(1)
                eff = E(1)
            }

            let exp = E(1)
            if (hasGlyphUpg(12)) exp = Decimal.pow(1.1,eff.max(1).log10().add(1).log10())

            return {power: pow, effect: eff, exp: exp}
        },

        get bonus() {
            let x = fermEff(0, 0, 0)
            x = x.mul(getEnRewardEff(4))
            return x
        },

        get_power: x => formatMult(x.power),
        get_effect: x => formatMult(x.effect)+(hasGlyphUpg(12)?", ^"+format(x.exp):""),
    },
    star_booster: {
        name: "Star Booster",
		icon: "star_booster",

        get isUnlocked() { return hasTree('s4') },
        get autoUnlocked() { return hasTree("qol4") },
        get noSpend() { return true },

        get res() { return player.atom.quarks },
        set res(v) { player.atom.quarks = v },

        cost(x=this.level) {
            let s = E("e8000")
            let inc = E("e100")
            if (hasUpgrade('br',5)) {
                s = s.root(10)
                inc = inc.root(10)
            }

            return inc.pow(x.pow(1.25)).mul(s)
        },
        get bulk() {
            let s = E("e8000")
            let inc = E("e100")
            if (hasUpgrade('br',5)) {
                s = s.root(10)
                inc = inc.root(10)
            }

            return this.res.div(s).max(1).log(inc).root(1.25).add(1).floor()
        },

        get_cost: x => format(x,0) + " Quark",

        effect(x) {
            let pow = E(2), a22 = hasUpgrade('atom',22)

            if (hasElement(57)) pow = pow.mul(elemEffect(57))
            if (hasUpgrade('br',5)) pow = pow.mul(upgEffect(4,5))
            pow = pow.softcap(1e13,0.5,0,a22)

            if (CHALS.inChal(17)) pow = E(1)

            let eff = pow.pow(x.mul(tmp.chal?tmp.chal.eff[11]:1)).softcap('e3e18',0.95,2,a22)
            return {power: pow, effect: eff}
        },

        get bonus() {
            return E(0)
        },

        get_power: x => formatMult(x.power) + x.power.softcapHTML(1e13,hasUpgrade('atom',22)),
        get_effect: x => formatMult(x.effect) + " to star generators" + x.effect.softcapHTML('e3e18',hasUpgrade('atom',22)),
    },
    cosmic_string: {
        name: "Cosmic String",
		icon: "cosmic_string",
        scale: "cosmic_str",

        get isUnlocked() { return quUnl() },
        get autoUnlocked() { return hasElement(147) },
        get noSpend() { return hasElement(147) },

        get res() { return player.qu.points },
        set res(v) { player.qu.points = v },

        cost(x=this.level) {
            let fp = E(1)

            if (tmp.inf_unl) fp = fp.mul(theoremEff('proto',0))

            return Decimal.pow(2,x.div(fp).scaleEvery("cosmic_str").add(1))
        },
        get bulk() {
            let fp = E(1)

            if (tmp.inf_unl) fp = fp.mul(theoremEff('proto',0))

            return this.res.max(1).log(2).sub(1).scaleEvery("cosmic_str",true).mul(fp).add(1).floor()
        },

        get_cost: x => format(x,0) + " Quantum Foam",

        effect(x) {
            let pow = E(2)
            if (hasTree('qu6')) pow = pow.mul(treeEff('qu6'))
            pow = pow.mul(tmp.dark.abEff.csp||1)
            pow = pow.pow(exoticAEff(1,3))
            if (hasElement(278)) pow = pow.pow(elemEffect(278))

            if (CHALS.inChal(17)) pow = E(1)

            let eff = pow.pow(x)
            return {power: pow, effect: eff}
        },

        get bonus() {
            let x = E(0)
            if (hasElement(19,1)) x = x.add(muElemEff(19,0))
            return x
        },

        get_power: x => formatMult(x.power),
        get_effect: x => formatMult(x.effect) + " to blueprint particle",
    },
    pe: {
        name: "Parallel Extruder",
		icon: "pe",
        scale: "pe",

        get isUnlocked() { return hasInfUpgrade(9) },
        get autoUnlocked() { return hasElement(251) },
        get noSpend() { return false },

        get res() { return player.inf.points },
        set res(v) { player.inf.points = v },

        cost(x=this.level) {
            return Decimal.pow(1.2,x.scaleEvery('pe')).mul(1000)
        },
        get bulk() {
            return this.res.div(1000).log(1.2).scaleEvery('pe',true).add(1).floor()
        },

        get_cost: x => format(x,0) + " Infinity Points",

        effect(x) {
            let t = x

            if (hasElement(283)) t = t.mul(3)

            let step = E(2).add(exoticAEff(1,4,0))

            if (hasElement(225)) step = step.add(elemEffect(225,0))
            
            let eff = step.pow(t)

            return {power: step, effect: eff}
        },

        get bonus() {
            let x = E(0)

            return x
        },

        get_power: x => formatMult(x.power),
        get_effect: x => formatMult(x.effect) + " to dimensional mass",
    },
}

const BUILDINGS_ORDER = [
    'pe',
    'cosmic_string',
    'star_booster',
    'cosmic_ray',
    'fvm','bhc',
    'accelerator','tickspeed',
    'mass_4','mass_3','mass_2','mass_1',
]

Object.keys(BUILDINGS_DATA).forEach(i => {
    let b = BUILDINGS_DATA[i]

    Object.defineProperty(b, "level", {
        get() { return player.build[i].amt },
        set(value) { player.build[i].amt = value },
    })
});

const BUILDINGS = {
    //Calculation
    tick() {
		for (var [i, b] of Object.entries(BUILDINGS_DATA)) {
			if (b.isUnlocked && b.autoUnlocked && player.build[i].auto) this.buy(i, true)
		}
	},
    temp() {
		let bt = tmp.build

		for (var i of BUILDINGS_ORDER) {
            let b = BUILDINGS_DATA[i]

			if (b.isUnlocked || b.forceEffect) {
                let bonus = b.bonus
                let total = b.beMultiplicative ? b.level.add(1).mul(bonus.add(1)).sub(1) : b.level.add(bonus)

                bt[i] = {
                    bulk: b.bulk,
                    total: total,
                    bonus: bonus,
                    effect: b.effect(total),
                }
            } else {
                bt[i] = {
                    bulk: E(0),
                    total: E(0),
                    bonus: E(0),
                    effect: {},
                }
            }
		}
	},

    //Reset
    reset(i) { player.build[i].amt = E(0) },

    //Buying
	buy(i, max=false) {
        let b = BUILDINGS_DATA[i], cost = b.cost()
        if (b.res.lt(cost) || !(b.allowPurchase ?? true)) return

        if (max) {
            let bulk = b.bulk
            if (bulk.lte(b.level)) return
            b.level = bulk

            cost = b.cost(bulk.sub(1))
        } else {
            b.level = b.level.add(1)
        }

		if (!b.noSpend && b.res.gt(cost)) {
			b.res = b.res.sub(cost).max(0) // without .max(0) causes NaN because of negative amount
		}
	},

    //Effect
	eff(i, key="effect", def = E(1)) {
		return tmp.build[i].effect[key] ?? def
	},

    //DOM
	setup() {
		for (var [i, b] of Object.entries(BUILDINGS_DATA)) {
            let el = new Element("building_"+i)

			if (el.el) el.setHTML(`<div class="table_center upgrade" style="width: 100%; margin-bottom: 5px;">
				<div style="width: 300px">
					<div class="resources">
						<img src="images/buildings/${b.icon}.png">
						<span style="margin-left: 5px; text-align: left;"><span id="building_scale_${i}"></span>${b.name} [<span id="building_lvl_${i}"></span>]</span>
					</div>
				</div>
				<button class="btn" id="building_btn_${i}" onclick="BUILDINGS.buy('${i}')" style="width: 300px"><span id="building_cost_${i}"></span></button>
                <button class="btn" onclick="BUILDINGS.buy('${i}', true)" style="width: 120px">Buy Max</button>
				<button class="btn" id="building_auto_${i}" onclick="player.build.${i}.auto = !player.build.${i}.auto" style="width: 80px"></button>
				<div style="margin-left: 5px; text-align: left; width: 400px">
					Power: <span id="building_pow_${i}"></span><br>
					Effect: <span id="building_eff_${i}"></span>
				</div>
			</div>`)
		}
	},
	update(i) {
		let b = BUILDINGS_DATA[i], bt = tmp.build[i], unl = b.isUnlocked

        tmp.el["building_"+i].setDisplay(unl)

        if (!unl) return;
		
        tmp.el["building_lvl_"+i].setHTML(b.level.format(0) + (bt.bonus.gt(0) ? (b.beMultiplicative ? " × " : " + ") + bt.bonus.format(0) : "")) //  + " = " + bt.total.format(0)
        tmp.el["building_scale_"+i].setHTML(b.scale ? getScalingName(b.scale) : "")

        let cost = b.cost(), allow = b.allowPurchase ?? true

        tmp.el["building_btn_"+i].setClasses({ btn: true, locked: b.res.lt(cost) || !allow })
        tmp.el["building_cost_"+i].setHTML(allow ? "Cost: "+b.get_cost(cost) : "Locked" + (b.denyPurchaseText??""))

        tmp.el["building_auto_"+i].setDisplay(b.autoUnlocked)
        tmp.el["building_auto_"+i].setHTML("Auto: " + (player.build[i].auto ? "ON" : "OFF"))

        let eff = bt.effect
        tmp.el["building_pow_"+i].setHTML(b.get_power(eff))
        tmp.el["building_eff_"+i].setHTML(b.get_effect(eff))
	},
}

// Config (custom cost, etc.)

function getMassUpgradeCost(i, lvl) {
    let cost = EINF, fp = E(1), upg = UPGS.mass[i]

    let start = upg.start, inc = upg.inc

    if (i==4) {
        if (hasInfUpgrade(2)) start = E(1e10)
        let pow = 1.5
        cost = E(10).pow(Decimal.pow(inc,lvl.scaleEvery('massUpg4').pow(pow)).mul(start))
    } else {
        fp = tmp.massFP
        
        if (i == 1 && player.ranks.rank.gte(2)) inc = inc.pow(0.8)
        if (i == 2 && player.ranks.rank.gte(3)) inc = inc.pow(0.8)
        if (i == 3 && player.ranks.rank.gte(4)) inc = inc.pow(0.8)
        if (player.ranks.tier.gte(3)) inc = inc.pow(0.8)
        cost = inc.pow(lvl.div(fp).scaleEvery("massUpg")).mul(start)
    }

    return cost
}

function getMassUpgradeBulk(i) {
    let bulk = E(0), fp = E(1), upg = UPGS.mass[i]

    let start = upg.start, inc = upg.inc

    if (i==4) {
        if (hasInfUpgrade(2)) start = E(1e10)
        let pow = 1.5
        if (player.mass.gte(E(10).pow(start))) bulk = player.mass.max(1).log10().div(start).max(1).log(inc).max(0).root(pow).scaleEvery('massUpg4',true).add(1).floor()
    } else {
        fp = tmp.massFP
        
        if (i == 1 && player.ranks.rank.gte(2)) inc = inc.pow(0.8)
        if (i == 2 && player.ranks.rank.gte(3)) inc = inc.pow(0.8)
        if (i == 3 && player.ranks.rank.gte(4)) inc = inc.pow(0.8)
        if (player.ranks.tier.gte(3)) inc = inc.pow(0.8)

        if (player.mass.gte(start)) bulk = player.mass.div(start).max(1).log(inc).scaleEvery("massUpg",true).mul(fp).add(1).floor()
    }

    return bulk
}

function checkBuildings() {
    let b

    // Mass Upgrades
    if (player.massUpg) for (let x = 1; x <= 4; x++) {
        b = player.build['mass_'+x]

        if (b.amt.lte(0) && player.massUpg[x] && Decimal.gt(player.massUpg[x],0)) {
            b.amt = E(player.massUpg[x])
            player.massUpg[x] = undefined;
        }

        b.auto = b.auto || player.autoMassUpg[x]

        player.autoMassUpg[x] = false
    }

    // Tickspeed
    b = player.build.tickspeed
    if (b.amt.lte(0) && player.tickspeed && Decimal.gt(player.tickspeed,0)) {
        b.amt = E(player.tickspeed)
        player.tickspeed = undefined;
    }
    b.auto = b.auto || player.autoTickspeed
    player.autoTickspeed = false

    // Accelerator
    b = player.build.accelerator
    if (b.amt.lte(0) && player.accelerator && Decimal.gt(player.accelerator,0)) {
        b.amt = E(player.accelerator)
        player.accelerator = undefined;
    }
    b.auto = b.auto || player.autoAccel
    player.autoAccel = false

    // BHC
    b = player.build.bhc
    if (b.amt.lte(0) && player.bh.condenser && Decimal.gt(player.bh.condenser,0)) {
        b.amt = E(player.bh.condenser)
        player.bh.condenser = undefined;
    }
    b.auto = b.auto || player.bh.autoCondenser
    player.bh.autoCondenser = false

    // FVM
    b = player.build.fvm
    if (b.amt.lte(0) && player.bh.fvm && Decimal.gt(player.bh.fvm,0)) {
        b.amt = E(player.bh.fvm)
        player.bh.fvm = undefined;
    }
    b.auto = b.auto || player.bh.autoFVM
    player.bh.autoFVM = false

    // Cosmic Ray
    b = player.build.cosmic_ray
    if (b.amt.lte(0) && player.atom.gamma_ray && Decimal.gt(player.atom.gamma_ray,0)) {
        b.amt = E(player.atom.gamma_ray)
        player.atom.gamma_ray = undefined;
    }
    b.auto = b.auto || player.atom.auto_gr
    player.atom.auto_gr = false

    // Star Booster
    b = player.build.star_booster
    if (b.amt.lte(0) && player.stars.boost && Decimal.gt(player.stars.boost,0)) {
        b.amt = E(player.stars.boost)
        player.stars.boost = undefined;
        b.auto = hasTree('qol4')
    }

    // Cosmic String
    b = player.build.cosmic_string
    if (b.amt.lte(0) && player.qu.cosmic_str && Decimal.gt(player.qu.cosmic_str,0)) {
        b.amt = E(player.qu.cosmic_str)
        player.qu.cosmic_str = undefined;
    }
    b.auto = b.auto || player.qu.auto_cr
    player.qu.auto_cr = false

    // Parallel Extruder
    b = player.build.pe
    if (b.amt.lte(0) && player.inf?.pe && Decimal.gt(player.inf.pe,0)) {
        b.amt = E(player.inf.pe)
        player.inf.pe = undefined;
    }
}