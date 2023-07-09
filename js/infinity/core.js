const CORE = {
    mass: {
        title: `Newton Theorem`,
        icon: `N`,
        preEff: [
            `Boost normal mass gain.`,
            `Boost normal mass overflow starting.`,
            `Make pre-beyond ranks cheaper.`,
            `Increase the exponent of prestige base.`,
            `Make Prestige Ranks cheaper (Except: Prestige Level and Valor).`,
            `Add more C17 completions.`,
            `?.`,
            `?.`,
        ],
        res: `Normal Mass`,
        boost() {return player.mass.add(1).log10().add(1).log10().add(1).log10().add(1).toNumber()},
        eff: [
            s => {
                let x = Decimal.pow(s+1,s**0.5)

                return overflow(x,100,0.5)
            },
            s => {
                let x = Decimal.pow(s+1,s**0.5*2)

                return overflow(x,100,0.5)
            },
            s => {
                let x = Decimal.root(s**0.5/10+1,2)

                return x
            },
            s => {
                let x = s**0.5

                return x
            },
            s => {
                let x = Decimal.root(s**0.35/5+1,2)
                return x.max(1)
            },
            s => {
                let x = s**0.85

                return Math.floor(x)
            },
            s => {
                let x = E(1).pow(s)

                return x
            },
            s => {
                let x = E(1).pow(s)

                return x
            },
        ],
        effDesc: [
            x => "^"+format(x),
            x => "^"+format(x),
            x => formatMult(x),
            x => "+"+format(x),
            x => formatMult(x),
            x => "+"+format(x),
            x => formatMult(x),
            x => formatMult(x),
        ],
    },
    bh: {
        title: `Hawking Theorem`,
        icon: `Λ`,
        preEff: [
            `Boost mass of BH gain (weaker in C16).`,
            `Boost BH mass overflow starting (weaker in C16).`,
            `Weaken unstable BH decreasing.`,
            `Boost FVM's power.`,
            `Boost BH mass overflow^2-3 starting (weaker in C16).`,
            `Boost Parallel Extruder's power.`,
            `?.`,
            `?.`,
        ],
        res: `Mass of Black Hole`,
        boost() {return player.bh.mass.add(1).log10().add(1).log10().add(1).log10().add(1).toNumber()},
        eff: [
            s => {
                let x = Decimal.pow(s+1,s**0.5)
                
                x = overflow(x,100,0.5)

                if (tmp.c16active) x = x.log10().add(1)

                return x
            },
            s => {
                let x = Decimal.pow(s+1,s**0.5*2)

                x = overflow(x,100,0.5)

                if (tmp.c16active) x = x.log10().add(1)

                return x
            },
            s => {
                let x = Math.pow(1+Math.log10(s+1)/100,-1)

                return x
            },
            s => {
                let x = Decimal.root(s+1,2)

                return overflow(x,10,0.5)
            },
            s => {
                let x = Decimal.pow(s+1,s**0.75*2)

                x = overflow(x,100,0.5)

                if (tmp.c16active) x = x.log10().add(1)

                return x
            },
            s => {
                let x = Decimal.pow(1.05,Math.log10(s+1))

                return x
            },
            s => {
                let x = E(1).pow(s)

                return x
            },
            s => {
                let x = E(1).pow(s)

                return x
            },
        ],
        effDesc: [
            x => "^"+format(x),
            x => "^"+format(x),
            x => formatReduction(x),
            x => formatMult(x),
            x => "^"+format(x),
            x => formatMult(x),
            x => formatMult(x),
            x => formatMult(x),
        ],
    },
    atom: {
        title: `Dalton Theorem`,
        icon: `Ξ`,
        preEff: [
            `Boost quarks gain.`,
            `Boost quark & atomic power overflows starting.`,
            `Increase overpower's power.`,
            `Increase accelerator's power.`,
            `Boost Kaons & Pions gain.`,
            `Increase Ascension base.`,
            `?.`,
            `?.`,
        ],
        res: `Exotic Atom`,
        boost() {return tmp.exotic_atom.amount.add(1).log10().add(1).log10().add(1).mul(hasTree('glx8')?treeEff('glx8'):1).toNumber()},
        eff: [
            s => {
                let x = Decimal.pow(s+1,s**0.5)
                
                x = overflow(x,100,0.5)
                x = overflow(x,'1e120',0.25)
                x = overflow(x,'1e170',0.25)
                return x
            },
            s => {
                let x = Decimal.pow(s+1,s**0.5*2)

                x = overflow(x,100,0.5)
                x = overflow(x,'1e120',0.25)
                x = overflow(x,'1e170',0.25)
                return x
            },
            s => {
                let x = s**0.25/10000

                return x
            },
            s => {
                let x = s**0.25/10000

                return x
            },
            s => {
                let x = Decimal.pow(s-1,s**0.35)
                
                x = overflow(x,100,0.5)

                return x
            },
            s => {
                let x = Decimal.pow(s-1,s**0.05*0.025).div(30)

                x = overflow(x,0.05,0.5)
                return x
            },
            s => {
                let x = E(1).pow(s)

                return x
            },
            s => {
                let x = E(1).pow(s)

                return x
            },
        ],
        effDesc: [
            x => "^"+format(x),
            x => "^"+format(x),
            x => "+"+format(x),
            x => "+"+format(x),
            x => "x"+format(x),
            x => "+"+format(x),
            x => formatMult(x),
            x => formatMult(x),
        ],
    },
    proto: {
        title: `Protoversal Theorem`,
        icon: `Π`,
        preEff: [
            `Make cosmic string cheaper.`,
            `Strengthen primordium particles.`,
            `Weaken each “entropic” reward scaling.`,
            `Weaken QC modifications.`,
            `Antimatter Generator' power is better.`,
            `Add free Overpower levels.`,
            `?.`,
            `?.`,
        ],
        res: `Quantum Foam`,
        boost() {return player.qu.points.add(1).log10().add(1).log10().add(1).toNumber()},
        eff: [
            s => {
                let x = Math.log10(s+1)/2+1

                return x
            },
            s => {
                let x = Decimal.pow(1.25,Math.log10(s+1))

                return x
            },
            s => {
                let x = Math.pow(1+Math.log10(s+1)/100,-1)

                return x
            },
            s => {
                let x = Math.pow(1+Math.log10(s+1)/10,-1)

                return x
            },
            s => {
                let x = Math.log10(s+3)/1.5+1

                return x
            },
            s => {
                let x = Math.log10(s+3)/2+1

                return Math.floor(x)
            },
            s => {
                let x = E(1).pow(s)

                return x
            },
            s => {
                let x = E(1).pow(s)

                return x
            },
        ],
        effDesc: [
            x => formatMult(x),
            x => formatPercent(x-1),
            x => formatReduction(x),
            x => formatReduction(x),
            x => formatMult(x),
            x => "+"+format(x),
            x => formatMult(x),
            x => formatMult(x),
        ],
    },
    time: {
        title: `Einstein Theorem`,
        icon: `Δ`,
        preEff: [
            `Boost pre-infinity global speed.`,
            `Boost pre-quantum global speed.`,
            `Boost dark shadow & abyssal blot gains.`,
            `Weaken each glyphic mass nerfing.`,
            `Boost dark ray gains.`,
            `Meta-Prestige Level starts later.`,
            `?.`,
            `?.`,
        ],
        res: `Corrupted Shard`,
        boost() {let x = player.dark.c16.totalS.add(1).log10().add(1).log10().add(1).toNumber()
            if (hasElement(296)) x = player.dark.c16.totalS.log(1.1).add(1).toNumber()
            return x},
        eff: [
            s => {
                let x = s+1

                return x
            },
            s => {
                let x = Math.log10(s+1)**0.5/100+1

                return x
            },
            s => {
                let x = Math.log10(s+1)/100+1

                return x
            },
            s => {
                let x = Math.pow(1+Math.log10(s+1)/100,-1)

                return x
            },
            s => {
                let x = Decimal.pow(1.25,Math.log2(s+1))

                return x
            },
            s => {
                let x = E(Math.log10(s+1)/100+1)
                x = overflow(x,1.125,0.05)
                return x
            },
            s => {
                let x = E(1).pow(s)

                return x
            },
            s => {
                let x = E(1).pow(s)

                return x
            },
        ],
        effDesc: [
            x => formatMult(x),
            x => "^"+format(x),
            x => "^"+format(x),
            x => formatReduction(x),
            x => formatMult(x),
            x => "^"+format(x),
            x => formatMult(x),
            x => formatMult(x),
        ],
    },
}

