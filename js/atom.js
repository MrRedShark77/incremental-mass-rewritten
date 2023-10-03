const ATOM = {
    gain() {
        if (CHALS.inChal(12)) return E(0)
        let x, evo = EVO.amt;
		if (evo >= 3) {
            if (player.evo.wh.fabric.lt(1e3)) return E(0)
			x = expMult(player.evo.wh.fabric.div(1e3), hasElement(93,1)?0.35:0.2)
			x = x.mul(appleEffect("ps"))
            if (tmp.chal) x = x.mul(tmp.chal.eff[9]).mul(tmp.chal.eff[10])
            if (hasElement(123)) x = x.mul(elemEffect(123))
            if (hasElement(291)) x = x.mul(elemEffect(291))
            if (hasElement(292)) x = x.mul(elemEffect(292))
            if (hasElement(297)) x = x.mul(elemEffect(297))
            if (hasElement(303)) x = x.mul(elemEffect(303))
            if (tmp.sn.boson) x = x.mul(tmp.sn.boson.upgs.gluon[4].effect)
            if (evo >= 4) x = x.mul(getEnRewardEff(7))
		    if (QCs.active() && evo >= 4) x = x.mul(tmp.qu.qc.eff[3])

            if (hasElement(169)) x = x.pow(1.05)
            if (tmp.inf_unl) x = x.pow(theoremEff('atom',5))
			return x
        } else if (evo >= 2) {
            if (player.evo.wh.fabric.lt(300)) return E(0)
            x = player.evo.wh.fabric.div(150).sub(1).sqrt()
			if (!tmp.c16.in) x = E(2).pow(x).mul(5)
        } else {
            x = player.bh.mass.div(hasUpgrade("br",1)?1.5e156**0.5:1.5e156)
            if (x.lt(1)) return E(0)
            x = x.root(5)
        }

        if (hasUpgrade("rp",15)) x = x.mul(upgEffect(1,15))
        if (tmp.sn.boson) x = hasElement(204) ? x.pow(tmp.sn.boson.upgs.gluon[0].effect) : x.mul(tmp.sn.boson.upgs.gluon[0].effect)
        if (hasElement(17)) x = x.pow(1.1)
        x = x.pow(tmp.qu.prim.eff[3][0])
        if (hasElement(111)) x = x.pow(elemEffect(111))

        if (QCs.active()) x = x.pow(tmp.qu.qc.eff[4])
        if (FERMIONS.onActive("10")) x = expMult(x,0.625)

        x = x.pow(glyphUpgEff(5))
        if (hasUpgrade('br',17)) x = x.pow(upgEffect(4,17))

        if (tmp.dark.run) x = expMult(x,mgEff(2))

        return x.floor()
    },
    quarkGain() {
		let x = tmp.atom.gain
        if (hasZodiacUpg("taurus", "u4")) x = x.max(player.evo.proto.star.div(10))

        if (x.lt(1)) return E(0)
        let evo = EVO.amt

		if (evo >= 3) {
            let k = E(1)
            if (hasElement(1)) k = k.add(0.25)
            if (hasElement(84,1)) k = k.add(0.25)
            if (hasElement(86,1)) k = k.add(0.1)
            if (hasElement(305)) k = k.add(elemEffect(305, 0))
            if (evo >= 4 && player.dark.unl) k = k.add(tmp.dark.shadowEff.qkf||0).add(tmp.dark.abEff.qkf||0)
            if (evo >= 4 && hasElement(213)) k = k.add(.01)
            if (evo >= 4 && tmp.inf_unl) k = k.add(theoremEff("atom", 1, 0))

            let s = E(1e9)
            if (tmp.inf_unl) s = s.mul(theoremEff('time',4))

            x = expMult(x.overflow(s, hasElement(299) ? 2/3 : .5).sub(1), k)
			x = E(1.01).pow(x)
        }
        else if (hasElement(1)) x = E(1.25).pow(x.max(1).log10())
		else x = x.log10().pow(1.5).add(1)

        if (!tmp.c16.in) x = x.pow(escrowBoost("qk"))

        if (hasUpgrade("bh",13)) x = x.mul(10)
        if (hasUpgrade("atom",8)) x = x.mul(upgEffect(3,8))
        if (player.ranks.rank.gte(300)) x = x.mul(RANKS.effect.rank[300]())
        if (hasElement(42)) x = x.mul(elemEffect(42))
        if (hasMDUpg(6)) x = x.mul(mdEff(6))
        x = x.mul(mdEff(9))

        if (hasElement(6)) x = hasElement(276) ? x.pow(elemEffect(6)) : x.mul(elemEffect(6))
        if (hasElement(67)) x = hasElement(236) || evo >= 2 ? x.pow(elemEffect(67)) : x.mul(elemEffect(67))
        if (hasElement(47)) x = x.pow(1.1)
        if (hasPrestige(1,7)) x = x.pow(prestigeEff(1,7))
        if (hasUpgrade('atom',17)) x = x.pow(upgEffect(3,17))
        if (tmp.inf_unl) x = x.pow(theoremEff('atom',0))

        if (tmp.dark.run) x = expMult(x,mgEff(2))
        if (tmp.inf_unl && evo >= 2) x = expMult(x,GPEffect(1).pow(-1))

        let os = E('ee90'), op = E(.5), o = x
        if (evo >= 4) os = EINF
        else {
            if (evo >= 2) os = E("ee70")
            if (tmp.chal) os = os.pow(tmp.chal.eff[15])
            if (tmp.c16.in && evo < 2) os = E("ee6")
            os = os.pow(tmp.dark.abEff.ApQ_Overflow||1)

            if (hasUpgrade('atom',16)) os = os.pow(10)
            if (tmp.inf_unl) os = os.pow(theoremEff('atom',1))

            if (hasElement(45,1)) op = op.pow(0.75)
            op = op.pow(escrowBoost('quark_overflow'))
        }

        x = overflow(x,os,op)

        tmp.overflowBefore.quark = o
        tmp.overflow.quark = calcOverflow(o,x,os)
        tmp.overflow_start.quark = os
        tmp.overflow_power.quark = op

        return x.floor()
    },
    canReset() { return tmp.atom.gain.gte(1) },
    reset() {
        if (tmp.atom.canReset) getResetConfirm("atom")
    },
    doReset(chal_reset=true) {
        player.atom.atomic = E(0)
        FORMS.bh.doReset()
        if (EVO.amt >= 2) {
			resetEvolutionSave("atom")
			return
		}

        if (!hasInfUpgrade(18)) {
			let k = [3,5]
			if (hasUpgrade("atom", 3)) k.push(6)
			resetMainUpgs(2,k)
		}
        if (chal_reset && !hasUpgrade("atom",4) && !hasTree("chal2")) for (let x = 1; x <= 4; x++) player.chal.comps[x] = E(0)

        player.bh.dm = E(0)
        BUILDINGS.reset('bhc')
    },
    atomic: {
        gain() {
            let greff = {eff: BUILDINGS.eff('cosmic_ray'),exp: BUILDINGS.eff('cosmic_ray', 'exp')}

            let x = greff.eff
            if (hasElement(3)) x = x.mul(elemEffect(3))
            if (hasElement(52)) x = x.mul(elemEffect(52))
            if (tmp.sn.boson) x = hasElement(204) ? x.pow(tmp.sn.boson.upgs.gluon[0].effect) : x.mul(tmp.sn.boson.upgs.gluon[0].effect)

            if (QCs.active()) x = x.pow(tmp.qu.qc.eff[4])
            if (FERMIONS.onActive("00")) x = expMult(x,0.6)
            if (tmp.md.in) x = expMult(x,tmp.md.pen)

            if (hasGlyphUpg(12)) x = x.pow(greff.exp)
            if (hasUpgrade('bh',22)) x = x.pow(upgEffect(2,22))
            if (tmp.dark.run) x = expMult(x,mgEff(2))

            let o = x
            let os = tmp.c16.in ? E('e500') : E('ee82')
			if (tmp.chal) os = os.pow(tmp.chal.eff[15])
			if (tmp.c16.in && EVO.amt < 2) os = E("e500")
            os = os.pow(tmp.dark.abEff.ApQ_Overflow||1)
            if (tmp.inf_unl) os = os.pow(theoremEff('atom',1))

            if (hasAscension(0,13) || EVO.amt >= 2) os = EINF
            x = overflow(x,os,0.25)

            tmp.overflow.atomic = calcOverflow(o,x,os)
            tmp.overflow_start.atomic = os

            return x
        },
        effect() {
            let base = hasElement(23)?1.5:1.75
            let x = player.atom.atomic.max(1).log(base).pow(getEnRewardEff(1))
            if (!hasElement(75)) x = x.softcap(5e4,0.75,0).softcap(4e6,0.25,0)

            let w = 0.1 ** exoticAEff(0,4)
            x = x.softcap(hasUpgrade("atom",13)?1e11:1e10,w,0).softcap(2.5e35,w,0)
            x = overflow(x,'e2000',0.5)

            let y = 1
            if (EVO.amt >= 1) y = expMult(player.atom.atomic.add(1).log10().div(5).add(1),0.5)
            return [x.floor(),y]
        },
    },
    particles: {
        names: ['Protons', 'Neutrons', 'Electrons'],
        assign(x) {
            if (player.atom.quarks.lt(1) || CHALS.inChal(9) || FERMIONS.onActive("12")) return
            let m = player.atom.ratio
            let spent = m > 0 ? player.atom.quarks.mul(RATIO_MODE[m]).ceil() : E(1)
            player.atom.quarks = player.atom.quarks.sub(spent).max(0)
            player.atom.particles[x] = player.atom.particles[x].add(spent)
        },
        assignAll() {
            let sum = player.atom.dRatio[0]+player.atom.dRatio[1]+player.atom.dRatio[2]
            if (player.atom.quarks.lt(sum) || CHALS.inChal(9) || FERMIONS.onActive("12")) return
            let spent = player.atom.quarks.div(sum).floor()
            for (let x = 0; x < 3; x++) {
                let add = spent.mul(player.atom.dRatio[x])
                player.atom.quarks = player.atom.quarks.sub(add).max(0)
                player.atom.particles[x] = player.atom.particles[x].add(add)
            }
        },
        effect(i) {
            let p = player.atom.particles[i]
            let x = p.pow(2)
            if (hasElement(12)) x = p.pow(p.add(1).log10().add(1).root(4).pow(tmp.chal ? tmp.chal.eff[9] : E(1)).softcap(40000,0.1,0))
            x = x.softcap('e3.8e4',0.9,2).softcap('e1.6e5',0.9,2)
            if (hasElement(61)) x = x.mul(p.add(1).root(2))
            if (!hasElement(169)) x = x.softcap('ee11',0.9,2).softcap('ee13',0.9,2)
            return x
        },
        gain(i) {
            let x = tmp.atom.particles[i]?tmp.atom.particles[i].effect:E(0)
            if (hasUpgrade("atom",7)) x = x.mul(upgEffect(3,7))
            if (QCs.active()) x = x.pow(tmp.qu.qc.eff[4])
            if (hasUpgrade('atom',21)) x = expMult(x,5)
            return x.div(10)
        },
        powerEffect: [
            x=>{
                let a = hasPrestige(1,400) ? overflow(Decimal.pow(2,x.add(1).log10().add(1).log10().root(2)),10,0.5) : hasElement(198) ? x.add(1).log10().add(1).log10().div(10).add(1).pow(2) : hasElement(105) ? x.add(1).log10().add(1).log10().root(2).div(10).add(1) : x.add(1).pow(3)
                let b = hasElement(29) ? x.add(1).log2().pow(1.25).mul(0.01) : x.add(1).pow(2.5).log2().mul(0.01)

                return {eff1: a, eff2: b}
            },
            x=>{
                let a = hasPrestige(1,400) ? overflow(Decimal.pow(2,x.add(1).log10().add(1).log10().root(2)),10,0.5) : hasElement(198) ? x.add(1).log10().add(1).log10().div(10).add(1).pow(2) : hasElement(105) ? x.add(1).log10().add(1).log10().root(2).div(10).add(1) : x.add(1).pow(2)

				let bp = EVO.amt >= 1 ? Decimal.pow(2,player.evo.cp.points) : player.rp.points
                let b = hasUpgrade('atom',18)
                ?Decimal.pow(1.1,
                    bp.add(1).log10().add(10).log10().mul(x.add(1).log10().add(10).log10()).root(3).sub(1)
                )
                .mul(player.mass.add(1).log10().add(10).log10())
                :(hasElement(19)
                ?player.mass.max(1).log10().add(1).pow(bp.max(1).log10().mul(x.max(1).log10()).root(2.75))
                :player.mass.max(1).log10().add(1).pow(bp.max(1).log(100).mul(x.max(1).log(100)).root(3))).min('ee200')
				if (CHALS.inChal(17) && !hasUpgrade('atom',18)) b = E(1)

                if (hasUpgrade('atom',18)) b = overflow(b,1e120,0.5)

                return {eff1: a, eff2: b}
            },
            x=>{
                let a = hasPrestige(1,400) ? overflow(Decimal.pow(2,x.add(1).log10().add(1).log10().root(2)),10,0.5) : hasElement(198) ? x.add(1).log10().add(1).log10().div(10).add(1).pow(2) : hasElement(105) ? x.add(1).log10().add(1).log10().root(2).div(10).add(1) : x.add(1)
                let b = hasElement(30) ? x.add(1).log2().pow(1.2).mul(0.01) : x.add(1).pow(2).log2().mul(0.01)

                return {eff1: a, eff2: b}
            },
        ],
        desc: [
            x=>{ return `Boost Mass gain by ${hasElement(105)?formatPow(x.eff1):format(x.eff1)+"x"}<br><br>`+
                (EVO.amt == 0 ? `Increases Tickspeed Power by ${format(x.eff2.mul(100))}%` : ``)
            },
            x=>{ return `Boost Rage Power gain by ${hasElement(105)?formatPow(x.eff1):format(x.eff1)+"x"}<br><br>` +
                (EVO.amt < 2 ? `Boost Mass gain based on Rage Powers - ${hasUpgrade('atom',18)?formatPow(x.eff2):format(x.eff2)+"x"}<br><br>` : ``)
            },
            x=>{ return `Boost Dark Matter gain by ${hasElement(105)?formatPow(x.eff1):format(x.eff1)+"x"}<br><br>`+
                (EVO.amt < 2 ? `Increases BH Condenser Power by ${format(x.eff2)}` : ``)
            },
        ],
        colors: ['#0f0','#ff0','#f00'],
    },
}

