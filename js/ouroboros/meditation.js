const MEDIATION = {
	mediate() {
		if (!this.can()) return

		let lvl = this.level_gain, cp = player.evo.cp
		cp.level = cp.level.add(lvl)
		if (!hasElement(70,1)) cp.points = E(0)
		cp.m_time = 0
	},
	can() {
		return player.evo.cp.m_time >= 1 && player.evo.cp.points.gt(0)
	},
	get level_gain() {
		let cp = expMult(player.evo.cp.points,0.5)
		if (player.atom.unl && tmp.atom) cp = cp.mul(tmp.atom.atomicEff[1])
		if (tmp.inf_unl) cp = cp.mul(theoremEff('atom',3))

		cp = cp.mul(appleEffect('cp_lvl'))
		cp = cp.mul(wormholeEffect(0))

		if (hasElement(158)) cp = cp.pow(1.5)
		return cp.floor()
	},
	eff(lvl) {
		let eff = {}

		eff.mass1 = lvl.add(1)
		if (hasElement(67,1)) eff.mass2 = lvl.div(100).add(1)
		if (hasElement(69,1)) {
			let x = lvl.add(1).log10().div(10).add(1)
			if (hasElement(73,1)) x = x.mul(muElemEff(73))
			eff.mass3 = x.mul(escrowBoost('md_m3'))
		}
		if (hasElement(75,1)) eff.mass3_softcap = Decimal.pow(.95,lvl.add(1).log10())
		if (hasElement(76,1)) eff.mass_softcap = Decimal.pow(.9,lvl.add(1).log10().root(2))

		return eff
	},

	calc(dt) {
		if (tmp.layer2_passive) player.evo.cp.points = player.evo.cp.points.add(cpProd().mul(dt))
		player.evo.cp.best = player.evo.cp.best.max(player.evo.cp.points)

		player.evo.cp.m_time += dt
		if (hasElement(70,1) && this.can()) this.mediate()
		if (player.evo.cp.level.gte(10)) player.evo.cp.level = E(0.99).pow(dt).mul(player.evo.cp.level).max(10)
	}
}

function cpProd() {
	let log = player.evo.cp.best.max(1).div(player.evo.cp.points.max(1)).log10()
	return tmp.rp.gain.mul(log.add(1))
}