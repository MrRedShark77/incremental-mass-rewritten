const QUANTUM = {
    gain() {
        let x = player.mass.max(1).log10().div(EVO.amt>=4 ? 1e12 : 1e13)
        if (x.lt(1)) return E(0)
        if (EVO.amt >= 5) return x.max(1).log10().add(1)

        x = x.max(0).pow(hasTree("qu11")?3:1.5)
        x = x.mul(tmp.qu.qc.s_eff)
        if (tmp.qu.mil_reached[4]) x = x.mul(2)
        if (hasTree("qf1")) x = x.mul(treeEff("qf1"))
        if (hasTree("qf2")) x = x.mul(treeEff("qf2"))
        if (hasTree("qf3")) x = x.mul(treeEff("qf3"))
        if (hasElement(80) && EVO.amt >= 2) x = x.mul(100)
        if (hasPrestige(0,2)) x = x.mul(4)

        x = x.pow(theoremEff('proto',5))
        return x.floor()
    },
    gainTimes() {
        let x = E(1)
        if (hasTree("qu7")) x = x.mul(treeEff("qu7"))
        if (hasTree("qu9")) x = x.mul(treeEff("qu9"))
        if (hasElement(139)) x = x.mul(elemEffect(139,1))
        if (tmp.qu.mil_reached[7] && EVO.amt >= 4) x = x.mul(player.qu.points.add(1).log10())
        if (tmp.qu.mil_reached[8] && EVO.amt >= 4) x = x.mul(E(2).pow(player.qu.qc.shard))
        return x
    },
    enter(auto=false,force=false,rip=false) {
        if (tmp.qu.gain.gte(1) || force) getResetConfirm("qu", () => CONFIRMS_FUNCTION.qu(auto,force,rip))
    },
	performReset(force, rip) {
		if (!force) {
			if (EVO.amt >= 5) {
				player.evo.cosmo.unl = 1
				player.evo.cosmo.elixir = player.evo.cosmo.elixir.add(tmp.qu.gain)
			} else {
				player.qu.points = player.qu.points.add(tmp.qu.gain)
				player.qu.times = player.qu.times.add(tmp.qu.gainTimes)
			}
			if (player.qu.qc.active) {
				player.qu.qc.shard = Math.max(player.qu.qc.shard, tmp.qu.qc.s+tmp.qu.qc.s_bonus)
				player.qu.qc.active = false
			}
		}

		QUANTUM.doReset(force)
		addQuote(7)
		if (EVO.amt < 5) return

		ENTROPY.reset(0)
		ENTROPY.reset(1)
		if (rip && tmp.sn.unl) {
			if (hasUpgrade('br',4)) for (let x = 0; x < 2; x++) for (let y = 0; y < 6; y++) player.supernova.fermions.tiers[x][y] = E(2)
		}
		updateQuantumTemp()
	},
    doReset(force=false, dark=false, metaF=false) {
        if (!tmp.sn.unl) {
			SUPERNOVA.doReset()
			return
		}

        let c16 = tmp.c16.in

        if (!hasElement(47,1)) player.supernova.times = E(0)
        player.supernova.stars = E(0)

        if (!hasTree('ct8')) {
            let keep = ['qol1','qol2','qol3','qol4','qol5','qol6','fn2','fn5','fn6','fn7','fn8','fn9','fn10','fn11','fn13']
            for (let x = 0; x < tmp.sn.tree_had.length; x++) if (TREE_UPGS.ids[tmp.sn.tree_had[x]].qf) keep.push(tmp.sn.tree_had[x])
            if (tmp.qu.mil_reached[2]) keep.push('chal1','chal2','chal3','chal4','chal4a','chal5','chal6','chal7','c','qol7','chal4b','chal7a','chal8')
            if (tmp.qu.mil_reached[3]) {
                if (!force) keep.push('unl1')
                keep.push('qol8','qol9')
            }
            if (!c16 && hasUpgrade('br',6) && !keep.includes('unl1')) keep.push('unl1')

            let k = []
            for (let x in keep) if (hasTree(keep[x])) k.push(keep[x])
            player.supernova.tree = k
        }

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
        if (!metaF) player.supernova.fermions.choosed = ""

        for (let x = 0; x < 2; x++) if (!hasTree("qu_qol"+(2+4*x)) || force) for (let y = 0; y < 6; y++) player.supernova.fermions.tiers[x][y] = E(0)

        player.supernova.radiation.hz = !c16&&hasUpgrade('br',6)?E(1e50):E(0)
        for (let x = 0; x < 7; x++) {
            player.supernova.radiation.ds[x] = E(0)
            for (let y = 0; y < 2; y++) player.supernova.radiation.bs[2*x+y] = E(0)
        }

        for (let x = 1; x <= 12; x++) if (!hasTree("qu_qol7") || x <= 8 || force || dark) if (!hasElement(122) || x != 12 || dark) player.chal.comps[x] = E(0)

        SUPERNOVA.doReset()
    },
    bpGain() {
        let x = E(1)
        if (tmp.qu.mil_reached[5]) x = x.mul(tmp.qu.speed.max(1).root(2).softcap(1e50,0.95,2))
        if (hasTree('qu5')) x = x.mul(treeEff("qu5"))
        if (hasElement(138)) x = x.mul(elemEffect(138,1))
        x = x.mul(BUILDINGS.eff('cosmic_string'))
        x = x.mul(tmp.dark.shadowEff.bp||1)
        return x
    },
    bpEff() {
        let x = hasElement(101) ? player.qu.bp.add(1).log10().add(1).tetrate(hasUpgrade("br",15) ? 1.35 : 1.25) : player.qu.bp.add(1).log10().add(1).pow(1.5)
        return x
    },
    cosmic_str: {
        buy() {
            if (tmp.qu.cosmic_str_can) {
                player.qu.points = player.qu.points.sub(tmp.qu.cosmic_str_cost).max(0)
                player.qu.cosmic_str = player.qu.cosmic_str.add(1)
            }
        },
        buyMax() {
            if (tmp.qu.cosmic_str_can) {
                player.qu.cosmic_str = tmp.qu.cosmic_str_bulk
                player.qu.points = player.qu.points.sub(tmp.qu.cosmic_str_cost).max(0)
            }
        },
        eff() {
            let pow = E(2)
            if (hasTree('qu6')) pow = pow.mul(treeEff('qu6'))
            pow = pow.mul(tmp.dark.abEff.csp||1)
            pow = pow.pow(exoticAEff(1,3))
            if (CHALS.inChal(17)) pow = E(1)

            let b = E(0)
            if (hasElement(19,1)) b = b.add(muElemEff(19,0))

            let x = pow.pow(player.qu.cosmic_str.add(b))
            return {pow: pow, eff: x, bonus: b}
        },
    },
    mils: [
        [E(1), `You start with qol1-6, bosons, and fermions unlocked.`],
        [E(2), `Pre-quantum supernova tree's requirements are gone.`],
        [E(3), `You start with challenges tree and qol7 unlocked.`],
        [E(5), `You start with qol8-9, unl1, and radiation unlocked.`],
        [E(6), `Double Quantum Foam gain.`],
        [E(8), `Pre-Quantum global speed affects Blueprint Particles and Chroma at a reduced rate.`],
        [E(10), `Supernova stars are boosted by Quantizes (capped at 1e10). Unlock Auto-Quantum.`],
        [E(20), `Unlock Primordium. Quantum Foam boosts Quantizes at a logarithmic rate.`],
        [E(200), `Unlock Quantum Challenge. Quantum Shard boosts Quantizes.`],
        [E(2e5), `Unlock Big Rip.`],
    ],
    auto: {
        mode: ["Amount","Time"],
        switch() { player.qu.auto.enabled = !player.qu.auto.enabled; player.qu.auto.time = 0 },
        switchMode() { player.qu.auto.mode = (player.qu.auto.mode+1)%this.mode.length; player.qu.auto.time = 0 },
        temp() {
            let n, i = player.qu.auto.input
            if (player.qu.auto.mode==0) {
                n = E(i)
                if (isNaN(n.mag) || n.lt(0)) n = E(1)
                n = n.floor()
            } else if (player.qu.auto.mode==1) {
                n = Number(i)
                if (isNaN(n) || n < 0 || !isFinite(n)) n = 1
            }
            return n
        }
    },
}

