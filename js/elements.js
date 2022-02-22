function setupHTML() {
	let sn_stabs = new Element("sn_stabs")
	let tabs = new Element("tabs")
	let stabs = new Element("stabs")
	let table = ""
	let table2 = ""
	let table3 = ""
	for (let x = 0; x < TABS[1].length; x++) {
		table += `<div style="width: 130px">
			<button onclick="TABS.choose(${x})" class="btn_tab" id="tab${x}">${TABS[1][x].id}</button>
		</div>`
		if (TABS[2][x]) {
			let a = `<div id="stabs${x}" class="table_center">`
			for (let y = 0; y < TABS[2][x].length; y++) {
				a += `<div style="width: 130px">
					<button onclick="TABS.choose(${y}, true)" class="btn_tab" id="stab${x}_${y}">${TABS[2][x][y].id}</button>
				</div>`
			}
			a += `</div>`
			if (x == 5) table3 += a
			else table2 += a
		}
	}
	tabs.setHTML(table)
	stabs.setHTML(table2)
	sn_stabs.setHTML(table3)

	let ranks_table = new Element("ranks_table")
	table = ""
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		table += `<div style="width: 300px" id="ranks_div_${x}">
			<button id="ranks_auto_${x}" class="btn" style="width: 80px;" onclick="RANKS.autoSwitch('${rn}')">OFF</button>
			<span id="ranks_scale_${x}""></span>${RANKS.fullNames[x]} <span id="ranks_amt_${x}">X</span><br><br>
			<button onclick="RANKS.reset('${rn}')" class="btn reset" id="ranks_${x}">
				Reset your ${x>0?RANKS.fullNames[x-1]:'mass and upgrades'}, but ${RANKS.fullNames[x]} up.<span id="ranks_desc_${x}"></span><br>
				Req: <span id="ranks_req_${x}">X</span>
			</button>
		</div>`
	}
	ranks_table.setHTML(table)

	let mass_upgs_table = new Element("mass_upgs_table")
	table = ""
	for (let x = 1; x <= UPGS.mass.cols; x++) {
		let upg = UPGS.mass[x]
		table += `<div style="width: 100%; margin-bottom: 5px;" class="table_center" id="massUpg_div_${x}">
			<div style="width: 400px">
				<div class="resources">
					<img src="images/mass_upg${x}.png">
					<span style="margin-left: 5px; text-align: left;"><span id="massUpg_scale_${x}"></span>${upg.title} [<span id="massUpg_lvl_${x}">X</span>]</span>
				</div>
			</div><button id="massUpg_btn_${x}" class="btn" style="width: 200px;" onclick="UPGS.mass.buy(${x}, true)">Cost: <span id="massUpg_cost_${x}">X</span></button>
			<button class="btn" style="width: 120px;" onclick="UPGS.mass.buyMax(${x})">Buy Max</button>
			<button id="massUpg_auto_${x}" class="btn" style="width: 80px;" onclick="UPGS.mass.autoSwitch(${x})">OFF</button>
			<div style="margin-left: 5px; text-align: left; width: 400px">
				${upg.title} Power: <span id="massUpg_step_${x}">X</span><br>
				${upg.title} Effect: <span id="massUpg_eff_${x}">X</span>
			</div>
		</div>`
	}
	mass_upgs_table.setHTML(table)

	let ranks_rewards_table = new Element("ranks_rewards_table")
	table = ""
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		table += `<div id="ranks_reward_div_${x}">`
		let keys = Object.keys(RANKS.desc[rn])
		for (let y = 0; y < keys.length; y++) {
			table += `<span id="ranks_reward_${rn}_${y}"><b>${RANKS.fullNames[x]} ${keys[y]}:</b> ${RANKS.desc[rn][keys[y]]}${RANKS.effect[rn][keys[y]]?` Currently: <span id='ranks_eff_${rn}_${y}'></span></span>`:""}<br>`
		}
		table += `</div>`
	}
	ranks_rewards_table.setHTML(table)

	let main_upgs_table = new Element("main_upgs_table")
	table = ""
	for (let x = 1; x <= UPGS.main.cols; x++) {
		let id = UPGS.main.ids[x]
		table += `<div id="main_upg_${x}_div" style="width: 230px; margin: 0px 10px;"><b>${UPGS.main[x].title}</b><br><br><div class="table_center" style="justify-content: start;">`
		for (let y = 1; y <= UPGS.main[x].lens; y++) {
			let key = UPGS.main[x][y]
			table += `<img onclick="UPGS.main[${x}].buy(${y})" onmouseover="UPGS.main.over(${x},${y})" onmouseleave="UPGS.main.reset()"
			 style="margin: 3px;" class="img_btn" id="main_upg_${x}_${y}" src="images/main_upg_${id+y}.png">`
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

	setupChalHTML()
	setupAtomHTML()
	setupElementsHTML()
	setupMDHTML()
	setupStarsHTML()
	setupTreeHTML()
	setupBosonsHTML()
	setupFermionsHTML()
	setupRadiationHTML()

	/*
	function setupTestHTML() {
		let test_table = new Element("test_table")
		let table = ""
		for (let i = 0; i < 5; i++) {
			table += `
				
			`
		}
		test_table.setHTML(table)
	}
	*/

	let confirm_table = new Element("confirm_table")
	table = ""
	for (let x = 0; x < CONFIRMS.length; x++) {
		table += `<div style="width: 100px" id="confirm_div_${x}"><img src="images/${x == 1 ? "dm" : CONFIRMS[x]}.png"><br><button onclick="player.confirms.${CONFIRMS[x]} = !player.confirms.${CONFIRMS[x]}" class="btn" id="confirm_btn_${x}">OFF</button></div>`
	}
	confirm_table.setHTML(table)

    tmp.el = {}
	let all = document.getElementsByTagName("*")
	for (let i=0;i<all.length;i++) {
		let x = all[i]
		tmp.el[x.id] = new Element(x)
	}
}

function updateTabsHTML() {
	for (let x = 0; x < TABS[1].length; x++) {
		if (x != 5 && tmp.tab == 5) continue
		let tab = TABS[1][x]
		tmp.el["tab"+x].setDisplay(tab.unl ? tab.unl() : true)
		tmp.el["tab"+x].setClasses({btn_tab: true, [tab.style ? tab.style : "normal"]: true, choosed: x == tmp.tab})

		if (tmp.el["tab_frame"+x]) tmp.el["tab_frame"+x].setDisplay(x == tmp.tab)
		if (TABS[2][x]) {
			tmp.el["stabs"+x].setDisplay(x == tmp.tab)
			if (x == tmp.tab) for (let y = 0; y < TABS[2][x].length; y++)  {
				let stab = TABS[2][x][y]
				tmp.el["stab"+x+"_"+y].setDisplay(stab.unl ? stab.unl() : true)
				tmp.el["stab"+x+"_"+y].setClasses({btn_tab: true, [stab.style ? stab.style : "normal"]: true, choosed: y == tmp.stab[x]})
				if (tmp.el["stab_frame"+x+"_"+y]) tmp.el["stab_frame"+x+"_"+y].setDisplay(y == tmp.stab[x])
			}
		}
	}
}

function updateUpperHTML() {
	tmp.el.reset_desc.setHTML(player.reset_msg)
	tmp.el.mass.setHTML(formatMass(player.mass)+"<br>"+formatGain(player.mass, tmp.massGain, true))
	tmp.el.rpAmt.setHTML(format(player.rp.points,0)+"<br>"+(player.mainUpg.bh.includes(6)||player.mainUpg.atom.includes(6)?formatGain(player.rp.points, tmp.rp.gain):"(+"+format(tmp.rp.gain,0)+")"))
	let unl = FORMS.bh.see()
	tmp.el.dm_div.setVisible(unl)
	if (unl) tmp.el.dmAmt.setHTML(format(player.bh.dm,0)+"<br>"+(player.mainUpg.atom.includes(6)?formatGain(player.bh.dm, tmp.bh.dm_gain):"(+"+format(tmp.bh.dm_gain,0)+")"))
	unl = player.bh.unl
	tmp.el.bh_div.setVisible(unl)
	tmp.el.atom_div.setVisible(unl)
	if (unl) {
		tmp.el.bhMass.setHTML(formatMass(player.bh.mass)+"<br>"+formatGain(player.bh.mass, tmp.bh.mass_gain, true))
		tmp.el.atomAmt.setHTML(format(player.atom.points,0)+"<br>"+(player.atom.elements.includes(24)?formatGain(player.atom.points,tmp.atom.gain):"(+"+format(tmp.atom.gain,0)+")"))
	}
	unl = !CHALS.inChal(0)
	tmp.el.chal_upper.setVisible(unl)
	if (unl) {
		let data = CHALS.getChalData(player.chal.active, tmp.chal.bulk[player.chal.active].max(player.chal.comps[player.chal.active]))
		tmp.el.chal_upper.setHTML(`You are now in [${CHALS[player.chal.active].title}] Challenge! Go over ${tmp.chal.format(tmp.chal.goal[player.chal.active])+CHALS.getResName(player.chal.active)} to complete.
		<br>+${tmp.chal.gain} Completions (+1 at ${tmp.chal.format(data.goal)+CHALS.getResName(player.chal.active)})`)
	}
	unl = player.atom.unl
	tmp.el.quark_div.setVisible(unl)
	if (unl) tmp.el.quarkAmt.setHTML(format(player.atom.quarks,0)+"<br>"+(player.atom.elements.includes(14)?formatGain(player.atom.quarks,tmp.atom?tmp.atom.quarkGain.mul(tmp.atom.quarkGainSec):0):"(+"+format(tmp.atom.quarkGain,0)+")"))
	unl = MASS_DILATION.unlocked()
	tmp.el.md_div.setVisible(unl)
	if (unl) tmp.el.md_massAmt.setHTML(format(player.md.particles,0)+"<br>"+(player.md.active?"(+"+format(tmp.md.rp_gain,0)+")":(player.supernova.tree.includes("qol3")?formatGain(player.md.particles,tmp.md.passive_rp_gain):"(inactive)")))
	unl = player.supernova.post_10
	tmp.el.sn_div.setVisible(unl)
	if (unl) tmp.el.supernovaAmt.setHTML(format(player.supernova.times,0)+"<br>(+"+format(tmp.supernova.bulk.sub(player.supernova.times).max(0),0)+")")
}

function updateRanksHTML() {
	for (let x = 0; x < RANKS.names.length; x++) {
        let rn = RANKS.names[x]
		let unl = RANKS.unl[rn]?RANKS.unl[rn]():true
		tmp.el["ranks_div_"+x].setDisplay(unl)
		if (unl) {
			let keys = Object.keys(RANKS.desc[rn])
			let desc = ""
			for (let i = 0; i < keys.length; i++) {
				if (player.ranks[rn].lt(keys[i])) {
					desc = ` At ${RANKS.fullNames[x]} ${format(keys[i],0)}, ${RANKS.desc[rn][keys[i]]}`
					break
				}
			}

			tmp.el["ranks_scale_"+x].setTxt(getScalingName(rn))
			tmp.el["ranks_amt_"+x].setTxt(format(player.ranks[rn],0))
			tmp.el["ranks_"+x].setClasses({btn: true, reset: true, locked: !tmp.ranks[rn].can})
			tmp.el["ranks_desc_"+x].setTxt(desc)
			tmp.el["ranks_req_"+x].setTxt(x==0?formatMass(tmp.ranks[rn].req):RANKS.fullNames[x-1]+" "+format(tmp.ranks[rn].req,0))
			tmp.el["ranks_auto_"+x].setDisplay(RANKS.autoUnl[rn]())
			tmp.el["ranks_auto_"+x].setTxt(player.auto_ranks[rn]?"ON":"OFF")
		}
    }
}

function updateMassUpgradesHTML() {
	for (let x = 1; x <= UPGS.mass.cols; x++) {
		let upg = UPGS.mass[x]
		tmp.el["massUpg_div_"+x].setDisplay(upg.unl())
		if (upg.unl()) {
			tmp.el["massUpg_scale_"+x].setTxt(getScalingName("massUpg", x))
			tmp.el["massUpg_lvl_"+x].setTxt(format(player.massUpg[x]||0,0)+(tmp.upgs.mass[x].bonus.gt(0)?" + "+format(tmp.upgs.mass[x].bonus,0):""))
			tmp.el["massUpg_btn_"+x].setClasses({btn: true, locked: player.mass.lt(tmp.upgs.mass[x].cost)})
			tmp.el["massUpg_cost_"+x].setTxt(formatMass(tmp.upgs.mass[x].cost))
			tmp.el["massUpg_step_"+x].setTxt(tmp.upgs.mass[x].effDesc.step)
			tmp.el["massUpg_eff_"+x].setHTML(tmp.upgs.mass[x].effDesc.eff)
			tmp.el["massUpg_auto_"+x].setDisplay(player.mainUpg.rp.includes(3))
			tmp.el["massUpg_auto_"+x].setTxt(player.autoMassUpg[x]?"ON":"OFF")
		}
	}
}

function updateTickspeedHTML() {
	let unl = player.rp.unl
	tmp.el.tickspeed_div.setDisplay(unl)
	if (unl) {
		tmp.el.tickspeed_scale.setTxt(getScalingName('tickspeed'))
		tmp.el.tickspeed_lvl.setTxt(format(player.tickspeed,0)+(tmp.atom.atomicEff.gte(1)?" + "+format(tmp.atom.atomicEff,0):""))
		tmp.el.tickspeed_btn.setClasses({btn: true, locked: !FORMS.tickspeed.can()})
		tmp.el.tickspeed_cost.setTxt(format(tmp.tickspeedCost,0))
		tmp.el.tickspeed_step.setHTML((tmp.tickspeedEffect.step.gte(10)?format(tmp.tickspeedEffect.step)+"x":format(tmp.tickspeedEffect.step.sub(1).mul(100))+"%")
		+(tmp.tickspeedEffect.step.gte(1e50)?" <span class='soft'>(softcapped)</span>":""))
		tmp.el.tickspeed_eff.setTxt(format(tmp.tickspeedEffect.eff))

		tmp.el.tickspeed_auto.setDisplay(FORMS.tickspeed.autoUnl())
		tmp.el.tickspeed_auto.setTxt(player.autoTickspeed?"ON":"OFF")
	}
}

function updateRanksRewardHTML() {
	tmp.el["ranks_reward_name"].setTxt(RANKS.fullNames[player.ranks_reward])

	if (player.ranks_reward === 0) {
		tmp.el.ranks_left_arrow.addClass("locked")
	} else {
		tmp.el.ranks_left_arrow.removeClass("locked")
	}

	const maxUnlockedRank = Math.max(...RANKS.names.map((v, i) => i==0 ? i : (RANKS.unl[v]() && i)))
	if (player.ranks_reward === maxUnlockedRank) {
		tmp.el.ranks_right_arrow.addClass("locked")
	} else {
		tmp.el.ranks_right_arrow.removeClass("locked")
	}
 
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

function updateMainUpgradesHTML() {
	if (player.main_upg_msg[0] != 0) {
		let upg1 = UPGS.main[player.main_upg_msg[0]]
		let upg2 = UPGS.main[player.main_upg_msg[0]][player.main_upg_msg[1]]
		let msg = "<span class='sky'>"+upg2.desc+"</span><br><span>Cost: "+format(upg2.cost,0)+" "+upg1.res+"</span>"
		if (upg2.effDesc !== undefined) msg += "<br><span class='green'>Currently: "+tmp.upgs.main[player.main_upg_msg[0]][player.main_upg_msg[1]].effDesc+"</span>"
		tmp.el.main_upg_msg.setHTML(msg)
	} else tmp.el.main_upg_msg.setTxt("")
	for (let x = 1; x <= UPGS.main.cols; x++) {
		let id = UPGS.main.ids[x]
		let unl = UPGS.main[x].unl()
		tmp.el["main_upg_"+x+"_div"].changeStyle("visibility", unl?"visible":"hidden")
		if (unl) {
			for (let y = 1; y <= UPGS.main[x].lens; y++) {
				let unl2 = UPGS.main[x][y].unl ? UPGS.main[x][y].unl() : true
				tmp.el["main_upg_"+x+"_"+y].changeStyle("visibility", unl2?"visible":"hidden")
				if (unl2) tmp.el["main_upg_"+x+"_"+y].setClasses({img_btn: true, locked: !UPGS.main[x].can(y), bought: player.mainUpg[id].includes(y)})
			}
			tmp.el["main_upg_"+x+"_auto"].setDisplay(UPGS.main[x].auto_unl ? UPGS.main[x].auto_unl() : false)
			tmp.el["main_upg_"+x+"_auto"].setTxt(player.auto_mainUpg[id]?"ON":"OFF")
		}
	}
}

function updateBlackHoleHTML() {
	tmp.el.bhMass2.setHTML(formatMass(player.bh.mass)+" "+formatGain(player.bh.mass, tmp.bh.mass_gain, true))
	tmp.el.bhMassPower.setTxt(format(tmp.bh.massPowerGain))
	tmp.el.bhFSoft1.setDisplay(tmp.bh.f.gte(tmp.bh.fSoftStart))
	tmp.el.bhFSoftStart1.setTxt(format(tmp.bh.fSoftStart))
	tmp.el.bhMassPower2.setTxt(format(tmp.bh.massPowerGain))
	tmp.el.massSoft2.setDisplay(tmp.bh.mass_gain.gte(tmp.bh.massSoftGain))
	tmp.el.massSoftStart2.setTxt(formatMass(tmp.bh.massSoftGain))

	tmp.el.bhEffect.setTxt(format(tmp.bh.effect))

	tmp.el.bhCondenser_lvl.setTxt(format(player.bh.condenser,0)+(tmp.bh.condenser_bonus.gte(1)?" + "+format(tmp.bh.condenser_bonus,0):""))
	tmp.el.bhCondenser_btn.setClasses({btn: true, locked: !FORMS.bh.condenser.can()})
	tmp.el.bhCondenser_scale.setTxt(getScalingName('bh_condenser'))
	tmp.el.bhCondenser_cost.setTxt(format(tmp.bh.condenser_cost,0))
	tmp.el.bhCondenser_pow.setTxt(format(tmp.bh.condenser_eff.pow))
	tmp.el.bhCondenserEffect.setHTML(format(tmp.bh.condenser_eff.eff))
	tmp.el.bhCondenser_auto.setDisplay(FORMS.bh.condenser.autoUnl())
	tmp.el.bhCondenser_auto.setTxt(player.bh.autoCondenser?"ON":"OFF")
}

function updateOptionsHTML() {
	for (let x = 0; x < CONFIRMS.length; x++) {
		tmp.el["confirm_div_"+x].setDisplay(CONFIRMS[x] == "sn"?player.supernova.times.gte(1):player[CONFIRMS[x]].unl)
		tmp.el["confirm_btn_"+x].setTxt(player.confirms[CONFIRMS[x]] ? "ON":"OFF")
	}
	tmp.el.total_time.setTxt(formatTime(player.time))
	tmp.el.offline_active.setTxt(player.offline.active?"ON":"OFF")
}

function updateHTML() {
	document.documentElement.style.setProperty('--font', player.options.font)
	tmp.el.offlineSpeed.setTxt(format(tmp.offlineMult))
	tmp.el.loading.setDisplay(tmp.offlineActive)
    tmp.el.app.setDisplay(tmp.offlineActive ? false : ((player.supernova.times.lte(0) ? !tmp.supernova.reached : true) && tmp.tab != 5))
	updateSupernovaEndingHTML()
	updateTabsHTML()
	if ((!tmp.supernova.reached || player.supernova.post_10) && tmp.tab != 5) {
		updateUpperHTML()
		if (tmp.tab == 0) {
			if (tmp.stab[0] == 0) {
				updateRanksHTML()
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
			}
			if (tmp.stab[0] == 1) {
				updateBlackHoleHTML()
			}
			if (tmp.stab[0] == 2) {
				updateAtomicHTML()
			}
			if (tmp.stab[0] == 3) {
				updateStarsHTML()
			}
		}
		if (tmp.tab == 1) {
			if (tmp.stab[1] == 0) updateRanksRewardHTML()
			if (tmp.stab[1] == 1) updateScalingHTML()
		}
		if (tmp.tab == 2) {
			updateMainUpgradesHTML()
		}
		if (tmp.tab == 3) {
			updateChalHTML()
		}
		if (tmp.tab == 4) {
			if (tmp.stab[4] == 0) updateAtomHTML()
			if (tmp.stab[4] == 1) updateElementsHTML()
			if (tmp.stab[4] == 2) updateMDHTML()
		}
		if (tmp.tab == 6) {
			updateOptionsHTML()
		}
	}
}