var tmp = {}

function resetTemp() {
    let d = new Date()
    keep = [tmp.el, tmp.prevSave]
    tmp = {
        tree_time: 0,

        preQUGlobalSpeed: E(1),
        preInfGlobalSpeed: E(1),

        cx: 0,
        cy: 0,

        mobile: false,

        start: false,

        sn_tab: 0,
        tree_tab: 0,
        tab: 0,
        stab: [],
        qc_tab: 0,
        qc_ch: -1,
        pass: 0,
        notify: [],
        popup: [],
        saving: 0,
        rank_tab: 0,

        scaling_qc8: [],

        prestiges: {
            req: [],
            bulk: [],
            eff: [],
            baseExp: 1,
            base: E(1),
        },

        beyond_ranks: {
            max_tier: 1,
            tier_power: 0.8,
            eff: {},
        },
        beyond_pres: {
            max_tier: 1,
            tier_power: 0.8,
            eff: {},
        },

        bd: {
            upgs: [],
        },

        upgs: {
            main: {},
            mass: {},
        },

        elements: {
            choosed: 0,
            effect: [null],
            mu_effect: [null],
            cannot: [],
            deCorrupt: [],
            ts: 0,
            te: 118,
            tt: 118,

            max_tier: [1,1],
            unl_length: [0,0],
        },
    
        fermions: {
            ch: [0,0],
            gains: [E(0),E(0)],
            maxTier: [[],[]],
            tiers: [[],[]],
            effs:  [[],[]],
            bonuses: [[],[]],
        },
    
        supernova: {
            time: 0,
            tree_choosed: "",
            tree_had: [],
            tree_had2: [],
            auto_tree: [],
            tree_eff: {},
            tree_unlocked: {},
            tree_afford: {},
            tree_afford2: [],
        },
        galaxy: {
            maxlimit: E('1e100')
        },
        radiation: {
            unl: false,
            ds_gain: [],
            ds_eff: [],
            bs: {
                sum: [],
                lvl: [],
                bonus_lvl: [],
                cost: [],
                bulk: [],
                eff: [],
            },
        },

        qu: {
            chroma_gain: [],
            chroma_eff: [],
            mil_reached: [],
            qc_eff: [],
        },

        prim: {
            eff: [],
            w: [6,6,6,6,2,2,2,1],
        },

        en: {
            gain: {},
            eff: {},
            rewards: [],
            rewards_eff: [],
            reward_br: [],
        },

        rip: {
            
        },

        dark: {
            shadowEff: {},
            rayEff: {},
            abEff: {},
            mass_glyph_eff: [],
            mass_glyph_gain: [],
            mg_passive: [],
        },

        matters: {
            gain: [],
            upg: [],
            exponent: 2,
            FSS_eff: [1,1],
        },

        overflow: {
            mass: E(1),
            dm: E(1),
            bh: E(1),
            star: E(1),
            atomic: E(1),
            quark: E(1),
            stronger: E(1),
        },
        tetraflow: {
            mass: E(1),
            dm: E(1),
            bh: E(1),
            star: E(1),
            atomic: E(1),
            quark: E(1),
            stronger: E(1),
        },
        overflowBefore: {
            dm: E(0),
            mass: E(0),
            bh: E(0),
            quark: E(0),
        },
        tetraflowBefore: {
            mass: E(0),
        },
        overflow_start: {
            dm: E('ee30'),
            mass: E('ee69'),
            bh: E('ee69'),
            quark: E('ee90'),
            atomic: E('ee82'),
            stronger: E('e115')
        },

        overflow_power: {
            mass: E(.5),
            bh: E(0.5),
            stronger: E(.5),
        },
        tetraflow_start: {
            mass: E('ee1400'),
        },

        tetraflow_power: {
            mass: E(.5),
        },
        mass_glyph_msg: 0,

        glyph_upg_eff: [],

        scaling: {},

        scaling_power: {},
        scaling_start: {},

        no_scalings: {},

        c16: {
            shardGain: E(0),
        },

        unstable_bh: {
            p: 1,
            fvm_eff: {},
        },

        exotic_atom: {
            amount: E(0),
            gain: [E(0),E(0)],
            eff: [[],[]],
        },

        prevSave: "",
        ascensions: {
            req: [],
            bulk: [],
            eff: new Array(ASCENSIONS.names.length).fill({}),
            baseExp: 1,
            base: E(1),
        },
        april: d.getDate() == 1 && d.getMonth() == 3,
        aprilEnabled: false,

        inf_reached: false,
        inf_time: 0,
        inf_limit: Decimal.pow(10,Number.MAX_VALUE),

        inf_unl: false,

        core_chance: CORE_CHANCE_MIN,
        core_lvl: 1,
        core_score: {},
        core_eff: {},

        iu_eff: [],
    }
    for (let x = 0; x < PRES_LEN; x++) tmp.prestiges.eff[x] = {}
    for (let x in BEYOND_RANKS.rewardEff) tmp.beyond_ranks.eff[x] = {}
    for (let x in BEYOND_PRES.rewardEff) tmp.beyond_pres.eff[x] = {}
    for (let x = UPGS.mass.cols; x >= 1; x--) tmp.upgs.mass[x] = {}
    for (let x = 1; x <= UPGS.main.cols; x++) tmp.upgs.main[x] = {}
    for (let j = 0; j < TREE_TAB.length; j++) {
        tmp.supernova.tree_had2[j] = []
        tmp.supernova.tree_afford2[j] = []
    }
    for (let x = 0; x < TABS[1].length; x++) tmp.stab.push(0)
    for (let i = 0; i < TREE_IDS.length; i++) {
        for (let j = 0; j < TREE_TAB.length; j++) {
            for (let k = 0; k < TREE_IDS[i][j].length; k++) {
                let id = TREE_IDS[i][j][k]
                if (id != "") {
                    let u = TREE_UPGS.ids[id]
                    tmp.supernova.tree_had2[j].push(id)
                    tmp.supernova.tree_had.push(id)
                    // if (u && !u.qf && !u.cs) tmp.supernova.auto_tree.push(id)
                }
            }
        }
    }
    for (let x = 0; x < MASS_DILATION.break.upgs.ids.length; x++) tmp.bd.upgs[x] = {}
    for (let x = 0; x < SCALE_TYPE.length; x++) {
        let st = SCALE_TYPE[x]

        tmp.scaling_power[st] = {}
        tmp.scaling_start[st] = {}
        tmp.no_scalings[st] = []
    }
    for (let x = 0; x < MATTERS_LEN; x++) tmp.matters.upg[x] = {} 
    for (let i in CORE) {
        tmp.core_score[i] = [0,0,0,0]
        tmp.core_eff[i] = []
    }
    tmp.el = keep[0]
    tmp.prevSave = keep[1]
}

