const DARK_RUN = {
    mass_glyph_name: ['Cyrillic Glyph', 'Deutsch Glyph', 'Swedish Glyph', 'Chinese Glyph', 'Spanish Glyph', 'Slovak Glyph'],

    mass_glyph_eff(i) {
        let x,
         g = (tmp.c16active || CHALS.inChal(17) || FERMIONS.onActive("17")? i == 5 ? hasCharger(10)?5:FERMIONS.onActive("17")?100000:10 : hasCharger(10)?50:FERMIONS.onActive("17")?100000:10 : player.dark.run.glyphs[i]) / tmp.dark.glyph_weak
        if (i < 4) x = 1/(g**0.5/100+1)
        else if (i == 4) x = [1/(g**0.5/100+1),1.1**(g**0.75)]
        else x = 1.1**(g**0.75)

        return x
    },

    mass_glyph_effDesc: [
        x => `Reduce the exponent of normal mass’s multiplier, multiplier from mass of black hole by <b>^${format(x)}</b> in dark run.<br class='line'>Earn more glyphs based on normal mass.`,
        x => `Reduce the exponent of dark matter’s multiplier, rage power’s multiplier by <b>^${format(x)}</b> in dark run.<br class='line'>Earn more glyphs based on mass of black hole.`,
        x => `Reduce the exponent of atom, atomic power and quark multiplier by <b>^${format(x)}</b> in dark run.<br class='line'>Earn more glyphs based on quarks.`,
        x => `Reduce the exponent of relativistic particle’s multiplier, the exponent of dilated mass formula by <b>^${format(x)}</b> in dark run.<br class='line'>Earn more glyphs based on dilated mass.`,
        x => `Reduce the exponent of supernova resources’ multiplier by <b>^${format(x[0])}</b>, increase the supernova’s requirement by <b>x${format(x[1])}</b> in dark run.<br class='line'>Earn more glyphs based on collapsed stars.`,
        x => `Reduce the prestige base’s exponent by <b>/${format(x)}</b>, increase every rank’s requirement by <b>x${format(x)}</b> in dark run.<br class='line'>Earn more glyphs based on prestige base.`,
    ],

    mass_glyph_gain: [
        ()=>player.mass.gte('ee39')?player.mass.log10().div(1e39).log(1.1).add(1).softcap(50,0.5,0).mul(glyphUpgEff(7)).mul(tmp.dark.glyph_mult).floor().toNumber():0,
        ()=>player.bh.mass.gte('e1.5e34')?player.bh.mass.log10().div(1.5e34).log(1.1).add(1).softcap(50,0.5,0).mul(tmp.dark.glyph_mult).floor().toNumber():0,
        ()=>player.atom.quarks.gte('e3e32')?player.atom.quarks.log10().div(3e32).log(1.1).add(1).softcap(50,0.5,0).mul(tmp.dark.glyph_mult).floor().toNumber():0,
        ()=>player.md.mass.gte('e1e21')?player.md.mass.log10().div(1e21).log(1.1).add(1).softcap(50,0.5,0).mul(tmp.dark.glyph_mult).floor().toNumber():0,
        ()=>player.stars.points.gte('e1.5e24')?player.stars.points.log10().div(1.5e24).log(1.1).add(1).softcap(50,0.5,0).mul(tmp.dark.glyph_mult).floor().toNumber():0,
        ()=>tmp.prestiges.base.gte(1e13)?tmp.prestiges.base.div(1e13).log(1.1).add(1).softcap(10,0.5,0).mul(tmp.dark.glyph_mult).floor().toNumber():0,
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
            effDesc: x=>"^"+format(x,2),
        },{
            max: 10,
            desc: `Raise mass of black hole gain by 1.5 every level.`,
            cost(i) {
                i *= Math.max(1,i-4)**0.5
                return {0: Math.floor(6*i+10), 1: Math.floor(6*i+5)}
            },
            eff(i) { return 1.5**i },
            effDesc: x=>"^"+format(x,2),
        },{
            max: 5,
            desc: `Exotic rank starts x1.25 later every level.`,
            cost(i) {
                return {1: 6*i+10, 2: 6*i+5}
            },
            eff(i) { return 1.25**i },
            effDesc: x=>"x"+format(x,2)+" later",
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
            effDesc: x=>"^"+format(x,2),
        },{
            max: 100,
            desc: `Triple dark ray gain for each level.`,
            cost(i) {
                i *= Math.max(1,i-4)**0.5
                return {0: Math.floor(20+20*i), 1: Math.floor(20+20*i), 2: Math.floor(20+20*i)}
            },
            eff(i) { return 3**i },
            effDesc: x=>"x"+format(x,0),
        },{
            max: 1,
            desc: `Gain x1.5 more Cyrillic Glyphs.`,
            cost() { return {5: 25} },
            eff(i) { return 1.5**i },
        },{
            max: 10,
            desc: `Dilated mass's overflow starts ^10 later every level.`,
            cost(i) {
                i *= Math.max(1,i-4)**0.5
                return {3: Math.floor(35+5*i), 4: Math.floor(5*i+5)}
            },
            eff(i) { return 10**i },
            effDesc: x=>"^"+format(x,0),
        },{
            max: 5,
            desc: `Star generators are ^1.5 stronger every level.`,
            cost(i) { return {1: 200+10*i, 2: 200+10*i, 5: 40+5*i} },
            eff(i) { return 1.5**i },
            effDesc: x=>"^"+format(x,2),
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
            effDesc: x=>"^"+format(x,3),
        },
    ],
}

const MASS_GLYPHS_LEN = 6

const GLYPH_UPG_LEN = DARK_RUN.upg.length

