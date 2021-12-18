const RANKS = {
    names: ['rank', 'tier', 'tetr'],
    fullNames: ['Rank', 'Tier', 'Tetr'],
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
        tier() { return player.ranks.rank.gte(3) || player.ranks.tier.gte(1) || player.mainUpg.atom.includes(3) },
        tetr() { return player.mainUpg.atom.includes(3) },
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
    },
    autoSwitch(rn) { player.auto_ranks[rn] = !player.auto_ranks[rn] },
    autoUnl: {
        rank() { return player.mainUpg.rp.includes(5) },
        tier() { return player.mainUpg.rp.includes(6) },
        tetr() { return player.mainUpg.atom.includes(5) },
    },
    desc: {
        rank: {
            1: "unlock mass upgrade 1.",
            2: "unlock mass upgrade 2, reduce mass upgrade 1 cost scaled by 20%.",
            3: "unlock mass upgrade 3, reduce mass upgrade 2 cost scaled by 20%, mass upgrade 1 boosts itself.",
            4: "reduce mass upgrade 3 cost scale by 20%.",
            5: "mass upgrade 2 boosts itself.",
            6: "make mass gain is boosted by (x+1)^2, where x is rank.",
            13: "triple mass gain.",
            14: "double Rage Powers gain.",
            17: "make rank 6 reward effect is better. [(x+1)^2 -> (x+1)^x^1/3]",
            34: "make mass upgrade 3 softcap start 1.2x later.",
            40: "adds tickspeed power based on ranks.",
            45: "ranks boosts Rage Powers gain.",
            90: "rank 40 reward is stronger.",
            180: "mass gain is raised by 1.025.",
            220: "rank 40 reward is overpowered.",
            300: "rank multiplie quark gain.",
            380: "rank multiplie mass gain.",
            800: "make mass gain softcap 0.25% weaker based on rank.",
        },
        tier: {
            1: "reduce rank reqirements by 20%.",
            2: "raise mass gain by 1.15",
            3: "reduce all mass upgrades cost scale by 20%.",
            4: "adds +5% tickspeed power for every tier you have, softcaps at +40%.",
            6: "make rage powers boosted by tiers.",
            8: "make tier 6's reward effect stronger by dark matters.",
            12: "make tier 4's reward effect twice effective and remove softcap.",
            30: "stronger effect's softcap is 10% weaker.",
            55: "make rank 380's effect stronger based on tier.",
            100: "Super Tetr scale 5 later.",
        },
        tetr: {
            1: "reduce tier reqirements by 25%, make Hyper Rank scaling is 15% weaker.",
            2: "mass upgrade 3 boosts itself.",
            3: "raise tickspeed effect by 1.05.",
            4: "Super Rank scale weaker based on Tier, Super Tier scale 20% weaker.",
            5: "Hyper/Ultra Tickspeed starts later based on tetr.",
            8: "Mass gain softcap^2 starts ^1.5 later.",
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
                if (player.ranks.rank.gte(220)) ret = player.ranks.rank.div(100)
                return ret
            },
            45() {
                let ret = player.ranks.rank.add(1).pow(1.5)
                return ret
            },
            300() {
                let ret = player.ranks.rank.add(1)
                return ret
            },
            380() {
                let ret = E(10).pow(player.ranks.rank.sub(379).pow(1.5).pow(player.ranks.tier.gte(55)?RANKS.effect.tier[55]():1).softcap(1000,0.5,0))
                return ret
            },
            800() {
                let ret = E(1).sub(player.ranks.rank.sub(799).mul(0.0025).add(1).softcap(1.25,0.5,0).sub(1)).max(0.75)
                return ret
            },
        },
        tier: {
            4() {
                let ret = E(0)
                if (player.ranks.tier.gte(12)) ret = player.ranks.tier.mul(0.1)
                else ret = player.ranks.tier.mul(0.05).add(1).softcap(1.4,0.75,0).sub(1)
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
            55() {
                let ret = player.ranks.tier.max(1).log10().add(1).root(4)
                return ret
            },
        },
        tetr: {
            2() {
                let ret = E(player.massUpg[3]||0).div(400)
                return ret
            },
            4() {
                let ret = E(0.96).pow(player.ranks.tier.pow(1/3))
                return ret
            },
            5() {
                let ret = player.ranks.tetr.pow(4).softcap(1000,0.25,0)
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
            if (player.ranks.tetr.gte(1)) f = f.mul(1/0.75)
            if (player.mainUpg.atom.includes(10)) f = f.mul(2)
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
    if (scalingActive("rank", player.ranks.rank.max(tmp.ranks.rank.bulk), "hyper")) {
		let start = getScalingStart("super", "rank");
		let power = getScalingPower("super", "rank");
		let exp = E(1.5).pow(power);
        let start2 = getScalingStart("hyper", "rank");
		let power2 = getScalingPower("hyper", "rank");
		let exp2 = E(2.5).pow(power2);
		tmp.ranks.rank.req =
			E(10).pow(
				player.ranks.rank
                    .pow(exp2)
                    .div(start2.pow(exp2.sub(1)))
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
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2)
			.add(1)
			.floor();
	}
    if (scalingActive("rank", player.ranks.rank.max(tmp.ranks.rank.bulk), "ultra")) {
		let start = getScalingStart("super", "rank");
		let power = getScalingPower("super", "rank");
		let exp = E(1.5).pow(power);
        let start2 = getScalingStart("hyper", "rank");
		let power2 = getScalingPower("hyper", "rank");
		let exp2 = E(2.5).pow(power2);
        let start3 = getScalingStart("ultra", "rank");
		let power3 = getScalingPower("ultra", "rank");
		let exp3 = E(4).pow(power3);
		tmp.ranks.rank.req =
			E(10).pow(
				player.ranks.rank
                    .pow(exp3)
                    .div(start3.pow(exp3.sub(1)))
                    .pow(exp2)
                    .div(start2.pow(exp2.sub(1)))
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
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2)
            .mul(start3.pow(exp3.sub(1)))
			.root(exp3)
			.add(1)
			.floor();
	}
    /*if (scalingActive("rank", player.ranks.rank.max(tmp.ranks.rank.bulk), "meta")) {
		let start = getScalingStart("super", "rank");
		let power = getScalingPower("super", "rank");
		let exp = E(1.5).pow(power);
        let start2 = getScalingStart("hyper", "rank");
		let power2 = getScalingPower("hyper", "rank");
		let exp2 = E(2.5).pow(power2);
        let start3 = getScalingStart("ultra", "rank");
		let power3 = getScalingPower("ultra", "rank");
		let exp3 = E(4).pow(power3);
        let start4 = getScalingStart("meta", "rank");
		let power4 = getScalingPower("meta", "rank");
		let exp4 = E(1.0025).pow(power4);
		tmp.ranks.rank.req =
			E(10).pow(
				exp4.pow(player.ranks.rank.sub(start4)).mul(start4)
                    .pow(exp3)
                    .div(start3.pow(exp3.sub(1)))
                    .pow(exp2)
                    .div(start2.pow(exp2.sub(1)))
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
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2)
            .mul(start3.pow(exp3.sub(1)))
			.root(exp3)
            .div(start4)
			.max(1)
			.log(exp4)
			.add(start4)
			.add(1)
			.floor();
	}*/
    tmp.ranks.rank.can = player.mass.gte(tmp.ranks.rank.req) && !CHALS.inChal(5) && !CHALS.inChal(10)

    fp = RANKS.fp.tier()
    tmp.ranks.tier.req = player.ranks.tier.div(fp).add(2).pow(2).floor()
    tmp.ranks.tier.bulk = player.ranks.rank.max(0).root(2).sub(2).mul(fp).add(1).floor();
    if (scalingActive("tier", player.ranks.tier.max(tmp.ranks.tier.bulk), "super")) {
		let start = getScalingStart("super", "tier");
		let power = getScalingPower("super", "tier");
		let exp = E(1.5).pow(power);
		tmp.ranks.tier.req =
			player.ranks.tier
			.pow(exp)
			.div(start.pow(exp.sub(1))).div(fp)
			.add(2).pow(2).floor()
		tmp.ranks.tier.bulk = player.ranks.rank
            .max(0)
            .root(2)
            .sub(2)
            .mul(fp)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
			.add(1)
			.floor();
	}

    fp = E(1)
    let pow = 2
    if (player.atom.elements.includes(44)) pow = 1.75
    if (player.atom.elements.includes(9)) fp = fp.mul(1/0.85)
    tmp.ranks.tetr.req = player.ranks.tetr.div(fp).pow(pow).mul(3).add(10).floor()
    tmp.ranks.tetr.bulk = player.ranks.tier.sub(10).div(3).max(0).root(pow).mul(fp).add(1).floor();
    if (scalingActive("tetr", player.ranks.tetr.max(tmp.ranks.tetr.bulk), "super")) {
		let start = getScalingStart("super", "tetr");
		let power = getScalingPower("super", "tetr");
		let exp = E(2).pow(power);
		tmp.ranks.tetr.req =
			player.ranks.tetr
			.pow(exp)
			.div(start.pow(exp.sub(1))).div(fp)
			.pow(pow).mul(3).add(10).floor()
		tmp.ranks.tetr.bulk = player.ranks.tier
            .sub(10).div(3).max(0).root(pow)
            .mul(fp)
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
        tmp.ranks[rn].desc = player.ranks[rn].lt(Number.MAX_VALUE)?RANKS.desc[rn][player.ranks[rn].toNumber()+1]?RANKS.desc[rn][player.ranks[rn].toNumber()+1]:(capitalFirst(rn)+" up."):(capitalFirst(rn)+" up.")
    }
}