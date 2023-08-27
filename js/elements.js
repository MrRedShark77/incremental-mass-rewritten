function setupHTML() {
	let table

	setupTabHTML()

	let ranks_table = new Element("ranks_table")
	table = ""
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		table += `<div style="width: 300px" id="ranks_div_${x}">
			<button id="ranks_auto_${x}" class="btn" style="width: 80px;" onclick="RANKS.autoSwitch('${rn}')">OFF</button>
			<span id="ranks_scale_${x}""></span>${RANKS.fullNames[x]} <h4 id="ranks_amt_${x}">X</h4><br><br>
			<button onclick="RANKS.reset('${rn}')" class="btn reset" id="ranks_${x}">
				Reset your ${x>0?RANKS.fullNames[x-1]+"s":'mass and upgrades'}, but ${RANKS.fullNames[x]} up.<span id="ranks_desc_${x}"></span><br>
				Req: <span id="ranks_req_${x}">X</span>
			</button>
		</div>`
	}
	ranks_table.setHTML(table)

	let pres_table = new Element("pres_table")
	table = ""
	for (let x = 0; x < PRES_LEN; x++) {
		table += `<div style="width: 300px" id="pres_div_${x}">
			<button id="pres_auto_${x}" class="btn" style="width: 80px;" onclick="PRESTIGES.autoSwitch(${x})">OFF</button>
			<span id="pres_scale_${x}""></span>${PRESTIGES.fullNames[x]} <h4 id="pres_amt_${x}">X</h4><br><br>
			<button onclick="PRESTIGES.reset(${x})" class="btn reset" id="pres_${x}">
				${x>0?"Reset your "+PRESTIGES.fullNames[x-1]+"s":'Force a Quantum reset'}, but ${PRESTIGES.fullNames[x]} up.<span id="pres_desc_${x}"></span><br>
				Req: <span id="pres_req_${x}">X</span>
			</button>
		</div>`
	}
	pres_table.setHTML(table)

	setupAscensionsHTML()

	BUILDINGS.setup()

	let ranks_rewards_table = new Element("ranks_rewards_table")
	table = ""
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		table += `<div id="ranks_reward_div_${x}">`
		let keys = Object.keys(RANKS.desc[rn])
		for (let y = 0; y < keys.length; y++) {
			table += `<span id="ranks_reward_${rn}_${y}"><b>${RANKS.fullNames[x]} ${keys[y]}:</b> ${RANKS.desc[rn][keys[y]]}${RANKS.effect[rn][keys[y]]?` Currently: <span id='ranks_eff_${rn}_${y}'></span>`:""}</span><br>`
		}
		table += `</div>`
	}
	ranks_rewards_table.setHTML(table)

	let pres_rewards_table = new Element("pres_rewards_table")
	table = ""
	for (let x = 0; x < PRES_LEN; x++) {
		table += `<div id="pres_reward_div_${x}">`
		let keys = Object.keys(PRESTIGES.rewards[x])
		for (let y = 0; y < keys.length; y++) {
			table += `<span id="pres_reward_${x}_${y}"><b>${PRESTIGES.fullNames[x]} ${keys[y]}:</b> ${PRESTIGES.rewards[x][keys[y]]}${PRESTIGES.rewardEff[x][keys[y]]?` Currently: <span id='pres_eff_${x}_${y}'></span>`:""}</span><br>`
		}
		table += `</div>`
	}
	pres_rewards_table.setHTML(table)

	let br_rewards_table = new Element("br_rewards_table")
	table = ""
	for (let x in BEYOND_RANKS.rewards) {
		x = Number(x)
		let ee = BEYOND_RANKS.rewardEff[x]
		for (let y in BEYOND_RANKS.rewards[x]) {
			table += `<span id="br_reward_${x}_${y}"><b>${getRankTierName(x+5)} ${format(y,0)}:</b> ${BEYOND_RANKS.rewards[x][y]}${ee&&BEYOND_RANKS.rewardEff[x][y]?` Currently: <span id='br_eff_${x}_${y}'></span>`:""}</span><br>`
		}
		table += '<br>'
	}
	br_rewards_table.setHTML(table)

	let main_upgs_table = new Element("main_upgs_table")
	table = ""
	for (let x = 1; x <= UPGS.main.cols; x++) {
		let id = UPGS.main.ids[x]
		table += `<div id="main_upg_${x}_div" style="width: 230px; margin: 0px 10px;"><b>${UPGS.main[x].title}</b><br><br><div style="font-size: 13px; min-height: 50px" id="main_upg_${x}_res"></div><br><div class="table_center" style="justify-content: start;">`
		for (let y = 1; y <= UPGS.main[x].lens; y++) {
			let key = UPGS.main[x][y]
			table += `<img onclick="buyUpgrade('${id}', ${y})" onmouseover="UPGS.main.over(${x},${y})" onmouseleave="UPGS.main.reset()"
			 style="margin: 3px;" class="img_btn" id="main_upg_${x}_${y}" src="${key.noImage?`images/test.png`:`images/upgrades/main_upg_${id+y}.png`}">`
		}
		table += `</div><br><button id="main_upg_${x}_auto" class="btn" style="width: 80px;" onclick="player.auto_mainUpg.${id} = !player.auto_mainUpg.${id}">OFF</button></div>`
	}
	main_upgs_table.setHTML(table)

	let scaling_table = new Element("scaling_table")
	table = ""
	for (let x = 0; x < SCALE_TYPE.length; x++) {
		table += `<div id="scaling_div_${x}">`
		let key = Object.keys(SCALE_START[SCALE_TYPE[x]])
		for (let y = 0; y < key.length; y++) {
			table += `<div id="scaling_${x}_${key[y]}_div" style="margin-bottom: 10px;"><b>${NAME_FROM_RES[key[y]]}</b> (<span id="scaling_${x}_${key[y]}_power"></span>): Starts at <span id="scaling_${x}_${key[y]}_start"></span></div>`
		}
		table += `</div>`
	}
	scaling_table.setHTML(table)

	setupStatsHTML()
	setupResourcesHTML()
	setupChalHTML()
	setupAtomHTML()
	setupElementsHTML()
	setupMDHTML()
	setupStarsHTML()
	setupTreeHTML()
	setupBosonsHTML()
	setupFermionsHTML()
	setupRadiationHTML()
	setupQuantumHTML()
	setupDarkHTML()
	setupInfHTML()
	setupOuroHTML()

	let confirm_table = new Element("confirm_table")
	table = ""
	for (let x = 0; x < CONFIRMS.length; x++) {
		table += `<div style="width: 100px" id="confirm_div_${x}"><img src="images/${x == 1 ? "dm" : CONFIRMS[x]}.png"><br><button onclick="player.confirms.${CONFIRMS[x]} = !player.confirms.${CONFIRMS[x]}" class="btn" id="confirm_btn_${x}">OFF</button></div>`
	}
	confirm_table.setHTML(table)

    reloadElements()
}

