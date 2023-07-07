const FULL_GRADE_NAME = [
    ['','Bronze','Silver','Gold','Platinum','Titanium','Palladuim','Mythril','Diamond']
]
const GRADE = {
    unl() { return hasTree('glx5') },
    getGrade() {
        let b = tmp.grade.t_base
        let x = player.galaxy.stars.max(1).log(b).mul(2.15)
        return x.floor()
    },
    getNextGrade() {
        let b = tmp.grade.t_base
        let x = E(b).pow(player.galaxy.grade.theorems.add(1).div(2.15))

        return x
    },
    spentGrades() {
        let x = E(0)
        for (let i = 0; i < player.galaxy.grade.type.length; i++) {
             x = x.add(player.galaxy.grade.type[i])
        }
        return x
    },
    particle: {
        names: ["Elliptical","Barred","Spiral"],
        weight: [6,4,2],
        total_w: 12,
        chance: [],
power: [
    p=>{
        let pow = E(1).mul(p.gte(100)?3:p.gte(90)?2.8:p.gte(80)?2.6:p.gte(70)?2.4:p.gte(60)?2.2:p.gte(50)?2:p.gte(40)?1.8:p.gte(30)?1.6:p.gte(20)?1.4:p.gte(10)?1.2:1)
        return pow
    },
    p=>{
        let pow = E(1).mul(p.gte(100)?3:p.gte(90)?2.8:p.gte(80)?2.6:p.gte(70)?2.4:p.gte(60)?2.2:p.gte(50)?2:p.gte(40)?1.8:p.gte(30)?1.6:p.gte(20)?1.4:p.gte(10)?1.2:1)
        return pow
    },
    p=>{
        let pow = E(1).mul(p.gte(100)?3:p.gte(90)?2.8:p.gte(80)?2.6:p.gte(70)?2.4:p.gte(60)?2.2:p.gte(50)?2:p.gte(40)?1.8:p.gte(30)?1.6:p.gte(20)?1.4:p.gte(10)?1.2:1)
        return pow
    }
],
        eff: [
            p=>{
                let pow = E(1).mul(p.gte(100)?3:p.gte(90)?2.8:p.gte(80)?2.6:p.gte(70)?2.4:p.gte(60)?2.2:p.gte(50)?2:p.gte(40)?1.8:p.gte(30)?1.6:p.gte(20)?1.4:p.gte(10)?1.2:1)
                let x = [p.add(1).root(2).pow(pow),p.add(1).root(15).pow(pow)]
                return x
            },
            p=>{
                let pow = E(1).mul(p.gte(100)?3:p.gte(90)?2.8:p.gte(80)?2.6:p.gte(70)?2.4:p.gte(60)?2.2:p.gte(50)?2:p.gte(40)?1.8:p.gte(30)?1.6:p.gte(20)?1.4:p.gte(10)?1.2:1)
                let x = [p.add(1).root(1.5).pow(pow),p.add(1).root(12.5).pow(pow)]
                return x
            },
            p=>{
                let pow = E(1).mul(p.gte(100)?3:p.gte(90)?2.8:p.gte(80)?2.6:p.gte(70)?2.4:p.gte(60)?2.2:p.gte(50)?2:p.gte(40)?1.8:p.gte(30)?1.6:p.gte(20)?1.4:p.gte(10)?1.2:1)
                let x = p.root(3).div(100).pow(pow)
                return x
            }
        ],
        effDesc: [
            x=>{ return `Boost Galaxy Particles gain. <b class='sky'>(x${format(x[0])})</b><br> Boost 4th Dark Shadow effect. <b class='sky'>(x${format(x[1])})</b>` },
            x=>{ return `Boost Infinity gain. <b class='sky'>(x${format(x[0])})</b><br> Increase the Power of theorems. <b class='sky'>(${formatPercent(x[1]-1)})</b>` },
            x=>{ return `Boost Galaxy Particles generator base exponent. <b class='sky'>(+${format(x)})</b>` },
        ],
        effPow: [
            pow=>{ return `Effects Power: <b class='sky'>(${formatPercent(pow)})</b>` },
            pow=>{ return `Effects Power: <b class='sky'>(${formatPercent(pow)})</b>` },
            pow=>{ return `Effects Power: <b class='sky'>(${formatPercent(pow)})</b>` },
        ],
    },
}

