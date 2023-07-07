const GRADE = {
    unl() { return hasTree('glx5') },
    getGrade() {
        let b = tmp.grade.t_base
        let x = player.galaxy.stars.max(1).log(b).mul(2).mul(tmp.chal?tmp.chal.eff[14]:1).scale(150,2,true)
        return x.floor()
    },
    getNextGrade() {
        let b = tmp.grade.t_base
        let x = E(b).pow(player.galaxy.stars.scale(150,2).div(2).add(1))

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
        weight: [6,3,2],
        total_w: 11,
        chance: [],

        eff: [
            p=>{
                let x = p.add(1).root(2)
                return x
            },
            p=>{
                let x = [p.root(1.5).add(1)]
                return x
            },
            p=>{
                let x = [p.root(5).add(1)]
                return x
            },
        ],
        effDesc: [
            x=>{ return `Boost Infinity gain by ${format(x)}x` },
            x=>{ return `Boost Galaxy Particles gain by x${format(x)}` },
            x=>{ return `Boost Galaxy Particles generator base exponent by x${format(x)}` },
        ],
    },
}

function giveRandomPParticles(v, max=false) {
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

function respecPParticles() {
    createConfirm("Are you sure you want to respec all Gradings?",'respectPPs',()=>{
        for (let i =0; i < 8; i++) player.galaxy.grade.type[i] = E(0)
        GALAXY.doReset()
    })
}

function calcPartChances() {
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
    tp.t_base = E(5)

    tp.w = [6,3,2]
    tp.total_w = 11

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
    }

    calcPartChances()
}

function updateGradeHTML() {
    tmp.el.grade_btns.setDisplay(true)
    tmp.el.grade_theorem.setTxt(format(tmp.grade.unspent,0)+" / "+format(player.galaxy.grade,0))
    tmp.el.grade_next_theorem.setTxt(format(player.galaxy.stars,1)+" / "+format(tmp.grade.next_theorem,1))
    for (let i = 0; i < player.galaxy.grade.type.length; i++) {
        tmp.el["grade_part"+i].setTxt(format(tmp.grade.parts[i],0)+(tmp.grade.bonus[i].gt(0)?" + "+tmp.grade.bonus[i].format(0):""))
        tmp.el["grade_part_eff"+i].setHTML(GRADE.particle.effDesc[i](tmp.grade.eff[i]))
    }
}