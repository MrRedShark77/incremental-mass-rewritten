const BOSONS = {
    names: ['pos_w','neg_w','z_boson','photon','gluon','graviton','hb'],
    gain: {
        pos_w() {
            let x = E(0.1).mul(tmp.sn.boson.effect.neg_w?tmp.sn.boson.effect.neg_w[1]:1).mul(tmp.sn.boson.effect.z_boson?tmp.sn.boson.effect.z_boson[1]:1).mul(tmp.sn.boson.effect.graviton?tmp.sn.boson.effect.graviton[0]:1)
            
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            
            if (QCs.active()) x = x.pow(tmp.qu.qc.eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.dark.run) x = expMult(x,mgEff(4)[0])

            return x
        },
        neg_w() {
            let x = E(0.1).mul(tmp.sn.boson.effect.pos_w?tmp.sn.boson.effect.pos_w[1]:1).mul(tmp.sn.boson.effect.z_boson?tmp.sn.boson.effect.z_boson[1]:1).mul(tmp.sn.boson.effect.graviton?tmp.sn.boson.effect.graviton[0]:1)
            
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            
            if (QCs.active()) x = x.pow(tmp.qu.qc.eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.dark.run) x = expMult(x,mgEff(4)[0])

            return x
        },
        z_boson() {
            let x = E(0.1).mul(tmp.sn.boson.effect.graviton?tmp.sn.boson.effect.graviton[0]:1)
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            if (hasTree("sn4")) x = x.pow(1.5)
            if (QCs.active()) x = x.pow(tmp.qu.qc.eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.dark.run) x = expMult(x,mgEff(4)[0])

            return x
        },
        photon() {
            let x = E(0.1).mul(tmp.sn.boson.effect.graviton?tmp.sn.boson.effect.graviton[0]:1)
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            if (hasTree("bs2")) x = x.mul(treeEff("bs2")[1])
            x = hasElement(204) ? x.pow(tmp.sn.boson.upgs.photon[2]?tmp.sn.boson.upgs.photon[2].effect:1) : x.mul(tmp.sn.boson.upgs.photon[2]?tmp.sn.boson.upgs.photon[2].effect:1)
            if (QCs.active()) x = x.pow(tmp.qu.qc.eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.dark.run) x = expMult(x,mgEff(4)[0])

            return x
        },
        gluon() {
            let x = E(0.1).mul(tmp.sn.boson.effect.graviton?tmp.sn.boson.effect.graviton[0]:1)
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            if (hasTree("bs2")) x = x.mul(treeEff("bs2")[0])
            x = hasElement(204) ? x.pow(tmp.sn.boson.upgs.gluon[2]?tmp.sn.boson.upgs.gluon[2].effect:1) : x.mul(tmp.sn.boson.upgs.gluon[2]?tmp.sn.boson.upgs.gluon[2].effect:1)
            if (QCs.active()) x = x.pow(tmp.qu.qc.eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.dark.run) x = expMult(x,mgEff(4)[0])

            return x
        },
        graviton() {
            let x = E(0.1).mul(tmp.sn.boson.effect.graviton?tmp.sn.boson.effect.graviton[0]:1).mul(fermEff(1, 1))
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            if (QCs.active()) x = x.pow(tmp.qu.qc.eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.dark.run) x = expMult(x,mgEff(4)[0])

            return x
        },
        hb() {
            let x = E(0.1).mul(fermEff(1, 1))
            if (hasTree('ct2')) x = x.mul(treeEff('ct2'))
            if (hasTree("bs1")) x = x.mul(treeEff("bs1"))
            if (QCs.active()) x = x.pow(tmp.qu.qc.eff[3])
            if (hasPrestige(1,3)) x = x.pow(prestigeEff(1,3))

            if (tmp.dark.run) x = expMult(x,mgEff(4)[0])

            return x
        },
    },
    effect: {
        pos_w(x) {
            let a = x.add(1).pow(2e4)
            if (hasTree("qu2") && !player.qu.rip.active) a = a.pow(x.add(1).log10().add(1).pow(4/3).softcap(1e15,0.1,0))
            if (tmp.c16.in) a = overflow(a,10,0.5)
            if (EVO.amt >= 2) a = a.min(E(10).pow(Number.MAX_VALUE))
            let b = expMult(x.add(1),2/3,2)
            let c = E(1)
            if (hasElement(250)) c = x.add(1).log10().add(1).root(EVO.amt >= 2 ? 20 : 10)
            return [a,b,c]
        },
        neg_w(x) {
            let a = x.add(1).log10().add(1).root(3)
            let b = expMult(x.add(1),0.75,2)
            return [a,b]
        },
        z_boson(x) {
            let a = FERMIONS.onActive("14") ? E(1) : x.add(1).log10().add(1).pow(fermEff(0, 2))
            if (tmp.c16.in) a = a.softcap('e308',0.01,0)
            let b = x.add(1).pow(2/3)
            return [a,b]
        },
        graviton(x) {
            let a = expMult(x.add(1),0.5).pow(tmp.sn.boson.effect.hb?tmp.sn.boson.effect.hb[0]:1)
            if (EVO.amt < 2) a = a.overflow('eee3',0.5,2)
            return [a]
        },
        hb(x) {
            let a = x.add(1).log10().max(0).root(2).mul(tmp.qu.prim.eff[4])
            if (hasTree("qu10") && !player.qu.rip.active) a = a.mul(treeEff('qu10'))
            if (tmp.c16.in) a = a.pow(.2)
            return [a.overflow('e700',0.5)]
        },
    },
    upgs: {
        ids: ['photon','gluon'],
        buy(id,x) {
            if (tmp.sn.boson.upgs[id][x].can) {
                player.supernova.b_upgs[id][x] = player.supernova.b_upgs[id][x].max(tmp.sn.boson.upgs[id][x].bulk)
                if (!hasTree("qol7")) player.supernova.bosons[id] = player.supernova.bosons[id].sub(BOSONS.upgs[id][x].cost(tmp.sn.boson.upgs[id][x].bulk.sub(1))).max(0)
            }
        },
        photon: [
            {
                desc: "Gain more Dark Matters & Mass from Black Hole based on Photon.",
                get unl() { return EVO.amt < 2 },
                cost(x) { return E(1.5).pow(x.pow(1.25)).mul(10) },
                bulk(x=player.supernova.bosons.photon) { return x.gte(10) ? x.div(10).max(1).log(1.5).root(1.25).add(1).floor() : E(0) },
                effect(x) {
                    let y = hasElement(204)
                    ?Decimal.pow(1.1,player.supernova.bosons.photon.add(10).log10().log10().add(1).mul(x.add(10).log10()).root(2).sub(1))
                    :player.supernova.bosons.photon.add(1).pow(x.mul(radBoostEff(7)).pow(0.8).mul(100))
                    if (tmp.c16.in) y = overflow(y,10,0.5)
                    return y
                },
                effDesc(x) { return hasElement(204)?formatPow(x):format(x)+"x" },
            },{
                desc: "Boost BH Condenser Power.",
                get unl() { return EVO.amt < 2 },
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
                effDesc(x) { return hasElement(204)?formatPow(x):format(x)+"x"+(x.gte(1e15)?" <span class='soft'>(softcapped)</span>":"") },
            },{
                desc: "All-Star resources gain is boosted by Photon.",
                cost(x) { return E(5).pow(x.pow(1.25)).mul(1e5) },
                bulk(x=player.supernova.bosons.photon) { return x.gte(1e5) ? x.div(1e5).max(1).log(5).root(1.25).add(1).floor() : E(0) },
                effect(i) {
                    let x
                    if (hasElement(213)) {
                        x = player.supernova.bosons.photon.add(1).log10().add(10).log10().mul(i.add(10).log10()).pow(0.75)
                        if (hasElement(23,1)) x = x.pow(fermEff(0, 3).log10().add(1).root(2))
                    } else {
                        x = player.supernova.bosons.photon.add(1).log10().add(1).pow(i.softcap(8000,0.1,0).pow(fermEff(0, 3)).mul(0.5)).softcap("ee11",0.8,2).softcap("e4e14",hasElement(99)?0.785:0.75,2)
                        if (!hasElement(99)) x = x.softcap("e4e15",0.5,2)
                        x = x.min('ee300')
                    }
                    return x
                },
                effDesc(x) { return hasElement(213)?formatPow(x):format(x)+"x" },
            },{
                desc: "Boost Fabric.",
                get unl() { return EVO.amt >= 2 },
                cost(x) { return E(1e5).pow(x.pow(1.5)) },
                bulk(x=player.supernova.bosons.photon) { return x.gte(1) ? x.log(1e5).root(1.5).add(1).floor() : E(0) },
                effect: x => x.add(1).overflow('e50000',0.5),
                effDesc(x) { return formatMult(x) },
            },{
                desc: "Raise Wormhole Multiplier.",
                get unl() { return EVO.amt >= 2 },
                cost(x) { return E(1e5).pow(x.pow(5).add(1)) },
                bulk(x=player.supernova.bosons.photon) { return x.gte(1e5) ? x.sub(1).log(1e5).root(5).add(1).floor() : E(0) },
                effect: x => x.add(1).overflow('e20000',0.5),
                effDesc(x) { return formatPow(x) },
            },
        ],
        gluon: [
            {
                desc: "Gain more Atoms & Atomic Powers based on Gluon.",
                get unl() { return EVO.amt < 3 },
                cost(x) { return E(1.5).pow(x.pow(1.25)).mul(10) },
                bulk(x=player.supernova.bosons.gluon) { return x.gte(10) ? x.div(10).max(1).log(1.5).root(1.25).add(1).floor() : E(0) },
                effect(x) {
                    let y = hasElement(204)
                    ?Decimal.pow(1.1,player.supernova.bosons.gluon.add(10).log10().log10().add(1).mul(x.add(10).log10()).root(2).sub(1))
                    :player.supernova.bosons.gluon.add(1).pow(x.mul(radBoostEff(7)).pow(0.8).mul(100))
                    if (tmp.c16.in) y = overflow(y,10,0.5)
                    return y
                },
                effDesc(x) { return hasElement(204)?formatPow(x):format(x)+"x" },
            },{
                desc: "Boost Cosmic Ray Power.",
                get unl() { return EVO.amt < 3 },
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
                effDesc(x) { return hasElement(204)?formatPow(x):format(x)+"x"+(x.gte(1e15)?" <span class='soft'>(softcapped)</span>":"") },
            },{
                desc: "Supernova requirement is decreased based on Gluon.",
                get unl() { return EVO.amt < 2 },
                cost(x) { return E(10).pow(x.pow(1.25)).mul(1e5) },
                bulk(x=player.supernova.bosons.gluon) { return x.gte(1e5) ? x.div(1e5).max(1).log10().root(1.25).add(1).floor() : E(0) },
                effect(x) {
                    let y = player.supernova.bosons.gluon.add(1).log10().add(1).log10().mul(x.pow(fermEff(0, 3)).root(3)).div(10).add(1)
                    if (!hasPrestige(0,28)) y = y.softcap(5.5,0.25,0).softcap(10,0.25,0)
                    return y
                },
                effDesc(x) { return "/"+format(x)+(x.gte(5.5)&&!hasPrestige(0,28)?" <span class='soft'>(softcapped)</span>":"") },
            },{
                desc: "Boost Protostars.",
                get unl() { return EVO.amt >= 3 },
                cost(x) { return E(1e5).pow(x.pow(3).add(1)) },
                bulk(x=player.supernova.bosons.gluon) { return x.gte(1e5) ? x.sub(1).log(1e5).root(3).add(1).floor() : E(0) },
                effect: x => x.add(1).overflow('e25000',0.5),
                effDesc(x) { return formatMult(x) },
            },{
                desc: "Gain more nebular dusts based on Gluon.",
                get unl() { return EVO.amt >= 3 },
                cost(x) { return E(1e10).pow(x.pow(1.5).add(1)) },
                bulk(x=player.supernova.bosons.gluon) { return x.gte(1e10) ? x.sub(1).log(1e10).root(1.5).add(1).floor() : E(0) },
                effect: x => expMult(player.supernova.bosons.gluon.add(1).log10().add(1).pow(x.add(1).log10()),0.5),
                effDesc(x) { return formatMult(x) },
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
    if (!tmp.sn.boson) {
        tmp.sn.boson = {
            gain: {},
            effect: {},
            upgs: {},
        }
        for (let x in BOSONS.upgs.ids) tmp.sn.boson.upgs[BOSONS.upgs.ids[x]] = []
    }
    for (let x in BOSONS.names) {
        let id = BOSONS.names[x]
        tmp.sn.boson.gain[id] = BOSONS.gain[id]?BOSONS.gain[id]():E(0)
        if (BOSONS.effect[id]) tmp.sn.boson.effect[id] = BOSONS.effect[id](player.supernova.bosons[id])

        if (BOSONS.upgs.ids.includes(id)) for (let y in BOSONS.upgs[id]) {
            let upg = BOSONS.upgs[id][y]
            let unl = upg.unl ?? true
            tmp.sn.boson.upgs[id][y] = {
                cost: upg.cost(player.supernova.b_upgs[id][y]),
                bulk: upg.bulk(),
                unl,
                effect: upg.effect(FERMIONS.onActive("04") || !unl ? E(0) : player.supernova.b_upgs[id][y]),
            }
            tmp.sn.boson.upgs[id][y].can = player.supernova.bosons[id].gte(tmp.sn.boson.upgs[id][y].cost)
        }
    }
}

function updateBosonsHTML() {
    let c16 = tmp.c16.in
    tmp.el.w_boson1.setClasses({corrupted_text2: c16})
    tmp.el.higgs_bosons.setClasses({corrupted_text2: c16})

    for (let x in BOSONS.names) {
        let id = BOSONS.names[x]
        tmp.el[id+"_amt"].setTxt(format(player.supernova.bosons[id])+" "+formatGain(player.supernova.bosons[id],tmp.sn.boson.gain[id].mul(tmp.qu.speed)))
        if (tmp.sn.boson.effect[id]) for (let y in tmp.sn.boson.effect[id]) {
            if (y == '2' && id == 'pos_w') tmp.el[id+"_eff"+y].setHTML(hasElement(250) ? ',<br>and raise mass gain by ' + format(tmp.sn.boson.effect[id][y]) : '')
            else tmp.el[id+"_eff"+y].setTxt(format(tmp.sn.boson.effect[id][y]))
        }

        if (BOSONS.upgs.ids.includes(id)) for (let y in BOSONS.upgs[id]) {
            let id2 = id+"_upg"+y
            tmp.el[id2+"_div"].setDisplay(tmp.sn.boson.upgs[id][y].unl)
            tmp.el[id2+"_div"].setClasses({btn: true, full: true, b_btn: true, locked: !tmp.sn.boson.upgs[id][y].can})
            tmp.el[id2+"_lvl"].setTxt(format(player.supernova.b_upgs[id][y],0))
            tmp.el[id2+"_eff"].setHTML(BOSONS.upgs[id][y].effDesc(tmp.sn.boson.upgs[id][y].effect))
            tmp.el[id2+"_eff"].setClasses({corrupted_text2: c16 && y == 0})
            tmp.el[id2+"_cost"].setTxt(format(tmp.sn.boson.upgs[id][y].cost))
        }
    }
}

function bosonEff(x, def = 1) {
	return tmp.sn.boson?.effect[id] ?? E(def)
}

function bosonUEff(x, def = 1) {
	return tmp.sn.boson?.upgs[id][y].effect ?? E(def)
}