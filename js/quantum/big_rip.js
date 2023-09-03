const BIG_RIP = {
    rip() {
        if (!player.qu.rip.active && player.confirms.br) createConfirm(`Are you sure you want to Big Rip the Dimension?`,'br',CONFIRMS_FUNCTION.bigRip)
        else CONFIRMS_FUNCTION.bigRip()
    },
    gain() {
        let x = player.mass.add(1).log10().div(2e5).max(0)
        if (x.lt(1)) return E(0)
        if (hasTree('br1')) x = x.mul(treeEff('br1'))
        if (hasElement(90)) x = x.mul(tmp.elements.effect[90]||1)
        if (hasElement(94)) x = x.mul(tmp.elements.effect[94]||1)
        if (hasPrestige(0,2)) x = x.mul(4)
        if (hasMDUpg(6, true)) x = x.mul(mdEff(6, true)[1] || 1)
        if (hasUpgrade('br',13)) x = x.mul(upgEffect(4,13))
        if (hasUpgrade('br',23)) x = x.mul(upgEffect(4,23))

        x = x.pow(theoremEff('proto',5))

        return x.floor()
    },
}

function updateBigRipTemp() {
    tmp.rip.gain = BIG_RIP.gain()
}