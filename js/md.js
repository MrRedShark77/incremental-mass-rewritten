const MASS_DILATION = {
    unlocked() { return hasElement(21) },
    penalty() {
        let x = 0.8
        if (FERMIONS.onActive("02")) x **= 2
        if (QCs.active() && (player.md.break.active ? !player.qu.rip.active : true)) x **= tmp.qu.qc_eff[6]
        return x
    },
    onactive() {
        if (tmp.c16active || player.dark.run.active) return
        if (player.md.active) player.md.particles = player.md.particles.add(tmp.md.rp_gain)
        player.md.active = !player.md.active
        ATOM.doReset()
        updateMDTemp()
    },
    RPexpgain() {
        let x = E(2).add(tmp.md.upgs[5].eff).mul((tmp.chal && !CHALS.inChal(10))?tmp.chal.eff[10]:1)
        if (!player.md.active && hasTree("d1")) x = x.mul(1.25)
        if (FERMIONS.onActive("01")) x = x.div(10)
        if (QCs.active()) x = x.mul(tmp.qu.qc_eff[4])
        if (hasElement(24) && hasPrestige(0,40)) x = x.mul(tmp.elements.effect[24])
        if (tmp.c16active || player.dark.run.active) x = x.pow(mgEff(3))
        return x
    },
    RPmultgain() {
        let x = E(1).mul(tmp.md.upgs[2].eff)
        if (hasElement(24) && !hasPrestige(0,40)) x = x.mul(tmp.elements.effect[24])
        if (hasElement(31)) x = x.mul(tmp.elements.effect[31])
        if (hasElement(34)) x = x.mul(tmp.elements.effect[34])
        if (hasElement(45)) x = x.mul(tmp.elements.effect[45])
        x = x.mul(tmp.fermions.effs[0][1]||1)
        return x
    },
    RPgain(m=player.mass) {
        if (CHALS.inChal(11)) return E(0)
        let x = m.div(1.50005e56).max(1).log10().div(40).sub(14).max(0).pow(tmp.md.rp_exp_gain).mul(tmp.md.rp_mult_gain)
        return x.sub(player.md.particles).max(0).floor()
    },
    massGain() {
        if (CHALS.inChal(11)) return E(0)
        let pow = E(2).add(tmp.bd.upgs[1].eff)
        let x = player.md.particles.pow(pow)
        x = x.mul(tmp.md.upgs[0].eff)
        if (hasElement(22)) x = x.mul(tmp.elements.effect[22])
        if (hasElement(35)) x = x.mul(tmp.elements.effect[35])
        if (hasElement(40)) x = x.mul(tmp.elements.effect[40][0])
        if (hasElement(32)) x = x.pow(1.05)
        if (QCs.active()) x = x.pow(tmp.qu.qc_eff[4])

        x = x.softcap(tmp.md.massSoftcap1,0.5,0)

        if (hasElement(40)) x = x.pow(tmp.elements.effect[40][1])

        if (tmp.c16active || player.dark.run.active) x = expMult(x,mgEff(3))

        let o = x
        let os = E('ee30').pow(glyphUpgEff(8))

        if (hasUpgrade('atom',19)) os = os.pow(upgEffect(3,19))
        if (hasTree('ct14')) os = os.pow(treeEff('ct14'))

        x = overflow(x,os,0.5)

        tmp.overflowBefore.dm = o
        tmp.overflow.dm = calcOverflow(o,x,os)
        tmp.overflow_start.dm = os

        return x
    },
    gainSoftcap1() {
        let s = mlt(1e12)
        
        return s
    },
    mass_req() {
        let x = E(10).pow(player.md.particles.add(1).div(tmp.md.rp_mult_gain).root(tmp.md.rp_exp_gain).add(14).mul(40)).mul(1.50005e56)
        return x
    },
    effect() {
        let x = tmp.md.bd3 ? player.qu.rip.active ? player.md.mass.max(1).log10().max(1).log10().add(1).log10().add(1).root(2) : player.md.mass.max(1).log10().max(1).log10().add(1).root(3) : player.md.mass.max(1).log10().add(1).root(3)
        x = x.mul(tmp.md.upgs[1].eff)
        return x
    },
    upgs: {
        buy(x) {
            if (tmp.md.upgs[x].can) {
                if (!hasElement(43)) player.md.mass = player.md.mass.sub(this.ids[x].cost(tmp.md.upgs[x].bulk.sub(1))).max(0)
                player.md.upgs[x] = player.md.upgs[x].max(tmp.md.upgs[x].bulk)
            }
        },
        ids: [
            {
                desc: `Double dilated mass gain.`,
                cost(x) { return E(10).pow(x).mul(10) },
                bulk() { return player.md.mass.gte(10)?player.md.mass.div(10).max(1).log10().add(1).floor():E(0) },
                effect(x) {
                    let b = 2
                    if (hasElement(25)) b++
                    return E(b).pow(x.mul(tmp.md.upgs[11].eff||1)).softcap('e1.2e4',0.96,2)//.softcap('e2e4',0.92,2)
                },
                effDesc(x) { return format(x,0)+"x"+(x.gte('e1.2e4')?` <span class='soft'>(softcapped${x.gte('e2e400')?"^2":""})</span>`:"")},
            },{
                desc: `Make dilated mass effect stronger.`,
                cost(x) { return tmp.md.bd3 ? E(10).pow(E(1.25).pow(x)).mul(100) : E(10).pow(x).mul(100) },
                bulk() { return player.md.mass.gte(100)?(tmp.md.bd3 ? player.md.mass.div(100).max(1).log10().max(1).log(1.25).add(1).floor() : player.md.mass.div(100).max(1).log10().add(1).floor()):E(0) },
                effect(x) {
                    if (tmp.md.bd3) return x.mul(tmp.md.upgs[11].eff||1).root(player.qu.rip.active || tmp.c16active || player.dark.run.active ? 3 : 2).mul(player.qu.rip.active || tmp.c16active || player.dark.run.active ? 0.05 : 0.1).add(1)
                    if (hasElement(83)) return expMult(x,2,1.5).add(1)
                    return player.md.upgs[7].gte(1)?x.mul(tmp.md.upgs[11].eff||1).root(1.5).mul(0.25).add(1):x.mul(tmp.md.upgs[11].eff||1).root(2).mul(0.15).add(1)
                },
                effDesc(x) { return (x.gte(10)?format(x)+"x":format(x.sub(1).mul(100))+"%")+" stronger" },
            },{
                desc: `Double relativistic particles gain.`,
                cost(x) { return E(10).pow(x.pow(E(1.25).pow(tmp.md.upgs[4].eff||1))).mul(1000) },
                bulk() { return player.md.mass.gte(1000)?player.md.mass.div(1000).max(1).log10().root(E(1.25).pow(tmp.md.upgs[4].eff||1)).add(1).floor():E(0) },
                effect(x) { return E(2).pow(x.softcap(2.5e26,0.1,0).mul(tmp.md.upgs[11].eff||1)).softcap(1e25,0.75,0) },
                effDesc(x) { return format(x,0)+"x"+(x.gte(1e25)?" <span class='soft'>(softcapped)</span>":"") },
            },{
                desc: `Dilated mass also boost Stronger's power.`,
                maxLvl: 1,
                cost(x) { return E(1.619e20).mul(25) },
                bulk() { return player.md.mass.gte(E(1.619e20).mul(25))?E(1):E(0) },
                effect(x) { return player.md.mass.max(1).log(100).root(3).div(8).add(1) },
                effDesc(x) { return format(x)+"x" },
            },{
                desc: `Mass Dilation upgrade 3 scales 10% weaker.`,
                maxLvl: 5,
                cost(x) { return E(1e5).pow(x).mul(E(1.619e20).mul(1e4)) },
                bulk() { return player.md.mass.gte(E(1.619e20).mul(1e4))?player.md.mass.div(E(1.619e20).mul(1e4)).max(1).log(1e5).add(1).floor():E(0) },
                effect(x) { return E(1).sub(x.mul(0.1)) },
                effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
            },{
                desc: `Increase the exponent of the RP formula.`,
                cost(x) { return E(1e3).pow(x.pow(1.5)).mul(1.5e73) },
                bulk() { return player.md.mass.gte(1.5e73)?player.md.mass.div(1.5e73).max(1).log(1e3).max(0).root(1.5).add(1).floor():E(0) },
                effect(i) {
                    let s = E(0.25).add(tmp.md.upgs[10].eff||1)
                    let x = i.mul(s)
                    if (hasElement(53)) x = x.mul(1.75)
                    return x.softcap(1e3,0.6,0)//.softcap(1e23,0.1,0)
                },
                effDesc(x) { return "+^"+format(x)+(x.gte(1e3)?" <span class='soft'>(softcapped)</span>":"") },
            },{
                desc: `Dilated mass boost quarks gain.`,
                maxLvl: 1,
                cost(x) { return E(1.5e191) },
                bulk() { return player.md.mass.gte(1.5e191)?E(1):E(0) },
                effect(x) { return E(5).pow(player.md.mass.max(1).log10().root(2)) },
                effDesc(x) { return format(x)+"x" },
            },{
                desc: `Mass Dilation upgrade 2 effect's formula is better.`,
                maxLvl: 1,
                cost(x) { return E(1.5e246) },
                bulk() { return player.md.mass.gte(1.5e246)?E(1):E(0) },
            },{
                unl() { return STARS.unlocked() || player.supernova.times.gte(1) },
                desc: `Tickspeed affects all-star resources at a reduced rate.`,
                maxLvl: 1,
                cost(x) { return E(1.5e296) },
                bulk() { return player.md.mass.gte(1.5e296)?E(1):E(0) },
                effect(x) { return player.tickspeed.add(1).pow(2/3) },
                effDesc(x) { return format(x)+"x" },
            },{
                unl() { return STARS.unlocked() || player.supernova.times.gte(1) },
                desc: `Double quarks gain.`,
                cost(x) { return E(5).pow(x).mul('1.50001e536') },
                bulk() { return player.md.mass.gte('1.50001e536')?player.md.mass.div('1.50001e536').max(1).log(5).add(1).floor():E(0) },
                effect(x) {
                    return E(2).pow(x).softcap(1e25,2/3,0)//.softcap("ee12",0.8,2)
                },
                effDesc(x) { return format(x)+"x"+(x.gte(1e25)?" <span class='soft'>(softcapped)</span>":"") },
            },{
                unl() { return player.supernova.times.gte(1) },
                desc: `Add 0.015 to mass dilation upgrade 6's base.`,
                cost(x) { return E(1e50).pow(x.pow(1.5)).mul('1.50001e1556') },
                bulk() { return player.md.mass.gte('1.50001e1556')?player.md.mass.div('1.50001e1556').max(1).log(1e50).max(0).root(1.5).add(1).floor():E(0) },
                effect(i) {
                    if (player.md.break.upgs[3].gte(1)) i = i.pow(1.5).softcap(1e18,1/1.5,0)
                    let x = i.mul(0.015).add(1).softcap(1.2,0.75,0).sub(1)
                    return x
                },
                effDesc(x) { return "+"+format(x)+(x.gte(0.2)?" <span class='soft'>(softcapped)</span>":"") },
            },{
                unl() { return player.supernova.post_10 },
                desc: `First 3 Mass Dilation upgrades are stronger.`,
                cost(x) { return E(1e100).pow(x.pow(2)).mul('1.5e8056') },
                bulk() { return player.md.mass.gte('1.5e8056')?player.md.mass.div('1.5e8056').max(1).log(1e100).max(0).root(2).add(1).floor():E(0) },
                effect(x) {
                    return x.pow(0.5).softcap(3.5,0.5,0).div(100).add(1)
                },
                effDesc(x) { return "+"+format(x.sub(1).mul(100))+"% stronger" },
            },
        ],
    },

    break: {
        toggle() {
            let bd = player.md.break

            if (bd.active) createConfirm("Are you sure you want to fix Dilation?",'bd',()=>{
                bd.active = false
        
                bd.energy = E(0)
                bd.mass = E(0)
                for (let x = 0; x < MASS_DILATION.break.upgs.ids.length; x++) bd.upgs[x] = E(0)

                QUANTUM.enter(false,true,false,true)
            })
            else bd.active = true
        },
        energyGain() {
            if (!hasElement(136)) if (!player.md.break.active || !player.qu.rip.active) return E(0)

            let x = player.md.mass.add(1).log10().sub(400).div(2).max(0)
            let p = x.add(1).log10()

            if (hasElement(127)) p = p.mul(1.1)

            x = x.add(1).pow(p).sub(1)

            if (hasPrestige(0,10)) x = x.mul(prestigeEff(0,10))
            x = x.mul(tmp.bd.upgs[5].eff||1)
            if (hasElement(116)) x = x.mul(tmp.elements.effect[116]||1)

            return x
        },
        massGain() {
            let x = player.md.break.energy.max(0).pow(2)
            x = x.mul(tmp.bd.upgs[0].eff||1)
            if (player.md.break.upgs[7].gte(1)) x = x.mul(tmp.bd.upgs[7].eff||1)
            if (player.md.break.upgs[8].gte(1)) x = x.mul(tmp.bd.upgs[8].eff||1)

            return x
        },

        upgs: {
            buy(x) {
                if (tmp.bd.upgs[x].can) {
                    if (!hasElement(123)) player.md.break.mass = player.md.break.mass.sub(this.ids[x].cost(tmp.bd.upgs[x].bulk.sub(1))).max(0)
                    player.md.break.upgs[x] = player.md.break.upgs[x].max(tmp.bd.upgs[x].bulk)

                    if (x == 2) {
                        player.md.upgs[1] = E(0)

                        updateMDTemp()
                    }

                    updateBDTemp()
                }
            },
            ids: [
                {
                    desc: `Double Relativistic Mass gain.`,
                    cost(x) { return E(10).pow(x.pow(1.1)).mul(1e5) },
                    bulk() { return player.md.break.mass.gte(1e5)?player.md.break.mass.div(1e5).max(1).log10().root(1.1).add(1).floor():E(0) },
                    effect(y) {
                        let x = Decimal.pow(2,y)

                        return x.softcap(1e15,0.5,0)
                    },
                    effDesc(x) { return format(x,0)+"x"+x.softcapHTML(1e15) },
                },{
                    desc: `Increase the exponent of the Dilated Mass formula.`,
                    cost(x) { return E(10).pow(x.pow(1.25)).mul(1e7) },
                    bulk() { return player.md.break.mass.gte(1e7)?player.md.break.mass.div(1e7).max(1).log10().root(1.25).add(1).floor():E(0) },
                    effect(y) {
                        let x = y.div(40)
                
                        return x
                    },
                    effDesc(x) { return "+^"+format(x) },
                },{
                    desc: `Multiplier from DM effect is transformed to Exponent (at a reduced rate, is weaker while Big Ripped), but second MD upgrade's cost is exponentally increased. Purchasing this upgrade will reset it.`,
                    maxLvl: 1,
                    cost(x) { return E(1.619e23) },
                    bulk() { return player.md.break.mass.gte(1.619e23)?E(1):E(0) },
                },{
                    desc: `11th MD Upgrade is 50% stronger, its effected level softcaps at 1e18.`,
                    maxLvl: 1,
                    cost(x) { return E(1.989e33) },
                    bulk() { return player.md.break.mass.gte(1.989e33)?E(1):E(0) },
                },{
                    desc: `Meta-Rank scales later.`,
                    cost(x) { return E(10).pow(x.pow(2)).mul(1.989e36) },
                    bulk() { return player.md.break.mass.gte(1.989e36)?player.md.break.mass.div(1.989e36).max(1).log10().root(2).add(1).floor():E(0) },
                    effect(y) {
                        let x = y.div(10).add(1)
                
                        return x
                    },
                    effDesc(x) { return "x"+format(x)+" later" },
                },{
                    desc: `Triple Relativistic Energies gain.`,
                    cost(x) { return E(10).pow(x.pow(1.5)).mul(2.9835e48) },
                    bulk() { return player.md.break.mass.gte(2.9835e48)?player.md.break.mass.div(2.9835e48).max(1).log10().root(1.5).add(1).floor():E(0) },
                    effect(y) {
                        let x = Decimal.pow(3,y)

                        return x
                    },
                    effDesc(x) { return format(x,0)+"x" },
                },{
                    desc: `Death Shard & Entropy boosts each other.`,
                    maxLvl: 1,
                    cost(x) { return uni(1e35) },
                    bulk() { return player.md.break.mass.gte(uni(1e35))?E(1):E(0) },
                    effect(y) {
                        let x = [player.qu.rip.amt.add(1).log10().add(1).pow(2),player.qu.en.amt.add(1).log10().add(1).pow(1.5)]

                        return x
                    },
                    effDesc(x) { return x[0].format()+"x to Entropies gain, "+x[1].format()+"x to Death Shards gain" },
                },{
                    desc: `Relativistic Mass gain is increased by 75% for every OoM^2 of dilated mass.`,
                    maxLvl: 1,
                    cost(x) { return uni(1e48) },
                    bulk() { return player.md.break.mass.gte(uni(1e48))?E(1):E(0) },
                    effect(y) {
                        let x = E(1.75).pow(player.md.mass.add(1).log10().add(1).log10())

                        return x
                    },
                    effDesc(x) { return format(x)+"x" },
                },{
                    desc: `Pre-Quantum Global Speed affects Relativistic Mass gain at a severely reduced rate.`,
                    maxLvl: 1,
                    cost(x) { return uni(1e100) },
                    bulk() { return player.md.break.mass.gte(uni(1e100))?E(1):E(0) },
                    effect(y) {
                        let x = (tmp.preQUGlobalSpeed||E(1)).add(1).root(10)

                        return x
                    },
                    effDesc(x) { return format(x)+"x" },
                },{
                    desc: `Super Prestige Level starts 10 later.`,
                    maxLvl: 1,
                    cost(x) { return uni(1e120) },
                    bulk() { return player.md.break.mass.gte(uni(1e120))?E(1):E(0) },
                },{
                    unl: ()=>player.dark.unl,
                    desc: `You can now automatically evaporate resources. (Stronger than manual).`,
                    maxLvl: 1,
                    cost(x) { return uni(1e240) },
                    bulk() { return player.md.break.mass.gte(uni(1e240))?E(1):E(0) },
                },{
                    unl: ()=>player.dark.unl,
                    desc: `Double dark shadows gain.`,
                    cost(x) {
                        x = x.scale(17,hasPrestige(2,3)?1.5:3,0)
                        return E(10).pow(x.pow(2)).mul(uni(1e300))
                    },
                    bulk() {
                        if (player.md.break.mass.lt(uni(1e300))) return E(0)
                        let y = player.md.break.mass.div(uni(1e300)).max(1).log(10).root(2)
                        y = y.scale(17,hasPrestige(2,3)?1.5:3,0,true)
                        return y.add(1).floor()
                    },
                    effect(y) {
                        let x = Decimal.pow(2,y)

                        return x
                    },
                    effDesc(x) { return format(x,0)+"x" },
                },
            ],
        }
    },
}

