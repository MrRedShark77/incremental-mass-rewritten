const FERMIONS = {
    onActive(id) { return player.supernova.fermions.choosed == id },
    gain(i) {
        if (!player.supernova.fermions.unl) return E(0)
        let x = E(1)
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
                x = x.sub(1)
                let start = getScalingStart('super',"fTier")
                let power = getScalingPower('super',"fTier")
                let exp = E(2.5).pow(power)
                x = t.mul(start.pow(exp.sub(1))).root(exp).add(1).floor()
            }
        } else {
            if (x.sub(1).gte(getScalingStart('super',"fTier"))) {
                let start = getScalingStart('super',"fTier")
                let power = getScalingPower('super',"fTier")
                let exp = E(2.5).pow(power)
                x = t.pow(exp).div(start.pow(exp.sub(1))).floor()
            }
        }
        return x
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
                    return `Adds ${format(x,0)} free Gamma Rays`
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
                    let x = E(1e5).pow(i.add(1).log10().mul(t))
                    return x
                },
                desc(x) {
                    return `x${format(x)} to Relativistic Particles gain`
                },
                inc: "Relativistic Particle",
                cons: "The exponent of the RP formula is divided by 10",
            },
        ],[
            {
                maxTier: 15,
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
                    let x = i.add(1).log10().mul(t).div(100).add(1).softcap(1.5,0.25,0)
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
                    let x = t.pow(1.5).add(1).pow(i.add(1).log10()).softcap(1e6,0.75,0)
                    return x
                },
                desc(x) {
                    return `x${format(x)} to Higgs Bosons & Gravitons gain`+(x.gte(1e6)?" <span class='soft'>(softcapped)</span>":"")
                },
                isMass: true,
                inc: "Mass of Black Hole",
                cons: "The power from the mass of the BH formula is always -1",
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

            tmp.fermions.tiers[i][x] = f.calcTier()
            tmp.fermions.effs[i][x] = f.eff(player.supernova.fermions.points[i], player.supernova.fermions.tiers[i][x])
        }
    }
}

function updateFermionsHTML() {
    for (i = 0; i < 2; i++) {
        tmp.el["f"+FERMIONS.names[i]+"Amt"].setTxt(format(player.supernova.fermions.points[i],2)+" "+formatGain(player.supernova.fermions.points[i],tmp.fermions.gains[i]))

        for (let x = 0; x < FERMIONS.types[i].length; x++) {
            let f = FERMIONS.types[i][x]
            let id = `f${FERMIONS.names[i]}${x}`

            let fm = f.isMass?formatMass:format

            tmp.el[id+"_div"].setClasses({fermion_btn: true, [FERMIONS.names[i]]: true, choosed: tmp.fermions.ch[0] == i && tmp.fermions.ch[1] == x})
            tmp.el[id+"_nextTier"].setTxt(fm(f.nextTierAt(player.supernova.fermions.tiers[i][x])))
            tmp.el[id+"_tier_scale"].setTxt(getScalingName('fTier', i, x))
            tmp.el[id+"_tier"].setTxt(format(player.supernova.fermions.tiers[i][x],0)+(f.maxTier?" / "+format(f.maxTier,0):""))
            tmp.el[id+"_desc"].setHTML(f.desc(tmp.fermions.effs[i][x]))
        }
    }
}