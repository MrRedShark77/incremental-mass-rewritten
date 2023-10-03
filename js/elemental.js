const ELEMENTS = {
    map: [
        `x_________________xvxx___________xxxxxxvxx___________xxxxxxvxx_xxxxxxxxxxxxxxxxvxx_xxxxxxxxxxxxxxxxvxx1xxxxxxxxxxxxxxxxvxx2xxxxxxxxxxxxxxxxv_v__3xxxxxxxxxxxxxx__v__4xxxxxxxxxxxxxx__`,
    ],
    la: [null,'*','**','*','**'],
    exp: [0,118,218,362,558,814,1138],
    max_hsize: [19],
    names: [
        null,
        'H','He','Li','Be','B','C','N','O','F','Ne',
        'Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca',
        'Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn',
        'Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr',
        'Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn',
        'Sb','Te','I','Xe','Cs','Ba','La','Ce','Pr','Nd',
        'Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb',
        'Lu','Hf','Ta','W','Re','Os','Ir','Pt','Au','Hg',
        'Tl','Pb','Bi','Po','At','Rn','Fr','Ra','Ac','Th',
        'Pa','U','Np','Pu','Am','Cm','Bk','Cf','Es','Fm',
        'Md','No','Lr','Rf','Db','Sg','Bh','Hs','Mt','Ds',
        'Rg','Cn','Nh','Fl','Mc','Lv','Ts','Og'
    ],
    fullNames: [
        null,
        'Hydrogen','Helium','Lithium','Beryllium','Boron','Carbon','Nitrogen','Oxygen','Fluorine','Neon',
        'Sodium','Magnesium','Aluminium','Silicon','Phosphorus','Sulfur','Chlorine','Argon','Potassium','Calcium',
        'Scandium','Titanium','Vanadium','Chromium','Manganese','Iron','Cobalt','Nickel','Copper','Zinc',
        'Gallium','Germanium','Arsenic','Selenium','Bromine','Krypton','Rubidium','Strontium','Yttrium','Zirconium',
        'Niobium','Molybdenum','Technetium','Ruthenium','Rhodium','Palladium','Silver','Cadmium','Indium','Tin',
        'Antimony','Tellurium','Iodine','Xenon','Caesium','Barium','Lanthanum','Cerium','Praseodymium','Neodymium',
        'Promethium','Samarium','Europium','Gadolinium','Terbium','Dysprosium','Holmium','Erbium','Thulium','Ytterbium',
        'Lutetium','Hafnium','Tantalum','Tungsten','Rhenium','Osmium','Iridium','Platinum','Gold','Mercury',
        'Thallium','Lead','Bismuth','Polonium','Astatine','Radon','Francium','Radium','Actinium','Thorium',
        'Protactinium','Uranium','Neptunium','Plutonium','Americium','Curium','Berkelium','Californium','Einsteinium','Fermium',
        'Mendelevium','Nobelium','Lawrencium','Rutherfordium','Dubnium','Seaborgium','Bohrium','Hassium','Meitnerium','Darmstadium',
        'Roeritgenium','Copernicium','Nihonium','Flerovium','Moscovium','Livermorium','Tennessine','Oganesson'
    ],
    canBuy(x, layer = 0) {
        if (tmp.c16.in && isElemCorrupted(x)) return false
		if (hasElement(x, layer)) return

        let u = [ELEMENTS, MUONIC_ELEM][layer].upgs[x]
		let data = ELEM_TYPES[getElementClass(x, layer)]
		if (data.can && !data.can()) return
		if (data.res.lt(u.cost)) return

		return !this.cannotAfford(x, layer)
    },
	cannotAfford(x, layer) {
		if (EVO.isFed("e"+layer+"_"+x)) return true
		if (layer == 1) return
		if (CHALS.inChal(14) && x < 118) return true
		if (tmp.c16.in && isElemCorrupted(x)) return true
		if (player.qu.rip.active && tmp.elements.cannot.includes(x)) return true
	},
    buyUpg(x, layer = 0) {
		if (!this.canBuy(x, layer)) return

		let u = [ELEMENTS, MUONIC_ELEM][layer].upgs[x]
		let type = ELEM_TYPES[getElementClass(x, layer)]
		type.res = type.res.sub(u.cost).max(0)
		player.atom[["elements", "muonic_el"][layer]].push(x)

		if (layer == 0) {
			if (x==230) {
				updateTheoremCore()
				updateTheoremInv()
			}
			if (x==243||x==311) updateTemp()
			if (x==251 && !EVO.amt) {
				tmp.tab=8
				tmp.stab[8]=3
			}
			if (x==262 && !EVO.amt) {
				tmp.tab=0
				tmp.stab[0]=0
				tmp.ranks.tab=1
			}
		}
		tmp.pass = 1
    },
    upgs: [
        null,
        {
            get desc() { return EVO.amt >= 3 ? `+0.25 to the exponent of quark's formula from protostars.` : `Quark gain formula is better.` },
            cost: E(1e6),
        },
        {
            desc: `Hardened Challenge scaling is 25% weaker.`,
            cost: E(2.5e12),
        },
        {
            desc: `Electron Powers boost Atomic Powers gain.`,
            cost: E(1e15),
            effect() {
                let x
                if (hasPrestige(0,867)) {
                    x = tmp.atom.unl?player.atom.powers[2].add(1).log10().add(1).log10().add(1).pow(1.5):E(1)
                } else {
                    x = tmp.atom.unl?player.atom.powers[2].add(1).root(2):E(1)
                    if (x.gte('ee4')) x = expMult(x.div('ee4'),0.9).mul('ee4')
                    x = overflow(x,'ee100',0.25).min('ee101')
                }

                return x
            },
            effDesc(x) { return hasPrestige(0,867) ? '^'+format(x) : format(x)+"x"+softcapHTML(x,'ee4') },
        },
        {
            desc: `Stronger's power is stronger based on Proton Powers.`,
            cost: E(2.5e16),
            effect() {
                let x = tmp.atom.unl?player.atom.powers[0].max(1).log10().pow(0.8).div(50).add(1):E(1)
                if (EVO.amt >= 2) x = x.min(5e7)
                return overflow(x.softcap(1e45,0.1,0),'e60000',0.5).min("ee6")
            },
            effDesc(x) { return format(x)+"x stronger" },
        },
        {
            desc: `The 7th challenge's effect is twice as effective.`,
            cost: E(1e18),
        },
        {
            desc: `Gain 1% more quarks for each challenge completion.`,
            cost: E(5e18),
            effect() {
                let x
                if (hasElement(276)) {
                    x = E(1)
                    for (let i = 1; i <= CHALS.cols; i++) x = x.mul(player.chal.comps[i].add(1))
                    if (hasElement(7)) x = x.pow(elemEffect(7))
                    x = x.overflow('e1000',1/3)
                } else {
                    x = E(0)
                    for (let i = 1; i <= CHALS.cols; i++) x = x.add(player.chal.comps[i].mul(i>4?2:1))
                    if (hasElement(7)) x = x.mul(elemEffect(7))
                    if (hasElement(87)) x = E(1.01).pow(x).root(3)
                    else x = x.div(100).add(1).max(1)
                }
                return x
            },
            effDesc(x) { return hasElement(276) ? formatPow(x) : formatMult(x) },
        },
        {
            desc: `Carbon's effect is now multiplied by the number of elements bought.`,
            cost: E(1e20),
            effect() {
                let x = E(getElemLength(0)+1)
                if (hasElement(11) && !hasElement(87)) x = x.pow(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `C2's reward's softcap is 75% weaker.`,
            cost: E(1e21),
        },
        {
            desc: `Tetr's requirement is 15% weaker.`,
            cost: E(6.5e21),
        },
        {
            desc: `3rd & 4th challenges' scalings are weaker.`,
            cost: E(1e24),
        },
        {
            desc: `Nitrogen's multiplier is squared.`,
            cost: E(1e27),
        },
        {
            desc: `Power's gain from each particle formula is better.`,
            cost: E(1e29),
        },
        {
            desc: `For every c7 completion, increase c5 and c6 cap by 2.`,
            cost: E(2.5e30),
            effect() {
                let x = player.chal.comps[7].mul(2)
                if (hasElement(79)) x = x.mul(tmp.qu.chroma_eff[2])
                return x
            },
            effDesc(x) { return "+"+format(x) },
        },
        {
            desc: `Passively gain 5% of the quarks you would get from resetting each second.`,
            cost: E(1e33),
        },
        {
            get desc() { return EVO.amt >= 2 ? `Raise Fabric by +^0.1.` : `Super BH Condenser & Cosmic Ray scale 20% weaker.` },
            cost: E(1e34),
        },
        {
            desc: `Silicon's effect is +2% better for each element bought.`,
            cost: E(5e38),
            effect() {
                let x = getElemLength(0)*0.02
                return Number(x)
            },
            effDesc(x) { return "+"+format(x*100)+"%" },
        },
        {
            desc: `Raise Atom gain by 1.1.`,
            cost: E(1e40),
        },
        {
            desc: `You can now automatically buy Cosmic Rays. Cosmic Ray raises tickspeed effect at an extremely reduced rate.`,
            cost: E(1e44),
            effect() {
                let x = overflow(hasElement(129) ? player.build.cosmic_ray.amt.pow(0.5).mul(0.02).add(1) : player.build.cosmic_ray.amt.pow(0.35).mul(0.01).add(1),1000,0.5)
                if (hasElement(18,1)) x = x.pow(muElemEff(18))
                return x
            },
            effDesc(x) { return formatPow(x) },
        },
        {
            desc: `2nd Neutron's effect is better.`,
            cost: E(1e50),
        },
        {
            desc: `Increase C7 cap by 50.`,
            cost: E(1e53),
        },
        {
            desc: `Unlock Mass Dilation.`,
            cost: E(1e56),
        },
        {
            desc: `Dilated mass gain is increased by tickspeed at a reduced rate.`,
            cost: E(1e61),
            effect() {
                let x = E(1.25).pow(player.build.tickspeed.amt.pow(0.55))
                return x.min('ee11000')
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Atomic power's effects are better.`,
            cost: E(1e65),
        },
        {
            desc: `Passively gain 100% of the atoms you would get from resetting each second. Atomic Power boost Relativistic particles gain at a reduced rate.`,
            cost: E(1e75),
            effect() {
                if (!tmp.atom.unl) return E(1)
                let x = hasPrestige(0,40) ? player.atom.atomic.max(1).log10().add(1).log10().add(1).root(2) : player.atom.atomic.max(1).log10().add(1).pow(0.4)
                return x
            },
            effDesc(x) { return hasPrestige(0,40) ? formatPow(x) : format(x)+"x" },
        },
        {
            desc: `Increases Mass Dilation upgrade 1's base by 1.`,
            cost: E(1e80),
        },
        {
            desc: `Hardened challenge scaling is weaker for each element bought.`,
            cost: E(1e85),
            effect() {
                let x = E(0.99).pow(E(getElemLength(0)).softcap(30,2/3,0)).max(0.5)
                return x
            },
            effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
        },
        {
            desc: `Hyper/Ultra Rank & Tickspeed scales 25% weaker.`,
            cost: E(1e90),
        },
        {
            desc: `Mass gain is raised to 1.5 while in mass dilation.`,
            cost: E(1e97),
        },
        {
            desc: `Proton power's effects are better.`,
            cost: E(1e100),
        },
        {
            desc: `Electron power's effects are better. Passively gain 10% of each particle you would assign quarks.`,
            cost: E(1e107),
        },
        {
            desc: `Dilated mass boosts Relativistic particles gain.`,
            cost: E(1e130),
            effect() {
                if (!tmp.atom.unl) return E(1)
                let x = player.md.mass.add(1).pow(0.0125)
                return overflow(x.softcap('ee27',0.95,2),"ee110",0.25)
            },
            effDesc(x) { return format(x)+"x"+x.softcapHTML('ee27') },
        },
        {
            desc: `Increase dilated mass gain exponent by 5%.`,
            cost: E(1e140),
        },
        {
            desc: `Add 50 more C8 maximum completions.`,
            cost: E(1e155),
        },
        {
            desc: `Rage power boosts Relativistic particles gain.`,
            cost: E(1e175),
            effect: () => tmp.rp.unl ? player.rp.points.max(1).log10().add(1).pow(0.75) : E(1),
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Mass from Black Hole boosts dilated mass gain.`,
            cost: E(1e210),
            effect: () => tmp.bh.unl ? player.bh.mass.max(1).log10().add(1).pow(0.8) : E(1),
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Unlock Stars.`,
            cost: E(1e225),
        },
        {
            desc: `Super Tier scales weaker based on Tetr.`,
            cost: E(1e245),
            effect() {
                let x = E(0.9).pow(player.ranks.tetr.softcap(6,0.5,0))
                return x
            },
            effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
        },
        {
            desc: `Cosmic Ray's free tickspeeds now add to RU7.`,
            cost: E(1e260),
            effect() {
                if (!tmp.atom.unl) return E(0)
                let x = tmp.atom.atomicEff[0]
                if (hasElement(82)) x = x.mul(3)
                return x.div(6).floor()
            },
            effDesc(x) { return "+"+format(x,0)+" to Rage Power Upgrade 7" },
        },
        {
            desc: `Remove softcap from C2 & C6 effects.`,
            cost: E(1e285),
        },
        {
            desc: `Collapsed star boosts dilated mass gain.`,
            cost: E(1e303),
            effect() {
                if (!tmp.star_unl) return [E(1), E(1)]
                let x = player.stars.points.add(1).pow(0.5)
                let y = hasPrestige(0,190)?player.stars.points.add(1).log10().add(1).log10().add(1):E(1)
                return [x.softcap('e4e66',0.95,2).min('eee3'),y]
            },
            effDesc(x) { return format(x[0])+"x"+(hasPrestige(0,190)?", ^"+format(x[1]):"") },
        },
        {
            desc: `Add 50 more C7 maximum completions.`,
            cost: E('e315'),
        },
        {
            desc: `Collapsed stars boost quark gain.`,
            cost: E('e325'),
            effect() {
                if (!tmp.star_unl) return E(1)
                let x = player.stars.points.add(1).pow(1/3)
                x = overflow(x,'ee112',0.5)
                return x.min('ee3000')
            },
            effDesc(x) { return formatMult(x) },
        },
        {
            desc: `You automatically buy mass dilation upgrades if you purchased them first. They no longer spend dilated mass.`,
            cost: E('e360'),
        },
        {
            desc: `The Tetr requirement is broken.`,
            cost: E('e380'),
        },
        {
            desc: `Collapsed star boosts relativistic particles gain.`,
            cost: E('e420'),
            effect() {
                if (!tmp.star_unl) return E(1)
                return player.stars.points.add(1).pow(0.15).min(1e20)
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Collapsed star's effect boosts mass of black hole gain at a reduced rate.`,
            cost: E('e510'),
            effect() {
                let x = tmp.star_unl?tmp.stars.effect[0].add(1).pow(0.02):E(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Quarks gain is raised to the 1.05th power.`,
            cost: E('e610'),
        },
        {
            desc: `Collapsed stars effect is 10% stronger.`,
            cost: E('e800'),
        },
        {
            desc: `Collapsed star boosts the last type of stars.`,
            cost: E('e1000'),
            effect() {
                if (!tmp.star_unl) return E(1)
                return player.stars.points.add(1).log10().add(1).pow(EVO.amt >= 2 ? 1.5 : 1.1)
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Star generator is now ^1.05 stronger.`,
            cost: E('e1750'),
        },
        {
            desc: `Mass gain softcap^2 is 10% weaker.`,
            cost: E('e2400'),
        },
        {
            desc: `Mass of black hole boosts atomic powers gain at a reduced rate.`,
            cost: E('e2800'),
            effect: () => tmp.bh.unl ? expMult(player.bh.mass.add(1), 0.6) : E(1),
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Mass Dilation upgrade 6 is 75% stronger.`,
            cost: E('e4600'),
        },
        {
            desc: `Normal mass boosts all-star resources at a reduced rate.`,
            cost: E('e5200'),
            effect() {
                let x = player.mass.max(1).log10().root(EVO.amt >= 2 ? 1.5 : 2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            get desc() { return EVO.amt >= 2 ? `Square Atomic Upgrade 6.` : `Hyper/Ultra BH Condenser & Cosmic Ray scale 25% weaker.` },
            cost: E('e1.6e4'),
        },
        {
            desc: `Add 200 more C8 maximum completions.`,
            cost: E('e2.2e4'),
        },
        {
            desc: `Tickspeed power boosts base of Star Booster at a reduced rate.`,
            cost: E('e3.6e4'),
            effect() {
                let x = BUILDINGS.eff('tickspeed','power').max(1).log10().div(10).max(1)
                if (hasElement(66)) x = x.pow(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Ultra Rank & Tickspeed scale weaker based on Tier.`,
            cost: E('e5.7e4'),
            effect() {
                let x = E(0.975).pow(player.ranks.tier.pow(0.5))
                return x
            },
            effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
        },
        {
            get desc() { return EVO.amt >= 2 ? `Gain 10x more Apples.` : `The power from the mass of the BH formula is increased to 0.45.` },
            cost: E('e6.6e4'),
        },
        {
            desc: `Add 100 more C7 maximum completions.`,
            cost: E('e7.7e4'),
        },
        {
            desc: `Multiply Particle Powers gain by ^0.5 of its Particle's amount after softcap.`,
            cost: E('e1.5e5'),
        },
        {
            desc: `Ultra rank scaling starts 3 later for every supernova.`,
            cost: E('e2.5e5'),
            effect() {
                if (!tmp.sn.unl) return E(0)
                return player.supernova.times.mul(3)
            },
            effDesc(x) { return format(x,0)+" later" },
        },
        {
            get desc() { return EVO.amt >= 2 ? `Increase Wormhole loselessness by 20%.` : `Non-Bonus tickspeeds are 25x more effective.` },
            cost: E('e3e5'),
        },
        {
            desc: `Rewards from Challenges 3, 4 & 8 are 50% more effective.`,
            cost: E('e5e5'),
        },
        {
            desc: `Add 200 more C7 & C8 maximum completions.`,
            cost: E('e8e5'),
        },
        {
            desc: `Lanthanum's effect is twice as strong.`,
            cost: E('e1.1e6'),
        },
        {
            desc: `Collapsed stars boost quarks gain.`,
            cost: E('e1.7e6'),
            effect() {
                if (!tmp.star_unl) return E(1)
                return hasElement(236) || EVO.amt >= 2 ? Decimal.pow(1.1,player.stars.points.add(1).log10().add(1).log10()) : overflow(player.stars.points.add(1).softcap('e3e15',0.85,2),'ee100',0.5)
            },
            effDesc(x) { return hasElement(236) || EVO.amt >= 2 ? formatPow(x) : format(x)+"x" },
        },
        {
            desc: `Meta-Tickspeed starts 2x later.`,
            cost: E('e4.8e6'),
        },
        {
            desc: `Pent is now added in mass gain formula from collapsed stars.`,
            cost: E('e3.6e7'),
        },
        {
            desc: `Add 200 more C7 & C8 maximum completions.`,
            cost: E('e6.9e7'),
        },
        {
            get desc() { return EVO.amt >= 2 ? `Raise Fabric by +^0.05.` : `BH formula softcap starts laster based on Supernovas.` },
            cost: E('e1.6e8'),
            effect() {
                if (!tmp.sn.unl) return E(1)
                return player.supernova.times.add(1).root(4)
            },
            effDesc(x) { return EVO.amt >= 2 ? undefined : formatPow(x)+" later" },
        },
        {
            desc: `Tetrs are 15% cheaper.`,
            cost: E('e5.75e8'),
        },
        {
            desc: `Add more C5-6 & C8 maximum completions based on Supernovas.`,
            cost: E('e1.3e9'),
            effect() {
                if (!tmp.sn.unl) return E(0)
                let x = player.supernova.times.mul(5)
                if (hasElement(79)) x = x.mul(tmp.qu.chroma_eff[2])
                return x
            },
            effDesc(x) { return "+"+format(x,0) },
        },
        {
            desc: `Super Tetr scales 25% weaker.`,
            cost: E('e2.6e9'),
        },
        {
            desc: `Remove 2 softcaps from Atomic Power's effect.`,
            cost: E('e3.9e9'),
        },
        {
            desc: `Collapsed Star's effect is 25% stronger.`,
            cost: E('e3.75e10'),
        },
        {
            desc: `Mass softcap^3 is 17.5% weaker.`,
            cost: E('e4e11'),
        },
        {
            desc: `Meta-Supernova scales 20% weaker.`,
            cost: E('e3.4e12'),
        },
        {
            desc: `Neutronium-0 affects Aluminium-13 & Tantalum-73.`,
            cost: E('e4.8e12'),
        },
        {
            get desc() { return EVO.amt >= 2 ? `Gain 100x more Quantum Foam.` : `Stronger & Tickspeed are 10x stronger.` },
            get cost() { return EVO.amt >= 2 ? E('e7e12') : E('e1.4e13') },
        },
        {
            desc: `Stronger is ^1.1 stronger.`,
            cost: E('e2.8e13'),
        },
        {
            desc: `Strontium-38 is thrice as effective.`,
            cost: E('e4e13'),
        },
        {
            desc: `Mass Dilation upgrade 2 effect is overpowered.`,
            cost: E('e3e14'),
        },
        {
            desc: `Pre-Ultra Mass Upgrades scale weaker based on Cosmic Ray's free tickspeeds.`,
            cost: E('e7e14'),
            effect() {
                if (!tmp.atom.unl) return E(1)
                return E(EVO.amt >= 2 ? 0.998 : 0.9).pow(tmp.atom.atomicEff[0].add(1).log10().pow(2/3))
            },
            effDesc(x) { return formatReduction(x)+" weaker" },
        },
        {
            desc: `Stronger’s Power softcap starts 3x later, and is 10% weaker.`,
            cost: E('e7.5e15'),
        },
        {
            desc: `Tickspeed’s Power softcap starts ^2 later, and scales 50% weaker.`,
            cost: E('e2e16'),
        },
        {
            desc: `Carbon-6’s effect is overpowered, but disable Sodium-11.`,
            cost: E('e150'),
        },
        {
            desc: `All tickspeed scalings start 100x later (after nerf from 8th QC modifier).`,
            cost: E('e500'),
        },
        {
            desc: `Mass of Black Hole effect raises itself at a reduced logarithmic rate.`,
            cost: E('e1100'),
            effect: () => tmp.bh.unl ? player.bh.mass.add(1).log10().add(1).log10().mul(1.25).add(1).pow(hasElement(201)||player.qu.rip.active?2:0.4) : E(1),
            effDesc(x) { return "^"+x.format() },
        },
        {
            desc: `Death Shard gain is boosted by Dilated Mass.`,
            cost: E('e1300'),
            effect: () => tmp.atom.unl ? player.md.mass.add(1).log10().add(1).pow(0.5) : E(1),
            effDesc(x) { return "x"+x.format() },
        },
        {
            desc: `Entropic Accelerator & Booster nerfing is 10% weaker.`,
            cost: E('e2700'),
        },
        {
            desc: `Insane Challenges scale 25% weaker.`,
            cost: E('e4800'),
        },
        {
            desc: `Entropy gain is increased by 66.7% for every OoM^2 of normal mass.`,
            cost: E('e29500'),
            effect() {
                let x = E(5/3).pow(player.mass.add(1).log10().add(1).log10())
                return x
            },
            effDesc(x) { return "x"+x.format() },
        },
        {
            desc: `Death Shard gain is increased by 10% for every supernova.`,
            cost: E("e32000"),
            effect() {
                if (!tmp.sn.unl) return E(1)

                let s = player.supernova.times
                if (EVO.amt >= 2) return s = s.max(1).min(Number.MAX_VALUE)

                s = s.overflow(1e8,0.5)
                if (!player.qu.rip.active) s = s.root(1.5)
                let x = E(1.1).pow(s)
                return x.softcap(player.qu.rip.active?'e130':'e308',0.01,0).min('e2e4')
            },
            effDesc(x) { return "x"+x.format() },
        },
        {
            desc: `Epsilon particles work in big rip, but are 90% weaker.`,
            cost: E("e34500")
        },
        {
            desc: `Entropic Converter nerfing is 10% weaker.`,
            cost: E('e202000'),
        },
        {
            desc: `Increase Entropic Evaporation’s base by 1.`,
            cost: E('e8.5e6'),
        },
        {
            desc: `8th QC modifier in Big Rip is 20% weaker.`,
            cost: E('e1.2e7'),
        },
        {
            desc: `Remove softcap^3 from Photon Upgrade 3 effect, and its softcap^2 is weaker.`,
            cost: E('e2.15e7'),
        },
        {
            desc: `Prestige Base’s exponent is increased based on Pent.`,
            cost: E('e2.5e7'),
            effect() {
                let pent = player.ranks.pent
                let x = hasElement(195) ? pent.softcap(2e5,0.25,0).root(1.5).div(400) : pent.root(2).div(1e3)
                return x.min(EVO.amt >= 4 ? 100 : 1e4)
            },
            effDesc(x) { return "+^"+format(x) },
        },
        {
            desc: `Blueprint Particles effect is overpowered.`,
            cost: E('e3.5e7'),
        },
        {
            desc: `Tickspeed Power’s softcap starts ^100 later.`,
            cost: E('e111111111'),
        },
        {
            desc: `Pre-Quantum Global Speed is more effective based on Honor.`,
            cost: E('e5e8'),
            effect() {
                let b = E(2)
                if (player.prestiges[0].gte(70)) b = b.add(player.prestiges[1])
                let x = b.pow(player.prestiges[1])
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Add 200 more C9-12 maximum completions.`,
            cost: E('e1.2e9'),
        },
        {
            desc: `Each Particle Power’s 1st effect is exponentially overpowered.`,
            cost: E('e2.2e9'),
        },
        {
            desc: `Entropic Evaporation^2 and Condenser^2 scale 15% weaker.`,
            cost: E('e7.25e9'),
        },
        {
            desc: `Beta Particles are twice as effective.`,
            cost: E('e1.45e10'),
        },
        {
            desc: `All scalings from Ranks to Pent scale 10% weaker (only 2% during Big Rip).`,
            cost: E('e1.6e10'),
        },
        {
            desc: `Entropic multiplier is effective in big rip.`,
            cost: E('e3e10'),
        },
        {
            desc: `Mass gain softcap^4 is 50% weaker (only 20% in Big Rip).`,
            cost: E('e6e10'),
        },
        {
            desc: `Neutron Stars raise Atom gain.`,
            cost: E('e7.5e10'),
            effect() {
                if (!tmp.sn.unl) return E(1)
                return player.supernova.stars.add(1).log10().add(1).log10().add(1).root(3)
            },
            effDesc(x) { return formatPow(x) },
        },
        {
            desc: `[sn4] effect is increased by 2.`,
            cost: E('e3e12'),
        },
        {
            desc: `[bs2] uses a better formula.`,
            cost: E('e4e12'),
        },
        {
            desc: `Entropic Multiplier uses a better formula.`,
            cost: E('e1.2e13'),
        },
        {
            desc: `Mass Dilation upgrades are 5% stronger.`,
            cost: E("e7e13"),
        },
        {
            desc: `Prestige Base boosts Relativistic Energy gain.`,
            cost: E('ee14'),
            effect() {
                let x = tmp.prestiges.base.add(1).root(3)
                return x
            },
            effDesc(x) { return formatMult(x) },
        },
        {
            desc: `Mass gain after all softcaps to ^5 is raised by 10.`,
            cost: E("e5e16"),
        },
        {
            desc: `Unlock Darkness, you'll able to go Dark.`,
            cost: E("e1.7e17"),
        },
        {
            dark: true,
            desc: `Pre-Quantum Speed boosts Dark Shadows.`,
            cost: E("500"),
            effect() {
                let s = tmp.qu.speed
                let x = hasPrestige(0,110) ? expMult(s,0.4) : s.max(1).log10().add(1)
                return x
            },
            effDesc(x) { return formatMult(x) },
        },{
            dark: true,
            desc: `Insane & Impossible Challenges scale 50% weaker.`,
            cost: E("5000"),
        },{
            dark: true,
            desc: `You can buy Cerium-58 in big rip.`,
            cost: E("25000"),
        },{
            dark: true,
            desc: `You can now automatically complete Challenges 9-11. Keep Challenge 12 completions on Big Rip or start QC.`,
            cost: E("e6"),
        },{
            br: true,
            get desc() {return EVO.amt >= 3 ? `Death shards boost protostars gain.` : `You can now automatically buy break dilation upgrades. They no longer spent relativistic mass.`},
            cost: E("ee19"),
            effect() {
                if (EVO.amt < 3) return E(1)
                let x = hasElement(200) ? expMult(player.qu.rip.amt.add(1),0.5) : player.qu.rip.amt.add(1).log10().add(1).pow(2)
                return x
            },
            effDesc(x) { return EVO.amt < 3 ? undefined : formatMult(x) },
        },{
            dark: true,
            desc: `Keep quantum tree on darkness.`,
            cost: E("e7"),
        },{
            get desc() { return EVO.amt >= 2 ? `Improve the Wormhole.` : `7th challenge’s effect gives more C9-12 completions at 10% rate.` },
            cost: E("e9e24"),
            effect() {
                if (betterC7Effect()) return E(0)
                let c = tmp.chal?tmp.chal.eff[7]:E(0)
                let x = c.div(10).ceil()
                return x
            },
            effDesc(x) { return EVO.amt >= 2 ? undefined : "+"+format(x,0) },
        },{
            dark: true,
            desc: `You can buy Tungsten-74 in Big Rip.`,
            cost: E("e8"),
        },{
            dark: true,
            desc: `Start with break dilation unlocked. Relativistic energy gain is increased by 10%.`,
            cost: E("e9"),
        },{
            dark: true,
            desc: `You can buy atom upgrades 13-15 outside Big Rip.`,
            cost: E("e11"),
        },{
            br: true,
            desc: `Argon-18 is overpowered, it can affect BHC & Cosmic Ray powers.`,
            cost: E("e1.7e20"),
        },{
            br: true,
            desc: `Entropic Scaling & Radiation work in Big Rip.`,
            cost: E("e3e20"),
        },{
            dark: true,
            desc: `You can now automatically complete Challenge 12.`,
            cost: E("e12"),
        },{
            dark: true,
            desc: `Unlock the 13th Challenge, Automate Big Rip upgrades.`,
            cost: E("e13"),
        },{
            get desc() { return EVO.amt >= 2 ? `2nd Wormhole boosts Stronger instead. Improve 5th Wormhole in Big Rips.` : `Make the 3rd, 4th & 8th Challenges’ effect better.` },
            cost: E("e6.5e27"),
        },{
            desc: `Super Prestige & Honor are 5% weaker.`,
            cost: E("e1.5e29"),
        },{
            br: true,
            desc: `Dark Shadow gain is boosted by Death Shards.`,
            cost: E("e2.5e25"),
            effect() {
                let x = player.qu.rip.amt.add(1).log10().add(1)
                return x
            },
            effDesc(x) { return formatMult(x,1) },
        },{
            dark: true,
            desc: `You can now gain Relativistic Energy outside of Big Rip.`,
            cost: E("e18"),
        },{
            desc: `Super & Hyper cosmic string scalings are 25% weaker.`,
            cost: E("ee30"),
        },{
            br: true,
            desc: `Supernova boosts blueprint particles earned.`,
            cost: E("e8.6e26"),
            effect() {
                if (!tmp.sn.unl) return E(1)
                return Decimal.pow(1.1,player.supernova.times.overflow(1e75,0.1).softcap(2e5,0.25,0))
            },
            effDesc(x) { return formatMult(x,1) },
        },{
            dark: true,
            desc: `Gain 100% of the Quantizes you would get from resetting each second. Supernova boosts quantizes.`,
            cost: E("2e22"),
            effect() {
                if (!tmp.sn.unl) return E(1)
                return player.supernova.times.pow(1.25).add(1)
            },
            effDesc(x) { return formatMult(x,1) },
        },{
            br: true,
            desc: `Uncap 10th Quantize milestone’s effect.`,
            cost: E("e2e27"),
        },{
            desc: `Gain 10x more dark rays.`,
            cost: E("e1.5e30"),
        },{
            dark: true,
            desc: `Uncap Strange & Neutrino.`,
            cost: E("2e26"),
        },{
            dark: true,
            desc: `Dark shadow’s second effect is better. Keep pre-118 big rip elements on darkness.`,
            cost: E("e27"),
        },{
            dark: true,
            desc: `Unlock the 14th Challenge.`,
            cost: E("e32"),
        },{
            desc: `Prestige Base boosts dark rays earned.`,
            cost: E("e1.7e31"),
            effect() {
                let pb = tmp.prestiges.base
                if (EVO.amt >= 4) pb = pb.root(10)
                let x = hasPrestige(0,218) ? E(10).pow(pb.add(1).log10().root(2)) : pb.add(1).log10().add(1)
                return x.softcap(1e12,0.25,0)
            },
            effDesc(x) { return formatMult(x)+softcapHTML(x,1e12) },
        },{
            br: true,
            desc: `Quantum shard’s base is increased based on the number of elements bought.`,
            cost: E("ee30"),
            effect: () => getElemLength(0)/100,
            effDesc(x) { return "+"+format(x,2) },
        },{
            dark: true,
            desc: `Outside of Big Rip, you can now gain Death Shards. Automate Cosmic Strings.`,
            cost: E("e40"),
        },{
            br: true,
            desc: `Big Rip upgrade 7 is active outside of Big Rip.`,
            cost: E("e2.6e30"),
        },{
            get desc() { return EVO.amt >= 2 ? `Untritrium-133 effect in Big Rip works outside of Big Rip.` : `Stronger’s effect softcap is slightly weaker.` },
            cost: E("e4e45"),
        },{
            get desc() { return EVO.amt >= 2 ? `Improve 4th Wormhole.` : `Stronger’s effect softcap is slightly weaker again. Tickspeed’s effect is overpowered.` },
            cost: E("ee54"),
        },{
            dark: true,
            desc: `Add 75 more C13 maximum completions.`,
            cost: E("e67"),
        },{
            desc: `Boost Dark Ray gain based on quarks.`,
            cost: E("e3.6e61"),
            effect: () => player.atom.quarks.add(1).log10().add(1).log10().add(1).pow(1.5),
            effDesc(x) { return formatMult(x) },
        },{
            br: true,
            desc: `Prestige base exponent boosts Abyssal Blot gain.`,
            cost: E("e6e47"),
            effect() {
                let x = Decimal.max(1,tmp.prestiges.baseExp.pow(1.5))
                return overflow(x,400,0.5)
            },
            effDesc(x) { return formatPow(x)+x.softcapHTML(400) },
        },{
            desc: `Hyper Prestige, Tetr & Pent scalings are 10% weaker.`,
            cost: E("e5e64"),
        },{
            br: true,
            desc: `Meta-Rank Boost affects Meta-Tier starting at a reduced rate.`,
            cost: E("e1.3e49"),
            effect() {
                let x = radBoostEff(14).max(1).log10().add(1)
                if (hasElement(211)) x = x.pow(3)
                return x
            },
            effDesc(x) { return formatMult(x)+" later" },
        },{
            dark: true,
            desc: `Uncap Top & Neut-Muon.`,
            cost: E("e80"),
        },{
            dark: true,
            desc: `Uncap [Neut-Muon]’s effect, and it’s better if its effect is greater than 33%.`,
            cost: E("e84"),
        },{
            br: true,
            get desc() { return EVO.amt >= 2 ? `Fabric boosts Wormhole more.` : EVO.amt >= 1 ? `Raise Meditation' level to the 1.5th power.` : `Meta-Tickspeed scaling starts ^2 later.` },
            cost: E("e2.5e53"),
        },{
            desc: `Abyssal Blot’s second effect applies to mass gain’s softcap^7-8, they are 20% weaker.`,
            get cost() { return E( EVO.amt >= 1 ? "e8e68" : "e2.2e69") },
        },{
            br: true,
            desc: `Stronger Power’s softcap is weaker.`,
            cost: E("e2.9e61"),
        },{
            dark: true,
            desc: `Unlock Dark Run. Keep Oganesson-118 on darkness.`,
            cost: E("e96"),
        },{
            desc: `Collapsed star’s effect raises normal mass. This exponent also raises mass of black hole.`,
            get cost() { return E( EVO.amt >= 1 ? "ee69" : "e2e69") },
        },{
            desc: `Spatial Dilation is slightly weaker.`,
            cost: E("e4.7e70"),
        },{
            br: true,
            desc: `[m1]’s effect is overpowered.`,
            get cost() { return E( EVO.amt >= 2 ? "ee66" : EVO.amt >= 1 ? "e6e68" : "e4.2e69") }, // nice
        },{
            br: true,
            desc: `[rp1]’s effect is overpowered again.`,
            get cost() { return E( EVO.amt >= 2 ? "ee67" : "e6.3e69") },
        },{
            br: true,
            desc: `[bh1]’s effect is overpowered for the third time.`,
            cost: E("e2.27e70"),
        },{
            desc: `Hex’s requirement and Glory’s requirement are slightly weaker.`,
            get cost() { return E( EVO.amt >= 1 ? "ee71" : "e1.08e72") },
        },{
            dark: true,
            desc: `Unlock the 15th Challenge.`,
            cost: E("e106"),
        },{
            get desc() { return EVO.amt >= 3 ? `+^0.05 to Protostars. Nebulae Tier 1 work in Big Rip.` : `Remove two softcaps of particle powers gain.` },
            get cost() { return E(EVO.amt >= 4 ? "ee25" : "e2.35e72") },
        },{
            br: true,
            desc: `Collapsed star’s effect is even better.`,
            cost: E("e1.7e72"),
        },{
            dark: true,
            desc: `Add 100 more C13-C14 maximum completions.`,
            cost: E("e108"),
        },{
            br: true,
            desc: `Uncap bonus fermions from Epsilon Particles.`,
            cost: E("e1.24e73"),
        },{
            desc: `Uncap Bottom.`,
            cost: E("e1.45e78"),
        },{
            desc: `Neutronium-0 can affect supernova challenges at a reduced rate.`,
            cost: E("e1.51e78"),
        },{
            br: true,
            desc: `Super & Hyper Prestiges start +30 later.`,
            cost: E("e1.39e75"),
        },{
            desc: `Supernova boosts dark rays earned.`,
            cost: E("e4.8e78"),
            effect() {
                if (!tmp.sn.unl) return E(1)
                return player.supernova.times.add(1).root(2)
            },
            effDesc(x) { return formatMult(x) },
        },{
            dark: true,
            desc: `Dark Shadow’s fifth effect also boosts entropy cap at a reduced rate.`,
            cost: E("e141"),
            effect() {
                let e = tmp.dark.shadowEff.en||E(1)
                let x = expMult(e,0.5)
                return x
            },
            effDesc(x) { return formatMult(x) },
        },{
            desc: `Exotic rank starts later based on meta-rank starting.`,
            cost: E("e4.8e79"),
            effect() {
                if (!tmp.scaling_start.meta || !tmp.scaling_start.meta.rank) return E(1)
                let x = tmp.scaling_start.meta.rank.add(1).log10().add(1)
                if (hasElement(216)) x = x.pow(2)
                return x
            },
            effDesc(x) { return formatMult(x)+" later" },
        },{
            br: true,
            desc: `Entropy's cap is increased by 25% every Prestige. Entropic Evaporation^2 is slightly weaker.`,
            cost: E("e4.4e76"),
            effect() {
                let x = Decimal.pow(1.25,player.prestiges[0])
                return x
            },
            effDesc(x) { return formatMult(x) },
        },{
            br: true,
            desc: `Reduce first 12 challenges’ scaling’s strength by 30%.`,
            cost: E("e2e77"),
        },{
            desc: `Meta-Tier starts x10 later.`,
            cost: E("e1.2e84"),
        },{
            desc: `Raise collapsed stars gain after softcap by 10.`,
            cost: E("e3.2e84"),
        },{
            br: true,
            desc: `Entropy boosts dark ray gain.`,
            cost: E("e9.5e80"),
            effect() {
                let x = Decimal.pow(1.1,player.qu.en.amt.add(1).log10().pow(.9))
                return x.overflow('ee5',0.5,0)
            },
            effDesc(x) { return formatMult(x) },
        },{
            desc: `Super Pent & Hex start later based on Hybridized Uran-Astatine's first effect.`,
            cost: E("e3e85"),
            effect() {
                let x = tmp.qu.chroma_eff[1][0].max(1).log10().div(2).add(1)
                return x
            },
            effDesc(x) { return formatMult(x) },
        },{
            dark: true,
            desc: `Entropy’s hardcap is now a softcap.`,
            cost: E("e200"),
        },{
            br: true,
            desc: `Add 100 more C13-C15 maximum completions.`,
            cost: E("e7.3e86"),
        },{
            desc: `Black hole overflow starts later based on prestige base.`,
            cost: E("e2e90"),
            effect() {
                let x = Decimal.pow(2,tmp.prestiges.base.max(1).log10().root(2))
                if (tmp.c16.in) x = overflow(x,10,.5)
                return x
            },
            effDesc(x) { return formatPow(x)+" later" },
        },{
            dark: true,
            desc: `Unlock The Matters.`,
            cost: E(1e250),
        },{
            br: true,
            desc: `Dark matter boosts abyssal blots gain. Ultra mass upgrades start ^1.5 later.`,
            cost: E("e8.8e89"),
            effect: () => tmp.bh.unl ? player.bh.dm.add(1).log10().add(1) : E(1),
            effDesc(x) { return formatMult(x) },
        },{
            desc: `Chromas gain is raised to 1.1th power.`,
            cost: E("e1.8e91"),
        },{
            desc: `Z0 Boson’s first effect raises tickspeed power at a reduced rate.`,
            cost: E("e3.5e92"),
            effect() {
                if (!tmp.sn.boson) return E(1)
                return tmp.sn.boson.effect.z_boson[0].add(1).log10().add(1).log10().add(1)
            },
            effDesc(x) { return formatPow(x) },
        },{
            dark: true,
            desc: `Each Matter’s gain is increased by 10% for every OoM^2 of Dark Matter. Unlock more main upgrades.`,
            cost: E(1e303),
            effect: () => tmp.bh.unl ? Decimal.pow(1.1,player.bh.dm.add(1).log10().add(1).log10()) : E(1),
            effDesc(x) { return formatMult(x) },
        },{
            desc: `Hybridized Uran-Astatine’s first effect makes Exotic Rank and Meta-Tier start later at ^0.5 rate.`,
            cost: E("e3.3e93"),
            effect() {
                let x = tmp.qu.chroma_eff[1][0].max(1).root(2)
                return x
            },
            effDesc(x) { return formatMult(x)+" later" },
        },{
            dark: true,
            desc: `Keep prestige tiers on darkness. Super and Hyper Prestiges start x2 later.`,
            cost: E('e360'),
        },{
            desc: `Fermium-100 is slightly stronger. Automate each matter’s upgrade.`,
            cost: E("e1.2e94"),
        },{
            br: true,
            desc: `Add 200 more C13-C14 maximum completions.`,
            cost: E("e7.7e92"),
        },{
            dark: true,
            desc: `Exotic Rank and Ultra Prestige scaling are 10% weaker.`,
            cost: E('e435'),
        },{
            desc: `Particle powers’ first effect is better.`,
            cost: E("e1.6e94"),
        },{
            desc: `Unlock Accelerators, tickspeed now provides an exponential boost, but nullify Argon-18 and Unpentnilium-150 (except in 15th Challenge).`,
            cost: E("e8.6e95"),
        },{
            br: true,
            get desc() { return EVO.amt >= 3 ? `Improve Unbitrium-123.` : `15th challenge reward applies to black hole overflow.` },
            cost: E("e2.6e97"),
        },{
            desc: `Black hole’s effect provides an exponential boost to mass. Actinium-89 is now stronger outside big rip.`,
            cost: E("e3.65e99"),
        },{
            br: true,
            desc: `Unlock the fourth mass upgrade which raises Stronger.`,
            cost: E("e4.9e98"),
        },{
            desc: `Booster boosts its effect.`,
            cost: E("e4e99"),
            effect() {
                let m = player.build.mass_2.amt
                let x = m.add(10).log10().pow(0.8);

                if (hasElement(228)) x = x.mul(Decimal.pow(1.1,m.max(1).log10()))
                
				return x
            },
            effDesc(x) { return formatPow(x) },
        },{
            dark: true,
            desc: `1st and 3rd Photon & Gluon upgrades provide an exponential boost. Keep big rip upgrades on darkness.`,
            cost: E('e605'),
        },{
            desc: `Overpower boosts accelerator power at a reduced rate.`,
            cost: E("e4.2e101"),
            effect() {
                let x = player.build.mass_4.amt.pow(1.5).add(10).log10()
                
				return x
            },
            effDesc(x) { return formatMult(x) },
        },{
            br: true,
            desc: `Dark matter boosts matter exponent.`,
            cost: E("e1.69e100"),
            effect: () => tmp.bh.unl ? player.bh.dm.add(1).log10().add(1).log10().add(1).log10().div(10) : E(0),
            effDesc(x) { return "+^"+format(x) },
        },{
            br: true,
            desc: `Hybridized Uran-Astatine’s second effect applies to hex scalings. It is stronger.`,
            cost: E("e1.67e103"),
        },{
            desc: `Unlock Beyond-Ranks.`,
            cost: E('e2e111'),
        },{
            desc: `Muscler boosts its effect.`,
            cost: E('e1.4e112'),
            effect() {
                let m = player.build.mass_1.amt
                let x = m.add(10).log10().pow(0.8);

                if (hasElement(245)) x = x.mul(Decimal.pow(1.1,m.max(1).log10()))                
				return x
            },
            effDesc(x) { return formatPow(x) },
        },{
            dark: true,
            get desc() { return `Stronger overflow starts later based on FSS.` + (EVO.amt == 3 ? " You can buy protostar elements during Big Rip." : "") },
            get cost() { return E(EVO.amt >= 4 ? 'e645' : 'e710') },
            effect: () => player.dark.matters.final.pow(.8).add(2).pow(player.dark.matters.final),
            effDesc: x => formatMult(x)+" later",
        },{
            br: true,
            desc: `Meta-Rank Boost also affects Meta-Tetr starting at a reduced rate, strengthen Unpentpentium-155.`,
            cost: E("e5e110"),
            effect: () => radBoostEff(14).max(1).log10().add(1),
            effDesc: x => formatMult(x)+" later",
        },{
            br: true,
            desc: `Exotic supernova scales 25% weaker.`,
            cost: E("e1.6e117"),
        },{
            dark: true,
            get desc() { return EVO.amt >= 4 ? `+^0.01 to quark formula from Protostars.` : `[Bottom]’s effect is now better, and is uncapped. Additionally, the Fourth Photon upgrade now provides an exponential boost.` },
            get cost() { return E(EVO.amt >= 4 ? 'e652' : 'e1024') },
        },{
            desc: `Entropic Multiplier is overpowered.`,
            cost: E('e2.6e127'),
        },{
            br: true,
            desc: `Entropic Evaporation^2 and Condenser^2 scale another 15% weaker.`,
            cost: E("ee123"),
        },{
            desc: `Strengthen Unseptoctium-178 slightly.`,
            cost: E('e4.9e130'),
        },{
            dark: true,
            desc: `Final Star Shard's requirement is 20% cheaper.`,
            cost: E('e1480'),
        },{
            desc: `Unlock the 16th Challenge.`,
            get cost() { return E( EVO.amt >= 1 ? "ee134" : "e7e134") },
        },{
            desc: `[m1]’s effect is even better.`,
            cost: E('e3e333'),
        },{
            dark: true,
            desc: `7th break dilation upgrade is even better.`,
            cost: E('e400000'),
        },{
            c16: true,
            desc: `Beyond Rank’s next tier requirement is 5% weaker.`,
            cost: E('ee20'),
        },{
            inf: true,
            desc: `The softcap of theorem’s level starts +5 later.`,
            cost: E('e13'),
        },{
            c16: true,
            desc: `Improve the formula of corrupted shard gain better.`,
            cost: E('ee23'),
        },{
            desc: `The effect of Glory 45 is even stronger.`,
            cost: E('e3e380'),
        },{
            inf: true,
            desc: `Infinity theorem increases parallel extruder’s power. Muon-Catalyzed Fusion no longer resets.`,
            cost: E('e14'),
            effect() {
                if (!tmp.inf_unl) return E(0)
                return player.inf.theorem.div(20)
            },
            effDesc(x) { return "+"+format(x,2) },
        },{
            dark: true,
            desc: `Quantum Shard’s base is boosted by FSS.`,
            cost: E('e640000'),
            effect() {
                let x = player.dark.matters.final.div(10)
                if (hasElement(28,1)) x = x.pow(3)
                return x.add(1)
            },
            effDesc(x) { return formatPow(x,1) },
        },{
            c16: true,
            desc: `Matter exponent boosts matters gain outside C16 (changed during C16).`,
            cost: E('ee25'),
            effect() {
                let x = tmp.matters.exponent.add(1).log10().div(20)
                if (tmp.c16.in) x = x.mul(5)
                return x.add(1)
            },
            effDesc(x) { return formatPow(x)+(tmp.c16.in?'':' to exponent') },
        },{
            desc: `Biniltrium-203 is overpowered.`,
            cost: E('ee448'),
        },{
            dark: true,
            desc: `Increase C16’s max completions to 100. Keep C16 completions in infinity.`,
            cost: E('e810000'),
        },{
            inf: true,
            desc: `Allow you to form any theorem into its fragments, they give you benefits.`,
            cost: E('5e17'),
        },{
            c16: true,
            desc: `Mass of black hole boosts mass overflow^1-2 starting.`,
            cost: E('ee26'),
            effect() {
                if (!tmp.bh.unl) return E(1)
                let x = player.bh.mass.add(10).log10().root(20)
                if (hasBeyondRank(6,12)) x = x.pow(3)
                return x
            },
            effDesc(x) { return formatPow(x)+' later' },
        },{
            inf: true,
            desc: `Passively generate 100% of corrupted shards gained by best mass of black hole in C16.`,
            cost: E('1.25e19'),
        },{
            desc: `Super Parallel Extruder starts +25 later.`,
            cost: E('ee505'),
        },{
            dark: true,
            desc: `Remove the softcap of abyssal blot’s seven reward.`,
            cost: E('e1800000'),
        },{
            inf: true,
            desc: `Passively gain 1% of best IP gained on infinity. The softcap of theorem’s level starts +5 later again.`,
            cost: E('5e22'),
        },{
            desc: `Holmium-67 now provides an exponential boost.`,
            cost: E('ee613'),
        },{
            c16: true,
            desc: `[ct5] is slightly stronger.`,
            cost: E('e5e34'),
        },{
            dark: true,
            desc: `Abyssal blot’s eighth reward is even stronger.`,
            cost: E('e6e6'),
        },{
            inf: true,
            desc: `Going infinity without any theorem selected will auto-fragment each theorem at 25% yield.`,
            cost: E('e24'),
        },{
            inf: true,
            desc: `Unlock 17th Challenge.`,
            cost: E('e25'),
        },{
            c16: true,
            desc: `[ct10] is twice as effective.`,
            cost: E('ee38'),
        },{
            desc: `Current theorem’s level now automatically appends to theorems in core if it’s greater than their level. Keep FV Manipulators on infinity.`,
            cost: E('ee888'),
        },{
            dark: true,
            desc: `Remove all scalings from Pent. Hybridized Uran-Astatine’s first effect now works with Ranks, but it is now changed.`,
            cost: E('e9.2e6'),
        },{
            desc: `Dimensional mass gain is boosted by infinity theorems. Its formula is slightly better.`,
            cost: E('ee1155'),
            effect() {
                if (!tmp.inf_unl) return E(1)
                return hasElement(273) ? E(10).pow(player.inf.theorem.pow(2)) : player.inf.theorem.add(1).tetrate(1.75)
            },
            effDesc(x) { return formatMult(x) },
        },{
            desc: `Binilennium-209 is overpowered.`,
            cost: E('ee1234'),
        },{
            dark: true,
            desc: `Super FSS starts +1 later per 2 infinity theorems.`,
            cost: E('e4.15e7'),
            effect() {
                if (!tmp.inf_unl) return E(0)
                return player.inf.theorem.div(2).floor()
            },
            effDesc(x) { return "+"+format(x,0)+' later' },
        },{
            c16: true,
            desc: `FSS’s first reward in C16 is slightly stronger.`,
            cost: E('e2e55'),
        },{
            desc: `Entropic Multiplier now cheapens instead of increasing starting.`,
            cost: E('ee1680'),
        },{
            dark: true,
            desc: `The first softcap of Abyssal Blot’s tenth reward is slightly weaker.`,
            cost: E('e8.1e7'),
        },{
            desc: `W+ Boson now provides an exponential boost.`,
            cost: E('ee2081'),
        },{
            inf: true,
            desc: `Unlock the Corrupted Star. Automate Parallel Extruder.`,
            get cost() { return E(EVO.amt >= 3 ? 1e32 : 1e34) },
        },{
            desc: `Black Hole’s Mass Overflow^2 starts ^1.5 later to exponent.`,
            cost: E('ee2256'),
        },{
            inf: true,
            desc: `Passively gain 1% of fragment formed from theorem in the core.`,
            cost: E(1e35),
        },{
            c16: true,
            desc: `De-corrupt Unhexbium-162.`,
            cost: E('ee77'),
        },{
            dark: true,
            desc: `C17’s completions boost Super Parallel Extruder.`,
            cost: E('e1.9e8'),
            effect() {
                let x = (player.chal.comps[17]||E(0)).pow(2).div(4).floor()
                return x
            },
            effDesc(x) { return "+"+format(x,0)+' later' },
        },{
            c16: true,
            desc: `The formula of each matter production is better.`,
            get cost() { return E(EVO.amt >= 4 ? 'ee88' :'ee92') },
        },{
            desc: `Fading Matters boost mass overflow^2 starting.`,
            cost: E('e3e3003'),
            effect() {
                let x = overflow(tmp.matters.upg[12].eff.max(1),'ee3',0.5).root(4)
                if (tmp.c16.in) x = x.log10().add(1)
                return x
            },
            effDesc(x) { return formatPow(x)+' later' },
        },{
            inf: true,
            desc: `Unlock 18th Challenge.`,
            cost: E('e45'),
        },{
            desc: `The softcap of accelerator’s effect is slightly weaker.`,
            cost: E('ee6366'),
        },{
            dark: true,
            desc: `Abyssal Blot’s eighth reward is now works in C16.`,
            cost: E('e1.3e10'),
        },{
            c16: true,
            desc: `Add 100 more C16’s max completions.`,
            cost: E('ee219'),
        },{
            inf: true,
            desc: `Unlock Galactic Prestige.`,
            cost: E('e59'),
        },{
            desc: `Galactic Prestige’s resources are affected by pre-infinity global speed.`,
            cost: E('ee7676'),
            effect: () => tmp.preInfGlobalSpeed.max(1).root(2),
            effDesc(x) { return formatMult(x) },
        },{
            c16: true,
            desc: `Prestige mass’s effect now affects stronger overflow^1-2 at a reduced rate.`,
            cost: E('ee294'),
            effect() {
                let x = GPEffect(1,E(1)).root(EVO.amt >= 2 ? 1 : 2)
                return x
            },
            effDesc(x) { return formatReduction(x) + ' weaker' },
        },{
            inf: true,
            desc: `Automatically update best IP gained.`,
            cost: E('e65'),
        },{
            dark: true,
            desc: `The softcap of abyssal blot’s tenth reward is slightly weaker.`,
            cost: E('e1.7e10'),
        },{
            c16: true,
            desc: `Unlock Valor, and automate Ascension.`,
            cost: E('ee347'),
        },{
            desc: `Newton, Hawking, and Dalton Theorems are GREATLY improved.`,
            cost: E('ee7773'),
        },{
            c16: true,
            desc: `Newton Theorem’s fifth star now affects black hole overflow^2, but weaker in C16.`,
            cost: E('ee1745'),
            effect() {
                let x = tmp.inf_unl ? theoremEff('mass',4) : E(1)
                if (tmp.c16.in) x = x.max(1).log10().add(1)
                return x
            },
            effDesc(x) { return formatPow(x)+' later' },
        },{
            desc: `Unlock fifth row of main upgrades.`,
            cost: E('ee10333'),
        },{
            dark: true,
            desc: `Add 300 more C16’s max completions.`,
            cost: E('e2.5e10'),
        },{
            inf: true,
            desc: `The softcap of theorem’s meta-score starts x1.05 later per infinity theorem.`,
            cost: E('e94'),
            effect: () => tmp.inf_unl ? E(1.05).pow(player.inf.theorem) : E(1),
            effDesc(x) { return formatMult(x)+' later' },
        },{
            desc: `Biquadquadium-244’s formula is better.`,
            cost: E('ee17600'),
        },{
            dark: true,
            desc: `Dark shadow’s fourth reward now affects supernova generation at reduced rate.`,
            get cost() { return EVO.amt >= 2 ? E('e8e10') : E('e1.67e11') },
            effect: () => (tmp.dark.shadowEff.sn||E(1)).root(3),
            effDesc(x) { return formatMult(x) },
        },{
            c16: true,
            desc: `Super False Vacuum Manipulator is 50% weaker.`,
            cost: E('ee3500'),
        },{
            desc: `Carbon-6's effect is overpowered again.`,
            cost: E('ee19800'),
        },{
            c16: true,
            desc: `You can buy False Vacuum Manipulator outside of C16.`,
            cost: E('ee6170'),
        },{
            desc: `Bonus cosmic string strengthens its power at a reduced rate.`,
            cost: E('ee23500'),
            effect: () => tmp.build.cosmic_string.bonus.add(1).pow(0.75),
            effDesc(x) { return formatPow(x) },
        },{
            dark: true,
            desc: `The base of collapsed star’s effect for supernova generation is slightly stronger.`,
            get cost() { return E( EVO.amt >= 1 ? "ee12" : "e1.13e12") },
        },{
            inf: true,
            desc: `Unlock 19th Challenge.`,
            get cost() { return E( EVO.amt >= 3 ? 1e100 : EVO.amt >= 1 ? "e105" : "e110") },
        },{
            get desc() { return EVO.amt >= 4 ? "Improve Limitless Dust effect and Galactic Prestige." : `Supernovas boost galactic prestige’s resources at a reduced rate.` },
            cost: E('ee25400'),
            effect() {
                if (!tmp.sn.unl) return E(1)
                return expMult(player.supernova.times.add(1),0.5)
            },
            effDesc: (x) => EVO.amt < 4 ? formatMult(x) : undefined,
        },{
            c16: true,
            desc: `Total Corrupted Shards boost Infinity Points.`,
            cost: E('ee6700'),
            effect: () => EVO.amt >= 4 ? expMult(player.dark.c16.totalS, 1 / (hasInfUpgrade(20) ? 1.9 : 2)).root(30) : player.dark.c16.totalS.add(10).log10(),
            effDesc(x) { return formatMult(x) },
        },{
            desc: `Parallel Extruder is thrice as effective.`,
            get cost() { return E( EVO.amt >= 4 ? "ee42000" : 'ee46000') },
        },{
            dark: true,
            desc: `FSS boosts the exponent of Ascension’s base.`,
            cost: E('e3.1e12'),
            effect: () => player.dark.matters.final.root(2).div(100),
            effDesc(x) { return "+"+format(x) },
        },{
            desc: `Super Galactic Prestige starts +1 later. Automate the Corrupted Star.`,
            cost: E('ee59000'),
        },{
            desc: `Add 500 more C16’s max completions.`,
            cost: E('ee64600'),
        },{
            dark: true,
            desc: `Rank Collapse starts later based on fading matter.`,
            cost: E('e6.5e12'),
            effect() {
                let x = player.dark.matters.amt[12].add(1e10).log10().log10().pow(4/3)
                return x
            },
            effDesc(x) { return formatMult(x)+" later" },
        },{
            c16: true,
            desc: `Challenge 5’s reward is twice as stronger.`,
            get cost() { return E('ee23700') },
        },{
            desc: `Dimensional Mass’s effect is even stronger.`,
            cost: E('ee83000'),
        },{
            inf: true,
            desc: `Unlock 20th Challenge.`,
            get cost() { return E(OURO.evo == 3 ? 1e300 : OURO.evo == 2 ? 1e295 : Number.MAX_VALUE) },
        },{
            proto: true,
            desc: `Stardust boosts Protostars at a reduced rate.`,
            cost: E(1e3),
            effect() {
                if (!tmp.ouro.unl) return E(1)
                let x = expMult(player.evo.proto.dust.add(1),0.25).pow(2)
                return x
            },
            effDesc(x) { return formatMult(x) },
        },{
            desc: `Wormhole affects Protostars slightly.`,
            cost: E(1e6),
            effect() {
                if (!tmp.ouro.unl) return E(1)
                let x = expMult(WORMHOLE.total().add(1),0.5)
                if (tmp.qu.rip.in && hasZodiacUpg("taurus", "u5")) x = x.pow(zodiacEff("taurus", "u5"))
                return x
            },
            effDesc(x) { return formatMult(x) },
        },{
            desc: `Automatically assign all normal nebulae.`,
            cost: E(1e9),
        },{
            desc: `Improve Tier 1 Nebulae. Raise Neutron Stars by ^1.5.`,
            cost: E(1e12),
        },{
            desc: `Quarks raise normal mass slightly.`,
            get cost() { return E(EVO.amt >= 4 ? 1e14 : 1e15) },
            effect: () => hasElement(310) ? expMult(player.atom.quarks.add(1).log10().add(1).root(1.5), 0.5) : player.atom.quarks.add(1).log10().add(1).root(15).softcap(1e6,3,'log'),
            effDesc(x) { return formatPow(x) + x.softcapHTML(1e6, hasElement(310)) },
        },{
            desc: `Dark Shadow’s second reward is better.`,
            cost: E(1e24),
        },{
            get desc() { return EVO.amt >= 4 ? `Dark Rays boost Protostars.` : `Collapsed stars boost Protostars.` },
            get cost() { return E(EVO.amt >= 4 ? 1e28 : 1e42) },
            effect() {
                if (EVO.amt >= 4) return expMult(player.dark.rays.add(1), .5).pow(hasElement(306) ? 1.5 : 1)

                if (!tmp.star_unl) return E(1)
                return player.stars.points.add(1).log10().add(1).log10().add(1).pow(2)
            },
            effDesc(x) { return formatMult(x) },
        },{
            desc: `Protostars boost Exotic Atoms.`,
            cost: E(1e150),
            effect: () => expMult(player.evo.proto.star.add(1),0.5),
            effDesc(x) { return formatMult(x) },
        },{
            desc: `The softcap of quark’s formula from protostars is weaker.`,
            cost: E('e700'),
        },{
            desc: `FSS raises the speed and the starting reduction of corrupted star at a reduced rate.`,
            cost: E('e3300'),
            effect: () => player.dark.matters.final.root(2).div(10).add(1),
            effDesc(x) { return formatPow(x) },
        },{
            desc: `Yellow and cyan nebulae have a second effect that provides a super-exponential boost slightly.`,
            cost: E('e4400'),
        },{
            desc: `Exotic II Nebulae boost infinity points gain.`,
            cost: E('e6000'),
            effect: () => E(2).pow(expMult(player.evo.proto.nebula.ext2,0.8)),
            effDesc(x) { return formatMult(x) },
        },{
            proto: true,
            desc: `Anti-wormhole boosts protostars slightly.`,
            cost: E('e6200'),
            effect: () => player.evo.wh.mass[6].add(1).overflow('ee4',0.5),
            effDesc(x) { return formatMult(x) },
        },{
            proto: true,
            desc: `Stardust boosts supernova generation.`,
            cost: E('e7500'),
            effect: () => player.evo.proto.dust.add(1).log10().add(1),
            effDesc(x) { return formatMult(x) },
        },{
            desc: `Quantum Shards improve Quark Formula.`,
            cost: E(1e17),

            effect: () => Math.min(player.qu.qc.shard, 20) / 100,
            effDesc: x => "+" + format(x),
        },{
            desc: `Improve Biennseptium-297.`,
            cost: E(1e42)
        },{
            desc: `Improve Purple Nebulae.`,
            cost: E(1e56)
        },{
            desc: `FSS raises Matters by an exponential boost.`,
            cost: E(1e65)
        },{
            desc: `Corrupted Shards improve Magneta Nebulae.`,
            cost: E(1e75),

            effect: () => player.dark.c16.shard.max(1).log10().div(50).add(.6).min(.85),
            effDesc: x => formatPow(x),
        },{
            desc: `Improve Biennpentium-295.`,
            cost: E(1e130)
        },{
            desc: `Improve Tier, Pent & Hex. Stardust weakens Exotic Tier & Prestige. Nullify Hybridized Uran-Astaine's first effect.`,
            cost: E(1e240),

            effect() {
				let sd = OURO.unl ? player.evo.proto.dust : E(1)
				return sd.div(1e12).max(1).log10().div(5).max(1).pow(-.6)
			},
            effDesc: x => formatReduction(x) + " weaker",
        },{
            desc: `Corrupted Stars reduce later based on Corrupted Shards.`,
            cost: E("e2800"),

            effect: () => expMult(player.dark.c16.totalS.add(1).root(200),2/3),
            effDesc: x => formatMult(x),
        },
    ],
    /*
	{
		desc: `Nullify a lot of scalings and Tetr 2 reward.`,
		cost: EINF
	}
    {
        desc: `Placeholder.`,
        cost: EINF,
        effect() {
            let x = E(1)
            return x
        },
        effDesc(x) { return format(x)+"x" },
    },
    */
    getUnlLength() {
        let u = 0
        if (OURO.unl) u = 290+[0,0,0,14,22,31,38][EVO.amt]??0
        else if (tmp.inf_unl) {
			u = 218
			if (tmp.brokenInf) u += 12
			if (tmp.tfUnl) u += 12
			if (tmp.asc.unl) u += 9
			if (tmp.cs.unl) u += 7
			if (tmp.c18reward) u += 12
			if (tmp.fifthRowUnl) u += 20
		} else if (player.dark.unl) {
			u = 118+14
			if (tmp.chal13comp) u += 10 + 2
			if (tmp.chal14comp) u += 6 + 11
			if (tmp.chal15comp) u += 16 + 4
			if (tmp.darkRunUnlocked) u += 7
			if (tmp.matterUnl) u += 14
			if (tmp.mass4Unl) u += 6
			if (tmp.brUnl) u += 10
		} else if (quUnl()) {
			u = 77+3
			if (PRIM.unl()) u += 3
			if (hasTree('unl3')) u += 3
			if (player.qu.rip.first) u += 9
			if (hasUpgrade("br",9)) u += 23
		} else if (tmp.sn.unl) {
			u = 49+5
			if (player.supernova.post_10) u += 3
			if (player.supernova.fermions.unl) u += 10
			if (hasTree("unl1")) u += 10
		} else {
			u = 4
			if (player.chal.comps[8].gte(1)) u += 17
			if (MASS_DILATION.unlocked()) u += 15
			if (STARS.unlocked()) u += 18
		}
        return u
    },
}

const MAX_ELEM_TIERS = 3
const ELEM_TYPES = {
	//Special
	final: {
		title: "???",
		get: (i, l, eu) => l == 0 && i == 118,
		can: () => EVO.amt >= 5 || hasInfUpgrade(6) || player.qu.rip.active,
		get res() { return player.atom.quarks },
		set res(x) { player.atom.quarks = E(x) },
		resDisp: x => format(x, 0) + (EVO.amt >= 5 || hasInfUpgrade(6) ? " Quarks" : " Quarks in Big Rip")
	},

	//Challenges
	br: {
		title: "Ripped",
		get: (i, l, eu) => l == 0 && BR_ELEM.includes(i),
		can: () => EVO.amt >= 5 || hasInfUpgrade(6) || player.qu.rip.active,
		get res() { return player.atom.quarks },
		set res(x) { player.atom.quarks = E(x) },
		resDisp: x => format(x, 0) + (EVO.amt >= 5 || hasInfUpgrade(6) ? " Quarks" : " Quarks in Big Rip")
	},
	c16: {
		title: "C16",
		get: (i, l, eu) => eu.c16,
		can: () => tmp.c16.in,
		get res() { return player.atom.quarks },
		set res(x) { player.atom.quarks = E(x) },
		resDisp: x => format(x, 0) + " Quarks in Challenge 16"
	},

	//Types,
	dark: {
		title: "Dark",
		get: (i, l, eu) => eu.dark,
		get res() { return player.dark.shadow },
		set res(x) { player.dark.shadow = E(x) },
		resDisp: x => format(x, 0) + " Dark Shadows"
	},
	inf: {
		title: "Infinity",
		get: (i, l, eu) => eu.inf,
		get res() { return tmp.inf_unl ? player.inf.points : E(0) },
		set res(x) { player.inf.points = E(x) },
		resDisp: x => format(x, 0) + " Infinity Points"
	},
	cs: {
		title: "Corrupted",
		get: (i, l, eu) => eu.cs,
		get res() { return tmp.inf_unl ? player.inf.cs_amount : E(0) },
		set res(x) { player.inf.cs_amount = E(x) },
		resDisp: x => format(x, 0) + " Corrupted Stars"
	},
	berry: {
		title: "Berry",
		get: (i, l, eu) => eu.berry,
		get res() { return player.ouro.berry },
		set res(x) { player.ouro.berry = E(x) },
		resDisp: x => format(x, 0) + " Strawberries"
	},
	proto: {
		title: "Proto",
		get: (i, l, eu) => l == 0 && i > 290,
        can: () => EVO.amt>=4 ? true : !tmp.c16.in && (hasElement(210) || !player.qu.rip.active),
		get res() { return player.evo.proto.star },
		set res(x) { player.evo.proto.star = E(x) },
		resDisp: x => format(x, 0) + " Protostars"
	},

	//Layers
	normal: {
		title: "Normal",
		get: (i, l, eu) => l == 0,
		get res() { return player.atom.quarks },
		set res(x) { player.atom.quarks = E(x) },
		resDisp: x => format(x, 0) + " Quarks"
	},
	muon: {
		title: "Muonic",
		get: (i, l, eu) => l == 1,
		get res() { return tmp.ea.amount },
		set res(x) { },
		resDisp: x => format(x, 0) + " Exotic Atoms"
	}
}

const ELEM_EFFECT = (()=>{
	let x = []
    for (let [i, upg] of Object.entries(ELEMENTS.upgs)) if (upg?.effect) x.push(Number(i))
	return x
})()

const BR_ELEM = (()=>{
    let x = []
    for (let i in ELEMENTS.upgs) if (i>86&&i<=118 || i>0&&ELEMENTS.upgs[i].br) x.push(Number(i))
    return x
})()

const C16_ELEM = (()=>{
    let x = []
    for (let i in ELEMENTS.upgs) if (i>0&&ELEMENTS.upgs[i].c16) x.push(Number(i))
    return x
})()

function getElementId(x) {
    let log = Math.floor(Math.log10(x))
    let list = ["n", "u", "b", "t", "q", "p", "h", "s", "o", "e"]
    let r = ""
    for (var i = log; i >= 0; i--) {
        let n = Math.floor(x / Math.pow(10, i)) % 10
        if (r == "") r = list[n].toUpperCase()
        else r += list[n]
    }
    return r
}

function getElementName(x) {
    if (x <= 118) return ELEMENTS.fullNames[x]
    let log = Math.floor(Math.log10(x))
    let listF = ["Nil", "Un", "Bi", "Tri", "Quad", "Pent", "Hex", "Sept", "Oct", "Enn"]
    let list = ["nil", "un", "bi", "tri", "quad", "pent", "hex", "sept", "oct", "enn"]
    let r = ""
    for (var i = log; i >= 0; i--) {
        let n = Math.floor(x / Math.pow(10, i)) % 10
        if (r == "") r = listF[n]
        else r += list[n]
        if (i == 0) r += n != 2 && n != 3 ? "ium" : "um"
    }
    return r
}

function WE(a,b) { return 2*(a**2-(a-b)**2) }

for (let x = 1; x <= MAX_ELEM_TIERS; x++) {
    let [ts,te] = [ELEMENTS.exp[x-1],ELEMENTS.exp[x]]

    if (x > 1) {
        ELEMENTS.max_hsize[x-1] = 11 + 4*x

        let m = 'xx1xxxxxxxxxxxxxxxxvxx2xxxxxxxxxxxxxxxxv_v'

        for (let y = x; y >= 1; y--) {
            let k = 10 + 4 * y
            m += "1"+'x'.repeat(k)+"v"
            m += "2"+'x'.repeat(k)
            if (y > 1) m += "v_v"
        }

        for (let y = ts+1; y <= te; y++) {
            ELEMENTS.names.push(getElementId(y))
            ELEMENTS.fullNames.push(getElementName(y))
            if (!ELEMENTS.upgs[y]) ELEMENTS.upgs.push({
                desc: `Placeholder.`,
                cost: EINF,
            })
        }

        ELEMENTS.map.push(m)
    }

    // Muonic Elements
    for (let y = ts+1; y <= te; y++) {
        if (!MUONIC_ELEM.upgs[y]) MUONIC_ELEM.upgs.push({
            desc: `Placeholder.`,
            cost: EINF,
        })
    }
}

function isElemCorrupted(x,layer=0) { return layer == 0 && !tmp.elements.deCorrupt.includes(x) && CORRUPTED_ELEMENTS.includes(x) }

function elemEffect(x,def=1) { return tmp.elements.effect[x]||def }

function buyElement(x, layer=player.atom.elemLayer) {
    ELEMENTS.buyUpg(x, layer)
}

function buyAllElements(layer = player.atom.elemLayer) {
	for (let i = 1; i <= tmp.elements.unl_length[layer]; i++) buyElement(i, layer)
}

function setupElementsHTML() {
    let elements_table = new Element("elements_table")
	let table = ""
    let num = 0
    for (let k = 1; k <= MAX_ELEM_TIERS; k++) {
        let hs = `style="width: ${50*ELEMENTS.max_hsize[k-1]}px; margin: auto"`
        let n = 0, p = (k+3)**2*2, xs = ELEMENTS.exp[k-1], xe = ELEMENTS.exp[k]
        table += `<div id='elemTier${k}_div'><div ${hs}><div class='table_center'>`
        for (let i = 0; i < ELEMENTS.map[k-1].length; i++) {
            let m = ELEMENTS.map[k-1][i]
            if (m=='v') table += `</div><div class="table_center">`
            else if (m=='_' || !isNaN(Number(m))) table += `<div ${ELEMENTS.la[m]!==undefined&&k==1?`id='element_la_${m}'`:""} style="width: 50px; height: 50px">${ELEMENTS.la[m]!==undefined?"<br>"+ELEMENTS.la[m]:""}</div>`
            else if (m=='x') {
                num++
                table += ELEMENTS.upgs[num]===undefined?`<div style="width: 50px; height: 50px"></div>`
                :`<button class="elements ${num == 118 ? 'final' : ''}" id="elementID_${num}" onclick="buyElement(${num}); ssf[0]('${ELEMENTS.names[num]}')" onmouseover="tmp.elements.choosed = ${num}" onmouseleave="tmp.elements.choosed = 0">
                <div style="font-size: 12px;">${num}</div><sup class="muon-symbol"></sup>${ELEMENTS.names[num]}
                </button>`
                if (k == 1) {
                    if (num==56 || num==88) num += 14
                    else if (num==70) num += 18
                    else if (num==118) num = 56
                    else if (num==102) num = 118
                } else {
                    if (n == 0) {
                        if (num == xs + 2 || num == xs + p + 2) num += p - 18
                        else if (num == xe) {
                            num = xs + 2
                            n++
                        }
                    } else {
                        if (num == xs + WE(k+3,n) + 2) num = xs + p + WE(k+3,n-1) + 2
                        else if (num == xe - 16) num = xe
                        else if (num == xs + p + WE(k+3,n) + 2) {
                            num = xs + WE(k+3,n) + 2
                            n++
                        }
                    }
                }
            }
        }
        table += "</div></div></div>"
    }
	elements_table.setHTML(table)

    let elem_tier = new Element("elemTierDiv")
    table = ""

    for (let i = 1; i <= MAX_ELEM_TIERS; i++) {
        table += `
        <button class="btn" id="elemTier_btn${i}" onclick="player.atom.elemTier[player.atom.elemLayer] = ${i}">
            Tier ${i}<br>
            <span style="font-size: 10px">[${ELEMENTS.exp[i-1]+1} - ${ELEMENTS.exp[i]}]</span>
        </button>
        `
    }
    elem_tier.setHTML(table)

	setupNextElements()
}

function updateElementsHTML() {
    let tElem = tmp.elements, c16 = tmp.c16.in
    let et = player.atom.elemTier, elayer = player.atom.elemLayer
    let infU7 = hasInfUpgrade(6)

    tmp.el.elemLayer.setDisplay(tmp.ea.unl || EVO.amt > 0)
    tmp.el.elemLayer.setHTML("Elements' Layer: "+["Normal","Muonic"][elayer])
    tmp.el.elemTierDiv.setDisplay(tElem.max_tier[elayer]>1)

    let elem_const = [ELEMENTS,MUONIC_ELEM][elayer]

    let ch = tElem.choosed
    tmp.el.elem_ch_div.setDisplay(ch>0)
    tmp.el.elem_next_div.setDisplay(ch==0)
    if (ch) {
        let eu = elem_const.upgs[ch]
        let eff = tElem[["effect","mu_effect"][elayer]]
        let fed = tmp.ouro.fed["e"+elayer+"_"+ch]

        tmp.el.elem_desc.setHTML("<b>["+["","Muonic "][elayer]+ELEMENTS.fullNames[ch]+"]</b> "+(fed?EVO.fed_msg[fed]:eu.desc))
        tmp.el.elem_desc.setClasses({sky: true, corrupted_text2: c16 && isElemCorrupted(ch,elayer)})
        tmp.el.elem_cost.setTxt(fed ? "" : "Cost: " + ELEM_TYPES[getElementClass(ch, elayer)].resDisp(eu.cost)+(tElem.cannot.includes(ch)?" [CANNOT AFFORD in Big Rip]":""))
        
        let effDesc = !fed && eu.effDesc && eu.effDesc(eff[ch])
        tmp.el.elem_eff.setHTML(effDesc?"Currently: "+effDesc:"")
    }

    for (let t = 1; t <= MAX_ELEM_TIERS; t++) {
        let unl = et[elayer] == t
        tmp.el["elemTier"+t+"_div"].setDisplay(unl)
        if (unl) {
            let unllen = tElem.unl_length[elayer]
            if (t == 1) {
                tmp.el.element_la_1.setVisible(unllen>56)
                tmp.el.element_la_3.setVisible(unllen>56)
                tmp.el.element_la_2.setVisible(unllen>88)
                tmp.el.element_la_4.setVisible(unllen>88)
            }

            let len = tElem.te
            for (let x = tElem.ts+1; x <= len; x++) {
                let upg = tmp.el['elementID_'+x]
                if (upg) {
                    let unl2 = x <= unllen
                    upg.setVisible(unl2)
                    if (unl2) {
                        let eu = elem_const.upgs[x]
                        let fed = tmp.ouro.fed["e"+elayer+"_"+x]
                        upg.setClasses(
							fed ? {elements: true, locked: true, [ fed ]: true} :
							c16 && isElemCorrupted(x,elayer) ? {elements: true, locked: true, corrupted: true} :
							elayer == 0 && tElem.cannot.includes(ch) ? {elements: true, locked: true, cannot: true} :
							{
								elements: true,
								locked: !ELEMENTS.canBuy(x, elayer),
								bought: hasElement(x,elayer),
								[ getElementClass(x, elayer) ]: true,
							}
                        )
                    }
                }
            }
        }

        tmp.el["elemTier_btn"+t].setDisplay(t <= tElem.max_tier[elayer])
    }
}

function getElementClass(i, layer) {
	let upgs = [ELEMENTS, MUONIC_ELEM][layer].upgs
	for (var [key, d] of Object.entries(ELEM_TYPES)) if (d.get(i, layer, upgs[i])) return key
}

function updateElementsTemp() {
    let evo = EVO.amt
    let tElem = tmp.elements
    let et = player.atom.elemTier, elayer = player.atom.elemLayer

    tElem.ts = ELEMENTS.exp[et[elayer]-1]
    tElem.te = ELEMENTS.exp[et[elayer]]
    tElem.tt = tElem.te - tElem.ts

    let decor = []
    if (hasElement(10,1)) decor.push(187)
    if (hasCharger(9)) decor.push(40,64,67,150,199,200,204)
    if (hasElement(254)) decor.push(162)
    tElem.deCorrupt = decor

    let cannot = []
    if (player.qu.rip.active) {
        if (!hasElement(121)) cannot.push(58)
        if (!hasElement(126)) cannot.push(74)
        if (EVO.amt >= 4 && !hasZodiacUpg("taurus", "u5")) cannot.push(292)
    }
    tElem.cannot = cannot

    tElem.unl_length = [ELEMENTS.getUnlLength(), MUONIC_ELEM.getUnlLength()]
    tElem.max_tier = [1,1]
	for (var [i, u] of Object.entries(tElem.unl_length)) {
		while (u > ELEMENTS.exp[tElem.max_tier[i]]) tElem.max_tier[i]++
	}

    for (let x of ELEM_EFFECT) {
		if (x > tElem.unl_length[0]) return
        tElem.effect[x] = ELEMENTS.upgs[x].effect()
    }
}

//Chunks!
function chunkify(r) {
    let min = [], max = []
    for (let i of r) {
		i = getChunk(i)
        min.push(i[0])
        max.push(i[1])
    }
    let sort = (a, b) => (a > b ? 1 : -1)
    min.sort(sort), max.sort(sort)

    let new_chunks = []
    let min_sel = min[0]
    for (let [i, j] of Object.entries(max)) {
		i = parseInt(i)
        if (j+1 >= min[i+1]) continue
        new_chunks.push(min_sel == j ? j : [min_sel, j])
		min_sel = min[i+1]
    }
    return new_chunks
}

function unchunkify(r) {
	let list = []
	for (let i of r) {
		i = getChunk(i)
		for (let x = i[0]; x <= i[1]; x++) list.push(x)
	}
	return list
}

function getChunk(x) {
    return typeof x == "number" ? [x,x] : x ?? [0,0]
}

function hasElement(i, layer = 0) {
	let s = player.atom[["elements", "muonic_el"][layer]]
	if (s.includes(i)) return true

	for (let c of s) if (c[0] <= i && c[1] >= i) return true
	return false
}

function getElemLength(layer) {
	let s = player.atom[["elements", "muonic_el"][layer]]
	let total = s.length
	for (let i of s) if (typeof i != "number") total += i[1] - i[0]
	return total
}

//Next
function setupNextElements() {
	let h = ``
	for (var i = 0; i < 3; i++) h += `<div class='elem_detailed' id="elem_next_div${i}" onclick="buyNextElement(${i})">
		<button id="elem_next_btn${i}"></button>
		<div id="elem_next${i}"></div>
	</div>`
	new Element("elem_next_ch").setHTML(h)
}

function buyNextElement(i) {
	buyElement(nextElm[i])
}

let nextElm = []
function calcNextElements() {
	let layer = player.atom.elemLayer
	let ch = getChunk(player.atom[["elements", "muonic_el"][layer]][0])
	let i = ch[0] != 1 ? 0 : ch[1], data = [ELEMENTS, MUONIC_ELEM][layer].upgs
	nextElm = []

	while (nextElm.length < 3 && i < tmp.elements.unl_length[layer]) {
		i++
		if (ELEMENTS.cannotAfford(i, layer)) continue
		if (hasElement(i, layer)) continue

		let len = nextElm.length, type = getElementClass(i, layer), type_data = ELEM_TYPES[type]
		tmp.el["elem_next_div" + len].setDisplay(true)
		tmp.el["elem_next_btn" + len].setClasses({ elements: true, bought: true, [ type ]: true })
		tmp.el["elem_next_btn" + len].setTxt(ELEMENTS.names[i] ?? getElementId(i))
		tmp.el["elem_next" + len].setHTML(`${type_data.resDisp(data[i].cost)}<br>
		<span style='font-size: 12px'>${type_data.title}</span>`)
		nextElm.push(i)
	}
	for (let i = nextElm.length; i < 3; i++) tmp.el["elem_next_div" + i].setDisplay(false)
}