/*
{
    desc: `Placeholder.`,
    cost(x) { return E(10).pow(x.pow(1.1)).mul(1e5) },
    bulk() { return player.md.break.mass.gte(1e5)?player.md.break.mass.div(1e5).max(1).log10().root(1.1).add(1).floor():E(0) },
    effect(y) {
        let x = E(1)

        return x
    },
    effDesc(x) { return format(x,0)+"x"},
},
*/

function setupMDHTML() {
    let md_upg_table = new Element("md_upg_table")
	let table = ""
	for (let i = 0; i < MASS_DILATION.upgs.ids.length; i++) {
        let upg = MASS_DILATION.upgs.ids[i]
        table += `
        <button onclick="MASS_DILATION.upgs.buy(${i})" class="btn full md" id="md_upg${i}_div" style="font-size: 11px;">
        <div style="min-height: 80px">
            ${((upg.maxLvl||1/0) > 1)?`[Level <span id="md_upg${i}_lvl"></span>]<br>`:""}
            ${upg.desc}<br>
            ${upg.effDesc?`Currently: <span id="md_upg${i}_eff"></span>`:""}
        </div>
        <span id="md_upg${i}_cost"></span>
        </button>
        `
	}
	md_upg_table.setHTML(table)

    let bd_upg_table = new Element("bd_upg_table")
	table = ""
	for (let i = 0; i < MASS_DILATION.break.upgs.ids.length; i++) {
        let upg = MASS_DILATION.break.upgs.ids[i]
        table += `
        <button onclick="MASS_DILATION.break.upgs.buy(${i})" class="btn full bd" id="bd_upg${i}_div" style="font-size: 11px;">
        <div style="min-height: 80px">
            ${((upg.maxLvl||1/0) > 1)?`[Level <span id="bd_upg${i}_lvl"></span>]<br>`:""}
            ${upg.desc}<br>
            ${upg.effDesc?`Currently: <span id="bd_upg${i}_eff"></span>`:""}
        </div>
        <span id="bd_upg${i}_cost"></span>
        </button>
        `
	}
	bd_upg_table.setHTML(table)
}

