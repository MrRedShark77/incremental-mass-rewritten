const FERMIONS = {
    onActive(id) { return player.supernova.fermions.choosed == id },
    gain(i) {
        if (!player.supernova.fermions.unl) return E(0)
        let x = E(1)
        if (tmp.radiation.unl) x = x.mul(tmp.radiation.hz_effect)
        for (let j = 0; j < FERMIONS.types[i].length; j++) x = x.mul(E(1.25).pow(player.supernova.fermions.tiers[i][j]))
        if (player.supernova.tree.includes("fn1") && tmp.supernova) x = x.mul(tmp.supernova.tree_eff.fn1)
        return x
    },
    backNormal() {
        if (player.supernova.fermions.choosed != "") {
            player.supernova.fermions.choosed = ""
            SUPERNOVA.reset(false,false,false,true)
        }
    },
    choose(i,x) {
        if (player.confirms.sn) if (!confirm("Are you sure to switch any type of any Fermion?")) return
        let id = i+""+x
        if (player.supernova.fermions.choosed != id) {
            player.supernova.fermions.choosed = id
            SUPERNOVA.reset(false,false,false,true)
        }
    },
    getTierScaling(t, bulk=false) {
        let x = t
        if (bulk) {
            if (x.sub(1).gte(getScalingStart('super',"fTier"))) {
                let start = getScalingStart('super',"fTier")
                let power = getScalingPower('super',"fTier")
                let exp = E(2.5).pow(power)
                x = t.mul(start.pow(exp.sub(1))).root(exp).add(1).floor()
            }
            if (x.sub(1).gte(getScalingStart('hyper',"fTier"))) {
                let start = getScalingStart('super',"fTier")
                let power = getScalingPower('super',"fTier")
                let exp = E(2.5).pow(power)
                let start2 = getScalingStart('hyper',"fTier")
                let power2 = getScalingPower('hyper',"fTier")
                let exp2 = E(4).pow(power2)
                x = t.mul(start.pow(exp.sub(1))).root(exp)
                .mul(start2.pow(exp2.sub(1))).root(exp2).add(1).floor()
            }
            if (x.sub(1).gte(getScalingStart('ultra',"fTier"))) {
                let start = getScalingStart('super',"fTier")
                let power = getScalingPower('super',"fTier")
                let exp = E(2.5).pow(power)
                let start2 = getScalingStart('hyper',"fTier")
                let power2 = getScalingPower('hyper',"fTier")
                let exp2 = E(4).pow(power2)
                let start3 = getScalingStart('ultra',"fTier")
                let power3 = getScalingPower('ultra',"fTier")
                let exp3 = E(6).pow(power3)
                x = t.mul(start.pow(exp.sub(1))).root(exp)
                .mul(start2.pow(exp2.sub(1))).root(exp2)
                .mul(start3.pow(exp3.sub(1))).root(exp3).add(1).floor()
            }
        } else {
            if (t.sub(1).gte(getScalingStart('super',"fTier"))) {
                let start = getScalingStart('super',"fTier")
                let power = getScalingPower('super',"fTier")
                let exp = E(2.5).pow(power)
                x = t.pow(exp).div(start.pow(exp.sub(1))).floor()
            }
            if (t.sub(1).gte(getScalingStart('hyper',"fTier"))) {
                let start = getScalingStart('super',"fTier")
                let power = getScalingPower('super',"fTier")
                let exp = E(2.5).pow(power)
                let start2 = getScalingStart('hyper',"fTier")
                let power2 = getScalingPower('hyper',"fTier")
                let exp2 = E(4).pow(power2)
                x = t.pow(exp2).div(start2.pow(exp2.sub(1)))
                .pow(exp).div(start.pow(exp.sub(1))).floor()
            }
            if (t.sub(1).gte(getScalingStart('ultra',"fTier"))) {
                let start = getScalingStart('super',"fTier")
                let power = getScalingPower('super',"fTier")
                let exp = E(2.5).pow(power)
                let start2 = getScalingStart('hyper',"fTier")
                let power2 = getScalingPower('hyper',"fTier")
                let exp2 = E(4).pow(power2)
                let start3 = getScalingStart('ultra',"fTier")
                let power3 = getScalingPower('ultra',"fTier")
                let exp3 = E(6).pow(power3)
                
                x = t.pow(exp3).div(start3.pow(exp3.sub(1)))
                .pow(exp2).div(start2.pow(exp2.sub(1)))
                .pow(exp).div(start.pow(exp.sub(1))).floor()
            }
        }
        return x
    },
    getUnlLength(x) {
        let u = 2
        if (player.supernova.tree.includes("fn2")) u++
        if (player.supernova.tree.includes("fn6")) u++
        if (player.supernova.tree.includes("fn7")) u++
        if (player.supernova.tree.includes("fn8")) u++
        return u
    },
    names: ['quark', 'lepton'],
    sub_names: [["Up","Down","Charm","Strange","Top","Bottom"],["Electron","Muon","Tau","Neutrion","Neut-Muon","Neut-Tau"]],
    types: [
        [
            {
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e50').pow(t.pow(1.25)).mul("e800")
                },
                calcTier() {
                    let res = player.atom.atomic
                    if (res.lt('e800')) return E(0)
                    let x = res.div('e800').max(1).log('e50').max(0).root(1.25).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.max(1).log(1.1).mul(t.pow(0.75))
                    return x
                },
                desc(x) {
                    return `Adds ${format(x,0)} free Cosmic Rays`
                },
                inc: "Atomic Powers",
                cons: "^0.6 to the exponent of Atomic Powers gain",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e50').pow(t.pow(1.25)).mul("e400")
                },
                calcTier() {
                    let res = player.md.particles
                    if (res.lt('e400')) return E(0)
                    let x = res.div('e400').max(1).log('e50').max(0).root(1.25).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = E(1e5).pow(i.add(1).log10().mul(t)).softcap("ee3",0.9,2)
                    return x
                },
                desc(x) {
                    return `x${format(x)} to Relativistic Particles gain`+(x.gte('ee3')?" <span class='soft'>(softcapped)</span>":"")
                },
                inc: "Relativistic Particle",
                cons: "The exponent of the RP formula is divided by 10",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('ee3').pow(t.pow(1.5)).mul(uni("e36000"))
                },
                calcTier() {
                    let res = player.mass
                    if (res.lt(uni("e36000"))) return E(0)
                    let x = res.div(uni("e36000")).max(1).log('ee3').max(0).root(1.5).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.add(1).log10().pow(1.75).mul(t.pow(0.8)).div(100).add(1).softcap(5,0.75,0)
                    return x
                },
                desc(x) {
                    return `Z<sup>0</sup> Boson's first effect is ${format(x.sub(1).mul(100))}% stronger`+(x.gte(5)?" <span class='soft'>(softcapped)</span>":"")
                },
                inc: "Mass",
                cons: "You are trapped in Mass Dilation, but they are twice effective",
                isMass: true,
            },{
                maxTier() {
                    let x = 15
                    if (player.supernova.tree.includes("fn9")) x += 2
                    return x
                },
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e1000').pow(t.pow(1.5)).mul("e3e4")
                },
                calcTier() {
                    let res = player.rp.points
                    if (res.lt('e3e4')) return E(0)
                    let x = res.div('e3e4').max(1).log('e1000').max(0).root(1.5).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.max(1).log10().add(1).mul(t).pow(0.9).div(100).add(1).softcap(1.5,0.5,0)
                    return x
                },
                desc(x) {
                    return `4th Photon & Gluon upgrades are ${format(x)}x stronger`+(x.gte(1.5)?" <span class='soft'>(softcapped)</span>":"")
                },
                inc: "Rage Power",
                cons: "You are trapped in Mass Dilation and Challenges 3-5",
            },{
                maxTier: 30,
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('ee4').pow(t.pow(1.5)).mul(uni('e5.75e5'))
                },
                calcTier() {
                    let res = player.md.mass
                    if (res.lt(uni('e5.75e5'))) return E(0)
                    let x = res.div(uni('e5.75e5')).max(1).log('ee4').max(0).root(1.5).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.add(1).log10().div(500).mul(t.root(2)).add(1)
                    return x.softcap(1.15,0.5,0)
                },
                desc(x) {
                    return `Radiation Boosters are ${format(x)}x cheaper`+(x.gte(1.15)?" <span class='soft'>(softcapped)</span>":"")
                },
                inc: "Dilated Mass",
                cons: "U-Quarks, Photons & Gluons do nothing",
                isMass: true,
            },{
                maxTier: 10,
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e5e8').pow(t.pow(2)).mul('e6e9')
                },
                calcTier() {
                    let res = tmp.tickspeedEffect && tmp.pass?tmp.tickspeedEffect.eff:E(1)
                    if (res.lt('e6e9')) return E(0)
                    let x = res.div('e6e9').max(1).log('e5e8').max(0).root(2).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.add(1).log10().pow(0.5).div(150).add(1).pow(t)
                    return x
                },
                desc(x) {
                    return `Meta-Tickspeed starts ${format(x)}x later`
                },
                inc: "Tickspeed Effect",
                cons: "Challenges are disabled",
            },

        ],[
            {
                maxTier() {
                    let x = 15
                    if (player.supernova.tree.includes("fn5")) x += 35
                    return x
                },
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e5').pow(t.pow(1.5)).mul("e175")
                },
                calcTier() {
                    let res = player.atom.quarks
                    if (res.lt('e175')) return E(0)
                    let x = res.div('e175').max(1).log('e5').max(0).root(1.5).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.add(1).log10().mul(t).div(100).add(1).softcap(1.5,player.supernova.tree.includes("fn5")?0.75:0.25,0)
                    return x
                },
                desc(x) {
                    return `Collapse Stars gain softcap starts ^${format(x)} later`+(x.gte(1.5)?" <span class='soft'>(softcapped)</span>":"")
                },
                inc: "Quark",
                cons: "^0.625 to the exponent of Atoms gain",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e4e4').pow(t.pow(1.25)).mul("e6e5")
                },
                calcTier() {
                    let res = player.bh.mass
                    if (res.lt('e6e5')) return E(0)
                    let x = res.div('e6e5').max(1).log('e4e4').max(0).root(1.25).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = t.pow(1.5).add(1).pow(i.add(1).log10().softcap(10,0.75,0)).softcap(1e6,0.75,0)
                    return x
                },
                desc(x) {
                    return `x${format(x)} to Higgs Bosons & Gravitons gain`+(x.gte(1e6)?" <span class='soft'>(softcapped)</span>":"")
                },
                isMass: true,
                inc: "Mass of Black Hole",
                cons: "The power from the mass of the BH formula is always -1",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e5e3').pow(t.pow(1.5)).mul("e4.5e5")
                },
                calcTier() {
                    let res = player.bh.dm
                    if (res.lt('e4.5e5')) return E(0)
                    let x = res.div('e4.5e5').max(1).log('e5e3').max(0).root(1.5).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = t.pow(0.8).mul(0.025).add(1).pow(i.add(1).log10())
                    return x
                },
                desc(x) {
                    return `Tickspeed is ${format(x)}x cheaper (before Meta scaling)`
                },
                inc: "Dark Matter",
                cons: "You are trapped in Challenges 8-9",
            },{
                maxTier() {
                    let x = 15
                    if (player.supernova.tree.includes("fn9")) x += 2
                    return x
                },
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e400').pow(t.pow(1.5)).mul("e1600")
                },
                calcTier() {
                    let res = player.stars.points
                    if (res.lt('e1600')) return E(0)
                    let x = res.div('e1600').max(1).log('e400').max(0).root(1.5).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.max(1).log10().add(1).mul(t).div(200).add(1).softcap(1.5,0.5,0)
                    return x
                },
                desc(x) {
                    return `Tier requirement is ${format(x)}x cheaper`+(x.gte(1.5)?" <span class='soft'>(softcapped)</span>":"")
                },
                inc: "Collapsed Star",
                cons: "Star generators are decreased to ^0.5",
            },{
                maxTier: 25,
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e1.5e7').pow(t.pow(2)).mul("e3.5e8")
                },
                calcTier() {
                    let res = player.atom.points
                    if (res.lt('e3.5e8')) return E(0)
                    let x = res.div('e3.5e8').max(1).log('e1.5e7').max(0).root(2).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = E(0.95).pow(i.add(1).log10().mul(t).root(4).softcap(27,0.5,0)).max(2/3).toNumber()
                    return x
                },
                desc(x) {
                    return `Pre-Meta-Supernova Scalings are ${format(100-x*100)}% weaker`
                },
                inc: "Atom",
                cons: "U-Leptons, Z<sup>0</sup> bosons do nothing",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('10').pow(t.pow(1.5)).mul('e80')
                },
                calcTier() {
                    let res = tmp.tickspeedEffect && tmp.pass?tmp.tickspeedEffect.step:E(1)
                    if (res.lt('e80')) return E(0)
                    let x = res.div('e80').max(1).log('10').max(0).root(1.5).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.add(1).log10().pow(0.75).div(100).add(1).pow(t.pow(0.75))
                    return x
                },
                desc(x) {
                    return `BH Condensers & Cosmic Rays are ${format(x)}x cheaper`
                },
                inc: "Tickspeed Power",
                cons: "Radiation Boosts are disabled",
            },

            /*
            {
                nextTierAt(x) {
                    return E(1/0)
                },
                calcTier() {
                    let res = E(0)
                    let x = E(0)
                    return x
                },
                eff(i, t) {
                    let x = E(1)
                    return x
                },
                desc(x) {
                    return `Placeholder`
                },
                inc: "Placeholder",
                cons: "Placeholder",
            },
            */
        ],
    ],
}

