const DARK_RUN = {
    mass_glyph_name: ['Cyrillic Glyph', 'Deutsch Glyph', 'Swedish Glyph', 'Chinese Glyph', 'Spanish Glyph', 'Slovak Glyph'],
    mass_glyph_eff(i) {
        let x, g = player.dark.run.glyphs[i]

        if (tmp.c16.in) g = E(i == 5 ? 10 : 100)
        g = g.div(tmp.dark.glyph_weak)

        if (CHALS.inChal(20)) g = E(1.5e3)
        else if (CHALS.inChal(17)) g = E(250)
        else if (CHALS.inChal(18)) g = E(500)
        else if (CHALS.inChal(19)) g = E(1e3)

        if (i < 4) x = g.root(2).div(100).add(1).pow(-1)
        else if (i == 4) x = [g.root(2).div(100).add(1).pow(-1),Decimal.pow(1.1,g.pow(0.75))]
        else x = Decimal.pow(1.1,g.pow(0.75))

        return x
    },

    mass_glyph_effDesc: [
        x => `Reduce the exponent of normal mass’s multiplier, multiplier from mass of black hole by <b>^${format(x)}</b> in dark run.<br class='line'>Earn more glyphs based on normal mass.`,
        x => EVO.amt >= 2 ? `Reduce Calm Power and Fabric by <b>^${format(x)}</b>.<br class='line'>Earn more glyphs based on Fabric.` : `Reduce the exponent of dark matter’s multiplier, rage power’s multiplier by <b>^${format(x)}</b> in dark run.<br class='line'>Earn more glyphs based on mass of black hole.`,
        x => `Reduce the exponent of atom, atomic power and quark multiplier by <b>^${format(x)}</b> in dark run.<br class='line'>Earn more glyphs based on quarks.`,
        x => `Reduce the exponent of relativistic particle’s multiplier, the exponent of dilated mass formula by <b>^${format(x)}</b> in dark run.<br class='line'>Earn more glyphs based on dilated mass.`,
        x => `Reduce the exponent of supernova resources’ multiplier by <b>^${format(x[0])}</b>, increase the supernova’s requirement by <b>x${format(x[1])}</b> in dark run.<br class='line'>Earn more glyphs based on collapsed stars.`,
        x => `Reduce the prestige base’s exponent by <b>/${format(x)}</b>, increase every rank’s requirement by <b>x${format(x)}</b> in dark run.<br class='line'>Earn more glyphs based on prestige base.`,
    ],

    mass_glyph_gain: [
        ()=>player.mass.gte(EVO.amt>=3?'ee18':EVO.amt>=1?'ee26':'ee39')?player.mass.log10().div(EVO.amt>=3?'e18':EVO.amt>=1?'e26':'e39').log(1.1).add(1).softcap(50,0.5,0).mul(glyphUpgEff(7)).mul(tmp.dark.glyph_mult).floor():E(0),
        ()=>EVO.amt>=2?player.evo.wh.fabric.add(1).log10().div(5).pow(1.5).mul(tmp.dark.glyph_mult).floor()
			:(player.bh.mass.gte(EVO.amt>=1?'ee18':'e1.5e34')?player.bh.mass.log10().div(EVO.amt>=1?'e18':1.5e34).log(1.1).add(1).softcap(50,0.5,0).mul(tmp.dark.glyph_mult).floor():E(0)),
        ()=>player.atom.quarks.gte(EVO.amt>=1?'ee17':'e3e32')?player.atom.quarks.log10().div(EVO.amt>=1?'e17':3e32).log(1.1).add(1).softcap(50,0.5,0).mul(tmp.dark.glyph_mult).floor():E(0),
        ()=>tmp.atom.unl&&player.md.mass.gte(EVO.amt>=1?'ee9':'ee21')?player.md.mass.log10().div(EVO.amt>=1?'e9':1e21).log(1.1).add(1).softcap(50,0.5,0).mul(tmp.dark.glyph_mult).floor():E(0),
        ()=>tmp.star_unl&&player.stars.points.gte(EVO.amt>=1?'ee11':'e1.5e24')?player.stars.points.log10().div(EVO.amt>=1?'e11':1.5e24).log(1.1).add(1).softcap(50,0.5,0).mul(tmp.dark.glyph_mult).floor():E(0),
        ()=>tmp.prestiges.base.gte(EVO.amt>=3?1e9:EVO.amt>=1?1e10:1e13)?tmp.prestiges.base.div(EVO.amt>=3?1e9:EVO.amt>=1?1e10:1e13).log(1.1).add(1).softcap(10,0.5,0).mul(tmp.dark.glyph_mult).floor():E(0),
    ],

    upg_unl_length() {
        let x = 10

        if (tmp.matterUnl) x += 4

        return x
    },

    upg: [
        null,
        {
            max: 10,
            desc: `Raise mass gain by 1.5 every level.`,
            cost(i) {
                i *= Math.max(1,i-4)**0.5
                return {0: Math.floor(6*i+5)}
            },
            eff(i) { return 1.5**i },
            effDesc: x=>formatPow(x,2),
        },{
            max: 10,
            get desc() { return EVO.amt >= 2 ? `Raise Wormhole by 1.5 every level.` : `Raise mass of black hole gain by 1.5 every level.` },
            cost(i) {
                i *= Math.max(1,i-4)**0.5
                return {0: Math.floor(6*i+10), 1: Math.floor(6*i+5)}
            },
            eff(i) { return 1.5**i },
            effDesc: x=>formatPow(x,2),
        },{
            max: 5,
            desc: `Exotic rank starts x1.25 later every level.`,
            cost(i) {
                return {1: 6*i+10, 2: 6*i+5}
            },
            eff(i) { return 1.25**i },
            effDesc: x=>formatMult(x,2)+" later",
        },{
            max: 1,
            desc: `Rank tiers' nerf power from 8th QC modifier is weaker while dark running.`,
            cost() { return {2: 15, 5: 5} },
        },{
            max: 10,
            desc: `Raise atom gain by 1.5 every level.`,
            cost(i) {
                return {2: 75+5*i, 3: 5*i+5}
            },
            eff(i) { return 1.5**i },
            effDesc: x=>formatPow(x,2),
        },{
            max: 100,
            desc: `Triple dark ray gain for each level.`,
            cost(i) {
                i *= Math.max(1,i-4)**0.5
                return {0: Math.floor(20+20*i), 1: Math.floor(20+20*i), 2: Math.floor(20+20*i)}
            },
            eff(i) { return 3**i },
            effDesc: x=>formatMult(x,0),
        },{
            max: 1,
            desc: `Gain x1.5 more Cyrillic Glyphs.`,
            cost() { return {5: 25} },
            eff(i) { return 1.5**i },
        },{
            get max() { return EVO.amt >= 2 ? 15 : 10 },
            get desc() { return EVO.amt >= 2 ? `Decrease Meditation's softcap weakness by -5%.` : `Dilated mass's overflow starts ^10 later every level.` },
            cost(i) {
                i *= Math.max(1,i-4)**0.5
                return {3: Math.floor(35+5*i), 4: Math.floor(5*i+5)}
            },
            eff(i) { return EVO.amt >= 2 ? 1 - 0.05 * i : 10 ** i },
            effDesc: x=>EVO.amt >= 2 ? formatReduction(x) : formatPow(x,0),
        },{
            max: 5,
            desc: `Star generators are ^1.5 stronger every level.`,
            cost(i) { return {1: 200+10*i, 2: 200+10*i, 5: 40+5*i} },
            eff(i) { return 1.5**i },
            effDesc: x=>formatPow(x,2),
        },{
            max: 10,
            desc: `Prestige base's exponent is increased by 0.02 per level.`,
            cost(i) {
                i *= Math.max(1,i-4)**0.5
                return {0: Math.floor(270+10*i), 3: Math.floor(150+10*i), 4: Math.floor(140+10*i)} 
            },
            eff(i) { return i/50 },
            effDesc: x=>"+"+format(x,2),
        },{
            max: 2,
            desc: `Add 0.1 to matter exponent.`,
            cost(i) { return {5: 80+46*i} },
            eff(i) { return i/10 },
            effDesc: x=>"+"+format(x,1),
        },{
            max: 1,
            desc: `Cosmic ray effect is now an exponent at a super reduced rate.`,
            cost(i) { return {0: 487, 4: 271, 5: 121} },
        },{
            max: 1,
            desc: `Green Chromas gain is squared.`,
            cost(i) { return {0: 542, 2: 404} },
        },{
            max: 10,
            desc: `Each matter's exponent is increased by 12.5% per level.`,
            cost(i) {
                let j = Math.ceil(10*i**1.2)
                return {0: 160+j, 1: 446+j, 2: 460+j, 3: 328+j, 4: 333+j, 5: 222+j}
            },
            eff(i) { return 1+i/8 },
            effDesc: x=>formatPow(x,3),
        },
    ],
}