const RATIO_MODE = [null, 0.25, 1]
const RATIO_ID = ["+1", '25%', '100%']

function updateAtomTemp() {
    let tt = tmp.atom = {}
    tt.unl = player.atom.unl && EVO.amt < 3
    tt.gain = ATOM.gain()
    tt.quarkGain = ATOM.quarkGain()
    tt.quarkGainSec = 0.05
    if (hasElement(16)) tt.quarkGainSec += elemEffect(16, 0)
    tt.canReset = ATOM.canReset()

    updateMDTemp()
    updateStarsTemp()

	if (!tt.unl) return
	tt.atomicGain = ATOM.atomic.gain()
	tt.atomicEff = ATOM.atomic.effect()
	tt.particles = {}
	for (let x = 0; x < ATOM.particles.names.length; x++) {
		let pt = tt.particles[x] = {}
		pt.effect = ATOM.particles.effect(x)
		pt.powerGain = ATOM.particles.gain(x)
		pt.powerEffect = ATOM.particles.powerEffect[x](player.atom.powers[x])
	}
}

function setupAtomHTML() {
    let particles_table = new Element("particles_table")
	let table = ""
    for (let x = 0; x < ATOM.particles.names.length; x++) {
        table += `
        <div style="width: 30%"><button class="btn" onclick="ATOM.particles.assign(${x})">Assign</button><br><br>
            <div style="color: ${ATOM.particles.colors[x]}; min-height: 120px">
                <h2><span id="particle_${x}_amt">X</span> ${ATOM.particles.names[x]}</h2><br>
                Which generates <span id="particle_${x}_amtEff">X</span> ${ATOM.particles.names[x]} Powers<br>
                You have <span id="particle_${x}_power">X</span> ${ATOM.particles.names[x]} Powers, which:
            </div><br><div id="particle_${x}_powerEff"></div>
        </div>
        `
    }
	particles_table.setHTML(table)
}

