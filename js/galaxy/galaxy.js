const GALAXY = {
    req() {
        maxlimitGal = E('ee26000').pow(player.galaxy.times.scaleEvery('galaxy',false).pow(15000)).mul('ee24500')
        bulkGal = E(0)
        if (player.stars.points.div('ee24500').gte(1)) bulkGal = player.stars.points.div('ee24500').max(1).log('ee26000').max(0).root(15000).scaleEvery('galaxy',true).add(1).floor()
        return { maxlimitGal: maxlimitGal,bulkGal: bulkGal}
    },
    gain() {
        let x = E(1)
 x = tmp.galaxy.genEff
        return x
    },
    cost() {
 let t = E(10).pow(player.galaxy.generator.mul(1.25).max(1))
        return t
    },
    genEff() {
        let x = E(1)
        let pow = E(1.25)
        if (hasTree('glx1')) pow = pow.mul(treeEff('glx1'))
        x = player.galaxy.generator.add(1).pow(pow).mul(player.galaxy.stars.add(1).log(1.15).max(1)).max(1)
        return x
    },
    effect() {
        let x = E(1)
        x = player.galaxy.stars.pow(12.5).mul(10)
        return x
    },
    getGalaxy() {
        let x = player.galaxy.points.div(E(1e100)).log(1.05).max(1)
        return x
    },
    tier() {
        if (player.galaxy.stars.gte(tmp.galaxy.req)) player.galaxy.generator = player.galaxy.generator.add(1)
        player.galaxy.stars = E(0)
    },
}
function calcGalaxy(dt) {
if (player.galaxy.times.gt(0)) player.galaxy.stars = player.galaxy.stars.add(tmp.galaxy.gain.mul(dt))
}
function updateGalaxiesTemp() {
tmp.galaxy.req = GALAXY.cost()
tmp.galaxy.maxlimitGal = GALAXY.req().maxlimitGal
tmp.galaxy.bulkGal = GALAXY.req().bulkGal
tmp.galaxy.gain = GALAXY.gain()
tmp.galaxy.bulk = GALAXY.getGalaxy()
tmp.galaxy.genEff = GALAXY.genEff()
tmp.galaxy.eff = GALAXY.effect()
}
function updateGalaxiesHTML() {
    let ea = player.galaxy, t = ea.generator
    tmp.el.gen_btn.setHTML(`
    <b>[Galaxy Particles Generator]</b> <b>[${format(t,0)}]</b><br>
    Requirement: <b>${tmp.galaxy.req.format(0)}</b> Galaxy Particles<br>
    Effect: <b>Boosts Galaxy Particles gain by x${tmp.galaxy.genEff.format(4)} (Based on Galaxy Particles)</b>
    `)
    tmp.el.gen_btn.setClasses({btn: true, half_full: true, locked: player.galaxy.stars.lt(tmp.galaxy.req)})
    tmp.el.stars_amt.setHTML(format(player.galaxy.stars))
    tmp.el.stars_gain.setHTML(formatGain(player.galaxy.stars,tmp.galaxy.gain))
    tmp.el.stars_eff.setHTML(format(tmp.galaxy.eff))
}