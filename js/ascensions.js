const ASCENSIONS = {
    names: ['ascension','transcension'],
    fullNames: ["Ascension",'Transcension'],
    resetName: ['Ascend','Transcend'],
    baseExponent() {
        let x = theoremEff('mass',5,E(0))
        if (hasElement(284)) x = x.add(elemEffect(284,0))
        if (hasElement(44,1)) x = x.add(muElemEff(44,0))
        if (hasBeyondRank(16,1)) x = x.add(beyondRankEffect(16,1,0))

        return x.add(1)
    },
    base() {
        let x = E(1), exp = tmp.asc.tierExp

        for (let i = 0; i < PRESTIGES.names.length; i++) {
            let r = player.prestiges[i], q = r.add(1).ln()
            if (q.gt(1)) q = q.pow(exp)
            x = x.mul(q.add(1))
        }

        return x.sub(1)
    },
    tierExponent() {
        let x = E(0)
        if (hasAscension(1,9)) x = x.add(1/3)
        x = x.add(1)

        return x
    },
    req(i) {
        let x = EINF, fp = this.fp(i), y = player.ascensions[i]
        switch (i) {
            case 0:
                x = Decimal.pow(1.1,y.div(fp).scaleEvery('ascension0',false).pow(1.1)).mul(1600)
                break;
            case 1:
                x = y.div(fp).scaleEvery('ascension1',false).pow(1.1).mul(2).add(6)
                break;
            default:
                x = EINF
                break;
        }
        return x.ceil()
    },
    bulk(i) {
        let x = E(0), y = i==0?tmp.asc.base:player.ascensions[i-1], fp = this.fp(i)
        switch (i) {
            case 0:
                if (y.gte(1600)) x = y.div(1600).max(1).log(1.1).max(0).root(1.1).scaleEvery('ascension0',true).mul(fp).add(1)
                break;
            case 1:
                if (y.gte(6)) x = y.sub(6).div(2).root(1.1).scaleEvery('ascension1',true).mul(fp).add(1)
                break;
            default:
                x = E(0)
                break;
        }
        return x.floor()
    },
    fp(i) {
        let fp = 1
        return fp
    },
    unl: [
        ()=>true,
        ()=>tmp.c18reward,
    ],
    noReset: [
        ()=>EVO.amt >= 1||hasElement(267),
        ()=>EVO.amt >= 1,
    ],
    autoUnl: [
        ()=>EVO.amt >= 1||hasElement(267),
        ()=>EVO.amt >= 1,
    ],
    rewards: [
        {
            1: `The bonus of tickspeed, each mass upgrade (except Overpower) now multiplies its level instead of adding. Dalton Theorem is even stronger.`,
            2: `Meta-Fermions start ^2 later.`,
            3: `19th Big Rip upgrade is twice as effective, and remove the overflow from unstable BH's effect.`,
            4: `Kaon & Pion gains are multiplied by 5 every Ascension.`,
            7: `Remove dilated mass's overflow.`,
            13: `Remove atomic power's overflow.`,
            15: `Remove Exotic Rank & Tier, Super & Hyper Hex.`,
            22: `Challenge 5's reward is changed again.`,
            23: `The bonus of any radiation boost now multiplies its strengthness at an reduced rate.`,
            33: `19th Big Rip upgrade is twice as effective again.`,
            42: `15th Black Hole upgrade now works like as Atomic Power's effect. The bonus of BHC now multiplies its level instead of adding.`,
        },{
            1: `Prestige Base Exponent is doubled. Big Rip Upgrade 19 now affects Renown.`,
            2: `Super Infinity Theorem is 10% weaker.`,
            3: `Super and Hyper Overpower starts +50 later.`,
            4: `Meta-Prestige starts 2x later.`,
            7: `MCF tier requirements are reduced by 10%.`,
            9: `Increase prestige tiers exponent for ascension base by +0.333.`,
        },
    ],
    rewardEff: [
        {
            4: [
                ()=>{
                    let x = Decimal.pow(5,player.ascensions[0])

                    return x
                },
                x=>formatMult(x),
            ],
        },{

        },
    ],
    reset(i, bulk = false) {
        let b = this.bulk(i)
        if (i==0?tmp.asc.base.gte(tmp.asc.req[i]):player.ascensions[i-1].gte(tmp.asc.req[i])) if (!bulk || b.gt(player.ascensions[i]) ) {
            if (bulk) player.ascensions[i] = b
            else player.ascensions[i] = player.ascensions[i].add(1)
            if (!this.noReset[i]()) {
                for (let j = i-1; j >= 0; j--) player.ascensions[j] = E(0)
                INF.doReset()
            }

            updateRanksTemp()
        }
    },
}

function hasAscension(i,x) { return tmp.inf_unl && player.ascensions[i].gte(x) }
function ascensionEff(i,x,def=1) { return tmp.asc.eff[i][x]||def }