const MASS_GLYPHS_LEN = 6

let GLYPH_SEL = []
const GLYPH_UPG_LEN = DARK_RUN.upg.length
function mgEff(i,def=1) { return tmp.dark.mass_glyph_eff[i]||def }

function setGlyphs(x) {
	if (player.dark.run.gmode) return
	player.dark.run.gamount = x == 0 ? 10 : Math.max(player.dark.run.gamount + x, 10)
}

function glyphButton(i) {
    if (player.dark.run.active && tmp.dark.mass_glyph_gain[i].gt(0) && !GLYPH_SEL.includes(i)) {
		GLYPH_SEL.push(i)
		if (GLYPH_SEL.length == tmp.dark.glyph_sel_max) darkRun(true)
    }
}

function inDarkRun() {
    return player.dark.run.active || player.chal.active >= 16
}

function darkRun(round) {
	let run = player.dark.run
	if (run.active) for (var i of GLYPH_SEL) run.glyphs[i] = run.glyphs[i].add(tmp.dark.mass_glyph_gain[i])

	GLYPH_SEL = []
    DARK.doReset(true)

	run.round = round ? run.round - 1 : run.rounds
    if (!round || run.round == 0) run.active = !run.active
}

function changeRunRounds() {
	if (player.dark.run.active) {
		if (GLYPH_SEL.length) darkRun(1)
	} else player.dark.run.rounds = player.dark.run.rounds % 4 + 1
}

