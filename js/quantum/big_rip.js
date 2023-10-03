const BIG_RIP = {
    rip() {
        if (tmp.dark.run) return
        if (player.qu.rip.active) player.qu.rip.amt = player.qu.rip.amt.add(tmp.qu.rip.gain)
        player.qu.qc.active = false
        player.qu.rip.first = true
        player.qu.rip.active = !player.qu.rip.active
        QUANTUM.enter(false,true,true)

        addQuote(8)
    },
    gain() {
        let x = player.mass.add(1).log10().div(2e5).max(0)
        if (x.lt(1)) return E(0)
        if (hasTree('br1')) x = x.mul(treeEff('br1'))
        if (hasElement(90)) x = x.mul(elemEffect(90))
        if (hasElement(94)) x = x.mul(elemEffect(94))
        if (hasPrestige(0,2)) x = x.mul(4)
        if (hasMDUpg(6, true)) x = x.mul(mdEff(6, true)[1] || 1)
        if (hasUpgrade('br',13)) x = x.mul(upgEffect(4,13))
        if (hasUpgrade('br',23)) x = x.mul(upgEffect(4,23))

        x = x.pow(theoremEff('proto',5))
        if (EVO.amt>=3) x = x.pow(1.25)

        return x.floor()
    },
}

function updateBigRipTemp() {
    tmp.qu.rip.in = player.qu.rip.active || tmp.dark.run
    tmp.qu.rip.gain = BIG_RIP.gain()
}
