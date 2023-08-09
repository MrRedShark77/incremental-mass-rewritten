const RESOURCES_DIS = {
    mass: {
        unl: ()=>true,
        icon: "mass",

        desc: (gs)=>formatMass(player.mass)+"<br>"+formatGain(player.mass, tmp.massGain.mul(gs), true),
    },
    rp: {
        unl: ()=>true,
        icon: "rp",
        class: "red",

        desc: (gs)=>format(player.rp.points,0)+"<br>"+(player.mainUpg.bh.includes(6)||player.mainUpg.atom.includes(6)?formatGain(player.rp.points, tmp.rp.gain.mul(gs)):"(+"+format(tmp.rp.gain,0)+")"),
    
        resetBtn() { FORMS.rp.reset() },
    },
    dm: {
        unl: ()=>FORMS.bh.see(),
        icon: "dm",
        class: "yellow",

        desc: (gs)=>format(player.bh.dm,0)+"<br>"+(player.mainUpg.atom.includes(6)?formatGain(player.bh.dm, tmp.bh.dm_gain.mul(gs)):"(+"+format(tmp.bh.dm_gain,0)+")"),
    
        resetBtn() { FORMS.bh.reset() },
    },
    bh: {
        unl: ()=>player.bh.unl,
        icon: "bh",
        class: "yellow",

        desc: (gs)=>formatMass(player.bh.mass)+"<br>"+formatGain(player.bh.mass, tmp.bh.mass_gain.mul(gs), true),
    },
    atom: {
        unl: ()=>player.bh.unl,
        icon: "atom",

        desc: (gs)=>format(player.atom.points,0)+"<br>"+(hasElement(24)?formatGain(player.atom.points,tmp.atom.gain.mul(gs)):"(+"+format(tmp.atom.gain,0)+")"),

        resetBtn() { ATOM.reset() },
    },
    quarks: {
        unl: ()=>player.atom.unl,
        icon: "quark",
        class: "quark_color",

        desc: (gs)=>format(player.atom.quarks,0)+"<br>"+(hasElement(14)?formatGain(player.atom.quarks,tmp.atom?tmp.atom.quarkGain.mul(tmp.atom.quarkGainSec).mul(gs):0):"(+"+format(tmp.atom.quarkGain,0)+")"),
    },
    md: {
        unl: ()=>MASS_DILATION.unlocked(),
        icon: "md",
        class: "green",

        desc: (gs)=>format(player.md.particles,0)+"<br>"+(player.md.active?"(+"+format(tmp.md.rp_gain,0)+")":(hasTree("qol3")?formatGain(player.md.particles,tmp.md.passive_rp_gain.mul(gs)):"(inactive)")),

        resetBtn() { MASS_DILATION.onactive() },
    },
    sn: {
        unl: ()=>player.supernova.post_10 || player.supernova.times.gt(0),
        icon: "sn",
        class: "magenta",

        desc: (gs)=>format(player.supernova.times,0)+(player.supernova.post_10?"<br>(+"+format(tmp.supernova.bulk.sub(player.supernova.times).max(0),0)+")":""),

        resetBtn() { if (player.supernova.post_10) SUPERNOVA.reset(false,false,true) },
    },
    glx: {
        unl: ()=>hasElement(297) || player.galaxy.times.gt(0),
        icon: "glx",
        class: "galcolor",

        desc: (gs)=>format(player.galaxy.times,0)+"<br>(+"+format(tmp.supernova.bulkGal.sub(player.galaxy.times).max(0),0)+")",

        resetBtn() { CONFIRMS_FUNCTION.glx() },
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

        desc: (gs)=>format(player.dark.matters.final,0)+"<br>(+"+(tmp.matters.FSS_base.gte(tmp.matters.FSS_req)?1:0)+")",

        resetBtn() { MATTERS.final_star_shard.reset() },
    },
    corrupt: {
        unl: ()=>player.dark.c16.first,
        icon: "corrupted",
        class: "corrupted_text",

        desc: (gs)=>format(player.dark.c16.shard,0)+"<br>"+(hasElement(245) && (!CHALS.inChal(18))?player.dark.c16.shard.formatGain(tmp.c16.shardGain):"(+"+tmp.c16.shardGain.format(0)+")"),

        resetBtn() { startC16() },
    },
    speed: {
        unl: ()=>quUnl(),
        icon: "preQGSpeed",
        class: "orange",

        desc: (gs)=>formatMult(tmp.preQUGlobalSpeed)+(tmp.inf_unl?"<br><span class='yellow'>"+formatMult(tmp.preInfGlobalSpeed)+"</span>":""),
    },
    inf: {
        unl: ()=>tmp.inf_unl,
        icon: "inf",
        class: "yellow",

        desc: (gs)=>player.inf.points.format(0)+(hasInfUpgrade(20)?"<br>":"<br>(+")+(hasInfUpgrade(20)?player.inf.points.formatGain(tmp.IP_gain.mul(infUpgEffect(20))):tmp.IP_gain.format(0)+")")+"<br>("+formatPercent(player.mass.max(1).log10().max(1).log10().div(tmp.inf_limit.max(1).log10().max(10).log10()).max(0).min(1))+(tmp.brokenInf?" to next infinity)":" to infinity)"),

        resetBtn() { INF.goInf() },
    },
    orb: {
        unl: ()=>player.chal.comps[17].gte(50),
        icon: "oc",
        class: "lightsky",

        desc: (gs)=>player.inf.c18.orb.format(0)+"<br>(+"+format(tmp.orbGain,0)+")",

        resetBtn() { ORB.getOrb() },
    },
    mlt: {
        unl: ()=>tmp.mlt_unl,
        icon: "mlt",
        class: "orange",

        desc: (gs)=>format(tmp.mv_time)+'s / '+ format(tmp.mv.cycleTime)+"s | " + format(player.mv.points)+"<br>"+"(+"+(tmp.mv_time.gte(tmp.mv.cycleTime)?format(tmp.mv.cycleGain):'0')+")",

        resetBtn() { CONFIRMS_FUNCTION.multiverse() },
    },
    /*
    mass: {
        unl: ()=>true,
        icon: "mass",

        desc: (gs)=>formatMass(player.mass)+"<br>"+formatGain(player.mass, tmp.massGain.mul(gs), true),
    },
    */
}

function reset_res_btn(id) { RESOURCES_DIS[id].resetBtn() }

function hide_res(id) { player.options.res_hide[id] = !player.options.res_hide[id] }

function setupResourcesHTML() {
    let h1 = "", h2 = ""

    for (i in RESOURCES_DIS) {
        let rd = RESOURCES_DIS[i]

        h1 += `
        <div id="${i}_res_div">
            <div ${i in TOOLTIP_RES ? `id="${i}_tooltip" class="tooltip ${rd.class||""}" tooltip-pos="left" tooltip-align="left" tooltip-text-align="left"` : `class="${rd.class||""}"`}>
                <span style="margin-right: 5px; text-align: right;" id="${i}_res_desc">X</span>
                <div><img src="images/${rd.icon||"mass"}.png" ${rd.resetBtn ? `onclick="reset_res_btn('${i}')" style="cursor: pointer;"` : ""}></div>
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