function updateUpperHTML() {
	let mode = ""
	if (player.chal.active > 0) mode = "chal"
	if (player.supernova.pin_req) mode = "req"
	if (tmp.upg_notify) mode = "upg"
	if (tmp.ouro.time != undefined) mode = "saved"
	
	tmp.el.chal_upper.setDisplay(mode == "chal")
	if (mode == "chal") {
		let data = CHALS.getChalData(player.chal.active, tmp.chal.bulk[player.chal.active].max(player.chal.comps[player.chal.active]))
		tmp.el.chal_upper.setHTML(`You are now in [${CHALS[player.chal.active].title}] Challenge! Go over ${tmp.chal.format(tmp.chal.goal[player.chal.active])+CHALS.getResName(player.chal.active)} to complete.
		<br>+${tmp.chal.gain} Completions (+1 at ${tmp.chal.format(data.goal)+CHALS.getResName(player.chal.active)})`)
	}
	
	tmp.el.requirement.setDisplay(mode == "req")
	if (mode == "req") {
		let u = TREE_UPGS.ids[player.supernova.pin_req]
		tmp.el.requirement.setHTML(`<b class='${u.req ? "green" : "red"}'>[${player.supernova.pin_req}]</b> ${typeof u.reqDesc == "function" ? u.reqDesc() : u.reqDesc}`)
	}
	
	tmp.el.upg_notify.setDisplay(mode == "upg")
	if (mode == "upg") {
		let nt = tmp.upg_notify
		if (nt[0] == "el") tmp.el.upg_notify_msg.setHTML(`[!] ${["","Muonic "][nt[1]]+ELEMENTS.fullNames[nt[2]]} is available! [!]`)
		if (nt[0] == "sn") tmp.el.upg_notify_msg.setHTML(`[!] Neutron Tree [${nt[1]}] is available! [!]`)
	}
	
	tmp.el.saved.setDisplay(mode == "saved")
	if (mode == "saved") tmp.el.saved.setOpacity(0.2 - Math.abs(5 - tmp.ouro.time) / 25)
}

