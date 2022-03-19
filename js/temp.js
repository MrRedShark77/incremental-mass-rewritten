var tmp = {}

function resetTemp() {
    keep = [tmp.el, tmp.prevSave]
    tmp = {
        tree_time: 0,

        sn_tab: 0,
        tab: 0,
        stab: [],
        pass: true,
        notify: [],
        popup: [],
        saving: 0,
    
        fermions: {
            ch: [0,0],
            gains: [E(0),E(0)],
            maxTier: [[],[]],
            tiers: [[],[]],
            effs:  [[],[]],
        },
    
        supernova: {
            time: 0,
            tree_choosed: "",
            tree_had: [],
            auto_tree: [],
            tree_eff: {},
            tree_unlocked: {},
            tree_afford: {},
        },
    
        radiation: {
            unl: false,
            ds_gain: [],
            ds_eff: [],
            bs: {
                sum: [],
                lvl: [],
                bonus_lvl: [],
                cost: [],
                bulk: [],
                eff: [],
            },
        },

        qu: {
            chroma_gain: [],
            chroma_eff: [],
            mil_reached: [],
        },

        prim: {
            eff: [],
        },

        prevSave: "",
    }
    for (let x = 0; x < TABS[1].length; x++) tmp.stab.push(0)
    for (let i = 0; i < 19; i++) {
        for (let j = 0; j < 19; j++) {
            let id = TREE_IDS[i][j]
            if (TREE_UPGS.ids[id]) {
                tmp.supernova.tree_had.push(id)
                if (!TREE_UPGS.ids[id].qf) tmp.supernova.auto_tree.push(id)
            }
        }
    }
    tmp.el = keep[0]
    tmp.prevSave = keep[1]
}

resetTemp()

function updateMassTemp() {
    tmp.massSoftPower = FORMS.massSoftPower()
    tmp.massSoftGain = FORMS.massSoftGain()
    tmp.massSoftPower2 = FORMS.massSoftPower2()
    tmp.massSoftGain2 = FORMS.massSoftGain2()
    tmp.massSoftPower3 = FORMS.massSoftPower3()
    tmp.massSoftGain3 = FORMS.massSoftGain3()
    tmp.massSoftPower4 = FORMS.massSoftPower4()
    tmp.massSoftGain4 = FORMS.massSoftGain4()
    tmp.massGain = FORMS.massGain()
}

