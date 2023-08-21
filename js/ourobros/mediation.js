const MEDIATION = {
    mediate() {
        let lvl = this.level_gain
        if (lvl.lt(1)) return;
        player.evo.cp.level = player.evo.cp.level.add(lvl)
        player.evo.cp.points = E(0)
    },
    get level_gain() {
        let cp = expMult(player.evo.cp.points,0.5).mul(wormholeEffect(0)).mul(appleEffect('cp_lvl'))

        if (player.atom.unl && tmp.atom) cp = cp.mul(tmp.atom.atomicEff[1])
        if (tmp.inf_unl) cp = cp.mul(theoremEff('atom',3))

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
    }
}