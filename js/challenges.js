function setupChalHTML() {
    let chals_table = new Element("chals_table")
	let table = ""
	for (let x = 1; x <= CHALS.cols; x++) {
        table += `<div id="chal_div_${x}"><img id="chal_btn_${x}" onclick="player.chal.choosed = ${x}" class="img_chal" src="images/chal_${x}.png"><br><span id="chal_comp_${x}">X</span></div>`
	}
	chals_table.setHTML(table)
}

function updateChalHTML() {
    for (let x = 1; x <= CHALS.cols; x++) {
        let chal = CHALS[x]
        let unl = chal.unl ? chal.unl() : true
        tmp.el["chal_div_"+x].setDisplay(unl)
        tmp.el["chal_btn_"+x].setClasses({img_chal: true, ch: CHALS.inChal(x), chal_comp: player.chal.comps[x].gte(tmp.chal.max[x])})
        if (unl) {
            tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0)+"/"+tmp.chal.max[x])
        }
    }
    tmp.el.chal_enter.setVisible(player.chal.active == 0)
    tmp.el.chal_exit.setVisible(player.chal.active != 0)
    tmp.el.chal_exit.setTxt(tmp.chal.canFinish ? "Finish Challenge for +"+tmp.chal.gain+" Completions" : "Exit Challenge")
    tmp.el.chal_desc_div.setDisplay(player.chal.choosed != 0)
    if (player.chal.choosed != 0) {
        let chal = CHALS[player.chal.choosed]
        tmp.el.chal_ch_title.setTxt(`[${player.chal.choosed}]${player.chal.comps[player.chal.choosed].gte(75)?" Hardened":""} ${chal.title} [${player.chal.comps[player.chal.choosed]+"/"+tmp.chal.max[player.chal.choosed]} Completions]`)
        tmp.el.chal_ch_desc.setHTML(chal.desc)
        tmp.el.chal_ch_reset.setTxt(CHALS.getReset(player.chal.choosed))
        tmp.el.chal_ch_goal.setTxt("Goal: "+CHALS.getFormat(player.chal.choosed)(tmp.chal.goal[player.chal.choosed])+CHALS.getResName(player.chal.choosed))
        tmp.el.chal_ch_reward.setTxt("Reward: "+chal.reward)
        tmp.el.chal_ch_eff.setHTML("Currently: "+chal.effDesc(tmp.chal.eff[player.chal.choosed]))
    }
}

function updateChalTemp() {
    if (!tmp.chal) tmp.chal = {
        goal: {},
        max: {},
        eff: {},
        bulk: {},
        canFinish: false,
        gain: E(0),
    }
    for (let x = 1; x <= CHALS.cols; x++) {
        let data = CHALS.getChalData(x)
        tmp.chal.max[x] = CHALS.getMax(x)
        tmp.chal.goal[x] = data.goal
        tmp.chal.bulk[x] = data.bulk
        tmp.chal.eff[x] = CHALS[x].effect(player.chal.comps[x])
    }
    tmp.chal.format = player.chal.active != 0 ? CHALS.getFormat() : format
    tmp.chal.gain = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].min(tmp.chal.max[player.chal.active]).sub(player.chal.comps[player.chal.active]).max(0).floor() : E(0)
    tmp.chal.canFinish = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].gt(player.chal.comps[player.chal.active]) : false
}

