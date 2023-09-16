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
const CONFIRMS = ['rp', 'bh', 'atom', 'sn', 'qu', 'br', 'dark', 'inf']

const FORMS = {
    getPreInfGlobalSpeed() {
        if (!tmp.inf_unl) return E(1)

		x = GPEffect(5).mul(10).mul(theoremEff('time',0))
        if (hasUpgrade('br',21)) x = x.pow(upgEffect(4,21))
        return x
    },
    getPreQUGlobalSpeed() {
        let x = E(1), inf = tmp.preInfGlobalSpeed
        if (tmp.c16.in) return inf.div(100)

        if (quUnl()) x = x.mul(tmp.qu.bpEff)
        if (hasElement(103)) x = x.mul(tmp.elements.effect[103])

        if (hasUpgrade("br",3)) x = x.pow(tmp.upgs[4][3].effect)
        if (hasPrestige(0,5)) x = x.pow(2)

        if (tmp.inf_unl) x = x.pow(theoremEff('time',1))

        if (QCs.active()) x = x.div(tmp.qu.qc_eff[1])

        return x.mul(inf)
    },
    massGain() {
        let x = E(2).add(BUILDINGS.eff('mass_1',undefined,0))
        if (player.ranks.rank.gte(4)) x = x.mul(RANKS.effect.rank[4]())
        if (player.ranks.rank.gte(13)) x = x.mul(3)
        if (hasUpgrade("bh",10)) x = x.mul(tmp.upgs?tmp.upgs[2][10].effect:E(1))
        if (tmp.star_unl) x = x.mul(tmp.stars.effect[0])
        if (hasTree("m1")) x = x.mul(treeEff("m1")[0])
        if (tmp.sn.boson) x = x.mul(tmp.sn.boson.effect.pos_w[0])
        if (OURO.unl()) x = x.mul(appleEffect('mass')[0])
        if (OURO.evo < 2 && tmp.atom.unl) x = hasUpgrade('atom',18) ? x.pow(tmp.atom.particles[1].powerEffect.eff2) : x.mul(tmp.atom.particles[1].powerEffect.eff2)

        if (tmp.bh.unl) x = hasElement(201) ? x.pow(tmp.bh.effect) : x.mul(tmp.bh.effect)
		if (tmp.atom.unl) {
			if (!hasElement(105)) x = x.mul(tmp.atom.particles[0].powerEffect.eff1)
			else x = x.pow(tmp.atom.particles[0].powerEffect.eff1)
		}

        if (!hasElement(199) || CHALS.inChal(15)) x = x.mul(BUILDINGS.eff('tickspeed'))
        else x = x.pow(BUILDINGS.eff('tickspeed'))

        if (player.ranks.tier.gte(2)) x = x.pow(1.15)
        if (player.ranks.rank.gte(180)) x = x.pow(1.025)
        if (!CHALS.inChal(3) || CHALS.inChal(10) || FERMIONS.onActive("03")) x = x.pow(tmp.chal.eff[3])
        if (tmp.md.in) {
            x = expMult(x,tmp.md.pen)
            if (hasElement(28)) x = x.pow(1.5)
        }
        if (QCs.active()) x = x.pow(tmp.qu.qc_eff[4])

        x = x.pow(tmp.dark.shadowEff.mass)
        if (hasElement(85, 1)) x = x.pow(appleEffect('mass')[1])

        if (CHALS.inChal(9) || FERMIONS.onActive("12")) x = expMult(x,0.9)
        
        x = x.softcap(tmp.massSoftGain,tmp.massSoftPower,0)
        .softcap(tmp.massSoftGain2,tmp.massSoftPower2,0)
        .softcap(tmp.massSoftGain3,tmp.massSoftPower3,0)
        .softcap(tmp.massSoftGain4,tmp.massSoftPower4,0)
        .softcap(tmp.massSoftGain5,tmp.massSoftPower5,0)

        if (hasElement(117)) x = x.pow(10)

        x = x.softcap(tmp.massSoftGain6,tmp.massSoftPower6,0)
        .softcap(tmp.massSoftGain7,tmp.massSoftPower7,0)
        .softcap(tmp.massSoftGain8,tmp.massSoftPower8,0)

        if (tmp.star_unl) x = x.pow(tmp.stars.effect[1])
        if (hasTree("m1")) x = x.pow(treeEff("m1")[1])

        x = x.pow(glyphUpgEff(1))

        if (hasUpgrade('bh',16)) x = x.pow(upgEffect(2,16))
        if (hasTree('ct1')) x = x.pow(treeEff('ct1'))
        if (hasUpgrade('rp',20)) x = x.pow(upgEffect(1,20))

        if (tmp.inf_unl) x = x.pow(theoremEff('mass',0))
        if (hasInfUpgrade(1)) x = x.pow(infUpgEffect(1)[0])
        if (tmp.sn.boson) x = x.pow(tmp.sn.boson.effect.pos_w[2]||1)
        if (hasElement(295)) x = x.pow(elemEffect(295))

        if (tmp.dark.run) x = expMult(x,mgEff(0))
		if (OURO.evo < 2) {
			let o = x
			let os = tmp.c16.in ? E('ee5') : E('ee69').pow(tmp.chal.eff[15])
			let op = E(.5)
			let os2 = tmp.c16.in ? E('ee11') : E('ee279')
			let op2 = E(.25)

			if (hasTree('ct6')) os = os.pow(treeEff('ct6'))
			if (tmp.inf_unl) os = os.pow(theoremEff('mass',1))

			if (hasElement(15,1)) os2 = os2.pow(muElemEff(15))
			if (tmp.inf_unl) os2 = os2.pow(theoremEff('mass',4))

			if (hasElement(231)) {
				let p = elemEffect(231)
				os = os.pow(p)
				os2 = os2.pow(p)
			}
			if (hasElement(257)) os2 = os2.pow(elemEffect(257))

			if (CHALS.inChal(17)) os = E('ee95')
			os = os.min(os2)

			if (hasBeyondRank(3,1)) op = op.pow(beyondRankEffect(3,1))

			if (hasElement(24,1)) {
				op = op.pow(.95)
				op2 = op2.pow(.95)
			}

			if (hasUpgrade('rp',24)) {
				op = op.pow(.8)
				op2 = op2.pow(.8)
			}

			let pp = GPEffect(1)
			op = op.pow(pp)
			op2 = op2.pow(pp)

			x = overflow(x,os,op)
			x = overflow(x,os2,op2)

			tmp.overflowBefore.mass = o
			tmp.overflow.mass = calcOverflow(o,x,os)
			tmp.overflow_start.mass = [os,os2]
			tmp.overflow_power.mass = [op,op2]
		} else {
			tmp.overflow_start.mass = [EINF,EINF]
		}

        if (CHALS.inChal(13)) x = x.max(1).log10().tetrate(1.5)

        return x
    },
    massSoftGain() {
        if (player.ranks.hex.gte(6)) return EINF
        let s = E(1.5e156)
        if (CHALS.inChal(3) || CHALS.inChal(10) || FERMIONS.onActive("03")) s = s.div(1e150)
        if (CHALS.inChal(4) || CHALS.inChal(10) || FERMIONS.onActive("03")) s = s.div(1e100)
        if (hasUpgrade("bh",7)) s = s.mul(tmp.upgs?tmp.upgs[2][7].effect:E(1))
        if (hasUpgrade("rp",13)) s = s.mul(tmp.upgs?tmp.upgs[1][13].effect:E(1))
        if (hasPrestige(0,1)) s = s.pow(10)
        return s.min(tmp.massSoftGain2||1/0).max(1)
    },
    massSoftPower() {
        let p = E(1/3).mul(tmp.evo.meditation_eff.mass_softcap??1)
        if (CHALS.inChal(3) || CHALS.inChal(10) || FERMIONS.onActive("03")) p = p.mul(4)
        if (CHALS.inChal(7) || CHALS.inChal(10)) p = p.mul(6)
        if (hasUpgrade("bh",11)) p = p.mul(0.9)
        if (player.ranks.rank.gte(800)) p = p.mul(RANKS.effect.rank[800]())
        return E(1).div(p.add(1))
    },
    massSoftGain2() {
        if (player.ranks.hex.gte(10)) return EINF
        let s = E('1.5e1000056')
        if (hasTree("m2")) s = s.pow(1.5)
        if (hasTree("m3")) s = s.pow(treeEff("m3"))
        if (player.ranks.tetr.gte(8)) s = s.pow(1.5)

        if (tmp.sn.boson) s = s.pow(tmp.sn.boson.effect.neg_w[0])
        if (hasPrestige(0,1)) s = s.pow(10)

        return s.min(tmp.massSoftGain3||1/0).max(1)
    },
    massSoftPower2() {
        let p = E(tmp.rip.in ? 0.1 : 0.25)
        if (hasElement(51)) p = p.pow(0.9)
        return p.pow(tmp.evo.meditation_eff.mass_softcap??1)
    },
    massSoftGain3() {
        if (player.ranks.hex.gte(13)) return EINF
        let s = tmp.rip.in ? uni("ee7") : uni("ee8")
        if (hasTree("m3")) s = s.pow(treeEff("m3"))
        s = s.pow(radBoostEff(2))
        if (hasPrestige(0,1)) s = s.pow(10)
        return s.max(1)
    },
    massSoftPower3() {
        let p = E(tmp.rip.in ? 0.1 : 0.2)
        if (hasElement(77)) p = p.pow(tmp.rip.in?0.95:0.825)
        return p.pow(tmp.evo.meditation_eff.mass_softcap??1)
    },
    massSoftGain4() {
        if (player.ranks.hex.gte(17)) return EINF
        let s = mlt(tmp.rip.in ? 0.1 : 1e4)
        if (player.ranks.pent.gte(8)) s = s.pow(RANKS.effect.pent[8]())
        if (hasTree('qc1')) s = s.pow(treeEff('qc1'))
        if (hasPrestige(0,1)) s = s.pow(10)
        s = s.pow(tmp.dark.abEff.msoftcap||1)
        return s.max(1)
    },
    massSoftPower4() {
        let p = E(0.1)
        if (hasElement(100)) p = p.pow(tmp.rip.in?0.8:0.5)
        return p.pow(tmp.evo.meditation_eff.mass_softcap??1)
    },
    massSoftGain5() {
        if (player.ranks.hex.gte(36)) return EINF
        let s = mlt(tmp.rip.in?1e4:1e12)
        if (hasPrestige(0,8)) s = s.pow(prestigeEff(0,8))
        if (hasUpgrade("br",12)) s = s.pow(upgEffect(4,12))
        s = s.pow(tmp.dark.abEff.msoftcap||1)
        return s.max(1)
    },
    massSoftPower5() {
        let p = E(0.05)
        return p.pow(tmp.evo.meditation_eff.mass_softcap??1)
    },
    massSoftGain6() {
        if (player.ranks.hex.gte(48) || OURO.evo >= 2) return EINF
        let s = mlt(1e22)
        s = s.pow(tmp.dark.abEff.msoftcap||1)
        return s.max(1)
    },
    massSoftPower6() {
        let p = E(0.01)
        return p.pow(tmp.evo.meditation_eff.mass_softcap??1)
    },
    massSoftGain7() {
        if (player.ranks.hex.gte(62) || OURO.evo >= 2) return EINF
        let s = mlt(1e36)
        if (hasElement(159)) s = s.pow(tmp.dark.abEff.msoftcap||1)
        return s.max(1)
    },
    massSoftPower7() {
        let p = E(0.005)
        if (hasElement(159)) p = p.pow(0.8)
        return p.pow(tmp.evo.meditation_eff.mass_softcap??1)
    },
    massSoftGain8() {
        if (player.ranks.hex.gte(157) || OURO.evo >= 2) return EINF
        let s = E('ee63')
        if (hasElement(159)) s = s.pow(tmp.dark.abEff.msoftcap||1)
        return s.max(1)
    },
    massSoftPower8() {
        let p = E(0.001)
        if (hasElement(159)) p = p.pow(0.8)
        return p.pow(tmp.evo.meditation_eff.mass_softcap??1)
    },
    rp: {
        unl() { return OURO.evo >= 1 ? player.evo.cp.unl : tmp.rp.unl },
        gain() {
            if (player.mass.lt(1e14)) return E(0)
            if (OURO.evo == 0 || OURO.evo >= 2) if (tmp.c16.in || CHALS.inChal(7) || CHALS.inChal(10)) return E(0)

            let gain = player.mass.div(1e14).root(3), evo = OURO.evo
            if (player.ranks.rank.gte(45)) gain = gain.mul(RANKS.effect.rank[45]())
            if (player.ranks.tier.gte(6)) gain = gain.mul(RANKS.effect.tier[6]())
			if (hasUpgrade("rp",5)) gain = gain.mul(2)
            if (hasUpgrade("bh",6)) gain = gain.mul(tmp.upgs?tmp.upgs[2][6].effect:E(1))
            if (evo == 0 && hasTree("rp1")) gain = gain.mul(treeEff('rp1'))

			if (tmp.atom.unl) {
				if (!hasElement(105)) gain = gain.mul(tmp.atom.particles[1].powerEffect.eff1)
				else gain = gain.pow(tmp.atom.particles[1].powerEffect.eff1)
			}

            if (hasUpgrade("bh",8)) gain = gain.pow(1.15)
            gain = gain.pow(tmp.chal.eff[4])
            if (CHALS.inChal(4) || CHALS.inChal(10) || FERMIONS.onActive("03")) gain = gain.root(10)
            gain = gain.pow(tmp.prim.eff[1][0])

            if (QCs.active()) gain = gain.pow(tmp.qu.qc_eff[4])
            if (tmp.md.in) gain = expMult(gain,tmp.md.pen)

            if (evo == 0 && hasElement(165)) gain = gain.pow(treeEff('rp1'))
            if (evo == 0 && hasUpgrade('rp',18)) gain = gain.pow(upgEffect(1,18))
			if (evo < 2 && (tmp.dark.run)) gain = expMult(gain,mgEff(1))
            if (evo >= 1) {
                gain = gain.max(1).log10().add(1)
                gain = gain.mul(appleEffect('cp'))
                if (hasTree("rp1")) gain = gain.mul(treeEff('rp1'))
                if (hasElement(72,1)) gain = gain.mul(muElemEff(72))
                gain = gain.mul(wormholeEffect(2))
			    gain = gain.mul(nebulaEff("green"))
                if (hasElement(307)) gain = gain.mul(elemEffect(307))
				if (evo == 2 && (tmp.dark.run)) gain = gain.pow(mgEff(1))
            }

            return gain.floor()
        },
        reset() {
            if (tmp.rp.can) {
                if (player.confirms.rp) createConfirm("Are you sure you want to reset?",'rpReset',CONFIRMS_FUNCTION.rage)
                else CONFIRMS_FUNCTION.rage()
            }
        },
        doReset() {
            player.ranks[RANKS.names[RANKS.names.length-1]] = E(0)
            RANKS.doReset[RANKS.names[RANKS.names.length-1]]()
        },
    },
    bh: {
        see() { return FORMS.rp.unl() },
        unl() { return OURO.evo >= 2 ? player.evo.wh.unl : tmp.bh.unl },
        DM_gain() {
            const evo = OURO.evo;
            if (tmp.c16.in) return player.dark.matters.amt[0]

            let gain = E(0)
            if (evo == 0 || CHALS.inChal(7) || CHALS.inChal(10)) {
                if (tmp.rp.unl) gain = player.rp.points.div(1e25)
                if (CHALS.inChal(7) || CHALS.inChal(10)) gain = player.mass.div(1e180)
                if (gain.lt(1)) return E(0)
                gain = gain.root(4)
            } else {
				let cp = player.evo.cp.points
                if (cp.lt(evo>=2?1e5:5e3)) return E(0)
                gain = Decimal.pow(1.00001,cp).mul(5)
            }

            if (hasTree("bh1") && !hasElement(166)) gain = gain.mul(treeEff("bh1"))
            if (tmp.sn.boson && !hasElement(204)) gain = gain.mul(tmp.sn.boson.upgs.photon[0].effect)

            if (CHALS.inChal(7) || CHALS.inChal(10)) gain = gain.root(6)
			if (tmp.atom.unl) {
				if (!hasElement(105)) gain = gain.mul(tmp.atom.particles[2].powerEffect.eff1)
				else gain = gain.pow(tmp.atom.particles[2].powerEffect.eff1)
			}
            if (CHALS.inChal(8) || CHALS.inChal(10) || FERMIONS.onActive("12")) gain = gain.root(8)
            if (evo < 2) gain = gain.pow(tmp.chal.eff[8])
            gain = gain.pow(tmp.prim.eff[2][0])

            if (QCs.active()) gain = gain.pow(tmp.qu.qc_eff[4])
            if (tmp.md.in) gain = expMult(gain,tmp.md.pen)

            if (tmp.sn.boson && hasElement(204)) gain = gain.pow(tmp.sn.boson.upgs.photon[0].effect)
            if (tmp.sn.unl && hasElement(166)) gain = gain.pow(treeEff("bh1"))
            gain = gain.pow(tmp.matters.upg[0].eff)

            if (evo < 2 && tmp.dark.run) gain = expMult(gain,mgEff(1))
            if (evo >= 2) {
				let exp = 0.5
				if (hasElement(77, 1)) exp = 0.6
				if (hasElement(78, 1)) exp += 0.1
				if (hasElement(15)) exp += 0.1
				if (hasElement(71)) exp += 0.05
				exp += wormholeEffect(4, 0)

                gain = gain.max(1).log10().add(1)
                if (CHALS.inChal(7) || CHALS.inChal(10)) gain = player.mass.add(1).log10().div(50)

				gain = gain.pow(exp)
                gain = gain.mul(appleEffect('fabric'))
                gain = gain.mul(tmp.chal.eff[6])
                gain = gain.mul(tmp.chal.eff[8])
                if (CHALS.inChal(8)) gain = gain.sqrt()
                if (tmp.sn.boson) gain = gain.mul(tmp.sn.boson.upgs.photon[4].effect)
			    gain = gain.mul(nebulaEff("blue"))
				if (tmp.dark.run) gain = gain.pow(mgEff(1))
            }

            return gain.floor()
        },
        massPowerGain() {
            let x = E(0.35)
            if (FERMIONS.onActive("11")) return E(-1)
            if (hasElement(59)) x = E(0.45)
            x = x.add(radBoostEff(4, 0))
            x = x.add(tmp.dark.shadowEff.bhp||0)
            return x
        },
        massGain() {
            let x = tmp.bh.formula.mul(BUILDINGS.eff('bhc'))
            if (hasUpgrade("rp",11)) x = x.mul(tmp.upgs?tmp.upgs[1][11].effect:E(1))
            if (hasUpgrade("bh",14)) x = x.mul(tmp.upgs?tmp.upgs[2][14].effect:E(1))
            if (hasElement(46) && !hasElement(162)) x = x.mul(tmp.elements.effect[46])
            if (tmp.sn.boson) x = hasElement(204) ? x.pow(tmp.sn.boson.upgs.photon[0].effect) : x.mul(tmp.sn.boson.upgs.photon[0].effect)
            if (CHALS.inChal(8) || CHALS.inChal(10) || FERMIONS.onActive("12")) x = x.root(8)
            x = x.pow(tmp.chal.eff[8])

            if (QCs.active()) x = x.pow(tmp.qu.qc_eff[4])
            if (tmp.md.in) x = expMult(x,tmp.md.pen)
            x = x.softcap(tmp.bh.massSoftGain, .5, 0)

            x = x.pow(glyphUpgEff(2))
            if (hasUpgrade('atom',18)) x = x.pow(tmp.atom.particles[1].powerEffect.eff2)
            if (hasUpgrade('bh',20)) x = x.pow(upgEffect(2,20))
            if (hasCharger(0)) x = x.pow(2)
            if (hasBeyondRank(2,10)) x = x.pow(1.2)

            x = x.pow(tmp.unstable_bh.effect)
            if (tmp.inf_unl) x = x.pow(theoremEff('bh',0))
            if (hasInfUpgrade(1)) x = x.pow(infUpgEffect(1)[1])

            if (tmp.dark.run) x = expMult(x,mgEff(0))
            if (tmp.star_unl && hasElement(162)) x = x.pow(tmp.stars.effect[1]).pow(tmp.dark.run ? 5 : 100)

            let bhw = theoremEff('bh',5)

            let o = x
            let os = tmp.c16.in ? E('ee3') : E('ee69').pow(exoticAEff(1,1))
            let op = E(0.5).pow(bhw)

            let os2 = tmp.c16.in ? E('ee6') : E('ee249')
            let op2 = E(0.25).pow(bhw)

            if (hasElement(187)) os = os.pow(elemEffect(187))
            if (hasElement(200)) os = os.pow(tmp.chal.eff[15])
            if (hasTree('ct11')) os = os.pow(treeEff('ct11'))
            if (tmp.inf_unl) os = os.pow(theoremEff('bh',1))

            if (hasPrestige(2,45)) os2 = os2.pow(prestigeEff(2,45))
            if (hasElement(269)) os2 = os2.pow(elemEffect(269))
            if (hasElement(51,1)) os2 = os2.pow(muElemEff(51))
            if (hasElement(252)) os2 = expMult(os2,1.5)

            os = os.min(os2)

            if (hasPrestige(2,8)) op = op.pow(prestigeEff(2,8))

            x = overflow(x,os,op)
            x = overflow(x,os2,op2)

            tmp.overflowBefore.bh = o
            tmp.overflow.bh = calcOverflow(o,x,os)
            tmp.overflow_start.bh = [os,os2]
            tmp.overflow_power.bh = [op,op2]

            if (CHALS.inChal(13)) x = x.max(1).log10().tetrate(1.5)
            return x
        },
        massSoftGain() {
            let s = E(1.5e156)
            if (hasUpgrade("atom",6)) s = s.mul(tmp.upgs?tmp.upgs[3][6].effect:E(1))
            return s
        },
		formula() {
			return player.bh.mass.add(1).pow(tmp.bh.massPowerGain).overflow(tmp.bh.fSoftStart, tmp.bh.fSoftPower)
		},
        fSoftStart() {
            let x = uni("e3e9")
            if (hasElement(71)) x = x.pow(tmp.elements.effect[71])
            x = x.pow(radBoostEff(20))
            return x
        },
        fSoftPower() {
            let x = 0.95
            if (hasTree("qu3")) x **= 0.7
            return x
        },
        reset() {
            if (tmp.bh.dm_can) {
                if (player.confirms.bh) createConfirm("Are you sure you want to reset?",'bhReset',CONFIRMS_FUNCTION.bh)
                else CONFIRMS_FUNCTION.bh()
            }
        },
        doReset() {
            if (OURO.evo >= 1) {
                let s = OURO.save.evo.cp
                if (!hasElement(70,1) || (OURO.evo >= 2 && CHALS.inChal(6))) player.evo.cp.level = s.level
                player.evo.cp.points = s.points
                player.evo.cp.m_time = s.m_time
            } else {
				if (!hasInfUpgrade(18)) resetMainUpgs(1,[3,5,6])
				player.rp.points = E(0)
				BUILDINGS.reset('tickspeed')
				BUILDINGS.reset('accelerator')
				player.bh.mass = E(0)
			}

            FORMS.rp.doReset()
        },
        effect() {
			if (CHALS.inChal(17) && !hasElement(201)) return E(1)

			let x = (hasUpgrade('atom',12)?player.bh.mass.add(1).pow(1.25):player.bh.mass.mul(5).add(1).root(4))
			if (hasElement(89)) x = x.pow(tmp.elements.effect[89])

			if (hasElement(201)) x = Decimal.add(1.1,exoticAEff(0,5,0)).pow(x.max(1).log10().add(1).log10().pow(.8))
			if (hasUpgrade('bh',18)) x = x.pow(2.5)
			if (hasElement(201)) x = x.overflow('e1000',0.5)
			if (hasElement(48,1)) x = x.pow(theoremEff('bh',4))
			return x
        },
    }
}

