const MATTERS = {
    names: ['Dark', 'Red', 'Magenta', 'Pink', 'Purple', 'Violet', 'Blue', 'Cyan', 'Green', 'Lime', 'Yellow', 'Orange', 'White', 'Fading'],
    colors: ['#0002',"#f002","#f0f2","#ffb6c122","#a0f2","#70f2","#06f2","#0cf2","#0f02","#bf02","#ff02","#f802","#fff2","#8882"],

    gain(i) {
        let c16 = tmp.c16.in, rdc = tmp.matters.reduction
		let x, m0 = i == 0 ? tmp.matters.amt_0 : player.dark.matters.amt[i-1]
        if (c16) {
            x = i == 12 ? E(1) : player.dark.matters.amt[i+1].add(1)
        } else if (rdc == 2) {
            x = m0.max(1).log10().add(1).pow(tmp.matters.exponent)
        } else {
            x = E(10).pow(m0.max(1).log10().max(1).log10().add(1).pow(tmp.matters.exponent).sub(1))
        }

		let xx = E(1)
        if (hasElement(192)) xx = xx.mul(elemEffect(192))
        if (hasCharger(0)) xx = xx.mul(1e10)
        if (hasPrestige(2,22)) xx = xx.mul(prestigeEff(2,22))
        if (hasPrestige(1,139)) xx = xx.mul(prestigeEff(1,139))
        if (hasTree('ct15')) xx = xx.mul(treeEff('ct15'))

		if (rdc == 2) {
			x = x.mul(xx.log10().add(1))

			if (i < MATTERS_LEN-1) {
				x = x.mul(tmp.matters.upg[i+1].eff)
				if (hasElement(256)) x = x.mul(expMult(player.dark.matters.amt[i+1].max(1), .75))
			}
            if (EVO.amt >= 4 && i == 0) x = x.div(1e4)

			x = x.mul(tmp.dark.abEff.mexp||1)
			x = x.mul(glyphUpgEff(14,1))
			if (hasBeyondRank(1,7)) x = x.mul(beyondRankEffect(1,7))

			if (hasElement(309)) x = x.pow(tmp.matters.FSS_eff[0])
			else x = x.mul(tmp.matters.FSS_eff[0])

			if (hasElement(4,1)) x = x.pow(1.1)
			if (hasElement(227)) x = x.pow(elemEffect(227))
			if (i < MATTERS_LEN-1) x = x.pow(tmp.matters.upg[i+1].exp)

            if (EVO.amt>=4 && c16 && i == 0) x = expMult(x,1/3)
		} else {
			x = x.mul(xx)
			if (x.lt(1)) return x

			if (i < MATTERS_LEN-1) {
				x = rdc ? x.mul(tmp.matters.upg[i+1].eff) : x.pow(tmp.matters.upg[i+1].eff)
				if (hasElement(256)) x = rdc ? x.mul(player.dark.matters.amt[i+1]) : x.pow(player.dark.matters.amt[i+1].max(1).log10().add(1))
			}
			if (!rdc) {
				x = rdc ? x.mul(tmp.dark.abEff.mexp||1) : x.pow(tmp.dark.abEff.mexp||1)
				x = rdc ? x.mul(glyphUpgEff(14,1)) : x.pow(glyphUpgEff(14,1))
				if (hasBeyondRank(1,7)) x = rdc ? x.mul(beyondRankEffect(1,7)) : x.pow(beyondRankEffect(1,7))
			}
			if (hasElement(11,1) || !rdc) x = rdc ? x.mul(tmp.matters.FSS_eff[0]) : x.pow(tmp.matters.FSS_eff[0])
			if (hasElement(4,1)) x = rdc ? x.pow(1.1) : expMult(x,1.05)
			if (hasElement(227)) x = rdc ? x.pow(elemEffect(227)) : expMult(x,elemEffect(227))
			if (i < MATTERS_LEN-1) x = rdc ? x.pow(tmp.matters.upg[i+1].exp) : expMult(x,tmp.matters.upg[i+1].exp)
		}

        return x
    },

    firstUpgData(i) {
        let c16 = tmp.c16.in, rdc = tmp.matters.reduction

		let m0 = player.dark.matters.amt[i]
        let lvl = player.dark.matters.upg[i], pow = c16?1.25:Math.max(i-2,0)/10+1.5
        let cost = c16?Decimal.pow(100,lvl.add(1).pow(pow)):Decimal.pow(1e10,lvl.scale(i>0?25:50,1.05,1).add(1).pow(pow))
        let bulk = (c16?m0.max(1).log(100).root(pow):m0.max(1).log(1e10).root(pow).sub(1).scale(i>0?25:50,1.05,1,true).add(1)).floor()

        let base = Decimal.add(c16?3:4/3,GPEffect(2))
        if (hasTree('ct4')) base = base.add(treeEff('ct4'))

        if (!c16) lvl = lvl.mul(tmp.matters.str)
        let eff = c16?Decimal.pow(base,lvl):i==0?hasElement(21,1)?Decimal.pow(base,lvl.root(5)):lvl.add(1):Decimal.pow(base,lvl)
        if (i==0) eff = eff.overflow('e2500',0.5).overflow('e75000',1/3)

        if (rdc == 2) {
			cost = lvl.add(1).pow(hasInfUpgrade(17)?2:3).mul(1e3)
			bulk = m0.div(1e3).root(hasInfUpgrade(17)?2:3).floor()
			eff = lvl.add(1).mul(expMult(lvl.add(1),.9).pow(GPEffect(2)))
        	if (i == 0 && EVO.amt >= 3) eff = eff.overflow('e5e5',0.5).softcap('e5e5',0.1,0)
		}

        let exp = E(1)
		if (hasInfUpgrade(17) && i > 0) {
			if (rdc < 2) exp = lvl.add(1).log10().mul(base).div(c16 ? 1e4 : 1e3).add(1)
			if (EVO.amt == 3) exp = lvl.add(1).log10().mul(base).root(3).div(c16 ? 1e4 : 1e3).add(1)
		}
        return {cost, bulk, eff, exp}
    },

    final_star_shard: {
        base() {
            let x = E(1)
            for (let i = 0; i < 13; i++) {
				let xx = player.dark.matters.amt[i].add(1).log10().add(1)
				if (hasElement(15, 1) && EVO.amt >= 2) xx = xx.sqrt()
				else xx = xx.log10().add(1)
				x = x.mul(xx)
			}
            if (hasPrestige(1,91)) x = x.pow(1.05)
            x = x.pow(exoticAEff(1,2))

            return x.sub(1)
        },
        req() {
            let f = player.dark.matters.final

            f = f.scaleEvery('FSS',false,[1,hasTree('ct10')?treeEff('ct10').pow(-1):1])
            if (hasElement(217)) f = f.mul(.8)

            let x = Decimal.pow(100,Decimal.pow(f,1.5)).mul(EVO.amt>=2?1e3:1e43)
            return x
        },
        bulk() {
            let f = tmp.matters.FSS_base, fp = E(1)

            if (f.lt(EVO.amt>=2?1e3:1e43)) return E(0)

            if (tmp.inf_unl) fp = fp.mul(theoremEff('time',6))

            let x = f.div(EVO.amt>=2?1e3:1e43).max(1).log(100).root(1.5)
            if (hasElement(217)) x = x.div(.8)

            x = x.scaleEvery('FSS',true,[1,hasTree('ct10')?treeEff('ct10').pow(-1):1,fp])
            return x.add(1).floor()
        },

        reset(force = false) {
            if (force || tmp.matters.FSS_base.gte(tmp.matters.FSS_req)) {
                if (!force) player.dark.matters.final = player.dark.matters.final.add(1)

                resetMatters()
                player.dark.shadow = E(0)
                player.dark.abyssalBlot = E(0)
                DARK.doReset()
            }
        },

        effect() {
            let fss = player.dark.matters.final, rdc = tmp.matters.reduction
            fss = fss.mul(tmp.dark.abEff.fss||1)

            let x = Decimal.pow(2,fss.pow(1.25))
            if (rdc == 1) {
                x = x.log10().div(10).add(1)
                if (hasElement(247)) x = x.pow(1.5)
            }
            if (hasElement(309)) x = fss.div(3).add(1).root(3)

            let y = fss.mul(.15).add(1)
            return [x,y]
        },
    },
}

