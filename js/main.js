var diff = 0;
var date = Date.now();
var player

const ST_NAMES = [
	null, [
		["","U","D","T","Qa","Qt","Sx","Sp","Oc","No"],
		["","Dc","Vg","Tg","Qag","Qtg","Sxg","Spg","Ocg","Nog"],
		["","Ce","De","Te","Qae","Qte","Sxe","Spe","Oce","Noe"],
	],[
		["","Mi","Mc","Na","Pc","Fm","At","Zp","Yc","Xn"],
		["","Me","Du","Tr","Te","Pe","He","Hp","Ot","En"],
		["","c","Ic","TCn","TeC","PCn","HCn","HpC","OCn","ECn"],
		["","Hc","DHe","THt","TeH","PHc","HHe","HpH","OHt","EHc"]
	]
]
const CONFIRMS = ['rp', 'bh', 'atom', 'sn', 'qu', 'br']

const FORMS = {
    getPreQUGlobalSpeed() {
        let x = E(1)
        if (tmp.qu.mil_reached[1]) x = x.mul(10)
        if (quUnl()) x = x.mul(tmp.qu.bpEff)
        if (hasElement(103)) x = x.mul(tmp.elements.effect[103])

        if (player.mainUpg.br.includes(3)) x = x.pow(tmp.upgs.main[4][3].effect)
        if (hasPrestige(0,5)) x = x.pow(2)

        if (QCs.active()) x = x.div(tmp.qu.qc_eff[1])
        return x
    },
    massGain() {
        let x = E(1)
        x = x.add(tmp.upgs.mass[1]?tmp.upgs.mass[1].eff.eff:1)
        if (player.ranks.rank.gte(6)) x = x.mul(RANKS.effect.rank[6]())
        if (player.ranks.rank.gte(13)) x = x.mul(3)
        x = x.mul(tmp.tickspeedEffect.eff||E(1))
        if (player.bh.unl) x = x.mul(tmp.bh.effect)
        if (player.mainUpg.bh.includes(10)) x = x.mul(tmp.upgs.main?tmp.upgs.main[2][10].effect:E(1))
        x = x.mul(tmp.atom.particles[1].powerEffect.eff2)
        if (player.ranks.rank.gte(380)) x = x.mul(RANKS.effect.rank[380]())
        x = x.mul(tmp.stars.effect)
        if (hasTree("m1")) x = x.mul(tmp.supernova.tree_eff.m1)

        x = x.mul(tmp.bosons.effect.pos_w[0])

        if (!hasElement(105)) x = x.mul(tmp.atom.particles[0].powerEffect.eff1)
        else x = x.pow(tmp.atom.particles[0].powerEffect.eff1)

        if (player.ranks.tier.gte(2)) x = x.pow(1.15)
        if (player.ranks.rank.gte(180)) x = x.pow(1.025)
        if (!CHALS.inChal(3) || CHALS.inChal(10) || FERMIONS.onActive("03")) x = x.pow(tmp.chal.eff[3])
        if (player.md.active || CHALS.inChal(10) || FERMIONS.onActive("02") || FERMIONS.onActive("03") || CHALS.inChal(11)) {
            x = expMult(x,tmp.md.pen)
            if (hasElement(28)) x = x.pow(1.5)
        }
        if (QCs.active()) x = x.pow(tmp.qu.qc_eff[4])

        if (CHALS.inChal(9) || FERMIONS.onActive("12")) x = expMult(x,0.9)
        x = x.softcap(tmp.massSoftGain,tmp.massSoftPower,0)
        .softcap(tmp.massSoftGain2,tmp.massSoftPower2,0)
        .softcap(tmp.massSoftGain3,tmp.massSoftPower3,0)
        .softcap(tmp.massSoftGain4,tmp.massSoftPower4,0)
        .softcap(tmp.massSoftGain5,tmp.massSoftPower5,0)

        if (hasElement(117)) x = x.pow(10)

        return x
    },
    massSoftGain() {
        let s = E(1.5e156)
        if (CHALS.inChal(3) || CHALS.inChal(10) || FERMIONS.onActive("03")) s = s.div(1e150)
        if (CHALS.inChal(4) || CHALS.inChal(10) || FERMIONS.onActive("03")) s = s.div(1e100)
        if (player.mainUpg.bh.includes(7)) s = s.mul(tmp.upgs.main?tmp.upgs.main[2][7].effect:E(1))
        if (player.mainUpg.rp.includes(13)) s = s.mul(tmp.upgs.main?tmp.upgs.main[1][13].effect:E(1))
        if (hasPrestige(0,1)) s = s.pow(10)
        return s.min(tmp.massSoftGain2||1/0)
    },
    massSoftPower() {
        let p = E(1/3)
        if (CHALS.inChal(3) || CHALS.inChal(10) || FERMIONS.onActive("03")) p = p.mul(4)
        if (CHALS.inChal(7) || CHALS.inChal(10)) p = p.mul(6)
        if (player.mainUpg.bh.includes(11)) p = p.mul(0.9)
        if (player.ranks.rank.gte(800)) p = p.mul(RANKS.effect.rank[800]())
        return E(1).div(p.add(1))
    },
    massSoftGain2() {
        let s = E('1.5e1000056')
        if (hasTree("m2")) s = s.pow(1.5)
        if (hasTree("m2")) s = s.pow(tmp.supernova.tree_eff.m3)
        if (player.ranks.tetr.gte(8)) s = s.pow(1.5)

        s = s.pow(tmp.bosons.effect.neg_w[0])
        if (hasPrestige(0,1)) s = s.pow(10)

        return s.min(tmp.massSoftGain3||1/0)
    },
    massSoftPower2() {
        let p = E(player.qu.rip.active ? 0.1 : 0.25)
        if (hasElement(51)) p = p.pow(0.9)
        return p
    },
    massSoftGain3() {
        let s = player.qu.rip.active ? uni("ee7") : uni("ee8")
        if (hasTree("m3")) s = s.pow(tmp.supernova.tree_eff.m3)
        s = s.pow(tmp.radiation.bs.eff[2])
        if (hasPrestige(0,1)) s = s.pow(10)
        return s
    },
    massSoftPower3() {
        let p = E(player.qu.rip.active ? 0.1 : 0.2)
        if (hasElement(77)) p = p.pow(player.qu.rip.active?0.95:0.825)
        return p
    },
    massSoftGain4() {
        let s = mlt(player.qu.rip.active ? 0.1 : 1e4)
        if (player.ranks.pent.gte(8)) s = s.pow(RANKS.effect.pent[8]())
        if (hasTree('qc1')) s = s.pow(treeEff('qc1'))
        if (hasPrestige(0,1)) s = s.pow(10)
        return s
    },
    massSoftPower4() {
        let p = E(0.1)
        if (hasElement(100)) p = p.pow(player.qu.rip.active?0.8:0.5)
        return p
    },
    massSoftGain5() {
        let s = mlt(player.qu.rip.active?1e4:1e12)
        if (hasPrestige(0,8)) s = s.pow(prestigeEff(0,8))
        if (hasUpgrade("br",12)) s = s.pow(upgEffect(4,12))
        return s
    },
    massSoftPower5() {
        let p = E(0.05)
        return p
    },
    tickspeed: {
        cost(x=player.tickspeed) { return E(2).pow(x).floor() },
        can() { return player.rp.points.gte(tmp.tickspeedCost) && !CHALS.inChal(2) && !CHALS.inChal(6) && !CHALS.inChal(10) },
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
            let t = player.tickspeed
            if (hasElement(63)) t = t.mul(25)
            t = t.mul(tmp.prim.eff[1][1])
            t = t.mul(tmp.radiation.bs.eff[1])
            let bonus = E(0)
            if (player.atom.unl) bonus = bonus.add(tmp.atom.atomicEff)
            bonus = bonus.mul(getEnRewardEff(4))
            let step = E(1.5)
                step = step.add(tmp.chal.eff[6])
                step = step.add(tmp.chal.eff[2])
                step = step.add(tmp.atom.particles[0].powerEffect.eff2)
                if (player.ranks.tier.gte(4)) step = step.add(RANKS.effect.tier[4]())
                if (player.ranks.rank.gte(40)) step = step.add(RANKS.effect.rank[40]())
            step = step.mul(tmp.bosons.effect.z_boson[0])
            step = tmp.md.bd3 ? step.pow(tmp.md.mass_eff) : step.mul(tmp.md.mass_eff)
            step = step.pow(tmp.qu.chroma_eff[0])
            if (hasTree("t1")) step = step.pow(1.15)

            let ss = E(1e50).mul(tmp.radiation.bs.eff[13])
            let p = 0.1
            if (hasElement(86)) {
                ss = ss.pow(2)
                p **= 0.5
            }
            if (hasPrestige(0,6)) ss = ss.pow(100)
            if (hasElement(102)) ss = ss.pow(100)
            step = step.softcap(ss,p,0)
            
            let eff = step.pow(t.add(bonus).mul(hasElement(80)?25:1))
            if (hasElement(18)) eff = eff.pow(tmp.elements.effect[18])
            if (player.ranks.tetr.gte(3)) eff = eff.pow(1.05)
            return {step: step, eff: eff, bonus: bonus, ss: ss}
        },
        autoUnl() { return player.mainUpg.bh.includes(5) },
        autoSwitch() { player.autoTickspeed = !player.autoTickspeed },
    },
    rp: {
        gain() {
            if (player.mass.lt(1e15) || CHALS.inChal(7) || CHALS.inChal(10)) return E(0)
            let gain = player.mass.div(1e15).root(3)
            if (player.ranks.rank.gte(14)) gain = gain.mul(2)
            if (player.ranks.rank.gte(45)) gain = gain.mul(RANKS.effect.rank[45]())
            if (player.ranks.tier.gte(6)) gain = gain.mul(RANKS.effect.tier[6]())
            if (player.mainUpg.bh.includes(6)) gain = gain.mul(tmp.upgs.main?tmp.upgs.main[2][6].effect:E(1))
            if (hasTree("rp1")) gain = gain.mul(tmp.supernova.tree_eff.rp1)

            if (!hasElement(105)) gain = gain.mul(tmp.atom.particles[1].powerEffect.eff1)
            else gain = gain.pow(tmp.atom.particles[1].powerEffect.eff1)

            if (player.mainUpg.bh.includes(8)) gain = gain.pow(1.15)
            gain = gain.pow(tmp.chal.eff[4])
            if (CHALS.inChal(4) || CHALS.inChal(10) || FERMIONS.onActive("03")) gain = gain.root(10)
            gain = gain.pow(tmp.prim.eff[1][0])

            if (QCs.active()) gain = gain.pow(tmp.qu.qc_eff[4])
            if (player.md.active || CHALS.inChal(10) || FERMIONS.onActive("02") || FERMIONS.onActive("03") || CHALS.inChal(11)) gain = expMult(gain,tmp.md.pen)
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
            if (CHALS.inChal(7) || CHALS.inChal(10)) gain = player.mass.div(1e180)
            if (gain.lt(1)) return E(0)
            gain = gain.root(4)

            if (hasTree("bh1")) gain = gain.mul(tmp.supernova.tree_eff.bh1)
            gain = gain.mul(tmp.bosons.upgs.photon[0].effect)

            if (CHALS.inChal(7) || CHALS.inChal(10)) gain = gain.root(6)
            if (!hasElement(105)) gain = gain.mul(tmp.atom.particles[2].powerEffect.eff1)
            else gain = gain.pow(tmp.atom.particles[2].powerEffect.eff1)
            if (CHALS.inChal(8) || CHALS.inChal(10) || FERMIONS.onActive("12")) gain = gain.root(8)
            gain = gain.pow(tmp.chal.eff[8])
            gain = gain.pow(tmp.prim.eff[2][0])

            if (QCs.active()) gain = gain.pow(tmp.qu.qc_eff[4])
            if (player.md.active || CHALS.inChal(10) || FERMIONS.onActive("02") || FERMIONS.onActive("03") || CHALS.inChal(11)) gain = expMult(gain,tmp.md.pen)
            return gain.floor()
        },
        massPowerGain() {
            let x = E(0.33)
            if (FERMIONS.onActive("11")) return E(-1)
            if (hasElement(59)) x = E(0.45)
            x = x.add(tmp.radiation.bs.eff[4])
            return x
        },
        massGain() {
            let x = tmp.bh.f
            .mul(this.condenser.effect().eff)
            if (player.mainUpg.rp.includes(11)) x = x.mul(tmp.upgs.main?tmp.upgs.main[1][11].effect:E(1))
            if (player.mainUpg.bh.includes(14)) x = x.mul(tmp.upgs.main?tmp.upgs.main[2][14].effect:E(1))
            if (hasElement(46)) x = x.mul(tmp.elements.effect[46])
            x = x.mul(tmp.bosons.upgs.photon[0].effect)
            if (CHALS.inChal(8) || CHALS.inChal(10) || FERMIONS.onActive("12")) x = x.root(8)
            x = x.pow(tmp.chal.eff[8])

            if (QCs.active()) x = x.pow(tmp.qu.qc_eff[4])
            if (player.md.active || CHALS.inChal(10) || FERMIONS.onActive("02") || FERMIONS.onActive("03") || CHALS.inChal(11)) x = expMult(x,tmp.md.pen)
            return x.softcap(tmp.bh.massSoftGain, tmp.bh.massSoftPower, 0)
        },
        f() {
            let x = player.bh.mass.add(1).pow(tmp.bh.massPowerGain).softcap(tmp.bh.fSoftStart,tmp.bh.fSoftPower,2)
            return x
        },
        fSoftStart() {
            let x = uni("e3e9")
            if (hasElement(71)) x = x.pow(tmp.elements.effect[71])
            x = x.pow(tmp.radiation.bs.eff[20])
            return x
        },
        fSoftPower() {
            let x = 0.95
            if (hasTree("qu3")) x **= 0.7
            return x
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
            if (hasElement(89)) x = x.pow(tmp.elements.effect[89])
            return x//.softcap("ee14",0.95,2)
        },
        condenser: {
            autoSwitch() { player.bh.autoCondenser = !player.bh.autoCondenser },
            autoUnl() { return player.mainUpg.atom.includes(2) },
            can() { return player.bh.dm.gte(tmp.bh.condenser_cost) && !CHALS.inChal(6) && !CHALS.inChal(10) },
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
                let t = player.bh.condenser
                t = t.mul(tmp.radiation.bs.eff[5])
                let pow = E(2)
                    pow = pow.add(tmp.chal.eff[6])
                    if (player.mainUpg.bh.includes(2)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[2][2].effect:E(1))
                    pow = pow.add(tmp.atom.particles[2].powerEffect.eff2)
                    if (player.mainUpg.atom.includes(11)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[3][11].effect:E(1))
                    pow = pow.mul(tmp.bosons.upgs.photon[1].effect)
                    pow = pow.mul(tmp.prim.eff[2][1])
                    pow = pow.mul(getEnRewardEff(3)[1])
                    if (hasTree('bs5')) pow = pow.mul(tmp.bosons.effect.z_boson[0])
                    if (hasTree("bh2")) pow = pow.pow(1.15)
                
                let eff = pow.pow(t.add(tmp.bh.condenser_bonus))
                return {pow: pow, eff: eff}
            },
            bonus() {
                let x = E(0)
                if (player.mainUpg.bh.includes(15)) x = x.add(tmp.upgs.main?tmp.upgs.main[2][15].effect:E(0))
                x = x.mul(getEnRewardEff(4))
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
            br: "Big Rip the Dimension, then go back",
        },
        set(id) {
            if (id=="sn") {
                player.reset_msg = "Reach over "+format(tmp.supernova.maxlimit)+" collapsed stars to be Supernova"
                return
            }
            if (id=="qu") {
                player.reset_msg = "Require over "+formatMass(mlt(1e4))+" of mass to "+(QCs.active()?"complete Quantum Challenge":"go Quantum")
                return
            }
            player.reset_msg = this.msgs[id]
        },
        reset() { player.reset_msg = "" },
    },
}

