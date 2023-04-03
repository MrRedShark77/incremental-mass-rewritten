const MUONIC_ELEM = {
    canBuy(x) {
        if (player.atom.muonic_el.includes(x)) return false
        return tmp.exotic_atom.amount.gte(this.upgs[x].cost||EINF)
    },
    buyUpg(x) {
        if (this.canBuy(x)) player.atom.muonic_el.push(x)
    },
    upgs: [
        null,
        {
            desc: `Mass of unstable black hole boosts Pion gain.`,
            cost: E(1000),
            eff() {
                let x = player.bh.unstable.add(1).root(3)
                return x
            },
            effDesc: x=>formatMult(x),
        },
        {
            desc: `Remove all pre-meta scalings from Fermion Tiers.`,
            cost: E(1e5),
        },
        {
            desc: `You can now automatically get all Meta-Fermions Tiers outside any Fermion.`,
            cost: E(1e10),
        },
        {
            desc: `^1.1 to Matters gain inside C16, and ^1.05 to Matters' exponent outside C16.`,
            cost: E(1e13),
        },
        {
            desc: `Muon & Pion are doubled every muonic element bought.`,
            cost: E(1e15),
            eff() {
                let x = Decimal.pow(2,player.atom.muonic_el.length)
                return x
            },
            effDesc: x=>formatMult(x),
        },
        {
            desc: `Not affected by Neutronium-0, each pre-16 challenge’s completions boost each chroma gain.`,
            cost: E(1e20),
            eff() {
                let c16 = tmp.c16active
                let x = E(1)
                for (let i = 1; i <= 15; i++) x = x.mul(Decimal.pow(c16?1.25:1.1,player.chal.comps[i].root(2)))
                return x
            },
            effDesc: x=>formatMult(x),
        },
        {
            desc: `You can now automatically earn Cyrillic, Deutsch, and Swedish glyphs outside Dark Run, and they don’t affect dark run’s nerf.`,
            cost: E(1e23),
        },
        {
            desc: `C9’s effect softcap is 1% weaker.`,
            cost: E(1e32),
        },
        {
            desc: `Remove the softcap of dark shadow’s fourth reward. Supernovas boost Pion gain`,
            cost: E(1e42),
            eff() {
                let x = player.supernova.times.div(1e6).add(1)
                return x
            },
            effDesc: x=>formatMult(x),
        },
        {
            desc: `De-corrupt Unoctseptium-187.`,
            cost: E(1e46),
        },
        /*
        {
            desc: `Placeholder.`,
            cost: EINF,
            eff() {
                let x = E(1)
                return x
            },
            effDesc: x=>formatMult(x),
        },
        */
    ],
    getUnlLength() {
        let u = 10
        return u
    },
}

function muElemEff(x,def=1) { return tmp.elements.mu_effect[x]||def }

function changeElemLayer() {
    player.atom.elemLayer = (player.atom.elemLayer+1)%2
    updateMuonSymbol()
}

function updateMuonSymbol(start=false) {
    let et = player.atom.elemTier, elayer = player.atom.elemLayer

    if (!start) {
        let tElem = tmp.elements

        tElem.ts = ELEMENTS.exp[et[elayer]-1]
        tElem.te = ELEMENTS.exp[et[elayer]]
        tElem.tt = tElem.te - tElem.ts

        updateElementsHTML()
    }

    document.documentElement.style.setProperty('--elem-symbol-size',["18px","16px"][elayer])

    let divs = document.getElementsByClassName('muon-symbol')
    let e = ["","µ"][elayer]
    for (i in divs) {
        divs[i].textContent = e
    }
}

