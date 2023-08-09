const SPELL = {
    cycleTime() {
        let time = E(5)
        time = E(5).add(tmp.mv.timeScale)
        return time
    },
    timeScale() {
        let x = E(1)
       x = player.mv.upgs[0].add(1).mul(spellEff(2).div(5).add(1)).mul(player.mv.orbits.sub(player.mv.upgs[1]).div(20).add(1)).mul(player.mv.totalCycles.pow(0.15).root(2))
       return x
    },
    cycleGain() {
        let eff = E(1)
        eff = E(tmp.mv.ringEff).pow(tmp.mv.coreEff).div(tmp.mv.orbitNerf)
        return eff
    },
    ringEff() {
        let x = E(1)
        x = player.mv.upgs[0].max(1).pow(0.75).mul(2)
        return x
    },
    coreEff() {
        let step = E(1.05)
      let x = Decimal.pow(step,player.mv.upgs[2])
       return x
    },
    orbitNerf() {
        let x = E(1)
     x = player.mv.orbits.sub(player.mv.upgs[1]).max(1).root(5)
     return x
    },
    getCycle() {
        if (player.mv.firstReset == true && tmp.mv.cycleGain.gt(0)) {
            player.dark.c16.shard = E(0)
            player.mv.points = player.mv.points.add(tmp.mv.cycleGain)
            player.mv.firstReset = true
            player.dark.c16.bestBH = E(0)
            player.supernova.tree = []
            player.atom.elements = []
            player.inf.upg = []
        for (let x = 0; x < 4; x++) player.galaxy.grade.type[x] = E(0)
        player.galaxy.grade.theorems = E(0)
        player.galaxy.times = E(0)
        player.atom.muonic_el = []
        player.md.break.active = false
       for (let x = 1; x <= 20; x++) player.chal.comps[x] = E(0)
       for (let x = 0; x < ASCENSIONS.names.length; x++) player.ascensions[x] = E(0)
       tmp.beyond_pres.max_tier = E(0)
       tmp.beyond_pres.latestRank = E(0)
        player.inf.points = E(0)
        player.inf.pe = E(0)
        player.inf.dim_mass = E(0)
        player.inf.total = E(0)
        player.inf.nm = E(0)
        player.inf.pm = E(0)
        player.inf.dm = E(0)
        player.inf.hm = E(0)
        player.inf.em = E(0)
        player.inf.nm_base = E(0)
        player.inf.pm_base = E(0)
        player.inf.dm_base = E(0)
        player.inf.hm_base = E(0)
        player.inf.em_base = E(0)
        player.inf.core[0].star = [false,false,false,false,false,false]
        player.inf.core[1].star = [false,false,false,false,false,false]
        player.inf.core[2].star = [false,false,false,false,false,false]
        player.inf.core[3].star = [false,false,false,false,false,false]
        player.inf.core[4].star = [false,false,false,false,false,false]
        player.inf.theorem = E(0)
        player.inf.theorem_max = E(1) 
        player.inf.reached = false
        player.mass = E(0)

        // QoL

        let iu11 = hasInfUpgrade(11), iu15 = hasInfUpgrade(15)

        resetMainUpgs(1,[3])
        resetMainUpgs(2,[5,6])
        resetMainUpgs(3,[2,6])
        if (!iu11) resetMainUpgs(4,[8])
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
        dark.rays = (hasInfUpgrade(7))?E(1e12):E(0)
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

    dark.matters.am_mass = E(dark.matters.am_mass)
dark.matters.am = E(0)
        dark.c16 = darkSave.c16

        if (hasInfUpgrade(8)) {
            for (let i = 0; i < infUpgEffect(8); i++) dark.c16.tree.push(...TREE_IDS[i][5])
        }
        dark.exotic_atom = darkSave.exotic_atom

        player.bh.fvm = E(0)
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
        }
        if (tmp.mv_time.gte(tmp.mv.cycleTime)) {
            tmp.mv_time = E(0)
            player.mv.totalCycles = player.mv.totalCycles.add(1)
        }
    },
    upgs: {
        buy(x) {
                player.mv.points = player.mv.points.sub(this.ids[x].cost(tmp.mv.upgs[x].bulk.sub(1))).max(0)
                player.mv.upgs[x] = player.mv.upgs[x].max(tmp.mv.upgs[x].bulk)
        },
    ids : [
        {
            desc: `Increase the length of Spell Circle' Ring.`,
            cost(x) { return Decimal.pow(5,Decimal.pow(1.5,x)).floor() },
            bulk() { return player.mv.points.max(1).log(5).max(1).log(1.5).add(1).floor() },
            effect(x) {
                return x.pow(1.25)
            },
            effDesc(x) { return "+"+format(x)+" mm " },
        },
        {
            desc: `Remove one of Spell Circle' orbits.`,
            cost(x) { return Decimal.pow(2,Decimal.pow(2,x)).floor() },
            bulk() { return player.mv.points.max(1).log2().max(1).log(2).add(1).floor() },
            effect(x) {
                return x
            },
            effDesc(x) { return "-"+format(x)+" orbits in total" },
        },
        {
            desc: `Increase the Spell Circle' Core Power.`,
            cost(x) { return Decimal.pow(10,Decimal.pow(2,x)).floor() },
            bulk() { return player.mv.points.max(1).log2().max(1).log(2).add(1).floor() },
            effect(x) {
                return x.pow(0.75).mul(1.5).max(1)
            },
            effDesc(x) { return "x"+format(x) },
        },
    ],
},
    }
