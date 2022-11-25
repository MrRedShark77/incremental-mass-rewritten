const DARK_RUN = {
    mass_glyph_name: ['Cyrillic Glyph', 'Deutsch Glyph', 'Swedish Glyph', 'Chinese Glyph', 'Spanish Glyph', 'Slovak Glyph'],

    mass_glyph_eff(i) {
        let x, g = player.dark.run.glyphs[i]

        if (i < 4) x = 1/(g**0.5/100+1)
        else if (i == 4) x = [1/(g**0.5/100+1),1.1**g]
        else x = 1.1**g

        return x
    },

    mass_glyph_effDesc: [
        x => `Reduce the exponent of normal mass’s multiplier, multiplier from mass of black hole by ^${format(x)} in dark run.\nEarn more glyphs based on normal mass.`,
        x => `Reduce the exponent of dark matter’s multiplier, rage power’s multiplier by ^${format(x)} in dark run.\nEarn more glyphs based on mass of black hole.`,
        x => `Reduce the exponent of atom, atomic power and quark multiplier by ^${format(x)} in dark run.\nEarn more glyphs based on quarks.`,
        x => `Reduce the exponent of relativistic particle’s multiplier, the exponent of dilated mass formula by ^${format(x)} in dark run.\nEarn more glyphs based on dilated mass.`,
        x => `Reduce the exponent of supernova resources’ multiplier by ^${format(x[0])}, increase the supernova’s requirement by x${format(x[1])} in dark run.\nEarn more glyphs based on collapsed stars.`,
        x => `Reduce the prestige base’s exponent /${format(x)}, increase the every rank’s requirement by x${format(x)} in dark run.\nEarn more glyphs based on prestige base.`,
    ],

    mass_glyph_gain: [
        _=>player.mass.gte('ee39')?player.mass.log10().div(1e39).log(1.1).add(1).floor().toNumber():0,
        _=>player.bh.mass.gte('e1.5e34')?player.bh.mass.log10().div(1.5e34).log(1.1).add(1).floor().toNumber():0,
        _=>player.atom.quarks.gte('e3e32')?player.atom.quarks.log10().div(3e32).log(1.1).add(1).floor().toNumber():0,
        _=>0,
        _=>0,
        _=>0,
    ],

    upg: [
        null,
        {
            max: 10,
            desc: `Raise mass gain by 1.5 every level.`,
            cost(i) { return {0: 6*i+5} },
            eff(i) { return 1.5**i },
            effDesc: x=>"^"+format(x,2),
        },{
            max: 10,
            desc: `Raise mass of black hole gain by 1.5 every level.`,
            cost(i) { return {0: 6*i+10, 1: 6*i+5} },
            eff(i) { return 1.5**i },
            effDesc: x=>"^"+format(x,2),
        },{
            max: 5,
            desc: `Exotic rank starts x1.25 later every level.`,
            cost(i) { return {1: 6*i+10, 2: 6*i+5} },
            eff(i) { return 1.25**i },
            effDesc: x=>"x"+format(x,2)+" later",
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
    for (let c in cost) if (player.dark.run.glyphs[c] < cost[c]) return false

    return true
}

function glyphUpgEff(i,def=1) { return tmp.glyph_upg_eff[i]||def; }

function buyGlyphUpgrade(i) {
    let upgs = player.dark.run.upg
    let ua = upgs[i]||0
    let u = DARK_RUN.upg[i]
    let max = u.max||Infinity
    let cost = u.cost(ua)

    if (isAffordGlyphCost(cost) && ua < max) {
        upgs[i] = upgs[i] ? upgs[i] + 1 : 1

        for (let c in cost) player.dark.run.glyphs[c] -= cost[c]

        updateDarkRunTemp()
    }
}

function updateDarkRunHTML() {
    let dra = player.dark.run.active

    tmp.el.dark_run_btn.setTxt(dra?"Exit Dark Run":"Start Dark Run")
    tmp.el.mg_btn_mode.setTxt(["Earning", "Max Earning", "Clear Glyph"][player.dark.run.gmode])
    tmp.el.mg_max_gain.setTxt(format(player.dark.run.gamount,0))
    for (let x = 0; x < MASS_GLYPHS_LEN; x++) {
        tmp.el["mass_glyph"+x].setHTML(player.dark.run.glyphs[x] + (dra ? " (+" + format(tmp.dark.mass_glyph_gain[x],0) + ")" : ""))
        tmp.el["mass_glyph_tooltip"+x].setTooltip(DARK_RUN.mass_glyph_name[x]+"\n"+DARK_RUN.mass_glyph_effDesc[x](tmp.dark.mass_glyph_eff[x]))
    }

    let gum = tmp.mass_glyph_msg

    let msg = ''
    if (gum > 0) {
        let u = DARK_RUN.upg[gum]
        let ua = player.dark.run.upg[gum]||0
        let max = u.max||Infinity

        msg = "[Level "+format(ua,0)+(isFinite(max)?" / "+format(max,0):"")+"]<br><span class='sky'>"+(typeof u.desc == "function" ? u.desc() : u.desc)+"</span><br>"

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
		let u = DARK_RUN.upg[x]
        let ua = player.dark.run.upg[x]||0
        let max = u.max||Infinity

		tmp.el['glyph_upg'+x].setClasses({img_btn: true, locked: !isAffordGlyphCost(u.cost(ua)) && ua < max, bought: ua >= max})
	}
}

function updateDarkRunTemp() {
    let dra = player.dark.run.active

    for (let x = 0; x < MASS_GLYPHS_LEN; x++) {
        tmp.dark.mass_glyph_eff[x] = DARK_RUN.mass_glyph_eff(x)
        let mg = Math.max(0,(dra ? DARK_RUN.mass_glyph_gain[x]() : 0)-player.dark.run.glyphs[x])
        if (player.dark.run.gmode == 1) mg = Math.min(player.dark.run.gamount,mg)
        tmp.dark.mass_glyph_gain[x] = mg
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
            <div id="mass_glyph_tooltip${x}" style="margin-bottom: 5px;" onclick="glyphButton(${x})" tooltip="${DARK_RUN.mass_glyph_name[x]}"><img style="cursor: pointer" src="images/glyphs/glyph${x}.png"></div>
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