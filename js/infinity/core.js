const CORE = {
    mass: {
        title: `Newton Theorem`,
        icon: `N`,
        preEff: [
            `Boost normal mass gain.`,
            () => EVO.amt >= 2 ? `Weaken Mass Upgrade scalings.` : `Boost normal mass overflow starting.`,
            `Make pre-beyond ranks cheaper.`,
            `Increase the exponent of prestige base.`,
            () => EVO.amt >= 4 ? `Weaken Stronger Overflow^1.` : `Boost normal mass overflow^2 starting.`,
            `Increase the exponent of ascension base.`,
            `Weaken Exotic scalings.`,
        ],
        res: `Normal Mass`,
        boost: () => player.mass.add(1).log10().add(1).log10().add(1).log10().add(1),
        eff: [
            s => {
                let x = s.add(1).pow(s.root(2)).overflow(100,0.5)
                if (tmp.NHDimprove) x = x.pow(10)
                return x
            },
            s => {
                if (EVO.amt >= 2) s = s.add(1).log10().div(5).add(1).pow(-.3)
                if (EVO.amt < 2) {
					s = s.add(1).pow(s.root(2).mul(2)).overflow(100,0.5)
					if (tmp.NHDimprove) s = s.pow(10)
				}
				return s
            },
            s => {
                let x = s.root(2).div(10).add(1).root(2)
                if (tmp.NHDimprove) x = x.pow(2)
                return x
            },
            s => {
                let x = s.root(EVO.amt >= 2 ? 4 : 2)
                if (tmp.NHDimprove) x = x.pow(2)
                return x
            },
            s => {
                if (EVO.amt >= 4) return s.div(2e4).max(2).log(2).pow(-1)
                let x = s.add(1).pow(s.root(1.5))
                return overflow(x,100,0.5)
            },
            s => s.add(1).log10().div(50),
            s => E(.95).pow(s.add(1).log10().root(2)),
            s => E(0),
        ],
        effDesc: [
            x => formatPow(x),
            x => EVO.amt >= 2 ? formatReduction(x) : formatPow(x),
            x => formatMult(x),
            x => "+"+format(x),
            x => EVO.amt >= 4 ? formatReduction(x) : formatPow(x),
            x => "+"+format(x),
            x => formatReduction(x),
            x => formatMult(x),
        ],

        fragment: [
            f => f.add(1).pow(2),
            x => `Stronger overflow starts <b>${formatMult(x)}</b> later.`,
        ],
    },
    bh: {
        unl: () => EVO.amt < 2,
        title: `Hawking Theorem`,
        icon: `Λ`,
        preEff: [
            `Boost mass of BH gain (weaker in C16).`,
            `Boost BH mass overflow starting (weaker in C16).`,
            `Weaken unstable BH decreasing.`,
            `Boost FVM's power.`,
            `Boost the effect of Unstable BH.`,
            `Weaken BH mass overflows.`,
        ],
        res: `Mass of Black Hole`,
        boost: () => player.bh.mass.add(1).log10().add(1).log10().add(1).log10().add(1),
        eff: [
            s => {
                let x = s.add(1).pow(s.root(2))                
                x = overflow(x,100,0.5)

                if (tmp.c16.in) x = x.log10().add(1)
                if (tmp.NHDimprove) x = x.pow(10)
                return x
            },
            s => {
                let x = s.add(1).pow(s.root(2).mul(2))
                x = overflow(x,100,0.5)

                if (tmp.c16.in) x = x.log10().add(1)
                if (tmp.NHDimprove) x = x.pow(10)
                return x
            },
            s => {
                let x = s.add(1).log10().div(100).add(1).pow(-1)
                if (tmp.NHDimprove) x = x.pow(2)
                return x
            },
            s => {
                let x = s.add(1).root(2).overflow(10,0.5)
                if (tmp.NHDimprove) x = x.pow(2)
                return x
            },
            s => s.add(1).log10().div(10).add(1),
            s => s.gt(0) ? Decimal.pow(0.95,s.add(1).ssqrt().root(2)) : E(1),
            s => E(0),
            s => E(0),
        ],
        effDesc: [
            x => formatPow(x),
            x => formatPow(x),
            x => formatReduction(x),
            x => formatMult(x),
            x => formatPow(x),
            x => formatReduction(x),
            x => formatMult(x),
            x => formatMult(x),
        ],

        fragment: [
            f => f.add(1).log10().div(10).add(1),
            x => `Raise mass of unstable black hole gain to the <b>${format(x)}</b>th power.`,
        ],
    },
    atom: {
        title: `Dalton Theorem`,
        icon: `Ξ`,
        preEff: [
            `Boost quarks gain.`,
            () => EVO.amt >= 4 ? `Increase quark formula from protostars.` : `Boost quark & atomic power overflows starting.`,
            `Increase overpower's power.`,
            () => EVO.amt >= 1 ? `Gain more meditation.` : `Increase accelerator's power.`,
            `Boost Exotic Atom gain.`,
            () => EVO.amt >= 3 ? `Boost protostars gain.` : `Boost dilated mass gain.`,
            `Gain more Stardust.`,
        ],
        res: `Exotic Atom`,
        boost() {return tmp.ea.amount.add(1).log10().add(1).log10().add(1)},
        eff: [
            s => {
                let x = s.add(1).pow(s.root(2))                
                x = overflow(x,100,0.5)
                if (tmp.NHDimprove) x = x.pow(10)
                return x
            },
            s => {
                if (EVO.amt >= 4) return s.div(tmp.c16.in ? 1e5 : 1e4).min(.11)

                let x = s.add(1).pow(s.root(2).mul(EVO.amt >= 2 ? 1 : 2))
                x = overflow(x,100,0.5)
                if (tmp.NHDimprove) x = x.pow(10)
                return x
            },
            s => {
                let x = s.root(4)
                if (tmp.NHDimprove) x = x.pow(1.5)
                if (hasAscension(0,1)) x = x.mul(EVO.amt >= 4 ? 5 : 10)
                return x.div(1e4)
            },
            s => {
                let evo1 = EVO.amt >= 1
                let x = evo1 ? s.add(1).pow(2) : s.root(4)
                if (tmp.NHDimprove) x = x.pow(1.5)
                if (hasAscension(0,1)) x = x.mul(10)
                return evo1 ? x : x.div(1e4)
            },
            s => s.add(1).log10().root(2).div(10).add(1),
            s => s.add(1).log10().root(2).div(10).add(1),
            s => s.add(1).log10().add(1).root(4),
            s => E(0),
        ],
        effDesc: [
            x => formatPow(x),
            x => EVO.amt >= 4 ? "+"+format(x,4) : formatPow(x),
            x => "+"+format(x,4),
            x => EVO.amt >= 1 ? formatMult(x) : "+"+format(x),
            x => formatPow(x),
            x => formatPow(x)+(EVO.amt >= 3 ? "" : " to exponent"),
            x => formatPow(x),
            x => formatMult(x),
        ],

        fragment: [
            f => f.add(1),
            x => `Boost kaon & pion gains by <b>${formatMult(x)}</b>.`,
        ],
    },
    proto: {
        unl: () => EVO.amt < 5,
        title: `Protoversal Theorem`,
        icon: `Π`,
        preEff: [
            `Make cosmic string cheaper.`,
            `Strengthen primordium particles.`,
            `Weaken each “entropic” reward scaling.`,
            `Weaken QC modifications.`,
            `Boost Entropy gain and cap.`,
            `Boost quantum foam and death shard gain.`,
            `Strengthen Entropy Boosts.`,
        ],
        res: `Quantum Foam`,
        boost() {return player.qu.points.add(1).log10().add(1).log10().add(1)},
        eff: [
            s => s.add(1).log10().div(2).add(1),
            s => Decimal.pow(1.25,s.add(1).log10()),
            s => s.add(1).log10().div(100).add(1).pow(-1),
            s => s.add(1).log10().div(10).add(1).pow(-1),
            s => s.add(1).log10().root(3).div(10).add(1),
            s => s.add(1).log10().root(2).div(10).add(1),
            s => expMult(s.add(1).log10().add(1).mul(10),2).div(10),
            s => E(0),
        ],
        effDesc: [
            x => formatMult(x),
            x => formatPercent(x.sub(1)),
            x => formatReduction(x),
            x => formatReduction(x),
            x => formatPow(x),
            x => formatPow(x),
            x => formatMult(x),
            x => formatMult(x),
        ],

        fragment: [
            f => f.add(1).log10().root(2).div(100).add(1),
            x => `Raise chromas gain to the <b>${format(x)}</b>th power.`,
        ],
    },
    time: {
        title: `Einstein Theorem`,
        icon: `Δ`,
        preEff: [
            `Boost pre-infinity global speed.`,
            `Boost pre-quantum global speed.`,
            () => EVO.amt >= 4 ? `Raise Dark Effect resources.` : `Raise Dark Shadow & Abyssal Blots.`,
            `Weaken each glyphic mass nerfing.`,
            () => EVO.amt >= 3 ? `Boost the softcap of quark's formula from protostars starting.` : `Boost Exotic Atom Reward Strength.`,
            `Boost supernova generation.`,
            `Cheapen FSS.`,
        ],
        res: `Corrupted Shard`,
        boost() {return player.dark.c16.totalS.add(1).log10().add(1).log10().add(1)},
        eff: [
            s => s.add(1),
            s => s.add(1).log10().root(2).div(100).add(1),
            s => EVO.amt >= 4 ? s.div(400).max(2).log(2).sqrt() : s.add(1).log10().div(100).add(1),
            s => s.add(1).log10().div(100).add(1).pow(-1),
            s => EVO.amt >= 3 ? expMult(s.add(1),1.5) : s.add(1).log10().root(2).div(5),
            s => s.add(1).root(3),
            s => s.add(1).log10().pow(1.5).div(10).add(1),
            s => E(0),
        ],
        effDesc: [
            x => formatMult(x),
            x => formatPow(x),
            x => formatPow(x),
            x => formatReduction(x),
            x => EVO.amt >= 3 ? formatMult(x) : "+"+formatPercent(x),
            x => formatMult(x),
            x => formatMult(x),
            x => formatMult(x),
        ],

        fragment: [
            f => f.overflow(1e100,0.5).add(1).log10().root(2).div(50).add(1).pow(-1),
            x => `Weaken beyond rank’s next tier requirement by <b>${formatReduction(x)}</b>.`,
        ],
    },
}

