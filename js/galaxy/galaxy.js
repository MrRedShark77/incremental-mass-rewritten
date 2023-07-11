const GALAXY = {
    req() {
        let x = Decimal.pow(1e100,player.galaxy.points**0.25)
        return x.max(1e100)
    },
    gain() {
        let x = E(0.5)
 x = x.mul(tmp.galaxy.genEff)
 if (player.galaxy.grade.type[0].gte(1)) x = x.mul(tmp.grade.eff[0][0])
 if (hasElement(309)) x = x.mul(elemEffect(309))
 if (hasElement(314)) x = x.mul(elemEffect(314))
        return x
    },
    cost() {
 let t = E(10).pow(player.galaxy.generator.mul(1.25).max(1))
        return t
    },
    genBonus() {
        let bonus = E(0)
        if (hasTree("glx7")) bonus = bonus.add(treeEff('glx7'))
        return bonus
    },
    genEff() {
        let x = E(1)
        let pow = E(1.25)
        let bonus = E(0)
        if (hasTree("glx7")) bonus = bonus.add(treeEff('glx7'))
        if (player.galaxy.grade.type[2].gte(1)) pow = pow.add(tmp.grade.eff[2][0])
        if (hasTree('glx1')) pow = pow.mul(treeEff('glx1'))
        if (hasElement(302)) x = player.galaxy.generator.add(tmp.galaxy.bonus).add(1).pow(pow).mul(player.galaxy.stars.add(1).root(.25).max(1)).max(1)
       else if (hasElement(299)) x = player.galaxy.generator.add(tmp.galaxy.bonus).add(1).pow(pow).mul(player.galaxy.stars.add(1).root(2).max(1)).max(1)
       else x = player.galaxy.generator.add(tmp.galaxy.bonus).add(1).pow(pow).mul(player.galaxy.stars.add(1).log(1.15).max(1)).max(1)

       x = overflow(x,E(1e9).pow(hasTree('glx13')?treeEff('glx13'):1),hasElement(305)?0.5:0.25)
        return x = overflow(x,E(1e15).pow(hasTree('glx19')?treeEff('glx19'):1),0.25)
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
        player.galaxy.stars = E(0)
        }
    },
    doReset() {
        let e = [275,283,229,249,260]
player.atom.elements = e
player.galaxy.times = player.galaxy.times.max(tmp.supernova.bulkGal)
if (!hasTree('glx14')) for (let x = 1; x <= 18; x++) player.chal.comps[x] = E(0)
let save_keep = [6,8,10,0,11,13,15,16]
if (hasTree('glx10')) save_keep=[1,2,3,4,5,6,7,8,9,10,0,11,12,13,14,15,16,20]
player.inf.points = E(0)
player.inf.total = E(0)
if (!hasTree('glx15')) {
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
}
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
if (GRADE.unl()) {
    player.galaxy.grade.theorems = player.galaxy.grade.theorems.max(tmp.grade.theorems)
}
}
function updateGalaxiesTemp() {
    updateGradeTemp()
tmp.galaxy.req = GALAXY.cost()
tmp.galaxy.maxlimit = GALAXY.req()
tmp.galaxy.gain = GALAXY.gain()
tmp.galaxy.bulk = GALAXY.getGalaxy()
tmp.galaxy.genEff = GALAXY.genEff()
tmp.galaxy.eff = GALAXY.effect()
tmp.galaxy.bonus = GALAXY.genBonus()
}
function setupGradeHTML() {
    new_table = new Element("grade_table")
    html = ""
    for (let x in GRADE.particle.names) {
        html += `
        <div class="grade table_center">
        <div style='width: 75px; height: 60px'>
        <img src="images/grade/gal_type_${x}.png"></img></div>
            <div style="width: 350px; height: 60px;">
 <h2>${GRADE.particle.names[x]} Galaxy</h2><br>
                <span id='grade_scale${x}'></span> Gradings - [<span id="grade_part${x}">0</span>]
            </div><div style="width: 700px;" id="grade_part_pow${x}"></div>
            <div style="width: 700px;" id="grade_part_eff${x}"></div>
        </div>
        `
}
    new_table.setHTML(html)
}
function updateGalaxiesHTML() {
    let ea = player.galaxy, t = ea.generator
    let e = tmp.galaxy.genEff
    tmp.el.gen_btn.setHTML(`
    <b>[Galaxy Particles Generator]</b> <b>[${format(t,0)} + ${format(tmp.galaxy.bonus,0)}]</b><br>
    Requirement: <b>${tmp.galaxy.req.format(0)}</b> Galaxy Particles<br>
    Effect: <b>Boosts Galaxy Particles gain by x${e.format(4)} (Based on Galaxy Particles)</b>
    `)
    tmp.el.gen_btn.setClasses({btn: true, half_full: true, locked: player.galaxy.stars.lt(tmp.galaxy.req)})
    tmp.el.stars_amt.setHTML(format(player.galaxy.stars))
    tmp.el.stars_gain.setHTML(formatGain(player.galaxy.stars,tmp.galaxy.gain))
    tmp.el.stars_eff.setHTML(format(tmp.galaxy.eff))
    updateGradeHTML()
}