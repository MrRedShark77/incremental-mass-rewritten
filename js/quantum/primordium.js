const PRIM = {
    unl() { return hasTree('unl2') || EVO.amt>=4 && player.qu.times.gte(20) },
    getTheorems() {
        let b = tmp.qu.prim.t_base
        let x = player.qu.bp.max(1).log(b).mul(2).mul(tmp.chal?tmp.chal.eff[14]:1)
        if (!hasElement(63,1)) x = x.scale(1e42,10,0,true)
        return x.root(tmp.qu.prim.prim_pow).floor()
    },
    getNextTheorem() {
        let b = tmp.qu.prim.t_base
        let t = player.qu.prim.theorems.pow(tmp.qu.prim.prim_pow)
        if (!hasElement(63,1)) t = t.scale(1e42,10,0)
        let x = E(b).pow(t.div(tmp.chal?tmp.chal.eff[14]:1).div(2).add(1))

        return x
    },
    spentTheorems() {
        let x = E(0)
        for (let i = 0; i < player.qu.prim.particles.length; i++) {
            if (tmp.qu.prim.w[i] == 0) x = x.add(player.qu.prim.particles[i])
        }
        return x
    },
    particle: {
        names: ["Delta [Δ]","Alpha [Α]","Omega [Ω]","Sigma [Σ]","Phi [Φ]","Epsilon [Ε]","Theta [Θ]","Beta [Β]"],
        weight: [6,6,6,6,2,2,2,1],
        total_w: 31,
        chance: [],

        eff: [
            p=>p.add(1).root(2),
            p=>{
                let br16 = hasUpgrade('br',16)
                let x = [p.root(3).div(5).add(1).softcap(3,0.4,0,br16),p.pow(1.25).add(1)]
                if (br16) x[0] = x[0].pow(1.5)
                return x
            },
            p=>{
                let br16 = hasUpgrade('br',16)
                let x = [p.root(3).div(5).add(1).softcap(3,0.4,0,br16),E(3).pow(p.pow(0.75))]
                if (br16) x[0] = x[0].pow(1.5)
                return x
            },
            p=>{
                let br16 = hasUpgrade('br',16)
                let x = [p.root(3).div(5).add(1).softcap(3,0.4,0,br16),E(2).pow(p.pow(0.75))]
                if (br16) x[0] = x[0].pow(1.5)
                return x
            },
            p=>{
                let x = p.add(1).root(10)
                return x
            },
            p=>{
                let x = [p.root(3).div(10), p.root(3).pow(QCs.active()?2:1).overflow(1e11,1/3)]
                return x
            },
            p=>{
                let x = [E(5).pow(p.pow(0.75)), p.root(5).div(10).add(1)]
                return x
            },
            p=>{
                if (hasElement(107)) p = p.mul(2)
                let x = hasUpgrade('br',22) ? p.add(1).root(10).softcap(1e30,0.25,0) : p.pow(0.9).mul(2).softcap(1500,0.5,0)
                return x
            },
        ],
        effDesc: [
            x=>{ return `Boost Stronger Power by ${format(x)}x` },
            x=>{ return `Boost Rage Powers gain by ^${format(x[0]) + x[0].softcapHTML(3,hasUpgrade('br',16))} /<br> Boost Non-Bonus Tickspeed by ${format(x[1])}x` },
            x=>{ return `Boost Dark Matters gain by ^${format(x[0]) + x[0].softcapHTML(3,hasUpgrade('br',16))} /<br> Boost BH Condenser Power by ${format(x[1])}x` },
            x=>{ return `Boost Atoms gain by ^${format(x[0]) + x[0].softcapHTML(3,hasUpgrade('br',16))} /<br> Boost Cosmic Ray Power by ${format(x[1])}x` },
            x=>{ return `Boost Higgs Boson's effect by ${format(x)}x` },
            x=>{ return `Add ${format(x[0])} to base from Fermions gain ` + (hasTree("prim3") ? ` /<br> Add ${format(x[1])} free tiers to Fermions` : "") },
            x=>{ return `Boost all Radiations gains by ${format(x[0])}x` + (hasTree("prim2") ? ` /<br> Make all Radiations effects ${format(x[1])}x stronger` : "") },
            x=>{ return hasUpgrade('br',22) ? `Increase supernova generation by ${formatMult(x)}` : `Make ${player.dark.unl ? "pre-exotic" : "all"} Supernova's scalings start ${format(x)} later` + x.softcapHTML(1500) },
        ],
    },

	canLock(x) {
		return player.qu.prim.lock.includes(x) || player.qu.prim.lock.indexOf(-1) >= 0
	},
	lock(x) {
		if (!this.canLock(x)) return
		let p_lock = player.qu.prim.lock
		if (p_lock.includes(x)) p_lock[p_lock.indexOf(x)] = -1
		else p_lock[p_lock.indexOf(-1)] = x
	},
}