const MAX_STARS = 8
const MAX_CORE_LENGTH = 5
const MIN_CORE_LENGTH = 4
const MAX_INV_LENGTH = 100

const CORE_CHANCE_MIN = 0.1
const CORE_TYPE = Object.keys(CORE)
const MIN_STAR_CHANCES = [0.1,0.1,0.1,0.1,0.005,0.005,0.001,0.000125]

const MAX_CORE_FIT = 1

var core_tmp = {}
var core_weight = {}
var core_star_luck = []
var core_star_chances = []

function getCoreChance(i, lvl=tmp.core_lvl) { return Decimal.sub(1,Decimal.pow(Decimal.sub(1,Decimal.pow(MIN_STAR_CHANCES[i],core_star_luck[i].pow(-1))),lvl.floor().pow(0.4))) }
function getPower(m) {
	let r = tmp.core_lvl.floor().sub(m)
	r = r.root(2).div(100)
	r = r.mul(CSEffect("power_mult"))
	return r.add(1)
}
function chanceToBool(arr) { return arr.map((x,i) => core_star_chances[i].gt(x)) }

function resetCoreTemp() {
    for (let i in CORE) {
        core_tmp[i] = {
            total_s: new Array(MAX_STARS).fill(E(0)),
            total_p: E(1),
        }

        core_weight[i] = 0
    }
}

