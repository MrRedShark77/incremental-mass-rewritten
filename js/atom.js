const ATOM = {
    gain() {
        if (player.chal.active == 13) return E(0)
        let x = player.bh.mass.div(1.5e156)
        if (x.lt(1)) return E(0)
        x = x.root(5)
        if (player.mainUpg.rp.includes(15)) x = x.mul(tmp.upgs.main?tmp.upgs.main[1][15].effect:E(1))
        x = x.mul(tmp.bosons.upgs.gluon[0].effect)
        if (hasElement(17)) x = x.pow(1.1)
        if (FERMIONS.onActive("10")) x = expMult(x,0.625)
        return x.floor()
    },
    quarkGain() {
        if (player.chal.active == 13) return E(0)
        if (tmp.atom.gain.lt(1)) return E(0)
        x = tmp.atom.gain.max(1).log10().pow(1.1).add(1)
        if (hasElement(1)) x = E(1.25).pow(tmp.atom.gain.max(1).log10())
        if (player.mainUpg.bh.includes(13)) x = x.mul(10)
        if (player.mainUpg.atom.includes(8)) x = x.mul(tmp.upgs.main?tmp.upgs.main[3][8].effect:E(1))
        if (player.ranks.rank.gte(300)) x = x.mul(RANKS.effect.rank[300]())
        if (hasElement(6)) x = x.mul(tmp.elements.effect[6])
        if (hasElement(42)) x = x.mul(tmp.elements.effect[42])
        if (hasElement(67)) x = x.mul(tmp.elements.effect[67])
        if (player.md.upgs[6].gte(1)) x = x.mul(tmp.md.upgs[6].eff)
        x = x.mul(tmp.md.upgs[9].eff)
        if (hasElement(47)) x = x.pow(1.1)
        return x.floor()
    },
    canReset() { return tmp.atom.gain.gte(1) },
    reset() {
        if (tmp.atom.canReset) if (player.confirms.atom?confirm("Are you sure to reset?"):true) {
            player.atom.points = player.atom.points.add(tmp.atom.gain)
            player.atom.quarks = player.atom.quarks.add(tmp.atom.quarkGain)
            player.atom.unl = true
            this.doReset()
        }
    },
    doReset(chal_reset=true) {
        player.atom.atomic = E(0)
        player.bh.dm = E(0)
        player.bh.condenser = E(0)
		resetExtraBuildings("bh")
        let keep = []
        for (let x = 0; x < player.mainUpg.bh.length; x++) if ([5].includes(player.mainUpg.bh[x])) keep.push(player.mainUpg.bh[x])
        player.mainUpg.bh = keep
        if (chal_reset && !player.mainUpg.atom.includes(4) && !hasTreeUpg("chal2") ) for (let x = 1; x <= 4; x++) player.chal.comps[x] = E(0)
        FORMS.bh.doReset()
    },
    atomic: {
        gain() {
            let x = tmp.atom.gamma_ray_eff?tmp.atom.gamma_ray_eff.eff:E(0)
            if (hasElement(3)) x = x.mul(tmp.elements.effect[3])
            if (hasElement(52)) x = x.mul(tmp.elements.effect[52])
            x = x.mul(tmp.bosons.upgs.gluon[0].effect)
            if (FERMIONS.onActive("00")) x = expMult(x,0.6)
            if (tmp.md.active) x = MASS_DILATION.applyDil(x)
            return x
        },
		softcap() {
			let r = E(5e4)
			if (AXIONS.unl()) r = r.mul(tmp.ax.eff[1])
			return r
		},
		effect() {
			if (CHALS.inChal(14)) return E(0)
			let sc = ATOM.atomic.softcap()
			let x = player.atom.atomic.max(1).log(hasElement(23)?1.5:1.75).softcap(sc,0.75,0).softcap(sc.mul(800),0.25,0)
			return x.floor()
		},
    },
    gamma_ray: {
        buy() {
            if (tmp.atom.gamma_ray_can) {
                player.atom.points = player.atom.points.sub(tmp.atom.gamma_ray_cost).max(0)
                player.atom.gamma_ray = player.atom.gamma_ray.add(1)
            }
        },
        buyMax() {
            if (tmp.atom.gamma_ray_can) {
                player.atom.gamma_ray = tmp.atom.gamma_ray_bulk
                player.atom.points = player.atom.points.sub(tmp.atom.gamma_ray_cost).max(0)
            }
			buyExtraBuildings("ag",2)
			buyExtraBuildings("ag",3)
        },
        effect() {
            let t = player.atom.gamma_ray
            t = t.mul(tmp.radiation.bs.eff[10])
            let pow = E(2)
            if (player.mainUpg.atom.includes(4)) pow = pow.add(tmp.upgs.main?tmp.upgs.main[3][4].effect:E(0))
            if (player.mainUpg.atom.includes(11)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[3][11].effect:E(1))
            if (hasTreeUpg("gr1")) pow = pow.mul(tmp.supernova.tree_eff.gr1)
            pow = pow.mul(tmp.bosons.upgs.gluon[1].effect)
            if (hasTreeUpg("gr2")) pow = pow.pow(1.25)
            let eff = pow.pow(t.add(tmp.atom.gamma_ray_bonus)).sub(1)
            return {pow: pow, eff: eff}
        },
        bonus() {
            let x = tmp.fermions.effs[0][0]||E(0)
            return x
        },
    },
    particles: {
        names: ['Proton', 'Neutron', 'Electron'],
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
            if (hasElement(12)) x = p.pow(p.add(1).log10().add(1).pow(tmp.chal.eff[9].exp.div(4)).mul(tmp.chal.eff[9].mul)) //Maximum of ^1.325
			if (AXIONS.unl()) x = x.pow(tmp.ax.eff[4])
            x = x.softcap('e3.8e4',0.9,2).softcap('e1.6e5',0.9,2).softcap('e1e11',0.931,2)
            return x
        },
        gain(i) {
            let x = tmp.atom.particles[i]?tmp.atom.particles[i].effect:E(0)
            if (player.mainUpg.atom.includes(7)) x = x.mul(tmp.upgs.main?tmp.upgs.main[3][7].effect:E(1))
            return x
        },
        powerEffect: [
            x=>{
                let a = x.add(1).pow(3)
                let b = hasElement(29) ? x.add(1).log2().pow(1.25).mul(0.01) : x.add(1).pow(2.5).log2().mul(0.01)
                return {eff1: a, eff2: b}
            },
            x=>{
                let a = x.add(1).pow(2)
                let b = hasElement(19)
                ?player.mass.max(1).log10().add(1).pow(player.rp.points.max(1).log(10).mul(x.max(1).log(10)).root(2.75))
                :player.mass.max(1).log10().add(1).pow(player.rp.points.max(1).log(100).mul(x.max(1).log(100)).root(3))
                return {eff1: a, eff2: b}
            },
            x=>{
                let a = x.add(1)
                let b = hasElement(30) ? x.add(1).log2().pow(1.2).mul(0.01) : x.add(1).pow(2).log2().mul(0.01)
                return {eff1: a, eff2: b}
            },
        ],
        desc: [
            x=>{ return `
                Multiplies Mass gain by ${format(x.eff1)}<br><br>
                Adds Tickspeed Power by ${format(x.eff2.mul(100))}%
            ` },
            x=>{ return `
                Multiplies Rage Power gain by ${format(x.eff1)}<br><br>
                Makes Mass gain boosted by Rage Powers - ${format(x.eff2)}x<br><br>
            ` },
            x=>{ return `
                Multiplies Dark Matter gain by ${format(x.eff1)}<br><br>
                Adds BH Condenser Power by ${format(x.eff2)}
            ` },
        ],
        colors: ['#0f0','#ff0','#f00'],
    },
}

