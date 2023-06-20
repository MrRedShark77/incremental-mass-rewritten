const MATTERS = {
    names: ['Dark', 'Red', 'Magenta', 'Pink', 'Purple', 'Violet', 'Blue', 'Cyan', 'Green', 'Lime', 'Yellow', 'Orange', 'White', 'Fading'],
    colors: ['#0002',"#f002","#f0f2","#ffb6c122","#a0f2","#70f2","#06f2","#0cf2","#0f02","#bf02","#ff02","#f802","#fff2","#8882"],

    gain(i) {
        let x, m0, c16 = tmp.c16active

        if (c16) {
            x = i == 12 ? E(1) : player.dark.matters.amt[i+1]
        } else {
            m0 = i == 0 ? player.bh.dm : player.dark.matters.amt[i-1]
            x = Decimal.pow(10,m0.max(1).log10().max(1).log10().add(1).pow(tmp.matters.exponent).sub(1))
        }

        if (hasElement(192)) x = x.mul(elemEffect(192))
        if (hasCharger(0)) x = x.mul(1e10)
        if (hasPrestige(2,22)) x = x.mul(prestigeEff(2,22))
        if (hasPrestige(1,139)) x = x.mul(prestigeEff(1,139))
        if (hasTree('ct15')) x = x.mul(treeEff('ct15'))

        if (x.lt(1)) return x

        if (i < MATTERS_LEN-1) x = c16 ? x.mul(tmp.matters.upg[i+1].eff) : x.pow(tmp.matters.upg[i+1].eff)

        if (!c16) {
            x = x.pow(tmp.dark.abEff.mexp||1)
            x = x.pow(glyphUpgEff(14,1))
            if (hasBeyondRank(1,7)) x = x.pow(beyondRankEffect(1,7))
        }

        if (hasElement(11,1) || !c16) x = x.pow(tmp.matters.FSS_eff[0])

        if (hasElement(4,1)) x = c16 ? x.pow(1.1) : expMult(x,1.05)
        if (hasElement(227)) x = c16 ? x.pow(elemEffect(227)) : expMult(x,elemEffect(227))

        return x
    },

    firstUpgData(i) {
        let c16 = tmp.c16active

        let lvl = player.dark.matters.upg[i], pow = c16?1.25:Math.max(i-2,0)/10+1.5

        let cost = c16?Decimal.pow(100,lvl.add(1).pow(pow)):Decimal.pow(1e10,lvl.scale(i>0?25:50,1.05,1).add(1).pow(pow))

        let bulk = (c16?player.dark.matters.amt[i].max(1).log(100).root(pow):player.dark.matters.amt[i].max(1).log(1e10).root(pow).sub(1).scale(i>0?25:50,1.05,1,true).add(1)).floor()

        let base = c16?3:4/3

        if (hasTree('ct4')) base += treeEff('ct4')

        if (!c16) lvl = lvl.mul(tmp.matters.str)

        let eff = c16?Decimal.pow(base,lvl):i==0?hasElement(21,1)?Decimal.pow(base,lvl.root(5)):lvl.add(1):Decimal.pow(base,lvl)

        return {cost: cost, bulk: bulk, eff: eff}
    },

    final_star_shard: {
        base() {
            let x = E(1)
            for (let i = 0; i < 13; i++) x = x.mul(player.dark.matters.amt[i].add(1).log10().add(1).log10().add(1))

            if (hasPrestige(1,91)) x = x.pow(1.05)

            x = x.pow(exoticAEff(1,2))

            return x.sub(1)
        },
        req() {
            let f = player.dark.matters.final

            f = f.scaleEvery('FSS',false,[1,hasTree('ct10')?treeEff('ct10').pow(-1):1])

            if (hasElement(217)) f = f.mul(.8)

            let x = Decimal.pow(100,Decimal.pow(f,1.5)).mul(1e43)
            return x
        },
        bulk() {
            let f = tmp.matters.FSS_base

            if (f.lt(1e43)) return E(0)

            let x = f.div(1e43).max(1).log(100).root(1.5)

            if (hasElement(217)) x = x.div(.8)

            x = x.scaleEvery('FSS',true,[1,hasTree('ct10')?treeEff('ct10').pow(-1):1])

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
            let c16 = tmp.c16active

            let fss = player.dark.matters.final

            fss = fss.mul(tmp.dark.abEff.fss||1)

            let x = Decimal.pow(2,fss.pow(1.25))

            if (c16) {
                x = x.log10().div(10).add(1)
                if (hasElement(247)) x = x.pow(1.5)
            }

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
    let c16 = tmp.c16active
    let inf_gs = tmp.preInfGlobalSpeed

    tmp.el.matter_exponent.setTxt(format(tmp.matters.exponent))
    tmp.el.matter_req_div.setDisplay(player.dark.matters.unls<14)
    if (player.dark.matters.unls<14) tmp.el.matter_req.setTxt(format(tmp.matters.req_unl))

    for (let i = 0; i < 14; i++) {
        let unl = i < player.dark.matters.unls
        tmp.el['matter_div'+i].setDisplay(unl)

        if (unl) {
            let amt = i == 0 ? player.bh.dm : player.dark.matters.amt[i-1]

            tmp.el['matter_amt'+i].setTxt(format(amt,0))
            tmp.el['matter_gain'+i].setTxt(i == 0 ? amt.formatGain(tmp.bh.dm_gain.mul(tmp.preQUGlobalSpeed)) : amt.formatGain(tmp.matters.gain[i-1].mul(inf_gs)))

            if (i > 0) {
                let tu = tmp.matters.upg[i-1]

                tmp.el['matter_upg_btn'+i].setClasses({btn: true, full: true, locked: amt.lt(tu.cost)})

                tmp.el['matter_upg_eff'+i].setHTML((c16?"x":"^")+tu.eff.format(2))
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
        ? `Thanks to FSS, your Matters gain is boosted by ^${tmp.matters.FSS_eff[0].format(1)}`.corrupt(c16 && !hasElement(11,1))
        : ''
    )
}

function updateMattersTemp() {
    tmp.matters.FSS_base = MATTERS.final_star_shard.base()
    tmp.matters.FSS_req = MATTERS.final_star_shard.req()
    tmp.matters.FSS_eff = MATTERS.final_star_shard.effect()

    tmp.matters.str = 1
    if (hasBeyondRank(1,2)) tmp.matters.str *= beyondRankEffect(1,2)

    if (hasElement(29,1)) tmp.matters.str *= Math.max(1,tmp.exotic_atom.strength**0.5)

    tmp.matters.exponent = 2 + glyphUpgEff(11,0) + exoticAEff(1,5,0)
    if (hasPrestige(0,382)) tmp.matters.exponent += prestigeEff(0,382,0)
    if (player.ranks.hex.gte(91)) tmp.matters.exponent += .15
    if (hasElement(206)) tmp.matters.exponent += elemEffect(206,0)
    if (hasBeyondRank(1,1)) tmp.matters.exponent += .5
    if (hasPrestige(0,1337)) tmp.matters.exponent += prestigeEff(0,1337,0)
    if (hasElement(14,1)) tmp.matters.exponent += muElemEff(14,0)
    
    tmp.matters.req_unl = Decimal.pow(1e100,Decimal.pow(1.2,Math.max(0,player.dark.matters.unls-4)**1.5))

    for (let i = 0; i < MATTERS_LEN; i++) {
        tmp.matters.upg[i] = MATTERS.firstUpgData(i)

        tmp.matters.gain[i] = MATTERS.gain(i)
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