function loop() {
    mass_type = ['short','standard'][player.options.massType]

    ssf[1]()
    updateTemp()

    diff = Date.now()-date;
    player.offline.current = date

    updateHTML()
    calc(diff/1000)
    date = Date.now()
}

function format(ex, acc=4, max=12, type=player.options.notation) {
    if (tmp.aprilEnabled && Math.random() < .9) return "Troll"

    ex = E(ex)

    neg = ex.lt(0)?"-":""
    if (ex.mag == Infinity) return neg + 'Infinite'
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

var mass_type = 'standard'
const VERSES = {
    standard: [
        [
            // Pre-Archverse Verses
            'multi',  'mega',   'giga'   ,'tera'  ,'peta'   ,'exa'   ,'zetta'   ,'yotta' ,'ronna'   ,'quetta',
            'xenna',  'weka',   'vendeka','uda'   ,'tradaka','sorta' ,'quexa'   ,'pepta' ,'ocha'    ,'nena',
            'minga',  'luma',   'kema'   ,'jretta','iqatta' ,'huitta','gatextta','feqesa','enscenda','desyta',
            'ceanata','bevvgta','avta'
        ],[
            // Pre-Lodeverse Verses
            'multi','meta','xeno','hyper','ultra','omni'
        ],
    ],
    short: [
        [
            // Pre-Archverse Verses
            'mlt','mg','gi','te','pe','ex','ze','yo','rn','qu',
             'xn','wk','ve','ud','tr','sr','qx','pp','oc','ne',
             'mi','lu','ke','jr','iq','hu','ga','fe','en','ds',
             'ce','be','av'
        ],[
            // Pre-Lodeverse Verses
            'mlt','met','xen','hyp','ult','omv'
        ],
    ]
}
const MASS_NAMES = {
    standard: [
        'gramm',
        'kilogramm',
        'tonne',
        'mass of mount everest',
        'mass of earth',
        'mass of sun',
        'mass of milky way galaxy',
        'universe',

        'verse', // 8
        'arch',  // 9
        'lode',  // 10
    ],
    short: [
        'g',
        'kg',
        'tonne',
        'MME',
        'M⊕',
        'M☉',
        'MMWG',
        'uni',

        'v',  // 8
        'ar', // 9
        'ld', // 10
    ],
}

function getMltValue(mass){
	mass = E(mass);
	if(mass.lte(1e50)){
		return mass.div(1.5e56).mul(Decimal.log10(Decimal.exp(1))).div(1e9);
	}else{
		return mass.div(1.5e56).add(1).log10().div(1e9);
	}
}

function getARVName(i,lode) { const n = MASS_NAMES[mass_type], v = VERSES[mass_type][0][i-1]; return i > 0 ? v ? v + (!lode && (mass_type == 'standard' || i != 1) ? n[8] : "") : (lode ? n[9] : n[9]+n[8])+formatPow(i,0) : "" }

function formatARV(ex,lode) {
    if (lode && ex.lt(1e15)) return format(ex) + " "
    const n = MASS_NAMES[mass_type]
    const mlt = lode ? ex.div(1e15) : getMltValue(ex);
    const arv = mlt.log10().div(15)
	if(arv.add(1).gte(1000)) return format(arv.add(1))+" "+n[9]+ (lode ? "s-" : n[8]+"s");
    return format(mlt.div(Decimal.pow(1e15,arv.floor()))) + " " + getARVName(arv.add(1).floor().toNumber(),lode) + (lode ? "-" : "")
}

function formatLDV(ex) {
    const n = MASS_NAMES[mass_type]
    const ldv = E(ex).slog(10).toNumber() - 1.9542425094393248
    const ldv_floor = Math.floor(ldv)
    if (ldv >= 1000) return format(ldv)+' '+n[10]+n[8]+'s'
    var v = VERSES[mass_type][1][ldv_floor-1]
    return formatARV(ex.iteratedlog(10,ldv_floor).div(1e9),true) + "" + (v ? v + (mass_type == 'standard' ? n[8] : "") : n[10]+n[8]+formatPow(ldv_floor,0))
    // Decimal.tetrate(10, ldv % 1 + 1).div(10)
}

const DT = Decimal.tetrate(10,6)
const MAX_ARVS = Decimal.iteratedexp(10,2,VERSES.standard[0].length*15+9)
const LOG_MAX_ARVS = MAX_ARVS.log10()
const MAX_LDVS = Decimal.iteratedexp(10,VERSES.standard[1].length+2,9)

function formatGain(a,e,mass) {
    const g = Decimal.add(a,e), f = mass ? formatMass : format, n = MASS_NAMES[mass_type], verse = n[8], arch = n[9], lode = n[10];

    if (mass && player.options.massDis == 1) mass = false

    if (g.neq(a)) {
        if (mass) {
            if (a.gte('eee9')) {
                var ldv = E(a).slog(10).toNumber() - 1.9542425094393248, ldv_floor = Math.floor(ldv)

                if (a.gte(MAX_LDVS)) {
                    ldv = E(g).slog(10).sub(E(a).slog(10)).mul(FPS)
                    if (ldv.gte(1)) return "(+" + ldv.format() + " "+lode+verse+"s/s)"
                }

                var sg = E(g).iteratedlog(10,ldv_floor), sa = E(a).iteratedlog(10,ldv_floor), rate = ""

                if (sa.gte(LOG_MAX_ARVS)) {
                    var arv = sg.div(sa).log10().div(15).mul(FPS)
                    if (arv.gte(1)) rate = arv.format() + " "+arch+"s-"
                }

                if (rate === '') rate = formatARV(sg.sub(sa).div(1e9).mul(FPS),true)
                
                var v = VERSES[mass_type][1][ldv_floor-1]
                return "(+" + rate + "" + (v ? v + (mass_type == 'standard' ? verse : "") : lode+verse+formatPow(ldv_floor,0)) + "/s)"
            }

            if (a.gte(MAX_ARVS)) {
                var arv = E(g).log10().div(E(a).log10()).log10().div(15).mul(FPS)
                return "(+" + arv.format() + " "+arch+verse+"s/s)"
            }
        } else {
            if (a.gte(DT)) {
                var oom = E(g).slog(10).sub(E(a).slog(10)).mul(FPS)
                if (oom.gte(1e-3)) return "(+" + oom.format() + " OoMs^^2/s)"
            }
    
            if (a.gte('ee100')) {
                var tower = Math.floor(E(a).slog(10).toNumber() - 1.3010299956639813);
        
                var oom = E(g).iteratedlog(10,tower).sub(E(a).iteratedlog(10,tower)).mul(FPS), rated = false;
        
                if (oom.gte(1)) rated = true
                else if (tower > 2) {
                    tower--
                    oom = E(g).iteratedlog(10,tower).sub(E(a).iteratedlog(10,tower)).mul(FPS)
                    if (oom.gte(1)) rated = true
                }
        
                if (rated) return "(+" + oom.format() + " OoMs^"+tower+"/s)"
            }
        }
    
        if (a.gte(1e100)) {
            const oom = g.div(a).log10().mul(FPS)
            if (mass && oom.gte(1e9) && a.lt(MAX_ARVS)) return "(+" + formatARV(Decimal.pow(10,oom)) + "/s)"
            if (oom.gte(1)) return "(+" + oom.format() + " OoMs/s)"
        }
    }

    return "(+" + f(e) + "/s)"
}

function formatMass(ex) {
    ex = E(ex)

    const n = MASS_NAMES[mass_type]
    let md = player.options.massDis

    if (md == 1 || ex.gte(EINF)) return format(ex) + ' ' + n[0]

    if (ex.gte('eee9')) return formatLDV(ex)
    if (ex.gte('1.5e1000000056')) return formatARV(ex)
    if (ex.gte(1.5e56)) return format(ex.div(1.5e56)) + ' ' + n[7]
    if (ex.gte(2.9835e45)) return format(ex.div(2.9835e45)) + ' ' + n[6]
    if (ex.gte(1.989e33)) return format(ex.div(1.989e33)) + ' ' + n[5]
    if (ex.gte(5.972e27)) return format(ex.div(5.972e27)) + ' ' + n[4]
    if (ex.gte(1.619e20)) return format(ex.div(1.619e20)) + ' ' + n[3]
    if (ex.gte(1e6)) return format(ex.div(1e6)) + ' ' + n[2]
    if (ex.gte(1e3)) return format(ex.div(1e3)) + ' ' + n[1]
    return format(ex) + ' ' + n[0]
}

function formatTime(ex,acc=2,type="s") {
    ex = E(ex)
    if (ex.gte(86400)) return format(ex.div(86400).floor(),0,12,"sc")+":"+formatTime(ex.mod(86400),acc,'d')
    if (ex.gte(3600)||type=="d") return (ex.div(3600).gte(10)||type!="d"?"":"0")+format(ex.div(3600).floor(),0,12,"sc")+":"+formatTime(ex.mod(3600),acc,'h')
    if (ex.gte(60)||type=="h") return (ex.div(60).gte(10)||type!="h"?"":"0")+format(ex.div(60).floor(),0,12,"sc")+":"+formatTime(ex.mod(60),acc,'m')
    return (ex.gte(10)||type!="m" ?"":"0")+format(ex,acc,12,"sc")
}

function formatReduction(ex,acc) { ex = E(ex); return format(E(1).sub(ex).mul(100),acc)+"%" }

function formatPercent(ex,acc) { ex = E(ex); return format(ex.mul(100),acc)+"%" }

function formatMult(ex,acc=4) { ex = E(ex); return ex.gte(1)?"×"+ex.format(acc):"/"+ex.pow(-1).format(acc)}

function formatPow(ex,acc=4) { return "^"+format(ex,acc) }

function expMult(a,b,base=10) { return Decimal.gte(a,10) ? Decimal.pow(base,Decimal.log(a,base).pow(b)) : E(a) }

function overflowFormat(x,inv=false) { return (inv?"raised":"rooted")+" by <b>"+format(x)+"</b>" }

function capitalFirst(str) {
	if (str=="" || str==" ") return str
	return str
		.split(" ")
		.map(x => x[0].toUpperCase() + x.slice(1))
		.join(" ");
}