function quUnl() { return EVO.amt < 5 && player.qu.times.gte(1) }

function getQUSave() {
    let s = {
        reached: false,
        auto: {
            enabled: false,
            time: 0,
            mode: 0,
            input: "1",
        },
        points: E(0),
        times: E(0),
        bp: E(0),

        chr_get: [],
        chroma: [E(0),E(0),E(0)],

        prim: {
            theorems: E(0),
            particles: [E(0),E(0),E(0),E(0),E(0),E(0),E(0),E(0)],
            lock: [-1,-1,-1,-1],
        },
        
        qc: {
            shard: 0,
            presets: [],
            mods: [0,0,0,0,0,0,0,0,0,0,0],
            active: false,
        },

        en: {
            unl: false,
            amt: E(0),
            eth: [false,E(0),E(0),0],
            hr: [false,E(0),E(0),0],
            rewards: [],
        },

        rip: {
            active: false,
            first: false,
            amt: E(0),
        },
    }
    for (let x = 0; x < ENTROPY.rewards.length; x++) s.en.rewards.push(E(0))
    return s
}

function calcQuantum(dt) {
    if (EVO.amt >= 5) return;

    let inf_gs = tmp.preInfGlobalSpeed.mul(dt)
    if (quUnl()) {
        player.qu.bp = player.qu.bp.add(tmp.qu.bpGain.mul(inf_gs))
        for (let x = 0; x < CHROMA_LEN; x++) player.qu.chroma[x] = player.qu.chroma[x].add(tmp.qu.chroma_gain[x].mul(inf_gs))

        if (player.qu.auto_cr) QUANTUM.cosmic_str.buyMax()

        if (PRIM.unl()) {
            player.qu.prim.theorems = player.qu.prim.theorems.max(tmp.qu.prim.theorems)
        }

        if (player.qu.auto.enabled) {
            player.qu.auto.time += dt

            let can = false
            if (player.qu.auto.mode == 0) can = tmp.qu.gain.gte(tmp.qu.auto_input)
            else if (player.qu.auto.mode == 1) can = player.qu.auto.time >= tmp.qu.auto_input
            if (can) QUANTUM.enter(true)
        }

        if (hasUpgrade('br',8)) {
            player.qu.points = player.qu.points.add(tmp.qu.gain.mul(inf_gs).div(10))
            if (player.qu.rip.active || hasElement(147)) player.qu.rip.amt = player.qu.rip.amt.add(tmp.qu.rip.gain.mul(inf_gs).div(10))
        }

        if (hasElement(139)) player.qu.times = player.qu.times.add(tmp.qu.gainTimes.mul(inf_gs))
    }

    if (player.mass.gte(mlt(7.5e6)) && !player.qu.en.unl) {
        player.qu.en.unl = true
        createPopup(POPUP_GROUPS.en.html(),'enReached')
    }

    if (tmp.sn.unl && (hasTree("qu_qol1") || hasInfUpgrade(4))) for (let x = 0; x < TREE_TYPES.normal.length; x++) TREE_UPGS.buy(TREE_TYPES.normal[x], true)

    calcEntropy(dt)
}