const MATTERS_LEN = 13

function getMatterUpgrade(i) {
    let tu = tmp.matters.upg[i]
    let amt = player.dark.matters.amt[i]

    if (amt.gte(tu.cost) && player.dark.matters.upg[i].lt(tu.bulk)) player.dark.matters.upg[i] = tu.bulk
}

function buyMaxMatters() {
    for (let i = 0; i < player.dark.matters.unls-1; i++) getMatterUpgrade(i)
}

function resetMatters() {
    for (let i = 0; i < 13; i++) {
        player.dark.matters.amt[i] = E(0)
        player.dark.matters.upg[i] = E(0)
    }
}

function updateMattersHTML() {
    let rdc = tmp.matters.reduction
    let inf_gs = tmp.preInfGlobalSpeed

    let h = `10<sup>lg(lg(x))<sup>${format(tmp.matters.exponent)}</sup>`
	if (rdc == 2) h = `lg(x)<sup>${format(tmp.matters.exponent)}</sup>`
    else if (hasElement(256)) h += tmp.c16.in ? `</sup>×(next matter)` : `×lg(next matter)</sup>`

    tmp.el.matter_formula.setHTML(h)
    tmp.el.matter_req_div.setDisplay(player.dark.matters.unls<14)
    if (player.dark.matters.unls<14) tmp.el.matter_req.setTxt(format(tmp.matters.req_unl))

    for (let i = 0; i < 14; i++) {
        let unl = i < player.dark.matters.unls
        tmp.el['matter_div'+i].setDisplay(unl)

        if (unl) {
            let amt = i == 0 ? tmp.matters.amt_0 : player.dark.matters.amt[i-1]

            tmp.el['matter_amt'+i].setTxt(format(amt,0))
            tmp.el['matter_gain'+i].setTxt(i == 0 ? amt.formatGain(tmp.bh.dm_gain.mul(tmp.qu.speed)) : amt.formatGain(tmp.matters.gain[i-1].mul(inf_gs)))

            if (i > 0) {
                let tu = tmp.matters.upg[i-1]
                tmp.el['matter_upg_btn'+i].setClasses({btn: true, full: true, locked: amt.lt(tu.cost)})
                tmp.el['matter_upg_eff'+i].setHTML((rdc?"x":"^")+tu.eff.format(2)+(tu.exp.gt(1) ? ", ^" + tu.exp.format() + (rdc?"":" to exponent") : ""))
                tmp.el['matter_upg_cost'+i].setHTML(tu.cost.format(0))
            }
        }
    }

    let unl = player.dark.matters.unls == 14
    tmp.el.final_star_shard_div.setDisplay(unl)
    if (unl) {
        tmp.el.FSS1.setTxt(format(player.dark.matters.final,0))

        tmp.el.FSS_scale.setTxt(getScalingName("FSS"))

        tmp.el.final_star_base.setHTML(`You have ${tmp.matters.FSS_base.format(0)} FSS base (based on previous matters)`)
        tmp.el.FSS_req.setTxt(tmp.matters.FSS_req.format(0))
        tmp.el.FSS_btn.setClasses({btn: true, full: true, locked: tmp.matters.FSS_base.lt(tmp.matters.FSS_req)})
    }

    tmp.el.FSS_eff1.setHTML(
        player.dark.matters.final.gt(0)
        ? `Thanks to FSS, your Matters gain is boosted by ${(rdc==2&&hasElement(309)?formatPow:formatMult)(tmp.matters.FSS_eff[0],2)}`.corrupt(rdc == 1 && !hasElement(11,1))
        : ''
    )
}