function updateMassUpgradesHTML() {
	for (let x = 1; x <= 4; x++) {
		BUILDINGS.update('mass_'+x)
	}
}

function updateTickspeedHTML() {
	BUILDINGS.update('tickspeed')
	BUILDINGS.update('accelerator')
}

function updateRanksRewardHTML() {
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		tmp.el["ranks_reward_div_"+x].setDisplay(player.ranks_reward == x)
		if (player.ranks_reward == x) {
			let keys = Object.keys(RANKS.desc[rn])
			for (let y = 0; y < keys.length; y++) {
				let unl = player.ranks[rn].gte(keys[y])
				tmp.el["ranks_reward_"+rn+"_"+y].setDisplay(unl)
				if (unl) if (tmp.el["ranks_eff_"+rn+"_"+y]) tmp.el["ranks_eff_"+rn+"_"+y].setTxt(RANKS.effDesc[rn][keys[y]](RANKS.effect[rn][keys[y]]()))
			}
		}
	}
}

function updatePrestigesRewardHTML() {
	let c16 = tmp.c16active
	// tmp.el["pres_reward_name"].setTxt(PRESTIGES.fullNames[player.pres_reward])
	for (let x = 0; x < PRES_LEN; x++) {
		tmp.el["pres_reward_div_"+x].setDisplay(player.pres_reward == x)
		if (player.pres_reward == x) {
			let keys = Object.keys(PRESTIGES.rewards[x])
			for (let y = 0; y < keys.length; y++) {
				let unl = player.prestiges[x].gte(keys[y])
				tmp.el["pres_reward_"+x+"_"+y].setDisplay(unl)
				if (unl) {
					tmp.el["pres_reward_"+x+"_"+y].setClasses({corrupted_text2: c16 && CORRUPTED_PRES[x] && CORRUPTED_PRES[x].includes(parseInt(keys[y]))})
					if (tmp.el["pres_eff_"+x+"_"+y]) {
						let eff = PRESTIGES.rewardEff[x][keys[y]]
						tmp.el["pres_eff_"+x+"_"+y].setHTML(eff[1](tmp.prestiges.eff[x][keys[y]]))
					}
				}
			}
		}
	}
}

function updateBeyondRanksRewardHTML() {
	let t = tmp.beyond_ranks.max_tier, lt = tmp.beyond_ranks.latestRank, c16 = tmp.c16active, c16_cr = {
		1: [7],
	}
	for (let x in BEYOND_RANKS.rewards) {
		x = parseInt(x)

		for (let y in BEYOND_RANKS.rewards[x]) {
			y = parseInt(y)

			let unl = t > x || t == x && lt.gte(y)
			tmp.el["br_reward_"+x+"_"+y].setDisplay(unl)
			if (unl) {
				tmp.el["br_reward_"+x+"_"+y].setClasses({corrupted_text2: c16&&c16_cr[x]&&c16_cr[x].includes(y)})
				if (tmp.el["br_eff_"+x+"_"+y]) {
					let eff = BEYOND_RANKS.rewardEff[x][y]
					tmp.el["br_eff_"+x+"_"+y].setHTML(eff[1](tmp.beyond_ranks.eff[x][y]))
				}
			}
		}
	}
}