function mgEff(i,def=1) { return tmp.dark.mass_glyph_eff[i]||def }

function glyphButton(i) {
    if (player.dark.run.gmode == 2) player.dark.run.glyphs[i] = 0
    else if (player.dark.run.active && tmp.dark.mass_glyph_gain[i] > 0) {
        player.dark.run.glyphs[i] += tmp.dark.mass_glyph_gain[i]
        darkRun()
    }
}

function darkRun() {
    DARK.doReset(true)

    player.dark.run.active = !player.dark.run.active
}

function isAffordGlyphCost(cost) {
    for (let c in cost) if (Math.max(player.dark.run.glyphs[c],tmp.dark.mg_passive[c]) < cost[c]) return false

    return true
}

function hasGlyphUpg(i) { return player.dark.run.upg[i]>0 }

function glyphUpgEff(i,def=1) { return tmp.glyph_upg_eff[i]||def; }

function buyGlyphUpgrade(i) {
    let upgs = player.dark.run.upg
    let ua = upgs[i]||0
    let u = DARK_RUN.upg[i]
    let max = u.max||Infinity
    let cost = u.cost(ua)

    if (isAffordGlyphCost(cost) && ua < max) {
        upgs[i] = upgs[i] ? upgs[i] + 1 : 1

        for (let c in cost) if (tmp.dark.mg_passive[c]<=0) player.dark.run.glyphs[c] -= cost[c]

        if (i==12) updateAtomTemp()
        updateDarkRunTemp()
    }
}

function updateDarkRunHTML() {
    let dra = player.dark.run.active
    let c16 = tmp.c16active
    let dtmp = tmp.dark

    tmp.el.dark_run_btn.setTxt(dra?"Exit Dark Run":"Start Dark Run")
    tmp.el.mg_btn_mode.setTxt(["Earning", "Max Earning", "Clear Glyph"][player.dark.run.gmode])
    tmp.el.mg_max_gain.setTxt(format(player.dark.run.gamount,0))
    for (let x = 0; x < MASS_GLYPHS_LEN; x++) {
        tmp.el["mass_glyph"+x].setHTML(
            tmp.c16active || CHALS.inChal(17) || FERMIONS.onActive("17")? x == 5 ? hasCharger(10)?5:FERMIONS.onActive("17")?100000:10 : hasCharger(10)?50:FERMIONS.onActive("17")?100000:10 : player.dark.run.glyphs[x]
            + (dra ? " (+" + format(tmp.dark.mass_glyph_gain[x],0) + ")" : dtmp.mg_passive[x]>0 ? " ["+format(dtmp.mg_passive[x],0)+"]" : ""))
        tmp.el["mass_glyph_tooltip"+x].setTooltip("<h3>"+DARK_RUN.mass_glyph_name[x]+"</h3><br class='line'>"+DARK_RUN.mass_glyph_effDesc[x](tmp.dark.mass_glyph_eff[x]))
    }

    let gum = tmp.mass_glyph_msg

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
            msg +=  "<span>Cost: "+cr+"</span><br>"
        }
        
		if (u.effDesc !== undefined) msg += "<span class='green'>Currently: "+u.effDesc(tmp.glyph_upg_eff[gum])+"</span>"
    }
    tmp.el.glyph_upg_msg.setHTML(msg)

    for (let x = 1; x < GLYPH_UPG_LEN; x++) {
        let unl = x <= tmp.dark.glyph_upg_unls

        tmp.el['glyph_upg'+x].setDisplay(unl)

        if (!unl) continue

		let u = DARK_RUN.upg[x]
        let ua = player.dark.run.upg[x]||0
        let max = u.max||Infinity

		tmp.el['glyph_upg'+x].setClasses({img_btn: true, locked: !isAffordGlyphCost(u.cost(ua)) && ua < max, bought: ua >= max})
	}

    tmp.el.FSS_eff2.setHTML(
        player.dark.matters.final.gt(0)
        ? `Thanks to FSS, your glyphic mass gain is boosted by x${format(tmp.matters.FSS_eff[1],2)}`
        : ''
    )
}

function updateDarkRunTemp() {
    let dtmp = tmp.dark
    let dra = player.dark.run.active
    if (tmp.c16active || CHALS.inChal(17) || FERMIONS.onActive('17')) player.dark.run.active = player.dark.run.active
    dtmp.glyph_upg_unls = DARK_RUN.upg_unl_length()

    dtmp.glyph_mult = dtmp.rayEff.glyph||1
    if (hasPrestige(2,5)) dtmp.glyph_mult *= prestigeEff(2,5,1)
    dtmp.glyph_mult *= tmp.matters.FSS_eff[1]
    
    let w = 1

    if (tmp.inf_unl) w /= theoremEff('time',3)

    dtmp.glyph_weak = w

    let dp = 0
    if (hasElement(7,1)) dp += 3

    for (let x = 0; x < MASS_GLYPHS_LEN; x++) {
        dtmp.mass_glyph_eff[x] = DARK_RUN.mass_glyph_eff(x)
        let gain = DARK_RUN.mass_glyph_gain[x]()
        let mg = Math.max(0,(dra ? gain : 0)-player.dark.run.glyphs[x])
        if (player.dark.run.gmode == 1) mg = Math.min(player.dark.run.gamount,mg)
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
            <div id="mass_glyph_tooltip${x}" class="tooltip" style="margin-bottom: 5px;" onclick="glyphButton(${x})" tooltip-html="${DARK_RUN.mass_glyph_name[x]}"><img style="cursor: pointer" src="images/glyphs/glyph${x}.png"></div>
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