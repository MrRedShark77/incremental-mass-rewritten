function updateMassTemp() {
    tmp.massSoftGain = FORMS.massSoftGain()
    tmp.massGain = FORMS.massGain()
}

function updateTickspeedTemp() {
    tmp.tickspeedCost = E(2).pow(player.tickspeed).floor()
    tmp.tickspeedBulk = player.rp.points.max(1).log(2).add(1).floor()
    if (player.rp.points.lt(1)) tmp.tickspeedBulk = E(0)
    if (scalingActive("tickspeed", player.tickspeed.max(tmp.tickspeedBulk), "super")) {
		let start = getScalingStart("super", "tickspeed");
		let power = getScalingPower("super", "tickspeed");
		let exp = E(2).pow(power);
		tmp.tickspeedCost =
			E(2).pow(
                player.tickspeed
                .pow(exp)
			    .div(start.pow(exp.sub(1)))
            ).floor()
        tmp.tickspeedBulk = player.rp.points
            .max(1)
            .log(2)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
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
    tmp.bh.mass_gain = FORMS.bh.massGain()
    tmp.bh.dm_can = tmp.bh.dm_gain.gte(1)
    tmp.bh.effect = FORMS.bh.effect()
    tmp.bh.condenser_eff = FORMS.bh.condenser.effect()
}

function updateTemp() {
    updateScalingTemp()
    updateChalTemp()
    updateUpgradesTemp()
    updateRagePowerTemp()
    updateBlackHoleTemp()
    updateTickspeedTemp()
    updateMassTemp()
    updateRanksTemp()
}