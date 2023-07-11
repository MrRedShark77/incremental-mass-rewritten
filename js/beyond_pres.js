const BEYOND_PRES = {
    req() {
        let x = player.pres.beyond.pow(1.5).mul(10).add(105).ceil()
        return x
    },
    bulk() {
        let x = player.prestiges[4].gte(8)?player.prestiges[4].sub(105).div(10).max(0).root(1.5).add(1).floor():E(0)
        return x
    },
    getTier() {
        let x = player.pres.beyond.gt(0)?player.pres.beyond.log10().max(0).pow(.8).mul(tmp.beyond_pres.tier_power).add(1).floor().toNumber():1
        return x
    },
    getPresFromTier(i) {
        let hp = Decimal.pow(10,Math.pow((i-1)/tmp.beyond_pres.tier_power,1/.8)).ceil()

        return player.pres.beyond.div(hp).floor()
    },
    getRequirementFromTier(i,t=tmp.beyond_pres.latestRank,mt=tmp.beyond_pres.max_tier) {
        return Decimal.pow(10,Math.pow(mt/tmp.beyond_pres.tier_power,1/.8)-Math.pow((mt-i)/tmp.beyond_pres.tier_power,1/.8)).mul(Decimal.add(t,1)).ceil()
    },

    reset(auto=false) {
        if (player.prestiges[4].gte(tmp.beyond_pres.req) && (!auto || tmp.beyond_pres.bulk.gt(player.pres.beyond))) {
            player.pres.beyond = auto ? player.pres.beyond.max(tmp.beyond_pres.bulk) : player.pres.beyond.add(1)


            player.prestiges[4] = E(0)
            INF.doReset()
        }
    },
    autoSwitch() { player.auto_beyond_pres = !player.auto_beyond_pres },

    rewards: {
        1: {
            1: `Boost [Renown 2] reward's base per beyond-prestiges max tier.`,
            2: `Beyond-Prestiges's max tier applies to Ascension Base and Beyond-Ranks's max tier applies to Prestige Base`,
            3: `Graviton effect's formula is even better.`,
            7: `Meta-Honor starts 1.5x later per Beyond-Prestige's max tier.`,
            9: `Keep Element Tier 3 on Galaxy reset.`,
        },
        2: {    
     1: `Automatically Beyond-Prestige up.`,
     2: `Auto-buy Antimatter Generator, every Modificators and Parallel Extruder.<br>They cost nothing.`,
    },
    },

    rewardEff: {
        1: {
            1: [
                ()=>{
                    let x = tmp.beyond_pres.max_tier/2.25

                    return x
                },
                x=>"+"+format(x),
            ],
            7: [
                ()=>{
                    let x = Decimal.pow(1.5,tmp.beyond_pres.max_tier)

                    return x
                },
                x=>"x"+format(x),
            ],
        },
        2: {},
    },
}

const BPNS = [
    ['Level','Prestige','Honor','Glory','Renown','Valor','Merit','Excellence','Royalty','Divinity'],
    ['','Multi-','Power-','Mega-','Giga-','Tera-','Peta-','Exa-','Zetta-','Yotta-'],
    ['','Alpha-','Beta-','Mega-','Gamma-','Delta-','Epsilon-','Zeta-','Eta-','Teta-'],
    ['','Iota-','Kappa-','Lambda-','Mu-','Nu-','Xi-','Omicron-','Pi-','Rho-'],
    ['','Prestigious-','Honorous-','Glorious-','Renownful-','Valorous-','Meritous-','Excellent-','Royal-','Divine-'], 
    ['','Unreal-','Real-','Authentic-','True-','Pure-'],// h>1 -> ct
    ['','Fantastic-Endless-Divine-Rho-Teta-Yotta-Prestige-Level'],
]

