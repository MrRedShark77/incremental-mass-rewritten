const RESOURCES_DIS = {
	//Important Resources
    mass: {
        icon: "mass",
        desc: (gs)=>formatMass(player.mass)+"<br>"+formatGain(player.mass, tmp.massGain.mul(gs), true),
        resetBtn : () => createPopup(POPUP_GROUPS.help.html,'help')
    },
    quarks: {
        unl: ()=>player.atom.unl,
        icon: "quark",
        class: "quark_color",

        desc: (gs)=>format(player.atom.quarks,0)+"<br>"+(hasElement(14)?formatGain(player.atom.quarks,tmp.atom.quarkGain.mul(tmp.atom.quarkGainSec).mul(gs)):"(+"+format(tmp.atom.quarkGain,0)+")"),
    },

    rp: {
        unl: ()=>EVO.amt < 1 && player.quotes.includes(1),
        icon: "rp",
        class: "light_red",

        desc: (gs)=>format(player.rp.points,0)+"<br>"+(tmp.passive >= 1 ? formatGain(player.rp.points, tmp.rp.gain.mul(gs)) : tmp.rp.can ? "(+"+format(tmp.rp.gain,0)+")" : `(requires ${formatMass(1e14)})`),
    
        resetBtn() { FORMS.rp.reset() },
    },
    cp: {
        unl: ()=>EVO.amt >= 1,
        icon: "evolution/calm_power",
        class: "light_red",

        desc: (gs)=>format(player.evo.cp.points,0)+"<br>"+(tmp.passive >= 1 ? formatGain(player.evo.cp.points, cpProd()) : tmp.rp.can ? "(+"+format(tmp.rp.gain, 0)+")" : `(requires ${formatMass(1e14)})`),
    
        resetBtn() { FORMS.rp.reset() },
    },
    dm: {
        unl: ()=>FORMS.bh.see() && EVO.amt < 2,
        icon: "dm",
        class: "bh",

        desc: (gs)=>format(player.bh.dm,0)+"<br>"+(tmp.passive >= 2 ? formatGain(player.bh.dm, tmp.bh.dm_gain.mul(gs)) : tmp.bh.dm_can ? "(+"+format(tmp.bh.dm_gain,0)+")" : EVO.amt >= 1 ? `(requires ${format(5e3, 0)} CP)` : `(requires ${format(1e25, 0)} RP)`),
    
        resetBtn() { FORMS.bh.reset() },
    },
    fabric: {
        unl: ()=>FORMS.bh.see() && EVO.amt >= 2,
        icon: "evolution/fabric",
        class: "bh",

        desc: (gs)=>format(player.evo.wh.fabric,0) + "<br>" + (tmp.passive >= 2 ? formatGain(player.evo.wh.fabric, tmp.bh.dm_gain) : tmp.bh.dm_can ? "(+"+format(tmp.bh.dm_gain,0)+")" : `(requires ${format(1e5, 0)} CP)`),
    
        resetBtn() { FORMS.bh.reset() },
    },
    bh: {
        unl: ()=>tmp.bh.unl,
        icon: "bh",
        class: "bh",

        desc: (gs)=>formatMass(player.bh.mass)+"<br>"+formatGain(player.bh.mass, tmp.bh.mass_gain.mul(gs), true),
    },
    wormhole: {
        unl: ()=>FORMS.bh.unl() && EVO.amt >= 2,
        icon: "evolution/wormhole",
        class: "bh",

        desc: () => formatMass(WORMHOLE.total()),
    },
    atom: {
        unl: ()=>FORMS.bh.unl() && EVO.amt < 3,
        icon: "atom",
        class: "cyan",

        desc: (gs)=>format(player.atom.points,0) + "<br>" + (tmp.passive >= 3 ? formatGain(player.atom.points, tmp.atom.gain.mul(gs)) : tmp.atom.canReset ? "(+"+format(tmp.atom.gain,0)+")" : EVO.amt >= 2 ? `(requires ${format(300, 0)} Fabric)` : `(requires ${formatMass(1.5e156, 0)} mass of BH)`),

        resetBtn() { ATOM.reset() },
    },
    protostar: {
        unl: ()=>FORMS.bh.unl() && EVO.amt >= 3,
        icon: "evolution/protostar",
        class: "cyan",

        desc: ()=>format(player.evo.proto.star,0) + "<br>" + (tmp.passive >= 3 ? formatGain(player.evo.proto.star, tmp.atom.gain) : tmp.atom.canReset ? "(+"+format(tmp.atom.gain,0)+")" : `(requires ${format(1e3, 0)} Fabric)`),

        resetBtn() { ATOM.reset() },
    },
    md: {
        unl: ()=>MASS_DILATION.unlocked(),
        icon: "md",
        class: "green",

        desc: (gs)=>format(player.md.particles,0)+"<br>"+(inMD()?"(+"+format(tmp.md.rp_gain,0)+")":(hasTree("qol3")?formatGain(player.md.particles,tmp.md.passive_rp_gain.mul(gs)):"(inactive)")),

        resetBtn() { MASS_DILATION.onactive() },
    },
    sn: {
        unl: ()=>tmp.sn.unl,
        icon: "sn",
        class: "magenta",

        desc: (gs)=>{
            let g = tmp.sn.gen ? tmp.sn.passive.div(FPS) : tmp.sn.bulk.sub(player.supernova.times).max(0)
            let h = tmp.inf_unl?format(g.mul(FPS),0)+"/sec":format(g,0)
            return format(player.supernova.times,0)+(player.supernova.post_10?"<br>(+"+h+")":"")
        },

        resetBtn() { if (player.supernova.post_10) SUPERNOVA.reset(false,false,true) },
    },
    qu: {
        unl: ()=>EVO.amt >= 4 ? EVO.amt < 5 : quUnl() || player.chal.comps[12].gte(1),
        icon: "qu",
        class: "light_green",

        desc: (gs)=>format(player.qu.points,0) + "<br>" + (hasUpgrade('br',8) ? player.qu.points.formatGain(tmp.qu.gain.div(10).mul(gs)) : tmp.qu.gain.gt(0) ? "(+"+format(tmp.qu.gain,0)+")" : `(requires ${formatMass(EVO.amt >= 4 ? "ee12" : "ee13", 0)})`),

        resetBtn() { QUANTUM.enter() },
    },
    ue: {
        unl: ()=>EVO.amt >= 5,
        icon: "evolution/universal_elixir",
        class: "light_green",

        desc: (gs)=>format(player.evo.cosmo.elixir,0)+"<br>"+(hasUpgrade('br',8) ? player.evo.cosmo.elixir.formatGain(tmp.qu.gain.div(10).mul(gs)) : tmp.qu.gain.gt(0) ? "(+"+format(tmp.qu.gain,0)+")" : `(requires ${formatMass("ee12", 0)})`),

        resetBtn() { QUANTUM.enter() },
    },
    br: {
        unl: ()=>EVO.amt < 5 && (EVO.amt >= 4 ? tmp.qu.mil_reached[9] : hasTree("unl4")),
        icon: "br",
        class: "red",

        desc: (gs)=>player.qu.rip.amt.format(0)+"<br>"+(player.qu.rip.active||hasElement(147)?hasUpgrade('br',8)?player.qu.rip.amt.formatGain(tmp.qu.rip.gain.div(10).mul(gs)):`(+${tmp.qu.rip.gain.format(0)})`:"(inactive)"),

        resetBtn() { BIG_RIP.rip() },
    },
    dark: {
        unl: ()=>hasElement(118)||player.dark.unl,
        icon: "dark",
        class: "gray",

        desc: (gs)=>player.dark.rays.format(0)+"<br>"+(hasElement(118)?tmp.dark.rayEff.passive?player.dark.rays.formatGain(tmp.dark.gain.mul(tmp.dark.rayEff.passive).mul(gs)):"(+"+tmp.dark.gain.format(0)+")":"(require Og-118)"),

        resetBtn() { DARK.reset() },
    },
    fss: {
        unl: ()=>player.dark.matters.final.gt(0) || tmp.inf_unl&&hasElement(188),
        icon: "fss",
        class: "quark_color",

        desc: (gs)=>format(player.dark.matters.final,0)+"<br>(+"+(tmp.matters.FSS_base.gte(tmp.matters.FSS_req)?1:0)+")",

        resetBtn() { MATTERS.final_star_shard.reset() },
    },
    corrupt: {
        unl: ()=>player.dark.c16.first,
        icon: "corrupted",
        class: "corrupted_text",

        desc: (gs)=>format(player.dark.c16.shard,0)+"<br>"+(hasElement(232)?player.dark.c16.shard.formatGain(tmp.c16.shardGain):tmp.c16.in?"(+"+tmp.c16.shardGain.format(0)+")":"(inactive)"),

        resetBtn() { startC16() },
    },
    inf: {
        unl: ()=>player.chal.comps[16].gte(1) || tmp.inf_unl,
        icon: "inf",
        class: "yellow",

        desc(gs) {
			let h = `(${formatPercent(player.mass.max(1).log10().max(1).log10().div(tmp.inf_limit.max(1).log10().max(10).log10()).max(0).min(1),4)} to ${tmp.inf_unl ? "next " : ""}Infinity)`
			if (tmp.inf_unl) h = player.inf.points.format(0)+"<br>(+"+tmp.IP_gain.format(0)+")<br>"+ h
			return h
		},
        resetBtn: () => INF.goInf(),
    },
    ouroboros: {
        unl: ()=>OURO.unl || player.chal.comps[20].gte(1),
        icon: "ouroboros",
        class: "snake",

        desc: (gs)=>OURO.unl ? "Evolution "+player.evo.times+"<br>"+(player.chal.comps[20].gte(1)?"(Ready to Evolve)":"(Not Ready)") : "Something Happened...",

        resetBtn() { OURO.reset() },
    },
    speed: {
        unl() { return this.desc() != "" },
        icon: "speed",

        desc() {
			let h = ""
			if (quUnl()) h += `<span class='light_green'>${formatMult(tmp.qu.speed)}</span><br>`
			if (tmp.inf_unl) h += `<span class='yellow'>${formatMult(tmp.preInfGlobalSpeed)}</span><br>`
			if (devSpeed != 1) h += `<span class='white'>${formatMult(devSpeed)}</span><br>`
			return h
		},
    },

	//THE SNAKE
    apple: {
        snake: true,
        icon: "snake/apple",
        class: "snake",

        desc: (gs)=>format(player.ouro.apple,0)+`<br>(+${format(tmp.ouro.apple_gain,0)}/feed)`,
    },
    berry: {
        snake: true,
        icon: "snake/berry",
        class: "snake",

        desc: (gs)=>format(player.ouro.berry,0)+`<br>(+${format(tmp.ouro.berry_gain,0)}/feed)`,
    },
    energy: {
        unl: () => boomUnl(),
        snake: true,
        icon: "snake/energy",
        class: "snake",

        desc: (gs)=>format(player.ouro.energy,1)+"/"+format(500,1),
    },
    purify: {
        unl: () => hasElement(93, 1),
        snake: true,
        icon: "snake/purify",
        class: "snake",

        desc: (gs)=>formatMult(getPurifyLuck()) + " purify luck",
    },
}

