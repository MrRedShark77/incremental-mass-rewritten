const ELEMENTS = {
    map: `x_________________xvxx___________xxxxxxvxx___________xxxxxxvxxx_xxxxxxxxxxxxxxxvxxx_xxxxxxxxxxxxxxxvxxx1xxxxxxxxxxxxxxxvxxx2xxxxxxxxxxxxxxxv_v___3xxxxxxxxxxxxxx_v___4xxxxxxxxxxxxxx_`,
    la: [null,'*','**','*','**'],
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
        'Ti','Pb','Bi','Po','At','Rn','Fr','Ra','Ac','Th',
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
        'Mendelevium','Nobelium','Lawrencium','Ruthefordium','Dubnium','Seaborgium','Bohrium','Hassium','Meitnerium','Darmstadium',
        'Roeritgenium','Copernicium','Nihonium','Flerovium','Moscovium','Livermorium','Tennessine','Oganesson'
    ],
    canBuy(x) { return player.atom.quarks.gte(this.upgs[x].cost) && !hasElement(x) && (player.qu.rip.active ? true : x <= 86) && !tmp.elements.cannot.includes(x) },
    buyUpg(x) {
        if (this.canBuy(x)) {
            if (x == 118) {
                alert("Coming Soon.....")
            } else {
                player.atom.quarks = player.atom.quarks.sub(this.upgs[x].cost)
                player.atom.elements.push(x)
            }
        }
    },
    upgs: [
        null,
        {
            desc: `Improves quark gain formula is better.`,
            cost: E(5e8),
        },
        {
            desc: `Hardened Challenge scale 25% weaker.`,
            cost: E(2.5e12),
        },
        {
            desc: `Electron Power boost Atomic Powers gain.`,
            cost: E(1e15),
            effect() {
                let x = player.atom?player.atom.powers[2].add(1).root(2):E(1)
                if (x.gte('e1e4')) x = expMult(x.div('e1e4'),0.9).mul('e1e4')
                return x
            },
            effDesc(x) { return format(x)+"x"+(x.gte('e1e4')?" <span class='soft'>(softcapped)</span>":"") },
        },
        {
            desc: `Stronger's power is stronger based on Proton Powers.`,
            cost: E(2.5e16),
            effect() {
                let x = player.atom?player.atom.powers[0].max(1).log10().pow(0.8).div(50).add(1):E(1)
                return x
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
            desc: `The Tetr requirement is 15% weaker.`,
            cost: E(6.5e21),
        },
        {
            desc: `3rd & 4th challenges' scaling is weakened.`,
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
            desc: `For every c7 completion, add 2 c5 & 6 completion.`,
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
            desc: `Super BH Condenser & Cosmic Ray scales 20% weaker.`,
            cost: E(1e34),
        },
        {
            desc: `Silicon now gets +2% for each element bought.`,
            cost: E(5e38),
            effect() {
                let x = player.atom.elements.length*0.02
                return Number(x)
            },
            effDesc(x) { return "+"+format(x*100)+"%" },
        },
        {
            desc: `Raise Atom's gain by 1.1.`,
            cost: E(1e40),
        },
        {
            desc: `You can now automatically buy Cosmic Rays. Cosmic Ray raise tickspeed effect at an extremely reduced rate.`,
            cost: E(1e44),
            effect() {
                let x = player.atom.gamma_ray.pow(0.35).mul(0.01).add(1)
                return x
            },
            effDesc(x) { return "^"+format(x) },
        },
        {
            desc: `2nd Neutron's effect is better.`,
            cost: E(1e50),
        },
        {
            desc: `Adds 50 more C7 maximum completions.`,
            cost: E(1e53),
        },
        {
            desc: `Unlock Mass Dilation.`,
            cost: E(1e56),
        },
        {
            desc: `Dilated mass gain is affected by tickspeed at a reduced rate.`,
            cost: E(1e61),
            effect() {
                let x = E(1.25).pow(player.tickspeed.pow(0.55))
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `The Atomic Power effect is better.`,
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
            desc: `Adds 1 base of Mass Dilation upgrade 1 effect.`,
            cost: E(1e80),
        },
        {
            desc: `Hardened Challenge scaling weaker for each element bought.`,
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
            desc: `Mass gain is raised to the power of 1.5th if you dilated mass.`,
            cost: E(1e97),
        },
        {
            desc: `Proton powers effect is better.`,
            cost: E(1e100),
        },
        {
            desc: `Electron powers effect is better. Passively gain 10% of each particle you would assign quarks.`,
            cost: E(1e107),
        },
        {
            desc: `Dilated mass boost Relativistic particles gain.`,
            cost: E(1e130),
            effect() {
                let x = player.md.mass.add(1).pow(0.0125)
                return x
            },
            effDesc(x) { return format(x)+"x" },
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
            desc: `Rage power boost Relativistic particles gain.`,
            cost: E(1e175),
            effect() {
                let x = player.rp.points.max(1).log10().add(1).pow(0.75)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Mass from Black Hole boost dilated mass gain.`,
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
            desc: `Super Tier scale weaker based on Tetr.`,
            cost: E(1e245),
            effect() {
                let x = E(0.9).pow(player.ranks.tetr.softcap(6,0.5,0))
                return x
            },
            effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
        },
        {
            desc: `Cosmic Ray's free tickspeeds now adds to RU7.`,
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
            desc: `Collapsed star boost dilated mass gain.`,
            cost: E(1e303),
            effect() {
                let x = player.stars.points.add(1).pow(0.5)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Add 50 more C7 maximum completions.`,
            cost: E('e315'),
        },
        {
            desc: `Collapsed star boost quark gain.`,
            cost: E('e325'),
            effect() {
                let x = player.stars.points.add(1).pow(1/3)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `You can now automatically buy mass dilation upgrades if you purchased any first. They no longer spent dilated mass.`,
            cost: E('e360'),
        },
        {
            desc: `The Tetr requirement is broken.`,
            cost: E('e380'),
        },
        {
            desc: `Collapsed star boost relativistic particles gain.`,
            cost: E('e420'),
            effect() {
                let x = player.stars.points.add(1).pow(0.15).min(1e20)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Collapsed star's effect boost mass gain from the black hole at a reduced rate.`,
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
            desc: `Collapsed star boost last type of stars.`,
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
            desc: `Mass of black hole boost atomic powers gain at a reduced rate.`,
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
            desc: `Collapsed stars boost all-star resources at a reduced rate.`,
            cost: E('e5200'),
            effect() {
                let x = player.mass.max(1).log10().root(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
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
            desc: `Tickspeed power boost base from Star Booster at a reduced rate.`,
            cost: E('e3.6e4'),
            effect() {
                let x = tmp.tickspeedEffect?tmp.tickspeedEffect.step.max(1).log10().div(10).max(1):E(1)
                if (hasElement(66)) x = x.pow(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Ultra Rank & Tickspeed scales weaker based on Tier.`,
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
            desc: `Ultra Rank scale 3 later for every Supernova.`,
            cost: E('e2.5e5'),
            effect() {
                let x = player.supernova.times.mul(3)
                return x
            },
            effDesc(x) { return format(x,0)+" later" },
        },
        {
            desc: `Non-bonus Tickspeed is 25x effective.`,
            cost: E('e3e5'),
        },
        {
            desc: `Rewards from Challenges 3-4 & 8 are 50% effective.`,
            cost: E('e5e5'),
        },
        {
            desc: `Add 200 more C7 & c8 maximum completions.`,
            cost: E('e8e5'),
        },
        {
            desc: `Lanthanum's effect is twice stronger.`,
            cost: E('e1.1e6'),
        },
        {
            desc: `Collapsed star boost quarks gain.`,
            cost: E('e1.7e6'),
            effect() {
                let x = player.stars.points.add(1)
                return x.softcap('e3e15',0.85,2)
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Meta-Tickspeed start 2x later.`,
            cost: E('e4.8e6'),
        },
        {
            desc: `Pent is now added in mass gain formula from collapsed stars.`,
            cost: E('e3.6e7'),
        },
        {
            desc: `Add 200 more C7 & c8 maximum completions.`,
            cost: E('e6.9e7'),
        },
        {
            desc: `From BH the formulas softcap starts later based on Supernovas.`,
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
            desc: `Softcap^3 from mass gain is 17.5% weaker.`,
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
            desc: `Strontium-38 is thrice effective.`,
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
            desc: `Stronger’s Power softcap starts 3x later, is 10% weaker.`,
            cost: E('e7.5e15'),
        },
        {
            desc: `Tickspeed’s Power softcap starts ^2 later, scales 50% weaker.`,
            cost: E('e2e16'),
        },
        {
            desc: `Carbon-6’s effect is overpowered, but Sodium-11 don’t work.`,
            cost: E('e150'),
        },
        {
            desc: `All scaling from Tickspeed start 100x later (after nerf from 8th QC modifier).`,
            cost: E('e500'),
        },
        {
            desc: `Mass of Black Hole effect raises itself at a reduced logarithm rate.`,
            cost: E('e1100'),
            effect() {
                let x = player.bh.mass.add(1).log10().add(1).log10().mul(1.25).add(1).pow(player.qu.rip.active?2:0.4)
                return x
            },
            effDesc(x) { return "^"+x.format() },
        },
        {
            desc: `Death Shard is boosted by Dilated Mass.`,
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
            desc: `Death Shard is increased by 10% for every supernova.`,
            cost: E("e32000"),
            effect() {
                let x = E(1.1).pow(player.supernova.times)
                return x
            },
            effDesc(x) { return "x"+x.format() },
        },
        {
            desc: `Epsilon Particles are worked in Big Rip, but 90% weaker.`,
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
            desc: `Remove softcap^3 from Photon Upgrade 3 effect, its softcap^2 is weaker.`,
            cost: E('e2.15e7'),
        },
        {
            desc: `Prestige Base’s exponent is increased based on Pent.`,
            cost: E('e2.5e7'),
            effect() {
                let x = player.ranks.pent.root(2).div(1e3).toNumber()
                return x
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
            desc: `Pre-Quantum Global Speed is effective based on Honor.`,
            cost: E('e5e8'),
            effect() {
                let x = E(2).pow(player.prestiges[1])
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
            desc: `Beta Particles are twice effective.`,
            cost: E('e1.45e10'),
        },
        {
            desc: `All scalings from Ranks to Pent scale 10% weaker (only 2% during Big Rip).`,
            cost: E('e1.6e10'),
        },
        {
            desc: `Entropic Multiplier is effective, even in Big Rip.`,
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
            desc: `Mass gain after all softcaps is raised by 10.`,
            cost: E("e5e16"),
        },
        {
            desc: `Enter the <span id="final_118">Portal</span>.`,
            cost: E("e1.7e17"),
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

        return u
    },
}

function hasElement(x) { return player.atom.elements.includes(x) }

function setupElementsHTML() {
    let elements_table = new Element("elements_table")
	let table = "<div class='table_center'>"
    let num = 0
	for (let i = 0; i < ELEMENTS.map.length; i++) {
		let m = ELEMENTS.map[i]
        if (m=='v') table += '</div><div class="table_center">'
        else if (m=='_' || !isNaN(Number(m))) table += `<div ${ELEMENTS.la[m]!==undefined?`id='element_la_${m}'`:""} style="width: 50px; height: 50px">${ELEMENTS.la[m]!==undefined?"<br>"+ELEMENTS.la[m]:""}</div>`
        else if (m=='x') {
            num++
            table += ELEMENTS.upgs[num]===undefined?`<div style="width: 50px; height: 50px"></div>`
            :`<button class="elements ${num == 118 ? 'final' : ''}" id="elementID_${num}" onclick="ELEMENTS.buyUpg(${num}); ssf[0]('${ELEMENTS.names[num]}')" onmouseover="tmp.elements.choosed = ${num}" onmouseleave="tmp.elements.choosed = 0"><div style="font-size: 12px;">${num}</div>${ELEMENTS.names[num]}</button>`
            if (num==57 || num==89) num += 14
            else if (num==71) num += 18
            else if (num==118) num = 57
        }
	}
    table += "</div>"
	elements_table.setHTML(table)
}

function updateElementsHTML() {
    let ch = tmp.elements.choosed
    tmp.el.elem_ch_div.setVisible(ch>0)
    if (ch) {
        tmp.el.elem_desc.setHTML("<b>["+ELEMENTS.fullNames[ch]+"]</b> "+ELEMENTS.upgs[ch].desc)
        tmp.el.elem_cost.setTxt(format(ELEMENTS.upgs[ch].cost,0)+" Quarks"+(ch>86?" in Big Rip":"")+(player.qu.rip.active&&tmp.elements.cannot.includes(ch)?" [CANNOT AFFORD in Big Rip]":""))
        tmp.el.elem_eff.setHTML(ELEMENTS.upgs[ch].effDesc?"Currently: "+ELEMENTS.upgs[ch].effDesc(tmp.elements.effect[ch]):"")
    }
    tmp.el.element_la_1.setVisible(tmp.elements.unl_length>57)
    tmp.el.element_la_3.setVisible(tmp.elements.unl_length>57)
    tmp.el.element_la_2.setVisible(tmp.elements.unl_length>88)
    tmp.el.element_la_4.setVisible(tmp.elements.unl_length>88)
    for (let x = 1; x <= tmp.elements.upg_length; x++) {
        let upg = tmp.el['elementID_'+x]
        if (upg) {
            upg.setVisible(x <= tmp.elements.unl_length)
            if (x <= tmp.elements.unl_length) {
                upg.setClasses({elements: true, locked: !ELEMENTS.canBuy(x), bought: hasElement(x), br: x > 86 && x < 118, final: x == 118})
            }
        }
    }
}

function updateElementsTemp() {
    let cannot = []
    if (player.qu.rip.active) cannot.push(58,74)
    tmp.elements.cannot = cannot

    if (!tmp.elements.upg_length) tmp.elements.upg_length = ELEMENTS.upgs.length-1
    for (let x = tmp.elements.upg_length; x >= 1; x--) if (ELEMENTS.upgs[x].effect) {
        tmp.elements.effect[x] = ELEMENTS.upgs[x].effect()
    }
    tmp.elements.unl_length = ELEMENTS.getUnlLength()
}