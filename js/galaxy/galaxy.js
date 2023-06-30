const GALAXY = {
    req() {
        let x = Decimal.pow(1e100,player.galaxy.points**0.25)
        return x.max(1e100)
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
        if (player.galaxy.stars.gte(tmp.galaxy.req)){ player.galaxy.generator = player.galaxy.generator.add(1)
        player.galaxy.stars = E(0)}
    },
    doReset() {
                let e = [275,283,229,249,260]
        player.atom.elements = e
        player.galaxy.times = player.galaxy.times.max(tmp.supernova.bulkGal)
        for (let x = 1; x <= 18; x++) player.chal.comps[x] = E(0)
        let save_keep = [6,8,10,0,11,13,15,16]
        player.inf.points = E(0)
        player.inf.total = E(0)
        player.inf.nm = E(0)
        player.inf.pm = E(0)
        player.inf.dm = E(0)
        player.inf.hm = E(0)
        player.inf.em = E(0)
        player.inf.nm_base = E(0)
        player.inf.pm_base = E(0)
        player.inf.dm_base = E(0)
        player.inf.hm_base = E(0)
        player.inf.em_base = E(0)
        player.inf.core[0].star = [true,true,true,true,true,true]
        player.inf.core[1].star = [true,true,true,true,true,true]
        player.inf.core[2].star = [true,true,true,true,true,true]
        player.inf.core[3].star = [true,true,true,true,true,true]
        player.inf.theorem = E(6)
        player.inf.theorem_max = E(5),
        
 player.inf.upg = save_keep
 INF.doReset()
    }
}
function calcGalaxy(dt) {
if (player.galaxy.times.gt(0)) player.galaxy.stars = player.galaxy.stars.add(tmp.galaxy.gain.mul(dt))
if (hasTree('glx5')) for (let x = 219;x <= 300; x++) buyElement(x,0)
}
function updateGalaxiesTemp() {
tmp.galaxy.req = GALAXY.cost()
tmp.galaxy.maxlimit = GALAXY.req()
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