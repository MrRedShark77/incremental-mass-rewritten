const MATTERS = {
    names: ['Dark', 'Red', 'Magenta', 'Pink', 'Purple', 'Violet', 'Blue', 'Cyan', 'Green', 'Lime', 'Yellow', 'Orange', 'White', 'Fading'],
    colors: ['#0002',"#f002","#f0f2","#ffb6c122","#a0f2","#70f2","#06f2","#0cf2","#0f02","#bf02","#ff02","#f802","#fff2","#8882"],

    gain(i) {
        let m0 = i == 0 ? player.bh.dm : player.dark.matters.amt[i-1]

        let x = Decimal.pow(10,m0.max(1).log10().max(1).log10().add(1).pow(tmp.matters.exponent).sub(1))

        if (hasElement(192)) x = x.mul(elemEffect(192))

        x = x.pow(tmp.dark.abEff.mexp||1)
        x = x.pow(glyphUpgEff(14,1))
        if (i < MATTERS_LEN-1) x = x.pow(tmp.matters.upg[i+1].eff)

        x = x.pow(tmp.matters.FSS_eff[0])
        if (hasBeyondRank(1,7)) x = x.pow(beyondRankEffect(1,7))

        return x
    },

    firstUpgData(i) {
        let lvl = player.dark.matters.upg[i], pow = Math.max(i-2,0)/10+1.5

        let cost = Decimal.pow(1e10,lvl.scale(i>0?25:50,1.05,1).add(1).pow(pow))

        let bulk = player.dark.matters.amt[i].max(1).log(1e10).root(pow).sub(1).scale(i>0?25:50,1.05,1,true).add(1).floor()

        let eff = i==0?lvl.mul(tmp.matters.str).add(1):Decimal.pow(4/3,lvl.mul(tmp.matters.str))

        return {cost: cost, bulk: bulk, eff: eff}
    },

    final_star_shard: {
        base() {
            let x = E(1)
            for (let i = 0; i < 13; i++) x = x.mul(player.dark.matters.amt[i].add(1).log10().add(1).log10().add(1))
            return x.sub(1)
        },
        req() {
            let x = Decimal.pow(100,player.dark.matters.final**1.5).mul(1e43)
            return x
        },

        reset() {
            if (tmp.matters.FSS_base.gte(tmp.matters.FSS_req)) {
                player.dark.matters.final++

                resetMatters()
                player.dark.shadow = E(0)
                player.dark.abyssalBlot = E(0)
                DARK.doReset()
            }
        },

        effect() {
            let fss = player.dark.matters.final

            let x = Decimal.pow(2,fss**1.25)

            let y = fss*.15+1

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

function resetMatters() {
    for (let i = 0; i < 13; i++) player.dark.matters.amt[i] = E(0)
}

function updateMattersHTML() {
    tmp.el.matter_exponent.setTxt(format(tmp.matters.exponent))
    tmp.el.matter_req_div.setDisplay(player.dark.matters.unls<14)
    if (player.dark.matters.unls<14) tmp.el.matter_req.setTxt(format(tmp.matters.req_unl))

    for (let i = 0; i < 14; i++) {
        let unl = i < player.dark.matters.unls
        tmp.el['matter_div'+i].setDisplay(unl)

        if (unl) {
            let amt = i == 0 ? player.bh.dm : player.dark.matters.amt[i-1]

            tmp.el['matter_amt'+i].setTxt(format(amt,0))
            tmp.el['matter_gain'+i].setTxt(i == 0 ? amt.formatGain(tmp.bh.dm_gain) : amt.formatGain(tmp.matters.gain[i-1]))

            if (i > 0) {
                let tu = tmp.matters.upg[i-1]

                tmp.el['matter_upg_btn'+i].setClasses({btn: true, full: true, locked: amt.lt(tu.cost)})

                tmp.el['matter_upg_eff'+i].setHTML("^"+tu.eff.format(2))
                tmp.el['matter_upg_cost'+i].setHTML(tu.cost.format(0))
            }
        }
    }

    let unl = player.dark.matters.unls == 14

    tmp.el.final_star_shard_div.setDisplay(unl)

    if (unl) {
        tmp.el.FSS1.setTxt(format(player.dark.matters.final,0))
        tmp.el.final_star_base.setHTML(`You have ${tmp.matters.FSS_base.format(0)} FSS base (based on previous matters)`)
        tmp.el.FSS_req.setTxt(tmp.matters.FSS_req.format(0))
        tmp.el.FSS_btn.setClasses({btn: true, full: true, locked: tmp.matters.FSS_base.lt(tmp.matters.FSS_req)})
    }

    tmp.el.FSS_eff1.setHTML(
        player.dark.matters.final > 0
        ? `Thanks to FSS, boosts Matters gain by ^${tmp.matters.FSS_eff[0].format(1)}`
        : ''
    )
}

function updateMattersTemp() {
    tmp.matters.FSS_base = MATTERS.final_star_shard.base()
    tmp.matters.FSS_req = MATTERS.final_star_shard.req()
    tmp.matters.FSS_eff = MATTERS.final_star_shard.effect()

    tmp.matters.str = 1
    if (hasBeyondRank(1,2)) tmp.matters.str *= beyondRankEffect(1,2)

    tmp.matters.exponent = 2 + glyphUpgEff(11,0)
    if (hasPrestige(0,382)) tmp.matters.exponent += prestigeEff(0,382,0)
    if (player.ranks.hex.gte(91)) tmp.matters.exponent += .15
    if (hasElement(206)) tmp.matters.exponent += elemEffect(206,0)
    if (hasBeyondRank(1,1)) tmp.matters.exponent += .5
    
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
                You have <h3 id="FSS1">0</h3> Final Star Shard (FSS)<br>
                <span id="final_star_base">You have ??? Final Star Shard base (based on previous matters)</span>
                <br><br>
                <button class="btn full" id="FSS_btn" onclick="MATTERS.final_star_shard.reset()">
                    To get Final Star Shard, reset dark shadows, abyssal blots and matters, and force to Darkness reset. It boosts matters and glyphic mass.<br>
                    Require: <span id="FSS_req">???</span> FSS base
                </button>
            </div>
            `
        }
    }

    t.setHTML(html)
}