function updateMainUpgradesHTML() {
	if (player.main_upg_msg[0] != 0) {
		let upg1 = UPGS.main[player.main_upg_msg[0]]
		let upg2 = UPGS.main[player.main_upg_msg[0]][player.main_upg_msg[1]]
		let msg = "<span class='sky'>"+(typeof upg2.desc == "function" ? upg2.desc() : upg2.desc)+"</span><br><span>Cost: "+format(upg2.cost,0)+" "+upg1.resName+"</span>"
		if (upg2.effDesc !== undefined) msg += "<br><span class='green'>Currently: "+upg2.effDesc(tmp.upgs[player.main_upg_msg[0]][player.main_upg_msg[1]].effect)+"</span>"
		tmp.el.main_upg_msg.setHTML(msg)
	} else tmp.el.main_upg_msg.setTxt("")
	for (let x = 1; x <= UPGS.main.cols; x++) {
		let id = UPGS.main.ids[x]
		let upg = UPGS.main[x]
		let unl = upg.unl()
		tmp.el["main_upg_"+x+"_div"].setDisplay(unl)
		tmp.el["main_upg_"+x+"_res"].setTxt(`You have ${format(upg.res, 0)} ${upg.resName}`)
		if (unl) {
			for (let y = 1; y <= upg.lens; y++) {
				let unl2 = upg[y].unl ? upg[y].unl() : true
				tmp.el["main_upg_"+x+"_"+y].changeStyle("visibility", unl2?"visible":"hidden")
				if (unl2) tmp.el["main_upg_"+x+"_"+y].setClasses({img_btn: true, locked: !canGetUpgrade(id, y), bought: hasUpgrade(id, y)})
			}
			tmp.el["main_upg_"+x+"_auto"].setDisplay(upg.auto_unl ? upg.auto_unl() : false)
			tmp.el["main_upg_"+x+"_auto"].setTxt(player.auto_mainUpg[id]?"ON":"OFF")
		}
	}
}

function updateBlackHoleHTML() {
	tmp.el.bhMass2.setHTML(formatMass(player.bh.mass)+" "+formatGain(player.bh.mass, tmp.bh.mass_gain.mul(tmp.preQUGlobalSpeed), true))
	tmp.el.bhMassPower.setTxt(format(tmp.bh.massPowerGain))
	tmp.el.bhFSoft1.setDisplay(tmp.bh.f.gte(tmp.bh.fSoftStart))
	tmp.el.bhFSoftStart1.setTxt(format(tmp.bh.fSoftStart))
	tmp.el.bhMassPower2.setTxt(format(tmp.bh.massPowerGain))
	tmp.el.massSoft2.setDisplay(tmp.bh.mass_gain.gte(tmp.bh.massSoftGain))
	tmp.el.massSoftStart2.setTxt(formatMass(tmp.bh.massSoftGain))

	tmp.el.bhEffect.setTxt(hasElement(201)?"^"+format(tmp.bh.effect):format(tmp.bh.effect)+"x")
	tmp.el.bhCondenserEffect.setHTML(format(BUILDINGS.eff('bhc')))

	BUILDINGS.update('bhc')
	BUILDINGS.update('fvm')

	tmp.el.bhOverflow.setDisplay(player.bh.mass.gte(tmp.overflow_start.bh[0]))
    tmp.el.bhOverflow.setHTML(`Because of black hole mass overflow at <b>${formatMass(tmp.overflow_start.bh[0])}</b>, your mass of black hole gain is ${overflowFormat(tmp.overflow.bh||1)}!`)

	tmp.el.bhOverflow2.setDisplay(player.bh.mass.gte(tmp.overflow_start.bh[1]))
    tmp.el.bhOverflow2.setHTML(`Because of black hole mass overflow^2 at <b>${formatMass(tmp.overflow_start.bh[1])}</b>, your black hole mass overflow is even stronger!`)
	
	tmp.el.bhcEffectOverflow.setDisplay(BUILDINGS.eff('bhc').gte(tmp.overflow_start.BHCEffect[0]))
    tmp.el.bhcEffectOverflow.setHTML(`Because of BH Condenser siltation at <b>${format(tmp.overflow_start.BHCEffect[0])}</b>, the exponent of BH Condenser's effect is ${overflowFormat(tmp.overflow.BHCEffect||1)}!`)
	
	// Unstable 

	let unl = hasCharger(1)

	tmp.el.unstable_bhUnl.setDisplay(unl)
	// tmp.el.falseVacuumDiv.setDisplay(unl)
	if (unl) {
		tmp.el.bhUnstable.setHTML(formatMass(player.bh.unstable)+" "+formatGain(player.bh.unstable,UNSTABLE_BH.calcProduction(),true))
		tmp.el.bhUnstableEffect.setHTML("^"+format(tmp.unstable_bh.effect))

		/*
		tmp.el.fvm_lvl.setTxt(format(player.bh.fvm,0))
		tmp.el.fvm_btn.setClasses({btn: true, locked: !UNSTABLE_BH.fvm.can()})
		tmp.el.fvm_cost.setTxt(format(tmp.unstable_bh.fvm_cost,0))
		tmp.el.fvm_pow.setTxt(format(tmp.unstable_bh.fvm_eff.pow))
		tmp.el.fvm_eff.setHTML(format(tmp.unstable_bh.fvm_eff.eff))
		tmp.el.fvm_auto.setTxt(player.bh.autoFVM?"ON":"OFF")
		*/
	}
}

