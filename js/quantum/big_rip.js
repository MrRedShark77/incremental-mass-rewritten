const BIG_RIP = {
    rip() {
        if (!player.qu.rip.active && player.confirms.br) if (!confirm(`Are you sure you want to Big Rip the Dimension?
        When Big Rip the Dimension, Entropy Rewards don’t work, all Primordium effects are 50% weaker except Epsilon Particles that don’t work, tree [qu2, qu10] doesn’t work, and you are trapped in Quantum Challenge with modifiers [10,2,10,10,5,0,2,10].
        Death Shards are gained based on your normal mass while Big Ripped.
        Unlock various upgrades from Big Rip.`)) return
        if (player.qu.rip.active) player.qu.rip.amt = player.qu.rip.amt.add(tmp.rip.gain)
        player.qu.qc.active = false
        player.qu.rip.first = true
        player.qu.rip.active = !player.qu.rip.active
        QUANTUM.enter(false,true,true)
    },
    gain() {
        let x = player.mass.add(1).log10().div(2e5).max(0)
        if (!player.qu.rip.active || x.lt(1)) return E(0)
        if (hasTree('br1')) x = x.mul(treeEff('br1'))
        if (hasElement(90)) x = x.mul(tmp.elements.effect[90]||1)
        if (hasElement(94)) x = x.mul(tmp.elements.effect[94]||1)
        if (hasPrestige(0,2)) x = x.mul(4)
        if (player.md.break.upgs[6].gte(1)) x = x.mul(tmp.bd.upgs[6].eff?tmp.bd.upgs[6].eff[1]:1)
        if (hasUpgrade('br',13)) x = x.mul(upgEffect(4,13))
        return x.floor()
    },
}

const BIG_RIP_QC = [10,2,10,10,5,0,2,10]

function updateBigRipTemp() {
    tmp.rip.gain = BIG_RIP.gain()
}