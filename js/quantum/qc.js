const QCs = {
    active() { return tmp.qu.qc.force != undefined || player.qu.qc.active },
    getMod(x) { return (tmp.qu.qc.force || player.qu.qc.mods)[x] || 0 },
    incMod(x,i) { if (!this.active()) player.qu.qc.mods[x] = Math.min(Math.max(player.qu.qc.mods[x]+i,0),10) },
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
    names: ["Black Dwarf","Time Anomaly","Hypertiered","Melted Interactions","Intense Catalyst","Ex-Challenge","Spatial Dilation","Extreme Scaling","Rotten Apples","Demuscle","Insanity"],
    ctn: [
        {
            shown: () => EVO.amt < 4,
            eff(i) {
                return [Math.max(0,1-0.03*i),2/(i+2)]
            },
            effDesc(x) { return `<b>${formatPow(x[0])}</b> to exponent of all-star resources.<br><b>${formatPow(x[1])}</b> to strength of star generators.` },
        },{
            unl: () => EVO.amt < 4,
            eff(i) {
                let x = E(2).pow(i**2)
                return x
            },
            effDesc(x) { return `<b>${formatMult(x.pow(-1),0)}</b> to pre-Quantum global speed.` },
        },{
            shown: () => EVO.amt < 4,
            eff(i) {
                let x = i**1.5*0.15+1
                return x
            },
            effDesc(x) { return `<b>${formatMult(x)}</b> to requirements of any Fermions.` },
        },{
            eff: i => 0.9**(i**1.25),
            effDesc: x => EVO.amt >= 4 ? `<b>${formatMult(x)}</b> to Protostars.` : `<b>${formatPow(x)}</b> to multiplier from Bosonic & Radiation resources.`,
        },{
            eff: i => 0.8**(i**1.25),
            effDesc: x => `<b>${formatPow(x)}</b> to multiplier from pre-Supernova resources, except all star resources.`,
        },{
            shown: () => EVO.amt < 4,
            eff(i) {
                let x = 1.2**i
                return x
            },
            effDesc(x) { return `<b>${formatMult(x)}</b> to requirements of any pre-Quantum Challenge.` },
        },{
            unl: () => EVO.amt < 4,
            eff(i) {
                if (hasElement(163)) i /= 2
                let x = i**1.5/2+1
                return x
            },
            effDesc(x) { return `<b>^${format(x)}</b> to Mass Dilation’s penalty.` },
        },{
            unl: () => EVO.amt < 4,
            eff(i) {
                if (hasElement(98) && player.qu.rip.active) i *= 0.8
                if (hasCharger(7) && EVO.amt >= 2 && tmp.c16.in) i *= getEvo2Ch8Boost().toNumber()
                let x = [Math.max(0,1-0.05*i),i/10+1]
                return x
            },
            effDesc(x) { return `<b>${formatPow(x[0])}</b> to starting of pre-Quantum scaling.<br><b>${formatPercent(x[1])}%</b> to strength of pre-Quantum scaling.` },
        },{
            shown: () => EVO.amt >= 4,
            eff: i => 0.6**((i/10)**1.25),
            effDesc: x => `<b>${formatMult(x)}</b> to apple boost efficiency`,
        },{
            shown: () => EVO.amt >= 4,
            eff: i => 0.5**((i/10)**1.25),
            effDesc: x => `<b>${formatMult(x)}</b> to stronger effect`,
        },{
            shown: () => EVO.amt >= 4,
            eff: i => 0.05**((i/10)**1.25),
            effDesc: x => `<b>${formatMult(x)}</b> to meditation efficiency`,
        },
    ],
}

const QCs_len = 11

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
        <div style="margin: 5px;" id='qcm_div${x}'>
			<div style="margin: 5px" id='qc_tooltip${x}' class="tooltip" tooltip-html="${QCs.names[x]}"><img style="cursor: pointer" src="images/qcm${x}.png"></div>
			<div><span id="qcm_mod${x}">0</span>/10</div>
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
			let ctn = QCs.ctn[y]
            if (ctn.unl && !ctn.unl()) continue
            if (ctn.shown && !ctn.shown()) continue
            table += `<div style="margin: 5px; align-items: center;" class="table_center">
				<div style="margin-right: 3px; width: 20px; text-align: right;">${p.mods[y]}</div><div class="tooltip" tooltip-html="${QCs.names[y]}"><img style="width: 25px; height: 25px" src="images/qcm${y}.png"></div>
            </div>`
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
    let evo = EVO.amt
	let tqc = tmp.qu.qc

    tqc.force = undefined
	if (player.qu.rip.active) tqc.force = QC_FORCE.rip[evo]
	if (player.dark.run.active) tqc.force = QC_FORCE.run[evo]
	for (var c of [14,15,16,20]) {
		if (!CHALS.inChal(c)) continue
		tqc.force = QC_FORCE[c][evo]
	}

    tqc.s_b = E(2)
    if (hasTree("qf4")) tqc.s_b = tqc.s_b.add(.5)
    if (hasPrestige(0,2)) tqc.s_b = tqc.s_b.add(.5)
    if (hasTree("qc3")) tqc.s_b = tqc.s_b.add(treeEff('qc3',0))
    if (hasElement(146)) tqc.s_b = tqc.s_b.add(elemEffect(146,0))
    if (hasElement(226)) tqc.s_b = tqc.s_b.pow(elemEffect(226))
    if (evo >= 2) tqc.s_b = tqc.s_b.pow(2)

    let weak = 1
    if (tmp.inf_unl) weak *= theoremEff('proto',3)
    tqc.s_eff = tqc.s_b.pow(player.qu.qc.shard)
    
    let s = 0, bs = 0
	let m_mult = [1, 2, 1.5, 10, 10][evo]
	if (hasZodiacUpg("gemini", "u3") && player.qu.rip.active) m_mult *= zodiacEff("gemini", "u3")

    for (let x = 0; x < QCs_len; x++) {
        let m = QCs.getMod(x) * m_mult
        let n = QCs.getMod(x) * [1, 2, 1.7, 10, 1][evo]
        s += Math.round(n)
        tqc.eff[x] = QCs.ctn[x].eff(m*weak)
        if (hasTree('qc2') && m >= 10) bs++
    }
    tqc.s = s
    tqc.s_bonus = bs
}

