const RESOURCES_DIS = {
	//Important Resources
    mass: {
        unl: ()=>true,
        icon: "mass",

        desc: (gs)=>formatMass(player.mass)+"<br>"+formatGain(player.mass, tmp.massGain.mul(gs), true),
    },
    quarks: {
        unl: ()=>player.atom.unl,
        icon: "quark",
        class: "quark_color",

        desc: (gs)=>format(player.atom.quarks,0)+"<br>"+(hasElement(14)?formatGain(player.atom.quarks,tmp.atom.quarkGain.mul(tmp.atom.quarkGainSec).mul(gs)):"(+"+format(tmp.atom.quarkGain,0)+")"),
    },

    rp: {
        unl: ()=>OURO.evo < 1,
        icon: "rp",
        class: "red",

        desc: (gs)=>format(player.rp.points,0)+"<br>"+(tmp.passive >= 1?formatGain(player.rp.points, tmp.rp.gain.mul(gs)):"(+"+format(tmp.rp.gain,0)+")"),
    
        resetBtn() { FORMS.rp.reset() },
    },
    cp: {
        unl: ()=>OURO.evo >= 1,
        icon: "evolution/calm_power",
        class: "red",

        desc: (gs)=>format(player.evo.cp.points,0)+"<br>"+(tmp.passive >= 1?formatGain(player.evo.cp.points, cpProd()):"(+"+format(tmp.rp.gain,0)+")"),
    
        resetBtn() { FORMS.rp.reset() },
    },
    dm: {
        unl: ()=>FORMS.bh.see() && OURO.evo < 2,
        icon: "dm",
        class: "yellow",

        desc: (gs)=>format(player.bh.dm,0)+"<br>"+(hasUpgrade("atom",6)?formatGain(player.bh.dm, tmp.bh.dm_gain.mul(gs)):"(+"+format(tmp.bh.dm_gain,0)+")"),
    
        resetBtn() { FORMS.bh.reset() },
    },
    fabric: {
        unl: ()=>FORMS.bh.see() && OURO.evo >= 2,
        icon: "evolution/fabric",
        class: "yellow",

        desc: (gs)=>format(player.evo.wh.fabric,0)+"<br>"+(tmp.passive>=2?formatGain(player.evo.wh.fabric, tmp.bh.dm_gain):"(+"+format(tmp.bh.dm_gain,0)+")"),
    
        resetBtn() { FORMS.bh.reset() },
    },
    bh: {
        unl: ()=>tmp.bh.unl,
        icon: "bh",
        class: "yellow",

        desc: (gs)=>formatMass(player.bh.mass)+"<br>"+formatGain(player.bh.mass, tmp.bh.mass_gain.mul(gs), true),
    },
    wormhole: {
        unl: ()=>FORMS.bh.unl() && OURO.evo >= 2,
        icon: "evolution/wormhole",
        class: "yellow",

        desc: _ => formatMass(WORMHOLE.total()),
    },
    atom: {
        unl: ()=>FORMS.bh.unl() && OURO.evo < 3,
        icon: "atom",

        desc: (gs)=>format(player.atom.points,0)+"<br>"+(hasElement(24)?formatGain(player.atom.points,tmp.atom.gain.mul(gs)):"(+"+format(tmp.atom.gain,0)+")"),

        resetBtn() { ATOM.reset() },
    },
    protostar: {
        unl: ()=>FORMS.bh.unl() && OURO.evo >= 3,
        icon: "evolution/protostar",
        class: "space",

        desc: _=>format(player.evo.proto.star,0)+"<br>"+(hasElement(24)?formatGain(player.evo.proto.star,tmp.atom.gain):"(+"+format(tmp.atom.gain,0)+")"),

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
        unl: ()=>tmp.supernova.unl,
        icon: "sn",
        class: "magenta",

        desc: (gs)=>{
            let g = tmp.supernova.gen ? tmp.supernova.passive.div(FPS) : tmp.supernova.bulk.sub(player.supernova.times).max(0)
            let h = tmp.inf_unl?format(g.mul(FPS),0)+"/sec":format(g,0)
            return format(player.supernova.times,0)+(player.supernova.post_10?"<br>(+"+h+")":"")
        },

        resetBtn() { if (player.supernova.post_10) SUPERNOVA.reset(false,false,true) },
    },
    qu: {
        unl: ()=>quUnl() || player.chal.comps[12].gte(1),
        icon: "qu",
        class: "light_green",

        desc: (gs)=>format(player.qu.points,0)+"<br>"+(hasUpgrade('br',8)?player.qu.points.formatGain(tmp.qu.gain.div(10).mul(gs)):"(+"+format(tmp.qu.gain,0)+")"),

        resetBtn() { QUANTUM.enter() },
    },
    br: {
        unl: ()=>hasTree("unl4"),
        icon: "br",
        class: "light_red",

        desc: (gs)=>player.qu.rip.amt.format(0)+"<br>"+(player.qu.rip.active||hasElement(147)?hasUpgrade('br',8)?player.qu.rip.amt.formatGain(tmp.rip.gain.div(10).mul(gs)):`(+${tmp.rip.gain.format(0)})`:"(inactive)"),

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
        unl: ()=>tmp.inf_unl,
        icon: "inf",
        class: "yellow",

        desc: (gs)=>player.inf.points.format(0)+"<br>(+"+tmp.IP_gain.format(0)+")"+"<br>("+formatPercent(player.mass.max(1).log10().max(1).log10().div(tmp.inf_limit.max(1).log10().max(10).log10()).max(0).min(1))+(tmp.brokenInf?" to next infinity)":" to infinity)"),

        resetBtn() { INF.goInf() },
    },
    ouroboros: {
        unl: ()=>OURO.unl() || player.chal.comps[20].gte(1),
        icon: "ouroboros",
        class: "limegreen",

        desc: (gs)=>tmp.ouro.unl ? "Evolution "+player.evo.times+"<br>"+(player.chal.comps[20].gte(1)?"(Ready to Evolve)":"(Not Ready)") : "Something Happened...",

        resetBtn() { OURO.reset() },
    },
    speed: {
        unl: ()=>quUnl(),
        icon: "speed",
        class: "orange",

        desc: (gs)=>formatMult(tmp.preQUGlobalSpeed)+(tmp.inf_unl?"<br><span class='yellow'>"+formatMult(tmp.preInfGlobalSpeed)+"</span>":""),
    },
}

