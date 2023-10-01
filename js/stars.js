const STARS = {
    unlocked() { return EVO.amt >= 3 ? EVO.amt < 4 : hasElement(36) },
    gain() {
        if (EVO.amt >= 4) return E(0)

        let x = player.stars.generators[0]
        if (hasMDUpg(8)) x = x.mul(mdEff(8))
        if (hasPrestige(1,1)) x = x.pow(2)

        x = x.softcap(tmp.stars.softGain,tmp.stars.softPower,0)

        if (hasElement(182)) x = x.pow(10)
        if (hasUpgrade('bh',17)) x = x.pow(upgEffect(2,17))

        let os = E(EVO.amt >= 2?'eee7':'eee5'), op = E(0.5)
        if (hasUpgrade('atom',24)) os = expMult(os,2)
        
        let o = x
        x = overflow(x,os,op,2)

        tmp.overflow.star = calcOverflow(o,x,os,2)
        tmp.overflow_start.star = [os]
        tmp.overflow_power.star = [op]

        return x
    },
    softGain() {
        if (hasUpgrade('atom',22) || EVO.amt >= 3) return EINF
        let s = E("e1000").pow(fermEff(1, 0))
        return s
    },
    softPower() {
        let p = E(0.75)
        return p
    },
    effect() {
        let x = E(1)
		let [p, pp] = [E(1), E(1)]
		if (hasElement(48)) p = p.mul(1.1)
		if (hasElement(76)) [p, pp] = tmp.qu.rip.in?[p.mul(1.1), pp.mul(1.1)]:[p.mul(1.25), pp.mul(1.25)]
		let [s,r,t1,t2,t3] = [player.stars.points.mul(p)
			,player.ranks.rank.softcap(2.5e6,0.25,0).mul(p)
			,player.ranks.tier.softcap(1.5e5,0.25,0).mul(p)
			,player.ranks.tetr.softcap(30000,0.15,0).mul(p).softcap(5,hasTree("s2")?1.5:5,1).softcap(9,0.3,0)
			,(hasElement(69)?player.ranks.pent.mul(pp):E(0)).softcap(9,0.5,0)]
		r = r.mul(t1.pow(2)).add(1).pow(t2.add(1).pow(5/9).mul(0.25).mul(t3.pow(0.85).mul(0.0125).add(1)))
		if (EVO.amt >= 2) r = r.softcap(1e40,3,3)
		x = s.max(1).log10().add(1).pow(r)
		x = x.softcap("ee15",0.95,2).softcap("e5e22",0.95,2).softcap("ee24",0.91,2)
		if (tmp.qu.rip.in || EVO.amt >= 2) x = x.softcap('ee33',0.9,2)
        if (tmp.c16.in) x = E(1)

        return [x.min('ee70'), hasElement(162) ? this.expEffect() : E(1)]
    },
	expEffect() {
		let pp = E(1), x = E(1)
		for (let i = 0; i < RANKS.names.length; i++) {
			let r = player.ranks[RANKS.names[i]]
			pp = pp.mul(r.add(1))
		}

		if (hasPrestige(0,382)) {
			x = Decimal.add(1.1,exoticAEff(0,5,0)).pow(pp.log10().add(1).mul(player.stars.points.add(1).log10().add(1).log10().add(1)).root(2).sub(1))
		} else {
			x = pp.log10().mul(player.stars.points.add(1).log10().add(1).log10().add(1)).add(1)            
			x = hasElement(170)?x.root(1.5).div(40):x.root(2).div(50)
			x = x.add(1)
		}
        if (tmp.c16.in) x = overflow(x,10,0.5)

		x = x.overflow(EVO.amt >= 2 ? 'e1000' : 'e3000', 0.5)
		return x
	},
    generators: {
        req: [E(1e225),E(1e280),E('e320'),E('e430'),E('e870'),E('ee3600'),E('ee20000'),E('ee21000')],
        unl() {
            if (tmp.star_unl && player.atom.quarks.gte(tmp.stars.generator_req)) {
                player.stars.unls++

                tmp.stars.generator_req = player.stars.unls<tmp.stars.max_unlocks?STARS.generators.req[player.stars.unls]:EINF
            }
        },
        gain(i) {
            let pow = E(1.5)
            if (FERMIONS.onActive("13")) pow = E(0.5)
            else {
                if (hasElement(50)) pow = pow.mul(1.05)
                if (hasTree("s3")) pow = pow.mul(treeEff("s3"))
                pow = pow.mul(glyphUpgEff(9))
            }
            if (QCs.active() && pow.gte(1)) pow = pow.pow(tmp.qu.qc.eff[0][1])

            let x = E(player.stars.unls > i ? 1 : 0).add(player.stars.generators[i+1]||0).pow(pow).mul(5)
            if (hasElement(49) && i==tmp.stars.max_unlocks-1) x = x.mul(elemEffect(49))
            if (hasTree("s1") && i==tmp.stars.max_unlocks-1) x = x.mul(treeEff("s1"))
            if (hasMDUpg(8)) x = x.mul(mdEff(8))
            if (hasElement(54)) x = x.mul(elemEffect(54))
            x = x.mul(BUILDINGS.eff('star_booster'))
        
            let ne = nebulaEff("yellow")
            x = x.pow(ne[0]??1)

            if (tmp.sn.boson) x = hasElement(213) ? x.pow(tmp.sn.boson.upgs.photon[3].effect) : x.mul(tmp.sn.boson.upgs.photon[3].effect)
            if (hasPrestige(1,1)) x = x.pow(2)

            x = expMult(x,GPEffect(0))
            x = expMult(x,ne[1]??1)
            if (QCs.active()) x = expMult(x,tmp.qu.qc.eff[0][0])
            return x
        },
    },
    colors: ["#0085FF","#BFE0FF","#FFD500","#FF5200","#990000"],
}