function updateMattersTemp() {
	let evo2 = EVO.amt >= 2
	let mt = tmp.matters

	mt.reduction = evo2 ? 2 : tmp.c16.in ? 1 : 0
    mt.FSS_base = MATTERS.final_star_shard.base()
    mt.FSS_req = MATTERS.final_star_shard.req()
    mt.FSS_eff = MATTERS.final_star_shard.effect()

    mt.str = E(1)
    if (hasBeyondRank(1,2)) mt.str = mt.str.mul(beyondRankEffect(1,2))
    if (hasElement(29,1)) mt.str = mt.str.mul(Decimal.max(1,tmp.ea.strength.root(2)))

    let e = Decimal.add(2,glyphUpgEff(11,0)).add(exoticAEff(1,5,0))
    if (hasPrestige(0,382)) e = e.add(prestigeEff(0,382,0))
    if (player.ranks.hex.gte(91)) e = e.add(.15)
    if (hasElement(206)) e = e.add(elemEffect(206,0))
    if (hasBeyondRank(1,1)) e = e.add(.5)
    if (hasPrestige(0,1337)) e = e.add(prestigeEff(0,1337,0))
    if (hasElement(14,1)) e = e.add(muElemEff(14,0))
    e = e.mul(nebulaEff('turquoise'))

    mt.exponent = e    
    mt.req_unl = evo2 ? E(1e5) : Decimal.pow(1e100,Decimal.pow(1.2,Math.max(0,player.dark.matters.unls-4)**1.5))
	mt.amt_0 = evo2 ? player.evo.wh.fabric : player.bh.dm
    for (let i = 0; i < MATTERS_LEN; i++) {
        mt.upg[i] = MATTERS.firstUpgData(i)
        mt.gain[i] = MATTERS.gain(i)
    }
}

function setupMattersHTML() {
    let t = new Element('matters_table')
    let html = ""

    for (let i = 0; i < 15; i++) {
        if (i < 14) {
            html +=
            `
            <div class="matter_div" style="background-color: ${MATTERS.colors[i]}" id="matter_div${i}">
                You have <h3 id="matter_amt${i}">0</h3> ${MATTERS.names[i]} Matter<br>
                <span id="matter_gain${i}"></span>
            `

            if (i > 0) html += `
            <br><br>
            <button class="btn full" id="matter_upg_btn${i}" onclick="getMatterUpgrade(${i-1})">
                Boost ${MATTERS.names[i-1]} Matter gain.<br>
                Currently: <span id="matter_upg_eff${i}">???</span><br>
                Require: <span id="matter_upg_cost${i}">???</span> ${MATTERS.names[i]} Matter
            </button>
            `
            
            html +=
            `
            </div>
            `
        } else {
            html +=
            `
            <div class="matter_div final" id="final_star_shard_div">
                You have <h3 id="FSS1">0</h3> <span id="FSS_scale"></span> Final Star Shard (FSS)<br>
                <span id="final_star_base">You have ??? Final Star Shard base (based on previous matters)</span>
                <br><br>
                <button class="btn full" id="FSS_btn" onclick="MATTERS.final_star_shard.reset()">
                    Reset dark shadows, abyssal blots, matters, and force darkness reset for a final star shard. It boosts matters gain and glyphic mass.<br>
                    Requires: <span id="FSS_req">???</span> FSS base
                </button>
            </div>
            `
        }
    }

    t.setHTML(html)
}