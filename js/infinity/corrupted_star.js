const CORRUPTED_STAR = {
    calcNextGain(amt, tick) {
        if (amt.lt(1)) {
            let w = tick.lt(1) ? tick : Decimal.sub(1,amt)
            tick = tick.sub(w)
            amt = amt.add(w).min(1)
        }

        if (amt.gte(1)) {
            amt = amt.log(2)

            let rss1 = tmp.cs_reduce_start1.log(2), rss2 = tmp.cs_reduce_start2.log(2)

            let rs1 = amt.gte(rss1), rs2 = amt.gte(rss2)
            if (rs2) amt = amt.div(rss2).pow(2).mul(rss2)
            if (rs1) amt = Decimal.pow(2,amt.div(rss1)).sub(1).mul(rss1)

            amt = amt.add(tick)

            rs1 = rs1 || amt.gte(rss1)
            if (rs1) amt = amt.div(rss1).add(1).log(2).mul(rss1)

            rs2 = rs2 || amt.gte(rss2)
            if (rs2) amt = amt.div(rss2).root(2).mul(rss2)

            amt = Decimal.pow(2,amt)
        }

        return amt
    },
    eff() {
        let x = {}, cs = player.inf.cs_amount

        x.power_mult = cs.add(1).log10().add(1).overflow(10,0.5).root(2).toNumber()
        x.theorem_luck = cs.add(1).log10().root(2).div(10).add(1).toNumber()
        x.inf_speed = cs.add(1).log10().add(1)

        if (hasElement(38,1)) x.sn_speed = cs.add(1).log10().add(1).pow(1.5)

        return x
    },
}

function updateCSTemp() {
    tmp.cs_reduce_start1 = E(1e3)
    tmp.cs_reduce_start2 = E(1e10)

    if (hasElement(37,1)) {
        let x = muElemEff(37)

        tmp.cs_reduce_start1 = tmp.cs_reduce_start1.mul(x)
        tmp.cs_reduce_start2 = tmp.cs_reduce_start1.mul(x)
    }

    if (hasElement(40,1)) {
        let x = muElemEff(40)

        tmp.cs_reduce_start1 = tmp.cs_reduce_start1.mul(x)
        tmp.cs_reduce_start2 = tmp.cs_reduce_start1.mul(x)
    }

    let s = Decimal.pow(2,player.inf.cs_double[0].add(player.inf.cs_double[1]))

    if (hasElement(33,1)) s = s.mul(muElemEff(33))
    if (hasElement(34,1)) s = s.mul(muElemEff(34))

    tmp.cs_speed = s

    tmp.cs_effect = CORRUPTED_STAR.eff()
}

function buyCSUpg(i) {
    let bulk

    switch (i) {
        case 0:
            if (player.inf.cs_amount.gte(Decimal.pow(1e3, player.inf.cs_double[0].add(1)))) {
                bulk = player.inf.cs_amount.log(1e3).floor().max(player.inf.cs_double[0])
                player.inf.cs_double[0] = bulk

                player.inf.cs_amount = player.inf.cs_amount.sub(Decimal.pow(1e3, bulk)).max(0)
            }
        break;
        case 1:
            if (player.inf.points.gte(Decimal.pow(10, player.inf.cs_double[1]).mul(1e36))) {
                bulk = player.inf.points.div(1e35).max(1).log(10).floor().max(player.inf.cs_double[1])
                player.inf.cs_double[1] = bulk

                player.inf.points = player.inf.points.sub(Decimal.pow(10, bulk.sub(1)).mul(1e36)).max(0)
            }
        break;
    }
}

function updateCSHTML() {
    let cs = player.inf.cs_amount, cs_growth = CORRUPTED_STAR.calcNextGain(cs,tmp.cs_speed.div(FPS)).div(cs).pow(FPS)

    tmp.el.cs_amount.setHTML(cs.format(2) + (cs.gt(1) ? ` (×${cs_growth.format()}/sec)` : ''))
    tmp.el.cs_speed.setHTML(formatMult(tmp.cs_speed))

    let cost = [Decimal.pow(1e3, player.inf.cs_double[0].add(1)),Decimal.pow(10, player.inf.cs_double[1]).mul(1e36)]

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

    let eff = tmp.cs_effect, h = ''

    h += `
    Increase Theorem's Power by <b>${formatMult(eff.power_mult)}</b>
    <br>Increase Theorem's Star 1-4 Luck by <b>${formatMult(eff.theorem_luck)}</b>
    <br>Speed IP Generation by <b>${formatMult(eff.inf_speed)}</b>
    `

    if (eff.sn_speed) h += `<br>Speed Supernova Generation by <b>${formatMult(eff.sn_speed)}</b>`

    tmp.el.cs_effect.setHTML(h)
}