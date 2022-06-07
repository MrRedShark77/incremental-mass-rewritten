const CHROMA = {
    getChroma(x) {
        if (tmp.qu.pick_chr && !player.qu.chr_get.includes(x)) {
            player.qu.chr_get.push(x)
        }
    },
    gain(i) {
        if (!player.qu.chr_get.includes(i)) return E(0)
        let x = E(1)
        if (tmp.qu.mil_reached[5]) x = x.mul(tmp.preQUGlobalSpeed.root(2))
        if (hasTree('qu5')) x = x.mul(tmp.supernova.tree_eff.qu5)
        if (hasTree('qu8')) x = x.mul(tmp.supernova.tree_eff.qu8)
        return x
    },
    names: [
        ["Red","Pyro-Radioactive Plasma","f00"],
        ["Green","Hybridized Uran-Astatine","0f0"],
        ["Blue","Neutronium-0","66f"],
    ],
    eff: [
        i => {
            let x = i.add(1).log10().add(1).root(3)
            if (hasUpgrade('br',10)) x = x.mul(1.1)
            return x
        },
        i => {
            let x = E(1.01).pow(i.add(1).log10().max(0).pow(0.8))
            if (hasUpgrade('br',7) && player.qu.rip.active) x = x.pow(2)
            if (hasUpgrade('br',10)) x = x.pow(1.1)
            return x
        },
        i => {
            let x = E(1.1).pow(i.add(1).log10().max(0).pow(0.75))
            if (hasUpgrade('br',10)) x = x.pow(1.1)
            return x
        },
    ],
    effDesc: [
        x => {
            return `Tickspeed power is ^${format(x)} better`
        },
        x => {
            return `Pre-Pents requirement is reduced by ${format(x)}x`
        },
        x => {
            return `Rewards from Challenges 1-8 are ${format(x)}x stronger`
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