function updateMDTemp() {
    if (!tmp.md) tmp.md = {}
    if (!tmp.md.upgs) {
        tmp.md.upgs = []
        for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) tmp.md.upgs[x] = {}
    }
    tmp.md.bd3 = !tmp.c16active && player.md.break.upgs[2].gte(1)
    let mdub = 1
    if (hasElement(115)) mdub *= 1.05
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) {
        let upg = MASS_DILATION.upgs.ids[x]
        tmp.md.upgs[x].cost = upg.cost(player.md.upgs[x])
        tmp.md.upgs[x].bulk = upg.bulk().min(upg.maxLvl||1/0)
        tmp.md.upgs[x].can = player.md.mass.gte(tmp.md.upgs[x].cost) && player.md.upgs[x].lt(upg.maxLvl||1/0)
        if (upg.effect) tmp.md.upgs[x].eff = upg.effect(player.md.upgs[x].mul(mdub))
    }
    tmp.md.pen = MASS_DILATION.penalty()
    tmp.md.rp_exp_gain = MASS_DILATION.RPexpgain()
    tmp.md.rp_mult_gain = MASS_DILATION.RPmultgain()
    tmp.md.rp_gain = MASS_DILATION.RPgain()
    tmp.md.passive_rp_gain = hasTree("qol3")?MASS_DILATION.RPgain(expMult(player.mass,tmp.md.pen)):E(0)
    tmp.md.massSoftcap1 = MASS_DILATION.gainSoftcap1()
    tmp.md.mass_gain = MASS_DILATION.massGain()
    tmp.md.mass_req = MASS_DILATION.mass_req()
    tmp.md.mass_eff = MASS_DILATION.effect()

    updateBDTemp()
}

