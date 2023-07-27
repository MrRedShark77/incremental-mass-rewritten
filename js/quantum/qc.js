const QCs = {
    active() { return player.qu.qc.active || player.qu.rip.active || CHALS.inChal(14) || CHALS.inChal(18)|| CHALS.inChal(15) || CHALS.inChal(20) || tmp.c16active || player.dark.run.active },
    getMod(x) { return CHALS.inChal(20)?[95,75,95,95,50,95,95,75][x]:CHALS.inChal(15) || CHALS.inChal(18)? [10,5,10,10,10,10,10,10][x] : tmp.c16active || player.dark.run.active ? 8 : CHALS.inChal(14) ? 5 : player.qu.rip.active ? BIG_RIP_QC[x] : player.qu.qc.mods[x] },
    incMod(x,i) { if (!this.active()) player.qu.qc.mods[x] = Math.min(Math.max(player.qu.qc.mods[x]+i,0),tmp.qu.qc_max)},
    enter() {
        if (!player.qu.qc.active) {
            let is_zero = true
            for (let x = 0; x < QCs_len; x++) if (this.getMod(x)>0) {
                is_zero = false
                break
            }
            if (is_zero) return
        }
        if (player.qu.qc.active) CONFIRMS_FUNCTION.enterQC()
        else createConfirm("Are you sure to enter the Quantum Challenge? Entering it will force reset!",'qc',CONFIRMS_FUNCTION.enterQC)
    },
    GetMaxModifications() {
        let x = E(10)
        if (hasElement(36,1)) x = x.add(muElemEff(36))
        return x
    },
    names: ["Black Dwarf","Time Anomaly","Hypertiered","Melted Interactions","Intense Catalyst","Ex-Challenge","Spatial Dilation","Extreme Scaling"],
    ctn: [
        {
            eff(i) {
                return [E(1-0.03*i).max(0),2/(i+2)]
            },
            effDesc(x) { return `<b>^${format(x[0])}</b> to exponent of all-star resources.<br><b>^${format(x[1])}</b> to strength of star generators.` },
        },{
            eff(i) {
                if(i>=35)return E(2).pow(i**5/5000)
				if(i>=11)return E(2).pow(i**5/1000)
                let x = E(2).pow(i**2)
                return x
            },
            effDesc(x) { return `<b>/${format(x,0)}</b> to pre-Quantum global speed.` },
        },{
            eff(i) {
                if(i>=11)return i**3.5*0.15+1
                let x = i**1.5*0.15+1
                return x
            },
            effDesc(x) { return `<b>x${format(x)}</b> to requirements of any Fermions.` },
        },{
            eff(i) {
                if(i>=51)return 0.9**(i**6.25/8000)
				if(i>=11)return 0.9**(i**3.25/100)
                let x = E(0.9**(i**1.25))
                return x.max(0)
            },
            effDesc(x) { return `<b>^${format(x)}</b> to multiplier from Bosonic & Radiation resources.` },
        },{
            eff(i) {
                if(i>=51)return 0.8**(i**2.5/100)
				if(i>=11)return 0.8**(i**2/100)
                let x = E(0.8**(i**1.25))
                return x.max(0)
            },
            effDesc(x) { return `<b>^${format(x)}</b> to multiplier from pre-Supernova resources, except all star resources.` },
        },{
            eff(i) {
                if(i>=11)return Math.min(1.2**(i**1.5/10),1e300)
                let x = 1.2**i
                return x
            },
            effDesc(x) { return `<b>x${format(x)}</b> to requirements of any pre-Quantum Challenge.` },
        },{
            eff(i) {
                if (hasElement(163)) i /= 2
                if(i>=11)return i**4.5/2000+1
                let x = i**1.5/2+1
                return x
            },
            effDesc(x) { return `<b>^${format(x)}</b> to Mass Dilation’s penalty.` },
        },{
            eff(i) {
                if (hasElement(98) && player.qu.rip.active) i *= 0.8
                if(i>=17)return [0.49,i**3/5000+1]
				if(i>=11)return [0.49,i**2/1000+1]
                let x = [1-0.05*i,i/10+1]
                return x
            },
            effDesc(x) { return `<b>^${format(x[0])}</b> to starting of pre-Quantum scaling.<br><b>${format(x[1]*100)}%</b> to strength of pre-Quantum scaling.` },
        },
    ],
}

const QCs_len = 8

function addQCPresetAs() {
    if (player.qu.qc.presets.length >= 5) {
        addNotify("You cannot add QC Preset because of maxmium length of presets")
        return
    }

    let copied_mods = []
    for (let x = 0; x < QCs_len; x++) copied_mods.push(player.qu.qc.mods[x])
    player.qu.qc.presets.push({
        p_name: "New Preset",
        mods: copied_mods,
    })
    updateQCModPresets()
}

function saveQCPreset(x) {
    let copied_mods = []
    for (let x = 0; x < QCs_len; x++) copied_mods.push(player.qu.qc.mods[x])
    player.qu.qc.presets[x].mods = copied_mods
    addNotify("Preset Saved")
    updateQCModPresets()
}

function loadQCPreset(x) {
    if (QCs.active()) return
    player.qu.qc.mods = player.qu.qc.presets[x].mods
    addNotify("Preset Loaded to Modifiers")
    updateQCModPresets()
}

function renameQCPreset(x) {
    createPrompt("Input the preset name",'renamePreset',renamed=>{
        player.qu.qc.presets[x].p_name = renamed
        addNotify("Preset Renamed")
        updateQCModPresets()
    })
}