function setupAscensionsHTML() {
    let new_table = new Element("asc_table")
	table = ""
	for (let x = 0; x < ASCENSIONS.names.length; x++) {
		table += `<div style="width: 300px" id="asc_div_${x}">
			<span id="asc_scale_${x}""></span>${ASCENSIONS.fullNames[x]} <h4 id="asc_amt_${x}">X</h4><br><br>
			<button onclick="ASCENSIONS.reset(${x})" class="btn reset" id="asc_${x}">
				${x>0?"Reset your "+ASCENSIONS.fullNames[x-1]+"s":"Force a Infinity reset"}, but ${ASCENSIONS.fullNames[x]} up.<br>
				Req: <span id="asc_req_${x}">X</span>
				<span id="asc_desc_${x}"></span>
			</button>
		</div>`
	}
	new_table.setHTML(table)

    new_table = new Element("asc_rewards_table")
	table = ""
	for (let x = 0; x < ASCENSIONS.names.length; x++) {
		table += `<div id="asc_reward_div_${x}">`
		let keys = Object.keys(ASCENSIONS.rewards[x])
		for (let y = 0; y < keys.length; y++) {
			table += `<span id="asc_reward_${x}_${y}"><b>${ASCENSIONS.fullNames[x]} ${keys[y]}:</b> ${ASCENSIONS.rewards[x][keys[y]]}${ASCENSIONS.rewardEff[x][keys[y]]?` Currently: <span id='asc_eff_${x}_${y}'></span>`:""}</span><br>`
		}
		table += `</div>`
	}
	new_table.setHTML(table)
}

function updateAscensionsHTML() {
    tmp.el.asc_base.setHTML(`${tmp.asc.baseMul.format(0)}<sup>${format(tmp.asc.baseExp,4)}</sup> = ${tmp.asc.base.format(0)}`)
    tmp.el.asc_texp.setHTML(tmp.asc.tierExp.format())

    for (let x = 0; x < ASCENSIONS.names.length; x++) {
        let unl = ASCENSIONS.unl[x]?ASCENSIONS.unl[x]():true
        tmp.el["asc_div_"+x].setDisplay(unl)
        if (unl) {
            let p = player.ascensions[x] || E(0)
            let keys = Object.keys(ASCENSIONS.rewards[x])
            let desc = ""
            for (let i = 0; i < keys.length; i++) {
                if (p.lt(keys[i]) && (tmp.chal13comp || p.lte(Infinity))) {
                    desc = `<br class='line'>${ASCENSIONS.fullNames[x]} ${format(keys[i],0)}: ${ASCENSIONS.rewards[x][keys[i]]}`
                    break
                }
            }
            tmp.el["asc_scale_"+x].setTxt(getScalingName("ascension"+x))
            tmp.el["asc_amt_"+x].setTxt(format(p,0))
            tmp.el["asc_"+x].setClasses({btn: true, reset: true, locked: x==0?tmp.asc.base.lt(tmp.asc.req[x]):player.ascensions[x-1].lt(tmp.asc.req[x])})
            tmp.el["asc_desc_"+x].setHTML(desc)
            tmp.el["asc_req_"+x].setTxt(x==0?format(tmp.asc.req[x],0)+" of Ascension Base":ASCENSIONS.fullNames[x-1]+" "+format(tmp.asc.req[x],0))
        }
    }
}

function updateAscensionsTemp() {
    tmp.asc.unl = EVO.amt > 1 ? hasInfUpgrade(16) : player.chal.comps[17].gte(4)
    tmp.asc.tierExp = ASCENSIONS.tierExponent()
    tmp.asc.baseMul = ASCENSIONS.base()
    tmp.asc.baseExp = ASCENSIONS.baseExponent()
    tmp.asc.base = tmp.asc.baseMul.pow(tmp.asc.baseExp)
    for (let x = 0; x < ASCENSIONS.names.length; x++) {
        tmp.asc.req[x] = ASCENSIONS.req(x)
        for (let y in ASCENSIONS.rewardEff[x]) {
            if (hasAscension(x, y) && ASCENSIONS.rewardEff[x][y]) tmp.asc.eff[x][y] = ASCENSIONS.rewardEff[x][y][0]()
        }
    }
}

function updateAscensionsRewardHTML() {
	let c16 = tmp.c16.in
	for (let x = 0; x < ASCENSIONS.names.length; x++) {
		tmp.el["asc_reward_div_"+x].setDisplay(player.asc_reward == x)
		if (player.asc_reward == x) {
			let keys = Object.keys(ASCENSIONS.rewards[x])
			for (let y = 0; y < keys.length; y++) {
				let unl = player.ascensions[x].gte(keys[y])
				tmp.el["asc_reward_"+x+"_"+y].setDisplay(unl)
				if (unl) {
					tmp.el["asc_reward_"+x+"_"+y].setClasses({corrupted_text2: false})
					if (tmp.el["asc_eff_"+x+"_"+y]) {
						let eff = ASCENSIONS.rewardEff[x][keys[y]]
						tmp.el["asc_eff_"+x+"_"+y].setHTML(eff[1](tmp.asc.eff[x][keys[y]]))
					}
				}
			}
		}
	}
}