function updateQuantumTemp() {
    updateBigRipTemp()
    updateEntropyTemp()
    updateQCTemp()
    updatePrimordiumTemp()
    updateChromaTemp()

    tmp.qu.gain = QUANTUM.gain()
    tmp.qu.gainTimes = QUANTUM.gainTimes()

    tmp.qu.theories = player.qu.times.sub(player.qu.chr_get.length).max(0).min(3).toNumber()
    tmp.qu.pick_chr = tmp.qu.theories > 0

    tmp.qu.bpGain = QUANTUM.bpGain()
    tmp.qu.bpEff = QUANTUM.bpEff()

    for (let x = 0; x < QUANTUM.mils.length; x++) tmp.qu.mil_reached[x] = player.qu.times.gte(QUANTUM.mils[x][0])

    tmp.qu.auto_input = QUANTUM.auto.temp()
}

function updateQuantumHTML() {
    let inf_gs = tmp.preInfGlobalSpeed

    if (tmp.tab_name == "bp") {
        tmp.el.bpAmt.setTxt(format(player.qu.bp,1)+" "+formatGain(player.qu.bp,tmp.qu.bpGain.mul(inf_gs)))
        tmp.el.bpEff.setTxt(format(tmp.qu.bpEff))

        BUILDINGS.update('cosmic_string')
    }
    else if (tmp.tab_name == "chroma") updateChromaHTML()
    else if (tmp.tab_name == "qu-mil") {
        tmp.el.qu_times.setTxt(format(player.qu.times,0))
        let u = EVO.amt>=4?10:7
        for (let x = 0; x < QUANTUM.mils.length; x++) {
            tmp.el['qu_mil'+x].setDisplay(x<u)
            tmp.el['qu_mil'+x].changeStyle('background-color',tmp.qu.mil_reached[x]?'#2f22':'#4442')
            tmp.el['qu_mil_goal'+x].setTxt(format(QUANTUM.mils[x][0],0))
        }
    }
    else if (tmp.tab_name == "auto-qu") {
        tmp.el.auto_qu.setTxt(player.qu.auto.enabled?"ON":"OFF")
        tmp.el.auto_qu_mode.setTxt(QUANTUM.auto.mode[player.qu.auto.mode])
        tmp.el.auto_qu_res.setTxt(player.qu.auto.mode==0?format(tmp.qu.auto_input,0):formatTime(tmp.qu.auto_input,1)+"s")
    }
    else if (tmp.tab_name == "prim") updatePrimordiumHTML()
    else if (tmp.tab_name == "entropy") updateEntropyHTML()
}

