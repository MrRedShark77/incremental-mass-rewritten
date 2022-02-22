function setupChalHTML() {
    let chals_table = new Element("chals_table")
	let table = ""
	for (let x = 1; x <= CHALS.cols; x++) {
        table += `<div id="chal_div_${x}" style="width: 120px; margin: 5px;"><img id="chal_btn_${x}" onclick="CHALS.choose(${x})" class="img_chal" src="images/chal_${x}.png"><br><span id="chal_comp_${x}">X</span></div>`
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
            tmp.el["chal_comp_"+x].setTxt(player.chal.comps[x].gte(tmp.chal.max[x])?"Completed":format(player.chal.comps[x],0)+" / "+format(tmp.chal.max[x],0))
        }
    }
    tmp.el.chal_enter.setVisible(player.chal.choosed && player.chal.active != player.chal.choosed && player.chal.comps[player.chal.choosed].lt(tmp.chal.max[player.chal.choosed]))
    tmp.el.chal_exit.setVisible(player.chal.active != 0)
    tmp.el.chal_exit.setTxt(tmp.chal.canFinish && !hasTreeUpg("qol6") ? "Finish Challenge for +"+tmp.chal.gain+" Completions" : "Exit Challenge")
    tmp.el.chal_desc_div.setDisplay(player.chal.choosed != 0)
    if (player.chal.choosed != 0) {
        let chal = CHALS[player.chal.choosed]
        tmp.el.chal_ch_title.setTxt(`[${player.chal.choosed}]${CHALS.getScaleName(player.chal.choosed)} ${chal.title} [${format(player.chal.comps[player.chal.choosed],0)+" / "+format(tmp.chal.max[player.chal.choosed],0)} Completions]`)
        tmp.el.chal_ch_desc.setHTML(chal.desc)
        tmp.el.chal_ch_reset.setTxt(CHALS.getReset(player.chal.choosed))
        tmp.el.chal_ch_goal.setTxt("Goal: "+CHALS.getFormat(player.chal.choosed)(tmp.chal.goal[player.chal.choosed])+CHALS.getResName(player.chal.choosed))
        tmp.el.chal_ch_reward.setHTML("Reward: "+chal.reward)
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
        tmp.chal.eff[x] = CHALS[x].effect(FERMIONS.onActive(04) ? E(0) : player.chal.comps[x])
    }
    tmp.chal.format = player.chal.active != 0 ? CHALS.getFormat() : format
    tmp.chal.gain = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].min(tmp.chal.max[player.chal.active]).sub(player.chal.comps[player.chal.active]).max(0).floor() : E(0)
    tmp.chal.canFinish = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].gt(player.chal.comps[player.chal.active]) : false
	tmp.chal.outside = player.chal.active == 0 && !player.md.active && player.supernova.fermions.choosed == ""
}

