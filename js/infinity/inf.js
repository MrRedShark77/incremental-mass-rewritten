const INF = {
    doReset() {
        player.inf.reached = false
        player.mass = E(0)

        // QoL

        let iu11 = hasInfUpgrade(11), iu15 = hasInfUpgrade(15)

        resetMainUpgs(1,[3])
        resetMainUpgs(2,[5,6])
        resetMainUpgs(3,[2,6])
        if (!iu11) resetMainUpgs(4,[8])

        let e = [14,18,24,30,122,124,131,136,143,194]
        if (hasInfUpgrade(2)) e.push(202)
        if (hasInfUpgrade(3)) e.push(161)
        if (iu15) e.push(218)

        for (let i = 0; i < player.atom.elements.length; i++) if (player.atom.elements[i] > 218) e.push(player.atom.elements[i])

        player.atom.elements = e
        player.atom.muonic_el = []
        for (let x = 1; x <= (hasElement(229) ? 15 : 16); x++) player.chal.comps[x] = E(0)
        player.supernova.tree = ["qu_qol1", "qu_qol2", "qu_qol3", "qu_qol4", "qu_qol5", "qu_qol6", "qu_qol7", "qu_qol8", "qu_qol9", "qu_qol8a", "unl1", "unl2", "unl3", "unl4",
        "qol1", "qol2", "qol3", "qol4", "qol5", "qol6", "qol7", "qol8", "qol9", 'qu_qol10', 'qu_qol11', 'qu_qol12', 'qu0']

        player.ranks.beyond = E(0)
        for (let x = 0; x < PRESTIGES.names.length; x++) player.prestiges[x] = E(0)

        // Reset

        player.ranks[RANKS.names[RANKS.names.length-1]] = E(0)
        RANKS.doReset[RANKS.names[RANKS.names.length-1]]()

        player.rp.points = E(0)
        player.tickspeed = E(0)
        player.accelerator = E(0)
        player.bh.mass = E(0)

        player.atom.atomic = E(0)
        player.bh.dm = E(0)
        player.bh.condenser = E(0)

        tmp.supernova.time = 0

        player.atom.points = E(0)
        player.atom.quarks = E(0)
        player.atom.particles = [E(0),E(0),E(0)]
        player.atom.powers = [E(0),E(0),E(0)]
        player.atom.atomic = E(0)
        player.atom.gamma_ray = E(0)

        player.md.active = false
        player.md.particles = E(0)
        player.md.mass = E(0)
        for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = E(0)

        player.stars.unls = 0
        player.stars.generators = [E(0),E(0),E(0),E(0),E(0)]
        player.stars.points = E(0)
        player.stars.boost = E(0)

        player.supernova.chal.noTick = true
        player.supernova.chal.noBHC = true

        player.supernova.times = E(0)
        player.supernova.stars = E(0)

        player.supernova.bosons = {
            pos_w: E(0),
            neg_w: E(0),
            z_boson: E(0),
            photon: E(0),
            gluon: E(0),
            graviton: E(0),
            hb: E(0),
        }
        for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) player.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = E(0)

        player.supernova.fermions.points = [E(0),E(0)]

        for (let x = 0; x < 2; x++) for (let y = 0; y < 7; y++) player.supernova.fermions.tiers[x][y] = E(0)

        player.supernova.radiation.hz = hasUpgrade('br',6)?E(1e50):E(0)
        for (let x = 0; x < 7; x++) {
            player.supernova.radiation.ds[x] = E(0)
            for (let y = 0; y < 2; y++) player.supernova.radiation.bs[2*x+y] = E(0)
        }

        // Quantum

        let qu = player.qu
        let bmd = player.md.break
        let quSave = getQUSave()

        qu.times = E(10)
        qu.points = E(0)
        qu.bp = E(0)
        qu.chroma = [E(0),E(0),E(0)]
        qu.cosmic_str = E(0)

        qu.prim.theorems = E(0)
        qu.prim.particles = [E(0),E(0),E(0),E(0),E(0),E(0),E(0),E(0)]

        qu.en.amt = E(0)
        qu.en.eth = quSave.en.eth
        qu.en.hr = quSave.en.hr
        qu.en.rewards = quSave.en.rewards

        qu.rip.active = false
        qu.rip.amt = E(0)

        if (!iu11) bmd.active = false
        bmd.energy = E(0)
        bmd.mass = E(0)
        for (let x = 0; x < 12; x++) if (x != 10) bmd.upgs[x] = E(0)

        // Dark Reset

        let dark = player.dark
        let darkSave = getDarkSave()

        dark.rays = hasInfUpgrade(7)?E(1e12):E(0)
        dark.shadow = E(0)
        dark.abyssalBlot = E(0)

        dark.run.active = false
        dark.run.glyphs = [0,0,0,0,0,0]
        if (!hasInfUpgrade(3)) dark.run.upg = []

        dark.matters = darkSave.matters

        if (iu15) {
            darkSave.c16.first = true
            darkSave.c16.bestBH = dark.c16.bestBH
            darkSave.c16.charger = dark.c16.charger
        }

        dark.c16 = darkSave.c16

        if (hasInfUpgrade(8)) {
            for (let i = 0; i < infUpgEffect(8); i++) dark.c16.tree.push(...TREE_IDS[i][5])
        }

        dark.exotic_atom = darkSave.exotic_atom

        if (!hasElement(242)) player.bh.fvm = E(0)
        player.bh.unstable = E(0)

        // Other

        if (!hasInfUpgrade(11)) {
            tmp.rank_tab = 0
            tmp.stab[4] = 0
        }
        
        tmp.stab[7] = 0

        if (!iu15) {
            player.atom.elemTier[0] = 1
            player.atom.elemLayer = 0
        }

        // Infinity

        player.inf.dim_mass = E(0)

        updateMuonSymbol()

        updateTemp()

        player.inf.pt_choosed=-1

        generatePreTheorems()

        tmp.pass = 2
    },
    req: Decimal.pow(10,Number.MAX_VALUE),
    limit() {
        let x = Decimal.pow(10,Decimal.pow(10,Decimal.pow(1.05,player.inf.theorem.scaleEvery('inf_theorem').pow(1.25)).mul(Math.log10(Number.MAX_VALUE))))

        return x
    },
    goInf(limit=false) {
        if (player.mass.gte(this.req)) {
            if (limit || player.inf.pt_choosed >= 0 || hasElement(239)) CONFIRMS_FUNCTION.inf(limit)
            else if (player.confirms.inf) createConfirm(`Are you sure you want to go infinity without selecting any theorem?`,'inf',()=>{CONFIRMS_FUNCTION.inf(limit)})
            else CONFIRMS_FUNCTION.inf(limit)
        }
    },
    level() {
        let s = player.mass.add(1).log10().add(1).log10().div(308).max(1).log(1.1).add(1)
        s = s.mul(player.dark.c16.bestBH.add(1).log10().div(3.5e6).max(1).log(1.1).add(1))

        if (hasElement(16,1)) s = s.mul(player.inf.dim_mass.add(1).log(1e6).add(1))

        return s.max(1).root(2).softcap(tmp.inf_level_ss,1/3,0).toNumber()
    },
    gain() {
        if (player.mass.lt(this.req)) return E(0)
        let x = player.mass.add(1).log10().add(1).log10().sub(307).root(2).div(2)
        x = Decimal.pow(10,x.sub(1))

        if (hasInfUpgrade(5)) x = x.mul(infUpgEffect(5))
        if (hasElement(17,1)) x = x.mul(muElemEff(17))
        if (hasElement(20,1)) x = x.mul(muElemEff(20))

        return x.max(1).floor()
    },

    upgs: [
        [
            {
                title: "Require-Free Tree",
                desc: "Upgrades in pre-corrupted tree can be bought without their requirement.",
                cost: E(1),
            },{
                title: "Infinity Mass",
                desc: "Normal mass & BH mass gains are boosted by total infinity points.",
                cost: E(1),
                effect() {
                    let x = player.inf.total

                    return [x.add(1).pow(2).softcap(1e3,0.5,0),overflow(x.add(1).softcap(10,0.5,0),10,0.5)]
                },
                effectDesc: x => "^"+x[0].format(0)+" to normal mass"+x[0].softcapHTML(1e3)+"; ^"+x[1].format(0)+" to BH mass",
            },{
                title: "Legacy Mass Upgrade 4",
                desc: "Start with overpower unlocked, its starting cost is massively decreased (likewise, start with Binilbium-202 unlocked).",
                cost: E(1),
            },{
                title: "Dark Rest",
                desc: "Keep glyph upgrades on infinity (likewise, start with Unhexunium-161 unlocked).",
                cost: E(1),
            },
            /*
            {
                title: "Placeholder Title",
                desc: "Placeholder Description.",
                cost: E(1),
                effect() {
                    let x = E(1)

                    return x
                },
                effectDesc: x => "Placeholder",
            },
            */
        ],[
            {
                title: "Tree Automation",
                desc: "Automate pre-corrupted tree.",
                cost: E(100),
            },{
                title: "Self-Infinity",
                desc: "Infinity theorem boosts infinity points gain.",
                cost: E(100),
                effect() {
                    let x = Decimal.pow(hasBeyondRank(6,1)?3:2,player.inf.theorem)

                    return x
                },
                effectDesc: x => formatMult(x,0),
            },{
                title: "Stop Big Rip Switching",
                desc: "Pre-218 big rip elements are now affordable outside Big Rip. Automate elements tier 2 (119th-218th).",
                cost: E(100),
            },{
                title: "Dark Passive",
                desc: "Start with more dark rays (like dark ray’s first reward unlocked).",
                cost: E(100),
            },
        ],[
            {
                title: "Corrupted Construction",
                desc: "Start with rows of upgrades bought in corrupted tree (based on infinity theorems, starting at 2, ending at 5).",
                cost: E(2e3),
                effect() {
                    let x = Math.min(Math.max(1,player.inf.theorem-1),4)

                    return x
                },
                effectDesc: x => "Row 1-"+x+" of upgrades",
            },{
                title: "Parallel Extruder",
                desc: "Unlock new generator in Main tab. Also, passively generate Dimensional Mass that increases meta-score of equipped theorems.",
                cost: E(2e3),
            },{
                title: "Final Star Automation",
                desc: "Automate final star shard, and it doesn’t reset anything. Also, start with beyond-ranks automation.",
                cost: E(2e3),
            },{
                title: "Lethal Universe",
                desc: "Keep big rip upgrades and breaking dilation on infinity.",
                cost: E(2e3),
            },
        ],[
            {
                title: "Dark Challenge Automation",
                desc: "Automate challenges 13-15.",
                cost: E(6e6),
            },{
                title: "Exotic Speed",
                desc: "Infinity Theorems boost kaon and pion gains.",
                cost: E(6e6),
                effect() {
                    let x = Decimal.pow(hasBeyondRank(6,1)?3:2,player.inf.theorem)

                    return x
                },
                effectDesc: x => formatMult(x,0),
            },{
                title: "Muonic Automation",
                desc: "Automate muonic elements and muon-catalyzed fusion.",
                cost: E(6e6),
            },{
                title: "Corrupted Peak",
                desc: "Start with C16 unlocked. Keep corruption upgrades and best BH in C16 on infinity. Unlock more corruption upgrades.",
                cost: E(6e6),
            },
        ],[
            {
                title: "Break Infinity",
                desc: "Reaching infinity no longer plays animation. You can lift beyond normal mass limit and get infinity theorems freely. Finally, unlock Element Tier 3, more Muonic Elements.",
                cost: E(1e12),
            },
        ],
    ],

    upg_row_req: [
        1,
        2,
        3,
        6,
        9,
    ],

    dim_mass: {
        gain() {
            if (!hasInfUpgrade(9)) return E(0)

            let x = tmp.peEffect.eff||E(1)

            if (hasElement(244)) x = x.mul(elemEffect(244))

            return x
        },
        effect() {
            let x = player.inf.dim_mass.add(1).log10().pow(hasElement(244)?2.2:2).div(10)

            return x//.softcap(10,0.5,0)
        },
    },
    pe: {
        cost(i) { return Decimal.pow(1.2,i.scaleEvery('pe')).mul(1000).floor() },
        can() { return player.inf.points.gte(tmp.peCost) },
        buy() {
            if (this.can()) {
                player.inf.points = player.inf.points.sub(tmp.peCost).max(0)
                player.inf.pe = player.inf.pe.add(1)
            }
        },
        buyMax() { 
            if (this.can()) {
                player.inf.points = player.inf.points.sub(this.cost(tmp.peBulk.sub(1))).max(0)
                player.inf.pe = tmp.peBulk
            }
        },
        effect() {
            let t = player.inf.pe

            let bonus = E(0)

            let step = E(2).add(exoticAEff(1,4,0))

            if (hasElement(225)) step = step.add(elemEffect(225,0))
            
            let eff = step.pow(t.add(bonus))

            let eff_bottom = eff

            return {step: step, eff: eff, bonus: bonus, eff_bottom: eff_bottom}
        },
    },
}