resetTemp()

function updateMassTemp() {
    tmp.massSoftPower = FORMS.massSoftPower()
    tmp.massSoftGain = FORMS.massSoftGain()
    tmp.massSoftPower2 = FORMS.massSoftPower2()
    tmp.massSoftGain2 = FORMS.massSoftGain2()
    tmp.massSoftPower3 = FORMS.massSoftPower3()
    tmp.massSoftGain3 = FORMS.massSoftGain3()
    tmp.massSoftPower4 = FORMS.massSoftPower4()
    tmp.massSoftGain4 = FORMS.massSoftGain4()
    tmp.massSoftPower5 = FORMS.massSoftPower5()
    tmp.massSoftGain5 = FORMS.massSoftGain5()
    tmp.massSoftPower6 = FORMS.massSoftPower6()
    tmp.massSoftGain6 = FORMS.massSoftGain6()
    tmp.massSoftPower7 = FORMS.massSoftPower7()
    tmp.massSoftGain7 = FORMS.massSoftGain7()
    tmp.massSoftPower8 = FORMS.massSoftPower8()
    tmp.massSoftGain8 = FORMS.massSoftGain8()
    tmp.massGain = FORMS.massGain()
}

function updateTickspeedTemp() {
    tmp.tickspeedFP = hasCharger(4) && !hasElement(17,1) ? 1 : tmp.fermions.effs[1][2]
    tmp.tickspeedCost = E(2).pow(player.tickspeed.scaleEvery('tickspeed')).floor()
    tmp.tickspeedBulk = E(0)
    if (player.rp.points.gte(1)) tmp.tickspeedBulk = player.rp.points.max(1).log(2).scaleEvery('tickspeed',true).add(1).floor()
    tmp.tickspeedEffect = FORMS.tickspeed.effect()
}

function updateAcceleratorTemp() {
    tmp.accelCost = Decimal.pow(10,Decimal.pow(1.5,player.accelerator)).floor()
    tmp.accelBulk = E(0)
    if (player.rp.points.gte(10)) tmp.accelBulk = player.rp.points.max(1).log10().max(1).log(1.5).add(1).floor()
    tmp.accelEffect = FORMS.accel.effect()
}