const CHALS = {
    choose(x) {
        if (player.chal.choosed == x) {
            this.enter()
        }
        player.chal.choosed = x
    },
    inChal(x) { return player.chal.active == x },
    reset(x, chal_reset=true) {
        if (x < 5) FORMS.bh.doReset()
        else if (x < 9) ATOM.doReset(chal_reset)
        else if (x < 13) SUPERNOVA.reset(true, true)
        else EXOTIC.reset(true)
    },
    exit(auto=false) {
        if (!player.chal.active == 0) {
            if (tmp.chal.canFinish) {
                player.chal.comps[player.chal.active] = player.chal.comps[player.chal.active].add(tmp.chal.gain)
            }
            if (!auto) {
                this.reset(player.chal.active)
                player.chal.active = 0
            }
        }
    },
    enter() {
        if (player.chal.comps[player.chal.choosed].gte(tmp.chal.max[player.chal.choosed])) return
        if (player.chal.active == 0) {
            player.chal.active = player.chal.choosed
            this.reset(player.chal.choosed, false)
        } else if (player.chal.choosed != player.chal.active) {
            this.exit(true)
            player.chal.active = player.chal.choosed
            this.reset(player.chal.choosed, false)
        }
    },
    getResource(x) {
        if (x < 5 || x > 8) return player.mass
        return player.bh.mass
    },
    getResName(x) {
        if (x < 5 || x > 8) return ''
        return ' of Black Hole'
    },
    getFormat(x) {
        return formatMass
    },
    getReset(x) {
        if (x < 5) return "Entering challenge will reset with Dark Matters!"
        if (x < 9) return "Entering challenge will reset with Atoms except previous challenges!"
        if (x < 13) return "Entering challenge will reset without being Supernova!"
        return "Entering challenge will rise the power of Exotic!"
    },
    getMax(i) {
        let x = this[i].max
        if (i <= 4) x = x.add(tmp.chal?tmp.chal.eff[7]:0)
        if (hasElement(13) && (i==5||i==6)) x = x.add(tmp.elements.effect[13])
        if (hasElement(75) && (i==5||i==6)) x = x.add(tmp.elements.effect[75])
        if (hasElement(20) && (i==7)) x = x.add(50)
        if (hasElement(41) && (i==7)) x = x.add(50)
        if (hasElement(60) && (i==7)) x = x.add(100)
        if (hasElement(33) && (i==8)) x = x.add(50)
        if (hasElement(56) && (i==8)) x = x.add(200)
        if (hasElement(65) && (i==7||i==8)) x = x.add(200)
        if (hasTreeUpg("chal1") && (i==7||i==8)) x = x.add(100)
        if (future && (i==7||i==10)) x = x.add(1e3)
        if (AXIONS.unl() && (i==7||i==10)) x = x.add(tmp.ax.eff[13])
        return x.floor()
    },
    getScaleName(i) {
        if (player.chal.comps[i].gte(1000)) return " Impossible"
        if (player.chal.comps[i].gte(i==8?200:i>8?50:300)) return " Insane"
        if (player.chal.comps[i].gte(i>8?10:75)) return " Hardened"
        return ""
    },
    getPower(i) {
        let x = E(1)
        if (hasElement(2)) x = x.mul(0.75)
        if (hasElement(26)) x = x.mul(tmp.elements.effect[26])
        if (hasTreeUpg("feat7")) x = x.mul(0.95)
        return x
    },
    getPower2(i) {
        let x = E(1)
        return x
    },
    getPower3(i) {
        let x = E(1)
        if (AXIONS.unl()) x = x.mul(tmp.ax.eff[14])
        return x
    },
    getChalData(x, r=E(-1)) {
        let res = !CHALS.inChal(0)?this.getResource(x):E(0)
        let lvl = r.lt(0)?player.chal.comps[x]:r
        let chal = this[x]
        let s1 = x > 8 ? 10 : 75
        let s2 = 300
        if (x == 8) s2 = 200
        if (x > 8) s2 = 50
        let s3 = 1000
        let pow = chal.pow
        if (hasElement(10) && (x==3||x==4)) pow = pow.mul(0.95)
        chal.pow = chal.pow.max(1)
        let goal = chal.inc.pow(lvl.pow(pow)).mul(chal.start)
        let bulk = res.div(chal.start).max(1).log(chal.inc).root(pow).add(1).floor()
        if (res.lt(chal.start)) bulk = E(0)
        if (lvl.max(bulk).gte(s1)) {
            let start = E(s1);
            let exp = E(3).pow(this.getPower());
            goal =
            chal.inc.pow(
                    lvl.pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                ).mul(chal.start)
            bulk = res
                .div(chal.start)
                .max(1)
                .log(chal.inc)
                .root(pow)
                .times(start.pow(exp.sub(1)))
                .root(exp)
                .add(1)
                .floor();
        }
        if (lvl.max(bulk).gte(s2)) {
            let start = E(s1);
            let exp = E(3).pow(this.getPower());
            let start2 = E(s2);
            let exp2 = E(4.5).pow(this.getPower2())
            goal =
            chal.inc.pow(
                    lvl.pow(exp2).div(start2.pow(exp2.sub(1))).pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                ).mul(chal.start)
            bulk = res
                .div(chal.start)
                .max(1)
                .log(chal.inc)
                .root(pow)
                .times(start.pow(exp.sub(1)))
                .root(exp)
                .times(start2.pow(exp2.sub(1)))
                .root(exp2)
                .add(1)
                .floor();
        }
        if (lvl.max(bulk).gte(s3)) {
            let start = E(s1);
            let exp = E(3).pow(this.getPower());
            let start2 = E(s2);
            let exp2 = E(4.5).pow(this.getPower2())
            let start3 = E(s3);
            let power3 = this.getPower3()
            let exp3_base = E(1.001)
            goal =
            chal.inc.pow(
                    exp3_base.pow(lvl.sub(start3).mul(power3)).mul(start3)
                    .pow(exp2).div(start2.pow(exp2.sub(1))).pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                ).mul(chal.start)
            bulk = res
                .div(chal.start)
                .max(1)
                .log(chal.inc)
                .root(pow)
                .times(start.pow(exp.sub(1)))
                .root(exp)
                .times(start2.pow(exp2.sub(1)))
                .root(exp2)
                .div(start3)
			    .max(1)
			    .log(exp3_base)
			    .div(power3)
			    .add(start3)
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
            let sp = E(0.5)
            if (hasElement(8)) sp = sp.pow(0.25)
            if (hasElement(39)) sp = E(1)
            let ret = x.mul(0.075).add(1).softcap(1.3,sp,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x.mul(100))+"%"+getSoftcapHTML(x,0.3) },
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
			if (hasElement(64)) x = x.mul(1.5)
			let ret = x.root(1.5).mul(0.01).add(1)
			let cap = E(2.4).add(tmp.radiation && tmp.radiation.bs.eff[19])
			if (hasTreeUpg("feat5")) {
				ret = ret.add(0.05)
				cap = cap.add(0.05)
			}
			return ret.min(cap)
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
			if (hasElement(64)) x = x.mul(1.5)
			let ret = x.root(1.5).mul(0.01).add(1)
			let cap = E(2.4).add(tmp.fermions && tmp.fermions.effs[1][5])
			if (hasTreeUpg("feat5")) {
				ret = ret.add(0.05)
				cap = cap.add(0.05)
			}
			return ret.min(cap)
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
        effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker"+getSoftcapHTML(x.log(0.97),5) },
    },
    6: {
        unl() { return player.chal.comps[5].gte(1) || player.supernova.times.gte(1) },
        title: "No Tickspeed & Condenser",
        desc: "You cannot buy Tickspeed & BH Condenser.",
        reward: `For every completions adds +10% to Tickspeed & BH Condenser Power.`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.989e38),
        effect(x) {
            let ret = x.mul(0.1).add(1).softcap(1.5,hasElement(39)?1:0.5,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x)+"x"+getSoftcapHTML(x,0.5) },
    },
    7: {
        unl() { return player.chal.comps[6].gte(1) || player.supernova.times.gte(1) },
        title: "No Rage Powers",
        desc: "You cannot gain Rage Powers, but Dark Matters are gained by mass instead of Rage Powers at a reduced rate.<br>In addtional, mass gain softcap is stronger.",
        reward: `Completions adds 2 maximum completions of 1-4 Challenge.<br><span class="yellow">On 16th completion, unlock Elements</span>`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.5e76),
        effect(x) {
            let ret = x.mul(2)
            if (hasElement(5)) ret = ret.mul(2)
            return ret.floor()
        },
        effDesc(x) { return "+"+format(x,0) },
    },
    8: {
        unl() { return player.chal.comps[7].gte(1) || player.supernova.times.gte(1) },
        title: "White Hole",
        desc: "Dark Matter & Mass from Black Hole gains are rooted by 8.",
        reward: `Dark Matter & Mass from Black Hole gains are raised by completions.<br><span class="yellow">On first completion, unlock 3 rows of Elements</span>`,
        max: E(50),
        inc: E(80),
        pow: E(1.3),
        start: E(1.989e38),
        effect(x) {
            if (hasElement(64)) x = x.mul(1.5)
            let ret = x.root(1.75).mul(0.02).add(1)
            return ret
        },
        effDesc(x) { return "^"+format(x) },
    },
    9: {
        unl() { return hasTreeUpg("chal4") },
        title: "No Particles",
        desc: "You cannot assign quarks. In addtional, mass gains exponent is raised to 0.9th power.",
        reward: `Improve Magnesium-12 better.`,
        max: E(100),
        inc: E('e500'),
        pow: E(2),
        start: E('e9.9e4').mul(1.5e56),
        effect(x) {
            let ret = x.root(hasTreeUpg("chal4a")?3.5:4).mul(0.1).add(1)
            return ret.min(1.3)
        },
        effDesc(x) { return "^"+format(x) },
    },
    10: {
        unl() { return hasTreeUpg("chal5") },
        title: "The Reality I",
        desc: "All challenges 1-8 are applied at once. In addtional, you are trapped in Mass Dilation!",
        reward: `The exponent of the RP formula is multiplied by completions. (this effect doesn't work while in this challenge)<br><span class="yellow">On first completion, unlock Fermions!</span>`,
        max: E(100),
        inc: E('e2000'),
        pow: E(2),
        start: E('e3e4').mul(1.5e56),
        effect(x) {
            let ret = x.root(1.75).mul(0.01).add(1)
            return ret
        },
        effDesc(x) { return format(x)+"x" },
    },
    11: {
        unl() { return hasTreeUpg("chal6") },
        title: "Absolutism",
        desc: "You cannot gain relativistic particles or dilated mass. However, you are stuck in Mass Dilation.",
        reward: `Star Booster is stonger by completions.`,
        max: E(100),
        inc: E("e1e6"),
        pow: E(1.45),
        start: uni("e8.5e7"),
        effect(x) {
            let ret = x.div(100).sqrt().add(1)
            return ret
        },
        effDesc(x) { return format(x)+"x stronger" },
    },
	12: {
		unl() { return hasTreeUpg("chal7") },
		title: "Wormhole Devourer",
		desc: "You are stuck in Mass Dilation, but has a static ^0.428 penalty and doesn't affect Dark Matter and Black Hole.",
		reward: `Radiation Boosters scale slower.<br><span class="yellow">On first completion, unlock a new prestige layer!</span>`,
		max: E(100),
		inc: E("e3000"),
		pow: E(1.4),
		start: uni("e47250"),
		effect(x) {
            return E(1).div(x.div(25).add(1).sqrt())
		},
		effDesc(x) { return format(E(1).sub(x).mul(100))+"% slower" },
	},
	13: {
		unl() { return hasTreeUpg("chal8") },
		title: "Decay of Atom",
		desc: "You can't gain atoms and quarks.",
		reward: `Axion Upgrades scale slower.<br><span class="yellow">On first completion, unlock ??? Tree! [Coming soon!]</span>`,
		max: E(50),
		inc: E(10),
		pow: E(5),
		start: E(1/0),
		effect(x) {
            return E(1).div(x.div(100).add(1))
		},
		effDesc(x) { return format(E(1).sub(x).mul(100))+"% slower" },
	},
	14: {
		unl() { return hasTreeUpg("chal9") },
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
	15: {
		unl() { return hasTreeUpg("chal10") },
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
	16: {
		unl() { return hasTreeUpg("chal11") },
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
    cols: 16,
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

function chalOutside() {
	return tmp.chal ? tmp.chal.outside : player.chal.active == 0 && !player.md.active && player.supernova.fermions.choosed == ""
}