function deleteQCPreset(x) {
    createConfirm("Are you sure you want to delete the preset?",'removePreset',()=>{
        let represets = []
        for (let y = 0; y < player.qu.qc.presets.length; y++) if (x != y) represets.push(player.qu.qc.presets[y])
        player.qu.qc.presets = represets
        addNotify("Preset Deleted")

        updateQCModPresets()
    })
}

function setupQCHTML() {
    let new_table = new Element("QC_table")
	let table = ""
	for (let x = 0; x < QCs_len; x++) {
        table += `
        <div style="margin: 5px;">
        <div style="margin: 5px" id='qc_tooltip${x}' class="tooltip" tooltip-html="${QCs.names[x]}"><img style="cursor: pointer" src="images/qcm${x}.png"></div>
        <div><span id="qcm_mod${x}">0</span>/<span id='qcm_max${x}'>0</spam></div>
        <div id="qcm_btns${x}"><button onclick="QCs.incMod(${x},-1)">-</button><button onclick="QCs.incMod(${x},1)">+</button></div>
        </div>
        `
    }
	new_table.setHTML(table)
}

function updateQCModPresets() {
    let table = ""
    for (let x = 0; x < player.qu.qc.presets.length; x++) {
        let p = player.qu.qc.presets[x]
        table += `
        <div class="table_center" style="align-items: center;">
        <div style="margin: 5px; width: 150px; text-align: left">${p.p_name}</div>
        <div style="margin: 5px; width: 500px" class="table_center">
        `
        for (let y = 0; y < QCs_len; y++) {
            table += `
            <div style="margin: 5px; align-items: center;" class="table_center">
            <div style="margin-right: 3px; width: 20px; text-align: right;">${p.mods[y]}</div><div class="tooltip" tooltip-html="${QCs.names[y]}"><img style="width: 25px; height: 25px" src="images/qcm${y}.png"></div>
            </div>
            `
        }
        table += `</div>
        <div style="margin: 5px">
        <button class="btn" onclick="saveQCPreset(${x})">Save</button>
        <button class="btn" onclick="loadQCPreset(${x})">Load</button>
        <button class="btn" onclick="renameQCPreset(${x})">Rename</button>
        <button class="btn" onclick="deleteQCPreset(${x})">Delete</button>
        </div>
        </div>`
    }
    tmp.el.QC_Presets_table.setHTML(table)
    setupTooltips()
}
function updateQCTemp() {
    tmp.qu.qc_s_b = E(2)
    if (hasTree("qf4")) tmp.qu.qc_s_b = tmp.qu.qc_s_b.add(.5)
    if (hasPrestige(0,2)) tmp.qu.qc_s_b = tmp.qu.qc_s_b.add(.5)
    if (hasTree("qc3")) tmp.qu.qc_s_b = tmp.qu.qc_s_b.add(treeEff('qc3',0))
    if (hasElement(146)) tmp.qu.qc_s_b = tmp.qu.qc_s_b.add(elemEffect(146,0))

    if (hasElement(226)) tmp.qu.qc_s_b = tmp.qu.qc_s_b.pow(elemEffect(226))
    if (hasElement(35,1))tmp.qu.qc_s_b = tmp.qu.qc_s_b.mul(muElemEff(35))
    tmp.qu.qc_s_b = tmp.qu.qc_s_b.mul(exoticAEff(0,6))

    let weak = 1
    if (tmp.inf_unl) weak *= theoremEff('proto',3)

    tmp.qu.qc_s_eff = tmp.qu.qc_s_b.pow(player.qu.qc.shard)

    let s = 0
    let bs = 0
    for (let x = 0; x < QCs_len; x++) {
        let m = QCs.getMod(x)
        s += m
        tmp.qu.qc_eff[x] = QCs.ctn[x].eff(m*weak)
        if (hasTree('qc2') && m >= 10) bs++
    }
    tmp.qu.qc_s = s
    tmp.qu.qc_s_bouns = bs
    tmp.qu.qc_max = QCs.GetMaxModifications()
}

function updateQCHTML() {
    tmp.el.qc_shard.setTxt(player.qu.qc.shard+(tmp.qu.qc_s+tmp.qu.qc_s_bouns!=player.qu.qc.shard?(` (${tmp.qu.qc_s+tmp.qu.qc_s_bouns>=player.qu.qc.shard?"+":""}${tmp.qu.qc_s+tmp.qu.qc_s_bouns-player.qu.qc.shard})`):""))
    tmp.el.qc_shard_b.setTxt(tmp.qu.qc_s_b.format(1))
    tmp.el.qc_shard_eff.setTxt(tmp.qu.qc_s_eff.format(1))

    for (let x = 0; x < 2; x++) {
        tmp.el["qc_tab"+x].setDisplay(tmp.qc_tab == x)
    }
    if (tmp.qc_tab == 0) {
        tmp.el.qc_btn.setDisplay(!(player.qu.rip.active || tmp.c16active || player.dark.run.active))
        tmp.el.qc_btn.setTxt((QCs.active()?"Exit":"Enter") + " the Quantum Challenge")
        for (let x = 0; x < QCs_len; x++) {
            tmp.el["qcm_mod"+x].setTxt(QCs.getMod(x))
            tmp.el["qcm_btns"+x].setDisplay(!QCs.active())
            tmp.el["qcm_max"+x].setTxt(tmp.qu.qc_max)
            tmp.el['qc_tooltip'+x].setTooltip(
                `
                <h3>${QCs.names[x]}</h3>
                <br class='line'>
                ${QCs.ctn[x].effDesc(tmp.qu.qc_eff[x])}
                `
            )
        }
    }
}