const IU_LENGTH = (()=>{
    let n = 0
    for (let x in INF.upgs) n += INF.upgs[x].length
    return n
})()

function generatePreTheorems() {
    for (let i = 0; i < 4; i++) player.inf.pre_theorem[i] = createPreTheorem()
}

function hasInfUpgrade(i) { return player.inf.upg.includes(i) }

function buyInfUpgrade(r,c) {
    if (hasInfUpgrade(r*4+c)) return

    let u = INF.upgs[r][c]
    let cost = u.cost

    if (player.inf.points.gte(cost) && player.inf.theorem.gte(INF.upg_row_req[r])) {
        player.inf.upg.push(r*4+c)
        player.inf.points = player.inf.points.sub(cost).max(0).round()

        if (r == 4 && c == 0) addQuote(12)
    }
}

function getInfSave() {
    let s = {
        theorem: E(0),
        total: E(0),
        points: E(0),
        best: E(0),
        reached: false,

        core: [],
        inv: [],
        pre_theorem: [],
        upg: [],
        fragment: {},
        pt_choosed: -1,

        dim_mass: E(0),
        pe: E(0),
    }
    for (let i in CORE) s.fragment[i] = E(0)
    //for (let i = 0; i < 4; i++) s.pre_theorem.push(createPreTheorem())
    return s
}