function giveRandomPParticles(v, max=false) {
    if (!PRIM.unl()) return

    let s = max?tmp.qu.prim.unspent:E(v)
    if (!max) s = s.min(tmp.qu.prim.unspent)

    let tw = tmp.qu.prim.total_w
    let s_div = s.div(tw).floor()
    let sm = s.mod(tw).floor().toNumber()

    for (let x in PRIM.particle.names) player.qu.prim.particles[x] = player.qu.prim.particles[x].add(s_div.mul(tmp.qu.prim.w[x]))
    for (let x = 0; x < sm; x++) {
        let c = Math.random()
        for (let y in PRIM.particle.chance) if (c <= PRIM.particle.chance[y]) {
            player.qu.prim.particles[y] = player.qu.prim.particles[y].add(1)
            break
        }
    }

    updatePrimordiumTemp()
}

function respecPParticles() {
    createConfirm("Are you sure you want to respec all Particles?",'respec',()=>{
        for (let i = 0; i < 8; i++) if (!player.qu.prim.lock.includes(i)) player.qu.prim.particles[i] = E(0)
        QUANTUM.doReset()
    })
}

function calcPartChances() {
    var sum = 0
    for (let x in PRIM.particle.names) {
        sum += tmp.qu.prim.w[x]
        PRIM.particle.chance[x] = sum / tmp.qu.prim.total_w
    }
}

function updatePrimordiumTemp() {
    let tp = tmp.qu.prim

    tp.parts = []
    tp.bonus = []
    tp.t_base = E(5)
    if (hasTree('prim1')) tp.t_base = tp.t_base.sub(1)

    tp.w = [6,6,6,6,2,2,2,1]
    tp.total_w = 31
	for (let i = 0; i < (hasTree('qu_qol12') || EVO.amt >= 4 ? 8 : hasTree('qu_qol11') ? 6 : hasTree('qu_qol10') ? 4 : 0); i++) {
		tp.total_w -= tp.w[i]
		tp.w[i] = 0
	}

    let pt = player.qu.prim.theorems
    let pstr = E(1)
    let p_mul = hasElement(63,1)
    if (tmp.inf_unl) pstr = pstr.mul(theoremEff('proto',1))

    tp.prim_pow = CSEffect("prim_reduce")
    tp.theorems = PRIM.getTheorems()
    tp.next_theorem = PRIM.getNextTheorem()
    tp.spent_theorem = PRIM.spentTheorems()
    tp.unspent = pt.sub(tp.spent_theorem).max(0)
    for (let i = 0; i < player.qu.prim.particles.length; i++) {
        let pp = player.qu.prim.particles[i]
        let b = E(0)
        if (hasTree('ct12')) b = b.add(treeEff('ct12'))
        if (tmp.c16.in) {
            pp = E(0)
        } else {
            if (tmp.qu.prim.w[i] == 0) pp = pt
            if (hasPrestige(1,4)) b = b.add(5)
        }
        tp.parts[i] = pp
        tp.bonus[i] = b
        if (tmp.qu.rip.in) pp = pp.mul(i==5?(hasElement(95)?0.1:0):1/2)
        tp.eff[i] = PRIM.particle.eff[i]((p_mul ? pp.add(1).mul(b.add(1)).sub(1) : pp.add(b)).softcap(100,0.75,0).mul(pstr))
    }

    calcPartChances()
}

function updatePrimordiumHTML() {
    let p_mul = hasElement(63,1)

    tmp.el.prim_btns.setDisplay(tmp.qu.prim.total_w > 0)
    tmp.el.prim_theorem.setTxt(format(tmp.qu.prim.unspent,0)+(tmp.qu.prim.total_w > 0 ? " / "+format(player.qu.prim.theorems,0) : ""))
    tmp.el.prim_next_theorem.setTxt(tmp.qu.prim.total_w > 0 ? `(+1 at ${format(player.qu.bp,1)} / ${format(tmp.qu.prim.next_theorem,1)})` : "")
    for (let i = 0; i < player.qu.prim.particles.length; i++) {
        tmp.el["prim_part"+i].setTxt(format(tmp.qu.prim.parts[i],0)+(tmp.qu.prim.bonus[i].gt(0)?(p_mul ? " × " : " + ")+tmp.qu.prim.bonus[i].format(0):""))
        tmp.el["prim_part_eff"+i].setHTML(PRIM.particle.effDesc[i](tmp.qu.prim.eff[i]))

        tmp.el["prim_lock"+i].setDisplay(tmp.qu.prim.w[i] && EVO.amt >= 2)
        tmp.el["prim_lock"+i].setClasses({ btn: true, locked: !PRIM.canLock(i) })
        tmp.el["prim_lock"+i].setTxt(player.qu.prim.lock.includes(i) ? "Unlock" : "Lock")
    }
}