function updateOptionsHTML() {
	if (tmp.tab_name == "options") {
		for (let x = 0; x < CONFIRMS.length; x++) {
			let unl = 
			CONFIRMS[x] == "sn"
			?(player.supernova.times.gte(1) || quUnl())
			:CONFIRMS[x] == "qu"
			?quUnl()
			:CONFIRMS[x] == "br"
			?player.qu.rip.first
			:CONFIRMS[x] == "inf"
			?tmp.inf_unl
			:player[CONFIRMS[x]].unl
	
			tmp.el["confirm_div_"+x].setDisplay(unl)
			tmp.el["confirm_btn_"+x].setTxt(player.confirms[CONFIRMS[x]] ? "ON":"OFF")
		}
		tmp.el.total_time.setTxt(formatTime(player.time))
		tmp.el.offline_active.setTxt(player.offline.active?"ON":"OFF")
		tmp.el.tree_anim_btn.setDisplay(player.supernova.times.gte(1) || quUnl())
		tmp.el.tree_anim.setTxt(TREE_ANIM[player.options.tree_animation])
		tmp.el.mass_dis.setTxt(["Default",'Always show g'][player.options.massDis])
		tmp.el.mass_type.setTxt(["Short",'Standard'][player.options.massType])
	} else if (tmp.tab_name == "res-hide") {
		updateResourcesHiderHTML()
	}

	tmp.el.omega_badge.setDisplay(tmp.tab_name == "options" && localStorage.getItem("imr_secret_badge1") == "1")
}

