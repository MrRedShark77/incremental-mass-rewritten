const MEDIATION = {
    mediate() {
        let lvl = this.level_gain
        if (lvl.lt(1)) return;
        player.evo.cp.level = player.evo.cp.level.add(lvl)
        player.evo.cp.points = E(0)
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
    loss(lvl) {
        let start = E(10)
        let speed = E(1)

        if (lvl.gte(start)) speed = speed.mul(lvl.div(start))

        //losing is faster at higher values
        return { speed, start }
    },
    eff(lvl) {
        let eff = {}

        eff.mass1 = lvl.add(1)
        if (hasElement(67,1)) eff.mass2 = lvl.div(100).add(1)
        if (hasElement(69,1)) {
            let x = lvl.add(1).log10().div(10).add(1)
            if (hasElement(73,1)) x = x.max(lvl.root(2).div(1e4).add(1))
            eff.mass3 = x.mul(escrowBoost('md_m3'))
        }
        if (hasElement(74,1)) eff.mass3_softcap = Decimal.pow(.95,lvl.add(1).log10())
        if (hasElement(76,1)) eff.mass_softcap = Decimal.pow(.9,lvl.add(1).log10().root(2))

        return eff
    },

	calc(dt) {
		if (tmp.layer2_passive) player.evo.cp.points = player.evo.cp.points.add(cpProd().mul(dt))
		player.evo.cp.best = player.evo.cp.best.max(player.evo.cp.points)

		let med_loss = tmp.evo.mediation_loss
		if (player.evo.cp.level.gte(med_loss.start)) player.evo.cp.level = player.evo.cp.level.sub(med_loss.speed.mul(dt/10)).max(med_loss.start)

		if (hasElement(70,1)) {
			let t = player.evo.cp.m_time + dt
			if (t >= 1) {
				let w = Math.floor(t)
				player.evo.cp.level = player.evo.cp.level.add(MEDIATION.level_gain.mul(w))
				t -= w
			}
			player.evo.cp.m_time = t
		}
	}
}

function cpProd() {
	return tmp.rp.gain.mul(player.evo.cp.best.max(10).log(player.evo.cp.points.max(10)).max(1))
}