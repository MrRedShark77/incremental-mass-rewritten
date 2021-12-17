const ATOM = {
    gain() {
        let x = player.bh.mass.div(1.5e156)
        if (x.lt(1)) return E(0)
        x = x.root(5)
        if (player.mainUpg.rp.includes(15)) x = x.mul(tmp.upgs.main?tmp.upgs.main[1][15].effect:E(1))
        x = x.mul(tmp.bosons.upgs.gluon[0].effect)
        if (player.atom.elements.includes(17)) x = x.pow(1.1)
        return x.floor()
    },
    quarkGain() {
        if (tmp.atom.gain.lt(1)) return E(0)
        x = tmp.atom.gain.max(1).log10().pow(1.1).add(1)
        if (player.atom.elements.includes(1)) x = E(1.25).pow(tmp.atom.gain.max(1).log10())
        if (player.mainUpg.bh.includes(13)) x = x.mul(10)
        if (player.mainUpg.atom.includes(8)) x = x.mul(tmp.upgs.main?tmp.upgs.main[3][8].effect:E(1))
        if (player.ranks.rank.gte(300)) x = x.mul(RANKS.effect.rank[300]())
        if (player.atom.elements.includes(6)) x = x.mul(tmp.elements.effect[6])
        if (player.atom.elements.includes(42)) x = x.mul(tmp.elements.effect[42])
        if (player.md.upgs[6].gte(1)) x = x.mul(tmp.md.upgs[6].eff)
        x = x.mul(tmp.md.upgs[9].eff)
        if (player.atom.elements.includes(47)) x = x.pow(1.1)
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
        let keep = []
        for (let x = 0; x < player.mainUpg.bh.length; x++) if ([5].includes(player.mainUpg.bh[x])) keep.push(player.mainUpg.bh[x])
        player.mainUpg.bh = keep
        if (chal_reset && !player.mainUpg.atom.includes(4) && !player.supernova.tree.includes("chal2") ) for (let x = 1; x <= 4; x++) player.chal.comps[x] = E(0)
        FORMS.bh.doReset()
    },
    atomic: {
        gain() {
            let x = tmp.atom.gamma_ray_eff?tmp.atom.gamma_ray_eff.eff:E(0)
            if (player.atom.elements.includes(3)) x = x.mul(tmp.elements.effect[3])
            if (player.atom.elements.includes(52)) x = x.mul(tmp.elements.effect[52])
            x = x.mul(tmp.bosons.upgs.gluon[0].effect)
            if (player.md.active || CHALS.inChal(10)) x = expMult(x,0.8)
            return x
        },
        effect() {
            let x = player.atom.atomic.max(1).log(player.atom.elements.includes(23)?1.5:1.75).softcap(5e4,0.75,0)
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
        },
        effect() {
            let pow = E(2)
            if (player.mainUpg.atom.includes(4)) pow = pow.add(tmp.upgs.main?tmp.upgs.main[3][4].effect:E(0))
            if (player.mainUpg.atom.includes(11)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[3][11].effect:E(1))
            if (player.supernova.tree.includes("gr1")) pow = pow.mul(tmp.supernova.tree_eff.gr1)
            pow = pow.mul(tmp.bosons.upgs.gluon[1].effect)
            let eff = pow.pow(player.atom.gamma_ray).sub(1)
            return {pow: pow, eff: eff}
        },
    },
    particles: {
        names: ['Protons', 'Neutrons', 'Electrons'],
        assign(x) {
            if (player.atom.quarks.lt(1) || CHALS.inChal(9)) return
            let m = player.atom.ratio
            let spent = m > 0 ? player.atom.quarks.mul(RATIO_MODE[m]).ceil() : E(1)
            player.atom.quarks = player.atom.quarks.sub(spent)
            player.atom.particles[x] = player.atom.particles[x].add(spent)
        },
        assignAll() {
            let sum = player.atom.dRatio[0]+player.atom.dRatio[1]+player.atom.dRatio[2]
            if (player.atom.quarks.lt(sum) || CHALS.inChal(9)) return
            let spent = player.atom.quarks.div(sum).floor()
            for (let x = 0; x < 3; x++) {
                let add = spent.mul(player.atom.dRatio[x])
                player.atom.quarks = player.atom.quarks.sub(add)
                player.atom.particles[x] = player.atom.particles[x].add(add)
            }
        },
        effect(i) {
            let p = player.atom.particles[i]
            let x = p.pow(2)
            if (player.atom.elements.includes(12)) x = p.pow(p.add(1).log10().add(1).root(4).pow(tmp.chal.eff[9]))
            return x.softcap('e3.8e4',0.9,2).softcap('e1.6e5',0.9,2)
        },
        gain(i) {
            let x = tmp.atom.particles[i]?tmp.atom.particles[i].effect:E(0)
            if (player.mainUpg.atom.includes(7)) x = x.mul(tmp.upgs.main?tmp.upgs.main[3][7].effect:E(1))
            return x
        },
        powerEffect: [
            x=>{
                let a = x.add(1).pow(3)
                let b = player.atom.elements.includes(29) ? x.add(1).log2().pow(1.25).mul(0.01) : x.add(1).pow(2.5).log2().mul(0.01)
                return {eff1: a, eff2: b}
            },
            x=>{
                let a = x.add(1).pow(2)
                let b = player.atom.elements.includes(19)
                ?player.mass.max(1).log10().add(1).pow(player.rp.points.max(1).log(10).mul(x.max(1).log(10)).root(2.75))
                :player.mass.max(1).log10().add(1).pow(player.rp.points.max(1).log(100).mul(x.max(1).log(100)).root(3))
                return {eff1: a, eff2: b}
            },
            x=>{
                let a = x.add(1)
                let b = player.atom.elements.includes(30) ? x.add(1).log2().pow(1.2).mul(0.01) : x.add(1).pow(2).log2().mul(0.01)
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
    if (player.atom.elements.includes(16)) tmp.atom.quarkGainSec += tmp.elements.effect[16]
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
    tmp.el.atomicAmt.setHTML(format(player.atom.atomic)+" "+formatGain(player.atom.atomic, tmp.atom.atomicGain))
	tmp.el.atomicEff.setHTML(format(tmp.atom.atomicEff,0)+(tmp.atom.atomicEff.gte(5e4)?" <span class='soft'>(softcapped)</span>":""))

	tmp.el.gamma_ray_lvl.setTxt(format(player.atom.gamma_ray,0))
	tmp.el.gamma_ray_btn.setClasses({btn: true, locked: !tmp.atom.gamma_ray_can})
	tmp.el.gamma_ray_scale.setTxt(getScalingName('gamma_ray'))
	tmp.el.gamma_ray_cost.setTxt(format(tmp.atom.gamma_ray_cost,0))
	tmp.el.gamma_ray_pow.setTxt(format(tmp.atom.gamma_ray_eff.pow))
	tmp.el.gamma_ray_eff.setHTML(format(tmp.atom.gamma_ray_eff.eff))
    tmp.el.gamma_ray_auto.setDisplay(player.atom.elements.includes(18))
	tmp.el.gamma_ray_auto.setTxt(player.atom.auto_gr?"ON":"OFF")
}

function updateAtomHTML() {
    tmp.el.atom_ratio.setTxt(RATIO_ID[player.atom.ratio])
    tmp.el.unassignQuarkAmt.setTxt(format(player.atom.quarks,0))
    for (let x = 0; x < ATOM.particles.names.length; x++) {
        tmp.el["particle_"+x+"_amt"].setTxt(format(player.atom.particles[x],0))
        tmp.el["particle_"+x+"_amtEff"].setTxt(format(tmp.atom.particles[x].powerGain))
        tmp.el["particle_"+x+"_power"].setTxt(format(player.atom.powers[x])+" "+formatGain(player.atom.powers[x],tmp.atom.particles[x].powerGain))
        tmp.el["particle_"+x+"_powerEff"].setHTML(ATOM.particles.desc[x](tmp.atom.particles[x].powerEffect))
    }
}