function setupFermionsHTML() {
    for (i = 0; i < 2; i++) {
        let new_table = new Element("fermions_"+FERMIONS.names[i]+"_table")
        let table = ""
        for (let x = 0; x < FERMIONS.types[i].length; x++) {
            let f = FERMIONS.types[i][x]
            let id = `f${FERMIONS.names[i]}${x}`
            table += `
            <button id="${id}_div" class="fermion_btn ${FERMIONS.names[i]}" onclick="FERMIONS.choose(${i},${x})">
                <b>[${FERMIONS.sub_names[i][x]}]</b><br>[<span id="${id}_tier_scale"></span>Tier <span id="${id}_tier">0</span>]<br>
                <span id="${id}_cur">Currently: X</span><br>
                Next Tier at: <span id="${id}_nextTier">X</span><br>
                (Increased by ${f.inc})<br><br>
                Effect: <span id="${id}_desc">X</span><br>
                On Active: ${f.cons}
            </button>
            `
        }
	    new_table.setHTML(table)
    }
}

function updateFermionsTemp() {
    tmp.fermions.ch = player.supernova.fermions.choosed == "" ? [-1,-1] : [Number(player.supernova.fermions.choosed[0]),Number(player.supernova.fermions.choosed[1])]
    for (i = 0; i < 2; i++) {
        tmp.fermions.gains[i] = FERMIONS.gain(i)

        for (let x = 0; x < FERMIONS.types[i].length; x++) {
            let f = FERMIONS.types[i][x]

            tmp.fermions.maxTier[i][x] = typeof f.maxTier == "function" ? f.maxTier() : f.maxTier||1/0
            tmp.fermions.tiers[i][x] = f.calcTier()
            tmp.fermions.effs[i][x] = f.eff(player.supernova.fermions.points[i], (FERMIONS.onActive("04") && i == 0) || (FERMIONS.onActive("14") && i == 1) ? E(0) : player.supernova.fermions.tiers[i][x].mul(i==1?tmp.radiation.bs.eff[16]:1).mul(i==0?tmp.radiation.bs.eff[19]:1))
        }
    }
}

