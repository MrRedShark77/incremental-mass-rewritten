const INFUSIONS = [
    {
        title: "Massive Infusion",
        reqFirstRes: "of mass",
        getFirstRes: _=> formatMass(player.mass),
        afford: x => player.mass.gte(x[0]) && player.anti.mass.gte(x[1]),
        req(i) {
            let x = Decimal.pow(10,Decimal.pow(1.25,i**1.25))
            let y = Decimal.pow(1.5,i)

            return [x,y]
        },
        effect(i) {
            let x = player.mass.add(1).log10().add(1).log10().add(1).mul(i/5).pow(0.75).add(1)

            return x
        },
        effDesc: x => `Making mass boosted itself by <b>^${x.format()}</b>.`,
        special: [
            {
                req: 10,
                unl(x) {return x >= this.req},
                eff(i) {
                    i = Math.max(i-this.req+1,0)
                    if (hasSpecialInfusion(0,4)) i *= specialInfusionEff(0,4)

                    let x = 0.99**(i**0.6)

                    return x
                },
                effDesc: x => `The requirement from Rank to Pent is <b>${formatReduction(x)}</b> weaker.`,
            },{
                req: 20,
                unl(x) {return x >= this.req},
                eff(i) {
                    i = Math.max(i-this.req+1,0)
                    if (hasSpecialInfusion(0,4)) i *= specialInfusionEff(0,4)

                    let x = Decimal.pow(1.5,i**0.5)

                    return x
                },
                effDesc: x => `All mass scaling to ^5 start <b>^${x.format()}</b> later.`,
            },{
                req: 30,
                unl(x) {return x >= this.req},
                eff(i) {
                    i = Math.max(i-this.req+1,0)
                    if (hasSpecialInfusion(0,4)) i *= specialInfusionEff(0,4)

                    let x = tmp.upgs.mass[3].eff ? tmp.upgs.mass[3].eff.eff.add(1).log10().mul(i**0.5/10).add(1) : E(1)

                    return x
                },
                effDesc: x => `Stronger Effect boosts Booster Effect by <b>^${x.format()}</b>.`,
            },{
                req: 40,
                unl(x) {return x >= this.req},
                eff(i) {
                    i = Math.max(i-this.req+1,0)
                    if (hasSpecialInfusion(0,4)) i *= specialInfusionEff(0,4)

                    let x = i**1.1/4+1

                    return x
                },
                effDesc: x => `Mass Upgrades are <b>${format(x)}x</b> cheaper.`,
            },{
                req: 50,
                unl(x) {return x >= this.req},
                eff(i) {
                    i = Math.max(i-this.req+1,0)

                    let x = i/80+1

                    return x
                },
                effDesc: x => `Above Special Influsions are <b>${formatPercent(x-1)}</b> stronger.`,
            },{
                req: 75,
                unl(x) {return x >= this.req && player.dim_shard >= 2},
                eff(i) {
                    i = Math.max(i-this.req+1,0)

                    let x = i/100

                    return x
                },
                effDesc: x => `Add <b>${format(x,2)}</b> to Accelerator's Power.`,
            },
        ],
    },{
        unl: _=>player.dim_shard>=3,
        title: "Dark Infusion",
        reqFirstRes: "of mass of black hole",
        getFirstRes: _=> formatMass(player.bh.mass),
        afford: x => player.bh.mass.gte(x[0]) && player.anti.mass.gte(x[1]),
        req(i) {
            let x = Decimal.pow(1e3,Decimal.pow(1.3,i**1.3))
            let y = Decimal.pow(2,i).mul(1e3)

            return [x,y]
        },
        effect(i) {
            let x = player.rp.points.add(1).log10().add(1).mul(player.bh.dm.add(1).log10().add(1)).log(100).add(1).mul(i/5).pow(0.75).add(1)

            return x
        },
        effDesc: x => `Making rage powers & dark matters boosted themselves by <b>^${x.format()}</b>.`,
        special: [
            {
                req: 10,
                unl(x) {return x >= this.req},
                eff(i) {
                    i = Math.max(i-this.req+1,0)

                    let x = []
                    x[0] = i/40
                    x[1] = tmp.accelEffect.eff?tmp.accelEffect.eff.mul(x[0]).add(1):E(1)

                    return x
                },
                effDesc: x => `Accelerator’s effect gives <b>x${format(x[0],2)}</b> boost to BHC’s power (<b>^${format(x[1],2)}</b>).`,
            },{
                req: 20,
                unl(x) {return x >= this.req && player.dim_shard >= 5},
                eff(i) {
                    i = Math.max(i-this.req+1,0)

                    let x = i/20

                    return x
                },
                effDesc: x => `Exponent from the mass of BH formula is increased by <b>${format(x,2)}</b>. Unhardcap BH-Exponent Boost's effect.`,
            },{
                req: 30,
                unl(x) {return x >= this.req && player.dim_shard >= 4},
                eff(i) {
                    i = Math.max(i-this.req+1,0)

                    let x = i/50+1

                    return x
                },
                effDesc: x => `Accelerator’s effect is <b>^${format(x,2)}</b> stronger.`,
            },
        ],
    },{
        unl: _=>player.dim_shard>=5,
        title: "Luminous Infusion",
        reqFirstRes: "of neutron stars",
        getFirstRes: _=> format(player.supernova.stars),
        afford: x => player.supernova.stars.gte(x[0]) && player.anti.mass.gte(x[1]),
        req(i) {
            let x = Decimal.pow(1e6,Decimal.pow(1.25,i**1.25))
            let y = Decimal.pow(4,i).mul(1e7)

            return [x,y]
        },
        effect(i) {
            let x = player.supernova.times.mul(i).root(1.5).div(150).add(1)

            return x
        },
        effDesc: x => `Making Supernova resources boosted by supernovas by <b>^${x.format()}</b>.`,
        special: [
            {
                req: 10,
                unl(x) {return x >= this.req},
                eff(i) {
                    i = Math.max(i-this.req+1,0)

                    let x = i/2

                    return x
                },
                effDesc: x => `Add <b>${format(x,1)}</b> free Fermion tiers.`,
            },
        ],
    },
]