function click_res_btn(id) {
	if (tmp.res_hide) player.options.res_hide[id] = !player.options.res_hide[id]
	else if (RESOURCES_DIS[id].resetBtn) RESOURCES_DIS[id].resetBtn()
}

function setupResourcesHTML() {
    let h1 = "", h2 = ""

    for (i in RESOURCES_DIS) {
        let rd = RESOURCES_DIS[i]
        let className = rd.class || ""
		if (i in TOOLTIP_RES) className += " tooltip"
		if (rd.resetBtn) className += " reset"

        h1 += `<div id="${i}_res_div">
            <div class='${className}'
			${i in TOOLTIP_RES ? `id="${i}_tooltip" tooltip-pos="left" tooltip-align="left" tooltip-text-align="left"` : ""}
			onclick='click_res_btn("${i}")'>
                <span style="margin-right: 5px; text-align: right;" id="${i}_res_desc">X</span>
                <div><img src="images/${rd.icon||"mass"}.png"></div>
            </div>
        </div>`
    }

    new Element("resources_table").setHTML(h1)
}

const INF_GS_RES = ['qu','br','dark']

function updateResourcesHTML() {
	let hide = player.options.nav_hide[1]
	tmp.el.nav_res_hider.setDisplay(!hide)
	tmp.el.nav_res_hider.setClasses({ toggled: tmp.res_hide })
	if (hide) return

    let qu_gs = tmp.qu.speed, inf_gs = tmp.preInfGlobalSpeed
	let res_hide = player.options.res_hide
	tmp.el.resources_table.setClasses( { force_btn: tmp.res_hide } )
    for (i in RESOURCES_DIS) {
        let rd = RESOURCES_DIS[i]
        let unl = tmp.res_hide || !res_hide[i]

		/* To reduce lines, "snake: false" is hereby redundant with the following line. */
		unl = unl && tmp.inSnake == (rd.snake ?? false)
		if (rd.unl) unl = unl && rd.unl()

        tmp.el[i+"_res_div"].setDisplay(unl)
        tmp.el[i+"_res_div"].setOpacity(tmp.res_hide && res_hide[i] ? 0.3 : 1)
        if (unl) tmp.el[i+"_res_desc"].setHTML(tmp.res_hide ? (res_hide[i] ? "Hidden" : "Shown") : rd.desc(INF_GS_RES.includes(i) ? inf_gs : qu_gs))
    }
}