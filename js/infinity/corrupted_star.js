const CORRUPTED_STAR = {
    calcNextGain(amt, tick) {
        if (amt.lt(1)) {
            let w = tick.lt(1) ? tick : Decimal.sub(1,amt)
            tick = tick.sub(w)
            amt = amt.add(w).min(1)
        }

        let b = Decimal.pow(2,tmp.cs_reduce_power)

        if (amt.gte(1)) {
            amt = amt.log(2)

            let rss1 = tmp.cs_reduce_start1.log(2), rss2 = tmp.cs_reduce_start2.log(2)

            let rs1 = amt.gte(rss1), rs2 = amt.gte(rss2)
            if (rs2) amt = amt.div(rss2).pow(b).mul(rss2)
            if (rs1) amt = Decimal.pow(2,amt.div(rss1)).sub(1).mul(rss1)

            amt = amt.add(tick)

            rs1 = rs1 || amt.gte(rss1)
            if (rs1) amt = amt.div(rss1).add(1).log(2).mul(rss1)

            rs2 = rs2 || amt.gte(rss2)
            if (rs2) amt = amt.div(rss2).root(b).mul(rss2)

            amt = Decimal.pow(2,amt)
        }

        return amt
    },
    eff() {
        let x = {}, cs = player.inf.cs_amount
		for (var [i, eff] of Object.entries(this.effects)) {
			if (!eff.unl()) continue
			x[i] = eff.eff(cs)
		}
		return x
    },
	effects: {
		power_mult: {
			unl: _ => true,
			eff: cs => cs.add(1).log10().add(1).overflow(10,0.5).root(2),
			eff_desc: i => `Increase Theorem's Power. <h4>${formatMult(i)}</h4>`
		},
		theorem_luck: {
			unl: _ => true,
			eff: cs => cs.add(1).log10().root(2).div(10).add(1),
			eff_desc: i => `Increase luck on Theorem Stars 1-4. <h4>${formatMult(i)}</h4>`
		},
		inf_speed: {
			unl: _ => true,
			eff: cs => cs.add(1).log10().add(1),
			eff_desc: i => `Increase passive IP generation. <h4>${formatMult(i)}</h4>`
		},
		sn_speed: {
			unl: _ => hasElement(38,1),
			eff: cs => cs.add(1).log10().add(1).pow(1.5),
			eff_desc: i => `Increase passive Supernova generation. <h4>${formatMult(i)}</h4>`
		},
		ea_reward: {
			unl: _ => hasElement(43,1),
			eff: cs => cs.add(1).log10().root(2).div(20),
			eff_desc: i => `Strengthen Exotic Atom rewards. <h4>+${format(i)}</h4>`
		},
		prim_reduce: {
			unl: _ => hasElement(64,1),
			eff: cs => Decimal.pow(0.9,cs.add(1).log10().overflow(10,0.5).root(2)),
			eff_desc: i => `Weaken Primordium Theorem scalings. <h4>^${format(i)}</h4>`
		}
	}
}

function updateCSTemp() {
	let ss_mul = E(1)
    if (hasElement(37,1)) ss_mul = ss_mul.mul(muElemEff(37))
    if (hasElement(40,1)) ss_mul = ss_mul.mul(muElemEff(40))
    if (hasElement(50,1)) ss_mul = ss_mul.mul(muElemEff(50))
    if (hasElement(65,1)) ss_mul = ss_mul.mul(muElemEff(65))

    let ss1 = E(1e3).mul(ss_mul), ss2 = E(1e10).mul(ss_mul)
    tmp.cs_reduce_start1 = ss1
    tmp.cs_reduce_start2 = ss2

    let s = Decimal.pow(2,player.inf.cs_double[0].add(player.inf.cs_double[1]))

    if (hasElement(33,1)) s = s.mul(muElemEff(33))
    if (hasElement(34,1)) s = s.mul(muElemEff(34))
    if (hasElement(42,1)) s = s.mul(muElemEff(42))
    if (hasElement(47,1)) s = s.mul(muElemEff(47))

    tmp.cs_reduce_power = GPEffect(4,1)
    tmp.cs_speed = s

    tmp.csu_div = E(1)
    if (hasPrestige(4,7)) tmp.csu_div = tmp.csu_div.mul(1e10)
    if (hasElement(53,1)) tmp.csu_div = tmp.csu_div.mul(muElemEff(53))

    tmp.cs_effect = CORRUPTED_STAR.eff()
}