const BPNS2 = [
    ['','un','do','tri','tetra','penta','hexa','hepta','octa','nona'], // d < 3
    ['','un','du','tria','tetra','penta','hexa','hepta','octa','nona'],
    ['','un','di','tri','tetra','penta','hexa','hepta','octa','nona'], // h
]

    function getPresTierName(i) {
        if (i >= 600000) return '['+format(i,0,9,'sc')+']'
        else {
            if (i < 9) return BPNS[0][i]
            i += 1
            let m = ''
            let h = Math.floor(i / 100) % 10, d = Math.floor(i / 10) % 10, o = i % 10, p = Math.floor(i / 1000) % 10, x = Math.floor(i / 10000) % 10, l = Math.floor(i / 100000) % 10, e = Math.floor(i/600000)
            m +=BPNS[6][e] + BPNS[5][l]+BPNS[4][x]+ BPNS[3][p]+ BPNS[2][h]+ BPNS[1][d]+ BPNS[0][o]
            return capitalFirst(m)
        }
    }

function hasBeyondPres(x,y) {
    let t = tmp.beyond_pres.max_tier, lt = tmp.beyond_pres.latestRank||E(0)
    return t > x || t == x && lt.gte(y)
}

function beyondPresEff(x,y,def=1) {
    let e = tmp.beyond_pres.eff[x]
    return e?e[y]||def:def
}
function updateBeyondPresTemp() {
let p = 1


tmp.beyond_pres.tier_power = p

tmp.beyond_pres.max_tier = BEYOND_PRES.getTier()
tmp.beyond_pres.latestRank = BEYOND_PRES.getPresFromTier(tmp.beyond_pres.max_tier)

tmp.beyond_pres.req = BEYOND_PRES.req()
tmp.beyond_pres.bulk = BEYOND_PRES.bulk()

for (let x in BEYOND_PRES.rewardEff) {
    for (let y in BEYOND_PRES.rewardEff[x]) {
        if (BEYOND_PRES.rewardEff[x][y]) tmp.beyond_pres.eff[x][y] = BEYOND_PRES.rewardEff[x][y][0]()
    }
}
}
function updateBeyondPresHTML() {
let unl = hasElement(294)

tmp.el.pre_beyond_pres.setDisplay(unl)
tmp.el.beyond_pres.setDisplay(unl)
if (unl) {
    let h = ''
    for (let x = 0; x < 4; x++) {
        let rn = PRESTIGES.names[x]
        if (x == 0) rn == 'prestige'
        h += '<div>' + getScalingName(rn) + PRESTIGES.fullNames[x] + ' ' + format(player.prestiges[x],0) + '</div>'
    }
    tmp.el.pre_beyond_pres.setHTML(h)

    // Beyond Rank

    tmp.el.bp_auto.setDisplay(hasBeyondPres(2,1))
    tmp.el.bp_auto.setTxt(player.auto_beyond_pres?"ON":"OFF")

    let t = tmp.beyond_pres.max_tier
    h = ''

    for (let x = Math.min(3,t)-1; x >= 0; x--) {
        h += getPresTierName(t+5-x) + " " + (x == 0 ? tmp.beyond_pres.latestRank.format(0) : BEYOND_PRES.getPresFromTier(t-x).format(0)) + (x>0?'<br>':"")
    }

    tmp.el.bp_amt.setHTML(h)

    let r = '', b = false

    for (tt in BEYOND_PRES.rewards) {
        b = false
        for (tr in BEYOND_PRES.rewards[tt]) {
            tt = Number(tt)
            if (tt > t || (tmp.beyond_pres.latestRank.lt(tr) && tt == t)) {
                r = "At "+getPresTierName(tt+5)+" "+format(tr,0)+" - "+BEYOND_PRES.rewards[tt][tr]
                b = true
                break
            }
        }
        if (b) break;
    }

    h = `
    Reset your Valors (and force a infinity reset) but Merit/Excellence/Royalty etc. up. ${r}<br>
        To ${getPresTierName(t+5)} up, require ${getPresTierName(t+4)} ${
            t == 1
            ? tmp.beyond_pres.req.format(0)
            : BEYOND_PRES.getRequirementFromTier(1,tmp.beyond_pres.latestRank,t-1).format(0)
        }.<br>
        To ${getPresTierName(t+6)} up, require ${getPresTierName(t+5)} ${BEYOND_PRES.getRequirementFromTier(1,0).format(0)}.
    `

    tmp.el.bp_desc.setHTML(h)
    tmp.el.bp_desc.setClasses({btn: true, reset: true, locked: player.prestiges[4].lt(tmp.beyond_pres.req)})
}
}