function isAffordGlyphCost(cost) {
    for (let c in cost) if (Decimal.max(player.dark.run.glyphs[c],tmp.dark.mg_passive[c]).lt(cost[c])) return false
    return true
}

function hasGlyphUpg(i) { return player.dark.run.upg[i]>0 }
function glyphUpgEff(i,def=1) { return tmp.glyph_upg_eff[i]||def; }

function buyGlyphUpgrade(i) {
    let upgs = player.dark.run.upg, ua = upgs[i]||0, u = DARK_RUN.upg[i]
    let max = u.max||Infinity, cost = u.cost(ua)
	let pin = player.dark.run.pin_upg

    if (isAffordGlyphCost(cost) && ua < max) {
        upgs[i] = upgs[i] ? upgs[i] + 1 : 1

        for (let c in cost) if (tmp.dark.mg_passive[c]<=0) player.dark.run.glyphs[c] = player.dark.run.glyphs[c].sub(cost[c] * (EVO.amt >= 2 ? .5 : 1))
	    if (upgs[i] == max && pin == i) player.dark.run.pin_upg = 0

        if (i==12) updateAtomTemp()
        updateDarkRunTemp()
		return
    }
	if (ua < max) player.dark.run.pin_upg = pin == i ? 0 : i
}

function updateDarkRunHTML() {
    let dtmp = tmp.dark, dra = player.dark.run.active
    let pin = player.dark.run.pin_upg, gum = tmp.mass_glyph_msg || pin
    let c16 = tmp.c16.in

    tmp.el.dark_run_btn.setTxt(dra?"Exit Dark Run":"Start Dark Run")
    tmp.el.dark_run_btn.setTooltip(`Dark Running will force a Dark reset, and will trap you into Big Rip with quantum challenge modifiers ${getQCForceDisp('run')}. You will produce <b>Glyphic Mass</b> based on resources which nerf things, and choosing a glyph to earn will exit a Dark Run.`)
    tmp.el.dark_run_rounds.setTxt(GLYPH_SEL.length?"Next Round":dra?"Rounds left: "+player.dark.run.round:"Rounds: " + player.dark.run.rounds)
    tmp.el.mg_max.setTxt("Max: " + ["OFF", "ON"][player.dark.run.gmode])
    tmp.el.mg_max_gain.setTxt(player.dark.run.gmode ? "∞" : format(player.dark.run.gamount,0))
    for (let x = 0; x < MASS_GLYPHS_LEN; x++) {
		let cost = gum == 0 ? {} : DARK_RUN.upg[gum].cost(player.dark.run.upg[gum]||0)
		let shown = gum == 0 ? true : Object.keys(cost).includes(x.toString())
		tmp.el["mass_glyph_img"+x].setClasses({ glyph: true, selected: player.dark.run.active && GLYPH_SEL.includes(x) })
		tmp.el["mass_glyph_img"+x].setOpacity(shown ? 1 : 0.2)
		tmp.el["mass_glyph"+x].setHTML(shown ?
			c16 ? "Corrupted" : format(gum && dtmp.mg_passive[x] ? dtmp.mg_passive[x] : player.dark.run.glyphs[x],0)
			+ (dra ? " (+" + format(tmp.dark.mass_glyph_gain[x],0) + ")" : gum ? " / " + format(cost[x], 0) : dtmp.mg_passive[x]>0 ? " ["+format(dtmp.mg_passive[x],0)+"]" : "")
		: "")
        tmp.el["mass_glyph_tooltip"+x].setTooltip("<h3>"+DARK_RUN.mass_glyph_name[x]+"</h3><br class='line'>"+DARK_RUN.mass_glyph_effDesc[x](tmp.dark.mass_glyph_eff[x]))
    }

    let msg = ''
    if (gum > 0) {
        let u = DARK_RUN.upg[gum]
        let ua = player.dark.run.upg[gum]||0
        let max = u.max||Infinity

        let desc = "<span class='sky'>"+(typeof u.desc == "function" ? u.desc() : u.desc)+"</span>"
        if (c16 && gum == 14) desc = desc.corrupt()
        msg = "[Level "+format(ua,0)+(isFinite(max)?" / "+format(max,0):"")+"]<br>"+desc+"<br>"

        if (ua<max) {
            let cr = "", cost = u.cost(ua), n = 0, cl = Object.keys(cost).length
            for (let c in cost) {
                cr += format(cost[c],0)+" "+DARK_RUN.mass_glyph_name[c]+(n+1<cl?", ":"")
                n++
            }
            msg += "<span>Cost: "+cr+"</span><br>"
        }
        
		if (u.effDesc !== undefined) msg += "<span class='green'>Currently: "+u.effDesc(tmp.glyph_upg_eff[gum])+"</span>"
		if (ua<max && pin != gum) msg += `<br><br><span class='yellow'>[ Click to pin ]</span>`
    }
    tmp.el.glyph_upg_msg.setHTML(msg)

    for (let x = 1; x < GLYPH_UPG_LEN; x++) {
        let unl = x <= tmp.dark.glyph_upg_unls
        tmp.el['glyph_upg'+x].setDisplay(unl)
        if (!unl) continue

		let u = DARK_RUN.upg[x]
        let ua = player.dark.run.upg[x]||0
        let max = u.max||Infinity
		tmp.el['glyph_upg'+x].setOpacity((pin == x || !pin) ? 1 : 0.1)
		tmp.el['glyph_upg'+x].setClasses({img_btn: true, locked: !isAffordGlyphCost(u.cost(ua)) && ua < max, bought: ua >= max})
	}

    tmp.el.FSS_eff2.setHTML(
        player.dark.matters.final.gt(0)
        ? `Thanks to FSS, your glyphic mass gain is boosted by x${format(tmp.matters.FSS_eff[1],2)}`
        : ''
    )

    tmp.el.glyphSel.setHTML(
		(dtmp.glyph_sel_max > 1 ? `Thanks to Evolutions, you can select up to ${dtmp.glyph_sel_max} glyphs.` : "") +
		(EVO.amt >= 2 ? `<br>Also, upgrades spend 50% cost.` : "")
    )
}