const CHALS = {
    inChal(x) { return player.chal.active == x },
    reset(x, chal_reset=true) {
        if (x < 5) FORMS.bh.doReset()
        else ATOM.doReset(chal_reset)
    },
    exit() {
        if (!player.chal.active == 0) {
            if (tmp.chal.canFinish) {
                player.chal.comps[player.chal.active] = player.chal.comps[player.chal.active].add(tmp.chal.gain)
            }
            this.reset(player.chal.active)
            player.chal.active = 0
        }
    },
    enter() {
        if (player.chal.active == 0) {
            player.chal.active = player.chal.choosed
            this.reset(player.chal.choosed, false)
        }
    },
    getResource(x) {
        if (x < 5) return player.mass
        return player.bh.mass
    },
    getResName(x) {
        if (x < 5) return ''
        return ' of Black Hole'
    },
    getFormat(x) {
        return formatMass
    },
    getReset(x) {
        if (x < 5) return "Entering challenge will reset with Dark Matters!"
        return "Entering challenge will reset with Atoms except previous challenges!"
    },
    getMax(i) {
        let x = this[i].max
        if (i <= 4) x = x.add(tmp.chal?tmp.chal.eff[7]:0)
        return x.floor()
    },
    getChalData(x, r=E(-1)) {
        let res = !CHALS.inChal(0)?this.getResource(x):E(0)
        let lvl = r.lt(0)?player.chal.comps[x]:r
        let chal = this[x]
        let goal = chal.inc.pow(lvl.pow(chal.pow)).mul(chal.start)
        let bulk = res.div(chal.start).max(1).log(chal.inc).root(chal.pow).add(1).floor()
        if (res.lt(chal.start)) bulk = E(0)
        if (lvl.max(bulk).gte(75)) {
            let start = E(75);
            let exp = E(3);
            goal =
            chal.inc.pow(
                    lvl.pow(exp).div(start.pow(exp.sub(1))).pow(chal.pow)
                ).mul(chal.start)
            bulk = res
                .div(chal.start)
                .max(1)
                .log(chal.inc)
                .root(chal.pow)
                .times(start.pow(exp.sub(1)))
                .root(exp)
                .add(1)
                .floor();
        }
        return {goal: goal, bulk: bulk}
    },
    1: {
        title: "Instant Scale",
        desc: "Super Ranks, Mass Upgrades starts at 25. In addtional, Super Tickspeed start at 50.",
        reward: `Super Ranks starts later, Super Tickspeed scaling weaker by completions.`,
        max: E(100),
        inc: E(5),
        pow: E(1.3),
        start: E(1.5e58),
        effect(x) {
            let rank = x.softcap(20,4,1).floor()
            let tick = E(0.96).pow(x.root(2))
            return {rank: rank, tick: tick}
        },
        effDesc(x) { return "+"+format(x.rank,0)+" later to Super Ranks, Super Tickspeed scaling "+format(E(1).sub(x.tick).mul(100))+"% weaker" },
    },
    2: {
        unl() { return player.chal.comps[1].gte(1) || player.atom.unl },
        title: "Anti-Tickspeed",
        desc: "You cannot buy Tickspeed.",
        reward: `For every completions adds +7.5% to Tickspeed Power.`,
        max: E(100),
        inc: E(10),
        pow: E(1.3),
        start: E(1.989e40),
        effect(x) {
            let ret = x.mul(0.075).add(1).softcap(1.3,0.5,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x.mul(100))+"%"+(x.gte(0.3)?" <span class='soft'>(softcapped)</span>":"") },
    },
    3: {
        unl() { return player.chal.comps[2].gte(1) || player.atom.unl },
        title: "Melted Mass",
        desc: "Mass gain softcap is divided by 1e150, and is stronger.",
        reward: `Mass gain are raised by completions, but cannot append while in this challenge!`,
        max: E(100),
        inc: E(25),
        pow: E(1.25),
        start: E(2.9835e49),
        effect(x) {
            let ret = x.root(1.5).mul(0.01).add(1)
            return ret
        },
        effDesc(x) { return "^"+format(x) },
    },
    4: {
        unl() { return player.chal.comps[3].gte(1) || player.atom.unl },
        title: "Weakened Rage",
        desc: "Rage Points gain is rooted by 10. In addtional, mass gain softcap is divided by 1e100.",
        reward: `Rage Powers gain are raised by completions.`,
        max: E(100),
        inc: E(30),
        pow: E(1.25),
        start: E(1.736881338559743e133),
        effect(x) {
            let ret = x.root(1.5).mul(0.01).add(1)
            return ret
        },
        effDesc(x) { return "^"+format(x) },
    },
    5: {
        unl() { return player.atom.unl },
        title: "No Rank",
        desc: "You cannot rank up.",
        reward: `Rank requirement are weaker by completions.`,
        max: E(50),
        inc: E(50),
        pow: E(1.25),
        start: E(1.5e136),
        effect(x) {
            let ret = E(0.97).pow(x.root(2).softcap(5,0.5,0))
            return ret
        },
        effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker"+(x.log(0.97).gte(5)?" <span class='soft'>(softcapped)</span>":"") },
    },
    6: {
        unl() { return player.chal.comps[5].gte(1) },
        title: "No Tickspeed & Condenser",
        desc: "You cannot buy Tickspeed & BH Condenser.",
        reward: `For every completions adds +10% to Tickspeed & BH Condenser Power.`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.989e38),
        effect(x) {
            let ret = x.mul(0.1).add(1).softcap(1.5,0.5,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x)+"x"+(x.gte(0.5)?" <span class='soft'>(softcapped)</span>":"") },
    },
    7: {
        unl() { return player.chal.comps[6].gte(1) },
        title: "No Rage Powers",
        desc: "You cannot gain Rage Powers, but Dark Matters are gained by mass instead of Rage Powers at a reduced rate.<br>In addtional, mass gain softcap is stronger.",
        reward: `Completions adds 2 maximum completions of 1-4 Challenge. On first completion, unlock Elements (Coming Soon)`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.5e76),
        effect(x) {
            let ret = x.mul(2)
            return ret
        },
        effDesc(x) { return "+"+format(x,0) },
    },
    cols: 7,
}

/*
3: {
    unl() { return player.chal.comps[2].gte(1) },
    title: "Placeholder",
    desc: "Placeholder.",
    reward: `Placeholder.`,
    max: E(50),
    inc: E(10),
    pow: E(1.25),
    start: E(1/0),
    effect(x) {
        let ret = E(1)
        return ret
    },
    effDesc(x) { return format(x)+"x" },
},
*/