function calcStars(dt) {
    if (!tmp.star_unl) return;

    player.stars.points = player.stars.points.add(tmp.stars.gain.mul(dt))
    if (!player.supernova.post_10) player.stars.points = player.stars.points.min(tmp.sn.maxlimit)
    for (let x = 0; x < tmp.stars.max_unlocks; x++) player.stars.generators[x] = player.stars.generators[x].add(tmp.stars.generators_gain[x].mul(dt))
}

function updateStarsTemp() {
	tmp.star_unl = STARS.unlocked()
	if (!tmp.star_unl) {
		delete tmp.stars
		return
	}
    if (!tmp.stars) tmp.stars = {
        generators_gain: [],
    }

    let s = 5
    if (hasElement(54,1)) s++
    if (hasElement(62,1)) s++
    if (hasElement(66,1)) s++
    if (CHALS.inChal(19)) s = 0
    tmp.stars.max_unlocks = s

    tmp.stars.generator_req = player.stars.unls<tmp.stars.max_unlocks?STARS.generators.req[player.stars.unls]:EINF

    for (let x = 0; x < tmp.stars.max_unlocks; x++) tmp.stars.generators_gain[x] = STARS.generators.gain(x)
    tmp.stars.softPower = STARS.softPower()
    tmp.stars.softGain = STARS.softGain()
    tmp.stars.gain = STARS.gain()
    tmp.stars.effect = STARS.effect()
}

function setupStarsHTML() {
    let stars_table = new Element("stars_table")
	let table = ""
	for (let i = 0; i < 8; i++) {
        if (i > 0) table += `<div id="star_gen_arrow_${i}" style="width: 30px; font-size: 30px"><br>←</div>`
        table += `
            <div id="star_gen_div_${i}" style="width: 250px;">
                <img src="images/star_${i}.png"><br><br>
                <div id="star_gen_${i}">X</div>
            </div>
        `
	}
	stars_table.setHTML(table)
}

function updateStarsScreenHTML() {
    let show = tmp.star_unl && !tmp.sn.gen && player.supernova.times.lt(1e5)

    tmp.el.star.setDisplay(show)
    if (show && (!tmp.sn.reached || player.supernova.post_10)) {
        let g = tmp.sn.bulk.sub(player.supernova.times).max(0)
        let percent = 0
        if (g.gte(1) && player.supernova.post_10) {
            let d = SUPERNOVA.req(tmp.sn.bulk).maxlimit
            let e = SUPERNOVA.req(tmp.sn.bulk.sub(1)).maxlimit
            percent = player.stars.points.div(e).max(1).log10().div(d.div(tmp.sn.maxlimit).max(1).log10()).max(0).min(1).toNumber()
        }
        else percent = player.stars.points.max(1).log10().div(tmp.sn.maxlimit.max(1).log10()).max(0).min(1).toNumber()
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
}

function updateStarsHTML() {
    tmp.el.starSoft1.setDisplay(tmp.stars.gain.gte(tmp.stars.softGain))
	tmp.el.starSoftStart1.setTxt(format(tmp.stars.softGain))
    tmp.el.stars_Amt.setTxt(format(player.stars.points,2)+(tmp.sn.gen?"":" / "+format(tmp.sn.maxlimit,2))+" "+formatGain(player.stars.points,tmp.stars.gain.mul(tmp.qu.speed)))
    tmp.el.stars_Eff.setHTML(`<h4>${formatMult(tmp.stars.effect[0])}</h4>`+(hasElement(162)?`, <h4>^${format(tmp.stars.effect[1])}</h4>`:``)+(tmp.sn.gen?`, +<h4>${tmp.sn.passive.format(0)}</h4>/s to supernova gain`:''))
    tmp.el.stars_Eff.setClasses({corrupted_text2: tmp.c16.in})

    tmp.el.star_btn.setDisplay(player.stars.unls < tmp.stars.max_unlocks)
    tmp.el.star_btn.setHTML(`Unlock new type of Stars, require ${format(tmp.stars.generator_req)} Quark`)

    tmp.el.star_btn.setClasses({btn: true, locked: player.atom.quarks.lt(tmp.stars.generator_req)})

    for (let x = 0; x < 8; x++) {
        let unl = player.stars.unls > x
        tmp.el["star_gen_div_"+x].setDisplay(unl)
        if (tmp.el["star_gen_arrow_"+x]) tmp.el["star_gen_arrow_"+x].setDisplay(unl)
        if (unl) tmp.el["star_gen_"+x].setHTML(format(player.stars.generators[x],2)+"<br>"+formatGain(player.stars.generators[x],tmp.stars.generators_gain[x].mul(tmp.qu.speed)))
    }

    BUILDINGS.update('star_booster')

    tmp.el.starSiltation.setDisplay(player.stars.points.gte(tmp.overflow_start.star[0]))
	tmp.el.starSiltation.setHTML(`Because of star siltation at <b>${format(tmp.overflow_start.star[0])}</b>, the exponent of collapsed stars is ${overflowFormat(tmp.overflow.star||1)}!`)
}