function updateTickspeedTemp() {
    tmp.tickspeedFP = tmp.fermions.effs[1][2]
    tmp.tickspeedCost = E(2).pow(player.tickspeed.div(tmp.tickspeedFP)).floor()
    tmp.tickspeedBulk = player.rp.points.max(1).log(2).mul(tmp.tickspeedFP).add(1).floor()
    if (player.rp.points.lt(1)) tmp.tickspeedBulk = E(0)
    if (scalingActive("tickspeed", player.tickspeed.max(tmp.tickspeedBulk), "super")) {
		let start = getScalingStart("super", "tickspeed");
		let power = getScalingPower("super", "tickspeed");
		let exp = E(2).pow(power);
		tmp.tickspeedCost =
			E(2).pow(
                player.tickspeed.div(tmp.tickspeedFP)
                .pow(exp)
			    .div(start.pow(exp.sub(1)))
            ).floor()
        tmp.tickspeedBulk = player.rp.points
            .max(1)
            .log(2)
			.mul(start.pow(exp.sub(1)))
			.root(exp).mul(tmp.tickspeedFP)
			.add(1)
			.floor();
	}
    if (scalingActive("tickspeed", player.tickspeed.max(tmp.tickspeedBulk), "hyper")) {
		let start = getScalingStart("super", "tickspeed");
		let power = getScalingPower("super", "tickspeed");
		let exp = E(2).pow(power);
        let start2 = getScalingStart("hyper", "tickspeed");
		let power2 = getScalingPower("hyper", "tickspeed");
		let exp2 = E(4).pow(power2);
		tmp.tickspeedCost =
			E(2).pow(
                player.tickspeed.div(tmp.tickspeedFP)
                .pow(exp2)
			    .div(start2.pow(exp2.sub(1)))
                .pow(exp)
			    .div(start.pow(exp.sub(1)))
            ).floor()
        tmp.tickspeedBulk = player.rp.points
            .max(1)
            .log(2)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2).mul(tmp.tickspeedFP)
			.add(1)
			.floor();
	}
    if (scalingActive("tickspeed", player.tickspeed.max(tmp.tickspeedBulk), "ultra")) {
		let start = getScalingStart("super", "tickspeed");
		let power = getScalingPower("super", "tickspeed");
		let exp = E(2).pow(power);
        let start2 = getScalingStart("hyper", "tickspeed");
		let power2 = getScalingPower("hyper", "tickspeed");
		let exp2 = E(4).pow(power2);
        let start3 = getScalingStart("ultra", "tickspeed");
		let power3 = getScalingPower("ultra", "tickspeed");
		let exp3 = E(7).pow(power3);
		tmp.tickspeedCost =
			E(2).pow(
                player.tickspeed.div(tmp.tickspeedFP)
                .pow(exp3)
			    .div(start3.pow(exp3.sub(1)))
                .pow(exp2)
			    .div(start2.pow(exp2.sub(1)))
                .pow(exp)
			    .div(start.pow(exp.sub(1)))
            ).floor()
        tmp.tickspeedBulk = player.rp.points
            .max(1)
            .log(2)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2)
            .mul(start3.pow(exp3.sub(1)))
			.root(exp3).mul(tmp.tickspeedFP)
			.add(1)
			.floor();
	}
    if (scalingActive("tickspeed", player.tickspeed.max(tmp.tickspeedBulk), "meta")) {
		let start = getScalingStart("super", "tickspeed");
		let power = getScalingPower("super", "tickspeed");
		let exp = E(2).pow(power);
        let start2 = getScalingStart("hyper", "tickspeed");
		let power2 = getScalingPower("hyper", "tickspeed");
		let exp2 = E(4).pow(power2);
        let start3 = getScalingStart("ultra", "tickspeed");
		let power3 = getScalingPower("ultra", "tickspeed");
		let exp3 = E(7).pow(power3);
        let start4 = getScalingStart("meta", "tickspeed");
		let power4 = getScalingPower("meta", "tickspeed");
		let exp4 = E(1.001).pow(power4);
		tmp.tickspeedCost =
			E(2).pow(
                exp4.pow(player.tickspeed.sub(start4)).mul(start4).div(tmp.tickspeedFP)
                .pow(exp3)
			    .div(start3.pow(exp3.sub(1)))
                .pow(exp2)
			    .div(start2.pow(exp2.sub(1)))
                .pow(exp)
			    .div(start.pow(exp.sub(1)))
            ).floor()
        tmp.tickspeedBulk = player.rp.points
            .max(1)
            .log(2)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2)
            .mul(start3.pow(exp3.sub(1)))
			.root(exp3).mul(tmp.tickspeedFP)
            .div(start4)
			.max(1)
			.log(exp4)
			.add(start4)
			.add(1)
			.floor();
	}
    tmp.tickspeedEffect = FORMS.tickspeed.effect()
}

function updateUpgradesTemp() {
    if (!tmp.upgs) tmp.upgs = {}
    UPGS.mass.temp()
    UPGS.main.temp()
}

function updateRagePowerTemp() {
    if (!tmp.rp) tmp.rp = {}
    tmp.rp.gain = FORMS.rp.gain()
    tmp.rp.can = tmp.rp.gain.gte(1)
}