function updateBDTemp() {
    let bd = tmp.bd

    bd.energyGain = MASS_DILATION.break.energyGain()
    bd.massGain = MASS_DILATION.break.massGain()

    for (let x = 0; x < MASS_DILATION.break.upgs.ids.length; x++) {
        let upg = MASS_DILATION.break.upgs.ids[x]
        bd.upgs[x].cost = upg.cost(player.md.break.upgs[x])
        bd.upgs[x].bulk = upg.bulk().min(upg.maxLvl||1/0)
        bd.upgs[x].can = player.md.break.mass.gte(bd.upgs[x].cost) && player.md.break.upgs[x].lt(upg.maxLvl||1/0)
        if (upg.effect) bd.upgs[x].eff = upg.effect(player.md.break.upgs[x])
    }
}

function updateMDHTML() {
    tmp.el.md_particles.setTxt(format(player.md.particles,0)+(hasTree("qol3")?" "+formatGain(player.md.particles,tmp.md.passive_rp_gain.mul(tmp.preQUGlobalSpeed)):""))
    tmp.el.md_eff.setTxt(tmp.md.bd3 ? "^"+tmp.md.mass_eff.format() : tmp.md.mass_eff.gte(10)?format(tmp.md.mass_eff)+"x":format(tmp.md.mass_eff.sub(1).mul(100))+"%")
    tmp.el.md_mass.setTxt(formatMass(player.md.mass)+" "+formatGain(player.md.mass,tmp.md.mass_gain.mul(tmp.preQUGlobalSpeed),true))
    tmp.el.md_btn.setTxt(player.md.active
        ?(tmp.md.rp_gain.gte(1)?`Cancel for ${format(tmp.md.rp_gain,0)} Relativistic particles`:`Reach ${formatMass(tmp.md.mass_req)} to gain Relativistic particles, or cancel dilation`)
        :"Dilate Mass"
    )
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) {
        let upg = MASS_DILATION.upgs.ids[x]
        let unl = upg.unl?upg.unl():true
        tmp.el["md_upg"+x+"_div"].setVisible(unl)
        if (unl) {
            tmp.el["md_upg"+x+"_div"].setClasses({btn: true, full: true, md: true, locked: !tmp.md.upgs[x].can })
            if ((upg.maxLvl||1/0) > 1) tmp.el["md_upg"+x+"_lvl"].setTxt(format(player.md.upgs[x],0)+(upg.maxLvl!==undefined?" / "+format(upg.maxLvl,0):""))
            if (upg.effDesc) {
                tmp.el["md_upg"+x+"_eff"].setHTML(upg.effDesc(tmp.md.upgs[x].eff))
            }
            tmp.el["md_upg"+x+"_cost"].setTxt(player.md.upgs[x].lt(upg.maxLvl||1/0)?"Cost: "+formatMass(tmp.md.upgs[x].cost):"")
        }
    }

    tmp.el.dmSoft1.setDisplay(player.md.mass.gte(tmp.md.massSoftcap1))
    tmp.el.dmSoftStart1.setTxt(formatMass(tmp.md.massSoftcap1))

    tmp.el.dmOverflow.setDisplay(player.md.mass.gte(tmp.overflow_start.dm))
    tmp.el.dmOverflow.setHTML(`Because of dilated mass overflow at <b>${formatMass(tmp.overflow_start.dm)}</b>, your dilated mass is ${overflowFormat(tmp.overflow.dm||1)}!`)
}

