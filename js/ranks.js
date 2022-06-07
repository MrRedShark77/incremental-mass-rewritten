const RANKS = {
    names: ['rank', 'tier', 'tetr', 'pent'],
    fullNames: ['Rank', 'Tier', 'Tetr', 'Pent'],
    reset(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].add(1)
            let reset = true
            if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            if (type == "tetr" && hasTree("qol5")) reset = false
            if (type == "pent" && hasTree("qol8")) reset = false
            if (reset) this.doReset[type]()
            updateRanksTemp()
        }
    },
    bulk(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].max(tmp.ranks[type].bulk.max(player.ranks[type].add(1)))
            let reset = true
            if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            if (type == "tetr" && hasTree("qol5")) reset = false
            if (type == "pent" && hasTree("qol8")) reset = false
            if (reset) this.doReset[type]()
            updateRanksTemp()
        }
    },
    unl: {
        tier() { return player.ranks.rank.gte(3) || player.ranks.tier.gte(1) || player.mainUpg.atom.includes(3) || tmp.radiation.unl },
        tetr() { return player.mainUpg.atom.includes(3) || tmp.radiation.unl },
        pent() { return tmp.radiation.unl },
    },
    doReset: {
        rank() {
            player.mass = E(0)
            for (let x = 1; x <= UPGS.mass.cols; x++) if (player.massUpg[x]) player.massUpg[x] = E(0)
        },
        tier() {
            player.ranks.rank = E(0)
            this.rank()
        },
        tetr() {
            player.ranks.tier = E(0)
            this.tier()
        },
        pent() {
            player.ranks.tetr = E(0)
            this.tetr()
        },
    },
    autoSwitch(rn) { player.auto_ranks[rn] = !player.auto_ranks[rn] },
    autoUnl: {
        rank() { return player.mainUpg.rp.includes(5) },
        tier() { return player.mainUpg.rp.includes(6) },
        tetr() { return player.mainUpg.atom.includes(5) },
        pent() { return hasTree("qol8") },
    },
    desc: {
        rank: {
            '1': "unlock mass upgrade 1.",
            '2': "unlock mass upgrade 2, reduce mass upgrade 1 cost scaled by 20%.",
            '3': "unlock mass upgrade 3, reduce mass upgrade 2 cost scaled by 20%, mass upgrade 1 boosts itself.",
            '4': "reduce mass upgrade 3 cost scale by 20%.",
            '5': "mass upgrade 2 boosts itself.",
            '6': "make mass gain is boosted by (x+1)^2, where x is rank.",
            '13': "triple mass gain.",
            '14': "double Rage Powers gain.",
            '17': "make rank 6 reward effect is better. [(x+1)^2 -> (x+1)^x^1/3]",
            '34': "make mass upgrade 3 softcap start 1.2x later.",
            '40': "adds tickspeed power based on ranks.",
            '45': "ranks boosts Rage Powers gain.",
            '90': "rank 40 reward is stronger.",
            '180': "mass gain is raised by 1.025.",
            '220': "rank 40 reward is overpowered.",
            '300': "rank multiplie quark gain.",
            '380': "rank multiplie mass gain.",
            '800': "make mass gain softcap 0.25% weaker based on rank.",
        },
        tier: {
            '1': "reduce rank reqirements by 20%.",
            '2': "raise mass gain by 1.15",
            '3': "reduce all mass upgrades cost scale by 20%.",
            '4': "adds +5% tickspeed power for every tier you have, softcaps at +40%.",
            '6': "make rage powers boosted by tiers.",
            '8': "make tier 6's reward effect stronger by dark matters.",
            '12': "make tier 4's reward effect twice effective and remove softcap.",
            '30': "stronger effect's softcap is 10% weaker.",
            '55': "make rank 380's effect stronger based on tier.",
            '100': "Super Tetr scale 5 later.",
        },
        tetr: {
            '1': "reduce tier reqirements by 25%, make Hyper Rank scaling is 15% weaker.",
            '2': "mass upgrade 3 boosts itself.",
            '3': "raise tickspeed effect by 1.05.",
            '4': "Super Rank scale weaker based on Tier, Super Tier scale 20% weaker.",
            '5': "Hyper/Ultra Tickspeed starts later based on tetr.",
            '8': "Mass gain softcap^2 starts ^1.5 later.",
        },
        pent: {
            '1': "reduce tetr reqirements by 15%, make Meta-Rank starts 1.1x later.",
            '2': "tetr boost all radiations gain.",
            '4': "Meta-Tickspeeds start later based on Supernovas.",
            '5': "Meta-Ranks start later based on Pent.",
            '8': "Mass gain softcap^4 starts later based on Pent.",
            '15': "remove 3rd softcap of Stronger's effect.",
        },
    },
    effect: {
        rank: {
            '3'() {
                let ret = E(player.massUpg[1]||0).div(20)
                return ret
            },
            '5'() {
                let ret = E(player.massUpg[2]||0).div(40)
                return ret
            },
            '6'() {
                let ret = player.ranks.rank.add(1).pow(player.ranks.rank.gte(17)?player.ranks.rank.add(1).root(3):2)
                return ret
            },
            '40'() {
                let ret = player.ranks.rank.root(2).div(100)
                if (player.ranks.rank.gte(90)) ret = player.ranks.rank.root(1.6).div(100)
                if (player.ranks.rank.gte(220)) ret = player.ranks.rank.div(100)
                return ret
            },
            '45'() {
                let ret = player.ranks.rank.add(1).pow(1.5)
                return ret
            },
            '300'() {
                let ret = player.ranks.rank.add(1)
                return ret
            },
            '380'() {
                let ret = E(10).pow(player.ranks.rank.sub(379).pow(1.5).pow(player.ranks.tier.gte(55)?RANKS.effect.tier[55]():1).softcap(1000,0.5,0))
                return ret
            },
            '800'() {
                let ret = E(1).sub(player.ranks.rank.sub(799).mul(0.0025).add(1).softcap(1.25,0.5,0).sub(1)).max(0.75)
                return ret
            },
        },
        tier: {
            '4'() {
                let ret = E(0)
                if (player.ranks.tier.gte(12)) ret = player.ranks.tier.mul(0.1)
                else ret = player.ranks.tier.mul(0.05).add(1).softcap(1.4,0.75,0).sub(1)
                return ret
            },
            '6'() {
                let ret = E(2).pow(player.ranks.tier)
                if (player.ranks.tier.gte(8)) ret = ret.pow(RANKS.effect.tier[8]())
                return ret
            },
            '8'() {
                let ret = player.bh.dm.max(1).log10().add(1).root(2)
                return ret
            },
            '55'() {
                let ret = player.ranks.tier.max(1).log10().add(1).root(4)
                return ret
            },
        },
        tetr: {
            '2'() {
                let ret = E(player.massUpg[3]||0).div(400)
                return ret
            },
            '4'() {
                let ret = E(0.96).pow(player.ranks.tier.pow(1/3))
                return ret
            },
            '5'() {
                let ret = player.ranks.tetr.pow(4).softcap(1000,0.25,0)
                return ret
            },
        },
        pent: {
            '2'() {
                let ret = E(1.3).pow(player.ranks.tetr)
                return ret
            },
            '4'() {
                let ret = player.supernova.times.add(1).root(5)
                return ret
            },
            '5'() {
                let ret = E(1.05).pow(player.ranks.pent)
                return ret
            },
            '8'() {
                let ret = E(1.1).pow(player.ranks.pent)
                return ret
            },
        },
    },
    effDesc: {
        rank: {
            3(x) { return "+"+format(x) },
            5(x) { return "+"+format(x) },
            6(x) { return format(x)+"x" },
            40(x) {  return "+"+format(x.mul(100))+"%" },
            45(x) { return format(x)+"x" },
            300(x) { return format(x)+"x" },
            380(x) { return format(x)+"x" },
            800(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
        },
        tier: {
            4(x) { return "+"+format(x.mul(100))+"%" },
            6(x) { return format(x)+"x" },
            8(x) { return "^"+format(x) },
            55(x) { return "^"+format(x) },
        },
        tetr: {
            2(x) { return "+"+format(x) },
            4(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
            5(x) { return "+"+format(x,0)+" later" },
        },
        pent: {
            2(x) { return format(x)+"x" },
            4(x) { return format(x)+"x later" },
            5(x) { return format(x)+"x later" },
            8(x) { return "^"+format(x)+" later" },
        },
    },
    fp: {
        rank() {
            let f = E(1)
            if (player.ranks.tier.gte(1)) f = f.mul(1/0.8)
            f = f.mul(tmp.chal.eff[5].pow(-1))
            return f
        },
        tier() {
            let f = E(1)
            f = f.mul(tmp.fermions.effs[1][3])
            if (player.ranks.tetr.gte(1)) f = f.mul(1/0.75)
            if (player.mainUpg.atom.includes(10)) f = f.mul(2)
            return f
        },
    },
}

const PRESTIGES = {
    fullNames: ["Prestige Level", "Honor"],
    base() {
        let x = E(1)

        for (let i = 0; i < RANKS.names.length; i++) x = x.mul(player.ranks[RANKS.names[i]].add(1))

        return x.sub(1)
    },
    req(i) {
        let x = EINF, y = player.prestiges[i]
        switch (i) {
            case 0:
                x = Decimal.pow(1.1,y.pow(1.1)).mul(2e13)
                break;
            case 1:
                x = y.pow(1.25).mul(3).add(4)
                break;
            default:
                x = EINF
                break;
        }
        return x.ceil()
    },
    bulk(i) {
        let x = E(0), y = i==0?tmp.prestiges.base:player.prestiges[i-1]
        switch (i) {
            case 0:
                if (y.gte(2e13)) x = y.div(2e13).max(1).log(1.1).max(0).root(1.1).add(1)
                break;
            case 1:
                if (y.gte(4)) x = y.sub(4).div(2).max(0).root(1.5).add(1)
                break
            default:
                x = E(0)
                break;
        }
        return x.floor()
    },
    unl: [
        _=>{ return true },
        _=>{ return true },
    ],
    rewards: [
        {
            "1": `All Mass softcaps up to ^5 start ^10 later.`,
            "2": `Quantum Shard Base is increased by 0.5.`,
            "3": `Quadruple Quantum Foam and Death Shard gain.`,
            "5": `Pre-Quantum Global Speed is raised by ^2 (before division).`,
            "6": `Tickspeed Power softcap starts ^100 later.`,
        },
        {
            "1": `All-Star resources are raised by ^2.`,
        },
    ],
    rewardEff: [
        {

            /*
            "1": [_=>{
                let x = E(1)
                return x
            },x=>{
                return x.format()+"x"
            }],
            */
        },
        {

        },
    ],
    reset(i) {
        if (i==0?tmp.prestiges.base.gte(tmp.prestiges.req[i]):player.prestiges[i-1].gte(tmp.prestiges.req[i])) {
            player.prestiges[i] = player.prestiges[i].add(1)
            for (let j = i-1; j >= 0; j--) {
                player.prestiges[j] = E(0)
            }
            QUANTUM.enter(false,true,false,true)
            updateRanksTemp()
        }
    },
}

const PRES_LEN = PRESTIGES.fullNames.length

function hasPrestige(x,y) { return player.prestiges[x].gte(y) }

function prestigeEff(x,y,def=E(1)) { return tmp.prestiges.eff[x][y] || def }

function updateRanksTemp() {
    if (!tmp.ranks) tmp.ranks = {}
    for (let x = 0; x < RANKS.names.length; x++) if (!tmp.ranks[RANKS.names[x]]) tmp.ranks[RANKS.names[x]] = {}
    let fp2 = tmp.qu.chroma_eff[1]
    let fp = RANKS.fp.rank()
    tmp.ranks.rank.req = E(10).pow(player.ranks.rank.div(fp2).scaleEvery('rank').div(fp).pow(1.15)).mul(10)
    tmp.ranks.rank.bulk = E(0)
    if (player.mass.gte(10)) tmp.ranks.rank.bulk = player.mass.div(10).max(1).log10().root(1.15).mul(fp).scaleEvery('rank',true).mul(fp2).add(1).floor();
    tmp.ranks.rank.can = player.mass.gte(tmp.ranks.rank.req) && !CHALS.inChal(5) && !CHALS.inChal(10) && !FERMIONS.onActive("03")

    fp = RANKS.fp.tier()
    tmp.ranks.tier.req = player.ranks.tier.div(fp2).scaleEvery('tier').div(fp).add(2).pow(2).floor()
    tmp.ranks.tier.bulk = player.ranks.rank.max(0).root(2).sub(2).mul(fp).scaleEvery('tier',true).mul(fp2).add(1).floor();

    fp = E(1)
    let pow = 2
    if (hasElement(44)) pow = 1.75
    if (hasElement(9)) fp = fp.mul(1/0.85)
    if (player.ranks.pent.gte(1)) fp = fp.mul(1/0.85)
    if (hasElement(72)) fp = fp.mul(1/0.85)
    tmp.ranks.tetr.req = player.ranks.tetr.div(fp2).scaleEvery('tetr').div(fp).pow(pow).mul(3).add(10).floor()
    tmp.ranks.tetr.bulk = player.ranks.tier.sub(10).div(3).max(0).root(pow).mul(fp).scaleEvery('tetr',true).mul(fp2).add(1).floor();

    fp = E(1)
    pow = 1.5
    tmp.ranks.pent.req = player.ranks.pent.scaleEvery('pent').div(fp).pow(pow).add(15).floor()
    tmp.ranks.pent.bulk = player.ranks.tetr.sub(15).gte(0)?player.ranks.tetr.sub(15).max(0).root(pow).mul(fp).scaleEvery('pent',true).add(1).floor():E(0);

    for (let x = 0; x < RANKS.names.length; x++) {
        let rn = RANKS.names[x]
        if (x > 0) {
            tmp.ranks[rn].can = player.ranks[RANKS.names[x-1]].gte(tmp.ranks[rn].req)
        }
    }

    // Prestige

    tmp.prestiges.base = PRESTIGES.base()
    for (let x = 0; x < PRES_LEN; x++) {
        tmp.prestiges.req[x] = PRESTIGES.req(x)
        for (let y in PRESTIGES.rewardEff[x]) {
            if (PRESTIGES.rewardEff[x][y]) tmp.prestiges.eff[x][y] = PRESTIGES.rewardEff[x][y][0]()
        }
    }
}

function updateRanksHTML() {
    tmp.el.rank_tabs.setDisplay(hasUpgrade('br',9))
    for (let x = 0; x < 2; x++) {
        tmp.el["rank_tab"+x].setDisplay(tmp.rank_tab == x)
    }

    if (tmp.rank_tab == 0) {
        for (let x = 0; x < RANKS.names.length; x++) {
            let rn = RANKS.names[x]
            let unl = RANKS.unl[rn]?RANKS.unl[rn]():true
            tmp.el["ranks_div_"+x].setDisplay(unl)
            if (unl) {
                let keys = Object.keys(RANKS.desc[rn])
                let desc = ""
                for (let i = 0; i < keys.length; i++) {
                    if (player.ranks[rn].lt(keys[i])) {
                        desc = ` At ${RANKS.fullNames[x]} ${format(keys[i],0)}, ${RANKS.desc[rn][keys[i]]}`
                        break
                    }
                }
    
                tmp.el["ranks_scale_"+x].setTxt(getScalingName(rn))
                tmp.el["ranks_amt_"+x].setTxt(format(player.ranks[rn],0))
                tmp.el["ranks_"+x].setClasses({btn: true, reset: true, locked: !tmp.ranks[rn].can})
                tmp.el["ranks_desc_"+x].setTxt(desc)
                tmp.el["ranks_req_"+x].setTxt(x==0?formatMass(tmp.ranks[rn].req):RANKS.fullNames[x-1]+" "+format(tmp.ranks[rn].req,0))
                tmp.el["ranks_auto_"+x].setDisplay(RANKS.autoUnl[rn]())
                tmp.el["ranks_auto_"+x].setTxt(player.auto_ranks[rn]?"ON":"OFF")
            }
        }
    }
    if (tmp.rank_tab == 1) {
        tmp.el.pres_base.setTxt(tmp.prestiges.base.format(0))

        for (let x = 0; x < PRES_LEN; x++) {
            let unl = PRESTIGES.unl[x]?PRESTIGES.unl[x]():true

            tmp.el["pres_div_"+x].setDisplay(unl)

            if (unl) {
                let p = player.prestiges[x] || E(0)
                let keys = Object.keys(PRESTIGES.rewards[x])
                let desc = ""
                for (let i = 0; i < keys.length; i++) {
                    if (p.lt(keys[i])) {
                        desc = ` At ${PRESTIGES.fullNames[x]} ${format(keys[i],0)}, ${PRESTIGES.rewards[x][keys[i]]}`
                        break
                    }
                }

                //tmp.el["pres_scale_"+x].setTxt(getScalingName(rn))
                tmp.el["pres_amt_"+x].setTxt(format(p,0))
                tmp.el["pres_"+x].setClasses({btn: true, reset: true, locked: x==0?tmp.prestiges.base.lt(tmp.prestiges.req[x]):player.prestiges[x-1].lt(tmp.prestiges.req[x])})
                tmp.el["pres_desc_"+x].setTxt(desc)
                tmp.el["pres_req_"+x].setTxt(x==0?format(tmp.prestiges.req[x],0)+" of Prestige Base":PRESTIGES.fullNames[x-1]+" "+format(tmp.prestiges.req[x],0))
                tmp.el["pres_auto_"+x].setDisplay(false)
                tmp.el["pres_auto_"+x].setTxt(false?"ON":"OFF")
            }
        }
    }
}