function giveRandomPGrading(v, max=false) {
    if (!GRADE.unl()) return

    let s = max?tmp.grade.unspent:E(v)
    if (!max) s = s.min(tmp.grade.unspent)

    let tw = tmp.grade.total_w
    let s_div = s.div(tw).floor()
    let sm = s.mod(tw).floor().toNumber()

    for (let x in GRADE.particle.names) player.galaxy.grade.type[x] = player.galaxy.grade.type[x].add(s_div.mul(tmp.grade.w[x]))
    for (let x = 0; x < sm; x++) {
        let c = Math.random()
        for (let y in GRADE.particle.chance) if (c <= GRADE.particle.chance[y]) {
            player.galaxy.grade.type[y] = player.galaxy.grade.type[y].add(1)
            break
        }
    }

    updateGradeTemp()
}

function respecPGrading() {
    createConfirm("Are you sure you want to respec all Gradings?",'respectPGs',()=>{
        for (let i =0; i < 3; i++) player.galaxy.grade.type[i] = E(0)
        GALAXY.doReset()
    })
}

function calcGradeChances() {
    var sum = 0
    for (let x in GRADE.particle.names) {
        sum += tmp.grade.w[x]
        GRADE.particle.chance[x] = sum / tmp.grade.total_w
    }
}

function updateGradeTemp() {
    let tp = tmp.grade

    tp.parts = []
    tp.bonus = []
    tp.t_base = E(2680)

    tp.w = [6,4,2]
    tp.total_w = 12

    let pt = player.galaxy.grade.theorems
    let pstr = E(1)


    tp.theorems = GRADE.getGrade()
    tp.next_theorem = GRADE.getNextGrade()
    tp.spent_theorem = GRADE.spentGrades()
    tp.unspent = pt.sub(tp.spent_theorem).max(0)
    for (let i = 0; i < player.galaxy.grade.type.length; i++) {
        let pp = player.galaxy.grade.type[i]
        let b = E(0)
        tp.parts[i] = pp
        tp.bonus[i] = b
        tp.eff[i] = GRADE.particle.eff[i](pp.add(b).softcap(100,0.75,0).mul(pstr))
        tp.power[i] = GRADE.particle.power[i](pp.add(b).softcap(100,0.75,0).mul(pstr))
    }

    calcGradeChances()
}

function updateGradeHTML() {
    tmp.el.grade_btns.setDisplay(true)
    tmp.el.grade_theorem.setTxt(format(tmp.grade.unspent,0)+" / "+format(player.galaxy.grade.theorems,0))
    tmp.el.grade_next_theorem.setTxt(format(player.galaxy.stars,1)+" / "+format(tmp.grade.next_theorem,1))
    for (let i = 0; i < player.galaxy.grade.type.length; i++) {
        let pp = player.galaxy.grade.type[i]
        let h = Math.floor(pp / 10) % 10
tmp.el['grade_scale'+i].setHTML(`<span class='grade_color${h}'>${FULL_GRADE_NAME[0][h]}</span`)
        tmp.el["grade_part"+i].setTxt(format(tmp.grade.parts[i],0)+(tmp.grade.bonus[i].gt(0)?" + "+tmp.grade.bonus[i].format(0):""))
        tmp.el["grade_part_pow"+i].setHTML(GRADE.particle.effPow[i](tmp.grade.power[i]))
        tmp.el["grade_part_eff"+i].setHTML(GRADE.particle.effDesc[i](tmp.grade.eff[i]))
    }
}