const CORE_CHANCE_MIN = 0.1
const CORE_CHANCE_BASE = 1-CORE_CHANCE_MIN
const CORE_TYPE = Object.keys(CORE)

const MAX_CORE_LENGTH = 8
const MIN_CORE_LENGTH = 4
const MAX_INV_LENGTH = 100
const MAX_DOTS_LENGTH = 4

const MAX_CORE_FIT = 1

var core_tmp = {}
var core_weight = {}

function resetCoreTemp() {
    for (let i in CORE) {
        core_tmp[i] = {
            total_s: [0,0,0,0,0,0],
            total_p: 1,
        }

        core_weight[i] = 0
    }
}

resetCoreTemp()

var t_choosed = "-"

debug.generateTheorem = (chance=CORE_CHANCE_MIN) => {
    let c = []
    let a = MAX_DOTS_LENGTH
    if (hasElement(275)) a += 1
    if (hasElement(283)) a += 1
    while (c.length == 0) {
        let m = [], n = false
        for (let i = 0; a; i++) {
            m[i] = Math.random()
            if (m[i] < chance) n = true
        }
        if (n) c = m
    }
    let t = CORE_TYPE[Math.floor(Math.random() * CORE_TYPE.length)], s = ""
    let p = 1+Math.random()/5

    for (let i = 0; i < a; i++) s += `<iconify-icon icon="${c[i]<chance?'ic:baseline-star':'ic:baseline-star-border'}" width="18"></iconify-icon>`

    tmp.el.theorem_debug.setHTML(`
    <div class="theorem_div ${t}">
        <iconify-icon icon="${CORE[t].icon}" width="45"></iconify-icon>
        <div class="c_pow">${format(p*100,0)}%</div>
        <div class="c_lvl">${format(10*Math.random()+1,0)}</div>
        <div>
            ${s}
        </div>
    </div>
    `)
}