const INFUSIONS_LEN = INFUSIONS.length

function buyInfusion(i) {
    let req = tmp.anti.infusion.req[i]

    if (INFUSIONS[i].afford(req)) {
        player.anti.infusions[i]++
        player.anti.mass = player.anti.mass.sub(req[1]).max(0)

        updateInfusionTemp()
    }
}

function updateInfusionTemp() {
    let it = tmp.anti.infusion

    for (let x = 0; x < INFUSIONS_LEN; x++) {
        let IF = INFUSIONS[x]
        let amt = player.anti.infusions[x]

        it.req[x] = IF.req(amt)

        let f = 0
        if (hasAntiUpgrade('am',8) && x == 0) f += antiUpgEffect(1,8,0)

        it.free[x] = f

        it.eff[x] = IF.effect(amt+f)

        for (let y = 0; y < IF.special.length; y++) {
            it.sEff[x][y] = IF.special[y].eff(amt+f)
        }
    }
}

function setupInfusionHTML() {
    let table = new Element("infusions_table")
	html = ""
	for (let x in INFUSIONS) {
        let IF = INFUSIONS[x]

        html += `
        <div id="infusion${x}_div" style="width: 500px">
            ${IF.title}: <span id="infusion${x}_amt"></span><br>
            <button onclick="buyInfusion(${x})" class="btn infusion_btn" id="infusion${x}_btn"></button><br>
        `

        for (let y in IF.special) {
            let ifs = IF.special[y]
            html += `<span id="infusion${x}_special${y}_div"><b>${ifs.req}:</b> <span id="infusion${x}_special${y}_desc"></span></span><br>`
        }

        html += "</div>"
    }
	table.setHTML(html)
}

function updateInfusionHTML() {
    let it = tmp.anti.infusion

    for (let x = 0; x < INFUSIONS_LEN; x++) {
        let IF = INFUSIONS[x]
        let amt = player.anti.infusions[x]
        let id = "infusion"+x

        let unl = IF.unl?IF.unl():true
        tmp.el[id+"_div"].setDisplay(unl)

        if (unl) {
            tmp.el[id+"_amt"].setHTML(format(amt,0)+(it.free[x]>0?" + "+format(it.free[x],0):""))
            tmp.el[id+"_btn"].setHTML(
                `${IF.effDesc(it.eff[x])}<br>
                Require:<br>${IF.getFirstRes()} / <b>${x <= 1 ? formatMass(it.req[x][0]) : format(it.req[x][0],0)}</b> ${IF.reqFirstRes},<br>
                ${formatMass(player.anti.mass)} / <b>${formatMass(it.req[x][1])}</b> of anti-mass.
                `
            )
            tmp.el[id+"_btn"].setClasses({btn: true, infusion_btn: true, locked: !IF.afford(it.req[x])})

            for (let y = 0; y < IF.special.length; y++) {
                let ifs = IF.special[y]
                let unl2 = ifs.unl(amt)
    
                tmp.el[id+"_special"+y+"_div"].setDisplay(unl2)
                if (unl2) {
                    tmp.el[id+"_special"+y+"_desc"].setHTML(ifs.effDesc(it.sEff[x][y]))
                }
            }
        }
    }
}

function hasSpecialInfusion(x,y) { return INFUSIONS[x].special[y].unl(player.anti.infusions[x]) }
function specialInfusionEff(x,y) { return tmp.anti.infusion.sEff[x][y] }