const RANKS = {
    names: ['rank', 'tier'],
    fullNames: ['Rank', 'Tier'],
    reset(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].add(1)
            let reset = true
            if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
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
            if (reset) this.doReset[type]()
            updateRanksTemp()
        }
    },
    unl: {
        tier() { return player.ranks.rank.gte(3) || player.ranks.tier.gte(1) },
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
    },
    autoSwitch(rn) { player.auto_ranks[rn] = !player.auto_ranks[rn] },
    autoUnl: {
        rank() { return player.mainUpg.rp.includes(5) },
        tier() { return player.mainUpg.rp.includes(6) },
    },
    desc: {
        rank: {
            1: "unlock mass upgrade 1.",
            2: "unlock mass upgrade 2, reduce mass upgrade 1 cost scaled by 20%.",
            3: "unlock mass upgrade 3, reduce mass upgrade 2 cost scaled by 20%, mass upgrade 1 boosts itself.",
            4: "reduce mass upgrade 3 cost scaled by 20%.",
            5: "mass upgrade 2 boosts itself.",
            6: "make mass gain is boosted by (x+1)^2, where x is rank.",
            13: "triple mass gain.",
            14: "double Rage Powers gain.",
            17: "make rank 6 reward effect is better. [(x+1)^2 -> (x+1)^x^1/3]",
            34: "make mass upgrade 3 softcap starts 1.2x later.",
            40: "adds tickspeed power based on ranks.",
            45: "ranks boosts Rage Powers gain.",
            90: "rank 40 reward are stronger.",
        },
        tier: {
            1: "reduce rank reqirements by 20%.",
            2: "raise mass gain by 1.15",
            3: "reduce all mass upgrades cost scaled by 20%.",
            4: "adds +5% tickspeed power for every tiers you have, softcaps at +40%.",
            6: "make rage powers are boosted by tiers.",
            8: "make tier 6 reward effect is stronger by dark matters.",
        },
    },
    effect: {
        rank: {
            3() {
                let ret = E(player.massUpg[1]||0).div(20)
                return ret
            },
            5() {
                let ret = E(player.massUpg[2]||0).div(40)
                return ret
            },
            6() {
                let ret = player.ranks.rank.add(1).pow(player.ranks.rank.gte(17)?player.ranks.rank.add(1).root(3):2)
                return ret
            },
            40() {
                let ret = player.ranks.rank.root(2).div(100)
                if (player.ranks.rank.gte(90)) ret = player.ranks.rank.root(1.6).div(100)
                return ret
            },
            45() {
                let ret = player.ranks.rank.add(1).pow(1.5)
                return ret
            },
        },
        tier: {
            4() {
                let ret = player.ranks.tier.mul(0.05).add(1).softcap(1.4,0.75,0).sub(1)
                return ret
            },
            6() {
                let ret = E(2).pow(player.ranks.tier)
                if (player.ranks.tier.gte(8)) ret = ret.pow(RANKS.effect.tier[8]())
                return ret
            },
            8() {
                let ret = player.bh.dm.max(1).log10().add(1).root(2)
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
        },
        tier: {
            4(x) { return "+"+format(x.mul(100))+"%" },
            6(x) { return format(x)+"x" },
            8(x) { return "^"+format(x) },
        },
    },
    fp: {
        rank() {
            let f = E(1)
            if (player.ranks.tier.gte(1)) f = f.mul(1/0.8)
            return f
        },
    },
}

function updateRanksTemp() {
    if (!tmp.ranks) tmp.ranks = {}
    for (let x = 0; x < RANKS.names.length; x++) if (!tmp.ranks[RANKS.names[x]]) tmp.ranks[RANKS.names[x]] = {}
    let fp = RANKS.fp.rank()
    tmp.ranks.rank.req = E(10).pow(player.ranks.rank.div(fp).pow(1.15)).mul(10)
    tmp.ranks.rank.bulk = player.mass.div(10).max(1).log10().root(1.15).mul(fp).add(1).floor();
    if (player.mass.lt(10)) tmp.ranks.rank.bulk = 0
    if (scalingActive("rank", player.ranks.rank.max(tmp.ranks.rank.bulk), "super")) {
		let start = getScalingStart("super", "rank");
		let power = getScalingPower("super", "rank");
		let exp = E(1.5).pow(power);
		tmp.ranks.rank.req =
			E(10).pow(
				player.ranks.rank
					.pow(exp)
					.div(start.pow(exp.sub(1)))
                    .div(fp)
					.pow(1.15)
			).mul(10)
		tmp.ranks.rank.bulk = player.mass
            .div(10)
			.max(1)
			.log10()
            
			.root(1.15)
            .mul(fp)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
			.add(1)
			.floor();
	}
    tmp.ranks.rank.can = player.mass.gte(tmp.ranks.rank.req)

    tmp.ranks.tier.req = player.ranks.tier.add(2).pow(2).floor()
    tmp.ranks.tier.bulk = player.ranks.rank.max(0).root(2).sub(1).floor();
    if (scalingActive("tier", player.ranks.tier.max(tmp.ranks.tier.bulk), "super")) {
		let start = getScalingStart("super", "tier");
		let power = getScalingPower("super", "tier");
		let exp = E(2).pow(power);
		tmp.ranks.tier.req =
			player.ranks.tier
			.pow(exp)
			.div(start.pow(exp.sub(1)))
			.add(2).pow(2).floor()
		tmp.ranks.tier.bulk = player.mass
            .max(0)
            .root(2)
            .sub(2)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
			.add(1)
			.floor();
	}

    for (let x = 0; x < RANKS.names.length; x++) {
        let rn = RANKS.names[x]
        if (x > 0) {
            tmp.ranks[rn].can = player.ranks[RANKS.names[x-1]].gte(tmp.ranks[rn].req)
        }
        tmp.ranks[rn].desc = player.ranks[rn].lt(Number.MAX_VALUE)?RANKS.desc[rn][player.ranks[rn].toNumber()+1]?RANKS.desc[rn][player.ranks[rn].toNumber()+1]:(rn+" up."):(rn+" up.")
    }
}