const STARS = {
    unlocked() { return player.atom.elements.includes(36) },
    maxLimit() { return E(1e20).pow(player.supernova.times.pow(1.25)).mul(1e90) },
    gain() {
        let x = player.stars.generators[0]
        if (player.md.upgs[8].gte(1)) x = x.mul(tmp.md.upgs[8].eff)
        return x
    },
    effect() {
        let p = E(1)
        if (player.atom.elements.includes(48)) p = p.mul(1.1)
        let [s,r,t1,t2] = [player.stars.points.mul(p),player.ranks.rank.mul(p),player.ranks.tier.mul(p),player.ranks.tetr.mul(p).softcap(6,player.supernova.tree.includes("s2")?1.5:5,1)]
        let x =
        s.max(1).log10().add(1).pow(r.mul(t1.pow(2)).add(1).pow(t2.add(1).pow(5/9).mul(0.25)))
        return x
    },
    generators: {
        req: [E(1e225),E(1e280),E('e320'),E('e430'),E('e870'),E('e9600')],
        unl() {
            if (player.atom.quarks.gte(tmp.stars.generator_req)) {
                player.stars.unls++
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
            if (i==5) x.root(3)
            return x
        },
    },
    colors: ["#0085FF","#BFE0FF","#FFD500","#FF5200","#990000","#7FFF7F"],
}

function calcStars(dt) {
    player.stars.points = player.stars.points.add(tmp.stars.gain.mul(dt)).min(tmp.stars.maxlimit)
    for (let x = 0; x < 6; x++) player.stars.generators[x] = player.stars.generators[x].add(tmp.stars.generators_gain[x].mul(dt))
}

function updateStarsTemp() {
    if (!tmp.stars) tmp.stars = {
        generators_gain: [],
    }
    tmp.stars.generator_req = player.stars.unls<6?STARS.generators.req[player.stars.unls]:E(1/0)
    for (let x = 0; x < 6; x++) tmp.stars.generators_gain[x] = STARS.generators.gain(x)
    tmp.stars.maxlimit = STARS.maxLimit()
    tmp.stars.gain = STARS.gain()
    tmp.stars.effect = STARS.effect()
}

function setupStarsHTML() {
    let stars_table = new Element("stars_table")
	let table = ""
	for (let i = 0; i < 6; i++) {
        if (i > 0) table += `<div id="star_gen_arrow_${i}" style="width: 30px; font-size: 30px"><br>←</div>`
        table += `
            <div id="star_gen_div_${i}" style="width: 250px;">
                <img src="images/star_${i<5?5-i:i+1}.png"><br><br>
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
    tmp.el.stars_Amt.setTxt(format(player.stars.points,2)+" / "+format(tmp.stars.maxlimit,2)+" "+formatGain(player.stars.points,tmp.stars.gain))
    tmp.el.stars_Eff.setTxt(format(tmp.stars.effect))
    if(player.supernova.tree.includes("s4")) tmp.el.star_btn.setVisible(player.stars.unls < 6)
    else tmp.el.star_btn.setVisible(player.stars.unls < 5)
    tmp.el.star_btn.setTxt(`Unlock new type of Stars, require ${format(tmp.stars.generator_req)} Quark`)
    tmp.el.star_btn.setClasses({btn: true, locked: !player.atom.quarks.gte(tmp.stars.generator_req)})
    for (let x = 0; x < 6; x++) {
        let unl = player.stars.unls > x
        tmp.el["star_gen_div_"+x].setDisplay(unl)
        if (tmp.el["star_gen_arrow_"+x]) tmp.el["star_gen_arrow_"+x].setDisplay(unl)
        if (unl) tmp.el["star_gen_"+x].setHTML(format(player.stars.generators[x],2)+"<br>"+formatGain(player.stars.generators[x],tmp.stars.generators_gain[x]))
    }

}