function updateHTML() {
	document.documentElement.style.setProperty('--font', player.options.font)
	document.documentElement.style.setProperty('--cx', tmp.cx)
	document.documentElement.style.setProperty('--cy', tmp.cy)

	tmp.mobile = window.innerWidth < 1200

	let displayMainTab = true
	
	tmp.el.loading.setDisplay(!tmp.start)
    tmp.el.app.setDisplay(tmp.inf_time != 2 && tmp.inf_time != 3 && tmp.start && !supernovaAni() && displayMainTab)
	updateSupernovaEndingHTML()
	updateTabsHTML()
	if (!player.options.nav_hide[1]) updateResourcesHTML()
	if (hover_tooltip) updateTooltipResHTML()
	updateUpperHTML()
	if (tmp.start && (!tmp.supernova.reached || player.supernova.post_10) && displayMainTab) {
		updateQuantumHTML()
		updateDarkHTML()
		updateInfHTML()
		updateOuroborosHTML()
		if (tmp.tab_name == "mass") {
			updateRanksHTML()
			
			if (tmp.rank_tab == 0) {
				updateMassUpgradesHTML()
				updateTickspeedHTML()

				tmp.el.massSoft1.setDisplay(tmp.massGain.gte(tmp.massSoftGain))
				tmp.el.massSoftStart1.setTxt(formatMass(tmp.massSoftGain))
				tmp.el.massSoft3.setDisplay(tmp.massGain.gte(tmp.massSoftGain2))
				tmp.el.massSoftStart3.setTxt(formatMass(tmp.massSoftGain2))
				tmp.el.massSoft4.setDisplay(tmp.massGain.gte(tmp.massSoftGain3))
				tmp.el.massSoftStart4.setTxt(formatMass(tmp.massSoftGain3))
				tmp.el.massSoft5.setDisplay(tmp.massGain.gte(tmp.massSoftGain4))
				tmp.el.massSoftStart5.setTxt(formatMass(tmp.massSoftGain4))
				tmp.el.massSoft6.setDisplay(tmp.massGain.gte(tmp.massSoftGain5))
				tmp.el.massSoftStart6.setTxt(formatMass(tmp.massSoftGain5))
				tmp.el.massSoft7.setDisplay(tmp.massGain.gte(tmp.massSoftGain6))
				tmp.el.massSoftStart7.setTxt(formatMass(tmp.massSoftGain6))
				tmp.el.massSoft8.setDisplay(tmp.massGain.gte(tmp.massSoftGain7))
				tmp.el.massSoftStart8.setTxt(formatMass(tmp.massSoftGain7))
				tmp.el.massSoft9.setDisplay(tmp.massGain.gte(tmp.massSoftGain8))
				tmp.el.massSoftStart9.setTxt(formatMass(tmp.massSoftGain8))

				tmp.el.massOverflow.setDisplay(player.mass.gte(tmp.overflow_start.mass[0]))
				tmp.el.massOverflow.setHTML(`Because of mass overflow at <b>${formatMass(tmp.overflow_start.mass[0])}</b>, your mass gain is ${overflowFormat(tmp.overflow.mass||1)}!`)

				tmp.el.massOverflow2.setDisplay(player.mass.gte(tmp.overflow_start.mass[1]))
				tmp.el.massOverflow2.setHTML(`Because of mass overflow^2 at <b>${formatMass(tmp.overflow_start.mass[1])}</b>, your mass overflow is even stronger!`)

				tmp.el.strongerOverflow.setDisplay(BUILDINGS.eff('mass_3').gte(tmp.overflow_start.stronger[0]))
				tmp.el.strongerOverflow.setHTML(`Because of stronger overflow at <b>${format(tmp.overflow_start.stronger[0])}</b>, your stronger effect is ${overflowFormat(tmp.overflow.stronger||1)}!`)
			
				tmp.el.strongerOverflow2.setDisplay(BUILDINGS.eff('mass_3').gte(tmp.overflow_start.stronger[1]))
				tmp.el.strongerOverflow2.setHTML(`Because of stronger overflow^2 at <b>${format(tmp.overflow_start.stronger[1])}</b>, your stronger overflow is even stronger!`)
			}
		}
		else if (tmp.tab_name == "bh") {
			updateBlackHoleHTML()
		}
		else if (tmp.tab_name == "atomic") {
			updateAtomicHTML()
		}
		else if (tmp.tab_name == "star") {
			updateStarsHTML()
		}
		else if (tmp.tab_name == 'rank-reward') updateRanksRewardHTML()
		else if (tmp.tab_name == "scaling") updateScalingHTML()
		else if (tmp.tab_name == "pres-reward") updatePrestigesRewardHTML()
		else if (tmp.tab_name == "bd-reward") updateBeyondRanksRewardHTML()
		else if (tmp.tab_name == "asc-reward") updateAscensionsRewardHTML()
		else if (tmp.tab_name == "main-upg") updateMainUpgradesHTML()
		else if (tmp.tab_name == "particles") updateAtomHTML()
		else if (tmp.tab_name == "elements") updateElementsHTML()
		else if (tmp.tab_name == "dil") updateMDHTML()
		else if (tmp.tab_name == "break-dil") updateBDHTML()
		else if (tmp.tab_name == "ext-atom") updateExoticAtomsHTML()
		updateStatsHTML()
		updateOptionsHTML()
		updateChalHTML()
	}
}

function reloadElements() {
	tmp.el = {}
	for (let x of document.getElementsByTagName("*")) tmp.el[x.id] = new Element(x)
}