const EXOTIC_ATOM = {
    requirement: [E(0),E(5e4),E(1e8),E(1e12),E(1e25),E(1e34),E(1e44)],
    req() {
        let t = player.dark.exotic_atom.tier
        let r = this.requirement[t]||EINF

        return r
    },
    tier() {
        if (tmp.exotic_atom.amount.gte(tmp.exotic_atom.req)) {
            player.dark.exotic_atom.tier++

            player.dark.exotic_atom.amount = [E(0),E(0)]
            MATTERS.final_star_shard.reset(true)

            updateExoticAtomsTemp()
        }
    },
    getAmount(a0 = player.dark.exotic_atom.amount[0], a1 = player.dark.exotic_atom.amount[1], floor=true) {
        let x = a0.mul(a1)

        x = x.pow(tmp.dark.abEff.ea||1)

        return x
    },
    gain() {
        let xy = E(1)
        if (hasTree('ct16')) xy = xy.mul(treeEff('ct16'))
        if (hasPrestige(3,6)) xy = xy.mul(prestigeEff(3,6))
        if (hasElement(5,1)) xy = xy.mul(muElemEff(5))
        if (hasBeyondRank(3,4)) xy = xy.mul(beyondRankEffect(3,4))
        
        let x = xy.div(10)
        if (hasPrestige(2,34)) x = x.mul(prestigeEff(2,34))
        if (hasPrestige(1,247)) x = x.mul(prestigeEff(1,247))
        
        let y = xy.div(20)
        if (hasElement(1,1)) y = y.mul(muElemEff(1))
        if (hasElement(9,1)) y = y.mul(muElemEff(9))

        return [x,y]
    },
    milestones: [
        [
            [a=>{
                let x = overflow(a.add(1).root(2),100,0.5)
                return x
            },x=>`Boosts corrupted shard gain by <b>${formatMult(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().div(10).add(1).root(2)
                return x
            },x=>`Ultra & Meta-Prestige Levels start <b>${formatMult(x)}</b> later`],
            [a=>{
                let x = a.add(1).log10().div(5).add(1).root(2)
                return x
            },x=>`Boosts entropy gain by <b>^${format(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().add(1).pow(2)
                return x.toNumber()
            },x=>`Impossible Challenges 1-12 start <b>${formatMult(x)}</b> later`],
        ],[
            [a=>{
                let x = a.add(1).pow(2)
                return x
            },x=>`Boosts mass of unstable BH gain by <b>${formatMult(x)}</b>`],
            [a=>{
                let x = a.add(1).pow(3)
                return x
            },x=>`Black hole overflow starts <b>^${format(x)}</b> later`],
            [a=>{
                let x = a.add(1).log10().div(80).add(1).root(2)
                return x
            },x=>`FSS's base is raised by <b>${format(x)}</b>`],
        ],
    ],
}

function updateExoticAtomsTemp() {
    let tea = tmp.exotic_atom, t = player.dark.exotic_atom.tier

    for (let i = 1; i <= MUONIC_ELEM.upgs.length-1; i++) {
        let u = MUONIC_ELEM.upgs[i]
        if (u.eff) tmp.elements.mu_effect[i] = u.eff()
    }

    tea.req = EXOTIC_ATOM.req()

    tea.amount = EXOTIC_ATOM.getAmount()
    tea.gain = EXOTIC_ATOM.gain()

    tea.eff = [[],[]]
    for (let i = 0; i < 2; i++) {
        let m = EXOTIC_ATOM.milestones[i]
        let a = player.dark.exotic_atom.amount[i]
        for (let j = 0; j < m.length; j++) if (m[j] && j < Math.floor((t+1-i)/2)) tea.eff[i][j] = m[j][0](a)
    }
}

function exoticAEff(i,j,def=1) { return tmp.exotic_atom.eff[i][j]||def }

function updateExoticAtomsHTML() {
    let ea = player.dark.exotic_atom, tea = tmp.exotic_atom, t = ea.tier

    tmp.el.mcf_btn.setHTML(`
    Muon-Catalyzed Fusion Tier <b>${format(t,0)}</b><br>
    Requirement: <b>${tea.req.format(0)}</b> Exotic Atoms
    `)
    tmp.el.mcf_btn.setClasses({btn: true, half_full: true, locked: tea.amount.lt(tea.req)})

    tmp.el.ea_div.setDisplay(t>0)
    if (t>0) {
        let g = EXOTIC_ATOM.getAmount(ea.amount[0].add(tea.gain[0]),ea.amount[1].add(tea.gain[1])).sub(tea.amount)

        tmp.el.ext_atom.setHTML(tea.amount.format(0)+" "+tea.amount.formatGain(g))

        for (let i = 0; i < 2; i++) {
            tmp.el['ea_amt'+i].setHTML(ea.amount[i].format(2)+" "+ea.amount[i].formatGain(tea.gain[i]))

            let h = ""

            for (let j = 0; j < Math.floor((t+1-i)/2); j++) {
                let m = EXOTIC_ATOM.milestones[i][j]
                if (m) h += (j>0?"<br>":"") + m[1](exoticAEff(i,j))
            }

            tmp.el['ea_milestone_table'+i].setHTML(h)
        }
    }
}