function reset_res_btn(id) { RESOURCES_DIS[id].resetBtn() }

function hide_res(id) { player.options.res_hide[id] = !player.options.res_hide[id] }

function setupResourcesHTML() {
    let h1 = "", h2 = ""

    for (i in RESOURCES_DIS) {
        let rd = RESOURCES_DIS[i]
        let className = rd.class || ""
		if (i in TOOLTIP_RES) className += " tooltip"
		if (rd.resetBtn) className += " reset"

        h1 += `
        <div id="${i}_res_div">
            <div class='${className}'
			${i in TOOLTIP_RES ? `id="${i}_tooltip" tooltip-pos="left" tooltip-align="left" tooltip-text-align="left"` : ""}
			${rd.resetBtn ? `onclick="reset_res_btn('${i}')"` : ""}>
                <span style="margin-right: 5px; text-align: right;" id="${i}_res_desc">X</span>
                <div><img src="images/${rd.icon||"mass"}.png"></div>
            </div>
        </div>
        `

        h2 += `
        <div id="${i}_res_hide_div">
            <div><img src="images/${rd.icon||"mass"}.png"><button style="margin-left: 10px; width: 100px;" onclick="hide_res('${i}')" id="${i}_res_hide_btn" class="btn">OFF</button></div>
        </div>
        `
    }

    new Element("resources_table").setHTML(h1)
    new Element("res_hider_table").setHTML(h2)
}

const INF_GS_RES = ['qu','br','dark']

function updateResourcesHTML() {
    let qu_gs = tmp.preQUGlobalSpeed
    let inf_gs = tmp.preInfGlobalSpeed

    for (i in RESOURCES_DIS) {
        let rd = RESOURCES_DIS[i]
        let unl = !player.options.res_hide[i] && rd.unl()

        tmp.el[i+"_res_div"].setDisplay(unl)

        if (unl) {
            tmp.el[i+"_res_desc"].setHTML(rd.desc(INF_GS_RES.includes(i) ? inf_gs : qu_gs))
        }
    }
}

function updateResourcesHiderHTML() {
    for (i in RESOURCES_DIS) {
        let rd = RESOURCES_DIS[i]
        let unl = i != "idk" && rd.unl()

        tmp.el[i+"_res_hide_div"].setDisplay(unl)

        if (unl) {
            tmp.el[i+"_res_hide_btn"].setTxt(player.options.res_hide[i] ? "ON" : "OFF")
        }
    }
}