const QUANTUM = {
    gain() {
        let x = player.mass.max(1).log10().div(1e13)
        if (x.lt(1)) return E(0)
        x = x.max(0).pow(hasTree("qu11")?3:1.5)

        x = x.mul(tmp.qu.qc_s_eff)
        if (tmp.qu.mil_reached[4]) x = x.mul(2)
        if (hasTree("qf1")) x = x.mul(treeEff("qf1"))
        if (hasTree("qf2")) x = x.mul(treeEff("qf2"))
        if (hasTree("qf3")) x = x.mul(treeEff("qf3"))
        if (hasPrestige(0,2)) x = x.mul(4)

        x = x.pow(theoremEff('proto',5))

        return x.floor()
    },
    gainTimes() {
        let x = E(1)
        if (hasTree("qu7")) x = x.mul(treeEff("qu7"))
        if (hasTree("qu9")) x = x.mul(treeEff("qu9"))
        if (hasElement(139)) x = x.mul(elemEffect(139,1))
        return x
    },
    enter(auto=false,force=false,rip=false,bd=false) {
        if (tmp.qu.gain.gte(1) || force) {
            if (player.confirms.qu&&!auto&&!force) createConfirm("Are you sure to go Quantum? Going Quantum will reset all previous except QoL mechanicals",'quReset',
            ()=>{createConfirm("ARE YOU SURE ABOUT IT???",'quReset',()=>CONFIRMS_FUNCTION.qu(auto,force,rip,bd))})
            else CONFIRMS_FUNCTION.qu(auto,force,rip,bd)
        }
    },
    doReset(force=false, dark=false, metaF=false) {
        let c16 = tmp.c16active

        if (!hasElement(47,1)) player.supernova.times = E(0)
        player.supernova.stars = E(0)

        if (!hasTree('ct8')) {
            let keep = ['qol1','qol2','qol3','qol4','qol5','qol6','fn2','fn5','fn6','fn7','fn8','fn9','fn10','fn11','fn13']
            for (let x = 0; x < tmp.supernova.tree_had.length; x++) if (TREE_UPGS.ids[tmp.supernova.tree_had[x]].qf) keep.push(tmp.supernova.tree_had[x])
            if (tmp.qu.mil_reached[2]) keep.push('chal1','chal2','chal3','chal4','chal4a','chal5','chal6','chal7','c','qol7','chal4b','chal7a','chal8')
            if (tmp.qu.mil_reached[3]) {
                if (!force) keep.push('unl1')
                keep.push('qol8','qol9')
            }
            if (!c16 && hasUpgrade('br',6) && !keep.includes('unl1')) keep.push('unl1')

            let save_keep = []
            for (let x in keep) if (hasTree(keep[x])) save_keep.push(keep[x])
            player.supernova.tree = save_keep
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

        tmp.pass = 2
    },
    bpGain() {
        let x = E(1)
        if (tmp.qu.mil_reached[5]) x = x.mul(tmp.preQUGlobalSpeed.max(1).root(2).softcap(1e50,0.95,2))
        if (hasTree('qu5')) x = x.mul(tmp.supernova.tree_eff.qu5)
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
        [E(2), `Pre quantum supernova tree's requirements are gone. Pre-Quantum global speed is increased by 10x.`],
        [E(3), `You start with challenges tree and qol7 unlocked.`],
        [E(5), `You start with qol8-9, unl1, and radiation unlocked.`],
        [E(6), `Double Quantum Foam gain.`],
        [E(8), `Pre-Quantum global speed affects Blueprint Particles and Chroma at a reduced rate.`],
        [E(10), `Supernova stars are boosted by Quantizes (capped at 1e10). Unlock Auto-Quantum.`],
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

function quUnl() { return player.qu.times.gte(1) }

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
        },
        
        qc: {
            shard: 0,
            presets: [],
            mods: [0,0,0,0,0,0,0,0],
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
    let inf_gs = tmp.preInfGlobalSpeed.mul(dt)

    if (player.mass.gte(mlt(1e4)) && !player.qu.reached && player.chal.comps[12].gte(1)) {
        player.qu.reached = true
        createPopup(POPUP_GROUPS.qu.html(),'quReached')
    }

    if (quUnl()) {
        player.qu.bp = player.qu.bp.add(tmp.qu.bpGain.mul(inf_gs))
        for (let x = 0; x < CHROMA_LEN; x++) player.qu.chroma[x] = player.qu.chroma[x].add(tmp.qu.chroma_gain[x].mul(inf_gs))

        if (player.qu.auto_cr) QUANTUM.cosmic_str.buyMax()

        if (PRIM.unl()) {
            player.qu.prim.theorems = player.qu.prim.theorems.max(tmp.prim.theorems)
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
            if (player.qu.rip.active || hasElement(147)) player.qu.rip.amt = player.qu.rip.amt.add(tmp.rip.gain.mul(inf_gs).div(10))
        }

        if (hasElement(139)) player.qu.times = player.qu.times.add(tmp.qu.gainTimes.mul(inf_gs))
    }

    if (player.mass.gte(mlt(7.5e6)) && !player.qu.en.unl) {
        player.qu.en.unl = true
        createPopup(POPUP_GROUPS.en.html(),'enReached')
    }

    if (hasUpgrade('br',9)) {
        player.md.break.energy = player.md.break.energy.add(tmp.bd.energyGain.mul(inf_gs))
        player.md.break.mass = player.md.break.mass.add(tmp.bd.massGain.mul(inf_gs))
    }

    if (hasTree("qu_qol1") || hasInfUpgrade(4)) for (let x = 0; x < TREE_TYPES.normal.length; x++) TREE_UPGS.buy(TREE_TYPES.normal[x], true)

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

    /*
    let fp = E(1)

    if (tmp.inf_unl) fp = fp.mul(theoremEff('proto',0))

    tmp.qu.cosmic_str_cost = E(2).pow(player.qu.cosmic_str.div(fp).scaleEvery("cosmic_str").add(1)).floor()
    tmp.qu.cosmic_str_bulk = player.qu.points.max(1).log(2).scaleEvery("cosmic_str",true).mul(fp).add(scalingActive('cosmic_str',player.qu.cosmic_str.max(tmp.qu.cosmic_str_bulk),'super')?1:0).floor()

    tmp.qu.cosmic_str_can = player.qu.points.gte(tmp.qu.cosmic_str_cost)
    tmp.qu.cosmic_str_eff = QUANTUM.cosmic_str.eff()
    */

    tmp.qu.bpGain = QUANTUM.bpGain()
    tmp.qu.bpEff = QUANTUM.bpEff()

    for (let x = 0; x < QUANTUM.mils.length; x++) tmp.qu.mil_reached[x] = player.qu.times.gte(QUANTUM.mils[x][0])

    tmp.qu.auto_input = QUANTUM.auto.temp()
}

function updateQuantumHTML() {
    let inf_gs = tmp.preInfGlobalSpeed

    if (tmp.tab == 0 && tmp.stab[0] == 4) {
        tmp.el.bpAmt.setTxt(format(player.qu.bp,1)+" "+formatGain(player.qu.bp,tmp.qu.bpGain.mul(inf_gs)))
        tmp.el.bpEff.setTxt(format(tmp.qu.bpEff))

        BUILDINGS.update('cosmic_string')

        /*
        tmp.el.cosmic_str_lvl.setTxt(format(player.qu.cosmic_str,0)+(tmp.qu.cosmic_str_eff.bonus.gte(1)?" + "+format(tmp.qu.cosmic_str_eff.bonus,0):""))
        tmp.el.cosmic_str_btn.setClasses({btn: true, locked: !tmp.qu.cosmic_str_can})
        tmp.el.cosmic_str_scale.setTxt(getScalingName('cosmic_str'))
        tmp.el.cosmic_str_cost.setTxt(format(tmp.qu.cosmic_str_cost,0))
        tmp.el.cosmic_str_pow.setTxt(format(tmp.qu.cosmic_str_eff.pow))
        tmp.el.cosmic_str_eff.setHTML(format(tmp.qu.cosmic_str_eff.eff))

        tmp.el.cosmic_str_auto.setDisplay(hasElement(147))
        tmp.el.cosmic_str_auto.setHTML(player.qu.auto_cr?"ON":"OFF")
        */
    }

    if (tmp.tab == 6) {
        if (tmp.stab[6] == 0) updateChromaHTML()
        if (tmp.stab[6] == 1) {
            tmp.el.qu_times.setTxt(format(player.qu.times,0))

            for (let x = 0; x < QUANTUM.mils.length; x++) {
                tmp.el['qu_mil'+x].changeStyle('background-color',tmp.qu.mil_reached[x]?'#2f22':'#4442')
                tmp.el['qu_mil_goal'+x].setTxt(format(QUANTUM.mils[x][0],0))
            }
        }
        if (tmp.stab[6] == 2) {
            tmp.el.auto_qu.setTxt(player.qu.auto.enabled?"ON":"OFF")
            tmp.el.auto_qu_mode.setTxt(QUANTUM.auto.mode[player.qu.auto.mode])
            tmp.el.auto_qu_res.setTxt(player.qu.auto.mode==0?format(tmp.qu.auto_input,0):formatTime(tmp.qu.auto_input,1)+"s")
        }
        if (tmp.stab[6] == 3) updatePrimordiumHTML()
        if (tmp.stab[6] == 4) updateEntropyHTML()
    }
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
            </div><div style="width: 700px;" id="prim_part_eff${x}"></div>
        </div>
        `
    }
    new_table.setHTML(html)

    setupQCHTML()
    setupEntropyHTML()
}