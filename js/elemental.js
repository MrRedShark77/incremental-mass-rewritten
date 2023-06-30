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
    canBuy(x) {
        if (tmp.c16active && isElemCorrupted(x)) return false
        let u = this.upgs[x]
        let res = u.sn? player.supernova.times : u.inf ? player.inf.points : u.dark ? player.dark.shadow : player.atom.quarks
        return res.gte(u.cost) && !hasElement(x) && (hasInfUpgrade(6) && x <= 218 || player.qu.rip.active || !BR_ELEM.includes(x)) && (tmp.c16active || !C16_ELEM.includes(x)) && !tmp.elements.cannot.includes(x) && !(CHALS.inChal(14) && x < 118) && !(CHALS.inChal(18) && x < 118)
    },
    buyUpg(x) {
        if (this.canBuy(x)) {
            let u = this.upgs[x]

            if (u.inf) player.inf.points = player.inf.points.sub(u.cost)
            else if (u.dark) player.dark.shadow = player.dark.shadow.sub(u.cost)
            else player.atom.quarks = player.atom.quarks.sub(u.cost)
            player.atom.elements.push(x)

            tmp.pass = 2
        }
    },
    upgs: [
        null,
        {
            desc: `Quark gain formula is better.`,
            cost: E(5e8),
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
                    x = player.atom?player.atom.powers[2].add(1).log10().add(1).log10().add(1).pow(1.5):E(1)
                } else {
                    x = player.atom?player.atom.powers[2].add(1).root(2):E(1)
                    if (x.gte('e1e4')) x = expMult(x.div('e1e4'),0.9).mul('e1e4')
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
                let x = player.atom?player.atom.powers[0].max(1).log10().pow(0.8).div(50).add(1):E(1)
                return overflow(x.softcap(1e45,0.1,0),'e60000',0.5).min('ee6')
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
                let x = E(0)
                for (let i = 1; i <= CHALS.cols; i++) x = x.add(player.chal.comps[i].mul(i>4?2:1))
                if (hasElement(7)) x = x.mul(tmp.elements.effect[7])
                if (hasElement(87)) x = E(1.01).pow(x).root(3)
                else x = x.div(100).add(1).max(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Carbon's effect is now multiplied by the number of elements bought.`,
            cost: E(1e20),
            effect() {
                let x = E(player.atom.elements.length+1)
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
            desc: `Super BH Condenser & Cosmic Ray scale 20% weaker.`,
            cost: E(1e34),
        },
        {
            desc: `Silicon's effect is +2% better for each element bought.`,
            cost: E(5e38),
            effect() {
                let x = player.atom.elements.length*0.02
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
                let x = overflow(hasElement(129) ? player.atom.gamma_ray.pow(0.5).mul(0.02).add(1) : player.atom.gamma_ray.pow(0.35).mul(0.01).add(1),1000,0.5)
                if (hasElement(18,1)) x = x.pow(muElemEff(18))
                return x
            },
            effDesc(x) { return "^"+format(x) },
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
                let x = E(1.25).pow(player.tickspeed.pow(0.55))
                return x
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
                let x = hasPrestige(0,40) ? player.atom.atomic.max(1).log10().add(1).log10().add(1).root(2) : player.atom.atomic.max(1).log10().add(1).pow(0.4)
                return x
            },
            effDesc(x) { return hasPrestige(0,40) ? "^"+format(x) : format(x)+"x" },
        },
        {
            desc: `Increases Mass Dilation upgrade 1's base by 1.`,
            cost: E(1e80),
        },
        {
            desc: `Hardened challenge scaling is weaker for each element bought.`,
            cost: E(1e85),
            effect() {
                let x = E(0.99).pow(E(player.atom.elements.length).softcap(30,2/3,0)).max(0.5)
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
            effect() {
                let x = player.rp.points.max(1).log10().add(1).pow(0.75)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Mass from Black Hole boosts dilated mass gain.`,
            cost: E(1e210),
            effect() {
                let x = player.bh.mass.max(1).log10().add(1).pow(0.8)
                return x
            },
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
                let x = tmp.atom?tmp.atom.atomicEff:E(0)
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
                let x = player.stars.points.add(1).pow(0.5)
                let y = hasPrestige(0,190)?player.stars.points.add(1).log10().add(1).log10().add(1):E(1)
                return [x.softcap('e4e66',0.95,2),y]
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
                let x = player.stars.points.add(1).pow(1/3)

                x = overflow(x,'ee112',0.5)

                return x
            },
            effDesc(x) { return format(x)+"x" },
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
                let x = player.stars.points.add(1).pow(0.15).min(1e20)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Collapsed star's effect boosts mass of black hole gain at a reduced rate.`,
            cost: E('e510'),
            effect() {
                let x = tmp.stars?tmp.stars.effect.add(1).pow(0.02):E(1)
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
                let x = player.stars.points.add(1).log10().add(1).pow(1.1)
                return x
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
            effect() {
                let x = expMult(player.bh.mass.add(1),0.6)
                return x
            },
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
                let x = player.mass.max(1).log10().root(2)
                if (hasElement(292)) x = player.mass.max(1).log(9).root(3)
                return x
            },
            effDesc(x) { if (hasElement(292)) return "^"+format(x)
                else return format(x)+"x" },
        },
        {
            desc: `Hyper/Ultra BH Condenser & Cosmic Ray scale 25% weaker.`,
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
                let x = tmp.tickspeedEffect?tmp.tickspeedEffect.step.max(1).log10().div(10).max(1):E(1)
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
            desc: `The power from the mass of the BH formula is increased to 0.45.`,
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
                let x = player.supernova.times.mul(3)
                return x
            },
            effDesc(x) { return format(x,0)+" later" },
        },
        {
            desc: `Non-Bonus tickspeeds are 25x more effective.`,
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
                let x = player.stars.points.add(1)
                return overflow(x.softcap('e3e15',0.85,2),'ee100',0.5)
            },
            effDesc(x) { return format(x)+"x" },
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
            desc: `BH formula softcap starts laster based on Supernovas.`,
            cost: E('e1.6e8'),
            effect() {
                let x = player.supernova.times.add(1).root(4)
                return x
            },
            effDesc(x) { return "^"+format(x)+" later" },
        },
        {
            desc: `Tetrs are 15% cheaper.`,
            cost: E('e5.75e8'),
        },
        {
            desc: `Add more C5-6 & C8 maximum completions based on Supernovas.`,
            cost: E('e1.3e9'),
            effect() {
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
            desc: `Stronger & Tickspeed are 10x stronger.`,
            cost: E('e1.4e13'),
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
                let x = tmp.atom?E(0.9).pow(tmp.atom.atomicEff.add(1).log10().pow(2/3)):E(1)
                return x
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
            effect() {
                let x = player.bh.mass.add(1).log10().add(1).log10().mul(1.25).add(1).pow(hasElement(201)||player.qu.rip.active?2:0.4)
                //if (player.qu.rip.active) x = x.softcap(100,0.1,0)
                return x
            },
            effDesc(x) { return "^"+x.format() },
        },
        {
            desc: `Death Shard gain is boosted by Dilated Mass.`,
            cost: E('e1300'),
            effect() {
                let x = player.md.mass.add(1).log10().add(1).pow(0.5)
                return x
            },
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
                let s = player.supernova.times
                if (!player.qu.rip.active) s = s.root(1.5)
                let x = E(1.1).pow(s)
                return x.softcap(player.qu.rip.active?'1e130':'1e308',0.01,0)
            },
            effDesc(x) { return "x"+x.format() },
        },
        {
            desc: `Epsilon particles work in big rip, but are 90% weaker.`,
            cost: E("e34500"),
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
                return x.toNumber()
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
                let x = player.supernova.stars.add(1).log10().add(1).log10().add(1).root(3)
                return x
            },
            effDesc(x) { return "^"+format(x) },
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
            cost: E('e1e14'),
            effect() {
                let x = (tmp.prestiges.base||E(1)).add(1).root(3)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },
        {
            desc: `Mass gain after all softcaps to ^5 is raised by 10.`,
            cost: E("e5e16"),
        },
        {
            desc: `Unlock <span id="final_118">Darkness</span>, you'll able to go Dark.`,
            cost: E("e1.7e17"),
        },
        {
            dark: true,
            desc: `Pre-Quantum global speed affects dark shadow gain at a logarithmic reduced rate.`,
            cost: E("500"),
            effect() {
                let s = tmp.preQUGlobalSpeed||E(1)
                let x = hasPrestige(0,110) ? expMult(s,0.4) : s.max(1).log10().add(1)
                return x
            },
            effDesc(x) { return "x"+format(x) },
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
            cost: E("1e6"),
        },{
            br: true,
            desc: `You can now automatically buy break dilation upgrades. They no longer spent relativistic mass.`,
            cost: E("ee19"),
        },{
            dark: true,
            desc: `Keep quantum tree on darkness.`,
            cost: E("1e7"),
        },{
            desc: `7th challenge’s effect gives more C9-12 completions at 10% rate.`,
            cost: E("e9e24"),
            effect() {
                if (hasPrestige(2,25)) return E(0)
                let c = tmp.chal?tmp.chal.eff[7]:E(0)
                let x = c.div(10).ceil()
                return x
            },
            effDesc(x) { return "+"+format(x,0) },
        },{
            dark: true,
            desc: `You can buy Tungsten-74 in Big Rip.`,
            cost: E("1e8"),
        },{
            dark: true,
            desc: `Start with break dilation unlocked. Relativistic energy gain is increased by 10%.`,
            cost: E("1e9"),
        },{
            dark: true,
            desc: `You can buy atom upgrades 13-15 outside Big Rip.`,
            cost: E("1e11"),
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
            desc: `Make the 3rd, 4th & 8th Challenges’ effect better.`,
            cost: E("e6.5e27"),
        },{
            desc: `Super Prestige Level & Honor are 5% weaker.`,
            cost: E("e1.5e29"),
        },{
            br: true,
            desc: `Dark Shadow gain is boosted by Death Shards.`,
            cost: E("e2.5e25"),
            effect() {
                let x = player.qu.rip.amt.add(1).log10().add(1)
                return x
            },
            effDesc(x) { return "x"+format(x,1) },
        },{
            dark: true,
            desc: `You can now gain Relativistic Energy outside of Big Rip. Keep non-QoL quantum tree on entering any dark challenge.`,
            cost: E("1e18"),
        },{
            desc: `Super & Hyper cosmic string scalings are 25% weaker.`,
            cost: E("ee30"),
        },{
            br: true,
            desc: `Supernova boosts blueprint particles earned.`,
            cost: E("e8.6e26"),
            effect() {
                let x = Decimal.pow(1.1,player.supernova.times.softcap(2e5,0.25,0))
                return x
            },
            effDesc(x) { return "x"+format(x,1) },
        },{
            dark: true,
            desc: `Gain 100% of the Quantizes you would get from resetting each second. Supernova boosts quantizes.`,
            cost: E("2e22"),
            effect() {
                let x = player.supernova.times.pow(1.25).add(1)
                return x
            },
            effDesc(x) { return "x"+format(x,1) },
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
            cost: E("1e27"),
        },{
            dark: true,
            desc: `Unlock the 14th Challenge.`,
            cost: E("1e32"),
        },{
            desc: `Prestige Base boosts dark rays earned.`,
            cost: E("e1.7e31"),
            effect() {
                let pb = tmp.prestiges.base||E(1)
                let x = hasPrestige(0,218) ? Decimal.pow(10,pb.add(1).log10().root(2)) : pb.add(1).log10().add(1)
                return x.softcap(1e12,0.25,0)
            },
            effDesc(x) { return "x"+format(x)+softcapHTML(x,1e12) },
        },{
            br: true,
            desc: `Quantum shard’s base is increased based on the number of elements bought.`,
            cost: E("ee30"),
            effect() {
                let x = player.atom.elements.length/100
                return x
            },
            effDesc(x) { return "+"+format(x,2) },
        },{
            dark: true,
            desc: `Outside of Big Rip, you can now gain Death Shards. Automate Cosmic Strings.`,
            cost: E("1e40"),
        },{
            br: true,
            desc: `Big Rip upgrade 7 is active outside of Big Rip.`,
            cost: E("e2.6e30"),
        },{
            desc: `Stronger’s effect softcap is slightly weaker.`,
            cost: E("e4e45"),
        },{
            desc: `Stronger’s effect softcap is slightly weaker again. Tickspeed’s effect is overpowered.`,
            cost: E("ee54"),
        },{
            dark: true,
            desc: `Add 75 more C13 maximum completions.`,
            cost: E("1e68"),
        },{
            desc: `Boost Dark Ray gain based on quarks.`,
            cost: E("e3.6e61"),
            effect() {
                let x = player.atom.quarks.add(1).log10().add(1).log10().add(1).pow(1.5)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            br: true,
            desc: `Prestige base exponent boosts Abyssal Blot gain.`,
            cost: E("e6e47"),
            effect() {
                let x = Decimal.max(1,tmp.prestiges.baseExp**1.5)
                return overflow(x,400,0.5)
            },
            effDesc(x) { return "^"+format(x)+x.softcapHTML(400) },
        },{
            desc: `Hyper Prestige Level, Tetr & Pent scalings are 10% weaker.`,
            cost: E("e5e64"),
        },{
            br: true,
            desc: `Meta-Rank Boost affects Meta-Tier starting at a reduced rate.`,
            cost: E("e1.3e49"),
            effect() {
                let x = tmp.radiation.bs.eff[14].max(1).log10().add(1)
                if (hasElement(211)) x = x.pow(3)
                return x
            },
            effDesc(x) { return "x"+format(x)+" later" },
        },{
            dark: true,
            desc: `Uncap Top & Neut-Muon.`,
            cost: E("1e80"),
        },{
            dark: true,
            desc: `Uncap [Neut-Muon]’s effect, and it’s better if its effect is greater than 33%.`,
            cost: E("1e84"),
        },{
            br: true,
            desc: `Meta-Tickspeed scaling starts ^2 later.`,
            cost: E("e2.5e53"),
        },{
            desc: `Abyssal Blot’s second effect applies to mass gain’s softcap^7-8, they are 20% weaker.`,
            cost: E("e2.2e69"),
        },{
            br: true,
            desc: `Stronger Power’s softcap is weaker.`,
            cost: E("e2.9e61"),
        },{
            dark: true,
            desc: `Unlock Dark Run. Keep Oganesson-118 on darkness.`,
            cost: E("1e96"),
        },{
            desc: `Collapsed star’s effect now provide an exponential boost at a reduced rate. It now applies to mass of black hole gain. But nullify Palladium-46, Cadmium-48, Thulium-69 & Osmium-76.`,
            cost: E("e2e69"),
        },{
            desc: `Spatial Dilation is slightly weaker.`,
            cost: E("e4.7e70"),
        },{
            br: true,
            desc: `[m1]’s effect is overpowered.`,
            cost: E("e4.20e69"), // nice
        },{
            br: true,
            desc: `[rp1]’s effect is overpowered again.`,
            cost: E("e6.3e69"),
        },{
            br: true,
            desc: `[bh1]’s effect is overpowered for the third time.`,
            cost: E("e2.27e70"),
        },{
            desc: `Hex’s requirement and Glory’s requirement are slightly weaker.`,
            cost: E("e1.08e72"),
        },{
            dark: true,
            desc: `Unlock the 15th Challenge.`,
            cost: E("1e106"),
        },{
            desc: `Remove two softcaps of particle powers gain.`,
            cost: E("e2.35e72"),
        },{
            br: true,
            desc: `Collapsed star’s effect is even better.`,
            cost: E("e1.7e72"),
        },{
            dark: true,
            desc: `Add 100 more C13-C14 maximum completions.`,
            cost: E("1e108"),
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
            desc: `Super & Hyper prestige levels start +30 later.`,
            cost: E("e1.39e75"),
        },{
            desc: `Supernova boosts dark rays earned.`,
            cost: E("e4.8e78"),
            effect() {
                let x = player.supernova.times.add(1).root(2)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            dark: true,
            desc: `Dark Shadow’s fifth effect also boosts entropy cap at a reduced rate.`,
            cost: E("1e141"),
            effect() {
                let e = tmp.dark.shadowEff.en||E(1)
                let x = expMult(e,hasElement(262)?0.525:0.5)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            desc: `Exotic rank starts later based on meta-rank starting.`,
            cost: E("e4.8e79"),
            effect() {
                if (!tmp.scaling_start.meta || !tmp.scaling_start.meta.rank) return E(1)
                let x = tmp.scaling_start.meta.rank.add(1).log10().add(1)
                if (hasElement(216)) x = x.pow(2)
                return x
            },
            effDesc(x) { return "x"+format(x)+" later" },
        },{
            br: true,
            desc: `Entropy's cap is increased by 25% every prestige level. Entropic Evaporation^2 is slightly weaker.`,
            cost: E("e4.4e76"),
            effect() {
                if (hasElement(298)) x = Decimal.pow(1.25,player.ranks.hex.root(2.6))
                else x = Decimal.pow(1.25,player.prestiges[0])
                return x
            },
            effDesc(x) { return "x"+format(x) },
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
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            desc: `Super Pent & Hex start later based on Hybridized Uran-Astatine's first effect.`,
            cost: E("e3e85"),
            effect() {
                let x = tmp.qu.chroma_eff[1][0].max(1).log10().div(2).add(1)
                return x
            },
            effDesc(x) { return "x"+format(x) },
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
                if (tmp.c16active) x = overflow(x,10,.5)
                return overflow(x,'1e500',0.5)
            },
            effDesc(x) { return "^"+format(x)+" later" },
        },{
            dark: true,
            desc: `Unlock The Matters.`,
            cost: E(1e250),
        },{
            br: true,
            desc: `Dark matter boosts abyssal blots gain. Ultra mass upgrades start ^1.5 later.`,
            cost: E("e8.8e89"),
            effect() {
                let x = player.bh.dm.add(1).log10().add(1)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            desc: `Chromas gain is raised to 1.1th power.`,
            cost: E("e1.8e91"),
        },{
            desc: `Z0 Boson’s first effect raises tickspeed power at a reduced rate.`,
            cost: E("e3.5e92"),
            effect() {
                let x = tmp.bosons.effect.z_boson[0].add(1).log10().add(1).log10().add(1)
                return x
            },
            effDesc(x) { return "^"+format(x) },
        },{
            dark: true,
            desc: `Each Matter’s gain is increased by 10% for every OoM^2 of Dark Matter. Unlock more main upgrades.`,
            cost: E(1e303),
            effect() {
                let x = Decimal.pow(1.1,player.bh.dm.add(1).log10().add(1).log10())
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            desc: `Hybridized Uran-Astatine’s first effect makes Exotic Rank and Meta-Tier start later at ^0.5 rate.`,
            cost: E("e3.3e93"),
            effect() {
                let x = tmp.qu.chroma_eff[1][0].max(1).root(2)
                return x
            },
            effDesc(x) { return "x"+format(x)+" later" },
        },{
            dark: true,
            desc: `Keep prestige tiers on darkness. Super and Hyper Prestige Levels start x2 later.`,
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
            desc: `Exotic Rank and Ultra Prestige Level scaling are 10% weaker.`,
            cost: E('e435'),
        },{
            desc: `Particle powers’ first effect is better.`,
            cost: E("e1.6e94"),
        },{
            desc: `Unlock Accelerators, tickspeed now provides an exponential boost, but nullify Argon-18 and Unpentnilium-150 (except in 15th Challenge).`,
            cost: E("e8.6e95"),
        },{
            br: true,
            desc: `15th challenge reward applies to black hole overflow.`,
            cost: E("1e2.6e97"),
        },{
            desc: `Black hole’s effect provides an exponential boost to mass. Actinium-89 is now stronger outside big rip.`,
            cost: E("e3.65e99"),
        },{
            br: true,
            desc: `Unlock the fourth mass upgrade which raises Stronger.`,
            cost: E("1e4.9e98"),
        },{
            desc: `Booster boosts its effect.`,
            cost: E("e4e99"),
            effect() {
                let m = player.massUpg[2]||E(0)
                let x = m.add(10).log10().pow(0.8);

                if (hasElement(228)) x = x.mul(Decimal.pow(1.1,m.max(1).log10()))
                
				return x
            },
            effDesc(x) { return "^"+format(x) },
        },{
            dark: true,
            desc: `1st and 3rd Photon & Gluon upgrades provide an exponential boost. Keep big rip upgrades on darkness.`,
            cost: E('e605'),
        },{
            desc: `Overpower boosts accelerator power at a reduced rate.`,
            cost: E("e4.2e101"),
            effect() {
                let x = (player.massUpg[4]||E(1)).pow(1.5).add(10).log10()
                
				return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            br: true,
            desc: `Dark matter boosts matter exponent.`,
            cost: E("1e1.69e100"),
            effect() {
                let x = player.bh.dm.add(1).log10().add(1).log10().add(1).log10().div(10)
                
				return x.toNumber()
            },
            effDesc(x) { return "+^"+format(x) },
        },{
            br: true,
            desc: `Hybridized Uran-Astatine’s second effect applies to hex scalings. It is stronger.`,
            cost: E("1e1.67e103"),
        },{
            desc: `Unlock Beyond-Ranks.`,
            cost: E('e2e111'),
        },{
            desc: `Muscler boosts its effect.`,
            cost: E('e1.4e112'),
            effect() {
                let m = player.massUpg[1]||E(0)
                let x = m.add(10).log(hasElement(286)?1.01:10).pow(hasElement(286)?15:0.8);
                
				return x
            },
            effDesc(x) { return "^"+format(x) },
        },{
            dark: true,
            desc: `Stronger overflow starts later based on FSS.`,
            cost: E('e710'),
            effect() {
                let x = player.dark.matters.final.pow(.8).add(2).pow(player.dark.matters.final)
                
				return x
            },
            effDesc(x) { return "x"+format(x)+" later" },
        },{
            br: true,
            desc: `Meta-Rank Boost also affects Meta-Tetr starting at a reduced rate, strengthen Unpentpentium-155.`,
            cost: E("1e5e110"),
            effect() {
                let x = tmp.radiation.bs.eff[14].max(1).log10().add(1)
                return x
            },
            effDesc(x) { return "x"+format(x)+" later" },
        },{
            br: true,
            desc: `Exotic supernova scales 25% weaker.`,
            cost: E("1e1.6e117"),
        },{
            dark: true,
            desc: `[Bottom]’s effect is now better, and is uncapped. Additionally, the Fourth Photon upgrade now provides an exponential boost.`,
            cost: E('e1024'),
        },{
            desc: `Entropic Multiplier is overpowered.`,
            cost: E('e2.6e127'),
        },{
            br: true,
            desc: `Entropic Evaporation^2 and Condenser^2 scale another 15% weaker.`,
            cost: E('e3.1e123'),
        },{
            desc: `Strengthen Unseptoctium-178 slightly.`,
            cost: E('e4.9e130'),
        },{
            dark: true,
            desc: `Final Star Shard's requirement is 20% cheaper.`,
            cost: E('1e1480'),
        },{
            desc: `Unlock the 16th Challenge.`,
            cost: E('e7e134'),
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
            cost: E('e1e20'),
        },{
            inf: true,
            desc: `The softcap of theorem’s level starts +5 later.`,
            cost: E('1e13'),
        },{
            c16: true,
            desc: `Improve the formula of corrupted shard gain better.`,
            cost: E('e1e23'),
        },{
            desc: `The effect of Glory 45 is even stronger.`,
            cost: E('e3e380'),
        },{
            inf: true,
            desc: `Infinity theorem increases parallel extruder’s power. Muon-Catalyzed Fusion no longer resets.`,
            cost: E('1e14'),
            effect() {
                let x = player.inf.theorem.div(20)
                return x
            },
            effDesc(x) { return "+"+format(x,2) },
        },{
            dark: true,
            desc: `Quantum Shard’s base is boosted by FSS.`,
            cost: E('e640000'),
            effect() {
                let x = player.dark.matters.final.div(10).add(1)
                if (hasElement(288)) x = player.dark.matters.final.mul(3).add(1)
                return x
            },
            effDesc(x) { return "^"+format(x,1) },
        },{
            c16: true,
            desc: `Matter exponent boosts matters gain outside C16 (changed during C16).`,
            cost: E('e1e25'),
            effect() {
                let x = Math.log10(tmp.matters.exponent+1)/20
                if (hasElement(24,1)) x = x*(muElemEff(24,1))
                if (tmp.c16active) x *= 5
                return x+1
            },
            effDesc(x) { return "^"+format(x)+(tmp.c16active?'':' to exponent') },
        },{
            desc: `Biniltrium-203 is overpowered.`,
            cost: E('ee448'),
        },
        {
            inf: true,
            desc: `First Core Slot Theorem level will be based on max theorem level on infinity (Only if Theorem Type is Newton).`,
            cost: E('3e16'),
            effect() {
                let x = player.inf.theorem_max.floor()
                return x
            },
            effDesc(x) { return format(x,0)+" Level" },
        },
        {
            dark: true,
            desc: `Maximum beyond ranks tier scales the start of theorem level's softcap.`,
            cost: E('e830000'),
            effect() {
                if (CHALS.inChal(17) || CHALS.inChal(18)) x = E(0)
                else x = tmp.beyond_ranks.max_tier*(hasElement(250)?elemEffect(250):1)
                return x
            },
            effDesc(x) { return "+"+format(x,1)+' later' },
        },
        {
            desc: `[ct16] formula is better.`,
            cost: E('e5e458'),
        },
        {
            c16: true,
            desc: `C16's reward is even more better.`,
            cost: E('e1.5e28'),
        },
        {
            inf: true,
            desc: `Muon-Catalyzed Fusion Tier scales theorem softcap later.`,
            cost: E('2e18'),
            effect() {
                if (CHALS.inChal(17)|| CHALS.inChal(18)) x = E(0)
                else x = player.dark.exotic_atom.tier*(hasElement(266)?2.5:1)
                return x
            },
            effDesc(x) { return "+"+format(x,1)+' later' },
        },
        {
            dark: true,
            desc: `Biunseptium-217 effect is better (20% => <b>30%</b>).`,
            cost: E('e1425000'),
        },
        {
            desc: `Max Theorem's Level boosts Infinity Points.`,
            cost: E('e4e487'),
            effect() {
                let x = player.inf.theorem_max.div(2).add(1).log(1.1).add(1)
                if (hasPrestige(1,950)) x = x.pow(1.25)
                return x
            },
            effDesc(x) { return "x"+format(x,3) },
        },
        {
            inf: true,
            desc: `Set the Pre-Quantum GS to x10000 in C16.`,
            cost: E('5e19'),
        },
        {
            dark: true,
            desc: `Infinity Points boosts Exotic Atoms.`,
            cost: E('e1670000'),
            effect() {
                let x = player.inf.points.add(1).log(1.1).add(1)
                return x
            },
            effDesc(x) { return "x"+format(x,3) },
        },
        {
            desc: `Biunseptium-217 effect is better again (30% => <b>40%</b>).`,
            cost: E('e2e501'),
        },
        {
            c16: true,
            desc: `Dimensional Mass adds free C16 max completions.`,
            cost: E('e1.6e34'),
            effect() {
                let x = player.inf.dim_mass.div(100).add(1).log(10).log(2).add(1)
                if (hasElement(295)) x = player.inf.dim_mass.div(20).log(1.1).add(1)
                return x
            },
            effDesc(x) { return "+"+format(x,3) },
        },
        {
            inf: true,
            desc: `Remove Ultra Pent scaling.`,
            cost: E('1e22'),
        },
        {
            desc: `Boost Dark Rays 4th effect by Infinity Points.`,
            cost: E('e1e640'),
            effect() {
                let x = player.inf.points.add(1).log10().add(1).log(2).div(10).add(1)
                return x
            },
            effDesc(x) { return "x"+format(x,3) },
        },
        {
            dark: true,
            desc: `Add 5 C16 max completions per Muon-Catalyzed Fusion Tier (starts at 12).`,
            cost: E('e4230000'),
            effect() {
                let x = (player.dark.exotic_atom.tier-12)*5
                return x
            },
            effDesc(x) { return "+"+format(x,0) },
        },
        {
            desc: `Dark Ray's 1st effect is better by Corrupted Shards.`,
            cost: E('e5e710'),
            effect() {
                let x = player.dark.c16.shard.max(1).root(0.1).add(1)
                return x
            },
            effDesc(x) { return "x"+format(x,3) },
        },
        {
            c16: true,
            desc: `Dimensional Mass adds primordium particles.`,
            cost: E('e1e37'),
            effect() {
                if (CHALS.inChal(17)|| CHALS.inChal(18)) x = E(0)
                else x = player.inf.dim_mass.root(2.25).add(1)
                return x
            },
            effDesc(x) { return "+"+format(x,3) },
        },
        {
            inf: true,
            desc: `Passively generate 100% of corrupted shards gained by best mass of black hole in C16.`,
            cost: E('1e24'),
        },
        {
            dark: true,
            desc: `Add more C16 max completions per maximum beyond ranks.`,
            cost: E('e6000000'),
            effect() {
                let x = tmp.beyond_ranks.max_tier*10
                return x
            },
            effDesc(x) { return "+"+format(x,1) },
        },
        {
            desc: `Infinity Points scales mass overflow and overflow^2 (works only outside of C16).`,
            cost: E('e1e736'),
            effect() {
                if (CHALS.inChal(17)|| CHALS.inChal(18)) x = E(1)
                else x = player.inf.points.max(1).root(0.25).add(1)
                return x
            },
            effDesc(x) { return "^"+format(x,3) },
        },
        {
            c16: true,
            desc: `Muonic Vanadium is better.`,
            cost: E('e3e37'),
        },
        {
            inf: true,
            desc: `Second and Third Core Slot Theorem level will be based on max theorem level on infinity (Only if Theorem Type is 2nd: Protoversal,3rd:Einstein).`,
            cost: E('7e25'),
            effect() {
                let x = player.inf.theorem_max.floor()
                return x
            },
            effDesc(x) { return format(x,0)+" Level" },
        },
        {
            dark: true,
            desc: `Bitrinilium-230 effect is better based on Infinity Points.`,
            cost: E('e7990000'),
            effect() {
                let x = player.inf.points.max(1).root(10).add(1).log10().div(3).add(1)
                return x
            },
            effDesc(x) { return "x"+format(x,3) },
        },
        {
            c16: true,
            desc: `Add 1000 C16 max completions.`,
            cost: E('e1e38'),
        },
        {
            desc: `Scale Super Parallel Extruder later by Max Theorem's level.`,
            cost: E('e1e743'),
            effect() {
                let x = player.inf.theorem_max.max(1).root(1.25).add(1).floor()
                return x
            },
            effDesc(x) { return "+"+format(x,0)+' later' },
        },
        {
            inf: true,
            desc: `Unlock Modificators.`,
            cost: E('3e26'),
        },
        {
            desc: `Mass overflow^3 starts later based on Newton Fragments (outside of C16).`,
            effect() {
                if (CHALS.inChal(17)|| CHALS.inChal(18)) x = E(1)
                else x = player.inf.nm_base.max(1).root(.65).add(1).floor()
                x = x.softcap(hasElement(269)?1e300:1e30,0.01,0)
x = overflow(x,1e180,0.1)
                return x
            },
            effDesc(x) { return "^"+format(x,0)+` later.${elemEffect(254).gte(hasElement(269)?1e300:1e30)?` <span class='soft'>(softcapped)</span>`:``}`},
            cost: E('e1e781'),
        },
        {
            dark: true,
            desc: `Unlock Valor.`,
            cost: E('e9600000'),
        },
        {
            inf: true,
            desc: `Unlock Protoversal Modificator.`,
            cost: E('2e27'),
        },
        {
            desc: `Biquadseptuim-247 applies to BH mass overflow^3.`,
            cost: E('e3e783'),
        },
        {
            dark: true,
            desc: `Mass overflow^3 starts later based on Protoversal Fragments (outside of C16).`,
            effect() {
                if (CHALS.inChal(17)|| CHALS.inChal(18)) x = E(1)
                else x = player.inf.pm_base.max(1).root(0.55).add(1).floor()
                x = x.softcap(hasElement(269)?1e300:1e22,0.01,0)
                return x
            },
            effDesc(x) { return "^"+format(x,0)+` later.${elemEffect(254).gte(hasElement(269)?1e300:1e22)?` <span class='soft'>(softcapped)</span>`:``}` },
            cost: E('e9650000'),
        },
        {
            c16: true,
            desc: `Add 1000000 C15 max completions.`,
            cost: E('e1e48'),
        },
        {
            inf: true,
            desc: `Remove the softcap of 7th Abyssal Blot effect.<br>Also, Fourth and Fifth Core Slot Theorem level will be based on max theorem level on infinity (Only if Theorem Type is 4th: Dalton,5th:Hawking)`,
            cost: E('1e28'),
        },
        {
            inf: true,
            desc: `Unlock Dalton Modificator.`,
            cost: E('2e30'),
        },
        {
            desc: `Unseptseptium-177 formula is better .`,
            cost: E('e1e864'),
        },
        {
            c16: true,
            desc: `Infinity Points boosts mass overflow^3 in C16.`,
            effect() {
                if (CHALS.inChal(17)|| CHALS.inChal(18)) x = E(1)
                else x = player.inf.points.add(1).log(1.1).pow(2).add(1).floor()
                return x
            },
            effDesc(x) { return "^"+format(x,0)+' later' },
            cost: E('e1e51'),
        },
        {
            dark: true,
            desc: `Remove [Renown 6] softcap and raise its efffect by ^1.5.`,
            cost: E('e10835000'),
        },
        {
            inf: true,
            desc: `Unlock Challenge 17.`,
            cost: E('7e30'),
        },
        {
            c16: true,
            desc: `Bitritrium-233 is better.`,
            cost: E('e5e52'),
        },
        {
            desc: `C15 reward is better.`,
            cost: E('e5e875'),
        },
        {
            dark: true,
            desc: `Unlock Anti-Matters.`,
            cost: E('e11500000'),
        },
        {
            inf: true,
            desc: `Remove 258 and 254th effects softcaps.`,
            cost: E('1e32'),
        },
        {
            dark: true,
            desc: `Dalton Modificator softcap starts ^2 later.`,
            cost: E('e13550000'),
        },
        {
            desc: `Dalton Modificator's effect is better.`,
            cost: E('e1e938'),
        },
        {
            inf: true,
            desc: `Add +0.3 to Newton Modificator's effect softcap.`,
            cost: E('1e34'),
        },
        {
            dark: true,
            desc: `Keep Antimatter on Infinity Reset.`,
            cost: E('e17000000'),
        },
{
desc: 'Mass Overflow^1-3 is 5% weaker.',
cost: E('ee1290'),
},
{
    inf: true,
    desc: 'Unlock 5th dot to every Theorem.',
    cost: E(5e36),
    },
    {
    desc: 'W+ Boson first effect will now be exponential',
    cost: E('ee1425'),
    },
    {
        dark: true,
        desc: `Uncap [Charm] effect.`,
        cost: E('e47000000'),
    },
    {
        c16: true,
        desc: `Muonic Copper-29 is better.`,
        cost: E('e2.15e74'),
    },
    {
        inf: true,
        desc: 'Add 1000 C17 max completions.',
        cost: E(2e39),
        },
        {
            c16: true,
            desc: `[Meta-Lepton] reward effect is better based on Infinity Points.<br>Reduce Meta-Prestige Level power based on Infinity Points.`,
            effect() {let x = E(1)
            x = player.inf.points.add(1).log10().log2().add(1)
            let ret = E(1)
            ret = Decimal.pow(0.35,player.inf.points.max(1).log10().log10())
        return {eff: x, ret: ret}},
        effDesc(x) { return "x"+format(x.eff,3)+" to [Meta-Lepton] effect. <br> " + formatReduction(1-x.ret) + " weaker" },
            cost: E('e3.5e75'),
        },
        {
            dark: true,
            desc: `Unlock <span class='ascend_text_no_anim'>Ascensions</span>.<br>Keep Valor 2 reward on infinity reset.`,
            cost: E('e64500000'),
        },
        {
            desc: 'Unlock Exotic Fermions.',
            cost: E('ee1812'),
            },
            {
                inf: true,
                desc: 'Unlock 6th dots for Theorems.',
                cost: E(3e40),
         },
         {
            desc: 'Muonized effects are even better.',
            cost: E('ee2600'),
    },
    {
        dark: true,
        desc: `Softcap of [Top] will start at 3.00x`,
        cost: E('e173000000'),
    },
    {
        inf: true,
        desc: 'Binilennium-209 is overpowered.',
        cost: E(6e40),
 },
 {
    dark: true,
    desc: `FSS's first reward in C16 is slightly stronger.`,
    cost: E('e212000000'),
},
{
    desc: 'Bibihexium-226 is slightly better.',
    cost: E('ee3050'),
    },
    {
        c16: true,
        desc: `Stronger overflow^1-2 starts later by Bipentquadium-254.`,
        effect() {
            x = E(elemEffect(254)).pow(1.15).max(1)
            return x
        },
        effDesc(x) { return "^"+format(x,0)+' later' },
        cost: E('e6e119'),
    },
    {
        inf: true,
        desc: 'Chromas gain are slightly better<br>Mass Overflow^4 starts slightly more later.',
        cost: E(1e41),
 },
 {
    dark: true,
    desc: `[Meta-Lepton] effect is even better.`,
    cost: E('e246000000'),
},
{
    desc: 'Xenon-54 now provides an exponential boost.',
    cost: E('ee4050'),
    },
    {
        c16: true,
        desc: `Impossible Challenge scaling is weaker based on Ascension Base.`,
        effect() {
            x = Decimal.pow(0.75,tmp.ascensions.base.add(1).log10().root(10))
            return x
        },
        effDesc(x) { return formatReduction(x)+' weaker' },
        cost: E('e1e158'),
    },
    {
        inf: true,
        desc: 'Unlock Beyond-Prestiges.',
        cost: E(1e43),
 },
 {
    c16: true,
    desc: `Automatically complete C16 and C17 challenges outside of them.<br>Bitriennium-239 effect formula is much more better.`,
    cost: E('e1e159'),
},
{
    desc: 'Einstein Theorem is better.',
    cost: E('ee5450'),
    },
    {
        sn: true,
        desc: 'Unlock Galaxies.',
        cost: E('7.5e15'),
        },
        {
            dark: true,
            desc: `Unseptennium-179 is even better (Per Prestige Level - 1.25x => <b>Per log3(Hex) - 1.25x</b>).`,
            cost: E('e590000000'),
        },
        {
            c16: true,
            desc: `Galaxy Particles gain formula is better..`,
            cost: E('e1e165'),
        },
    ],
    /*
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
        let u = 4

        if (tmp.inf_unl) u = 218
        else {
            if (player.dark.unl) u = 118+14
            else {
                if (quUnl()) u = 77+3
                else {
                    if (player.supernova.times.gte(1)) u = 49+5
                    else {
                        if (player.chal.comps[8].gte(1)) u += 14
                        if (hasElement(18)) u += 3
                        if (MASS_DILATION.unlocked()) u += 15
                        if (STARS.unlocked()) u += 18
                    }
                    if (player.supernova.post_10) u += 3
                    if (player.supernova.fermions.unl) u += 10
                    if (tmp.radiation.unl) u += 10
                }
                if (PRIM.unl()) u += 3
                if (hasTree('unl3')) u += 3
                if (player.qu.rip.first) u += 9
                if (hasUpgrade("br",9)) u += 23 // 23
            }
            if (tmp.chal13comp) u += 10 + 2
            if (tmp.chal14comp) u += 6 + 11
            if (tmp.chal15comp) u += 16 + 4
            if (tmp.darkRunUnlocked) u += 7
            if (tmp.matterUnl) u += 14
            if (tmp.mass4Unl) u += 6
            if (tmp.brUnl) u += 10
        }

        if (tmp.brokenInf) u += 35
        if (hasElement(253)) u += 16
        if (hasElement(269)) u += 23
        if (hasElement(292)) u += 15
        return u
    },
}

const MAX_ELEM_TIERS = 3
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
const SN_ELEM = (()=>{
    let x = []
    for (let i in ELEMENTS.upgs) if (i>0&&ELEMENTS.upgs[i].sn) x.push(Number(i))
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
const OVERFLOWED_ELEMENTS = [222,230,233,245,247,254,258] // 40,64,67,150,199,200,204
function isElemCorrupted(x,layer=0) { return layer == 0 && !tmp.elements.deCorrupt.includes(x) && CORRUPTED_ELEMENTS.includes(x) }
function isElemOverflowed(x,layer=0) { return layer == 0 && OVERFLOWED_ELEMENTS.includes(x) }
function hasElement(x,layer=0) { return player.atom[["elements","muonic_el"][layer]].includes(x) && !(tmp.c16active && isElemCorrupted(x)) && !(CHALS.inChal(17) && isElemOverflowed(x)) }

function elemEffect(x,def=1) { return tmp.elements.effect[x]||def }

function buyElement(x,layer=player.atom.elemLayer) {
    if (layer == 0) ELEMENTS.buyUpg(x)
    else if (layer == 1) MUONIC_ELEM.buyUpg(x)
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
                    //console.log(num,p)
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
}

function updateElementsHTML() {
    let tElem = tmp.elements, c16 = tmp.c16active,c17 = CHALS.inChal(17),c18 = CHALS.inChal(18)
    let et = player.atom.elemTier, elayer = player.atom.elemLayer

    tmp.el.elemLayer.setDisplay(tmp.eaUnl)
    tmp.el.elemLayer.setHTML("Elements' Layer: "+["Normal","Muonic"][elayer])

    tmp.el.elemTierDiv.setDisplay(tElem.max_tier[elayer]>1)

    let elem_const = [ELEMENTS,MUONIC_ELEM][elayer]

    let ch = tElem.choosed
    tmp.el.elem_ch_div.setVisible(ch>0)
    if (ch) {
        let eu = elem_const.upgs[ch]
        let res = [eu.sn? " Supernovas" :eu.inf?" Infinity Points":eu.dark?" Dark Shadows":" Quarks",eu.cs?" Corrupted Shards":" Exotic Atoms"][elayer]
        let eff = tElem[["effect","mu_effect"][elayer]]

        tmp.el.elem_desc.setHTML("<b>["+["","Muonic "][elayer]+ELEMENTS.fullNames[ch]+"]</b> "+eu.desc)
        tmp.el.elem_desc.setClasses({sky: true, corrupted_text2: c16 && isElemCorrupted(ch,elayer),overflowed_text: c17 && isElemOverflowed(ch,elayer)})
        tmp.el.elem_cost.setTxt(format(eu.cost,0)+res+(eu.c16?" in Challenge 16":BR_ELEM.includes(ch)?" in Big Rip":"")+(player.qu.rip.active&&tElem.cannot.includes(ch)?" [CANNOT AFFORD in Big Rip]":""))
        tmp.el.elem_eff.setHTML(eu.effDesc?"Currently: "+eu.effDesc(eff[ch]):"")
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

            let len = t > 1 ? tElem.te : tElem.upg_length

            for (let x = tElem.ts+1; x <= len; x++) {
                let upg = tmp.el['elementID_'+x]
                if (upg) {
                    let unl2 = x <= unllen
                    upg.setVisible(unl2)
                    if (unl2) {
                        let eu = elem_const.upgs[x]
                        let u = MUONIC_ELEM.upgs[x]
                       if ((c16 || c18) && isElemCorrupted(x,elayer)) upg.setClasses({elements: true, locked: true, corrupted: true})
                          else if ((c17 || c18) && isElemOverflowed(x,elayer))upg.setClasses({elements: true, locked: true,overflowed: true})
                          else upg.setClasses({elements: true, locked: !elem_const.canBuy(x), bought: hasElement(x,elayer), muon: elayer == 1, cs: elayer == 1&& u.cs, br: elayer == 0 && BR_ELEM.includes(x), final: elayer == 0 && x == 118, dark: elayer == 0 && eu.dark, c16: elayer == 0 && eu.c16, inf: elayer == 0 && eu.inf,sn: elayer == 0 && SN_ELEM.includes(x)})
                        
                    }
                }
            }
        }

        tmp.el["elemTier_btn"+t].setDisplay(t <= tElem.max_tier[elayer])
    }
}

function updateElementsTemp() {
    let tElem = tmp.elements
    let et = player.atom.elemTier, elayer = player.atom.elemLayer

    tElem.ts = ELEMENTS.exp[et[elayer]-1]
    tElem.te = ELEMENTS.exp[et[elayer]]
    tElem.tt = tElem.te - tElem.ts

    let decor = []
    if (hasElement(10,1)) decor.push(187)
    if (hasCharger(9)) decor.push(40,64,67,150,199,200,204)
    tElem.deCorrupt = decor

    let cannot = []
    if (player.qu.rip.active) {
        if (!hasElement(121)) cannot.push(58)
        if (!hasElement(126)) cannot.push(74)
    }
    tElem.cannot = cannot

    if (!tElem.upg_length) tElem.upg_length = ELEMENTS.upgs.length-1
    for (let x = tElem.upg_length; x >= 1; x--) if (ELEMENTS.upgs[x].effect) {
        tElem.effect[x] = ELEMENTS.upgs[x].effect()
    }

    tElem.unl_length = [ELEMENTS.getUnlLength(),MUONIC_ELEM.getUnlLength()]

    tElem.max_tier = [1,1]
    if (player.dark.unl) tElem.max_tier[0]++
    if (tmp.brokenInf) tElem.max_tier[0]++
}
