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
        stab: [0],
        tab_name: "mass",
        qc_tab: 0,
        qc_ch: -1,
        pass: 1,
        notify: [],
        popup: [],
        saving: 0,
        rank_tab: 0,

        scaling_qc8: [],

        prestiges: {
            req: [],
            bulk: [],
            eff: [],
            baseExp: E(1),
            base: E(1),
        },

        beyond_ranks: {
            max_tier: E(1),
            tier_power: 0.8,
            eff: {},
        },

        bd: {
            upgs: [],
        },

        upgs: {},

		atom: {},
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
            tree_loc: {},
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

        overflowBefore: {
            dm: E(0),
            mass: E(0),
            bh: E(0),
            quark: E(0),
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

        rank_collapse: { start: E('1e14'), power: E(2), reduction: E(1) },

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

        april: d.getDate() == 1 && d.getMonth() == 3,
        aprilEnabled: false,

        inf_reached: false,
        inf_time: 0,
        inf_limit: Decimal.pow(10,Number.MAX_VALUE),

        core_chance: CORE_CHANCE_MIN,
        core_lvl: E(1),
        core_score: {},
        core_eff: {},
        fragment_eff: {},

        iu_eff: [],

        ascensions: {
            req: [],
            bulk: [],
            eff: [],
            baseExp: 1,
            base: E(1),
        },

        cs_effect: {},

        gp: {
            res_gain: [],
            res_effect: [],
        },

        massFP: E(1),

        build: {},

        ouro: {},
    }

    for (let x in BUILDINGS_DATA) tmp.build[x] = {
        bulk: E(0),
		total: E(0),
		bonus: E(0),
        effect: {},
    }

    for (let x = 0; x < PRES_LEN; x++) tmp.prestiges.eff[x] = {}
    for (let x = 0; x < ASCENSIONS.names.length; x++) tmp.ascensions.eff[x] = {}
    for (let x in BEYOND_RANKS.rewardEff) tmp.beyond_ranks.eff[x] = {}
    for (let x = 1; x <= UPGS.main.cols; x++) tmp.upgs[x] = {}
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
    if (OURO.evo >= 1) return
    tmp.tickspeedFP = hasCharger(4) && !hasElement(17,1) ? 1 : tmp.fermions.effs[1][2]
}

function updateUpgradesTemp() {
    tmp.massFP = E(1);
    if (hasElement(248) && OURO.evo < 2) tmp.massFP = tmp.massFP.mul(getEnRewardEff(0))
    
    UPGS.main.temp()
}

function updateRagePowerTemp() {
    if (!tmp.rp) tmp.rp = {}
    tmp.rp.gain = FORMS.rp.gain()
    tmp.rp.can = tmp.rp.gain.gte(1)
}

function updateBlackHoleTemp() {
    let t = tmp.bh = {}
    t.dm_gain = FORMS.bh.DM_gain()
    t.dm_can = t.dm_gain.gte(1)
    t.unl = player.bh.unl && OURO.evo < 2

	if (!t.unl) return
    t.fSoftStart = FORMS.bh.fSoftStart()
    t.fSoftPower = FORMS.bh.fSoftPower()
    t.f = FORMS.bh.f()
    t.massSoftPower = FORMS.bh.massSoftPower()
    t.massSoftGain = FORMS.bh.massSoftGain()
    t.massPowerGain = FORMS.bh.massPowerGain()
    t.mass_gain = FORMS.bh.massGain()
    t.effect = FORMS.bh.effect()

    // Unstable
    t = tmp.unstable_bh
    
    t.p = E(1)
    if (tmp.inf_unl) t.p = t.p.div(theoremEff('bh',2))
    if (hasUpgrade('bh',23)) t.p = t.p.div(.75)

    t.gain = UNSTABLE_BH.gain()
    t.effect = UNSTABLE_BH.effect()
}

function updateTemp() {
    updateTabTemp()

    const evo = OURO.evo

    tmp.offlineActive = player.offline.time > 1
    tmp.offlineMult = tmp.offlineActive?player.offline.time+1:1

    OURO.temp()

    tmp.passive = (evo>=3?player.bh.unl:hasUpgrade("atom",6))?2:
		(evo>=2?player.rp.unl:hasUpgrade("bh",6)||hasUpgrade("atom",6))?1:0

    tmp.c16active = CHALS.inChal(16)
    tmp.c18active = CHALS.inChal(18)

    tmp.chal13comp = player.chal.comps[13].gte(1)
    tmp.chal14comp = player.chal.comps[14].gte(1)
    tmp.chal15comp = player.chal.comps[15].gte(1)
    tmp.darkRunUnlocked = hasElement(161)
    tmp.matterUnl = hasElement(188)
    tmp.moreUpgs = hasElement(192)
    tmp.mass4Unl = hasElement(202)
    tmp.brUnl = hasElement(208)
    tmp.eaUnl = hasCharger(5) && OURO.evo < 3
    tmp.brokenInf = hasInfUpgrade(16)
    tmp.tfUnl = hasElement(230)
    tmp.ascensions_unl = player.chal.comps[17].gte(4)
    tmp.CS_unl = hasElement(251)
    tmp.c18reward = player.chal.comps[18].gte(4)
    tmp.fifthRowUnl = hasElement(270)

    tmp.SN_passive = hasElement(36,1)

    tmp.NHDimprove = hasElement(268)

    updateInfTemp()
    updateC16Temp()
    updateDarkTemp()
    updateQuantumTemp()

    updateRadiationTemp()
    updateFermionsTemp()
    updateBosonsTemp()
    updateSupernovaTemp()

    updateElementsTemp()
    updateMDTemp()
    updateUpgradesTemp()
    updateChalTemp()
    updateAtomTemp()
    BUILDINGS.temp()

    updateStarsTemp()
    updateScalingTemp()
    updateRagePowerTemp()
    updateBlackHoleTemp()
    updateTickspeedTemp()
    updateRanksTemp()
    updateMassTemp()

    tmp.preInfGlobalSpeed = FORMS.getPreInfGlobalSpeed()
    tmp.preQUGlobalSpeed = FORMS.getPreQUGlobalSpeed()
}