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
        'Lu','Hf','Ta','W','Re','Os','Ir','Pt','At','Hg',
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
        'Lutetium','Hafnium','Titanium','Tungsten','Rhenium','Osmium','Iridium','Platinum','Gold','Mercury',
        'Thallium','Lead','Bismuth','Polonium','Astatine','Radon','Francium','Radium','Actinium','Thorium',
        'Protactinium','Uranium','Neptunium','Plutonium','Americium','Curium','Berkelium','Californium','Einsteinium','Fermium',
        'Mendelevium','Nobelium','Lawrencium','Ruthefordium','Dubnium','Seaborgium','Bohrium','Hassium','Meitnerium','Darmstadium',
        'Roeritgenium','Copernicium','Nihonium','Flerovium','Moscovium','Livermorium','Tennessine','Oganesson'
    ],
    canBuy(x) { return player.atom.quarks.gte(this.upgs[x].cost) && !player.atom.elements.includes(x) },
    buyUpg(x) {
        if (this.canBuy(x)) {
            player.atom.quarks = player.atom.quarks.sub(this.upgs[x].cost)
            player.atom.elements.push(x)
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
            desc: `Stronger’s power is stronger based on Proton Powers.`,
            cost: E(2.5e16),
            effect() {
                let x = player.atom?player.atom.powers[0].max(1).log10().pow(0.8).div(50).add(1):E(1)
                return x
            },
            effDesc(x) { return format(x)+"x stronger" },
        },
        {
            desc: `The 7th challenge’s effect is twice as effective.`,
            cost: E(1e18),
        },
        {
            desc: `Gain 1% more quarks for each challenge completion.`,
            cost: E(5e18),
            effect() {
                let x = E(0)
                for (let i = 1; i <= CHALS.cols; i++) x = x.add(player.chal.comps[i].mul(i>4?2:1))
                if (player.atom.elements.includes(7)) x = x.mul(tmp.elements.effect[7])
                return x.div(100).add(1).max(1)
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Carbon’s effect is now multiplied by the number of elements bought.`,
            cost: E(1e20),
            effect() {
                let x = E(player.atom.elements.length+1)
                if (player.atom.elements.includes(11)) x = x.pow(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `C2’s reward’s softcap is 75% weaker.`,
            cost: E(1e21),
        },
        {
            desc: `The Tetr requirement is 15% weaker.`,
            cost: E(6.5e21),
        },
        {
            desc: `3rd & 4th challenges’ scaling is weakened.`,
            cost: E(1e24),
        },
        {
            desc: `Nitrogen’s multiplier is squared.`,
            cost: E(1e27),
        },
        {
            desc: `Power’s gain from each particle formula is better.`,
            cost: E(1e29),
        },
        {
            desc: `For every c7 completion, add 2 c5 & 6 completion.`,
            cost: E(2.5e30),
            effect() {
                let x = player.chal.comps[7].mul(2)
                return x
            },
            effDesc(x) { return "+"+format(x) },
        },
        {
            desc: `Passively gain 5% of the quarks you would get from resetting each second.`,
            cost: E(1e33),
        },
        {
            desc: `Super BH Condenser & Gamma Ray scales 20% weaker.`,
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
            desc: `Raise Atom’s gain by 1.1.`,
            cost: E(1e40),
        },
        {
            desc: `You can now automatically buy gamma rays. Gamma ray raise tickspeed effect at an extremely reduced rate.`,
            cost: E(1e44),
            effect() {
                let x = player.atom.gamma_ray.pow(0.35).mul(0.01).add(1)
                return x
            },
            effDesc(x) { return "^"+format(x) },
        },
        {
            desc: `2nd Neutron’s effect is better.`,
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
                let x = player.atom.atomic.max(1).log10().add(1).pow(0.4)
                return x
            },
            effDesc(x) { return format(x)+"x" },
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
            desc: `Gamma ray's free tickspeeds now adds to RU7.`,
            cost: E(1e260),
            effect() {
                let x = tmp.atom?tmp.atom.atomicEff:E(0)
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
            desc: `Collapsed star’s effect boost mass gain from the black hole at a reduced rate.`,
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
            desc: `Hyper/Ultra BH Condenser & Gamma Ray scale 25% weaker.`,
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
                let x = tmp.tickspeedEffect?tmp.tickspeedEffect.step.max(1).log10().div(10):E(0)
                return x
            },
            effDesc(x) { return "+"+format(x)+"x" },
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
            desc: `The power from the mass of the BH formula is increased to 0.5.`,
            cost: E('e6.6e4'),
        },
        {
            desc: `Add 100 more C7 maximum completions.`,
            cost: E('e7.7e4'),
        },
    ],
    /*
    {
        desc: `Placeholder.`,
        cost: E(1/0),
        effect() {
            let x = E(1)
            return x
        },
        effDesc(x) { return format(x)+"x" },
    },
    */
    getUnlLength() {
        let u = 4
        if (player.chal.comps[8].gte(1)) u += 14
        if (player.atom.elements.includes(18)) u += 3
        if (MASS_DILATION.unlocked()) u += 15
        if (STARS.unlocked()) u += 18
        if (player.supernova.times.gte(1)) u = 49+5
        if (player.supernova.post_10) u += 3
        if (player.supernova.fermions.unl) u += 3
        return u
    },
}

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
            :`<button class="elements" id="elementID_${num}" onclick="ELEMENTS.buyUpg(${num})" onmouseover="tmp.elements.choosed = ${num}" onmouseleave="tmp.elements.choosed = 0"><div style="font-size: 12px;">${num}</div>${ELEMENTS.names[num]}</button>`
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
        tmp.el.elem_desc.setTxt("["+ELEMENTS.fullNames[ch]+"] "+ELEMENTS.upgs[ch].desc)
        tmp.el.elem_cost.setTxt(format(ELEMENTS.upgs[ch].cost,0))
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
                upg.setClasses({elements: true, locked: !ELEMENTS.canBuy(x), bought: player.atom.elements.includes(x)})
            }
        }
    }
}

function updateElementsTemp() {
    if (!tmp.elements) tmp.elements = {
        upg_length: ELEMENTS.upgs.length-1,
        choosed: 0,
    }
    if (!tmp.elements.effect) tmp.elements.effect = [null]
    for (let x = 1; x <= tmp.elements.upg_length; x++) if (ELEMENTS.upgs[x].effect) {
        tmp.elements.effect[x] = ELEMENTS.upgs[x].effect()
    }
    tmp.elements.unl_length = ELEMENTS.getUnlLength()
}