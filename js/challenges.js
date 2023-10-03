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
    if (tmp.tab_name == "chal"){
        for (let x = 1; x <= CHALS.cols; x++) {
            let chal = CHALS[x]
            let unl = chal.unl ? chal.unl() : true
            tmp.el["chal_div_"+x].setDisplay(unl)
            tmp.el["chal_btn_"+x].setClasses({img_chal: true, ch: tmp.chal.ch == x, in: CHALS.inChal(x), comp: player.chal.comps[x].gte(tmp.chal.max[x])})
            if (unl) tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0)+(tmp.chal.max[x].gte(EINF)?"":" / "+format(tmp.chal.max[x],0)))
        }
        tmp.el.chal_enter.setVisible(tmp.chal.ch != player.chal.active || tmp.chal.ch == 16)
        tmp.el.chal_enter.setTxt(tmp.chal.ch == player.chal.active ? "Retry Challenge" : "Enter Challenge")
        tmp.el.chal_exit.setVisible(player.chal.active != 0)
        tmp.el.chal_exit.setTxt(tmp.chal.canFinish && !hasTree("qol6") ? "Finish (+"+format(tmp.chal.gain,0)+")" : "Exit Challenge")
        tmp.el.chal_auto.setDisplay(tmp.chal.ch == 16)
        tmp.el.chal_auto.setTxt("Auto-retry: " + (player.options.auto_retry ? "ON" : "OFF"))
        tmp.el.chal_desc_div.setDisplay(tmp.chal.ch != 0)
        if (tmp.chal.ch != 0) {
            let chal = CHALS[tmp.chal.ch], scale = CHALS.getScaleName(tmp.chal.ch)
            tmp.el.chal_ch_title.setTxt(`[${tmp.chal.ch}] ${chal.title}`)
            tmp.el.chal_ch_comp.setTxt(`[${(scale?scale+": ":"")+format(player.chal.comps[tmp.chal.ch],0)+(tmp.chal.max[tmp.chal.ch].gte(EINF)?"":"/"+format(tmp.chal.max[tmp.chal.ch],0))} Completions]`)
            tmp.el.chal_ch_desc.setHTML(chal.desc)
            tmp.el.chal_ch_reset.setHTML(CHALS.getReset(tmp.chal.ch))
            tmp.el.chal_ch_goal.setTxt("Goal: "+CHALS.getFormat(tmp.chal.ch)(tmp.chal.goal[tmp.chal.ch])+CHALS.getResName(tmp.chal.ch))
            tmp.el.chal_ch_reward.setHTML("Reward: "+(typeof chal.reward == 'function' ? chal.reward() : chal.reward))
            tmp.el.chal_ch_eff.setHTML("Currently: "+chal.effDesc(tmp.chal.eff[tmp.chal.ch]))
        }
    }
    if (tmp.tab_name == "qc"){
        updateQCHTML()
    }
}

function enterChal() {
    if (tmp.chal.ch == 16) startC16()
    else CHALS.enter()
}

function updateChalTemp() {
    if (!tmp.chal) tmp.chal = {
        ch: 0,
        goal: {},
        max: {},
        eff: {},
        bulk: {},
        unl: false,
        canFinish: false,
        gain: E(0),
    }
    let s = tmp.qu.chroma_eff[2], w = treeEff('ct5'), v = 12

    if (hasTree('ct5')) v++
    if (hasTree('ct7')) v++
    if (hasTree('ct13')) v++

    tmp.chal.unl = EVO.amt == 4 && player.qu.times.gte(200)
    for (let x = 1; x <= CHALS.cols; x++) {
		let unl = CHALS[x].unl()
        if (unl) tmp.chal.unl = true

        let q = x<=8?s:hasElement(174)&&x<=12?s.root(5):hasTree('ct5')&&x<=v?w:E(1)
        if (x == 9) q = Decimal.min(q,'e150')

        if (EVO.amt >= 2 && [6,8].includes(x)) q = E(1)
        tmp.chal.eff[x] = CHALS[x].effect(FERMIONS.onActive("05")?E(0):player.chal.comps[x].mul(q))

        let data = CHALS.getChalData(x)
        tmp.chal.max[x] = CHALS.getMax(x)
        tmp.chal.goal[x] = data.goal
        tmp.chal.bulk[x] = data.bulk
    }
    tmp.chal.format = player.chal.active != 0 ? CHALS.getFormat() : format
    tmp.chal.gain = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].min(tmp.chal.max[player.chal.active]).sub(player.chal.comps[player.chal.active]).max(0).floor() : E(0)
    tmp.chal.canFinish = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].gt(player.chal.comps[player.chal.active]) : false
}

