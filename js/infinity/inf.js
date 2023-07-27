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

        if (player.chal.active != 19){ for (let i = 0; i < player.atom.elements.length; i++) if (player.atom.elements[i] > 218) e.push(player.atom.elements[i])
        }
        player.atom.elements = e
        let me = []
        if (hasElement(40,1)) for (let i = 0; i < player.atom.muonic_el.length; i++) me.push(i)
        if (hasElement(30,1)) me.push(30)
       else player.atom.muonic_el = me
       if (!hasTree('glx14')) for (let x = 1; x <= 16; x++) player.chal.comps[x] = E(0)
        let keep = ["qu_qol1", "qu_qol2", "qu_qol3", "qu_qol4", "qu_qol5", "qu_qol6", "qu_qol7", "qu_qol8", "qu_qol9", "qu_qol8a", "unl1", "unl2", "unl3", "unl4",
        "qol1", "qol2", "qol3", "qol4", "qol5", "qol6", "qol7", "qol8", "qol9", 'qu_qol10', 'qu_qol11', 'qu_qol12', 'qu0']
        for (let x = 0; x < tmp.supernova.tree_had.length; x++) if (TREE_UPGS.ids[tmp.supernova.tree_had[x]].glx) keep.push(tmp.supernova.tree_had[x])
        let save_keep = []
        for (let x in keep) if (hasTree(keep[x])) save_keep.push(keep[x])
        player.supernova.tree = save_keep
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
if (hasElement(273)) {dark.matters.am_mass = dark.matters.am_mass
dark.matters.am = dark.matters.am}
else {
    dark.matters.am_mass = E(dark.matters.am_mass)
dark.matters.am = E(0)
}
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
    },
    req: Decimal.pow(10,Number.MAX_VALUE),
    limit() {
        let x = Decimal.pow(10,Decimal.pow(10,Decimal.pow(1.05,player.inf.theorem.scaleEvery('inf_theorem').pow(1.25)).mul(Math.log10(Number.MAX_VALUE))))

        return x
    },
    goInf(limit=false) {
        if (player.mass.gte(this.req)) {
            if (limit || player.inf.pt_choosed >= 0 && (player.confirms.inf)) CONFIRMS_FUNCTION.inf(limit)
            else {
                if (player.confirms.inf) createConfirm(`Are you sure you want to go infinity without selecting any theorem?`,'inf',()=>{CONFIRMS_FUNCTION.inf(limit)})
            else CONFIRMS_FUNCTION.inf(limit)}
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
        if (hasElement(235)) x = x.mul(elemEffect(235))
        x = x.mul(tmp.hm_base_boost)
        if (player.galaxy.grade.type[1].gte(1)) x = x.mul(tmp.grade.eff[1][0])
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
                    let x = Decimal.pow(2,player.inf.theorem)

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
                    let x = Decimal.pow(2,player.inf.theorem)

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
        [
            {
                title: "Master Infinity",
                desc: "Now you can passively gain Infinity Points based on Max Theorem's Level",
                cost: E(5e19),
                effect() {
                    if (hasElement(27,1)) x = player.dark.c16.shard.add(1).root(10).log2().add(1)
                    else x = player.inf.theorem_max.max(1).log10().add(1)

                    return x.max(1)
                },
                effectDesc:
                 x => (hasElement(27,1)?'Based on Corrupted Shards - ':`Based on Max Theorem's Level - `) + formatPercent(x-1),
            },
        ],
    ],

    upg_row_req: [
        1,
        2,
        3,
        6,
        9,
        11,
    ],

    dim_mass: {
        gain() {
            if (!hasInfUpgrade(9) || CHALS.inChal(19)|| CHALS.inChal(20)) return E(0)
            let x = tmp.peEffect.eff||E(1)
            if (hasElement(23,1) && (!CHALS.inChal(16))) x = x.pow(muElemEff(23,1))
            if (player.chal.comps[18].gte(1)) x = x.mul(player.chal.comps[18].mul(25).pow(10).add(1))
            return x
        },
        effect() {
            let x = player.inf.dim_mass.add(1).log10().pow(2).div(10)

            return x.softcap(15000,0.25,0)
        },
    },
    nm_base: {
        gain() {
            if (!hasElement(253)) return E(0)
            let x = tmp.nmEffect.eff||E(1)
            if (hasOrbUpg(2)) x = x.mul(tmp.nm_base_boost)
            return x
        },
        effect() {
            let x = player.inf.nm_base.add(1).log(15).div(300).softcap(tmp.nm_base_soft,0.1,0)

            return x//.softcap(10,0.5,0)
        },
        soft() {
            let soft = E(0.15)
            if (hasElement(32,1)) soft = soft.add(muElemEff(32))
            if (hasElement(272)) soft = soft.add(0.3)
            if (player.galaxy.grade.type[3].gte(1)) soft = soft.add(gradeEffect(3,0))
            return soft
        },
        boost() {
            let x = E(1)
            if (hasOrbUpg(2)) x = player.inf.pm_base.max(1).root(2).pow(1.6).add(1)
            return overflow(x,1e60,0.01)
        },
    },
    pm_base: {
        gain() {
            if (!hasElement(256)) return E(0)
            let x = tmp.pmEffect.eff||E(1)
            if (hasOrbUpg(2)) x = x.mul(tmp.pm_base_boost)
            return x
        },
        effect() {
            let x = player.inf.pm_base.add(1).root(0.15).pow(hasElement(271)?2.25:2).add(1)

            return x//.softcap(10,0.5,0)
        },
        boost() {
            let x = E(1)
            if (hasOrbUpg(2)) x = player.inf.dm_base.max(1).root(1.5).pow(1.45).add(1)
            return x.softcap(1e45,0.1,0)
        },
    },
    dm_base: {
        gain() {
            if (!hasElement(261)) return E(0)
            let x = tmp.dmEffect.eff||E(1)
            if (hasOrbUpg(2)) x = x.mul(tmp.dm_base_boost)
            return x
        },
        effect() {
            let x = E(1)
            x = player.inf.dm_base.add(1).root(3).max(1)
            return x.softcap(tmp.dm_base_soft,0.001,0)
        },
        soft() {
            let soft = E(10000000)
            if (hasElement(270)) soft = soft.pow(2)
            return soft
        },
        boost() {
            let x = E(1)
            if (hasOrbUpg(2)) x = player.inf.em_base.max(1).root(1.5).pow(1.45).add(1)
            return x.softcap(1e45,0.1,0)
        },
    },
    em_base: {
        gain() {
            if (!hasElement(261)) return E(0)
            let x = tmp.emEffect.eff||E(1)
            if (hasOrbUpg(2)) x = x.mul(tmp.em_base_boost)
            return x
        },
        boost() {
            let x = E(1)
            if (hasOrbUpg(2)) x = player.inf.hm_base.max(1).root(1.5).pow(1.45).add(1)
            return x.softcap(1e45,0.1,0)
        },
    },
    hm_base: {
        gain() {
            if (!hasElement(261)) return E(0)
            let x = tmp.hmEffect.eff||E(1)
            return x
        },
        soft() {
            let soft = E(10000000)
            if (hasElement(270)) soft = soft.pow(2)
            return soft
        },
        boost() {
            let x = E(1)
            if (hasOrbUpg(2)) x = player.inf.hm_base.max(1).root(7).pow(0.15).add(1)
            return x.softcap(1e45,0.1,0)
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
                if (!hasBeyondPres(2,2))  player.inf.points = player.inf.points.sub(this.cost(tmp.peBulk.sub(1))).max(0)
                player.inf.pe = tmp.peBulk
            }
        },
        effect() {
            let t = player.inf.pe

            let bonus = E(0)

            let step = E(2).add(exoticAEff(1,4,0))

            if (hasElement(225)) step = step.add(elemEffect(225,0))
            if (tmp.inf_unl) step=step.mul(theoremEff('bh',5))
            if (hasTree('glx17')) step = step.add(treeEff('glx17'))
            
            let eff = step.pow(t.add(bonus))

            let eff_bottom = eff

            return {step: step, eff: eff, bonus: bonus, eff_bottom: eff_bottom}
        },
    },
    nm: {
        cost(i) { return Decimal.pow(1.2,i.scaleEvery('nm')).mul(1e25).floor() },
        can() { return player.inf.points.gte(tmp.nmCost) },
        buy() {
            if (this.can()) {
                player.inf.points = player.inf.points.sub(tmp.nmCost).max(0)
                player.inf.nm = player.inf.nm.add(1)
            }
        },
        buyMax() { 
            if (this.can()) {
                if (!hasBeyondPres(2,2))  player.inf.points = player.inf.points.sub(this.cost(tmp.nmBulk.sub(1))).max(0)
                player.inf.nm = tmp.nmBulk
            }
        },
        effect() {
            let t = player.inf.nm

            let bonus = E(0)

            let step = E(2)
            if (hasPrestige(4,1)) step = step.mul(prestigeEff(4,1))
            if (hasElement(26,1)) {
                let p = muElemEff(26,1)
                step = step.mul(p)
            }
            if (hasElement(37,1)) {
                let p = muElemEff(37,1)
                step = step.pow(p)
            }
            let eff = step.pow(t.add(bonus))

            return {step: step, eff: eff, bonus: bonus}
        },
    },
    pm: {
        cost(i) { return Decimal.pow(1.2,i.scaleEvery('pm')).mul(1e25).floor() },
        can() { return player.inf.points.gte(tmp.pmCost) },
        buy() {
            if (this.can()) {
                player.inf.points = player.inf.points.sub(tmp.pmCost).max(0)
                player.inf.pm = player.inf.pm.add(1)
            }
        },
        buyMax() { 
            if (this.can()) {
                if (!hasBeyondPres(2,2)) player.inf.points = player.inf.points.sub(this.cost(tmp.pmBulk.sub(1))).max(0)
                player.inf.pm = tmp.pmBulk
            }
        },
        effect() {
            let t = player.inf.pm

            let bonus = E(0)

            let step = E(2)
            
            let eff = step.pow(t.add(bonus))

            return {step: step, eff: eff, bonus: bonus}
        },
    },
    dm: {
        cost(i) { return Decimal.pow(1.2,i.scaleEvery('dm')).mul(1e25).floor() },
        can() { return player.inf.points.gte(tmp.dmCost) },
        buy() {
            if (this.can()) {
                if (!hasBeyondPres(2,2))  player.inf.points = player.inf.points.sub(tmp.dmCost).max(0)
                player.inf.dm = player.inf.dm.add(1)
            }
        },
        buyMax() { 
            if (this.can()) {
                if (!hasBeyondPres(2,2)) player.inf.points = player.inf.points.sub(this.cost(tmp.dmBulk.sub(1))).max(0)
                player.inf.dm = tmp.dmBulk
            }
        },
        effect() {
            let t = player.inf.dm

            let bonus = E(0)

            let step = E(2)
            
            let eff = step.pow(t.add(bonus))

            return {step: step, eff: eff, bonus: bonus}
        },
    },
    em: {
        cost(i) { return Decimal.pow(1.2,i.scaleEvery('em')).mul(1e38).floor() },
        can() { return player.inf.points.gte(tmp.emCost) },
        buy() {
            if (this.can()) {
                player.inf.points = player.inf.points.sub(tmp.emCost).max(0)
                player.inf.em = player.inf.em.add(1)
            }
        },
        buyMax() { 
            if (this.can()) {
                if (!hasBeyondPres(2,2)) player.inf.points = player.inf.points.sub(this.cost(tmp.emBulk.sub(1))).max(0)
                player.inf.em = tmp.emBulk
            }
        },
        effect() {
            let t = player.inf.em

            let bonus = E(0)

            let step = E(2)
            
            let eff = step.pow(t.add(bonus))

            return {step: step, eff: eff, bonus: bonus}
        },
    },
    hm: {
        cost(i) { return Decimal.pow(1.2,i.scaleEvery('hm')).mul(1e38).floor() },
        can() { return player.inf.points.gte(tmp.hmCost) },
        buy() {
            if (this.can()) {
                player.inf.points = player.inf.points.sub(tmp.hmCost).max(0)
                player.inf.hm = player.inf.hm.add(1)
            }
        },
        buyMax() { 
            if (this.can()) {
                if (!hasBeyondPres(2,2))  player.inf.points = player.inf.points.sub(this.cost(tmp.hmBulk.sub(1))).max(0)
                player.inf.hm = tmp.hmBulk
            }
        },
        effect() {
            let t = player.inf.hm

            let bonus = E(0)

            let step = E(2)
            
            let eff = step.pow(t.add(bonus))

            return {step: step, eff: eff, bonus: bonus}
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
        theorem_max: E(),
        total: E(0),
        points: E(0),
        reached: false,

        core: [],
        inv: [],
        pre_theorem: [],
        upg: [],
        pt_choosed: -1,

        dim_mass: E(0),
        nm_base: E(0),
        pm_base: E(0),
        dm_base: E(0),
        em_base: E(0),
        hm_base: E(0),
        pe: E(0),
        dm: E(0),
        pm: E(0),
        nm: E(0),
        em: E(0),
        hm: E(0),
        c18: {
            orb: E(0),
            upgs: [],
        }
    }
    //for (let i = 0; i < 4; i++) s.pre_theorem.push(createPreTheorem())
    return s
}