function updateQCHTML() {
    tmp.el.qc_shard.setTxt(player.qu.qc.shard+(tmp.qu.qc.s+tmp.qu.qc.s_bonus!=player.qu.qc.shard?(` (${tmp.qu.qc.s+tmp.qu.qc.s_bonus>=player.qu.qc.shard?"+":""}${tmp.qu.qc.s+tmp.qu.qc.s_bonus-player.qu.qc.shard})`):""))
    tmp.el.qc_shard_b.setTxt(tmp.qu.qc.s_b.format(1))
    tmp.el.qc_shard_eff.setTxt(tmp.qu.qc.s_eff.format(1))

    for (let x = 0; x < 2; x++) tmp.el["qc_tab"+x].setDisplay(tmp.qu.qc.tab == x)
    if (tmp.qu.qc.tab == 0) {
        tmp.el.qc_btn.setDisplay(!tmp.qu.rip.in)
        tmp.el.qc_btn.setTxt((QCs.active()?"Exit":"Enter") + " the Quantum Challenge")
        for (let x = 0; x < QCs_len; x++) {
			let ctn = QCs.ctn[x]
            tmp.el["qcm_mod"+x].setTxt(QCs.getMod(x))
            tmp.el["qcm_div"+x].setDisplay(!ctn.shown || ctn.shown())
            tmp.el["qcm_btns"+x].setDisplay(!QCs.active() && (!ctn.unl || ctn.unl()))

            tmp.el['qc_tooltip'+x].setTooltip(
                `<h3>${QCs.names[x]}</h3>
                <br class='line'>
                ${ctn.effDesc(tmp.qu.qc.eff[x])}`
            )
        }
    }
}

function getQCForceDisp(mod) {
	mod = QC_FORCE[mod]?.[EVO.amt]
	if (!mod) return "[?]"

	let h = ""
	for (var i = 0; i < QCs_len; i++) {
		let ctn = QCs.ctn[i]
		if (ctn.shown && !ctn.shown()) continue
		h += (h ? "," : "") + (mod[i] ?? 0)
	}
	return `[${h}]`
}

let QC_FORCE = {
	//Number: Challenge
	rip: [
		[10,2,10,10,5,0,2,10],
		[10,2,10,10,1,0,2,5],
		[10,2,0,5,1,0,2,0],
		[3,0,0,5,1,0,2,0],
        [0,0,0,10,5,0,0,0,10,5,5]
	],
	run: [
		[8,8,8,8,8,8,8,8],
		[5,5,5,5,5,5,4,5], //Bezier wants Aarex to nerf Evo 1 Dark Run
		[7,7,7,7,7,7,0,7], //Suggested by Maxwell
		[0,0,5,5,3,4,0,6],
        [0,0,0,6,2,0,0,5,3]
	],
	14: [
		[5,5,5,5,5,5,5,5],
		[4,4,4,4,4,4,4,4],
		[4,4,4,4,4,4,4,4],
		[2,2,2,2,1,2,0,2],
        [2,2,2,2,1,2,0,2],
	],
	15: [
		[10,5,10,10,10,10,10,10],
		[6,0,6,6,6,6,6,6],
		[3,3,3,3,3,3,3,3],
		[3,0,3,3,1,3,1,3],
        [0,0,0,0,0,0,0,3],
	],
	16: [
		[8,8,8,8,8,8,8,8],
		[5,5,5,5,5,5,5,5],
		[10,10,10,10,10,10,10,10],
		[10,10,10,10,7,10,10,10],
        [0,0,0,5,1,10,10,0,10,10,10],
	],
	20: [
		[10,5,10,10,10,10,10,10],
		[6,0,6,6,6,6,6,6],
		[10,10,10,10,10,10,10,10],
		[6,0,6,6,5,6,6,6],
		[10,10,10,10,5,10,10,10,10,10,10],
	],
}