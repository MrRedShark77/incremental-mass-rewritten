const BOSONS = {
    names: ['pos_w','neg_w','z_boson','photon','gluon','graviton','hb'],
    gain: {
        pos_w() {
            let x = E(0.01).mul(tmp.bosons.effect.neg_w?tmp.bosons.effect.neg_w[1]:1).mul(tmp.bosons.effect.z_boson?tmp.bosons.effect.z_boson[1]:1).mul(tmp.bosons.effect.graviton?tmp.bosons.effect.graviton[0]:1)
            
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            
            if (QCs.active()) x = x.pow(tmp.qu.qc_eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.c16active || player.dark.run.active) x = expMult(x,mgEff(4)[0])

            return x
        },
        neg_w() {
            let x = E(0.01).mul(tmp.bosons.effect.pos_w?tmp.bosons.effect.pos_w[1]:1).mul(tmp.bosons.effect.z_boson?tmp.bosons.effect.z_boson[1]:1).mul(tmp.bosons.effect.graviton?tmp.bosons.effect.graviton[0]:1)
            
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            
            if (QCs.active()) x = x.pow(tmp.qu.qc_eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.c16active || player.dark.run.active) x = expMult(x,mgEff(4)[0])

            return x
        },
        z_boson() {
            let x = E(0.01).mul(tmp.bosons.effect.graviton?tmp.bosons.effect.graviton[0]:1)
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            if (hasTree("sn4")) x = x.pow(1.5)
            if (QCs.active()) x = x.pow(tmp.qu.qc_eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.c16active || player.dark.run.active) x = expMult(x,mgEff(4)[0])

            return x
        },
        photon() {
            let x = E(0.01).mul(tmp.bosons.effect.graviton?tmp.bosons.effect.graviton[0]:1)
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            if (hasTree("bs2") && tmp.supernova.tree_eff.bs2) x = x.mul(tmp.supernova.tree_eff.bs2[1])
            x = hasElement(204) ? x.pow(tmp.bosons.upgs.photon[2]?tmp.bosons.upgs.photon[2].effect:1) : x.mul(tmp.bosons.upgs.photon[2]?tmp.bosons.upgs.photon[2].effect:1)
            if (QCs.active()) x = x.pow(tmp.qu.qc_eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.c16active || player.dark.run.active) x = expMult(x,mgEff(4)[0])

            return x
        },
        gluon() {
            let x = E(0.01).mul(tmp.bosons.effect.graviton?tmp.bosons.effect.graviton[0]:1)
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            if (hasTree("bs2") && tmp.supernova.tree_eff.bs2) x = x.mul(tmp.supernova.tree_eff.bs2[0])
            x = hasElement(204) ? x.pow(tmp.bosons.upgs.gluon[2]?tmp.bosons.upgs.gluon[2].effect:1) : x.mul(tmp.bosons.upgs.gluon[2]?tmp.bosons.upgs.gluon[2].effect:1)
            if (QCs.active()) x = x.pow(tmp.qu.qc_eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.c16active || player.dark.run.active) x = expMult(x,mgEff(4)[0])

            return x
        },
        graviton() {
            let x = E(0.01).mul(tmp.bosons.effect.graviton?tmp.bosons.effect.graviton[0]:1).mul(tmp.fermions.effs[1][1])
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            if (QCs.active()) x = x.pow(tmp.qu.qc_eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.c16active || player.dark.run.active) x = expMult(x,mgEff(4)[0])

            return x
        },
        hb() {
            let x = E(0.01).mul(tmp.fermions.effs[1][1])
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            if (hasTree("bs1")) x = x.mul(tmp.supernova?tmp.supernova.tree_eff.bs1:1)
            if (QCs.active()) x = x.pow(tmp.qu.qc_eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.c16active || player.dark.run.active) x = expMult(x,mgEff(4)[0])

            return x
        },
    },
    effect: {
        pos_w(x) {
            let a = x.add(1).pow(2e4)
            if (hasTree("qu2") && !player.qu.rip.active) a = a.pow(x.add(1).log10().add(1).pow(4/3).softcap(1e15,0.1,0))
            if (tmp.c16active) a = overflow(a,10,0.5)
            if (hasElement(276)) a = a.max(1).log10().add(1)
            let b = expMult(x.add(1),2/3,2)
a = overflow(a,'ee2500',0.25)
if (hasElement(276)) a = overflow(a,'e6200',0.05)
            return [a,b]
        },
        neg_w(x) {
            let a = x.add(1).log10().add(1).root(3)
            let b = expMult(x.add(1),0.75,2)
            return [a,b]
        },
        z_boson(x) {
            let a = FERMIONS.onActive("14") ? E(1) : x.add(1).log10().add(1).pow(tmp.fermions.effs[0][2])
            if (tmp.c16active) a = a.softcap('e308',0.01,0)
            let b = x.add(1).pow(2/3)
            return [a,b]
        },
        graviton(x) {
            let a = expMult(x.add(1),0.5).pow(tmp.bosons.effect.hb?tmp.bosons.effect.hb[0]:1)
            if (hasBeyondPres(1,3)) a = expMult(x.add(1),0.6).pow(tmp.bosons.effect.hb?tmp.bosons.effect.hb[0]:1)
            return [a]
        },
        hb(x) {
            let a = x.add(1).log10().max(0).root(2).mul(tmp.prim.eff[4])
            if (hasTree("qu10") && !player.qu.rip.active) a = a.mul(treeEff('qu10'))
            if (tmp.c16active) a = a.pow(.2)
            return [a]
        },
    },
    upgs: {
        ids: ['photon','gluon'],
        buy(id,x) {
            if (tmp.bosons.upgs[id][x].can) {
                player.supernova.b_upgs[id][x] = player.supernova.b_upgs[id][x].max(tmp.bosons.upgs[id][x].bulk)
                if (!hasTree("qol7")) player.supernova.bosons[id] = player.supernova.bosons[id].sub(BOSONS.upgs[id][x].cost(tmp.bosons.upgs[id][x].bulk.sub(1))).max(0)
            }
        },
        photon: [
            {
                desc: "Gain more Dark Matters & Mass from Black Hole based on Photon.",
                cost(x) { return E(1.5).pow(x.pow(1.25)).mul(10) },
                bulk(x=player.supernova.bosons.photon) { return x.gte(10) ? x.div(10).max(1).log(1.5).root(1.25).add(1).floor() : E(0) },
                effect(x) {
                    let y = hasElement(204)
                    ?Decimal.pow(1.1,player.supernova.bosons.photon.add(10).log10().log10().add(1).mul(x.add(10).log10()).root(2).sub(1))
                    :player.supernova.bosons.photon.add(1).pow(x.mul(tmp.radiation.bs.eff[7]).pow(0.8).mul(100))
                    if (tmp.c16active) y = overflow(y,10,0.5)
                    return y
                },
                effDesc(x) { return hasElement(204)?"^"+format(x):format(x)+"x" },
            },{
                desc: "Boost BH Condenser Power.",
                cost(x) { return E(2).pow(x.pow(1.25)).mul(100) },
                bulk(x=player.supernova.bosons.photon) { return x.gte(100) ? x.div(100).max(1).log(2).root(1.25).add(1).floor() : E(0) },
                effect(x) {
                    let a = x.add(1).pow(0.75)
                    if (hasTree("fn4")) a = a.pow(2)
                    return a
                },
                effDesc(x) { return format(x)+"x" },
            },{
                desc: "Photons gain is boosted by Collapsed Star.",
                cost(x) { return E(5).pow(x.pow(1.25)).mul(500) },
                bulk(x=player.supernova.bosons.photon) { return x.gte(500) ? x.div(500).max(1).log(5).root(1.25).add(1).floor() : E(0) },
                effect(x) {
                    return hasElement(204)
                    ? Decimal.pow(1.1,player.stars.points.add(10).log10().log10().add(1).mul(x.add(10).log10()).root(2).sub(1))
                    : player.stars.points.add(1).log10().add(1).pow(x.mul(0.2)).softcap(1e15,0.6,0)
                },
                effDesc(x) { return hasElement(204)?"^"+format(x):format(x)+"x"+(x.gte(1e15)?" <span class='soft'>(softcapped)</span>":"") },
            },{
                desc: "All-Star resources gain is boosted by Photon.",
                cost(x) { return E(5).pow(x.pow(1.25)).mul(1e5) },
                bulk(x=player.supernova.bosons.photon) { return x.gte(1e5) ? x.div(1e5).max(1).log(5).root(1.25).add(1).floor() : E(0) },
                effect(i) {
                    let x
                    if (hasElement(213)) {
                        x = player.supernova.bosons.photon.add(1).log10().add(10).log10().mul(i.add(10).log10()).pow(0.75).mul(hasTree('glx12')?tmp.fermions.effs[0][3]:1)
                    } else {
                        x = player.supernova.bosons.photon.add(1).log10().add(1).pow(i.softcap(8000,0.1,0).pow(tmp.fermions.effs[0][3]).mul(0.5)).softcap("ee11",0.8,2).softcap("e4e14",hasElement(99)?0.785:0.75,2)
                        if (!hasElement(99)) x = x.softcap("e4e15",0.5,2)
                    }
                    return x
                },
                effDesc(x) { return hasElement(213)?"^"+format(x):format(x)+"x" },
            },
        ],
        gluon: [
            {
                desc: "Gain more Atoms & Atomic Powers based on Gluon.",
                cost(x) { return E(1.5).pow(x.pow(1.25)).mul(10) },
                bulk(x=player.supernova.bosons.gluon) { return x.gte(10) ? x.div(10).max(1).log(1.5).root(1.25).add(1).floor() : E(0) },
                effect(x) {
                    let y = hasElement(204)
                    ?Decimal.pow(1.1,player.supernova.bosons.gluon.add(10).log10().log10().add(1).mul(x.add(10).log10()).root(2).sub(1))
                    :player.supernova.bosons.gluon.add(1).pow(x.mul(tmp.radiation.bs.eff[7]).pow(0.8).mul(100))
                    if (tmp.c16active) y = overflow(y,10,0.5)
                    return y
                },
                effDesc(x) { return hasElement(204)?"^"+format(x):format(x)+"x" },
            },{
                desc: "Boost Cosmic Ray Power.",
                cost(x) { return E(2).pow(x.pow(1.25)).mul(100) },
                bulk(x=player.supernova.bosons.gluon) { return x.gte(100) ? x.div(100).max(1).log(2).root(1.25).add(1).floor() : E(0) },
                effect(x) {
                    let a = x.add(1).pow(0.75)
                    if (hasTree("fn4")) a = a.pow(2)
                    return a
                },
                effDesc(x) { return format(x)+"x" },
            },{
                desc: "Gluons gain is boosted by Quark.",
                cost(x) { return E(5).pow(x.pow(1.25)).mul(500) },
                bulk(x=player.supernova.bosons.gluon) { return x.gte(500) ? x.div(500).max(1).log(5).root(1.25).add(1).floor() : E(0) },
                effect(x) {
                    return hasElement(204)
                    ? Decimal.pow(1.1,player.atom.quarks.add(10).log10().log10().add(1).mul(x.add(10).log10()).root(2).sub(1))
                    : player.atom.quarks.add(1).log10().add(1).pow(x.mul(0.125)).softcap(1e15,0.6,0)
                },
                effDesc(x) { return hasElement(204)?"^"+format(x):format(x)+"x"+(x.gte(1e15)?" <span class='soft'>(softcapped)</span>":"") },
            },{
                desc: "Supernova requirement is decreased based on Gluon.",
                cost(x) { return E(10).pow(x.pow(1.25)).mul(1e5) },
                bulk(x=player.supernova.bosons.gluon) { return x.gte(1e5) ? x.div(1e5).max(1).log(10).root(1.25).add(1).floor() : E(0) },
                effect(x) {
                    let y = player.supernova.bosons.gluon.add(1).log10().add(1).log10().mul(x.pow(tmp.fermions.effs[0][3]).root(3)).div(10).add(1)
                    if (!hasPrestige(0,28)) y = y.softcap(5.5,0.25,0).softcap(10,0.25,0)
                    return y
                },
                effDesc(x) { return "/"+format(x)+(x.gte(5.5)&&!hasPrestige(0,28)?" <span class='soft'>(softcapped)</span>":"") },
            },
        ],
    },
}

