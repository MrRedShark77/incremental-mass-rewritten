const ANTI_MAIN = {
    massGain() {
        let x = E(0.1)
        if (hasAntiUpgrade("am",1)) x = x.mul(antiUpgEffect(1,1))
        if (hasAntiUpgrade("am",4)) x = x.mul(antiUpgEffect(1,4))
        if (hasAntiUpgrade("am",7)) x = x.mul(antiUpgEffect(1,7))
        if (hasAntiUpgrade("am",9)) x = x.mul(antiUpgEffect(1,9))
        if (hasAntiUpgrade("am",12)) x = x.mul(antiUpgEffect(1,12))

        x = x.mul(tmp.anti.dpEff.am||1)
        return x
    },
    dp: {
        gain() {
            let x = player.anti.mass.div(1e15)
            if (x.lt(1) && player.dim_shard>=7) return E(0)
            x = x.root(3)

            if (hasAntiUpgrade("dp",1)) x = x.mul(antiUpgEffect(2,1))

            return x.floor()
        },
        reset() {
            if (tmp.anti.dpGain.gte(1)) {
                if (player.confirms.dp) createConfirm("Are you sure you want to reset?",'dpReset',CONFIRMS_FUNCTION.dp)
                else CONFIRMS_FUNCTION.dp()
            }
        },
        effect() {
            let dp = player.anti.best_dp

            let p = dp.add(1).log10().mul(2).add(1).root(2).sub(1)

            let x = {
                pow: p,
                m: player.mass.add(1).log10().add(1).log10().add(1).pow(p),
                am: player.anti.mass.add(1).log10().add(1).pow(p),
            }

            return x
        },
    },
}

function setupAntiHTML() {
    let tabs = new Element("anti_tabs")
	let stabs = new Element("anti_stabs")
	let table = ""
	let table2 = ""
	for (let x = 0; x < ANTI_TABS[1].length; x++) {
		table += `<div style="width: 145px">
			<button onclick="TABS.choose(${x})" class="btn_tab" id="anti_tab${x}">${ANTI_TABS[1][x].id}</button>
		</div>`
		if (ANTI_TABS[2][x]) {
			let a = `<div id="anti_stabs${x}" class="table_center">`
			for (let y = 0; y < ANTI_TABS[2][x].length; y++) {
				a += `<div style="width: 145px">
					<button onclick="TABS.choose(${y}, true)" class="btn_tab" id="anti_stab${x}_${y}">${ANTI_TABS[2][x][y].id}</button>
				</div>`
			}
			a += `</div>`
			table2 += a
		}
	}
	tabs.setHTML(table)
	stabs.setHTML(table2)

    let main_upgs_table = new Element("anti_main_upgs_table")
	table = ""
	for (let x = 1; x <= ANTI_UPGS.main.cols; x++) {
		let id = ANTI_UPGS.main.ids[x]
		table += `<div id="anti_main_upg_${x}_div" style="width: 230px; margin: 0px 10px;"><b>${ANTI_UPGS.main[x].title}</b><br><br><div style="font-size: 13px; min-height: 50px" id="anti_main_upg_${x}_res"></div><br><div class="table_center" style="justify-content: start;">`
		for (let y = 1; y <= ANTI_UPGS.main[x].lens; y++) {
			let key = ANTI_UPGS.main[x][y]
            let img = key.icon?`images/upgrades/main_upg_${id+y}.png`:`images/upgrades/main_upg_${id}.png`
			table += `<img onclick="ANTI_UPGS.main[${x}].buy(${y})" onmouseover="ANTI_UPGS.main.over(${x},${y})" onmouseleave="ANTI_UPGS.main.reset()"
			 style="margin: 3px;" class="img_btn" id="anti_main_upg_${x}_${y}" src="${img}">`
		}
		table += `</div></div>` //<br><button id="anti_main_upg_${x}_auto" class="btn" style="width: 80px;" onclick="player.auto_mainUpg.${id} = !player.auto_mainUpg.${id}">OFF</button>
	}
	main_upgs_table.setHTML(table)

    setupDimBoostHTML()
    setupInfusionHTML()
}