function updateBDHTML() {
    let bd = player.md.break
    let c16 = tmp.c16active

    tmp.el.bd_btn.setTxt(bd.active?"Fix Dilation":"Break Dilation")

    tmp.el.bd_energy.setTxt(bd.energy.format(1)+" "+bd.energy.formatGain(tmp.bd.energyGain))
    tmp.el.bd_mass.setTxt(formatMass(bd.mass)+" "+bd.mass.formatGain(tmp.bd.massGain,true))

    for (let x = 0; x < MASS_DILATION.break.upgs.ids.length; x++) {
        let upg = MASS_DILATION.break.upgs.ids[x]
        let unl = upg.unl?upg.unl():true
        tmp.el["bd_upg"+x+"_div"].setVisible(unl)
        if (unl) {
            tmp.el["bd_upg"+x+"_div"].setClasses({btn: true, full: true, bd: true, locked: !tmp.bd.upgs[x].can, corrupted_text2: x == 2 && c16})
            if ((upg.maxLvl||1/0) > 1) tmp.el["bd_upg"+x+"_lvl"].setTxt(format(bd.upgs[x],0)+(upg.maxLvl!==undefined?" / "+format(upg.maxLvl,0):""))
            if (upg.effDesc) tmp.el["bd_upg"+x+"_eff"].setHTML(upg.effDesc(tmp.bd.upgs[x].eff))
            tmp.el["bd_upg"+x+"_cost"].setTxt(bd.upgs[x].lt(upg.maxLvl||1/0)?"Cost: "+formatMass(tmp.bd.upgs[x].cost):"")
        }
    }
}