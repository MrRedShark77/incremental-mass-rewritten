function setupChalHTML() {
    let chals_table = new Element("chals_table")
	let table = ""
	for (let x = 0; x < Math.ceil(CHALS.cols/4); x++) {
        table += `<div class="table_center" style="min-height: 160px;">`
        for (let y = 1; y <= Math.min(CHALS.cols-4*x,4); y++) {
            let i = 4*x+y
            table += `<div id="chal_div_${i}" style="width: 120px; margin: 5px;"><img id="chal_btn_${i}" onclick="CHALS.choose(${i})" class="img_chal" src="images/chal_${i}.png"><br><span id="chal_comp_${i}">X</span></div>`
        }
        table += "</div>"
	}
	chals_table.setHTML(table)
}

function updateChalHTML() {
    if (tmp.stab[3]==0){
        for (let x = 1; x <= CHALS.cols; x++) {
            let chal = CHALS[x]
            let unl = chal.unl ? chal.unl() : true
            tmp.el["chal_div_"+x].setDisplay(unl)
            tmp.el["chal_btn_"+x].setClasses({img_chal: true, ch: CHALS.inChal(x), chal_comp: player.chal.comps[x].gte(tmp.chal.max[x])})
            if (unl) {
                tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0)+(tmp.chal.max[x].gte(EINF)?"":" / "+format(tmp.chal.max[x],0)))
            }
        }
        tmp.el.chal_enter.setVisible(player.chal.active != player.chal.choosed)
        tmp.el.chal_exit.setVisible(player.chal.active != 0)
        tmp.el.chal_exit.setTxt(tmp.chal.canFinish && !hasTree("qol6") ? "Finish Challenge for +"+tmp.chal.gain+" Completions" : "Exit Challenge")
        tmp.el.chal_desc_div.setDisplay(player.chal.choosed != 0)
        if (player.chal.choosed != 0) {
            let chal = CHALS[player.chal.choosed]
            tmp.el.chal_ch_title.setTxt(`[${player.chal.choosed}]${CHALS.getScaleName(player.chal.choosed)} ${chal.title} [${format(player.chal.comps[player.chal.choosed],0)+(tmp.chal.max[player.chal.choosed].gte(EINF)?"":"/"+format(tmp.chal.max[player.chal.choosed],0))} Completions]`)
            tmp.el.chal_ch_desc.setHTML(chal.desc)
            tmp.el.chal_ch_reset.setTxt(CHALS.getReset(player.chal.choosed))
            tmp.el.chal_ch_goal.setTxt("Goal: "+CHALS.getFormat(player.chal.choosed)(tmp.chal.goal[player.chal.choosed])+CHALS.getResName(player.chal.choosed))
            tmp.el.chal_ch_reward.setHTML("Reward: "+(typeof chal.reward == 'function' ? chal.reward() : chal.reward))
            tmp.el.chal_ch_eff.setHTML("Currently: "+chal.effDesc(tmp.chal.eff[player.chal.choosed]))
        }
    }
    if (tmp.stab[3]==1){
        updateQCHTML()
    }
}

function enterChal() {
    if (player.chal.choosed == 16) startC16()
    else CHALS.enter()
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
    let s = tmp.qu.chroma_eff[2], w = treeEff('ct5'), v = 12

    if (hasTree('ct5')) v++
    if (hasTree('ct7')) v++
    if (hasTree('ct13')) v++

    for (let x = 1; x <= CHALS.cols; x++) {
        let data = CHALS.getChalData(x)
        tmp.chal.max[x] = CHALS.getMax(x)
        tmp.chal.goal[x] = data.goal
        tmp.chal.bulk[x] = data.bulk
                let q = x<=8?s:hasElement(174)&&x<=12?s.root(5):hasTree('ct5')&&x<=v?w:1 
         if (x == 9) q = E(q).min('e150') 
         tmp.chal.eff[x] = CHALS[x].effect(FERMIONS.onActive("05")?E(0):player.chal.comps[x].mul(q))
    }
    tmp.chal.format = player.chal.active != 0 ? CHALS.getFormat() : format
    tmp.chal.gain = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].min(tmp.chal.max[player.chal.active]).sub(player.chal.comps[player.chal.active]).max(0).floor() : E(0)
    tmp.chal.canFinish = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].gt(player.chal.comps[player.chal.active]) : false
}