function updateFermionsHTML() {
    for (i = 0; i < 2; i++) {
        tmp.el["f"+FERMIONS.names[i]+"Amt"].setTxt(format(player.supernova.fermions.points[i],2)+" "+formatGain(player.supernova.fermions.points[i],tmp.fermions.gains[i]))
        let unls = FERMIONS.getUnlLength(i)
        for (let x = 0; x < FERMIONS.types[i].length; x++) {
            let unl = x < unls
            let f = FERMIONS.types[i][x]
            let id = `f${FERMIONS.names[i]}${x}`
            let fm = f.isMass?formatMass:format

            tmp.el[id+"_div"].setDisplay(unl)

            if (unl) {
                let active = tmp.fermions.ch[0] == i && tmp.fermions.ch[1] == x
                tmp.el[id+"_div"].setClasses({fermion_btn: true, [FERMIONS.names[i]]: true, choosed: active})
                tmp.el[id+"_nextTier"].setTxt(fm(f.nextTierAt(player.supernova.fermions.tiers[i][x])))
                tmp.el[id+"_tier_scale"].setTxt(getScalingName('fTier', i, x))
                tmp.el[id+"_tier"].setTxt(format(player.supernova.fermions.tiers[i][x],0)+(tmp.fermions.maxTier[i][x] < Infinity?" / "+format(tmp.fermions.maxTier[i][x],0):""))
                tmp.el[id+"_desc"].setHTML(f.desc(tmp.fermions.effs[i][x]))

                tmp.el[id+"_cur"].setDisplay(active)
                if (active) {
                    tmp.el[id+"_cur"].setTxt(`Currently: ${fm(
                        [
                            [player.atom.atomic, player.md.particles, player.mass, player.rp.points, player.md.mass, tmp.tickspeedEffect.eff],
                            [player.atom.quarks, player.bh.mass, player.bh.dm, player.stars.points, player.atom.points, tmp.tickspeedEffect.step]
                        ][i][x]
                    )}`)
                }
            }
        }
    }
}