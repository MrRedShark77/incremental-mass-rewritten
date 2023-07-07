const GALAXY = {
    req() {
        let x = Decimal.pow(1e100,player.galaxy.points**0.25)
        return x.max(1e100)
    },
    gain() {
        let x = E(0.1)
 x = x.mul(tmp.galaxy.genEff)
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
        if (hasElement(299)) x = player.galaxy.generator.add(1).pow(pow).mul(player.galaxy.stars.add(1).root(5).max(1)).max(1)
       else x = player.galaxy.generator.add(1).pow(pow).mul(player.galaxy.stars.add(1).log(1.15).max(1)).max(1)
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
    tmp.el.gen_btn.setHTML(`
    <b>[Galaxy Particles Generator]</b> <b>[${format(t,0)}]</b><br>
    Requirement: <b>${tmp.galaxy.req.format(0)}</b> Galaxy Particles<br>
    Effect: <b>Boosts Galaxy Particles gain by x${tmp.galaxy.genEff.format(4)} (Based on Galaxy Particles)</b>
    `)
    tmp.el.gen_btn.setClasses({btn: true, half_full: true, locked: player.galaxy.stars.lt(tmp.galaxy.req)})
    tmp.el.stars_amt.setHTML(format(player.galaxy.stars))
    tmp.el.stars_gain.setHTML(formatGain(player.galaxy.stars,tmp.galaxy.gain))
    tmp.el.stars_eff.setHTML(format(tmp.galaxy.eff))
    updateGradeHTML()
}