function infUpgEffect(i,def=1) { return tmp.iu_eff[i] || def }

function updateInfTemp() {
    tmp.peCost = INF.pe.cost(player.inf.pe)
    tmp.peBulk = E(0)
    if (player.inf.points.gte(100)) tmp.peBulk = player.inf.points.div(1000).log(1.2).scaleEvery('pe',true).add(1).floor()
    tmp.peEffect = INF.pe.effect()

    tmp.dim_mass_gain = INF.dim_mass.gain()
    tmp.dim_mass_eff = INF.dim_mass.effect()

    for (let r in INF.upgs) {
        r = parseInt(r)

        let ru = INF.upgs[r]

        for (let c in ru) {
            c = parseInt(c)

            let u = ru[c]

            if (u.effect) tmp.iu_eff[r*4+c] = u.effect()
        }
    }

    updateCoreTemp()

    tmp.inf_level_ss = 5

    if (hasElement(222)) tmp.inf_level_ss += 5
    if (hasElement(235)) tmp.inf_level_ss += 5
    if (tmp.chal) tmp.inf_level_ss += tmp.chal.eff[17]||0

    tmp.IP_gain = INF.gain()
    tmp.inf_limit = INF.limit()
    tmp.inf_reached = player.mass.gte(tmp.inf_limit)
}

