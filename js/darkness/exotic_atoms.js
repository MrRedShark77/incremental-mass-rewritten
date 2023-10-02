const MUONIC_ELEM = {
    upgs: [
        null,
        {
            get desc() { return EVO.amt >= 2 ? `Anti-Wormhole boosts Pion gain.` : `Mass of unstable black hole boosts Pion gain.` },
            cost: E(1000),
            eff() {
                if (EVO.amt >= 2) return player.evo.wh.mass[6].div(1e4).add(1).root(EVO.amt >= 3 ? 3 : 1)
                if (EVO.amt < 2) return player.bh.unstable.add(1).root(2)
            },
            effDesc: x=>formatMult(x),
        },{
            desc: `Remove all pre-meta scalings from Fermion Tiers.`,
            cost: E(1e5),
        },{
            desc: `You can now automatically get all Meta-Fermions Tiers outside any Fermion.`,
            cost: E(1e10),
        },{
            desc: `^1.1 to Matters gain inside C16, and ^1.05 to Matters' exponent outside C16.`,
            cost: E(1e13),
        },{
            desc: `Kaon & Pion are doubled every muonic element bought.`,
            cost: E(1e15),
            eff() {
                let x = Decimal.pow(hasElement(26,1)?3:2,getElemLength(1))
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            desc: `Not affected by Neutronium-0, each pre-16 challenge’s completions boost each chroma gain.`,
            cost: E(1e20),
            eff() {
                let c16 = tmp.c16.in
                let x = E(1)
                for (let i = 1; i <= 15; i++) x = x.mul(Decimal.pow(c16?1.25:1.1,player.chal.comps[i].root(2)))
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            desc: `You can now automatically earn Cyrillic, Deutsch, and Swedish glyphs outside Dark Run, and they don’t affect dark run’s nerf.`,
            cost: E(1e23),
        },{
            get desc() { return EVO.amt >= 2 ? `Stronger boosts after overflow.` : `C9’s effect softcap is 1% weaker.` },
            get cost() { return E(EVO.amt >= 4 ? 1e25 : EVO.amt >= 2 ? 1e29 : 1e32) },
        },{
            desc: `Remove the softcap of dark shadow’s fourth reward. Supernovas boost Pion gain.`,
            cost: E(1e42),
            eff() {
                if (!tmp.sn.unl) return E(1)
                return EVO.amt >= 2 ? player.supernova.times.div(1e5).add(1).pow(2) : player.supernova.times.div(1e6).add(1)
            },
            effDesc: x=>formatMult(x),
        },{
            desc: `De-corrupt Unoctseptium-187.`,
            cost: E(1e46),
        },{
            desc: `De-corrupt FSS’s reward to Matters.`,
            cost: E(1e54),
        },{
            desc: `Pion’s first reward is even stronger. Honor 247’s reward affects Pion gain.`,
            cost: E(1e64),
        },{
            desc: `Pyro-Radioactive Plasma is better.`,
            cost: E(1e81),
        },{
            desc: `Final Star Shards increase Matter formula.`,
            get cost() { return EVO.amt >= 2 ? E(1e90) : E(1e100) },
            eff() {
                let x = player.dark.matters.final.root(2).div(5)
                return x
            },
            effDesc: x=>"+"+format(x),
        },{
            get desc() { return EVO.amt >= 2 ? "Greatly improve FSS base formula." : `C15's reward affects mass overflow^2 starting.` },
            get cost() { return EVO.amt >= 2 ? E(1e95) : E(1e111) },
            eff() {
                if (!tmp.chal) return E(1)
                let x = hasElement(26,1)?tmp.chal.eff[15].root(2):overflow(tmp.chal.eff[15],10,0.5).pow(2)
                return x
            },
            effDesc: x=>formatPow(x),
        },{
            desc: `Dimensional mass affects pre-theorem's level.`,
            cost: E(1e130),
        },{
            desc: `Quantum times boost infinity points gain. De-nullify [Tau]’s effect, but its formula is changed.`,
            cost: E(1e150),
            eff() {
                let x = player.qu.times.add(1).log10().add(1).pow(EVO.amt >= 2 ? 2 : 1)
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            get desc() { return EVO.amt >= 2 ? `Raise Dark Shadows by ^1.5.` : `Accelerators raise the Argon-18's effect at an extremely reduced rate (after first overflow).`},
            get cost() { return EVO.amt >= 2 ? E(1e160) : E(1e170) },
            eff: () => player.build.accelerator.amt.add(10).log10(),
            effDesc: x => EVO.amt < 2 ? formatPow(x) : undefined,
        },{
            desc: `Atomic power’s free tickspeeds now append to cosmic strings at a logarithmic rate.`,
            cost: E(1e270),
            eff() {
                if (!tmp.atom.unl) return E(0)
                let x = tmp.atom.atomicEff[0].max(1).log10()
                if (hasElement(60,1)) x = x.pow(1.75)
                return x.floor()
            },
            effDesc: x=>"+"+format(x,0),
        },{
            desc: `Exotic atoms boost infinity points gain, starting at 1.798e308.`,
            cost: E(Number.MAX_VALUE),
            eff: () => tmp.ea.amount.div(Number.MAX_VALUE).max(1).log(1.1).add(1),
            effDesc: x=>formatMult(x),
        },{
            desc: `Red Matter’s Upgrade is even stronger.`,
            cost: E('e420'),
        },{
            desc: `Total infinity points boost kaon & pion gains.`,
            cost: E('e470'),
            eff() {
                if (!tmp.inf_unl) return E(1)
                return player.inf.total.add(1).root(4)
            },
            effDesc: x=>formatMult(x),
        },{
            desc: `Remove the cap of [Strange]’s reward. It now applies to 4th Photon Upgrade again.`,
            cost: E('e600'),
        },{
            desc: `Mass Overflows^1-2 are 5% weaker.`,
            cost: E('e640'),
        },{
            desc: `Increase exotic atom’s reward strength by +1.25% per infinity theorem.`,
            cost: E('e778').mul(7/9),
            eff() {
                if (!tmp.inf_unl) return E(1)
                return player.inf.theorem.mul(.0125)
            },
            effDesc: x=>"+"+formatPercent(x),
        },{
            desc: `The base of Muonic Boron-5 is increased by +1. Muonic Phosphorus-15 is even stronger.`,
            cost: E('e830'),
        },{
            desc: `Prestige Base multiplies stronger overflow^1-2 starting.`,
            cost: E('e1050'),
            eff() {
				if (EVO.amt >= 4) return tmp.prestiges.base.max(1).log10().div(1e5).max(1).pow(100)
                return overflow(tmp.prestiges.base.add(1),1e10,.5,2)
            },
            effDesc: x=>formatMult(x)+" later",
        },{
            desc: `Bibihexium-226 works thrice as effective.`,
            cost: E('e1500'),
        },{
            desc: `Exotic Atom’s Reward Strength applies to Matter Upgrades at a reduced rate.`,
            cost: E('e1600'),
        },{
            desc: `Muonic Hydrogen-1 also applies to Kaon gain.`,
            cost: E('e1750'),
        },{
            desc: `16th Challenge’s reward also applies to 9th Challenge’s reward.`,
            cost: E('e1970'),
        },{
            desc: `Kaon’s first reward is better.`,
            cost: E('e2200'),
        },{
            desc: `Corrupted Star’s speed is increased by pre-Infinity global speed at a reduced rate.`,
            cost: E('e2600'),
            eff() {
                if (!tmp.inf_unl) return E(1)
                return hasElement(59,1) ? expMult(tmp.preInfGlobalSpeed.max(1), 0.5).pow(2) : tmp.preInfGlobalSpeed.max(1).log10().add(1).pow(2)
            },
            effDesc: x=>formatMult(x),
        },{
            cs: true,
            desc: `Muon-Catalyzed Fusion speeds Corrupted Star.`,
            cost: E('e20'),
            eff: () => Decimal.pow(1.5,player.dark.exotic_atom.tier),
            effDesc: x=>formatMult(x),
        },{
            desc: `Increase the base of C17’s reward by 1.`,
            cost: E('e3000'),
        },{
            cs: true,
            desc: `Supernova no longer has requirement with collapsed stars. Instead, they can produce supernovas passively.`,
            cost: E('e34'),
        },{
            desc: `The growth reductions of corrupted stars start later based on supernovas.`,
            cost: E('e3500'),
            eff() {
                if (!tmp.sn.unl) return E(1)
                return player.supernova.times.add(1).overflow(10,0.5)
            },
            effDesc: x=>formatMult(x)+' later',
        },{
            cs: true,
            desc: `Unlock a new effect of corrupted star.`,
            cost: E('e56'),
        },{
            desc: `Pion’s first reward now provides an exponential boost.`,
            get cost() { return EVO.amt >= 2 ? E('e4000') : E('e7300') },
        },{
            cs: true,
            desc: `Collapsed Stars boost starting of the growth reductions of corrupted stars.`,
            cost: E('e72'),
            eff() {
                if (!tmp.star_unl) return E(1)
                let x = player.stars.points.add(1).log10().add(1).log10().add(1)
                if (hasElement(56,1)) x = x.pow(2)
                return x
            },
            effDesc: x=>formatMult(x)+' later',
        },{
            cs: true,
            desc: `Remove first softcap of C9’s reward.`,
            cost: E('e110'),
        },{
            desc: `Double corrupted star’s speed per infinity theorem.`,
            get cost() { return EVO.amt >= 2 ? E('e4500') : E('e8100') },

            eff: () => tmp.inf_unl ? E(2).pow(player.inf.theorem) : E(1),
            effDesc: x=>formatMult(x),
        },{
            cs: true,
            desc: `Unlock a new effect of corrupted star.`,
            cost: E('e130'),
        },{
            desc: `The exponent of ascension base is increased by Renown at a reduced rate.`,
            get cost() { return EVO.amt >= 2 ? E('e4700') : E('e8600') },
            eff() {
                let x = player.prestiges[3].root(2).div(100)
                return x
            },
            effDesc: x=>"+^"+format(x),
        },{
            desc: `Quark overflow is 25% weaker.`,
            get cost() { return EVO.amt >= 2 ? E('e4900') : E('e9200') },
        },{
            desc: `Boost Supernova Generation based on beyond-ranks' maximum tier.`,
            get cost() { return EVO.amt >= 2 ? E('e5250') : E('e12100') },
            eff: () => Decimal.pow(2.5,tmp.beyond_ranks.max_tier),
            effDesc: x=>formatMult(x),
        },{
            cs: true,
            desc: `Corrupted star boosts its speed at a reduced rate. Keep Supernovas on Infinity.`,
            cost: E('e150'),

            eff: () => tmp.inf_unl ? player.inf.cs_amount.add(1).overflow(10,0.5) : E(1),
            effDesc: x=>formatMult(x),
        },{
            get desc() { return EVO.amt >= 2 ? `Infinity Theorems raise Pions and Kaons, and boost its reward strength.` : `Hawking Theorem’s fifth star now affects black hole’s effect.` },
            get cost() { return EVO.amt >= 2 ? E('e5460') : E('e14900') },

            eff: () => tmp.inf_unl ? player.inf.theorem.add(1).log10().add(1.5) : E(1),
            effDesc: x=>formatPow(x),
        },{
            desc: `Pre-Infinity global speed now affects supernova generation.`,
            cost: E('e15900'),
            eff: () => tmp.inf_unl ? expMult(tmp.preInfGlobalSpeed.max(1),0.5).pow(2) : E(1),
            effDesc: x=>formatMult(x),
        },{
            cs: true,
            desc: `Corrupted star boosts its reductions starting at a reduced rate.`,
            cost: E('e230'),

            eff: () => tmp.inf_unl ? player.inf.cs_amount.add(1).log10().add(1).pow(3) : E(1),
            effDesc: x=>formatMult(x),
        },{
            desc: `Pion’s second reward now affects black hole overflow^2 at a reduced rate.`,
            cost: E('e20400'),
            eff() {
                let x = exoticAEff(1,1,E(1)).root(5)
                if (tmp.c16.in) x = x.max(1).log10().add(1)
                return x
            },
            effDesc: x=>formatPow(x),
        },{
            desc: `Pion’s third reward is 50% stronger.`,
            cost: E('e23400'),
        },{
            cs: true,
            get desc() { return `${EVO.amt >= 4 ? "Stardust" : "Supernova"} cheapens Corrupted Star upgrades.` },
            cost: E('e440'),
            eff() {
                let x = E(1)
				if (EVO.amt >= 4) x = player.evo.proto.dust.add(1)
				else if (tmp.sn.unl) x = player.supernova.times.add(1)

                if (hasElement(61,1)) x = x.pow(muElemEff(61))
                return x
            },
            effDesc: x=>EVO.amt>=4?undefined:"/"+format(x),
        },{
            cs: true,
            desc: `Unlock the sixth star generator.`,
            cost: E('e625'),
        },{
            desc: `Undec 2’s reward now affects Hyper FSS.`,
            cost: E('e26900'),
        },{
            desc: `Muonic Zirconium-40 is twice as stronger.`,
            cost: E('e33100'),
        },{
            desc: `Unstable BH's effect is raised by 10 outside C16.`,
            cost: E('e35000'),
        },{
            cs: true,
            get desc() { return EVO.amt >= 4 ? `Unlock Theorem Stars 6 - 7.` : `Unlock sixth star in the theorem.` },
            get cost() { return E(EVO.amt >= 4 ? 'e700' : EVO.amt >= 2 ? 'e780' : 'e840') },
        },{
            desc: `Muonic Arsenic-33 is even better.`,
            cost: E('e91000'),
        },{
            desc: `Muonic Potassium-19 is even better.`,
            cost: E('e95600'),
        },{
            desc: `Muonic Iodine-53 is stronger based on Infinity Theorem.`,
            cost: E('e112800'),

            eff: () => tmp.inf_unl ? player.inf.theorem.div(10).add(1).root(2) : E(1),
            effDesc: x=>formatPow(x),
        },{
            cs: true,
            desc: `Unlock the seventh star generator.`,
            cost: E('e1000'),
        },{
            desc: `Remove the scaling from primordium theorem. The bonus of each primordium particles multiplies its level instead of adding.`,
            cost: E('e155000'),
        },{
            cs: true,
            desc: `Unlock a new effect of corrupted star.`,
            cost: E('e1100'),
        },{
            desc: `The growth reductions of corrupted stars start later based on Normal Energy.`,
            cost: E('e161800'),
            eff: () => tmp.inf_unl ? expMult(player.gp_resources[4].add(1),0.5) : E(1),
            effDesc: x=>formatMult(x)+" later",
        },{
            cs: true,
            desc: `Unlock the eighth star generator.`,
            cost: E('e1430'),
        },{
            berry: true,
            desc: `Add new meditation’s effect.`,
            cost: E(25),
        },{
            berry: true,
            desc: `Calm Power boosts Apples & Strawberries.`,
            cost: E(50),
            eff() {
                let x = EVO.amt >= 1 ? player.evo.cp.best.add(1).log10().add(1) : E(1)
                let y = x.root(2)
                return [x, y]
            },
            effDesc: x=>formatMult(x[0]) + " to Apples, " + formatMult(x[1]) + " to Strawberries",
        },{
            berry: true,
            desc: `Add new another meditation’s effect.`,
            cost: E(100),
        },{
            berry: true,
            desc: `Automate Meditation. Keep meditation on all pre-Ouroboric resets.`,
            cost: E(150),
        },{
            berry: true,
            desc: `Double Apples and Strawberries.`,
            cost: E(200),
        },{
            berry: true,
            desc: `Tetr boosts Calm Power.`,
            cost: E(300),
            eff: () => player.ranks.tetr.add(1),
            effDesc: x=>formatMult(x),
        },{
            berry: true,
            desc: `Improve 3rd Meditation effect base.`,
            cost: E(500),
            eff: () => EVO.amt >= 1 ? player.evo.cp.level.div(1e7).add(1).sqrt() : E(1),
            effDesc: x=>formatMult(x),
        },{
            berry: true,
            desc: `Improve 2nd Apple effect.`,
            cost: E(2000),
        },{
            berry: true,
            desc: `Unlock 4th Meditation effect.`,
            cost: E(5000),
        },{
            berry: true,
            desc: `Unlock 5th Meditation effect.`,
            cost: E(1.5e4),
        },{
            berry: true,
            desc: `Raise Fabric from ^0.5 to ^0.6.`,
            cost: E(1e5),
        },{
            berry: true,
            desc: `Raise Fabric by +^0.1.`,
            cost: E(2e5),
        },{
            berry: true,
            desc: `+4 maximum spawn cap if you don't have an Aim powerup.`,
            cost: E(5e5),
        },{
            berry: true,
            desc: `Challenge 6 and 8 effects are exponential. Automate Wormhole.`,
            cost: E(1e6),
        },{
            berry: true,
            desc: `Double Snake Powerup chance. Increase powerup time to 30s.`,
            cost: E(3e6),
        },{
            berry: true,
            desc: `Increase base moves until reduction by +5. Gain more Apples on snake length.`,
            cost: E(1e7),
        },{
            berry: true,
            desc: `Purify luck is better based on snake length.`,
            cost: E(1e8),
        },{
            berry: true,
            desc: `+0.25 to the exponent of quark's formula from protostars.`,
            cost: E(2e8),
        },{
            berry: true,
            desc: `Apple's first effect now provides an exponential boost.`,
            cost: E(5e8),
        },{
            berry: true,
            desc: `+0.1 to the exponent of quark's formula from protostars.`,
            cost: E(1e9),
        },{
            berry: true,
            desc: `Snake enemies lose slower. (+2 moves per reduction)`,
            cost: E(2e9),
        },{
            berry: true,
            desc: `Aim powerup is always activated.`,
            cost: E(5e9),
        },{
            berry: true,
            desc: `Raise Apples by ^1.5.`,
            cost: E(1e10),
        },{
            berry: true,
            desc: `Apples boost Calm Power and Meditation more.`,
            cost: E(2e10),
        },{
            berry: true,
            desc: `Apples boost Fabric more. Boom purifies Apples, but remove Purify powerup.`,
            cost: E(5e10),
        },{
            berry: true,
            desc: `Apples boost "wormhole loselessness" and Protostars. Unlock "Boom" powerup.`,
            cost: E(1e11),
        },{
            berry: true,
            desc: `Improve Protostar formula. Feeding an apple adds purify luck based on tier.`,
            cost: E(2e11),
        },{
            berry: true,
            desc: `Aim can detect all tiers of Apples.`,
            cost: E(5e11),
        },{
            berry: true,
            desc: `Frenzy powerup is always activated.`,
            cost: E(1e13),
        },{
            berry: true,
            desc: `Apple gain boosts apple tier multiplier.`,
            cost: E(1e14),
            eff: () => OURO.unl ? tmp.ouro.apple_gain.pow(.1).max(3) : E(3),
            effDesc: x => formatMult(x),
        },{
            berry: true,
            desc: `Purify powerup is always activated, but remove Boom.`,
            cost: E(1e15),
        },{
            berry: true,
            desc: `Combo powerup is always activated.`,
            cost: E(1e16),
        }
    ],
    getUnlLength() {
        let u = 11

        if (OURO.unl) u = [66,76,82,88,94,98,104][EVO.amt]
        else {
            if (tmp.inf_unl) u += 4
            if (hasInfUpgrade(9)) u += 3

            if (tmp.brokenInf) u += 2
            if (tmp.tfUnl) u += 6
            if (tmp.asc.unl) u += 6
            if (tmp.cs.unl) u += 6
            if (tmp.c18reward) u += 10
            if (tmp.fifthRowUnl) u += 8 + 10
        }

        return u
    },
}

function muElemEff(x,def=1) { return tmp.elements.mu_effect[x]||def }

function changeElemLayer() {
    player.atom.elemLayer = (player.atom.elemLayer+1)%2
    updateMuonSymbol()
	updateElementsHTML()
	calcNextElements()
}

function updateMuonSymbol(start=false) {
    let et = player.atom.elemTier, elayer = player.atom.elemLayer

    if (!start) {
        let tElem = tmp.elements

        tElem.ts = ELEMENTS.exp[et[elayer]-1]
        tElem.te = ELEMENTS.exp[et[elayer]]
        tElem.tt = tElem.te - tElem.ts
    }

    document.documentElement.style.setProperty('--elem-symbol-size',["18px","16px"][elayer])

    let divs = document.getElementsByClassName('muon-symbol')
    let e = ["","µ"][elayer]
    for (i in divs) {
        divs[i].textContent = e
    }
}

const EXOTIC_ATOM = {
    requirement: [E(0),E(5e4),E(1e6),E(1e12),E(1e25),E(1e34),E(1e44),E(1e66),E(1e88),E(1e121),E(1e222),E('e321')],
    req() {
        let t = player.dark.exotic_atom.tier, r = EINF

        if (t.lt(12)) r = this.requirement[t.toNumber()]
        else r = Decimal.pow('e1000',Decimal.pow(1.25,t.sub(12).div(tmp.ea.req_fp)))

        return r
    },
    tier() {
        if (tmp.ea.amount.gte(tmp.ea.req)) {
            player.dark.exotic_atom.tier = player.dark.exotic_atom.tier.add(1)

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
        if (tmp.inf_unl) x = x.pow(theoremEff('atom',4))
        return x
    },
    gain() {
        let xy = E(1)
        if (hasTree('ct16')) xy = xy.mul(treeEff('ct16'))
        if (hasPrestige(3,6)) xy = xy.mul(prestigeEff(3,6))
        if (hasElement(5,1)) xy = xy.mul(muElemEff(5))
        if (hasBeyondRank(3,4)) xy = xy.mul(beyondRankEffect(3,4))
        if (hasInfUpgrade(13)) xy = xy.mul(infUpgEffect(13))
        if (hasElement(22,1)) xy = xy.mul(muElemEff(22))
        if (hasAscension(0,4)) xy = xy.mul(ascensionEff(0,4))
        xy = xy.mul(getFragmentEffect('atom'))
        
        let x = xy.div(5)
        if (hasPrestige(2,34)) x = x.mul(prestigeEff(2,34))
        if (hasPrestige(1,247)) x = x.mul(prestigeEff(1,247))
        if (hasElement(1,1) && hasElement(30,1)) x = x.mul(muElemEff(1))
        if (EVO.amt >= 2 && hasElement(48, 1)) x = x.pow(muElemEff(48))

        let y = xy.div(5)
        if (hasElement(1,1)) y = y.mul(muElemEff(1))
        if (hasElement(9,1)) y = y.mul(muElemEff(9))
        if (hasElement(12,1)&&hasPrestige(1,247)) y = y.mul(prestigeEff(1,247))
        if (EVO.amt >= 2 && hasElement(48, 1)) y = y.pow(muElemEff(48))

        if (hasPrestige(1,510)) [x,y] = [x.pow(1.1),y.pow(1.1)]
        return [x,y]
    },
    milestones: [
        [
            [a=>{
                let x = hasElement(32,1) ? expMult(a.add(1),1.4) : overflow(a.add(1).root(2),100,0.5)
                return x
            },x=>`Boosts corrupted shard gain by <b>${formatMult(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().div(10).add(1).root(2)
                return x
            },x=>`Ultra & Meta-Prestiges start <b>${formatMult(x)}</b> later`],
            [a=>{
                let x = a.add(1).log10().div(5).add(1).root(2).softcap(10,0.25,0)
                return x
            },x=>`Boosts entropy gain by <b>^${format(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().add(1).pow(2)
                return x
            },x=>`Impossible Challenges 1-12 start <b>${formatMult(x)}</b> later`],
            [a=>{
                let x = Decimal.pow(0.8725,a.add(1).log10().softcap(20,0.25,0).root(2))
                return x.toNumber()
            },x=>`Weaken softcaps of atomic power's effect by <b>${formatReduction(x)}</b>`],
            [a=>{
                let x = a.add(10).log10().pow(2).sub(1).div(5e3)
                return x
            },x=>`Increase the base of Prestige 382 for Collapsed Star's effect, the base of Binilunium-201 for BH's effect by <b>+${format(x)}</b>`],
        ],[
            [a=>{
                let x = hasElement(12,1) ? expMult(a.add(1),2.5) : a.add(1).pow(2), y = E(1)
                if (hasElement(39,1)) y = a.add(1).log10().add(1).root(3)
                return [x,y]
            },x=>`Boosts mass of unstable BH gain by <b>${formatMult(x[0])}</b>`+(hasElement(39,1)?`, <b>^${format(x[1])}</b>`:'')],
            [a=>{
                let x = a.add(1).pow(3)
                return x.overflow('e10000',0.5)
            },x=>`Black hole overflow starts <b>^${format(x)}</b> later`],
            [a=>{
                let x = a.add(1).log10().div(80).add(1).root(2)
                if (hasElement(52,1)) x = x.pow(1.5)
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
                return x
            },x=>`Increase matter exponent by <b>+${format(x)}</b>`],
        ],
    ],
}

function updateExoticAtomsTemp() {
    let tea = tmp.ea, t = player.dark.exotic_atom.tier
    tea.unl = hasCharger(5) && EVO.amt < 3

    for (let i = 1; i <= tmp.elements.unl_length[1]; i++) {
        let u = MUONIC_ELEM.upgs[i]
        if (u.eff) tmp.elements.mu_effect[i] = u.eff()
    }

    let fp = E(1)
    if (hasAscension(1,7)) fp = fp.div(0.9)

    tea.req_fp = fp
    tea.req = EXOTIC_ATOM.req()
    tea.amount = EVO.amt >= 3 ? player.evo.proto.exotic_atoms : EXOTIC_ATOM.getAmount()
    tea.gain = EXOTIC_ATOM.gain()

    let s = Decimal.add(1,Math.max(t.sub(12),0)*0.1)
    if (hasPrestige(2,58)) s = s.add(prestigeEff(2,58,0))
    if (hasElement(25,1)) s = s.add(muElemEff(25,0))
    if (tmp.inf_unl) s = s.add(theoremEff('time',4,0))
    s = s.add(CSEffect("ea_reward", 0))

    tea.strength = s

    let tt = t.min(12).toNumber()

    tea.eff = [[],[]]
    for (let i = 0; i < 2; i++) {
        let m = EXOTIC_ATOM.milestones[i]
        let a = player.dark.exotic_atom.amount[i].pow(s)
        for (let j = 0; j < m.length; j++) if (m[j] && j < Math.floor((tt+1-i)/2)) tea.eff[i][j] = m[j][0](a)
    }
}

function exoticAEff(i,j,def=1) { return tmp.ea.eff[i][j]||def }

function updateExoticAtomsHTML() {
    let ea = player.dark.exotic_atom, tea = tmp.ea, t = ea.tier
    let inf_gs = tmp.preInfGlobalSpeed

    tmp.el.mcf_btn.setHTML(`
    Muon-Catalyzed Fusion Tier <b>${format(t,0)}</b><br>
    ${t.gte(12)?`Increase Reward Strength by +10%<br>`:''}
    Requirement: <b>${tea.req.format(0)}</b> Exotic Atoms
    `)
    tmp.el.mcf_btn.setClasses({btn: true, half_full: true, locked: tea.amount.lt(tea.req)})

    tmp.el.ea_div.setDisplay(t.gt(0))
    if (t.gt(0)) {
        let g = EXOTIC_ATOM.getAmount(ea.amount[0].add(tea.gain[0].mul(inf_gs)),ea.amount[1].add(tea.gain[1].mul(inf_gs))).sub(tea.amount), tt = t.min(12).toNumber()

        tmp.el.ext_atom.setHTML(tea.amount.format(0)+" "+tea.amount.formatGain(g))
        tmp.el.ea_strength.setHTML(formatPercent(tea.strength))

        for (let i = 0; i < 2; i++) {
            tmp.el['ea_amt'+i].setHTML(ea.amount[i].format(2)+" "+ea.amount[i].formatGain(tea.gain[i].mul(inf_gs)))

            let h = ""

            for (let j = 0; j < Math.floor((tt+1-i)/2); j++) {
                let m = EXOTIC_ATOM.milestones[i][j]
                if (m) h += (j>0?"<br>":"") + m[1](exoticAEff(i,j))
            }

            tmp.el['ea_milestone_table'+i].setHTML(h)
        }
    }
}