function setupBosonsHTML() {
    for (let x in BOSONS.upgs.ids) {
        let id = BOSONS.upgs.ids[x]
        let new_table = new Element(id+"_upgs_table")
        let table = ""
        for (let y in BOSONS.upgs[id]) {
            let id2 = id+"_upg"+y
            table += `
            <button class="btn b_btn full" id="${id2}_div" onclick="BOSONS.upgs.buy('${id}',${y})">
                <div style="min-height: 80px">
                    [Level <span id="${id2}_lvl">X</span>]<br>
                    ${BOSONS.upgs[id][y].desc}<br>
                    Currently: <span id="${id2}_eff">X</span><br>
                </div>
                Cost: <span id="${id2}_cost">X</span> ${capitalFirst(id)}
            </button>
            `
        }
        new_table.setHTML(table)
    }
}

function updateBosonsTemp() {
    if (!tmp.bosons) {
        tmp.bosons = {
            gain: {},
            effect: {},
            upgs: {},
        }
        for (let x in BOSONS.upgs.ids) tmp.bosons.upgs[BOSONS.upgs.ids[x]] = []
    }
    for (let x in BOSONS.names) {
        let id = BOSONS.names[x]
        tmp.bosons.gain[id] = BOSONS.gain[id]?BOSONS.gain[id]():E(0)
        if (BOSONS.effect[id]) tmp.bosons.effect[id] = BOSONS.effect[id](player.supernova.bosons[id])

        if (BOSONS.upgs.ids.includes(id)) for (let y in BOSONS.upgs[id]) {
            let upg = BOSONS.upgs[id][y]
            tmp.bosons.upgs[id][y] = {
                cost: upg.cost(player.supernova.b_upgs[id][y]),
                bulk: upg.bulk(),
                effect: upg.effect(FERMIONS.onActive("04") ? E(0) : player.supernova.b_upgs[id][y]),
            }
            tmp.bosons.upgs[id][y].can = player.supernova.bosons[id].gte(tmp.bosons.upgs[id][y].cost)
        }
    }
}