function hasCSEffect(i) { return tmp.cs_effect[i] !== undefined }
function CSEffect(i, def = E(1)) { return EVO.isFed("cs_"+i) ? def : tmp.cs_effect[i] ?? def }

function buyCSUpg(i) {
    let bulk

    switch (i) {
        case 0:
            if (player.inf.cs_amount.gte(getCSUpgRequirement(0))) {
                bulk = bulkCSUpgRequirement(0,player.inf.cs_amount).max(player.inf.cs_double[0])
                player.inf.cs_double[0] = bulk

                player.inf.cs_amount = player.inf.cs_amount.sub(getCSUpgRequirement(0,bulk.sub(1))).max(0)
            }
        break;
        case 1:
            if (player.inf.points.gte(getCSUpgRequirement(1))) {
                bulk = bulkCSUpgRequirement(1,player.inf.points).max(player.inf.cs_double[1])
                player.inf.cs_double[1] = bulk

                player.inf.points = player.inf.points.sub(getCSUpgRequirement(1,bulk.sub(1))).max(0)
            }
        break;
    }
}

function getCSUpgRequirement(i, lvl=player.inf.cs_double[i]) {
    let x = EINF

    lvl = lvl.scale(100,2,0)

    switch (i) {
        case 0:
            x = Decimal.pow(1e3, lvl.add(1)).div(tmp.csu_div)
        break;
        case 1:
            x = Decimal.pow(10, lvl).mul(1e36).div(tmp.csu_div)
        break;
    }

    return x
}

function bulkCSUpgRequirement(i, amt) {
    let x = E(0)

    switch (i) {
        case 0:
            x = amt.mul(tmp.csu_div).log(1e3).sub(1)
        break;
        case 1:
            x = amt.mul(tmp.csu_div).div(1e36).max(1).log(10)
        break;
    }

    x = x.scale(100,2,0,true)

    return x.add(1).floor()
}

function updateCSHTML() {
    let cs = player.inf.cs_amount, cs_growth = CORRUPTED_STAR.calcNextGain(cs,tmp.cs_speed.div(FPS)).div(cs).pow(FPS)

    tmp.el.cs_amount.setHTML(cs.format(2) + (cs.gt(1) ? ` (×${cs_growth.format()}/sec)` : ''))
    tmp.el.cs_speed.setHTML(formatMult(tmp.cs_speed))

    let cost = [getCSUpgRequirement(0),getCSUpgRequirement(1)]

    tmp.el.cs_upg1.setHTML(`
    Double corrupted star's speed. (${player.inf.cs_double[0].format(0)})
    <br><br>
    Cost: ${cost[0].format(0)} Corrupted Stars
    `)
    tmp.el.cs_upg1.setClasses({btn: true, full: true, locked: player.inf.cs_amount.lt(cost[0])})

    tmp.el.cs_upg2.setHTML(`
    Double corrupted star's speed. (${player.inf.cs_double[1].format(0)})
    <br><br>
    Cost: ${cost[1].format(0)} Infinity Points
    `)
    tmp.el.cs_upg2.setClasses({btn: true, full: true, locked: player.inf.points.lt(cost[1])})

    tmp.el.cs_overflow.setHTML(
        cs.gte(tmp.cs_reduce_start1)
        ? `Corrupted Star's Growth is rooted by <b>${Decimal.log(2,cs_growth).mul(tmp.cs_speed).format()}</b>!`
        : ""
    )

    let h = ''
	for (var [i, eff] of Object.entries(tmp.cs_effect)) {
		let fed = EVO.fed_msg[tmp.evo.fed["cs_"+i]], line = CORRUPTED_STAR.effects[i].eff_desc(eff)
		if (fed) line = line.strike() + " " + fed
		h += line+"<br>"
	}
    tmp.el.cs_effect.setHTML(h)
}