const RATIO_MODE = [null, 0.25, 1]
const RATIO_ID = ["+1", '25%', '100%']

function updateAtomTemp() {
    if (!tmp.atom) tmp.atom = {}
    if (!tmp.atom.particles) tmp.atom.particles = {}
    tmp.atom.gain = ATOM.gain()
    tmp.atom.quarkGain = ATOM.quarkGain()
    tmp.atom.quarkGainSec = 0.05
    if (hasElement(16)) tmp.atom.quarkGainSec += tmp.elements.effect[16]
    tmp.atom.canReset = ATOM.canReset()
    tmp.atom.atomicGain = ATOM.atomic.gain()
    tmp.atom.atomicEff = ATOM.atomic.effect()

    tmp.atom.gamma_ray_cost = E(2).pow(player.atom.gamma_ray).floor()
    tmp.atom.gamma_ray_bulk = player.atom.points.max(1).log(2).add(1).floor()
    if (player.atom.points.lt(1)) tmp.atom.gamma_ray_bulk = E(0)
    if (scalingActive("gamma_ray", player.atom.gamma_ray.max(tmp.atom.gamma_ray_bulk), "super")) {
		let start = getScalingStart("super", "gamma_ray");
		let power = getScalingPower("super", "gamma_ray");
		let exp = E(2).pow(power);
		tmp.atom.gamma_ray_cost =
			E(1.75).pow(
                player.atom.gamma_ray
                .pow(exp)
			    .div(start.pow(exp.sub(1)))
            ).floor()
        tmp.atom.gamma_ray_bulk = player.atom.points
            .max(1)
            .log(1.75)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
			.add(1)
			.floor();
	}
    if (scalingActive("gamma_ray", player.atom.gamma_ray.max(tmp.atom.gamma_ray_bulk), "hyper")) {
		let start = getScalingStart("super", "gamma_ray");
		let power = getScalingPower("super", "gamma_ray");
        let start2 = getScalingStart("hyper", "gamma_ray");
		let power2 = getScalingPower("hyper", "gamma_ray");
		let exp = E(2).pow(power);
        let exp2 = E(4).pow(power2);
		tmp.atom.gamma_ray_cost =
			E(1.75).pow(
                player.atom.gamma_ray
                .pow(exp2)
			    .div(start2.pow(exp2.sub(1)))
                .pow(exp)
			    .div(start.pow(exp.sub(1)))
            ).floor()
        tmp.atom.gamma_ray_bulk = player.atom.points
            .max(1)
            .log(1.75)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2)
			.add(1)
			.floor();
	}
    if (scalingActive("gamma_ray", player.atom.gamma_ray.max(tmp.atom.gamma_ray_bulk), "ultra")) {
		let start = getScalingStart("super", "gamma_ray");
		let power = getScalingPower("super", "gamma_ray");
        let start2 = getScalingStart("hyper", "gamma_ray");
		let power2 = getScalingPower("hyper", "gamma_ray");
        let start3 = getScalingStart("ultra", "gamma_ray");
		let power3 = getScalingPower("ultra", "gamma_ray");
		let exp = E(2).pow(power);
        let exp2 = E(4).pow(power2);
        let exp3 = E(6).pow(power3);
		tmp.atom.gamma_ray_cost =
			E(1.75).pow(
                player.atom.gamma_ray
                .pow(exp3)
			    .div(start3.pow(exp3.sub(1)))
                .pow(exp2)
			    .div(start2.pow(exp2.sub(1)))
                .pow(exp)
			    .div(start.pow(exp.sub(1)))
            ).floor()
        tmp.atom.gamma_ray_bulk = player.atom.points
            .max(1)
            .log(1.75)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2)
            .mul(start3.pow(exp3.sub(1)))
			.root(exp3)
			.add(1)
			.floor();
	}
    tmp.atom.gamma_ray_can = player.atom.points.gte(tmp.atom.gamma_ray_cost)
    tmp.atom.gamma_ray_bonus = ATOM.gamma_ray.bonus()
    tmp.atom.gamma_ray_eff = ATOM.gamma_ray.effect()

    for (let x = 0; x < ATOM.particles.names.length; x++) {
        tmp.atom.particles[x] = {
            effect: ATOM.particles.effect(x),
            powerGain: ATOM.particles.gain(x),
            powerEffect: ATOM.particles.powerEffect[x](player.atom.powers[x]),
        }
    }
}

