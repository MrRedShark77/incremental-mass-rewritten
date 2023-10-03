var tmp = {}

function getTempData() {
    let d = new Date()
    let s = {
        tree_time: 0,

        preInfGlobalSpeed: E(1),

        cx: 0,
        cy: 0,

        mobile: false,

        start: false,

        tab: 0,
        stab: [0],
        tab_name: "mass",
        pass: 1,
        notify: [],
        popup: [],
        saving: 0,

        massFP: E(1),
        build: {},

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

		rp: {},
        upgs: { msg: [0,0] },

		bh: {},
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
        sn: {},

        qu: {
			speed: E(1),
            chroma_gain: [],
            chroma_eff: [],
            mil_reached: [],

			prim: {
				eff: [],
				w: [6,6,6,6,2,2,2,1],
			},
            qc: {
				tab: 0,
				ch: -1,
				eff: [],
			},
			en: {
				gain: {},
				eff: {},
				rewards: [],
				rewards_eff: [],
				reward_br: [],
			},
			rip: {},
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

        mass_glyph_msg: 0,
        glyph_upg_eff: [],

        scaling: {},
        scaling_power: {},
        scaling_start: {},
        scaling_qc8: [],
        no_scalings: {},

        c16: {},

        unstable_bh: {
            p: 1,
            fvm_eff: {},
        },

        ea: {
            amount: E(0),
            gain: [E(0),E(0)],
            eff: [[],[]],
        },

        prevSave: "",

        april: d.getDate() == 1 && d.getMonth() == 3,
        aprilEnabled: false,

        inf_reached: false,
        inf_time: 0,
        inf_limit: E(10).pow(Number.MAX_VALUE),
        iu_eff: [],

        core_chance: CORE_CHANCE_MIN,
        core_lvl: E(1),
        core_score: {},
        core_eff: {},
        fragment_eff: {},
        cs: { eff: {} },

        asc: {
            req: [],
            bulk: [],
            eff: [],
            baseExp: 1,
            base: E(1),
        },

        gp: {
            res_gain: [],
            res_effect: [],
        },
    }

    for (let x in BUILDINGS_DATA) s.build[x] = {
        bulk: E(0),
		total: E(0),
		bonus: E(0),
        effect: {},
    }

    for (let x = 0; x < PRES_LEN; x++) s.prestiges.eff[x] = {}
    for (let x = 0; x < ASCENSIONS.names.length; x++) s.asc.eff[x] = {}
    for (let x in BEYOND_RANKS.rewardEff) s.beyond_ranks.eff[x] = {}
    for (let x = 1; x <= UPGS.main.cols; x++) s.upgs[x] = {}
    for (let x = 0; x < TABS[1].length; x++) s.stab.push(0)
    for (let x = 0; x < SCALE_TYPE.length; x++) {
        let st = SCALE_TYPE[x]

        s.scaling_power[st] = {}
        s.scaling_start[st] = {}
        s.no_scalings[st] = []
    }
    for (let x = 0; x < MATTERS_LEN; x++) s.matters.upg[x] = {} 
    for (let i in CORE) {
        s.core_score[i] = [0,0,0,0]
        s.core_eff[i] = []
    }

    return s
}

function resetTemp() {
    tmp = deepUndefinedAndDecimal({
		el: tmp.el,
		prevSave: tmp.prevSave,
		start: tmp.start,
		pass: 5,
	}, getTempData())
}

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
    if (EVO.amt >= 1) return
    tmp.tickspeedFP = hasCharger(4) && !hasElement(17,1) ? 1 : fermEff(1, 2)
}

function updateUpgradesTemp() {
    tmp.massFP = E(1);
    if (hasElement(248) && EVO.amt < 2) tmp.massFP = tmp.massFP.mul(getEnRewardEff(0))
    
    UPGS.main.temp()
}

function updateRagePowerTemp() {
    if (!tmp.rp) tmp.rp = {}
    tmp.rp.unl = EVO.amt < 1 && player.rp.unl
    tmp.rp.gain = FORMS.rp.gain()
    tmp.rp.can = tmp.rp.gain.gte(1)
}

function updateBlackHoleTemp() {
    let t = tmp.bh = {}
    t.dm_gain = FORMS.bh.DM_gain()
    t.dm_can = t.dm_gain.gte(1)
    t.unl = player.bh?.unl

	if (!t.unl) return
    t.massSoftGain = FORMS.bh.massSoftGain()
    t.massPowerGain = FORMS.bh.massPowerGain()
    t.fSoftStart = FORMS.bh.fSoftStart() 
    t.fSoftPower = FORMS.bh.fSoftPower()
    t.formula = FORMS.bh.formula()
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

    const evo = EVO.amt

    tmp.offlineActive = player.offline.time > 1
    tmp.offlineMult = tmp.offlineActive?player.offline.time+1:1

    OURO.temp()

    tmp.passive = (evo>=5?true:hasElement(24))?3:
		(evo>=3?FORMS.bh.unl():hasUpgrade("atom",6))?2:
		(evo>=2?FORMS.rp.unl():hasUpgrade("bh",6)||hasUpgrade("atom",6))?1:0

    tmp.c16.in = CHALS.inChal(16)
    tmp.c18active = CHALS.inChal(18)

    tmp.chal13comp = player.chal.comps[13].gte(1)
    tmp.chal14comp = player.chal.comps[14].gte(1)
    tmp.chal15comp = player.chal.comps[15].gte(1)
    tmp.darkRunUnlocked = hasElement(161)
    tmp.matterUnl = hasElement(188)
    tmp.moreUpgs = hasElement(192)
    tmp.mass4Unl = hasElement(202)
    tmp.brUnl = hasElement(208)
    tmp.epUnl = hasCharger(5) && EVO.amt >= 3
    tmp.brokenInf = hasInfUpgrade(16)
    tmp.tfUnl = hasElement(230)
    tmp.c18reward = player.chal.comps[18].gte(4)
    tmp.fifthRowUnl = hasElement(270)

    tmp.NHDimprove = hasElement(268)

    updateInfTemp()
    updateC16Temp()
    updateDarkTemp()
    updateQuantumTemp()
    updateSupernovaTemp()

    updateElementsTemp()
    updateAtomTemp()
    updateUpgradesTemp()
    updateChalTemp()
    BUILDINGS.temp()

    updateScalingTemp()
    updateRagePowerTemp()
    updateBlackHoleTemp()
    updateTickspeedTemp()
    updateRanksTemp()
    updateMassTemp()

    tmp.preInfGlobalSpeed = FORMS.getPreInfGlobalSpeed()
    tmp.qu.speed = FORMS.getPreQUGlobalSpeed()
}