function setupQuantumHTML() {
    let new_table = new Element("chroma_table")
    let html = ""
    for (let x = 0; x < CHROMA_LEN; x++) {
        let n = CHROMA.names[x]
        let id = "chroma_"+x

        html += `
        <div style="width: 33%">
            <div style="height: 60px">
                <button id="${id}_btn" class="btn" onclick="CHROMA.getChroma(${x})">Require Quantum Theory to start generating ${n[1]}</button>
            </div>
            <br>
            <img src="images/chroma${x}.png">
            <div style="width: 100%; color: #${n[2]}; background: linear-gradient(90deg, #${n[2]}0 0%, #${n[2]}2 10%, #${n[2]}2 90%, #${n[2]}0 100%); padding: 8px 0px; margin: 8px 0;">
                <h2>${n[1]}</h2><br><br>
                You have <span id="${id}_amt">0</span> ${n[0]} Chroma, which<br>
                <span id="${id}_eff"></span>
            </div>
        </div>
        `
    }
    new_table.setHTML(html)

    new_table = new Element("qu_milestones_table")
    html = ""
    for (let x in QUANTUM.mils) {
        html += `
        <div id="qu_mil${x}" style="width: 100%; margin: 5px 0px; padding: 8px 0px; background-color: #4444; font-size: 14px;">
            <h2>Quantized <span id="qu_mil_goal${x}">X</span> times</h2><br><br>
            ${QUANTUM.mils[x][1]}
        </div>
        `
    }
    new_table.setHTML(html)

    new_table = new Element("primordium_table")
    html = ""
    for (let x in PRIM.particle.names) {
        html += `
        <div class="primordium table_center">
            <div style="width: 350px; height: 60px;">
                <h2>${PRIM.particle.names[x]} Particles</h2><br>
				- [<span id="prim_part${x}">0</span>]
                <button class='btn' id="prim_lock${x}" onclick="PRIM.lock(${x})">Lock</button>
            </div><div style="width: 300px; text-align: center" id="prim_part_eff${x}"></div>
        </div>
        `
    }
    new_table.setHTML(html)

    setupQCHTML()
    setupEntropyHTML()
}