resetCoreTemp()

var t_choosed = "-"
var changeCoreFromBestLevel = () => {
    let lvl = Decimal.floor(tmp.core_lvl), power = getPower()
    for (let i = 0; i < MAX_CORE_LENGTH; i++) if (player.inf.core[i]) {
        if (lvl.gt(player.inf.core[i].level)) player.inf.core[i].level=lvl
        if (power.gt(player.inf.core[i].power)) player.inf.core[i].power=power
    }

    updateTheoremCore()
    updateCoreHTML()
}

function theoremEff(t,i,def=1) { return tmp.core_eff[t][i]||def }

function getTheoremHTML(data,sub=false) {
    let s = ""
    for (let i = 0; i < MAX_STARS; i++) s += `<div>${data.star[i]?"◉":""}</div>`
    let w = `
    <div class="c_type">${CORE[data.type].icon}</div>
    <div class="c_pow">${format(data.power.mul(100),0)}%</div>
    <div class="c_lvl">${format(data.level,0)}</div>
    <div>
        ${s}
    </div>
    `
    return sub?w:`
    <div class="theorem_div ${data.type} tooltip" tooltip-pos="bottom" tooltip-pos="bottom" tooltip-html="The J">
        ${w}
    </div>
    `
}

function calcFragmentBase(data,s,p,level) {
    let lvl = level||data.level, m = 0
    s.forEach(i=>{m += i})

    return p.mul(1.5).pow(lvl.sub(1)).mul(Decimal.pow(m,p.mul(2))).mul(lvl).floor()
}