function updateAtomicHTML() {
    tmp.el.atomicAmt.setHTML(format(player.atom.atomic)+" "+formatGain(player.atom.atomic, tmp.atom.atomicGain.mul(tmp.qu.speed)))
	tmp.el.atomicEff.setHTML(
        `Which provides <h4>${format(tmp.atom.atomicEff[0],0)+(tmp.atom.atomicEff[0].gte(5e4)?" <span class='soft'>(softcapped)</span>":"")}</h4> free Tickspeeds`
        +(EVO.amt >= 1 ? ` and increases meditation's level by <h4>${formatMult(tmp.atom.atomicEff[1],2)}</h4>` : "")
    )

    BUILDINGS.update('cosmic_ray')

    tmp.el.atomicOverflow.setDisplay(player.atom.atomic.gte(tmp.overflow_start.atomic))
    tmp.el.atomicOverflow.setHTML(`Because of atomic power overflow at <b>${format(tmp.overflow_start.atomic)}</b>, your atomic power gain is ${overflowFormat(tmp.overflow.atomic||1)}!`)
}

function updateAtomHTML() {
    tmp.el.atom_ratio.setTxt(RATIO_ID[player.atom.ratio])
    tmp.el.unassignQuarkAmt.setTxt(format(player.atom.quarks,0))
    for (let x = 0; x < ATOM.particles.names.length; x++) {
        tmp.el["particle_"+x+"_amt"].setTxt(format(player.atom.particles[x],0))
        tmp.el["particle_"+x+"_amtEff"].setTxt(format(tmp.atom.particles[x].powerGain))
        tmp.el["particle_"+x+"_power"].setTxt(format(player.atom.powers[x])+" "+formatGain(player.atom.powers[x],tmp.atom.particles[x].powerGain.mul(tmp.qu.speed)))
        tmp.el["particle_"+x+"_powerEff"].setHTML(ATOM.particles.desc[x](tmp.atom.particles[x].powerEffect))
    }

    tmp.el.quarkOverflow.setDisplay(player.atom.quarks.gte(tmp.overflow_start.quark))
    tmp.el.quarkOverflow.setHTML(`Because of quark overflow at <b>${format(tmp.overflow_start.quark)}</b>, your quark gain is ${overflowFormat(tmp.overflow.quark||1)}!`)
}