function infUpgEffect(i,def=1) { return tmp.iu_eff[i] || def }

function updateInfTemp() {
    tmp.peCost = INF.pe.cost(player.inf.pe)
    tmp.peBulk = E(0)
    if (player.inf.points.gte(100)) tmp.peBulk = player.inf.points.div(1000).log(1.2).scaleEvery('pe',true).add(1).floor()
    tmp.peEffect = INF.pe.effect()
    tmp.nmCost = INF.nm.cost(player.inf.nm)
    tmp.nmBulk = E(0)
    if (player.inf.points.gte(100)) tmp.nmBulk = player.inf.points.div(1e25).log(1.2).scaleEvery('nm',true).add(1).floor()
    tmp.nmEffect = INF.nm.effect()
    tmp.pmCost = INF.nm.cost(player.inf.pm)
    tmp.pmBulk = E(0)
    if (player.inf.points.gte(100)) tmp.pmBulk = player.inf.points.div(1e25).log(1.2).scaleEvery('pm',true).add(1).floor()
    tmp.pmEffect = INF.pm.effect()
    tmp.dmCost = INF.dm.cost(player.inf.dm)
    tmp.dmBulk = E(0)
    if (player.inf.points.gte(100)) tmp.dmBulk = player.inf.points.div(1e25).log(1.2).scaleEvery('dm',true).add(1).floor()
    tmp.dmEffect = INF.dm.effect()

    tmp.emCost = INF.em.cost(player.inf.em)
    tmp.emBulk = E(0)
    if (player.inf.points.gte(100)) tmp.emBulk = player.inf.points.div(1e38).log(1.2).scaleEvery('em',true).add(1).floor()
    tmp.emEffect = INF.em.effect()

    tmp.hmCost = INF.hm.cost(player.inf.hm)
    tmp.hmBulk = E(0)
    if (player.inf.points.gte(100)) tmp.hmBulk = player.inf.points.div(1e38).log(1.2).scaleEvery('hm',true).add(1).floor()
    tmp.hmEffect = INF.hm.effect()
    tmp.dim_mass_gain = INF.dim_mass.gain()
    tmp.dim_mass_eff = INF.dim_mass.effect()
    tmp.nm_base_gain = INF.nm_base.gain()
    tmp.nm_base_eff = INF.nm_base.effect()
    tmp.pm_base_gain = INF.pm_base.gain()
    tmp.pm_base_eff = INF.pm_base.effect()
    tmp.dm_base_gain = INF.dm_base.gain()
    tmp.dm_base_eff = INF.dm_base.effect()
    tmp.nm_base_soft = INF.nm_base.soft()
    tmp.dm_base_soft = INF.dm_base.soft()
    tmp.nm_base_boost = INF.nm_base.boost()
    tmp.pm_base_boost = INF.pm_base.boost()
    tmp.em_base_soft = INF.nm_base.soft()
    tmp.hm_base_soft = INF.dm_base.soft()
    tmp.dm_base_boost = INF.dm_base.boost()
    tmp.em_base_boost = INF.em_base.boost()
    tmp.hm_base_boost = INF.hm_base.boost()
    tmp.em_base_gain = INF.em_base.gain()
    tmp.hm_base_gain = INF.hm_base.gain()
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

    if (hasElement(222) && (!CHALS.inChal(17))&& (!CHALS.inChal(18))) tmp.inf_level_ss += 5
    if (hasElement(230)) tmp.inf_level_ss += elemEffect(230)
    if (hasElement(233)) tmp.inf_level_ss += elemEffect(233)
    if (hasBeyondRank(7,3)) tmp.inf_level_ss += beyondRankEffect(7,3)
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
    if (tmp.inf_reached && hasTree('glx9')) {
        player.inf.theorem = player.inf.theorem.add(1)
        if (player.inf.theorem.eq(0)) {
            player.inf.points = player.inf.points.add(2)
            player.inf.total = player.inf.total.add(2)
        }
        else {
            player.inf.points = player.inf.points.add(tmp.IP_gain)
            player.inf.total = player.inf.total.add(tmp.IP_gain)
        }
    }
     if (!player.inf.reached && player.mass.gte(INF.req)) player.inf.reached=true
    if (hasElement(245) && (!CHALS.inChal(17))&& !(CHALS.inChal(18))) {
        let cs = tmp.c16.shardGain

        player.dark.c16.shard = player.dark.c16.shard.add(cs.mul(dt))
        player.dark.c16.totalS = player.dark.c16.totalS.add(cs.mul(dt))
    }
    if (hasInfUpgrade(4)) for (let x = 0; x < TREE_TYPES.qu.length; x++) TREE_UPGS.buy(TREE_TYPES.qu[x], true)
    if (hasInfUpgrade(6)) for (let x = 119; x <= 218; x++) buyElement(x,0)
player.inf.theorem_max = player.inf.theorem_max.max(tmp.core_lvl).floor()
player.inf.total = player.inf.total.max(player.inf.points)
if (FERMIONS.onActive('07')|| CHALS.inChal(19)||CHALS.inChal(20)) {
        player.inf.theorem_max = E(1)
    }
    power = Math.round(100+getPowerMult(tmp.core_lvl)*100)/100
    for (let i = 0; i < MAX_CORE_LENGTH; i++) if (player.inf.core[i] && hasElement(300)) {
     player.inf.core[i].power=power
    }
if (CHALS.inChal(17)|| CHALS.inChal(18)||CHALS.inChal(20)) {
player.inf.core[0].level = E(player.inf.theorem_max).floor()
player.inf.core[1].level = E(player.inf.theorem_max).floor()
 player.inf.core[2].level = E(player.inf.theorem_max).floor()
player.inf.core[3].level = E(player.inf.theorem_max).floor()
player.inf.core[4].level = E(player.inf.theorem_max).floor()
    player.inf.theorem_max = E(tmp.core_lvl)
}

if (hasElement(229) && player.inf.core[0].type == 'mass') player.inf.core[0].level = E(player.inf.theorem_max).floor()
if (hasElement(249) && player.inf.core[1].type == 'proto') player.inf.core[1].level = E(player.inf.theorem_max).floor()
if (hasElement(249) && player.inf.core[2].type == 'time') player.inf.core[2].level = E(player.inf.theorem_max).floor()
if (hasElement(260) && player.inf.core[3].type == 'atom') player.inf.core[3].level = E(player.inf.theorem_max).floor()
if (hasElement(260) && player.inf.core[4].type == 'bh') player.inf.core[4].level = E(player.inf.theorem_max).floor()
   if (!CHALS.inChal(19)&&(!CHALS.inChal(20))) { player.inf.dim_mass = player.inf.dim_mass.add(tmp.dim_mass_gain.mul(dt))
    player.inf.nm_base = player.inf.nm_base.add(tmp.nm_base_gain.mul(dt))
    player.inf.pm_base = player.inf.pm_base.add(tmp.pm_base_gain.mul(dt))
    player.inf.dm_base = player.inf.dm_base.add(tmp.dm_base_gain.mul(dt))
    player.inf.em_base = player.inf.em_base.add(tmp.em_base_gain.mul(dt))
    player.inf.hm_base = player.inf.hm_base.add(tmp.hm_base_gain.mul(dt))
   }
    if (hasInfUpgrade(20)) player.inf.points = player.inf.points.add(tmp.IP_gain.mul(dt).mul(infUpgEffect(20)))
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
                for (let i = 0; i < 6; i++) {
                    if (s[i] > 0) hh += "Meta-Score "+format(s[i],2)+" | "+ct.preEff[i]+` <b class='sky'>(${ct.effDesc[i](ctmp[i])})</b><br>`
                }
                if (hh != '') h += `<h2>${ct.title} <b>(${format(core_tmp[t].total_p*100,0)}%)</b></h2><br>`+hh+'<br>'
            }
            tmp.el.core_eff_div.setHTML(h||"Place any theorem in core to show effects!")
        }
        else if (tmp.stab[8] == 2) {
            tmp.el.ip_amt.setHTML(player.inf.points.format(0))

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
    let unlboost = hasOrbUpg(2)
    let nm_eff = tmp.nmEffect
    tmp.el.nm_scale.setTxt(getScalingName('nm'))
    tmp.el.nm_lvl.setTxt(format(player.inf.nm,0)+(nm_eff.bonus.gte(1)?" + "+format(nm_eff.bonus,0):""))
    tmp.el.nm_btn.setClasses({btn: true, locked: !INF.nm.can()})
    tmp.el.nm_cost.setTxt(format(tmp.nmCost,0))
    tmp.el.nm_step.setHTML(formatMult(nm_eff.step))
    tmp.el.nm_eff.setTxt(formatMult(nm_eff.eff))
    tmp.el.nm_base.setTxt(formatMass(player.inf.nm_base)+" "+player.inf.nm_base.formatGain(tmp.nm_base_gain,true))
    tmp.el.nm_base_boost.setHTML(formatMult(tmp.nm_base_boost)+(tmp.nm_base_boost.gte(1e60)?` <span class='soft'>(softcapped)</span>`:``))
    tmp.el.pm_base_boost.setHTML(formatMult(tmp.pm_base_boost)+(tmp.pm_base_boost.gte(1e45)?` <span class='soft'>(softcapped)</span>`:``))
    tmp.el.nm_base_eff.setHTML("+"+tmp.nm_base_eff.format()+(tmp.nm_base_eff.gte(tmp.nm_base_soft)?`<span class='soft'> (softcapped)`:'')+"</br><span class='infsoftcap_text'>Effect will be softcapped at "+format(tmp.nm_base_soft)+"</span>")
    tmp.el.nm_base_boost_div.setDisplay(unlboost);
    let unl = hasElement(256)
    tmp.el.pm_div.setDisplay(unl);
    tmp.el.pm_base_div.setDisplay(unl);
    tmp.el.pm_base_boost_div.setDisplay(unlboost);
    let pm_eff = tmp.pmEffect
    tmp.el.pm_scale.setTxt(getScalingName('nm'))
    tmp.el.pm_lvl.setTxt(format(player.inf.pm,0)+(pm_eff.bonus.gte(1)?" + "+format(pm_eff.bonus,0):""))
    tmp.el.pm_btn.setClasses({btn: true, locked: !INF.pm.can()})
    tmp.el.pm_cost.setTxt(format(tmp.pmCost,0))
    tmp.el.pm_step.setHTML(formatMult(pm_eff.step))
    tmp.el.pm_eff.setTxt(formatMult(pm_eff.eff))
    tmp.el.pm_base.setTxt(formatMass(player.inf.pm_base)+" "+player.inf.pm_base.formatGain(tmp.pm_base_gain,true))
    tmp.el.pm_base_eff.setHTML("x"+tmp.pm_base_eff.format())

    let unl2 = hasElement(261)
    tmp.el.dm_div.setDisplay(unl2);
    tmp.el.dm_base_div.setDisplay(unl2);
    let dm_eff = tmp.dmEffect
    tmp.el.dm_scale.setTxt(getScalingName('dm'))
    tmp.el.dm_lvl.setTxt(format(player.inf.dm,0)+(dm_eff.bonus.gte(1)?" + "+format(dm_eff.bonus,0):""))
    tmp.el.dm_btn.setClasses({btn: true, locked: !INF.dm.can()})
    tmp.el.dm_cost.setTxt(format(tmp.dmCost,0))
    tmp.el.dm_step.setHTML(formatMult(dm_eff.step))
    tmp.el.dm_eff.setTxt(formatMult(dm_eff.eff))
    tmp.el.dm_base.setTxt(formatMass(player.inf.dm_base)+" "+player.inf.dm_base.formatGain(tmp.dm_base_gain,true))
    tmp.el.dm_base_eff.setHTML("x"+tmp.dm_base_eff.format()+(tmp.dm_base_eff.gte(tmp.dm_base_soft)?"<span class='soft'>(softcapped)</span>":'')+"</br><span class='infsoftcap_text'>Effect will be softcapped at "+format(tmp.dm_base_soft)+"</span>")

    let unl3 = hasOrbUpg(4)
    tmp.el.em_div.setDisplay(unl3);
    tmp.el.em_base_div.setDisplay(unl3);
    let em_eff = tmp.emEffect
    tmp.el.em_scale.setTxt(getScalingName('dm'))
    tmp.el.em_lvl.setTxt(format(player.inf.em,0)+(em_eff.bonus.gte(1)?" + "+format(em_eff.bonus,0):""))
    tmp.el.em_btn.setClasses({btn: true, locked: !INF.em.can()})
    tmp.el.em_cost.setTxt(format(tmp.emCost,0))
    tmp.el.em_step.setHTML(formatMult(em_eff.step))
    tmp.el.em_eff.setTxt(formatMult(em_eff.eff))
    tmp.el.em_base.setTxt(formatMass(player.inf.em_base)+" "+player.inf.em_base.formatGain(tmp.em_base_gain,true))

    tmp.el.hm_div.setDisplay(unl3);
    tmp.el.hm_base_div.setDisplay(unl3);
    let hm_eff = tmp.emEffect
    tmp.el.hm_scale.setTxt(getScalingName('hm'))
    tmp.el.hm_lvl.setTxt(format(player.inf.hm,0)+(hm_eff.bonus.gte(1)?" + "+format(hm_eff.bonus,0):""))
    tmp.el.hm_btn.setClasses({btn: true, locked: !INF.hm.can()})
    tmp.el.hm_cost.setTxt(format(tmp.hmCost,0))
    tmp.el.hm_step.setHTML(formatMult(hm_eff.step))
    tmp.el.hm_eff.setTxt(formatMult(hm_eff.eff))
    tmp.el.hm_base.setTxt(formatMass(player.inf.hm_base)+" "+player.inf.hm_base.formatGain(tmp.hm_base_gain,true))

    tmp.el.dm_base_boost.setHTML(formatMult(tmp.dm_base_boost)+(tmp.dm_base_boost.gte(1e45)?` <span class='soft'>(softcapped)</span>`:``))
    tmp.el.em_base_boost.setHTML(formatMult(tmp.em_base_boost)+(tmp.em_base_boost.gte(1e45)?` <span class='soft'>(softcapped)</span>`:``))
    tmp.el.hm_base_boost.setHTML(formatMult(tmp.hm_base_boost)+(tmp.hm_base_boost.gte(1e45)?` <span class='soft'>(softcapped)</span>`:``))
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