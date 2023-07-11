const MUONIC_ELEM = {
    canBuy(x) {
        let u = this.upgs[x]
        let base = u.cs?player.dark.c16.shard:tmp.exotic_atom.amount
        if (player.atom.muonic_el.includes(x)) return false
        return base.gte(this.upgs[x].cost||EINF)
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
            desc: `Kaon & Pion are doubled every muonic element bought.`,
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
                for (let i = 1; i <= 15; i++) x = x.mul(Decimal.pow(c16|| (CHALS.inChal(17))?1.25:1.1,player.chal.comps[i].root(2)))
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
        {
            desc: `De-corrupt FSS’s reward to Matters.`,
            cost: E(1e54),
        },
        {
            desc: `Pion’s first reward is even stronger. Honor 247’s reward affects Pion gain.`,
            cost: E(1e64),
        },
        {
            desc: `Pyro-Radioactive Plasma is better.`,
            cost: E(1e81),
        },
        {
            desc: `Final Star Shards increase Matter formula.`,
            cost: E(1e100),
            eff() {
                let x = player.dark.matters.final.max(1).root(2).div(5)
                return x.toNumber()
            },
            effDesc: x=>"+"+format(x),
        },
        {
            desc: `C15's reward affects mass overflow^2 starting.`,
            cost: E(1e111),
            eff() {
                if (!tmp.chal) return E(1)
                let x = overflow(tmp.chal.eff[15],10,0.5).pow(2)
                return x.mul(hasBeyondRank(6,1)?beyondRankEffect(6,1):1)
            },
            effDesc: x=>"^"+format(x),
        },{
            desc: `Dimensional mass affects pre-theorem's level.`,
            cost: E(1e130),
        },{
            desc: `Quantum times boost infinity points gain. De-nullify [Tau]’s effect, but its formula is changed.`,
            cost: E(1e150),
            eff() {
                let x = player.qu.times.add(1).log10().add(1)
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            desc: `Accelerators raise the Argon-18's effect at an extremely reduced rate (after first overflow).`,
            cost: E(1e170),
            eff() {
                let x = player.accelerator.add(10).log10()
                return x
            },
            effDesc: x=>"^"+format(x),
        },{
            desc: `Atomic power’s free tickspeeds now append to cosmic strings at a logarithmic rate.`,
            cost: E(1e270),
            eff() {
                if (!tmp.atom) return E(0)
                let x = tmp.atom.atomicEff.max(1).log10().floor()
                return x
            },
            effDesc: x=>"+"+format(x,0),
        },{
            desc: `Exotic atoms boost infinity points gain, starting at 1.798e308`,
            cost: E(Number.MAX_VALUE),
            eff() {
                let x = tmp.exotic_atom.amount.div(Number.MAX_VALUE).max(1).log(hasElement(25,1)?1.001:1.1).add(1)
                if (player.chal.comps[17].gte(1)) x = x.mul(player.chal.comps[17].mul(1.5).pow(0.25).add(1))
                return x
            },
            effDesc: x=>formatMult(x),
        },
        {
            desc: `Boost 4th Dark Ray's effect by Exotic Atoms.`,
            cost: E('e325'),
            eff() {
                let x = tmp.exotic_atom.amount.max(1).log10().max(1).log10().div(1.25).add(1)
                return x
            },
            effDesc: x=>formatMult(x),
        },
        {
            desc: ` [Renown 6] Effect is better by Exotic Atoms.`,
            cost: E('e360'),
            eff() {
                let x = tmp.exotic_atom.amount.max(1).log(10).div(20).add(1)
                if (hasBeyondRank(6,2)) x = x.mul(beyondRankEffect(6,2))
                return x
            },
            effDesc: x=>formatMult(x),
        },
        {
            desc: `Chromium-24 applies to Dimensional Mass at logariphmic rate (Works only outside of C16).`,
            cost: E('e450'),
            eff() {
                let x = E(elemEffect(24)).max(1).log10().div(hasElement(248)?5:10).add(1)
                return x
            },
            effDesc: x=>"^"+format(x),
        },
        {
            desc: `227-Bibiseptium is better based on Exotic Atoms.`,
            cost: E('e630'),
            eff() {
                let x = tmp.exotic_atom.amount.max(1).log10().max(1).log10().div(20).add(1)
                return x
            },
            effDesc: x=>"x"+format(x),
        },
        {
            desc: `Muonic Calcium-20's effect formula is better.`,
            cost: E('e745'),
        },
        {
            desc: `Boost Newton Modificator Power based on Exotic Atoms (starts at 1e830).`,
            cost: E('e830'),
            eff() {
                let x = E(1)
                if (tmp.exotic_atom.amount.gte('1e830')) x = tmp.exotic_atom.amount.max(1).div('1e830').max(1).log10().max(1).log10().add(1).softcap(2,0.01,0)
                return x.max(1)
            },
            effDesc: x=>"x"+format(x),
        },
        {
            desc: `Change [Master Infinity] effect (Max Theorem's Level => <b>Corrupted Shards</b>).`,
            cost: E('e870'),
        },
        {
            desc: `Reduce of Unstable BH effect in C16 will be weaker.`,
            cost: E('e1100'),
        },
        {
            desc: `Exotic Atoms boosts Pre-Infinity Global Speed.`,
            eff() {
                let x = E(1)
                x = tmp.exotic_atom.amount.max(1).log10().max(1).log10().add(1)
                if (hasElement(278)) x = tmp.exotic_atom.amount.max(1).log2().pow(1.75).add(1)
                return x.max(1)
            },
            effDesc: x=>"x"+format(x),
            cost: E('e1170'),
        },
        {
            desc: `Unlock Corrupted Muonic Elements (This element doesn't reset).`,
            cost: E('e1190'),
        },
        {
            cs: true,
            desc: `Remove the softcap of last Abyssal Blot effect.`,
            cost: E('e2990'),
        },
        {
            cs: true,
            desc: `Newton Fragments effect' softcap starts later based on Corrupted Shards.`,
            eff() {
                let x = E(1)
                if (player.dark.c16.shard.gte('e3005')) x = player.dark.c16.shard.max(1).log10().log10().div(100)
                else x = E(0)
                return x
            },
            effDesc: x=>"+"+format(x)+' later',
            cost: E('e3005'),
        },
        {
            cs: true,
            desc: `Add more accelerator power based on Corrupted Shards.`,
            eff() {
                let x = E(1)
               if (player.dark.c16.shard.gte('e3050')) x = player.dark.c16.shard.max(1).log10().log10().div(10)
               else x = E(0)
                return x
            },
            effDesc: x=>"+"+format(x),
            cost: E('e3050'),
        },
        {
            cs: true,
            desc: `Boost Dark Shadows first effect based on Corrupted Shards.`,
            eff() {
                let x = E(1)
                if (player.dark.c16.shard.gte('e3070'))   x = player.dark.c16.shard.max(1).log10().log10().add(1)
                else x = E(1)
                return overflow(x,5,0.1)
            },
            effDesc: x=>"^"+format(x),
            cost: E('e3070'),
        },
        {
            cs: true,
            desc: `Quantum Shards base is better based on Corrupted Shards.`,
            eff() {
                let x = E(1)
                x = player.dark.c16.shard.max(1).log2().add(1)
                return x.max(1)
            },
            effDesc: x=>"x"+format(x),
            cost: E('e3111'),
        },
        {
            cs: true,
            desc: `Add +5 to max Quantum Challenge Modificatots per Fusion Tier.`,
            eff() {
                let x = E(1)
                x = E(player.dark.exotic_atom.tier).max(1).mul(5).floor()
                return x.max(1)
            },
            effDesc: x=>"+"+format(x),
            cost: E('e3125'),
        },
        {
            cs: true,
            desc: `Galaxy Particles raises Newton Modificator Power.`,
            eff() {
                let x = E(1)
                x = player.galaxy.stars.add(1).log10().max(1).log10()
                return x.max(1)
            },
            effDesc: x=>"^"+format(x),
            cost: E('e48000'),
        },
        {
            cs: true,
            desc: `Automatically buy Galaxy Particle Generators, and Bitriennium-239 effect is better based on Galaxy Particle Generators.`,
            eff() {
                let x = E(1)
                x = player.galaxy.generator.root(3).add(1)
                return x.max(1)
            },
            effDesc: x=>"x"+format(x),
            cost: E('e48500'),
        },
        {
            cs: true,
            desc: `Pre-Infinity Global Speed is better based on Galaxy Particles.`,
            eff() {
                let x = E(1)
                x = player.galaxy.stars.root(3).add(1)
                return x.max(1)
            },
            effDesc: x=>"x"+format(x),
            cost: E('e73500'),
        },
        {
            desc: `Keep Muonic Elements on any reset.`,
            cost: E('e25000'),
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
        let u = 11

        if (tmp.inf_unl) u += 4
        if (hasInfUpgrade(9)) u += 3

        if (tmp.brokenInf) u += 12
        if (hasElement(30,1)) u+= 6
        if (hasElement(302)) u+= 4
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
    requirement: [E(0),E(5e4),E(1e6),E(1e12),E(1e25),E(1e34),E(1e44),E(1e66),E(1e88),E(1e121),E(1e222),E('e321'),E('e490'),E('e628'),E('e650'),E('e850'),E('e1930')],
    req() {
        let t = player.dark.exotic_atom.tier
        let r = this.requirement[t]||EINF

        return r
    },
    tier() {
        if (tmp.exotic_atom.amount.gte(tmp.exotic_atom.req)) {
            player.dark.exotic_atom.tier++

            if (!hasElement(225)) {
                player.dark.exotic_atom.amount = [E(0),E(0)]

                MATTERS.final_star_shard.reset(true)
            }

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
        if (hasInfUpgrade(13)) xy = xy.mul(infUpgEffect(13))
        if (hasElement(237)) xy = xy.mul(elemEffect(237))
        if (player.inf.dm) xy = xy.mul(tmp.dm_base_eff)
        if (tmp.inf_unl) xy = xy.mul(theoremEff('atom',4))
        
        let x = xy.div(10)
        if (hasPrestige(2,34)) x = x.mul(prestigeEff(2,34))
        if (hasPrestige(1,247)) x = x.mul(prestigeEff(1,247))
        
        let y = xy.div(20)
        if (hasElement(1,1)) y = y.mul(muElemEff(1))
        if (hasElement(9,1)) y = y.mul(muElemEff(9))
        if (hasElement(12,1)&&hasPrestige(1,247)) y = y.mul(prestigeEff(1,247))

        if (hasPrestige(1,510)) [x,y] = [x.pow(1.1),y.pow(1.1)]

        return [x,y]
    },
    milestones: [
        [
            [a=>{
                let x = overflow(a.add(1).root(2),100,0.5)
                if (player.dark.exotic_atom.tier >= E(14)) x = overflow(a.add(1).root(0.05),10,hasElement(284)?1.05:0.75)
                return x
            },x=>`Boosts corrupted shard gain by <b>${formatMult(x)}</b> <span style='color: orange'>${player.dark.exotic_atom.tier >= E(14)?`[Muonized]</span>`:`</span>`}`],
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
            [a=>{
                let x = Decimal.pow(0.8725,a.add(1).log10().softcap(20,0.25,0).root(2))
                return x.toNumber()
            },x=>`Weaken softcaps of atomic power's effect by <b>${formatReduction(x)}</b>`],
            [a=>{
                let x = a.add(10).log10().pow(2).sub(1).div(5e3)
                return x.toNumber()
            },x=>`Increase the base of Prestige Level 382 for Collapsed Star's effect, the base of Binilunium-201 for BH's effect by <b>+${format(x)}</b>`],
            [a=>{
                if (player.dark.exotic_atom.tier >= 14) x = a.add(10).log(5).pow(0.65).sub(1)
                else x = E(1)
                return x.toNumber()
            },x=>`Increase Quantum Shards base by <b>x${format(x)}</b>. Req: 14th Tier`],
            [a=>{
                if (player.dark.exotic_atom.tier >= 16) x = Decimal.pow(0.95,a.add(10).log(5).pow(0.65).sub(1))
                else x = E(1)
                return x.toNumber()
            },x=>`Reduce Hyper-Glory and Meta-Prestige Level scaling power by <b>${formatReduction(x)}</b>. Req: 16th Tier`],
        ],[
            [a=>{
                let x = hasElement(12,1) ? expMult(a.add(1),2.5) : a.add(1).pow(2)
                if (player.dark.exotic_atom.tier >= E(13)) x = hasElement(12,1) ? expMult(a.add(1),hasElement(284)?10:3) : a.add(1).pow(3)
                x = x.softcap('e700000000',0.5,0)
                return x
            },x=>`Boosts mass of unstable BH gain by <b>${formatMult(x)}</b> <span style='color: orange'>${player.dark.exotic_atom.tier >= E(13)?`[Muonized]</span>`:`</span>`}`],
            [a=>{
                let x = a.add(1).pow(3)
                return overflow(x,'1e200',0.5)

            },x=>`Black hole overflow starts <b>^${format(x)}</b> later`],
            [a=>{
                let x = a.add(1).log10().div(80).add(1).root(2)   
                return x
            },x=>`FSS's base is raised by <b>${format(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().div(10).add(1).root(2)
                return x
            },x=>`Cosmic String's power is raised by <b>${format(x)}</b>`],
            [a=>{
                let x = a.add(1).ssqrt().div(50)
                return isNaN(x)?E(0):x
            },x=>`Increase parallel extruder's power by <b>+${format(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().div(50)
                return x.toNumber()
            },x=>`Increase matter exponent by <b>+${format(x)}</b>`],
            [a=>{
                if (player.dark.exotic_atom.tier >= 15) x = Decimal.pow(0.95,overflow(a.add(1).log10(),2,0.5).root(4)).div(player.dark.am?tmp.am_mass_eff.max(1):1)
else x = E(0)
                return x.toNumber()
            },x=>`Reduce FSS requirement by <b>${formatReduction(x)}</b>. Req: 15th Tier.`],
            [a=>{
                if (player.dark.exotic_atom.tier >= 17) x = a.add(1).log(1.01).pow(27).add(1)
else x = E(1)
                return x.toNumber()
            },x=>`Mass overflow^1-3 starts <b>^${format(x)} later</b>. Req: 17th Tier.`],
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
    let inf_gs = tmp.preInfGlobalSpeed

    tmp.el.mcf_btn.setHTML(`
    Muon-Catalyzed Fusion Tier <b>${format(t,0)}</b><br>
    Requirement: <b>${tea.req.format(0)}</b> Exotic Atoms
    `)
    tmp.el.mcf_btn.setClasses({btn: true, half_full: true, locked: tea.amount.lt(tea.req)})

    tmp.el.ea_div.setDisplay(t>0)
    if (t>0) {
        let g = EXOTIC_ATOM.getAmount(ea.amount[0].add(tea.gain[0].mul(inf_gs)),ea.amount[1].add(tea.gain[1].mul(inf_gs))).sub(tea.amount)

        tmp.el.ext_atom.setHTML(tea.amount.format(0)+" "+tea.amount.formatGain(g))

        for (let i = 0; i < 2; i++) {
            tmp.el['ea_amt'+i].setHTML(ea.amount[i].format(2)+" "+ea.amount[i].formatGain(tea.gain[i].mul(inf_gs)))

            let h = ""

            for (let j = 0; j < Math.floor((t+1-i)/2); j++) {
                let m = EXOTIC_ATOM.milestones[i][j]
                if (m) h += (j>0?"<br>":"") + m[1](exoticAEff(i,j))
            }

            tmp.el['ea_milestone_table'+i].setHTML(h)
        }
    }
}