function getTheoremPreEffects(data,s,p,level) {
    let t = data.type

    let e = ""
    for (let i = 0; i < MAX_STARS; i++) if (s[i]) {
        let desc = CORE[t].preEff[i]
        if (desc && typeof desc == 'function') desc = desc()
        e += (desc||'???.') + "<br>"
    }
    e += `(Based on <b>${CORE[t].res}</b>)`
    if (tmp.tfUnl) e += `<br class='line'>Form into <b>+${format(calcFragmentBase(data,s,p,level),0)}</b> fragment base`
    return e
}

function setupCoreHTML() {
    let h = `<div id="preTReq"></div>`
    for (let i = 0; i < 4; i++) h += `<div id="preT${i}" class="theorem_div tooltip" tooltip-pos="bottom" onclick="choosePreTheorem(${i})"></div>`
    new Element('pre_theorem').setHTML(h)

    h = ``
    for (let i = 0; i < MAX_CORE_LENGTH; i++) h += `<div id="coreT${i}" class="theorem_div tooltip" onclick="chooseTheorem('${i}',true)"></div>`
    new Element('theorem_table').setHTML(h)

    h = ``
    for (let i = 0; i < MAX_INV_LENGTH; i++) {
        h += `<div>
            <div id="invT${i}" class="theorem_div tooltip" onclick="chooseTheorem('${i}')"></div>
        </div>`
    }
    new Element('theorem_inv_table').setHTML(h)
}

function updateCoreHTML() {
    let reached = player.inf.reached

    let lvl = tmp.core_lvl, fl = Decimal.floor(lvl)
    tmp.el.preTReq.setDisplay(!reached)
    tmp.el.pt_selector.setDisplay(TS_visible)
    tmp.el.pt_lvl.setHTML(`<b>${format(fl,0)}</b> (${formatPercent(lvl.sub(fl))})`)

    if (TS_visible) {
        for (let i = 0; i < player.inf.pre_theorem.length; i++) {
            let pt = tmp.el['preT'+i]
            pt.setDisplay(reached)

            if (!reached) continue

            let p = player.inf.pre_theorem[i], s = chanceToBool(p.star_c), power = getPower(p.power_m).max(p.min_pow || 0)
            pt.setClasses({theorem_div:true, tooltip:true, [p.type]:true, choosed: player.inf.pt_choosed == i})
            pt.setHTML(getTheoremHTML({type: p.type, level: fl, power, star: s},true))

            pt.setTooltip(`<h3>${CORE[p.type].title}</h3>
            <br class='line'>
            ${getTheoremPreEffects(p,s,power,fl)}`)
        }
        
        tmp.el.preTReq.setHTML(`Reach over <b>${formatMass(INF.req)}</b> of normal mass to show theorems that you will choose.`)
    }

    tmp.el.rerollBtn.setTxt(`Reroll (${player.inf.reroll.format(0)})`)
    tmp.el.rerollBtn.setDisplay(player.inf.theorem.gte(5))
    tmp.el.removeTBtn.setDisplay(!tmp.tfUnl)
    tmp.el.formTBtn.setDisplay(tmp.tfUnl)
}