function spellEff(id,def=E(1)) { return tmp.mv.upgs[id].eff??def }
    function calcMv(dt) {
        tmp.mv_time = tmp.mv_time.add(dt).min(tmp.mv.cycleTime)
        player.mv.best = Math.max(player.mv.points)
    }
    function updateSpellTemp() {
        tmp.mv.cycleTime = SPELL.cycleTime()
        tmp.mv.cycleGain = SPELL.cycleGain()
        tmp.mv.ringEff = SPELL.ringEff()
        tmp.mv.orbitNerf = SPELL.orbitNerf()
        tmp.mv.coreEff = SPELL.coreEff()
        tmp.mv.timeScale = SPELL.timeScale()
        if (!tmp.mv.upgs) {
            tmp.mv.upgs = []
            for (let x = 0; x < SPELL.upgs.ids.length; x++) tmp.mv.upgs[x] = {}
        }
        for (let x = 0; x < SPELL.upgs.ids.length; x++) {
            let upg = SPELL.upgs.ids[x]
            tmp.mv.upgs[x].cost = upg.cost(player.mv.upgs[x])
            tmp.mv.upgs[x].bulk = upg.bulk().min(upg.maxLvl||1/0)
            tmp.mv.upgs[x].can = player.mv.points.gte(tmp.mv.upgs[x].cost) && player.mv.upgs[x].lt(upg.maxLvl||1/0)
            if (upg.effect) tmp.mv.upgs[x].eff = upg.effect(player.mv.upgs[x])
        }
    }
    function setupSpellHTML() {
        let circle_upg_table = new Element("circle_upg_table")
        let table = ""
        for (let i = 0; i < SPELL.upgs.ids.length; i++) {
            let upg = SPELL.upgs.ids[i]
            table += `
            <button onclick="SPELL.upgs.buy(${i})" class="btn full circle" id="circle_upg${i}_div" style="font-size: 11px;">
            <div style="min-height: 80px">
                ${((upg.maxLvl||1/0) > 1)?`[Level <span id="circle_upg${i}_lvl"></span>]<br>`:""}
                ${upg.desc}<br>
                ${upg.effDesc?`Currently: <span id="circle_upg${i}_eff"></span>`:""}
            </div>
            <span id="circle_upg${i}_cost"></span>
            </button>
            `
        }
        circle_upg_table.setHTML(table)
    }
    function updateSpellHTML() {
        tmp.el.orbitNerf.setHTML(formatMult(tmp.mv.orbitNerf))
        tmp.el.orbitAmt.setHTML(format(player.mv.orbits.sub(player.mv.upgs[1])))
        tmp.el.ringLength.setHTML(format(spellEff(0)))
        tmp.el.coreLvl.setHTML(format(player.mv.coreLvl))
        tmp.el.corePower.setHTML(format(spellEff(2)))
        tmp.el.ringEff.setHTML(formatMult(tmp.mv.ringEff))
        tmp.el.coreEff.setHTML(formatMult(tmp.mv.coreEff))
        tmp.el.timeScale.setHTML(format(tmp.mv.timeScale))
        tmp.el.cycleGain.setHTML(format(tmp.mv.cycleGain))
        tmp.el.cycleTime.setHTML(formatTime(tmp.mv_time)+'s / '+formatTime(tmp.mv.cycleTime)+'s')
        for (let x = 0; x < SPELL.upgs.ids.length; x++) {
            let upg = SPELL.upgs.ids[x]
            let unl = upg.unl?upg.unl():true
            tmp.el["circle_upg"+x+"_div"].setVisible(unl)
            if (unl) {
                tmp.el["circle_upg"+x+"_div"].setClasses({btn: true, full: true,circle: true, locked: !tmp.mv.upgs[x].can })
                if ((upg.maxLvl||1/0) > 1) tmp.el["circle_upg"+x+"_lvl"].setTxt(format(player.mv.upgs[x],0)+(upg.maxLvl!==undefined?" / "+format(upg.maxLvl,0):""))
                if (upg.effDesc) {
                    tmp.el["circle_upg"+x+"_eff"].setHTML(upg.effDesc(tmp.mv.upgs[x].eff))
                }
                tmp.el["circle_upg"+x+"_cost"].setTxt("Cost: "+format(tmp.mv.upgs[x].cost)+" Multiversal Fragments")
            }
        }
    }