function infButton() {
    if (tmp.inf_time == 2) {
        tmp.inf_time += 1

        INF.goInf(true)

        document.body.style.animation = "inf_reset_2 2s 1"

        setTimeout(()=>{
            tmp.inf_time += 1
            tmp.el.inf_popup.setDisplay(false)

            setTimeout(()=>{
                tmp.inf_time = 0
                document.body.style.backgroundColor = 'hsl(0, 0%, 7%)'
            },1000)
        },1000)
    }
}

function calcInf(dt) {
    if (!tmp.brokenInf && tmp.inf_reached && tmp.inf_time == 0) {
        tmp.inf_time += 1
        document.body.style.animation = "inf_reset_1 10s 1"

        setTimeout(()=>{
            tmp.inf_time += 1
            document.body.style.backgroundColor = 'orange'
            tmp.el.inf_popup.setDisplay(true)
        },8500)
    }
    
    if (!player.inf.reached && player.mass.gte(INF.req)) player.inf.reached=true

    if (hasInfUpgrade(4)) for (let x = 0; x < TREE_TYPES.qu.length; x++) TREE_UPGS.buy(TREE_TYPES.qu[x], true)
    if (hasInfUpgrade(6)) for (let x = 119; x <= 218; x++) buyElement(x,0)

    player.inf.dim_mass = player.inf.dim_mass.add(tmp.dim_mass_gain.mul(dt))

    if (hasElement(232)) {
        let cs = tmp.c16.shardGain

        player.dark.c16.shard = player.dark.c16.shard.add(cs.mul(dt))
        player.dark.c16.totalS = player.dark.c16.totalS.add(cs.mul(dt))
    }

    if (hasElement(235)) {
        let ig = player.inf.best.div(1e2).mul(dt)

        player.inf.points = player.inf.points.add(ig)
        player.inf.total = player.inf.total.add(ig)
    }
}