function calcAtoms(dt) {
	let du_gs = tmp.qu.speed.mul(dt), inf_gs = tmp.preInfGlobalSpeed.mul(dt)

	if (tmp.passive >= 3) player.atom.points = player.atom.points.add(tmp.atom.gain.mul(du_gs))
	player.atom.atomic = player.atom.atomic.add(tmp.atom.atomicGain.mul(du_gs))

	if (hasElement(30) && !(CHALS.inChal(9) || FERMIONS.onActive("12"))) for (let x = 0; x < 3; x++) player.atom.particles[x] = player.atom.particles[x].add(player.atom.quarks.mul(du_gs).div(10))
	for (let x = 0; x < 3; x++) player.atom.powers[x] = player.atom.powers[x].add(tmp.atom.particles[x].powerGain.mul(du_gs))

	player.md.mass = player.md.mass.add(tmp.md.mass_gain.mul(du_gs))
	if (hasTree("qol3")) player.md.particles = player.md.particles.add(inMD() ? tmp.md.rp_gain.mul(du_gs) : tmp.md.passive_rp_gain.mul(du_gs))
	if (hasElement(43)) for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) if ((hasTree("qol3") || player.md.upgs[x].gt(0)) && (MASS_DILATION.upgs.ids[x].unl?MASS_DILATION.upgs.ids[x].unl():true)) MASS_DILATION.upgs.buy(x)

    if (hasUpgrade('br',9)) {
        player.md.break.energy = player.md.break.energy.add(tmp.bd.energyGain.mul(inf_gs))
        player.md.break.mass = player.md.break.mass.add(tmp.bd.massGain.mul(inf_gs))
		if (hasElement(123)) for (let x = 0; x < MASS_DILATION.break.upgs.ids.length; x++) if (MASS_DILATION.break.upgs.ids[x].unl?MASS_DILATION.break.upgs.ids[x].unl():true) MASS_DILATION.break.upgs.buy(x)
    }
}