const CHALS = {
    choose(x) {
        if (player.chal.choosed == x) {
            this.exit()
            this.enter()
        }
        player.chal.choosed = x
    },
    inChal(x) { return player.chal.active == x || (player.chal.active == 15 && x <= 12) },
    reset(x, chal_reset=true) {
        if (x < 5) FORMS.bh.doReset()
        else if (x < 9) ATOM.doReset(chal_reset)
        else if (x < 13) SUPERNOVA.reset(true, true)
        else if (x < 16) DARK.doReset(true)
        else if (x > 16) INF.doReset(true)
        else MATTERS.final_star_shard.reset(true)
    },
    exit(auto=false) {
        if (!player.chal.active == 0) {
            if (player.chal.active == 16 && !auto) {
                player.dark.c16.shard = player.dark.c16.shard.add(tmp.c16.shardGain)
                player.dark.c16.totalS = player.dark.c16.totalS.add(tmp.c16.shardGain)
            }
            if (tmp.chal.canFinish) {
                player.chal.comps[player.chal.active] = player.chal.comps[player.chal.active].add(tmp.chal.gain).min(tmp.chal.max[player.chal.active])
            }
            if (!auto) {
                this.reset(player.chal.active)
                player.chal.active = 0
            }
        }
    },
    enter(ch=player.chal.choosed) {
        if (player.chal.active == 0) {
            if (ch >= 17 && ch <= 20) {
                INF.doReset()
        }
            else if (ch == 16) {
                player.dark.c16.first = true
                tmp.c16active = true
            }
            player.chal.active = ch
            this.reset(ch, false)
        } else if (ch != player.chal.active) {
            this.exit(true)
            player.chal.active = ch
            this.reset(ch, false)
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
        if (x < 5) return "Entering this challenge will force dark matter reset."
        else if (x < 9) return "Entering this challenge will force atom reset."
        else if (x < 13) return "Entering challenge will supernova reset."
        else if (x < 16) return "Entering challenge will force a Darkness reset."
        else if (x < 20) return "Entering challenge will force a Infinity reset."
        return "Entering challenge will force an FSS reset."
    },
    getMax(i) {
        if (i <= 12 && hasPrestige(2,25)) return EINF 
        let x = this[i].max
        if (i <= 4 && !hasPrestige(2,25)) x = x.add(tmp.chal?tmp.chal.eff[7]:0)
        if (hasElement(13) && (i==5||i==6)) x = x.add(tmp.elements.effect[13])
        if (hasElement(20) && (i==7)) x = x.add(50)
        if (hasElement(41) && (i==7)) x = x.add(50)
        if (hasElement(60) && (i==7)) x = x.add(100)
        if (hasElement(33) && (i==8)) x = x.add(50)
        if (hasElement(56) && (i==8)) x = x.add(200)
        if (hasElement(65) && (i==7||i==8)) x = x.add(200)
        if (hasElement(70) && (i==7||i==8)) x = x.add(200)
        if (hasElement(73) && (i==5||i==6||i==8)) x = x.add(tmp.elements.effect[73])
        if (hasTree("chal1") && (i==7||i==8))  x = x.add(100)
        if (hasTree("chal4b") && (i==9))  x = x.add(100)
        if (hasTree("chal8") && (i>=9 && i<=12))  x = x.add(200)
        if (hasElement(104) && (i>=9 && i<=12))  x = x.add(200)
        if (hasElement(125) && (i>=9 && i<=12))  x = x.add(elemEffect(125,0))
        if (hasElement(151) && (i==13))  x = x.add(75)
        if (hasElement(171) && (i==13||i==14))  x = x.add(100)
        if (hasElement(186) && (i==13||i==14||i==15))  x = x.add(100)
        if (hasElement(196) && (i==13||i==14))  x = x.add(200)
        if (hasPrestige(1,46) && (i==13||i==14||i==15))  x = x.add(200)
        if (i==13||i==14||i==15)  x = x.add(tmp.dark.rayEff.dChal||0)
        if (hasElement(239) && i==16) x = x.add(elemEffect(239).floor())
        if (hasElement(242) && i==16) x = x.add(elemEffect(242))
        if (hasElement(246) && i==16) x = x.add(elemEffect(246))
        if (hasElement(251) && i==16) x = x.add(1000)
        if (hasElement(259) && i==15) x = x.add(1000000)
        if (hasElement(279) && i==17) x = x.add(1000)
        if (tmp.inf_unl && i==17) x = x.add(Math.min(theoremEff('mass',5)))
        return x.floor()
    },
    getScaleName(i) {
        if (player.chal.comps[i].gte(i==13||i==16?10:1000)) return " Impossible"
        if (player.chal.comps[i].gte(i==13||i==16?5:i==8?200:i>8&&i!=13&&i!=16?50:300)) return " Insane"
        if (player.chal.comps[i].gte(i==13||i==16?2:i>8&&i!=13&&i!=16?10:75)) return " Hardened"
        return ""
    },
    getPower(i) {
        let x = E(1)
        if (i == 16) return x
        if (hasElement(2)) x = x.mul(0.75)
        if (hasElement(26)) x = x.mul(tmp.elements.effect[26])
        if (hasElement(180) && i <= 12) x = x.mul(.7)
        if (i != 7 && hasPrestige(2,25)) x = x.mul(tmp.chal.eff[7])
        return x
    },
    getPower2(i) {
        let x = E(1)
        if (i == 16) return x
        if (hasElement(92)) x = x.mul(0.75)
        if (hasElement(120)) x = x.mul(0.75)
        if (hasElement(180) && i <= 12) x = x.mul(.7)
        if (i != 7 && hasPrestige(2,25)) x = x.mul(tmp.chal.eff[7])
        return x
    },
    getPower3(i) {
        let x = E(1)
        if (i == 16) return x
        if (hasElement(120)) x = x.mul(0.75)
        if (hasElement(180) && i <= 12) x = x.mul(.7)
        if (hasElement(293)) x = x.mul(elemEffect(293))
        return x
    },
    getChalData(x, r=E(-1)) {
        let res = this.getResource(x)
        let lvl = r.lt(0)?player.chal.comps[x]:r
        let chal = this[x], fp = 1, goal = EINF, bulk = E(0)
        if (x == 17 && (hasElement(295) && (!CHALS.inChal(17)))) {
            goal = lvl.gt(0) ? Decimal.pow('ee1000',Decimal.pow(1.01,lvl.sub(1).pow(1.25))) : chal.start
            if (res.gte(chal.start)) bulk = res.log('ee1000').max(1).log(1.01).root(1.25).add(1).floor()
            if (res.gte('ee1000')) bulk = bulk.add(1)
        }
        else if (x == 16 && (hasElement(295) && (!CHALS.inChal(16)))) {
            goal = lvl.gt(0) ? Decimal.pow('ee300',Decimal.pow(1.15,lvl.sub(1).pow(1.15))) : chal.start
            if (res.gte(chal.start)) bulk = res.log('ee300').max(1).log(1.15).root(1.15).add(1).floor()
            if (res.gte('ee300')) bulk = bulk.add(1)
        } else {
            if (QCs.active() && x <= 12) fp /= tmp.qu.qc_eff[5]
            let s1 = x > 8 ? 10 : 75
            let s2 = 300
            if (x == 8) s2 = 200
            if (x > 8) s2 = 50
            let s3 = 1000
            if (x == 13 || x == 16) {
                s1 = 2
                s2 = 5
                s3 = 10
            }
            if (x <= 12) s3 *= exoticAEff(0,3)
            let pow = chal.pow
            if (hasElement(10) && (x==3||x==4)) pow = pow.mul(0.95)
            chal.pow = chal.pow.max(1)
            goal = chal.inc.pow(lvl.div(fp).pow(pow)).mul(chal.start)
            bulk = res.div(chal.start).max(1).log(chal.inc).root(pow).mul(fp).add(1).floor()
            if (res.lt(chal.start)) bulk = E(0)
            if (lvl.max(bulk).gte(s1)) {
                let start = E(s1);
                let exp = E(3).pow(this.getPower(x));
                goal =
                chal.inc.pow(
                        lvl.div(fp).pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                    ).mul(chal.start)
                bulk = res
                    .div(chal.start)
                    .max(1)
                    .log(chal.inc)
                    .root(pow)
                    .times(start.pow(exp.sub(1)))
                    .root(exp).mul(fp)
                    .add(1)
                    .floor();
            }
            if (lvl.max(bulk).gte(s2)) {
                let start = E(s1);
                let exp = E(3).pow(this.getPower(x));
                let start2 = E(s2);
                let exp2 = E(4.5).pow(this.getPower2(x))
                goal =
                chal.inc.pow(
                        lvl.div(fp).pow(exp2).div(start2.pow(exp2.sub(1))).pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                    ).mul(chal.start)
                bulk = res
                    .div(chal.start)
                    .max(1)
                    .log(chal.inc)
                    .root(pow)
                    .times(start.pow(exp.sub(1)))
                    .root(exp)
                    .times(start2.pow(exp2.sub(1)))
                    .root(exp2).mul(fp)
                    .add(1)
                    .floor();
            }
            if (lvl.max(bulk).gte(s3)) {
                let start = E(s1);
                let exp = E(3).pow(this.getPower(x));
                let start2 = E(s2);
                let exp2 = E(4.5).pow(this.getPower2(x))
                let start3 = E(s3);
                let exp3 = E(1.001).pow(this.getPower3(x))
                goal =
                chal.inc.pow(
                        exp3.pow(lvl.div(fp).sub(start3)).mul(start3)
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
                    .log(exp3)
                    .add(start3).mul(fp)
                    .add(1)
                    .floor();
            }
        }

        return {goal, bulk}
    },
    1: {
        title: "Instant Scale",
        desc: "Super rank and mass upgrade scaling starts at 25. Also, Super tickspeed starts at 50.",
        reward: ()=>hasBeyondRank(2,20)?`Supercritical Rank & All Fermions Tier scaling starts later, Super Overpower scales weaker based on completions.`:`Super Rank starts later, Super Tickspeed scales weaker based on completions.`,
        max: E(100),
        inc: E(5),
        pow: E(1.3),
        start: E(1.5e58),
        effect(x) {
            let c = hasBeyondRank(2,20)
            let rank = c?E(0):x.softcap(20,4,1).floor()
            let tick = c?E(1):E(0.96).pow(x.root(2))
            let scrank = x.add(1).log10().div(10).add(1).root(3)
            let over = Decimal.pow(0.99,x.add(1).log10().root(2))
            return {rank: rank, tick: tick, scrank, over}
        },
        effDesc(x) { return hasBeyondRank(2,20)?formatMult(x.scrank)+" later to Supercritical Rank & All Fermions starting, "+formatReduction(x.over)+" weaker to Super Overpower scaling":"+"+format(x.rank,0)+" later to Super Rank starting, "+format(E(1).sub(x.tick).mul(100))+"% weaker to Super Tickspeed scaling" },
    },
    2: {
        unl() { return player.chal.comps[1].gte(1) || player.atom.unl },
        title: "Anti-Tickspeed",
        desc: "You cannot buy Tickspeed.",
        reward: `Each completion adds +7.5% to Tickspeed Power.`,
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
        effDesc(x) { return "+"+format(x.mul(100))+"%"+(x.gte(0.3)?" <span class='soft'>(softcapped)</span>":"") },
    },
    3: {
        unl() { return player.chal.comps[2].gte(1) || player.atom.unl },
        title: "Melted Mass",
        desc: "Mass gain softcap starts 150 OoMs eariler, and is stronger.",
        reward: `Mass gain is raised based on completions (doesn't apply in this challenge).`,
        max: E(100),
        inc: E(25),
        pow: E(1.25),
        start: E(2.9835e49),
        effect(x) {
            if (hasElement(64)) x = x.mul(1.5)
            let ret = hasElement(133) ? x.root(4/3).mul(0.01).add(1) : x.root(1.5).mul(0.01).add(1)
            return overflow(ret.softcap(3,0.25,0),1e12,0.5)
        },
        effDesc(x) { return "^"+format(x)+(x.gte(3)?" <span class='soft'>(softcapped)</span>":"") },
    },
    4: {
        unl() { return player.chal.comps[3].gte(1) || player.atom.unl },
        title: "Weakened Rage",
        desc: "Rage Power gain is rooted by 10. Additionally, mass gain softcap starts 100 OoMs eariler.",
        reward: `Rage Powers gain is raised by completions.`,
        max: E(100),
        inc: E(30),
        pow: E(1.25),
        start: E(1.736881338559743e133),
        effect(x) {
            if (hasElement(64)) x = x.mul(1.5)
            let ret = hasElement(133) ? x.root(4/3).mul(0.01).add(1) : x.root(1.5).mul(0.01).add(1)
            return overflow(ret.softcap(3,0.25,0),1e12,0.5)
        },
        effDesc(x) { return "^"+format(x)+(x.gte(3)?" <span class='soft'>(softcapped)</span>":"") },
    },
    5: {
        unl() { return player.atom.unl },
        title: "No Rank",
        desc: "You cannot rank up.",
        reward: ()=> hasCharger(3)?`Exotic Rank & Tier, Ultra Prestige Level scale weaker based on completions.`:`Rank requirement is weaker based on completions.`,
        max: E(50),
        inc: E(50),
        pow: E(1.25),
        start: E(1.5e136),
        effect(x) {
            let c = hasCharger(3)
            if (!c && hasPrestige(1,127)) return E(1)
            let ret = c?Decimal.pow(0.97,x.add(1).log10().root(4)):E(0.97).pow(x.root(2).softcap(5,0.5,0))
            return ret
        },
        effDesc(x) { return hasCharger(3)?formatReduction(x)+" weaker":format(E(1).sub(x).mul(100))+"% weaker"+(x.log(0.97).gte(5)?" <span class='soft'>(softcapped)</span>":"") },
    },
    6: {
        unl() { return player.chal.comps[5].gte(1) || player.supernova.times.gte(1) || quUnl() },
        title: "No Tickspeed & Condenser",
        desc: "You cannot buy Tickspeed or BH Condenser.",
        reward: `Every completion adds 10% to tickspeed and BH condenser power.`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.989e38),
        effect(x) {
            let ret = x.mul(0.1).add(1).softcap(1.5,hasElement(39)?1:0.5,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x)+"x"+(x.gte(0.5)?" <span class='soft'>(softcapped)</span>":"") },
    },
    7: {
        unl() { return player.chal.comps[6].gte(1) || player.supernova.times.gte(1) || quUnl() },
        title: "No Rage Powers",
        desc: "You cannot gain rage powers. Instead, dark matters are gained from mass at a reduced rate. Additionally, mass gain softcap is stronger.",
        reward: ()=>(hasPrestige(2,25)?`Pre-Impossible challenges scale weaker by completions, but this reward doesn't affect C7.`:`Each completion increases challenges 1-4 cap by 2.`) + `<br><span class="yellow">On 16th completion, unlock Elements</span>`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.5e76),
        effect(x) {
            let c = hasPrestige(2,25)
            let ret = c?Decimal.pow(0.987,x.add(1).log10().root(2)):x.mul(2)
            if (hasElement(5)) ret = c?ret.pow(2):ret.mul(2)
            return c?ret:ret.floor()
        },
        effDesc(x) { return hasPrestige(2,25)?formatReduction(x)+" weaker":"+"+format(x,0) },
    },
    8: {
        unl() { return player.chal.comps[7].gte(1) || player.supernova.times.gte(1) || quUnl() },
        title: "White Hole",
        desc: "Dark Matter & Mass from Black Hole gains are rooted by 8.",
        reward: `Dark Matter & Mass from Black Hole gains are raised by completions.<br><span class="yellow">On first completion, unlock 3 rows of Elements</span>`,
        max: E(50),
        inc: E(80),
        pow: E(1.3),
        start: E(1.989e38),
        effect(x) {
            if (hasElement(64)) x = x.mul(1.5)
            let ret = hasElement(133) ? x.root(1.5).mul(0.025).add(1) : x.root(1.75).mul(0.02).add(1)
            return overflow(ret.softcap(2.3,0.25,0),1e10,0.5)
        },
        effDesc(x) { return "^"+format(x)+(x.gte(2.3)?" <span class='soft'>(softcapped)</span>":"") },
    },
    9: {
        unl() { return hasTree("chal4") },
        title: "No Particles",
        desc: "You cannot assign quarks. Additionally, mass gains exponent is raised to 0.9th power.",
        reward: `Improve Magnesium-12.`,
        max: E(100),
        inc: E('e500'),
        pow: E(2),
        start: E('e9.9e4').mul(1.5e56),
        effect(x) {
            let ret = x.root(hasTree("chal4a")?3.5:4).mul(0.1).add(1)
            ret = ret.softcap(21,hasElement(8,1)?0.253:0.25,0)
            ret = overflow(ret,5e8,0.5)
            ret = overflow(ret,1e12,0.15)
            return ret
        },
        effDesc(x) { return "^"+format(x)+softcapHTML(x,21)+(x.gte(1e12)?"<span class='overflowed_text'></span>":"") },
    },
    10: {
        unl() { return hasTree("chal5") },
        title: "The Reality I",
        desc: "You are trapped in mass dilation and challenges 1-8.",
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
        unl() { return hasTree("chal6") },
        title: "Absolutism",
        desc: "You cannot gain dilated mass, and you are stuck in mass dilation.",
        reward: `Star boosters are stronger based on completions.`,
        max: E(100),
        inc: E("ee6"),
        pow: E(2),
        start: uni("e3.8e7"),
        effect(x) {
            let ret = x.root(2).div(10).add(1)
            return ret
        },
        effDesc(x) { return format(x)+"x stronger" },
    },
    12: {
        unl() { return hasTree("chal7") },
        title: "Decay of Atom",
        desc: "You cannot gain Atoms or Quarks.",
        reward: `Completions add free Radiation Boosters.<br><span class="yellow">On first completion, unlock new prestige layer!</span>`,
        max: E(100),
        inc: E('e2e7'),
        pow: E(2),
        start: uni('e8.4e8'),
        effect(x) {
            let ret = x.root(hasTree("chal7a")?1.5:2)
            ret = ret.softcap(50,0.5,0)
ret = overflow(ret,1e68,0.5)
            return overflow(ret,1e90,0.15)
        },
        effDesc(x) { return "+"+format(x)+softcapHTML(x,50)+ (x.gte(1e68)?"<span class='overflowed_text'></span>":"") },
    },
    13: {
        unl() { return hasElement(132) },
        title: "Absolutely Black Mass",
        desc: "Normal mass and mass of black hole gains are set to lg(x)^^1.5.",
        reward: `Increase dark ray earned based on completions.<br><span class="yellow">On first completion, unlock more features!</span>`,
        max: E(25),
        inc: E('e2e4'),
        pow: E(8),
        start: uni('e2e5'),
        effect(x) {
            let ret = x.add(1).pow(1.5)
            return ret
        },
        effDesc(x) { return "x"+format(x,1) },
    },
    14: {
        unl() { return hasElement(144) },
        title: "No Dmitri Mendeleev",
        desc: "You cannot purchase any pre-118 elements. Additionally, you are trapped in quantum challenge with modifiers [5,5,5,5,5,5,5,5].",
        reward: `Gain more primordium theorems.<br><span class="yellow">On first completion, unlock more features!</span>`,
        max: E(100),
        inc: E('e2e19'),
        pow: E(3),
        start: uni('ee20'),
        effect(x) {
            let ret = x.div(25).add(1)
            return ret
        },
        effDesc(x) { return "x"+format(x,2) },
    },
    15: {
        unl() { return hasElement(168) },
        title: "The Reality II",
        desc: "You are trapped in c1-12 and quantum challenge with modifiers [10,5,10,10,10,10,10,10].",
        reward: `Normal mass's overflow starts later based on completions.<br><span class="yellow">On first completion, unlock more features!</span>`,
        max: E(100),
        inc: E('e1e6'),
        pow: E(2),
        start: uni('e2e7'),
        effect(x) {
            let ret = x.add(1).pow(hasElement(267)?5:2)
            return ret
        },
        effDesc(x) { return "^"+format(x,2)+" later" },
    },
    16: {
        unl() { return hasElement(218) },
        title: "Chaotic Matter Annihilation",
        desc: `
        • You cannot gain rage powers, and all matters' formulas are disabled, and they generate each other. Red matter generates dark matter.<br>
        • Pre-C16 features, such as rank, prestige tiers, main upgrades, elements, tree upgrades, etc. may be corrupted (disabled).<br>
        • You are trapped in Mass Dilation & Dark Run with 100 all glyphs (10 slovak glyphs).<br>
        • Primordium particles are disabled.<br>
        • Pre-Quantum global speed is always set to /100.<br>
        You can earn Corrupted Shards based on your mass of black hole, when exiting the challenge.
        `,
        reward: `Improve Hybridized Uran-Astatine.<br><span class="yellow">On first completion, unlock ???</span>`,
        max: E(1),
        inc: E('e1.25e11'),
        pow: E(2),
        start: E('e1.25e11'),
        effect(x) {
            let ret = x.mul(hasElement(232)?0.075:0.05).add(1)
            ret = ret.softcap(E(1.07),0.05,0)
            return ret
        },
        effDesc(x) { return "^"+format(x) },
    },
    17: {
        unl() { return hasElement(265) },
        title: "Weaker Theorems",
        desc: `
        • Some elements will be [Overflowed].<br>
        • You can't gain Rage Points, Dark Matters.<br>
        • You are trapped in Mass Dilation and Dark Run with 50 all glyphs (5 slovak glyphs). Break Dilation is off.<br>
        • Primordium particles are disabled.<br>
        • Pre-Quantum global speed is always set to /1e9.<br>
        `,
        reward: `Improve Muonic Calcium. <span class="yellow">Get more Prestige Base.</span><br><span class='orange'>At 50 completions, unlock C18</span>`,
        max: E(100),
        inc: E('e1.25e30'),
        pow: E(8),
        start: E('e1.25e30'),
        effect(x) {
            let step = x.mul(2.15).pow(10.5).add(1).softcap(1e13,0.15,0)
            let ret = x.mul(1.5).pow(0.25).add(1)
            if (hasTree('glx4')) step = x.mul(5.15).pow(10.5).add(1)
            return {ret: ret, step: step}
        },
        effDesc(x) { return "x"+format(x.ret)+" to Muonic Calcium<br>x"+format(x.step)+" to Prestige Base" },
    },
    18: {
        unl() { return player.chal.comps[17].gte(50)||player.chal.comps[18].gte(1) },
        title: "Challenge Madness",
        desc: `
        • Some elements will be [Overflowed].<br>
        • You are trapped in C1-17, you can;t gain dark rays, but they're capped a 1e12.<br>
        • You can't enter Big Rip<br>
        `,
        reward: `Boost Dimensional Mass gain.<br><span class='orange'>At 100 completions, unlock ???</span>`,
        max: E(100),
        inc: E('e11400000000'),
        pow: E(2),
        start: E('e11400000000'),
        effect(x) {
            let ret = x.mul(25).pow(10).add(1)
            return overflow(ret,1e15,0.1)
        },
        effDesc(x) { return "x"+format(x)},
    },
    cols: 18,
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
    start: EINF,
    effect(x) {
        let ret = E(1)
        return ret
    },
    effDesc(x) { return format(x)+"x" },
},
*/

