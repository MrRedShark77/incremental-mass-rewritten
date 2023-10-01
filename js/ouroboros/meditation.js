const MEDITATION = {
	meditate() {
		if (!this.can()) return

		let lvl = this.level_gain, cp = player.evo.cp
		cp.level = cp.level.add(lvl)
		if (!hasElement(70,1)) cp.points = E(0)
		cp.m_time = 0
	},
	can() {
		return player.evo.cp.m_time >= 1 && player.evo.cp.points.gt(0) && !(EVO.amt >= 2 && CHALS.inChal(6))
	},
	get level_gain() {
		let cp = expMult(player.evo.cp.points,0.5)
		if (tmp.atom.unl) cp = cp.mul(tmp.atom.atomicEff[1])
		if (tmp.inf_unl) cp = cp.mul(theoremEff('atom',3))

		cp = cp.mul(appleEffect('cp_lvl'))
		cp = cp.mul(wormholeEffect(0))

		if (EVO.amt >= 2) cp = cp.pow(wormholeEffect(5))
		else if (hasElement(158)) cp = cp.pow(1.5)
		if (hasZodiacUpg('aries','u2')) cp = cp.pow(zodiacEff('aries','u2'))

		return cp.floor()
	},
	eff(lvl) {
		let eff = {}, weak_mult = E(1)
		if (QCs.active() && EVO.amt >= 4) lvl = lvl.mul(tmp.qu.qc.eff[10])

		eff.mass1 = lvl.add(1)
		if (hasElement(67,1)) eff.mass2 = lvl.div(100).add(1)
		if (hasElement(69,1)) {
			let x = lvl.add(1).log10().div(10).add(1)
			if (hasElement(73,1)) x = x.mul(muElemEff(73))
			eff.mass3 = x.mul(escrowBoost('md_m3'))
		}

		if (EVO.amt >= 2) weak_mult = wormholeEffect(3).mul(glyphUpgEff(8))
		if (hasElement(75,1)) eff.mass3_softcap = Decimal.pow(.95,lvl.add(1).log10()).mul(weak_mult)
		if (hasElement(76,1)) eff.mass_softcap = Decimal.pow(EVO.amt >= 2 ? .95 : .9,lvl.add(1).log10().root(2)).mul(weak_mult)

		return eff
	},

	calc(dt) {
		if (tmp.passive >= 1) player.evo.cp.points = player.evo.cp.points.add(cpProd().mul(dt))
		player.evo.cp.best = player.evo.cp.best.max(player.evo.cp.points)

		player.evo.cp.m_time += dt
		if (hasElement(70,1) && this.can()) this.meditate()
		if (player.evo.cp.level.gte(10)) player.evo.cp.level = E(0.99).pow(dt).mul(player.evo.cp.level).max(10)
	}
}

function cpProd() {
    let g = tmp.rp.gain, cp = player.evo.cp
    let r = cp.best.max(1).div(cp.points.add(g).max(1)).sqrt()
	if (isNaN(r.mag)) r = E(1)
    return g.mul(r)
}