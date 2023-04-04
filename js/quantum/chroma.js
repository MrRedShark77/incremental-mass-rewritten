const CHROMA = {
    getChroma(x) {
        if (tmp.qu.pick_chr && !player.qu.chr_get.includes(x)) {
            player.qu.chr_get.push(x)
        }
    },
    gain(i) {
        if (!player.qu.chr_get.includes(i)) return E(0)
        let x = E(1)
        if (tmp.qu.mil_reached[5]) x = x.mul(tmp.preQUGlobalSpeed.max(1).root(2))
        if (hasTree('qu5')) x = x.mul(tmp.supernova.tree_eff.qu5)
        if (hasTree('qu8')) x = x.mul(tmp.supernova.tree_eff.qu8)
        if (hasPrestige(0,607)) x = x.mul(prestigeEff(0,607))
        if (hasUpgrade('br',18)) x = x.mul(upgEffect(4,18))
        if (hasElement(6,1)) x = x.mul(muElemEff(6))

        if (hasElement(190)) x = x.pow(1.1)
        if (hasGlyphUpg(13) && i == 1) x = x.pow(2)
        if (hasBeyondRank(2,4)) x = x.pow(1.1)

        return x
    },
    names: [
        ["Red","Pyro-Radioactive Plasma","f00"],
        ["Green","Hybridized Uran-Astatine","0f0"],
        ["Blue","Neutronium-0","66f"],
    ],
    eff: [
        i => {
            //if (tmp.c16active) return E(1)
            let x = i.add(1).log10().add(1).root(3)
            if (hasUpgrade('br',10)) x = x.mul(1.1)
            return x
        },
        i => {
            let c = 1 // tmp.chal ? tmp.chal.eff[16] : 1

            let x = E(1.01).pow(i.add(1).log10().max(0).pow(0.8))
            if (hasUpgrade('br',7) && (player.qu.rip.active || hasElement(148))) x = x.pow(2)
            if (hasUpgrade('br',10)) x = x.pow(1.1)
            
            let y = hasPrestige(2,4)?i.add(1).log10().root(2).div(250).add(1).pow(-1):E(1)
            if (hasElement(207)) y = y.pow(1.5)
            if (hasBeyondRank(1,4)) y = y.pow(beyondRankEffect(1,4))

            return [x.pow(c).softcap(1e10,1/3,0),y.pow(c)]
        },
        i => {
            let x = E(1.1).pow(i.add(1).log10().max(0).pow(0.75))
            if (hasUpgrade('br',10)) x = x.pow(1.1)
            return x
        },
    ],
    effDesc: [
        x => {
            return `Makes tickspeed power raised to the ${format(x)}th power.`//.corrupt(tmp.c16active)
        },
        x => {
            return `Makes all ${player.dark.unl ? "Pre-Exotic p" : "P"}re-Pent requirements reduced by ${format(x[0])}x`+x[0].softcapHTML(1e10)+"."
            +(hasPrestige(2,4)?`<br>Also, all pre-Exotic ${hasElement(207) ? "Rank-Hex" : "pre-Hex"} scalings are ${formatReduction(x[1])} weaker.`:"")
        },
        x => {
            return `Makes rewards from Challenges 1-8 ${format(x)}x stronger.`
        },
    ],
}

const CHROMA_LEN = 3

function updateChromaTemp() {
    for (let x = 0; x < CHROMA_LEN; x++) {
        tmp.qu.chroma_gain[x] = CHROMA.gain(x)
        tmp.qu.chroma_eff[x] = CHROMA.eff[x](player.qu.chroma[x])
    }
}

function updateChromaHTML() {
    tmp.el.qu_theory.setTxt(format(tmp.qu.theories,0))
    tmp.el.qu_theory_div.setDisplay(player.qu.chr_get.length<3)

    for (let x = 0; x < CHROMA_LEN; x++) {
        let id = "chroma_"+x

        tmp.el[id+"_btn"].setClasses({btn: true, locked: !tmp.qu.pick_chr})
        tmp.el[id+"_btn"].setDisplay(!player.qu.chr_get.includes(x))

        tmp.el[id+"_amt"].setTxt(format(player.qu.chroma[x],1)+" "+formatGain(player.qu.chroma[x],tmp.qu.chroma_gain[x]))
        tmp.el[id+"_eff"].setHTML(CHROMA.effDesc[x](tmp.qu.chroma_eff[x]))
    }
}