const FERMIONS = {
    onActive(id) { return player.supernova.fermions.choosed == id || player.supernova.fermions.choosed2 == id },
    gain(i) {
        if (!player.supernova.fermions.unl) return E(0)
        let x = E(1)
        if (tmp.radiation.unl) x = x.mul(tmp.radiation.hz_effect)
        for (let j = 0; j < FERMIONS.types[i].length; j++) x = x.mul(E(1.25).pow(player.supernova.fermions.tiers[i][j]))
        if (hasTreeUpg("fn1") && tmp.supernova) x = x.mul(tmp.supernova.tree_eff.fn1)
        x = x.mul(tmp.supernova.timeMult)
        return x
    },
    backNormal() {
        if (player.supernova.fermions.choosed != "") {
            player.supernova.fermions.choosed = ""
            player.supernova.fermions.choosed2 = ""
            SUPERNOVA.reset(false,false,false,true)
        }
    },
    choose(i,x,a) {
		if (!a && player.confirms.sn) if (!confirm("Are you sure to switch any type of any Fermion?")) return
		if (player.supernova.fermions.tiers[i][x].gte(FERMIONS.maxTier(i, x))) return
		let id = i+""+x
		tmp.tickspeedEffect.eff = E(1)
		tmp.tickspeedEffect.step = E(1)
		if (hasTreeUpg("qol9") && player.supernova.fermions.choosed && player.supernova.fermions.choosed[0] != i) {
			if (player.supernova.fermions.choosed2 != id) {
				player.supernova.fermions.choosed2 = id
				SUPERNOVA.reset(false,false,false,true)
			}
		} else if (player.supernova.fermions.choosed != id) {
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
        }
        return x
    },
	maxTier(i, x) {
		let f = FERMIONS.types[i][x]
		return typeof f.maxTier == "function" ? f.maxTier() : f.maxTier || 1/0
	},
    getUnlLength(x) {
        let u = 2
        if (hasTreeUpg("fn2")) u++
        if (hasTreeUpg("fn6")) u++
        if (hasTreeUpg("fn7")) u++
        if (hasTreeUpg("fn8")) u++
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
					if (FERMIONS.onActive(05)) return E(0)
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
					if (FERMIONS.onActive(05)) return E(1)
                    let x = E(1e5).pow(i.add(1).log10().mul(t)).softcap("ee3",0.9,2)
                    return x
                },
                desc(x) {
                    return `x${format(x)} to Relativistic Particles gain`+getSoftcapHTML(x,'ee3')
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
					if (FERMIONS.onActive(05)) return E(1)
                    let x = i.add(1).log10().pow(1.75).mul(t.pow(0.8)).div(100).add(1).softcap(5,0.75,0).softcap(100,4,3)
                    return x
                },
                desc(x) {
                    return `Z<sup>0</sup> Boson's first effect is ${format(x.sub(1).mul(100))}% stronger`+getSoftcapHTML(x,5)
                },
                inc: "Mass",
                cons: "You are trapped in Mass Dilation, but they are twice effective",
                isMass: true,
            },{
                maxTier: 18,
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
					if (FERMIONS.onActive(05)) return E(1)
                    let x = i.max(1).log10().add(1).mul(t).pow(0.9).div(100).add(1).softcap(1.5,0.5,0).min(3)
                    return x
                },
                desc(x) {
                    return `4th Photon & Gluon upgrades are ${format(x)}x stronger`+getSoftcapHTML(x,1.5)
                },
                inc: "Rage Power",
                cons: "You are trapped in Mass Dilation and Challenges 3-5",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E("e1.75e7").pow(E(1.05).pow(t))
                },
                calcTier() {
                    let res = player.atom.points
                    if (res.lt('e1.75e7')) return E(0)
                    let x = res.log("e1.75e7").log(1.05).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(05)) return E(1)
                    return t.div(100).times(i.max(1).log(1e20)).add(1)
                },
                desc(x) {
                    return `Weaken the penalty exponent for Mass Dilation by ${format(Decimal.sub(100, Decimal.div(100, x)))}%.`
                },
                inc: "Atoms",
                cons: "All challenges are disabled.",
            },
            {
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e4.5e8').pow(t.div(10).pow(1.5).add(1))
                },
                calcTier() {
                    let res = tmp.tickspeedEffect ? tmp.tickspeedEffect.eff : E(1)
                    if (res.lt('e4.5e8')) return E(0)
                    let x = res.log('e4.5e8').sub(1).root(1.5).times(10).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(05)) return E(1)
                    return E(1).div(i.add(1).log10().times(t.pow(2)).add(1).log10().div(30).add(1))
                },
                desc(x) {
                    return `Radiation boosts scale ${format(E(1).sub(x).mul(100))}% slower.`
                },
                inc: "Tickspeed Effect",
                cons: "U-Quarks and Radiation Boosts do nothing.",
            },
        ],[
            {
                maxTier() {
                    let x = 15
                    if (hasTreeUpg("fn5")) x += 35
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
					if (FERMIONS.onActive(14)) return E(1)
                    let x = i.add(1).log10().mul(t).div(100).add(1).softcap(1.5,hasTreeUpg("fn5")?0.75:0.25,0)
                    return x
                },
                desc(x) {
                    return `Collapse Stars gain softcap starts ^${format(x)} later`+getSoftcapHTML(x,1.5)
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
					if (FERMIONS.onActive(14)) return E(1)
                    let x = t.pow(1.5).add(1).pow(i.add(1).log10().softcap(10,0.75,0)).softcap(1e6,0.75,0)
                    return x
                },
                desc(x) {
                    return `x${format(x)} to Higgs Bosons & Gravitons gain`+getSoftcapHTML(x,1e6)
                },
                isMass: true,
                inc: "Mass of Black Hole",
                cons: "The power from the mass of the BH formula is always -1",
            },{
                maxTier: 40,
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
					if (FERMIONS.onActive(14)) return E(1)
                    let x = t.pow(0.8).mul(0.025).add(1).pow(i.add(1).log10())
                    return x.min(1e6)
                },
                desc(x) {
                    return `Tickspeed is ${format(x)}x cheaper (before Meta scaling)`
                },
                inc: "Dark Matter",
                cons: "You are trapped in Challenges 8-9",
            },{
                maxTier: 15,
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
					if (FERMIONS.onActive(14)) return E(1)
                    let x = i.max(1).log10().add(1).mul(t).div(200).add(1).softcap(1.5,0.5,0).softcap(250,0.5,0)
                    return x
                },
                desc(x) {
                    return `Tier requirement is ${format(x)}x cheaper`+getSoftcapHTML(x,1.5,250)
                },
                inc: "Collapsed Star",
                cons: "Star generators are decreased to ^0.5",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e2e5').pow(t.pow(1.5)).mul("e1.5e6")
                },
                calcTier() {
                    let res = player.md.mass
                    if (res.lt('e1.5e6')) return E(0)
                    let x = res.div('e1.5e6').max(1).log('e2e5').max(0).root(1.5).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return E(1)
					if (t.eq(0)) return E(1)
					let sc = future ? E(0.3) : AXIONS.unl() ? tmp.ax.eff[11].div(4) : E(0.25)
                    return t.add(1).times(i.div(1e30).add(1).log10()).div(400).add(1).softcap(2.5, sc, 0)
                },
                desc(x) {
                    return `Meta Rank scaling starts ${format(x)}x later.`+getSoftcapHTML(x,2.5)
                },
				isMass: true,
                inc: "Dilated mass",
                cons: "There's no Meta Scalings, but U-Leptons do nothing and Rank is capped at 20,000.",
            },
            {
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E(10).pow(t.pow(1.5)).mul(1e20)
                },
                calcTier() {
                    let res = tmp.tickspeedEffect ? tmp.tickspeedEffect.step : E(1)
                    if (res.lt(1e19)) return E(0)
                    let x = res.div(1e20).max(1).log(10).max(0).root(1.5).add(1).floor()
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return E(0)
                    let x = i.add(1).log10().times(t.add(1).log10()).add(1).log10().div(20)
			        if (AXIONS.unl()) x = x.mul(tmp.ax.eff[5])
                    return x
                },
                desc(x) {
                    return `Increase Rage Power exponent cap by ^${format(x)}.`
                },
                inc: "Tickspeed power",
                cons: "Boson Upgrades and W Bosons are disabled.",
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
                <span id="${id}_nextTier">X</span>
                Effect: <span id="${id}_desc">X</span>
                <span id="${id}_cons">X</span>
            </button>
            `
        }
	    new_table.setHTML(table)
    }
}

function updateFermionsTemp() {
    tmp.fermions.ch = player.supernova.fermions.choosed == "" ? [-1,-1] : [Number(player.supernova.fermions.choosed[0]),Number(player.supernova.fermions.choosed[1])]
    tmp.fermions.ch2 = player.supernova.fermions.choosed2 == "" ? [-1,-1] : [Number(player.supernova.fermions.choosed2[0]),Number(player.supernova.fermions.choosed2[1])]
    for (i = 0; i < 2; i++) {
        tmp.fermions.gains[i] = FERMIONS.gain(i)
        for (let x = 0; x < FERMIONS.types[i].length; x++) {
            let f = FERMIONS.types[i][x]
            tmp.fermions.maxTier[i][x] = FERMIONS.maxTier(i, x)
            tmp.fermions.tiers[i][x] = f.calcTier()

			let t = player.supernova.fermions.tiers[i][x]
			if (tmp.radiation && i == 1) t = t.mul(tmp.radiation.bs.eff[16])
            tmp.fermions.effs[i][x] = f.eff(player.supernova.fermions.points[i], t)
        }
    }
}

function updateFermionsHTML() {
	tmp.el.f_normal.setDisplay(player.supernova.fermions.choosed ? 1 : 0)
    for (i = 0; i < 2; i++) {
        tmp.el["f"+FERMIONS.names[i]+"Amt"].setTxt(format(player.supernova.fermions.points[i],2)+" "+formatGain(player.supernova.fermions.points[i],tmp.fermions.gains[i]))
        let unls = FERMIONS.getUnlLength(i)
        for (let x = 0; x < FERMIONS.types[i].length; x++) {
            let unl = x < unls
            let f = FERMIONS.types[i][x]
            let id = `f${FERMIONS.names[i]}${x}`
            let fm = f.isMass?formatMass:format
            let max = player.supernova.fermions.tiers[i][x].gte(FERMIONS.maxTier(i, x))
            let active = FERMIONS.onActive(i+""+x)

            tmp.el[id+"_div"].setDisplay(unl)

            if (unl) {
                tmp.el[id+"_div"].setClasses({fermion_btn: true, [max ? "comp" : FERMIONS.names[i]]: true, choosed: active})
                tmp.el[id+"_nextTier"].setHTML(max ? "" : "Next at: " + fm(f.nextTierAt(player.supernova.fermions.tiers[i][x])) + `<br>(Increased by ${f.inc})<br><br>`)
                tmp.el[id+"_tier_scale"].setTxt(getScalingName('fTier', i, x))
                tmp.el[id+"_tier"].setTxt(format(player.supernova.fermions.tiers[i][x],0)+(tmp.fermions.maxTier[i][x] < Infinity && !max ? " / " + format(tmp.fermions.maxTier[i][x],0) : ""))
                tmp.el[id+"_desc"].setHTML(f.desc(tmp.fermions.effs[i][x]))
                tmp.el[id+"_cons"].setHTML(max ? "" : `<br>On Active: ${f.cons}`)

                tmp.el[id+"_cur"].setDisplay(active)
                if (active) {
                    tmp.el[id+"_cur"].setTxt(max ? "" : `Currently: ${fm(
                        [
                            [player.atom.atomic, player.md.particles, player.mass, player.rp.points, player.atom.points, tmp.tickspeedEffect.eff],
                            [player.atom.quarks, player.bh.mass, player.bh.dm, player.stars.points, player.md.mass, tmp.tickspeedEffect.step]
                        ][i][x]
                    )}`)
                }
            }
        }
    }
}