function loop() {
    diff = Date.now()-date;
    ssf[1]()
    updateTemp()
    updateHTML()
    calc(diff/1000*tmp.offlineMult,diff/1000);
    date = Date.now();
    player.offline.current = date
}

function format(ex, acc=4, max=12, type=player.options.notation) {
    ex = E(ex)
    neg = ex.lt(0)?"-":""
    if (ex.mag == Infinity) return neg + 'Infinity'
    if (Number.isNaN(ex.mag)) return neg + 'NaN'
    if (ex.lt(0)) ex = ex.mul(-1)
    if (ex.eq(0)) return ex.toFixed(acc)
    let e = ex.log10().floor()
    switch (type) {
        case "sc":
            if (ex.log10().lt(Math.min(-acc,0)) && acc > 1) {
                let e = ex.log10().ceil()
                let m = ex.div(e.eq(-1)?E(0.1):E(10).pow(e))
                let be = e.mul(-1).max(1).log10().gte(9)
                return neg+(be?'':m.toFixed(4))+'e'+format(e, 0, max, "sc")
            } else if (e.lt(max)) {
                let a = Math.max(Math.min(acc-e.toNumber(), acc), 0)
                return neg+(a>0?ex.toFixed(a):ex.toFixed(a).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
            } else {
                if (ex.gte("eeee10")) {
                    let slog = ex.slog()
                    return (slog.gte(1e9)?'':E(10).pow(slog.sub(slog.floor())).toFixed(4)) + "F" + format(slog.floor(), 0)
                }
                let m = ex.div(E(10).pow(e))
                let be = e.log10().gte(9)
                return neg+(be?'':m.toFixed(4))+'e'+format(e, 0, max, "sc")
            }
        case "st":
            let e3 = ex.log(1e3).floor()
			if (e3.lt(1)) {
				return neg+ex.toFixed(Math.max(Math.min(acc-e.toNumber(), acc), 0))
			} else {
				let e3_mul = e3.mul(3)
				let ee = e3.log10().floor()
				if (ee.gte(3000)) return "e"+format(e, acc, max, "st")

				let final = ""
				if (e3.lt(4)) final = ["", "K", "M", "B"][Math.round(e3.toNumber())]
				else {
					let ee3 = Math.floor(e3.log(1e3).toNumber())
					if (ee3 < 100) ee3 = Math.max(ee3 - 1, 0)
					e3 = e3.sub(1).div(E(10).pow(ee3*3))
					while (e3.gt(0)) {
						let div1000 = e3.div(1e3).floor()
						let mod1000 = e3.sub(div1000.mul(1e3)).floor().toNumber()
						if (mod1000 > 0) {
							if (mod1000 == 1 && !ee3) final = "U"
							if (ee3) final = FORMATS.standard.tier2(ee3) + (final ? "-" + final : "")
							if (mod1000 > 1) final = FORMATS.standard.tier1(mod1000) + final
						}
						e3 = div1000
						ee3++
					}
				}

				let m = ex.div(E(10).pow(e3_mul))
				return neg+(ee.gte(10)?'':(m.toFixed(E(3).sub(e.sub(e3_mul)).add(acc==0?0:1).toNumber()))+' ')+final
			}
        default:
            return neg+FORMATS[type].format(ex, acc, max)
    }
}

function turnOffline() { player.offline.active = !player.offline.active }

const ARV = ['mlt','mgv','giv','tev','pev','exv','zev','yov']

function formatARV(ex,gain=false) {
    if (gain) ex = uni("ee9").pow(ex)
    let mlt = ex.div(1.5e56).log10().div(1e9)
    let arv = mlt.log10().div(15).floor()
    return format(mlt.div(Decimal.pow(1e15,arv))) + " " + (arv.gte(8)?"arv^"+format(arv.add(2),0):ARV[arv.toNumber()])
}

function formatMass(ex) {
    ex = E(ex)
    if (ex.gte(E(1.5e56).mul('ee9'))) return formatARV(ex)
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
    let next = amt.add(gain)
    let rate
    let ooms = next.max(1).log10().div(amt.max(1).log10())
    if (ooms.gte(10) && amt.gte('ee10') && !isMass) {
        ooms = ooms.log10().mul(20)
        rate = "(+"+format(ooms) + " OoMs^2/sec)"
    }
    ooms = next.div(amt)
    if (ooms.gte(10) && amt.gte(1e100)) {
        ooms = ooms.log10().mul(20)
        if (isMass && amt.gte(mlt(1)) && ooms.gte(1e6)) rate = "(+"+formatARV(ooms.div(1e9),true) + "/sec)"
        else rate = "(+"+format(ooms) + " OoMs/sec)"
    }
    else rate = "(+"+f(gain)+"/sec)"
    return rate
}

function formatTime(ex,acc=2,type="s") {
    ex = E(ex)
    if (ex.gte(86400)) return format(ex.div(86400).floor(),0,12,"sc")+":"+formatTime(ex.mod(86400),acc,'d')
    if (ex.gte(3600)||type=="d") return (ex.div(3600).gte(10)||type!="d"?"":"0")+format(ex.div(3600).floor(),0,12,"sc")+":"+formatTime(ex.mod(3600),acc,'h')
    if (ex.gte(60)||type=="h") return (ex.div(60).gte(10)||type!="h"?"":"0")+format(ex.div(60).floor(),0,12,"sc")+":"+formatTime(ex.mod(60),acc,'m')
    return (ex.gte(10)||type!="m" ?"":"0")+format(ex,acc,12,"sc")
}

function formatReduction(ex) { ex = E(ex); return format(E(1).sub(ex).mul(100))+"%" }

function formatPercent(ex) { ex = E(ex); return format(ex.mul(100))+"%" }

function formatMult(ex,acc=4) { ex = E(ex); return ex.gte(1)?"×"+ex.format(acc):"/"+ex.pow(-1).format(acc)}

function expMult(a,b,base=10) { return E(a).gte(1) ? E(base).pow(E(a).log(base).pow(b)) : E(0) }

function capitalFirst(str) {
	if (str=="" || str==" ") return str
	return str
		.split(" ")
		.map(x => x[0].toUpperCase() + x.slice(1))
		.join(" ");
}