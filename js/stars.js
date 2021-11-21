const STARS = {
    unlocked() { return player.atom.elements.includes(36) },
    maxLimit() { return E(1e20).pow(player.supernova.times.pow(1.25)).mul(1e90) },
    gain() {
        let x = player.stars.generators[0]
        if (player.md.upgs[8].gte(1)) x = x.mul(tmp.md.upgs[8].eff)
        return x.softcap(tmp.stars.softGain,tmp.stars.softPower,0)
    },
    softGain() {
        let s = E("e1000")
        return s
    },
    softPower() {
        let p = E(0.75)
        return p
    },
    effect() {
        let p = E(1)
        if (player.atom.elements.includes(48)) p = p.mul(1.1)
        let [s,r,t1,t2] = [player.stars.points.mul(p),player.ranks.rank.mul(p),player.ranks.tier.mul(p),player.ranks.tetr.mul(p).softcap(5,player.supernova.tree.includes("s2")?1.5:5,1)]
        let x =
        s.max(1).log10().add(1).pow(r.mul(t1.pow(2)).add(1).pow(t2.add(1).pow(5/9).mul(0.25)))
        return x
    },
    generators: {
        req: [E(1e225),E(1e280),E('e320'),E('e430'),E('e870')],
        unl(auto=false) {
            if (player.atom.quarks.gte(!player.supernova.tree.includes("s4")||player.stars.unls < 5?tmp.stars.generator_req:tmp.stars.generator_boost_req)) {
                if(player.supernova.tree.includes("s4")&&player.stars.unls > 4) player.stars.boost = auto?player.stars.boost.max(tmp.stars.generator_boost_bulk):player.stars.boost.add(1)
                else player.stars.unls++
            }
        },
        gain(i) {
            let x = E(player.stars.unls > i ? 1 : 0).add(player.stars.generators[i+1]||0).pow(1.5)
            if (player.atom.elements.includes(50)) x = x.pow(1.05)
            if (player.supernova.tree.includes("s3")) x = x.pow(tmp.supernova.tree_eff.s3)

            if (player.atom.elements.includes(49) && i==4) x = x.mul(tmp.elements.effect[49])
            if (player.supernova.tree.includes("s1") && i==4) x = x.mul(tmp.supernova.tree_eff.s1)
            if (player.md.upgs[8].gte(1)) x = x.mul(tmp.md.upgs[8].eff)
            if (player.atom.elements.includes(54)) x = x.mul(tmp.elements.effect[54])
            return x.mul(tmp.stars.generator_boost_eff)
        },
    },
    colors: ["#0085FF","#BFE0FF","#FFD500","#FF5200","#990000"],
}

function calcStars(dt) {
    player.stars.points = player.stars.points.add(tmp.stars.gain.mul(dt))
    if (!player.supernova.post_10) player.stars.points = player.stars.points.min(tmp.stars.maxlimit)
    for (let x = 0; x < 5; x++) player.stars.generators[x] = player.stars.generators[x].add(tmp.stars.generators_gain[x].mul(dt))
}

function updateStarsTemp() {
    if (!tmp.stars) tmp.stars = {
        generators_gain: [],
    }
    tmp.stars.generator_req = player.stars.unls<5?STARS.generators.req[player.stars.unls]:E(1/0)
    tmp.stars.generator_boost_req = E("e100").pow(player.stars.boost.pow(1.25)).mul('e8000')
    tmp.stars.generator_boost_bulk = player.atom.quarks.gte("e8000")?player.atom.quarks.div("e8000").max(1).log("e100").root(1.25).add(1).floor():E(0)
    tmp.stars.generator_boost_eff = E(2).pow(player.stars.boost)
    for (let x = 0; x < 5; x++) tmp.stars.generators_gain[x] = STARS.generators.gain(x)
    tmp.stars.maxlimit = STARS.maxLimit()
    tmp.stars.softPower = STARS.softPower()
    tmp.stars.softGain = STARS.softGain()
    tmp.stars.gain = STARS.gain()
    tmp.stars.effect = STARS.effect()
}

function setupStarsHTML() {
    let stars_table = new Element("stars_table")
	let table = ""
	for (let i = 0; i < 5; i++) {
        if (i > 0) table += `<div id="star_gen_arrow_${i}" style="width: 30px; font-size: 30px"><br>←</div>`
        table += `
            <div id="star_gen_div_${i}" style="width: 250px;">
                <img src="images/star_${5-i}.png"><br><br>
                <div id="star_gen_${i}">X</div>
            </div>
        `
	}
	stars_table.setHTML(table)
}

function updateStarsScreenHTML() {
    let percent = player.stars.points.max(1).log10().div(tmp.stars.maxlimit.max(1).log10()).max(0).min(1).toNumber()
    let size = Math.min(window.innerWidth, window.innerHeight)*percent*0.9
    let color = `rgb(${percent/0.4*191}, ${percent/0.4*91+133}, 255)`
    if (percent>0.4) color = `rgb(${(percent-0.4)/0.2*64+191}, ${224-(percent-0.4)/0.2*11}, ${255-(percent-0.4)/0.2*255})`
    if (percent>0.6) color = `rgb(255, ${213-(percent-0.6)/0.1*131}, 0)`
    if (percent>0.7) color = `rgb(${255-(percent-0.7)/0.1*102}, ${82-(percent-0.7)/0.1*82}, 0)`
    if (percent>0.8) color = `rgb(153, 0, 0)`
    tmp.el.star.changeStyle('background-color',color)
    tmp.el.star.changeStyle('width',size+"px")
    tmp.el.star.changeStyle('height',size+"px")
}

function updateStarsHTML() {
    tmp.el.starSoft1.setDisplay(tmp.stars.gain.gte(tmp.stars.softGain))
	tmp.el.starSoftStart1.setTxt(format(tmp.stars.softGain))
    tmp.el.stars_Amt.setTxt(format(player.stars.points,2)+" / "+format(tmp.stars.maxlimit,2)+" "+formatGain(player.stars.points,tmp.stars.gain))
    tmp.el.stars_Eff.setTxt(format(tmp.stars.effect))

    tmp.el.star_btn.setDisplay(player.supernova.tree.includes("s4") || player.stars.unls < 5)
    tmp.el.star_btn.setHTML((player.stars.unls < 5 || !player.supernova.tree.includes("s4"))
    ? `Unlock new type of Stars, require ${format(tmp.stars.generator_req)} Quark`
    : `Boost all-Star resources gain, require ${format(tmp.stars.generator_boost_req)} Quark<br>Currently: ${format(tmp.stars.generator_boost_eff)}x`)

    tmp.el.star_btn.setClasses({btn: true, locked: !player.atom.quarks.gte(!player.supernova.tree.includes("s4")||player.stars.unls < 5?tmp.stars.generator_req:tmp.stars.generator_boost_req)})

    for (let x = 0; x < 5; x++) {
        let unl = player.stars.unls > x
        tmp.el["star_gen_div_"+x].setDisplay(unl)
        if (tmp.el["star_gen_arrow_"+x]) tmp.el["star_gen_arrow_"+x].setDisplay(unl)
        if (unl) tmp.el["star_gen_"+x].setHTML(format(player.stars.generators[x],2)+"<br>"+formatGain(player.stars.generators[x],tmp.stars.generators_gain[x]))
    }
}