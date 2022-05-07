var tmp = {}

function resetTemp() {
    keep = [tmp.el, tmp.prevSave]
    tmp = {
        tree_time: 0,

        cx: 0,
        cy: 0,

        sn_tab: 0,
        tree_tab: 0,
        tab: 0,
        stab: [],
        qc_tab: 0,
        qc_ch: -1,
        pass: true,
        notify: [],
        popup: [],
        saving: 0,
    
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
        },

        en: {
            gain: {},
            eff: {},
            rewards: [],
            rewards_eff: [],
        },

        prevSave: "",
    }
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
                    tmp.supernova.tree_had2[j].push(id)
                    tmp.supernova.tree_had.push(id)
                    if (!TREE_UPGS.ids[id].qf) tmp.supernova.auto_tree.push(id)
                }
            }
        }
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
    tmp.massGain = FORMS.massGain()
}

function updateTickspeedTemp() {
    tmp.tickspeedFP = tmp.fermions.effs[1][2]
    tmp.tickspeedCost = E(2).pow(player.tickspeed.scaleEvery('tickspeed')).floor()
    tmp.tickspeedBulk = E(0)
    if (player.rp.points.gte(1)) tmp.tickspeedBulk = player.rp.points.max(1).log(2).scaleEvery('tickspeed',true).add(1).floor()
    tmp.tickspeedEffect = FORMS.tickspeed.effect()
}

function updateUpgradesTemp() {
    if (!tmp.upgs) tmp.upgs = {}
    UPGS.mass.temp()
    UPGS.main.temp()
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

    let fp = tmp.fermions.effs[1][5]

    t.condenser_bonus = FORMS.bh.condenser.bonus()
    t.condenser_cost = E(1.75).pow(player.bh.condenser.scaleEvery('bh_condenser',false,[1,1,1,fp])).floor()
    t.condenser_bulk = E(0)
    if (player.bh.dm.gte(1)) t.condenser_bulk = player.bh.dm.max(1).log(1.75).scaleEvery('bh_condenser',true,[1,1,1,fp]).add(1).floor()
    t.condenser_eff = FORMS.bh.condenser.effect()
}

function updateTemp() {
    tmp.offlineActive = player.offline.time > 1
    tmp.offlineMult = tmp.offlineActive?player.offline.time+1:1

    updateQuantumTemp()

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
    updateTickspeedTemp()
    updateRanksTemp()
    updateMassTemp()

    tmp.preQUGlobalSpeed = FORMS.getPreQUGlobalSpeed()
}