function updateDarkRunTemp() {
    let dtmp = tmp.dark
	dtmp.run = inDarkRun()

    let w = 1
    if (tmp.inf_unl) w /= theoremEff('time',3)
    dtmp.glyph_weak = w

    dtmp.glyph_sel_max = 1 + EVO.amt
    dtmp.glyph_mult = E(dtmp.rayEff.glyph||1).mul(appleEffect('glyph'))
    if (hasPrestige(2,5)) dtmp.glyph_mult = dtmp.glyph_mult.mul(prestigeEff(2,5,1))
    dtmp.glyph_mult = dtmp.glyph_mult.mul(tmp.matters.FSS_eff[1])

    let dra = player.dark.run.active
    dtmp.glyph_upg_unls = DARK_RUN.upg_unl_length()

    let dp = 0
    if (hasElement(7,1)) dp += 3
    for (let x = 0; x < MASS_GLYPHS_LEN; x++) {
        dtmp.mass_glyph_eff[x] = DARK_RUN.mass_glyph_eff(x)
        let gain = DARK_RUN.mass_glyph_gain[x]()
        let mg = Decimal.max(0,(dra ? gain : E(0)).sub(player.dark.run.glyphs[x]))
        if (player.dark.run.gmode == 1) mg = Decimal.min(player.dark.run.gamount,mg)
        dtmp.mass_glyph_gain[x] = mg
        dtmp.mg_passive[x] = x < dp ? gain : 0
    }

    for (let x = 1; x < GLYPH_UPG_LEN; x++) {
        let u = DARK_RUN.upg[x]
        if (u.eff) tmp.glyph_upg_eff[x] = u.eff(player.dark.run.upg[x]||0)
    }
}

function setupDarkRunHTML() {
    let t = new Element('mass_glyph_table')
    let html = ""

    for (let x = 0; x < MASS_GLYPHS_LEN; x++) {
        html += `
        <div style="margin: 5px; width: 100px">
            <div id="mass_glyph_tooltip${x}" class="tooltip" style="margin-bottom: 5px;" onclick="glyphButton(${x})" tooltip-html="${DARK_RUN.mass_glyph_name[x]}"><img id="mass_glyph_img${x}" style="cursor: pointer" src="images/glyphs/glyph${x}.png"></div>
            <div id="mass_glyph${x}">0</div>
        </div>
        `
    }

    t.setHTML(html)

    // Glyph Upgrades

    t = new Element('glyph_upg_table')
    html = ""

    for (let x = 1; x < GLYPH_UPG_LEN; x++) {
        html += `
        <img id="glyph_upg${x}" onclick="buyGlyphUpgrade(${x})" src="images/glyphs/glyph_upg${x}.png" style="margin: 3px;" class="img_btn" onmouseover="tmp.mass_glyph_msg = ${x}" onmouseleave="tmp.mass_glyph_msg = 0">
        `
    }

    t.setHTML(html)
}