debug.addRandomTheorem = (level=1,power=1,max_chance=CORE_CHANCE_MIN) => {
    let c = []
    let a = MAX_DOTS_LENGTH
    if (hasElement(275)) a += 1
    if (hasElement(283)) a += 1
    while (c.length == 0) {
        let m = [], n = false
        for (let i = 0; i < a; i++) {
            m[i] = Math.random()
            if (m[i] < max_chance) n = true
        }
        if (n) c = m
    }

    addTheorem(CORE_TYPE[Math.floor(Math.random() * CORE_TYPE.length)],c,level,power,max_chance)
}

function theoremEff(t,i,def=1) { return tmp.core_eff[t][i]||def }

// setInterval(debug.generateTheorem,1000)

function getTheoremHTML(data,sub=false) {
    let s = ""
    let a = MAX_DOTS_LENGTH
    if (hasElement(275)) a += 1
    if (hasElement(283)) a += 1
    for (let i = 0; i < a; i++) s += `<div>${data.star[i]?"◉":""}</div>`
    let w = `
    <div class="c_type">${CORE[data.type].icon}</div>
    <div class="c_pow">${format(data.power*100,0)}%</div>
    <div class="c_lvl">${format(data.level,0)}</div>
    <div>${s}</div>
    `
    return sub?w:`
    <div class="theorem_div ${data.type} tooltip" tooltip-pos="bottom" tooltip-pos="bottom" tooltip-html="The J">
        ${w}
    </div>
    `
}

function getTheoremPreEffects(t,s) {
    let e = ""
    let a = MAX_DOTS_LENGTH
    if (hasElement(275)) a += 1
    if (hasElement(283)) a += 1
    for (let i = 0; i < a; i++) if (s[i]) e += CORE[t].preEff[i]+"<br>"
    return e+`(Based on <b>${CORE[t].res}</b>)`
}

function setupCoreHTML() {
    let h = `<div id="preTReq"></div>`

    for (let i = 0; i < 4; i++) {
        h += `
        <div id="preT${i}" class="theorem_div tooltip" tooltip-pos="bottom" onclick="choosePreTheorem(${i})"></div>
        `
    }

    new Element('pre_theorem').setHTML(h)

    h = ``

    for (let i = 0; i < MAX_CORE_LENGTH; i++) {
        h += `
        <div id="coreT${i}" class="theorem_div tooltip" onclick="chooseTheorem('${i}',true)"></div>
        `
    }

    new Element('theorem_table').setHTML(h)

    h = ``

    for (let i = 0; i < MAX_INV_LENGTH; i++) {
        h += `
        <div>
            <div id="invT${i}" class="theorem_div tooltip" onclick="chooseTheorem('${i}')"></div>
        </div>
        `
    }

    new Element('theorem_inv_table').setHTML(h)
}

