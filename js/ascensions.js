const ASCENSIONS = {
    names: ['ascension','transcension'],
    fullNames: ["Ascension","Transcension"],
    resetName: ['Ascend',"Transcend"],
    baseExponent() {
        let x = 0

        x += 1
        if (tmp.inf_unl) x += theoremEff('atom',5)/10
x += tmp.fermions.effs[1][7]
        return x
    },
    base() {
        let x = E(1)

        for (let i = 0; i < PRESTIGES.names.length; i++) {
            let r = player.prestiges[i]
            let br = E(tmp.beyond_pres.max_tier)
                if (hasBeyondPres(1,2)) x = x.add(br).mul(r.add(1).add(1).ln().add(1))
           else x = x.mul(r.add(1).add(1).ln().add(1))
        }

        return x.sub(1)
    },
    req(i) {
        let x = EINF, fp = this.fp(i), y = player.ascensions[i]
        switch (i) {
            case 0:
                x = Decimal.pow(1.2,y.div(fp).pow(1.4)).mul(2300)
                break;
                case 1:
                    x = Decimal.pow(1.2,y.div(fp)).mul(15)
                    break;
            default:
                x = EINF
                break;
        }
        return x.ceil()
    },
    bulk(i) {
        let x = E(0), y = i==0?tmp.ascensions.base:player.ascensions[i-1], fp = this.fp(i)
        switch (i) {
            case 0:
                if (y.gte(2300)) x = y.div(2300).max(1).log(1.2).max(0).root(1.4).mul(fp).add(1)
                break;
              case 1:
                    if (y.gte(15)) x = y.div(15).max(1).log(1.2).max(0).mul(fp).add(1)
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
        ()=>hasAscension(0,15)|| hasAscension(1,1),
    ],
    noReset: [
        ()=>hasAscension(1,1),
        ()=>false,
    ],
    autoUnl: [
        ()=>hasAscension(1,1),
        ()=>false,
    ],
    autoSwitch(x) { player.auto_asc[x] = !player.auto_asc[x] },
    rewards: [
        {
            1: `The bonus of tickspeed, each mass upgrade (except Overflow) now multiplies its level instead of adding. Dalton Theorem is even stronger.`,
            2: `Meta-Prestige Level starts ^1.025 later per Ascension.`,
            6: `Add +1.25x to Theorem's Power formula per Ascension.`,
10: `Remove Super-Renown Scaling`,
15: `Unlock Transcension`,
        },
        {
            1: `Automate Ascensions`
        },
    ],
    rewardEff: [
        {
            2: [
                ()=>{

                    let x = Decimal.pow(1.025,player.ascensions[0])

                    return x
                },
                x=>"^"+format(x),
            ],
            6: [
                ()=>{

                    let x = E(1).add(player.ascensions[0].mul(1.25))

                    return x
                },
                x=>"x"+format(x),
            ],
        },
        {},
    ],
    reset(i, bulk = false) {
        let b = this.bulk(i)
        if (i==0?tmp.ascensions.base.gte(tmp.ascensions.req[i]):player.ascensions[i-1].gte(tmp.ascensions.req[i])) if (!bulk || b.gt(player.ascensions[i]) ) {
            if (bulk) player.ascensions[i] = b
            else player.ascensions[i] = player.ascensions[i].add(1)

            if (!this.noReset[i]()) {
                for (let j = i-1; j >= 0; j--) {
                    player.ascensions[j] = E(0)
                }
                INF.doReset()
            }
            
            updateRanksTemp()
        }
    },
}

function hasAscension(i,x) { return player.ascensions[i].gte(x) }
function ascensionEff(i,x,def=1) { return tmp.ascensions.eff[i][x]||def }

function setupAscensionsHTML() {
    let new_table = new Element("asc_table")
	table = ""
	for (let x = 0; x < ASCENSIONS.names.length; x++) {
		table += `<div style="width: 300px" id="asc_div_${x}">
			<button id="asc_auto_${x}" class="btn" style="width: 80px;" onclick="ASCENSIONS.autoSwitch(${x})">OFF</button>
			<span id="asc_scale_${x}""></span>${ASCENSIONS.fullNames[x]} <span id="asc_amt_${x}">X</span><br><br>
			<button onclick="ASCENSIONS.reset(${x})" class="btn reset" id="asc_${x}">
				${ASCENSIONS.resetName[x]} (force an Infinity reset), but ${ASCENSIONS.fullNames[x]} up.<span id="asc_desc_${x}"></span><br>
				Req: <span id="asc_req_${x}">X</span>
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
    tmp.el.asc_base.setHTML(`${tmp.ascensions.baseMul.format(0)}<sup>${format(tmp.ascensions.baseExp)}</sup> = ${tmp.ascensions.base.format(0)}`)

    for (let x = 0; x < ASCENSIONS.names.length; x++) {
        let unl = ASCENSIONS.unl[x]?ASCENSIONS.unl[x]():true
        tmp.el["asc_div_"+x].setDisplay(unl)
        if (unl) {
            let p = player.ascensions[x] || E(0)
            let keys = Object.keys(ASCENSIONS.rewards[x])
            let desc = ""
            for (let i = 0; i < keys.length; i++) {
                if (p.lt(keys[i]) && (tmp.chal13comp || p.lte(Infinity))) {
                    desc = ` At ${ASCENSIONS.fullNames[x]} ${format(keys[i],0)} - ${ASCENSIONS.rewards[x][keys[i]]}`
                    break
                }
            }
            tmp.el["asc_scale_"+x].setTxt(getScalingName("ascension"+x))
            tmp.el["asc_amt_"+x].setTxt(format(p,0))
            tmp.el["asc_"+x].setClasses({btn: true, reset: true, locked: x==0?tmp.ascensions.base.lt(tmp.ascensions.req[x]):player.ascensions[x-1].lt(tmp.ascensions.req[x])})
            tmp.el["asc_desc_"+x].setTxt(desc)
            tmp.el["asc_req_"+x].setTxt(x==0?format(tmp.ascensions.req[x],0)+" of Ascension Base":ASCENSIONS.fullNames[x-1]+" "+format(tmp.ascensions.req[x],0))
            tmp.el["asc_auto_"+x].setDisplay(ASCENSIONS.autoUnl[x]())
            tmp.el["asc_auto_"+x].setTxt(player.auto_asc[x]?"ON":"OFF")
        }
    }
}

function updateAscensionsTemp() {
    tmp.ascensions.baseMul = ASCENSIONS.base()
    tmp.ascensions.baseExp = ASCENSIONS.baseExponent()
    tmp.ascensions.base = tmp.ascensions.baseMul.pow(tmp.ascensions.baseExp)
    for (let x = 0; x < PRES_LEN; x++) {
        tmp.ascensions.req[x] = ASCENSIONS.req(x)
        for (let y in ASCENSIONS.rewardEff[x]) {
            if (ASCENSIONS.rewardEff[x][y]) tmp.ascensions.eff[x][y] = ASCENSIONS.rewardEff[x][y][0]()
        }
    }
}

function updateAscensionsRewardHTML() {
	let c16 = tmp.c16active
	// tmp.el["asc_reward_name"].setTxt(ASCENSIONS.fullNames[player.asc_reward])
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
						tmp.el["asc_eff_"+x+"_"+y].setHTML(eff[1](tmp.ascensions.eff[x][keys[y]]))
					}
				}
			}
		}
	}
}