const CHALS = {
    choose(x) {
        if (tmp.chal.ch == x) {
            this.exit()
            this.enter()
        }
        tmp.chal.ch = x
    },
    inChal(x) { return player.chal.active == x || (player.chal.active == 15 && x <= 12) || (player.chal.active == 20 && x <= 19) },
    reset(x, chal_reset=true) {
        if (x < 5) FORMS.bh.doReset()
        else if (x < 9) ATOM.doReset(chal_reset)
        else if (x < 13) SUPERNOVA.reset(true, true)
        else if (x < 16) DARK.doReset(true)
        else if (x == 16) MATTERS.final_star_shard.reset(true)
        else INF.doReset()
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
    enter(ch=tmp.chal.ch) {
        if (player.chal.active == 0) {
            if (ch == 16) {
                if (tmp.bh.unl) player.bh.mass = E(0)
                player.dark.c16.first = true
                addQuote(10)
            }
            player.chal.active = ch
            this.reset(ch, true)
        } else if (ch != player.chal.active) {
            this.exit(true)
            player.chal.active = ch
            this.reset(ch, true)
        }
    },
    getResource(x) {
        if (x < 5 || x > 8) return player.mass
        if (EVO.amt >= 2) return WORMHOLE.total()
        return player.bh.mass
    },
    getResName(x) {
        if (x < 5 || x > 8) return ''
        return EVO.amt >= 2 ? ' of Wormhole' : ' of Black Hole'
    },
    getFormat(x) {
        return formatMass
    },
    getReset(x) {
        let h = `a <b class='bh'>Black Hole</b>`
        if (x > 4) h = `an <b class='cyan'>Atomic</b>`
        if (x > 8) h = `a <b class='magenta'>Supernova</b>`
        if (x > 12) h = `a <b class='gray'>Darkness</b>`
        if (x == 16) h = `a <b>Final Star Shard</b>`
        if (x > 16) h = `a <b class='yellow'>Infinity</b>`
 
        return `Entering will force ${h} reset!`
    },
    getMax(i) {
        if (i == 6 && EVO.amt >= 2) return E(100)
        if (i == 8 && EVO.amt >= 2) return E(30)
        if (i <= 12 && hasPrestige(2,25)) return EINF 
        if ((i==13||i==14||i==15) && hasInfUpgrade(19)) return EINF 
        let x = this[i].max
        if (i == 16) {
            if (hasElement(229)) x = E(100)
            if (hasElement(261)) x = x.add(100)
            if (hasElement(271)) x = x.add(300)
            if (hasElement(286)) x = x.add(500)
        }
        else if (i < 16) {
            if (i <= 4 && !betterC7Effect()) x = x.add(tmp.chal?tmp.chal.eff[7]:0)
            if (hasElement(13) && (i==5||i==6)) x = x.add(elemEffect(13,0))
            if (hasElement(20) && (i==7)) x = x.add(50)
            if (hasElement(41) && (i==7)) x = x.add(50)
            if (hasElement(60) && (i==7)) x = x.add(100)
            if (hasElement(33) && (i==8)) x = x.add(50)
            if (hasElement(56) && (i==8)) x = x.add(200)
            if (hasElement(65) && (i==7||i==8)) x = x.add(200)
            if (hasElement(70) && (i==7||i==8)) x = x.add(200)
            if (hasElement(73) && (i==5||i==6||i==8)) x = x.add(elemEffect(73,0))
            if (hasTree("chal1") && (i==7||i==8)) x = x.add(100)
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
        }
        
        return x.floor()
    },
    getScaleName(i) {
        return ["", "Hardened", "Insane", "Impossible"][CHALS.getChalData(i).scaling]
    },
    getPower(i) {
        let x = E(1)
        if (i == 16) return x
        if (hasElement(2)) x = x.mul(0.75)
        if (hasElement(26)) x = x.mul(elemEffect(26))
        if (hasElement(180) && i <= 12) x = x.mul(.7)
        if (i != 7 && betterC7Effect()) x = x.mul(tmp.chal.eff[7])
        return x
    },
    getPower2(i) {
        let x = E(1)
        if (i == 16) return x
        if (hasElement(92)) x = x.mul(0.75)
        if (hasElement(120)) x = x.mul(0.75)
        if (hasElement(180) && i <= 12) x = x.mul(.7)
        if (i != 7 && betterC7Effect()) x = x.mul(tmp.chal.eff[7])
        return x
    },
    getPower3(i) {
        let x = E(1)
        if (i == 16) return x
        if (i <= 8) x = x.div(escrowBoost("chal"))
        if (hasElement(120)) x = x.mul(0.75)
        if (hasElement(180) && i <= 12) x = x.mul(.7)
        return x
    },
    getChalData(x, r=E(-1)) {
        let res = this.getResource(x)
        let lvl = r.lt(0)?player.chal.comps[x]:r
        let chal = this[x], fp = 1, goal = EINF, bulk = E(0), scaling = 0

        if (x > 16) {
            goal = chal.start.pow(Decimal.pow(chal.inc,lvl.scale(10,2,0).pow(chal.pow)))
            if (res.gte(chal.start)) bulk = res.log(chal.start).log(chal.inc).root(chal.pow).scale(10,2,0,true).add(1).floor()
        } else if (x == 16) {
            goal = lvl.gt(0) ? Decimal.pow('ee23',Decimal.pow(2,lvl.scale(500,2,0).sub(1).pow(1.5))) : chal.start
            if (res.gte(chal.start)) bulk = res.log('ee23').max(1).log(2).root(1.5).add(1).scale(500,2,0,true).floor()
            if (res.gte('ee23')) bulk = bulk.add(1)
        } else if (x <= 8 && EVO.amt >= 2) {
			let base = x == 8 ? 10 : 100
			goal = E(2).pow(lvl.mul(this.getPower3(x))).mul(base)
			bulk = res.div(base).log(2).div(this.getPower3(x)).add(1).floor()
        } else {
            if (QCs.active() && x <= 12) fp /= tmp.qu.qc.eff[5]
            let s1 = x > 8 ? 10 : 75
            let s2 = 300
            if (x == 8) s2 = 200
            if (x > 8) s2 = 50
            let s3 = E(1000)
            if (x == 13 || x == 16) {
                s1 = 2
                s2 = 5
                s3 = E(10)
            }
            if (x <= 12) s3 = s3.mul(exoticAEff(0,3))
            let pow = chal.pow
            if (hasElement(10) && (x==3||x==4)) pow = pow.mul(0.95)
            chal.pow = chal.pow.max(1)
            goal = chal.inc.pow(lvl.div(fp).pow(pow)).mul(chal.start)
            bulk = res.div(chal.start).max(1).log(chal.inc).root(pow).mul(fp).add(1).floor()
            if (res.lt(chal.start)) bulk = E(0)
            if (lvl.max(bulk).gte(s1)) {
                let start = E(s1);
                let exp = E(3).pow(this.getPower(x));
                scaling++
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
                scaling++
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
                scaling++
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

        return {goal, bulk, scaling}
    },
    1: {
        unl() { return EVO.amt < 2 && (player.mass.gte(1e125) || player.chal.unl || player.atom.unl) },
        title: "Instant Scale",
        desc: "Super Ranks and Mass Upgrades start at 25 and Super Tickspeed starts at 50.",
        reward: ()=>hasBeyondRank(2,20)?`Supercritical Rank & All Fermions Tier scaling starts later, Super Overpower scales weaker based on completions.`:`Super Rank scales later and Super Tickspeed scales weaker.`,
        max: E(100),
        inc: E(5),
        pow: E(1.3),
        start: E(1e35),
        effect(x) {
            let c = hasBeyondRank(2,20)
            let rank = c?E(0):x.softcap(20,4,1).floor()
            let tick = c?E(1):E(0.96).pow(x.root(2))
            let scrank = x.add(1).log10().div(10).add(1).root(3)
            let over = Decimal.pow(0.99,x.add(1).log10().root(2)).max(.5)
            return {rank: rank, tick: tick, scrank, over}
        },
        effDesc(x) { return hasBeyondRank(2,20)?formatMult(x.scrank)+" later to Supercritical Rank & All Fermions starting, "+formatReduction(x.over)+" weaker to Super Overpower scaling":"+"+format(x.rank,0)+" later to Super Rank starting, "+format(E(1).sub(x.tick).mul(100))+"% weaker to Super Tickspeed scaling" },
    },
    2: {
        unl() { return EVO.amt < 2 && (player.chal.comps[1].gte(1) || player.atom.unl) },
        title: "Anti-Tickspeed",
        desc: "You cannot buy Tickspeed.",
        reward: `+9% Tickspeed Power per completion.`,
        max: E(100),
        inc: E(10),
        pow: E(1.3),
        start: E(1e30),
        effect(x) {
            let sp = E(0.5)
            if (hasElement(8)) sp = sp.pow(0.25)
            if (hasElement(39)) sp = E(1)
            let ret = x.mul(0.09).add(1).softcap(1.3,sp,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x.mul(100))+"%"+(x.gte(0.3)?" <span class='soft'>(softcapped)</span>":"") },
    },
    3: {
        unl() { return EVO.amt < 2 && (player.chal.comps[2].gte(1) || player.atom.unl) },
        title: "Melted Mass",
        desc: "Mass gain softcap starts 150 OoMs eariler, and is stronger.",
        reward: `Raise Mass gain. (nullified in this challenge)`,
        max: E(100),
        inc: E(25),
        pow: E(1.25),
        start: E(1e38),
        effect(x) {
            if (hasElement(64)) x = x.mul(1.5)
            let ret = hasElement(133) ? x.root(4/3).mul(0.01).add(1) : x.root(1.5).mul(0.01).add(1)
            return overflow(ret.softcap(3,0.25,0),1e12,0.5)
        },
        effDesc(x) { return formatPow(x)+(x.gte(3)?" <span class='soft'>(softcapped)</span>":"") },
    },
    4: {
        unl() { return EVO.amt < 2 && (player.chal.comps[3].gte(1) || player.atom.unl) },
        title: "Weakened Rage",
        get desc() { return `Reduce Rage Powers by ^0.1. Mass softcaps ${formatMult(1e100,0)} eariler.` },
        reward: `Raise Rage Powers.`,
        max: E(100),
        inc: E(30),
        pow: E(1.25),
        start: E(1e120),
        effect(x) {
            if (hasElement(64)) x = x.mul(1.5)
            let ret = hasElement(133) ? x.root(4/3).mul(0.02).add(1) : x.root(1.5).mul(0.01).add(1)
            return overflow(ret.softcap(3,0.25,0),1e12,0.5)
        },
        effDesc(x) { return formatPow(x)+(x.gte(3)?" <span class='soft'>(softcapped)</span>":"") },
    },
    5: {
        unl() { return player.atom.unl && EVO.amt < 3 },
        title: "No Rank",
        desc: "You cannot rank up.",
        reward: ()=>hasAscension(0,22)?`Supercritical Rank, Ultra Hex scale weaker based on completions.`:hasCharger(3)?`Exotic Rank & Tier, Ultra Prestige scale weaker based on completions.`:`Rank requirement is weaker based on completions.`,
        max: E(50),
        inc: E(50),
        pow: E(1.25),
        start: E(1.5e136),
        effect(x) {
            let c = hasCharger(3)
            if (!c && hasPrestige(1,127)) return E(1)
            let ret = c?Decimal.pow(0.97,x.add(1).log10().root(4)):E(0.97).pow(x.root(2))
            if (hasAscension(0,22)) ret = ret.root(2)
            if (hasElement(288)) ret = ret.pow(2)
            return ret
        },
        effDesc(x) { return hasCharger(3)?formatReduction(x)+" weaker":format(E(1).sub(x).mul(100))+"% weaker" },
    },
    6: {
        unl() { return (player.chal.comps[5].gte(1) || tmp.sn.unl) && EVO.amt < 3 },
        title: "No Tickspeed & Condenser",
        get desc() { return `You cannot ${EVO.amt >= 2 ? "Meditate or split Wormhole" : "buy Tickspeed or BH Condenser"}.` },
        reward: () => EVO.amt >= 2 ? `Gain +10% more Fabric per completion.` : `Every completion adds 10% to tickspeed and BH condenser power.`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.989e38),
        effect(x) {
            if (EVO.amt < 2) return x.mul(0.1).add(1).softcap(1.5,hasElement(39)?1:0.5,0).sub(1)
            if (EVO.amt >= 2) return x.mul(0.1).mul(hasElement(80,1) ? E(1.1).pow(x) : 1).add(1)
        },
        effDesc(x) { return EVO.amt>=2?formatMult(x):"+"+format(x)+"x"+(x.gte(0.5)?" <span class='soft'>(softcapped)</span>":"") },
    },
    7: {
        unl() { return (player.chal.comps[6].gte(1) || tmp.sn.unl) && EVO.amt < 3 },
        title: "No Rage Powers",
        get desc() { return `You cannot gain ${EVO.amt >= 2 ? "calm powers" : "rage powers"}. Instead, ${EVO.amt >= 2 ? "fabric" : "dark matters"} are gained from mass at a reduced rate. Additionally, mass gain softcap is stronger.` },
        reward: ()=>(betterC7Effect()?`Pre-Impossible challenges scale weaker by completions, but this reward doesn't affect C7.`:`Each completion increases challenges 1-4 cap by 2.`) + `<br><span class="gold">On 1st completion, unlock Elements</span>`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.5e76),
        effect(x) {
            let c = betterC7Effect()
            let ret = c?Decimal.pow(0.987,x.add(1).log10().root(2)):x.mul(2)
            if (hasElement(5)) ret = c?ret.pow(2):ret.mul(2)
            return c?ret:ret.floor()
        },
        effDesc(x) { return betterC7Effect()?formatReduction(x)+" weaker":"+"+format(x,0) },
    },
    8: {
        unl() { return (player.chal.comps[7].gte(1) || tmp.sn.unl) && EVO.amt < 3 },
        title: "White Hole",
        get desc() { return EVO.amt >= 2 ? "Fabric & Wormhole masses are square-rooted." : "Dark Matter & Mass from Black Hole gains are rooted by 8." },
        reward: () => (EVO.amt >= 2 ? `Gain +20% more Fabric per completion.` : `Dark Matter & Mass from Black Hole gains are raised by completions.`) + `<br><span class="gold">On 1st completion, unlock 3 rows of Elements</span>`,
        max: E(50),
        inc: E(80),
        pow: E(1.3),
        start: E(1e30),
        effect(x) {
            if (EVO.amt >= 2) return x.mul(0.2).mul(hasElement(80,1) ? E(1.2).pow(x) : 1).add(1)
            if (hasElement(64)) x = x.mul(1.5)
            let ret = hasElement(133) ? x.root(1.5).mul(0.025).add(1) : x.root(1.75).mul(0.02).add(1)
            return overflow(ret.softcap(2.3,0.25,0),1e10,0.5)
        },
        effDesc(x) { return EVO.amt >= 2 ? formatMult(x) : formatPow(x)+(x.gte(2.3)?" <span class='soft'>(softcapped)</span>":"") },
    },
    9: {
        unl() { return hasTree("chal4") },
        title: "No Particles",
        desc: "You cannot assign quarks. Additionally, mass gains exponent is raised to 0.9th power.",
        reward: () => EVO.amt >= 3 ? `Gain +10% more protostars per completion.` : `Improve Magnesium-12.`,
        max: E(100),
        inc: E('e500'),
        pow: E(2),
        start: E('e9.9e4').mul(1.5e56),
        effect(x) {
            if (EVO.amt >= 3) return Decimal.pow(1.1,expMult(x,0.5)).softcap(1e9,3,'log')

            let ret = x.root(hasTree("chal4a")?3.5:4).mul(0.1).add(1)            
            if (!hasElement(41,1)) ret = ret.softcap(21,hasElement(8,1)&&EVO.amt<2?0.253:0.25,0)
            if (hasElement(31,1) && tmp.chal) ret = ret.pow(tmp.chal.eff[16]||1)

            ret = ret.overflow(5e8,EVO.amt>=2?.25:.5).softcap(1e12,0.1,0)
            return ret
        },
        effDesc(x) { return EVO.amt >= 3?formatMult(x):formatPow(x)+softcapHTML(x,21) },
    },
    10: {
        unl() { return hasTree("chal5") },
        title: "The Reality I",
        desc: "You are trapped in mass dilation and challenges 1-8.",
        reward: () => (EVO.amt >= 3 ? `Gain +10% more protostars per completion.` : `The exponent of the RP formula is multiplied by completions. (this effect doesn't work while in this challenge)`) + `<br><span class="gold">On 1st completion, unlock Fermions</span>`,
        max: E(100),
        inc: E('e2000'),
        pow: E(2),
        start: E('e3e4').mul(1.5e56),
        effect(x) {
            let ret = EVO.amt >= 3 ? Decimal.pow(1.1,expMult(x,0.5)).softcap(1e9,3,'log') : x.root(1.75).mul(EVO.amt >= 2 ? 0.1 : 0.01).add(1)
            return ret
        },
        effDesc(x) { return formatMult(x) },
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
        reward: `Completions add free Radiation Boosters.<br><span class="gold">On 1st completion, unlock <b class='light_green'>Quantum</b></span>`,
        max: E(100),
        inc: E('e2e7'),
        pow: E(2),
        get start() { return EVO.amt >= 2 ? uni('ee7') : uni('e8.4e8') },
        effect(x) {
            let ret = x.root(hasTree("chal7a")?1.5:2)
            return overflow(ret.softcap(50,0.5,0),1e50,0.5)
        },
        effDesc(x) { return "+"+format(x)+softcapHTML(x,50) },
    },
    13: {
        unl() { return hasElement(132) },
        title: "Absolutely Black Mass",
        desc: "Normal mass and mass of black hole gains are set to lg(x)^^1.5.",
        reward: `Increase dark ray earned based on completions.<br><span class="gold">On 1st completion, unlock more features!</span>`,
        max: E(25),
        inc: E('e2e4'),
        pow: E(8),
        start: uni('e2e5'),
        effect(x) {
            let ret = x.add(1).pow(1.5)
            return ret
        },
        effDesc(x) { return formatMult(x,1) },
    },
    14: {
        unl() { return hasElement(144) },
        title: "No Dmitri Mendeleev",
        get desc() { return `You cannot purchase any pre-118 elements. Additionally, you are trapped in quantum challenge with modifiers ${getQCForceDisp(14)}.` },
        reward: `Gain more primordium theorems.<br><span class="gold">On 1st completion, unlock more features!</span>`,
        max: E(100),
        inc: E('e2e19'),
        pow: E(3),
        start: uni('ee20'),
        effect(x) {
            let ret = x.div(25).add(1)
            return ret
        },
        effDesc(x) { return formatMult(x,2) },
    },
    15: {
        unl() { return hasElement(168) },
        title: "The Reality II",
        get desc() { return `You are trapped in c1-12 and quantum challenge with modifiers ${getQCForceDisp(15)}.` },
        reward: `Mass, Atomic & Quark overflows scale later.<br><span class="gold">On 1st completion, unlock more features!</span>`,
        max: E(100),
        inc: E('ee6'),
        pow: E(2),
        start: uni('e2e7'),
        effect(x) {
            let ret = x.add(1).pow(2)
            return ret
        },
        effDesc(x) { return formatPow(x,2)+" later" },
    },
    16: {
        unl() { return hasElement(218) },
        title: "Chaotic Matter Annihilation",
        get desc() { return `
        • You cannot gain rage powers, and all matters' formulas are disabled, and they generate each other. Red matter generates dark matter.<br>
        • Pre-C16 features, such as rank, prestige tiers, main upgrades, elements, tree upgrades, etc. may be corrupted (disabled).<br>
        • You are trapped in Mass Dilation & Dark Run with 100 all glyphs (10 slovak glyphs).<br>
        • Primordium particles are disabled.<br>
        • Pre-Quantum global speed is always set to /100.
		<br class='line'>
        You can earn Corrupted Shards based on your mass of black hole, when exiting the challenge${EVO.amt >= 2 ? "" : `with more than <b>${formatMass(EVO.amt >= 1 ? 1e70 : 1e100)}</b> of black hole`}.
        ` },
        reward: `Improve Hybridized Uran-Astatine.<br><span class="gold">On 1st completion, unlock <b class='yellow'>Infinity</b></span>`,
        max: E(1),
        start: E('e1.25e11'),
        effect(x) {
            if (hasBeyondRank(12,1)) x = x.mul(beyondRankEffect(12,1))
            if (tmp.chal.eff[18]) x = x.mul(tmp.chal.eff[18][0])
            let ret = x.root(3).mul(0.05).add(1)
            return ret.softcap(3,0.5,0)
        },
        effDesc(x) { return formatPow(x)+x.softcapHTML(3) },
    },
    17: {
        unl() { return hasElement(240) },
        title: "Unnatural Tickspeed",
        desc: `Tickspeeds, Accelerators, BHC, FVM, Cosmic Rays, Star Boosters, and Cosmic Strings (including bonuses) don't work, they are unaffordable or unobtainable. Second neutron effect doesn't work until Atom Upgrade 18. Black Hole's effect doesn't work until Binilunium-201. You are stuck in dark run with 250 all glyphs (unaffected by weakness).`,
        reward: `Per completion, increase the softcap of theorem's level starting by +3.<br><span class="yellow">On 4th completion, unlock Ascensions and more elements.</span>`,
        max: E(100),
        get start() { return E(EVO.amt >= 4 ? 'ee210' : 'ee92') },
        get inc() { return E(EVO.amt >= 4 ? 1e5 : 2) },
        pow: E(2),
        effect(x) {
            let b = 3
            if (hasElement(35,1)) b++       
            return x.mul(b)
        },
        effDesc: x => "+"+format(x,0)+" later",
    },
    18: {
        unl() { return hasElement(258) },
        title: "Reinforced Scaling",
        desc: `
        You cannot weaken nor remove pre-Infinity scalings. You are stuck in dark run with 500 all glyphs (unaffected by weakness).
        `,
        get reward () { return (EVO.amt >= 2 ? `Corrupted Stars` : `Hybridized Uran-Astatine`) + ` weaken pre-Hex Exotic scalings, and strengthen C16's reward.<br><span class="yellow">On 4th completion, unlock fifth star in the theorem and more features.</span>` },
        max: E(100),
        get start() { return E(EVO.amt >= 4 ? 'ee170' : EVO.amt >= 2 ? 'ee140' : 'ee340') },
        inc: E(10),
        pow: E(3),
        effect(x) {
			let xx = x.pow(1.5).div(2).add(1)
			let yy = E(1)
			if (EVO.amt < 2 && x.gte(1) && tmp.qu) yy = tmp.qu.chroma_eff[1][1]
			if (EVO.amt >= 2 && x.gte(1) && tmp.inf_unl) yy = player.inf.cs_amount.max(1).log10().div(10).sub(1).max(2).log(2).pow(-.5)
            return [xx, yy]
        },
        effDesc(x) { return (x[1].lt(1) ? `${formatReduction(x[1])} to those scalings, ` : "") + formatPercent(x[0].sub(1))+' stronger' },
    },
    19: {
        unl() { return hasElement(280) },
        title: "Yin Yang Malfunction",
        get desc() { return `
        You cannot become/generate supernovas, produce star resources, dark ray (it is capped at ${format(1e12)}), dark shadow, and abyssal blot, nor purchase tree upgrades. You are stuck in dark run with 1000 all glyphs (unaffected by weakness). This challenge resets supernova.
        `},
        get reward() { return `
        Generate more ${EVO.amt>=4?'stardust':'supernovas'} by completions.<br><span class="gold">On ${["10th","4th","2nd","3rd","2nd"][EVO.amt]} completion, unlock sixth row of infinity upgrades${EVO.amt==3?" and seventh star in the theorem":""}.</span>
        `},
        max: E(100),
        get inc() { return E(EVO.amt >= 4 ? 1e3 : 1e10) },
        get pow() { return E(3) },
        get start() { return E(EVO.amt >= 4 ? 'ee2600' : EVO.amt >= 2 ? 'ee666' : EVO.amt >= 1 ? 'ee2555' : 'ee5555') },
        effect: (x) => EVO.amt >= 4 ? E(10).pow(x.sub(3)).max(1) : Decimal.pow(100,expMult(x.mul(10),2/3).div(10)),
        effDesc(x) { return formatMult(x) },
    },
    20: {
        unl() { return hasElement(290) },
        title: "The Reality III",
        desc: "You are trapped in C1-19 and dark run with 1500 all glyphs. Theorems in the Core don't work. This challenge resets main upgrades.",
        get reward() { return `<span class="gold">Break the loop and evolve!</span>` + (OURO.unl ? "" : "<br>(Unlock a new layer!)") },
        max: E(1),
        inc: E(2),
        pow: E(1),
        start: E('e1.5e25'),
        effect: x => x.gte(1),
        effDesc(x) { return x ? "<b class='snake'>Ouroboric</b> unlocked!" : "Locked" },
    },
    cols: 20,
}

function betterC7Effect() {
	return hasPrestige(2,25) || EVO.amt >= 2
}