function getCoreChance() { return 1-CORE_CHANCE_BASE**Math.floor(tmp.core_lvl)**0.4 }
function getPowerMult() { if (hasAscension(0,6)) return Math.floor(tmp.core_lvl-1)**0.5/100 * (ascensionEff(0,6) * tmp.grade.eff[1][1]) 
else return Math.floor(tmp.core_lvl-1)**0.5/100}

function updateCoreHTML() {
    let reached = player.inf.reached

    tmp.el.preTReq.setDisplay(!reached)
    tmp.el.maxLevel.setTxt(format(player.inf.theorem_max,0))

    let lvl = tmp.core_lvl, fl = Math.floor(lvl)
    tmp.el.pt_lvl.setHTML(`<b>${format(fl,0)}</b> (${formatPercent(lvl-fl)})`)

    let chance = getCoreChance(), pm = getPowerMult()

    for (let i = 0; i < player.inf.pre_theorem.length; i++) {
        let pt = tmp.el['preT'+i]
        pt.setDisplay(reached)

        if (!reached) continue

        let p = player.inf.pre_theorem[i], s = p.star_c.map(x => x < chance)
        pt.setClasses({theorem_div:true, tooltip:true, [p.type]:true, choosed: player.inf.pt_choosed == i})
        pt.setHTML(getTheoremHTML({type: p.type, level: fl, power: Math.round(100+pm*p.power_m*100)/100, star: s},true))

        pt.setTooltip(`
        <h3>${CORE[p.type].title}</h3>
        <br class='line'>
        ${getTheoremPreEffects(p.type,s)}
        `)
    }
    
    tmp.el.preTReq.setHTML(`Reach over <b>${formatMass(INF.req)}</b> of normal mass to show theorems that you will choose.`)
}

function updateTheoremCore() {
    resetCoreTemp()

    for (let i = 0; i < MAX_CORE_LENGTH; i++) {
        let u = i < tmp.min_core_len
        let t = tmp.el['coreT'+i]

        t.setDisplay(u)
        if (!u) continue

        let p = player.inf.core[i]

        t.setClasses(p?{theorem_div:true, tooltip:true, [p.type]:true, choosed: i+"c" == t_choosed}:{theorem_div:true})

        t.setHTML(p?getTheoremHTML(p,true):"")

        if (p) {
            let a = MAX_DOTS_LENGTH
            if (hasElement(275)) a += 1
            if (hasElement(283)) a += 1
            let type = p.type, l = p.level, s = p.star, ct = core_tmp[type]
            ct.total_p *= p.power
            for (let i = 0; i < a; i++) ct.total_s[i] += l * s[i]

            t.setTooltip(`
            <h3>${CORE[type].title}</h3>
            <br class='line'>
            ${getTheoremPreEffects(type,s)}
            `)

            core_weight[type]++
        }
    }
}

function updateTheoremInv() {
    for (let i = 0; i < MAX_INV_LENGTH; i++) {
        let t = tmp.el['invT'+i]
        let p = player.inf.inv[i]

        t.setClasses(p?{theorem_div:true, tooltip:true, [p.type]:true, choosed: i == t_choosed}:{theorem_div:true})

        t.setHTML(p?getTheoremHTML(p,true):"")

        t.setTooltip(p?`
        <h3>${CORE[p.type].title}</h3>
        <br class='line'>
        ${getTheoremPreEffects(p.type,p.star)}
        `:"")
    }
}

function removeTheorem() {
    if (t_choosed.includes('c') || t_choosed == '-') return

   if (player.confirms.inf) createConfirm("Are you sure you want to remove the selected theorem?",'remove_selected',()=>{
        delete player.inf.inv[t_choosed]

        t_choosed = '-'

        updateTheoremInv()
    })
    else {delete player.inf.inv[t_choosed]

    t_choosed = '-'

    updateTheoremInv()}
}

function createPreTheorem() {
    let c = [], t = CORE_TYPE[Math.floor(Math.random() * CORE_TYPE.length)]
    let a = MAX_DOTS_LENGTH
    if (hasElement(275)) a += 1
    if (hasElement(283)) a += 1
    while (c.length == 0) {
        let m = [], n = false
        for (let i = 0; i < a; i++) {
            m[i] = Math.random()
            if (m[i] < CORE_CHANCE_MIN) n = true
        }
        if (n) c = m
    }
    return {star_c: c, type: t, power_m: Math.random()}
}