function updateAntiHTML() {
    let antiDim = tmp.anti_tab
    let antiPlr = player.anti
    let at = tmp.anti

    let unl = antiDim
    tmp.el.anti_mass_div.setDisplay(unl)
    if (unl) tmp.el.antiMassAmt.setHTML(formatMass(antiPlr.mass)+"<br>"+formatGain(antiPlr.mass, at.massGain, true))

    unl = player.dim_shard>=7 && antiDim
    tmp.el.dp_div.setDisplay(unl)
    if (unl) tmp.el.dpAmt.setHTML(antiPlr.dp.format(0)+"<br>(+"+at.dpGain.format(0)+")")

    if (antiDim) {
        if (at.tab == 0) {
            if (at.stab[0] == 0) updateInfusionHTML()
            else if (at.stab[0] == 1) {
                let eff = at.dpEff

                tmp.el.dp.setTxt(antiPlr.best_dp.format(0))
                tmp.el.dp_eff.setHTML(`
                p = <b>${eff.pow.format()}</b> (based on delight powers)<br>
                (OoMs^2 of mass)<sup>p</sup> -> <b>^${eff.m.format()}</b> to mass gain<br>
                (OoMs of anti-mass)<sup>p</sup> -> <b>${formatMult(eff.am)}</b> to anti-mass gain
                `)
            }
        }
        else if (at.tab == 1) {
            for (let x = 0; x < DIM.boostDesc.length; x++) {
                let ctn = DIM.boostDesc[x]
                let unl = ctn[0]()
                tmp.el["dim_boost"+x].setDisplay(unl)
                if (unl) tmp.el["dim_boost"+x].setHTML(ctn[1]())
            }
        }
        else if (at.tab == 2) {
            if (antiPlr.main_upg_msg[0] != 0) {
                let upg1 = ANTI_UPGS.main[antiPlr.main_upg_msg[0]]
                let upg2 = ANTI_UPGS.main[antiPlr.main_upg_msg[0]][antiPlr.main_upg_msg[1]]
                let msg = "<span class='cyan'>"+(typeof upg2.desc == "function" ? upg2.desc() : upg2.desc)+"</span><br><span>Cost: "+(upg1.mass?formatMass(upg2.cost):format(upg2.cost,0))+" "+upg1.res+"</span>"
                if (upg2.effDesc !== undefined) msg += "<br><span class='green'>Currently: "+at.upgs.main[antiPlr.main_upg_msg[0]][antiPlr.main_upg_msg[1]].effDesc+"</span>"
                tmp.el.anti_main_upg_msg.setHTML(msg)
            } else tmp.el.anti_main_upg_msg.setTxt("")
            for (let x = 1; x <= ANTI_UPGS.main.cols; x++) {
                let id = ANTI_UPGS.main.ids[x]
                let upg = ANTI_UPGS.main[x]
                let unl = upg.unl()
                tmp.el["anti_main_upg_"+x+"_div"].changeStyle("visibility", unl?"visible":"hidden")
                tmp.el["anti_main_upg_"+x+"_res"].setTxt(`You have ${upg.mass?formatMass(upg.getRes()):upg.getRes().format(0)} ${upg.res}`)
                if (unl) {
                    for (let y = 1; y <= upg.lens; y++) {
                        let unl2 = upg[y].unl ? upg[y].unl() : true
                        tmp.el["anti_main_upg_"+x+"_"+y].changeStyle("visibility", unl2?"visible":"hidden")
                        if (unl2) tmp.el["anti_main_upg_"+x+"_"+y].setClasses({img_btn: true, locked: !upg.can(y), bought: antiPlr.mainUpg[id].includes(y)})
                    }
                    //tmp.el["main_upg_"+x+"_auto"].setDisplay(upg.auto_unl ? upg.auto_unl() : false)
                    //tmp.el["main_upg_"+x+"_auto"].setTxt(antiPlr.auto_mainUpg[id]?"ON":"OFF")
                }
            }
        }
    }
}

function getAntiSave() {
    let s = {
        mass: E(0),
        mainUpg: {},
        main_upg_msg: [0,0],
        infusions: [],

        dp_unl: false,
        dp: E(0),
        best_dp: E(0),
    }
    for (let x = 1; x <= ANTI_UPGS.main.cols; x++) {
        //s.auto_mainUpg[UPGS.main.ids[x]] = false
        s.mainUpg[ANTI_UPGS.main.ids[x]] = []
    }
    for (let x = 0; x < INFUSIONS_LEN; x++) s.infusions[x] = 0
    return s
}

function updateAntiTemp() {
    ANTI_UPGS.main.temp()
    updateInfusionTemp()

    let at = tmp.anti

    at.massGain = ANTI_MAIN.massGain()
    at.dpGain = ANTI_MAIN.dp.gain()
    at.dpEff = ANTI_MAIN.dp.effect()
}

function calcAnti(dt, dt_offline) {
    let antiPlr = player.anti
    let at = tmp.anti

    antiPlr.mass = antiPlr.mass.add(at.massGain.mul(dt))
}