function setupInfHTML() {
    setupCoreHTML()
    setupInfUpgradesHTML()
}

function updateInfHTML() {
    if (tmp.tab == 0 && tmp.stab[0] == 5) {
        tmp.el.dim_mass.setTxt(formatMass(player.inf.dim_mass)+" "+player.inf.dim_mass.formatGain(tmp.dim_mass_gain,true))
        tmp.el.dim_mass_eff.setHTML("+"+tmp.dim_mass_eff.format())

        let pe_eff = tmp.peEffect
		tmp.el.pe_scale.setTxt(getScalingName('pe'))
		tmp.el.pe_lvl.setTxt(format(player.inf.pe,0)+(pe_eff.bonus.gte(1)?" + "+format(pe_eff.bonus,0):""))
		tmp.el.pe_btn.setClasses({btn: true, locked: !INF.pe.can()})
		tmp.el.pe_cost.setTxt(format(tmp.peCost,0))
		tmp.el.pe_step.setHTML(formatMult(pe_eff.step))
		tmp.el.pe_eff.setTxt(formatMult(pe_eff.eff))
    }
    else if (tmp.tab == 8) {
        if (tmp.stab[8] == 0) updateCoreHTML()
        else if (tmp.stab[8] == 1) {
            let h = ``
            for (let t in CORE) {
                let hh = ``, ct = CORE[t], ctmp = tmp.core_eff[t], s = tmp.core_score[t]
                for (let i = 0; i < MAX_STARS; i++) {
                    if (s[i] > 0) hh += "Meta-Score "+format(s[i],2)+" | "+(ct.preEff[i] || '???.')+` <b class='sky'>(${ct.effDesc[i](ctmp[i])})</b><br>`
                }
                let f = player.inf.fragment[t]
                if (f.gt(0)) hh += `<br>${f.format(0)} ${ct.title.split(' ')[0]} Fragments | ${ct.fragment[1](tmp.fragment_eff[t])}<br>`
                if (hh != '') h += `<h2>${ct.title} <b>(${format(core_tmp[t].total_p*100,0)}%)</b></h2><br>`+hh+'<br>'
            }
            tmp.el.core_eff_div.setHTML(h||"Place any theorem in core to show effects!")
        }
        else if (tmp.stab[8] == 2) {
            tmp.el.ip_amt.setHTML(player.inf.points.format(0) + (hasElement(235)?" "+player.inf.points.formatGain(player.inf.best.div(1e2)):""))

            for (let r in INF.upgs) {
                r = parseInt(r)

                let unl = r == 0 || player.inf.theorem.gte(INF.upg_row_req[r-1])

                tmp.el['iu_row'+r].setDisplay(unl)

                if (!unl) continue;

                let ru = INF.upgs[r], req = player.inf.theorem.gte(INF.upg_row_req[r])

                for (let c in ru) {
                    c = parseInt(c)

                    let id = r*4+c

                    let el = tmp.el[`iu_${id}_div`]

                    if (el) {
                        let u = ru[c], b = hasInfUpgrade(id)

                        el.setClasses({inf_upg: true, locked: !b && (player.inf.points.lt(u.cost) || !req), bought: b})

                        tmp.el[`iu_${id}_desc`].setHTML(b?u.effectDesc?"<br>Effect: "+u.effectDesc(infUpgEffect(id)):"":"<br>Cost: <b>"+u.cost.format(0)+"</b> Infinity Points")
                    }
                }
            }
        }
    }
}

function setupInfUpgradesHTML() {
    let html = ''

    for (let r in INF.upgs) {
        r = parseInt(r)

        let h = `<div class='table_center' id='iu_row${r}'>
        <div class='iu_req_div'><div>Require ${INF.upg_row_req[r]} Infinity Theorem</div></div>`

        let ru = INF.upgs[r]

        for (let c in ru) {
            c = parseInt(c)

            let u = ru[c], id = r*4+c

            h += `
            <button class='inf_upg' id='iu_${id}_div' onclick='buyInfUpgrade(${r},${c})'>
                <img src='images/upgrades/iu${id}.png'>
                <div>
                    <b>${u.title}</b><br>
                    ${u.desc}<br>
                    <span id='iu_${id}_desc'></span>
                </div>
            </button>
            `
        }

        html += h + `</div>`
    }

    new Element('inf_upg_table').setHTML(html)
}