function choosePreTheorem(i) {
    player.inf.pt_choosed = i
}

function addTheorem(type, star, level, power, chance=CORE_CHANCE_MIN) {
    let s = true
    for (let i = 0; i < MAX_INV_LENGTH; i++) if (!player.inf.inv[i]) {
        player.inf.inv[i] = {type, star: star.map(x => x < chance), level, power: Math.round(power*100)/100}
        s = false
        break
    }
    if (s) createPopup("Your inventory is maxed! You need to remove unused or useless theorem...",'inv_maxed')
    updateTheoremInv()
}

function chooseTheorem(id,is_core=false) {
    let inv = player.inf.inv, core = player.inf.core;

    if (popups.includes('pickout')) return

    if (t_choosed == (is_core?id+'c':id)) t_choosed = '-'
    else if (t_choosed == '-') {
        if (is_core ? core[id] : inv[id]) t_choosed = is_core?id+'c':id
    } else {
        // console.log(id,t_choosed)

        if (inv[t_choosed]) {
            if (is_core) {
                if (core[id] !== undefined && core[id] !== null) {
                    if (checkSwitchingCore(t_choosed,id)) {
                        if (isTheoremHigher(core[id],inv[t_choosed])) switchTheorems(t_choosed,id)
                        else createConfirm(`Are you sure you want to pick theorem out of core?`,'pickout',()=>{
                            switchTheorems(t_choosed,id,true)
                        })
                        return
                    }
                }
                else if (checkSwitchingCore(t_choosed,id)) [inv[t_choosed], core[id]] = [core[id], inv[t_choosed]]
            } else [inv[id], inv[t_choosed]] = [inv[t_choosed], inv[id]]
        } else if (core[t_choosed.split('c')[0]]) {
            if (is_core) [core[id], core[t_choosed.split('c')[0]]] = [core[t_choosed.split('c')[0]], core[id]]
            else if (checkSwitchingCore(id,t_choosed.split('c')[0])) {
                if (isTheoremHigher(core[t_choosed.split('c')[0]],inv[id])) switchTheorems(id,t_choosed.split('c')[0])
                else createConfirm(`Are you sure you want to pick theorem out of core?`,'pickout',()=>{
                    switchTheorems(id,t_choosed.split('c')[0])
                })
                return
            }
        }

        t_choosed = '-'
    }

    updateTheoremCore()
    updateTheoremInv()
}

function checkSwitchingCore(id1,id2) {
    let inv = player.inf.inv, core = player.inf.core;
    return !inv[id1] || (core[id2] && inv[id1].type == core[id2].type) || core_weight[inv[id1].type] < MAX_CORE_FIT
}

function isTheoremHigher(t,t_target) {
    if (!t_target || t.type != t_target.type || t.level > t_target.level || Math.pow(t.level,t.power) > Math.pow(t_target.level,t_target.power)) return false
    let a = MAX_DOTS_LENGTH
    if (hasElement(275)) a += 1
    if (hasElement(283)) a += 1
    for (let i = 0; i < a; i++) if (t.star[i] > t_target.star[i]) return false

    return true
}

function switchTheorems(id1,id2,force=false) {
    let inv = player.inf.inv, core = player.inf.core;

    [inv[id1], core[id2]] = [core[id2], inv[id1]]

    t_choosed = '-'

    if (force) {
        INF.doReset()
    }
    
    updateTheoremCore()
    updateTheoremInv()
}

function updateCoreTemp() {
    tmp.min_core_len = MIN_CORE_LENGTH

    if (player.inf.theorem.gte(6)) tmp.min_core_len++

    tmp.core_lvl = INF.level()

    for (let i in CORE) {
        let t = CORE[i], s = tmp.core_score[i], eff = tmp.core_eff[i], ct = core_tmp[i]

        let boost = t.boost?t.boost():1
        let a = MAX_DOTS_LENGTH
        if (hasElement(275)) a += 1
        if (hasElement(283)) a += 1
        for (let j = 0; j < a; j++) {
            let sc = Decimal.pow(ct.total_s[j] * Math.pow(boost, Math.log10(ct.total_s[j]+1)+1),ct.total_p)
            sc = overflow(sc,1000,0.5)
            if (sc.gt(0)) sc = sc.add(tmp.dim_mass_eff)

            sc = sc.toNumber()

            s[j] = sc
            eff[j] = t.eff[j](sc)
        }
    }
    updateTheoremCore()
}