function updateTheoremCore() {
    resetCoreTemp()

	if (!tmp.inf_unl) return
    for (let i = 0; i < MAX_CORE_LENGTH; i++) {
        let u = i < tmp.min_core_len
        let t = tmp.el['coreT'+i]

        t.setDisplay(u)
        if (!u) continue

        let p = player.inf.core[i]

        t.setClasses(p?{theorem_div:true, tooltip:true, [p.type]:true, choosed: i+"c" == t_choosed}:{theorem_div:true})

        t.setHTML(p?getTheoremHTML(p,true):"")

        if (p) {
            let type = p.type, l = p.level, s = p.star, ct = core_tmp[type]
            ct.total_p = ct.total_p.mul(p.power)
            for (let i = 0; i < MAX_STARS; i++) if (s[i]) ct.total_s[i] = ct.total_s[i].add(l)

            t.setTooltip(`
            <h3>${CORE[type].title}</h3><br>
            [Level ${format(p.level,0)}, Power: ${format(p.power.mul(100),0)}%]
            <br class='line'>
            ${getTheoremPreEffects(p,p.star,p.power)}
            `)

            core_weight[type]++
        }
    }
}

function updateTheoremInv() {
	if (!tmp.inf_unl) return
    for (let i = 0; i < MAX_INV_LENGTH; i++) {
        let t = tmp.el['invT'+i]
        let p = player.inf.inv[i]

        t.setClasses(p?{theorem_div:true, tooltip:true, [p.type]:true, choosed: i == t_choosed}:{theorem_div:true})

        t.setHTML(p?getTheoremHTML(p,true):"")

        t.setTooltip(p?`
        <h3>${CORE[p.type].title}</h3><br>
        [Level ${format(p.level,0)}, Power: ${format(p.power*100,0)}%]
        <br class='line'>
        ${getTheoremPreEffects(p,p.star,p.power)}
        `:"")
    }
}

function removeTheorem() {
    if (t_choosed.includes('c') || t_choosed == '-') return

    createConfirm("Are you sure you want to remove the selected theorem?",'remove_selected',()=>{
        delete player.inf.inv[t_choosed]

        t_choosed = '-'

        updateTheoremInv()
    })
}

function formTheorem() {
    if (t_choosed.includes('c') || t_choosed == '-' || !tmp.tfUnl) return

    let inv = player.inf.inv[t_choosed]
    player.inf.fragment[inv.type] = player.inf.fragment[inv.type].add(calcFragmentBase(inv,inv.star,inv.power));
    delete player.inf.inv[t_choosed]

    t_choosed = '-'
    updateTheoremInv()
}

function savageTheorem() {
    if (t_choosed.includes('c') || t_choosed == '-') return
	player.inf.savage = player.inf.inv[t_choosed]
	delete player.inf.inv[t_choosed]

	t_choosed = '-'
	updateTheoremInv()
	generatePreTheorems()
}

function createPreTheorem() {
    let t = CORE_TYPE[Math.randomInt(0, CORE_TYPE.length)]
    while (CORE[t].unl ? !CORE[t].unl() : false) t = CORE_TYPE[Math.randomInt(0, CORE_TYPE.length)]

	let sav = player.inf.savage ?? {}, c = [], min_pow = sav.power || E(1)
    while (c.length == 0) {
        let m = [], n = false
        for (let i = 0; i < MAX_STARS; i++) {
            m[i] = Math.random()
            if (m[i] < CORE_CHANCE_MIN && i < 4) n = true
        }
        if (sav.type && Math.random() > 0.05 * EVO.amt) t = sav.type
        if (sav.star) {
			sav.star.forEach((o,i)=>{
				if (o) m[i] = 0
			})
			n = true
		}
        if (n) c = m
    }
    return {star_c: c, min_pow, type: t, power_m: Math.random()}
}

function choosePreTheorem(i) {
    player.inf.pt_choosed = i
}

function addTheorem(type, star, level, power, min_pow) {
    let s = true
    for (let i = 0; i < MAX_INV_LENGTH; i++) if (!player.inf.inv[i]) {
        player.inf.inv[i] = {type, star: chanceToBool(star), level, power: power.mul(100).round().div(100).max(min_pow || 0)}
        s = false
        break
    }
    if (s) createPopup("Your inventory is maxed! You need to remove unused or useless theorem...",'inv_maxed')
    updateTheoremInv()
}