function updateBosonsHTML() {
    let c16 = tmp.c16active
    tmp.el.w_boson1.setClasses({corrupted_text2: c16})
    tmp.el.higgs_bosons.setClasses({corrupted_text2: c16})
 tmp.el.changeEff.setTxt(hasElement(276)?' exponents':" multiply")
    for (let x in BOSONS.names) {
        let id = BOSONS.names[x]
        tmp.el[id+"_amt"].setTxt(format(player.supernova.bosons[id])+" "+formatGain(player.supernova.bosons[id],tmp.bosons.gain[id].mul(tmp.preQUGlobalSpeed)))
        if (tmp.bosons.effect[id]) for (let y in tmp.bosons.effect[id]) tmp.el[id+"_eff"+y].setTxt(format(tmp.bosons.effect[id][y]))

        if (BOSONS.upgs.ids.includes(id)) for (let y in BOSONS.upgs[id]) {
            let id2 = id+"_upg"+y
            tmp.el[id2+"_div"].setClasses({btn: true, full: true, b_btn: true, locked: !tmp.bosons.upgs[id][y].can})
            tmp.el[id2+"_lvl"].setTxt(format(player.supernova.b_upgs[id][y],0))
            tmp.el[id2+"_eff"].setHTML(BOSONS.upgs[id][y].effDesc(tmp.bosons.upgs[id][y].effect))
            tmp.el[id2+"_eff"].setClasses({corrupted_text2: c16 && y == 0})
            tmp.el[id2+"_cost"].setTxt(format(tmp.bosons.upgs[id][y].cost))
        }
    }
}