function setupAtomHTML() {
    let particles_table = new Element("particles_table")
	let table = ""
    for (let x = 0; x < ATOM.particles.names.length; x++) {
        table += `
        <div style="width: 30%"><button class="btn" onclick="ATOM.particles.assign(${x})">Assign</button><br><br>
            <div style="color: ${ATOM.particles.colors[x]}; min-height: 120px">
                <h2><span id="particle_${x}_amt">X</span> ${ATOM.particles.names[x]}s</h2><br>
                Which generates <span id="particle_${x}_amtEff">X</span> ${ATOM.particles.names[x]} Powers<span id="particle_${x}_sc">X</span> <br>
                You have <span id="particle_${x}_power">X</span> ${ATOM.particles.names[x]} Powers, which:
            </div><br><div id="particle_${x}_powerEff"></div>
        </div>
        `
    }
	particles_table.setHTML(table)
}

function updateAtomicHTML() {
    tmp.el.atomicAmt.setHTML(format(player.atom.atomic)+" "+formatGain(player.atom.atomic, tmp.atom.atomicGain))
	tmp.el.atomicEff.setHTML(format(tmp.atom.atomicEff,0)+getSoftcapHTML(tmp.atom.atomicEff,ATOM.atomic.softcap(),ATOM.atomic.softcap().mul(800)))
	tmp.el.gamma_ray_lvl.setTxt(format(player.atom.gamma_ray,0)+(tmp.atom.gamma_ray_bonus.gte(1)?" + "+format(tmp.atom.gamma_ray_bonus,0):""))
	tmp.el.gamma_ray_btn.setClasses({btn: true, locked: !tmp.atom.gamma_ray_can})
	tmp.el.gamma_ray_scale.setTxt(getScalingName('gamma_ray'))
	tmp.el.gamma_ray_cost.setTxt(format(tmp.atom.gamma_ray_cost,0))
	tmp.el.gamma_ray_pow.setTxt(format(tmp.atom.gamma_ray_eff.pow))
	tmp.el.gamma_ray_eff.setHTML(format(tmp.atom.gamma_ray_eff.eff))
    tmp.el.gamma_ray_auto.setDisplay(hasElement(18))
	tmp.el.gamma_ray_auto.setTxt(player.atom.auto_gr?"ON":"OFF")

	updateExtraBuildingHTML("ag", 2)
	updateExtraBuildingHTML("ag", 3)
}

function updateAtomHTML() {
    tmp.el.atom_ratio.setTxt(RATIO_ID[player.atom.ratio])
    tmp.el.unassignQuarkAmt.setTxt(format(player.atom.quarks,0))
    for (let x = 0; x < ATOM.particles.names.length; x++) {
        tmp.el["particle_"+x+"_amt"].setTxt(format(player.atom.particles[x],0))
        tmp.el["particle_"+x+"_amtEff"].setHTML(format(tmp.atom.particles[x].powerGain))
        tmp.el["particle_"+x+"_sc"].setHTML(getSoftcapHTML(tmp.atom.particles[x].powerGain,'e3.8e4','e1.6e5','e1e11'))
        tmp.el["particle_"+x+"_power"].setTxt(format(player.atom.powers[x])+" "+formatGain(player.atom.powers[x],tmp.atom.particles[x].powerGain))
        tmp.el["particle_"+x+"_powerEff"].setHTML(ATOM.particles.desc[x](tmp.atom.particles[x].powerEffect))
    }
}