function updateBlackHoleTemp() {
    if (!tmp.bh) tmp.bh = {}
    tmp.bh.dm_gain = FORMS.bh.DM_gain()
    tmp.bh.fSoftStart = FORMS.bh.fSoftStart()
    tmp.bh.fSoftPower = FORMS.bh.fSoftPower()
    tmp.bh.f = FORMS.bh.f()
    tmp.bh.massSoftPower = FORMS.bh.massSoftPower()
    tmp.bh.massSoftGain = FORMS.bh.massSoftGain()
    tmp.bh.massPowerGain = FORMS.bh.massPowerGain()
    tmp.bh.mass_gain = FORMS.bh.massGain()
    tmp.bh.dm_can = tmp.bh.dm_gain.gte(1)
    tmp.bh.effect = FORMS.bh.effect()

    let fp = tmp.fermions.effs[1][5]

    tmp.bh.condenser_bonus = FORMS.bh.condenser.bonus()
    tmp.bh.condenser_cost = E(1.75).pow(player.bh.condenser.div(fp)).floor()
    tmp.bh.condenser_bulk = player.bh.dm.max(1).log(1.75).mul(fp).add(1).floor()
    if (player.bh.dm.lt(1)) tmp.bh.condenser_bulk = E(0)
    if (scalingActive("bh_condenser", player.bh.condenser.max(tmp.bh.condenser_bulk), "super")) {
		let start = getScalingStart("super", "bh_condenser");
		let power = getScalingPower("super", "bh_condenser");
		let exp = E(2).pow(power);
		tmp.bh.condenser_cost =
			E(1.75).pow(
                player.bh.condenser.div(fp)
                .pow(exp)
			    .div(start.pow(exp.sub(1)))
            ).floor()
        tmp.bh.condenser_bulk = player.bh.dm
            .max(1)
            .log(1.75)
			.mul(start.pow(exp.sub(1)))
			.root(exp).mul(fp)
			.add(1)
			.floor();
	}
    if (scalingActive("bh_condenser", player.bh.condenser.max(tmp.bh.condenser_bulk), "hyper")) {
		let start = getScalingStart("super", "bh_condenser");
		let power = getScalingPower("super", "bh_condenser");
        let start2 = getScalingStart("hyper", "bh_condenser");
		let power2 = getScalingPower("hyper", "bh_condenser");
		let exp = E(2).pow(power);
        let exp2 = E(2).pow(power2);
		tmp.bh.condenser_cost =
			E(1.75).pow(
                player.bh.condenser.div(fp)
                .pow(exp2)
			    .div(start2.pow(exp2.sub(1)))
                .pow(exp)
			    .div(start.pow(exp.sub(1)))
            ).floor()
        tmp.bh.condenser_bulk = player.bh.dm
            .max(1)
            .log(1.75)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2).mul(fp)
			.add(1)
			.floor();
	}
    if (scalingActive("bh_condenser", player.bh.condenser.max(tmp.bh.condenser_bulk), "ultra")) {
		let start = getScalingStart("super", "bh_condenser");
		let power = getScalingPower("super", "bh_condenser");
        let start2 = getScalingStart("hyper", "bh_condenser");
		let power2 = getScalingPower("hyper", "bh_condenser");
        let start3 = getScalingStart("ultra", "bh_condenser");
		let power3 = getScalingPower("ultra", "bh_condenser");
		let exp = E(2).pow(power);
        let exp2 = E(2).pow(power2);
        let exp3 = E(4).pow(power3);
		tmp.bh.condenser_cost =
			E(1.75).pow(
                player.bh.condenser.div(fp)
                .pow(exp3)
			    .div(start3.pow(exp3.sub(1)))
                .pow(exp2)
			    .div(start2.pow(exp2.sub(1)))
                .pow(exp)
			    .div(start.pow(exp.sub(1)))
            ).floor()
        tmp.bh.condenser_bulk = player.bh.dm
            .max(1)
            .log(1.75)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2)
            .mul(start3.pow(exp3.sub(1)))
			.root(exp3).mul(fp)
			.add(1)
			.floor();
	}
    if (scalingActive("bh_condenser", player.bh.condenser.max(tmp.bh.condenser_bulk), "meta")) {
		let start = getScalingStart("super", "bh_condenser");
		let power = getScalingPower("super", "bh_condenser");
        let start2 = getScalingStart("hyper", "bh_condenser");
		let power2 = getScalingPower("hyper", "bh_condenser");
        let start3 = getScalingStart("ultra", "bh_condenser");
		let power3 = getScalingPower("ultra", "bh_condenser");
		let exp = E(2).pow(power);
        let exp2 = E(2).pow(power2);
        let exp3 = E(4).pow(power3);
        let start4 = getScalingStart("meta", "bh_condenser");
		let power4 = getScalingPower("meta", "bh_condenser");
		let exp4 = E(1.001).pow(power4);
		tmp.bh.condenser_cost =
			E(1.75).pow(
                exp4.pow(player.bh.condenser.sub(start4)).mul(start4).div(fp)
                .pow(exp3)
			    .div(start3.pow(exp3.sub(1)))
                .pow(exp2)
			    .div(start2.pow(exp2.sub(1)))
                .pow(exp)
			    .div(start.pow(exp.sub(1)))
            ).floor()
        tmp.bh.condenser_bulk = player.bh.dm
            .max(1)
            .log(1.75)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2)
            .mul(start3.pow(exp3.sub(1)))
			.root(exp3).mul(fp)
            .div(start4)
			.max(1)
			.log(exp4)
			.add(start4)
			.add(1)
			.floor();
	}
    tmp.bh.condenser_eff = FORMS.bh.condenser.effect()
}

function updateTemp() {
    tmp.offlineActive = player.offline.time > 1
    tmp.offlineMult = tmp.offlineActive?player.offline.time+1:1

    updateQuantumTemp()

    updateRadiationTemp()
    updateFermionsTemp()
    updateBosonsTemp()
    updateSupernovaTemp()

    updateElementsTemp()
    updateMDTemp()
    updateStarsTemp()
    updateUpgradesTemp()
    updateScalingTemp()
    updateChalTemp()
    updateAtomTemp()
    updateRagePowerTemp()
    updateBlackHoleTemp()
    updateTickspeedTemp()
    updateRanksTemp()
    updateMassTemp()

    tmp.preQUGlobalSpeed = FORMS.getPreQUGlobalSpeed()
}