function addSelectedTheorem(onInf) {
	if (!onInf && player.inf.pt_choosed==-1) return
	if (onInf) {
		player.inf.reroll = player.inf.theorem.div(5).floor()
		delete player.inf.savage
	}

	let td = player.inf.pre_theorem[player.inf.pt_choosed==-1?Math.floor(Math.random()*4):player.inf.pt_choosed]
    addTheorem(td.type,td.star_c,tmp.core_lvl.floor(),getPower(td.power_m),td.min_pow)
}

function getFragmentEffect(id,def=1) { return tmp.fragment_eff[id]||def }

function chooseTheorem(id,is_core=false) {
    let inv = player.inf.inv, core = player.inf.core;

    if (popups.includes('pickout')) return

    if (t_choosed == (is_core?id+'c':id)) t_choosed = '-'
    else if (t_choosed == '-') {
        if (is_core ? core[id] : inv[id]) t_choosed = is_core?id+'c':id
    } else {
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
                    switchTheorems(id,t_choosed.split('c')[0],true)
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
    if (!t_target || t.type != t_target.type || t.level.gt(t_target.level) || Decimal.pow(t.level,t.power).gt(Decimal.pow(t_target.level,t_target.power))) return false

    for (let i = 0; i < MAX_STARS; i++) if (t.star[i] > t_target.star[i]) return false

    return true
}

function switchTheorems(id1,id2,force=false) {
    let inv = player.inf.inv, core = player.inf.core;
    [inv[id1], core[id2]] = [core[id2], inv[id1]]
    t_choosed = '-'

    if (force) INF.doReset()    
    updateTheoremCore()
    updateTheoremInv()
}

function rerollTheorems() {
	if (player.inf.reroll.eq(0)) return
	player.inf.reroll = player.inf.reroll.sub(1)
	addSelectedTheorem()
	generatePreTheorems()
}

function updateCoreTemp() {
    tmp.min_core_len = MIN_CORE_LENGTH

    let t = 4
    if (tmp.c18reward) t++
    if (hasElement(58,1)) t++
    if (EVO.amt >= 4 && hasElement(58,1)) t++
    if (EVO.amt == 3 && player.chal.comps[19].gte(1)) t++

    for (let i = 0; i < MAX_STARS; i++) {
        let l = E(1).mul(CSEffect("theorem_luck"))

        core_star_luck[i] = l
        core_star_chances[i] = i < t ? getCoreChance(i) : E(0)
    }

    if (player.inf.theorem.gte(6) && EVO.amt < 2) tmp.min_core_len++
    if (EVO.amt >= 5) tmp.min_core_len--

    tmp.core_lvl = INF.level()

    let c20 = CHALS.inChal(20)
    let ss = E(1e3)
    if (hasElement(272)) ss = ss.mul(elemEffect(272))
    tmp.meta_score_ss = ss

    for (let i in CORE) {
        let t = CORE[i], s = tmp.core_score[i], eff = tmp.core_eff[i], ct = core_tmp[i]

        let boost = (!t.unl||t.unl())&&t.boost?t.boost():0

        for (let j = 0; j < MAX_STARS; j++) {
            let sc = Decimal.pow(ct.total_s[j].mul(Decimal.pow(boost, ct.total_s[j].add(1).log10().add(1))),ct.total_p)
            sc = overflow(sc,ss,0.5)
            if (sc.gt(0)) sc = sc.add(tmp.dim_mass_eff)

            if (c20) sc = E(0)

            s[j] = sc
            eff[j] = t.eff[j](sc)
        }

        tmp.fragment_eff[i] = t.fragment[0](player.inf.fragment[i])
    }
}

var TS_visible = true

function updateOneSec() {
	updateUpgNotify()
    if (hasElement(242)) changeCoreFromBestLevel()
    if (WORMHOLE.autoUnl) {
		let split
		for (let [i, on] of Object.entries(player.evo.wh.auto)) {
			if (!on) continue
			activateWormhole(i, true)
			split = 1
		}
		if (split) activateWormhole(player.evo.wh.origin, true)
	}
}