function updateUpgradesTemp() {
    UPGS.main.temp()
    UPGS.mass.temp()
}

function updateRagePowerTemp() {
    if (!tmp.rp) tmp.rp = {}
    tmp.rp.gain = FORMS.rp.gain()
    tmp.rp.can = tmp.rp.gain.gte(1)
}

function updateBlackHoleTemp() {
    if (!tmp.bh) tmp.bh = {}
    let t = tmp.bh
    t.dm_gain = FORMS.bh.DM_gain()
    t.fSoftStart = FORMS.bh.fSoftStart()
    t.fSoftPower = FORMS.bh.fSoftPower()
    t.f = FORMS.bh.f()
    t.massSoftPower = FORMS.bh.massSoftPower()
    t.massSoftGain = FORMS.bh.massSoftGain()
    t.massPowerGain = FORMS.bh.massPowerGain()
    t.mass_gain = FORMS.bh.massGain()
    t.dm_can = t.dm_gain.gte(1)
    t.effect = FORMS.bh.effect()

    let fp = hasCharger(6) ? 1 : tmp.fermions.effs[1][5]
    if (hasCharger(6) && tmp.c16active) fp *= 1e6

    t.condenser_bonus = FORMS.bh.condenser.bonus()
    t.condenser_cost = E(1.75).pow(player.bh.condenser.scaleEvery('bh_condenser',false,[1,1,1,fp])).floor()
    t.condenser_bulk = E(0)
    if (player.bh.dm.gte(1)) t.condenser_bulk = player.bh.dm.max(1).log(1.75).scaleEvery('bh_condenser',true,[1,1,1,fp]).add(1).floor()
    t.condenser_eff = FORMS.bh.condenser.effect()

    // Unstable

    t = tmp.unstable_bh
    
    t.p = 1
    if (tmp.inf_unl) t.p /= theoremEff('bh',2)

    let p = 1.5
    if (hasBeyondRank(1,137)) p **= 0.8

    t.gain = UNSTABLE_BH.gain()
    t.effect = UNSTABLE_BH.effect()

    t.fvm_cost = E(10).pow(player.bh.fvm.pow(p)).mul(1e300).floor()
    t.fvm_bulk = E(0)
    if (player.bh.dm.gte(10)) t.fvm_bulk = player.bh.dm.div(1e300).max(1).log(10).root(p).add(1).floor()
    t.fvm_eff = UNSTABLE_BH.fvm.effect()
}

function updateTemp() {
    tmp.offlineActive = player.offline.time > 1
    tmp.offlineMult = tmp.offlineActive?player.offline.time+1:1

    tmp.c16active = CHALS.inChal(16)

    tmp.inf_unl = player.inf.theorem.gte(1)

    tmp.chal13comp = player.chal.comps[13].gte(1)
    tmp.chal14comp = player.chal.comps[14].gte(1)
    tmp.chal15comp = player.chal.comps[15].gte(1)
    tmp.darkRunUnlocked = hasElement(161)
    tmp.matterUnl = hasElement(188)
    tmp.moreUpgs = hasElement(192)
    tmp.mass4Unl = hasElement(202)
    tmp.brUnl = hasElement(208)
    tmp.eaUnl = hasCharger(5)
    tmp.brokenInf = hasInfUpgrade(16)
    tmp.ascensions_unl = hasElement(281)
    tmp.bpUnl = hasElement(294)
    updateOrbTemp()
    updateInfTemp()
    updateC16Temp()
    updateDarkTemp()
    updateQuantumTemp()
    updateGalaxiesTemp()

    updateRadiationTemp()
    updateFermionsTemp()
    updateBosonsTemp()
    updateSupernovaTemp()

    updateElementsTemp()
    updateMDTemp()
    updateStarsTemp()
    updateUpgradesTemp()
    updateScalingTemp()
    updateChalTemp()
    updateAtomTemp()
    updateRagePowerTemp()
    updateBlackHoleTemp()
    updateAcceleratorTemp()
    updateTickspeedTemp()
    updateRanksTemp()
    updateMassTemp()

    tmp.preInfGlobalSpeed = FORMS.getPreInfGlobalSpeed()
    tmp.preQUGlobalSpeed = FORMS.getPreQUGlobalSpeed()
}