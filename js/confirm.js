const CONFIRMS_FUNCTION = {
    rage() {
        let g = tmp.rp.gain, r = OURO.evo >= 1 ? player.evo.cp : player.rp

        r.points = r.points.add(g)
		r.unl = true

        FORMS.rp.doReset()
        addQuote(2)
    },
    bh() {
        let g = tmp.bh.dm_gain

        if (OURO.evo >= 2) {
			player.evo.wh.fabric = player.evo.wh.fabric.add(g)
			player.evo.wh.unl = true
        } else {
			player.bh.dm = player.bh.dm.add(g)
			player.bh.unl = true
		}

        FORMS.bh.doReset()

        addQuote(3)
    },
    atom() {
		if (OURO.evo >= 3) player.evo.proto.star = player.evo.proto.star.add(tmp.atom.gain)
        else player.atom.points = player.atom.points.add(tmp.atom.gain)
        player.atom.quarks = player.atom.quarks.add(tmp.atom.quarkGain)
        player.atom.unl = true
        ATOM.doReset()

        addQuote(4)
    },
    sn(force,chal,post,fermion) {
        addQuote(5)

        if (tmp.sn.reached || force || fermion) {
            tmp.el.supernova_scene.setDisplay(false)
            if (!force && !fermion) {
                player.supernova.times = player.supernova.post_10 ? player.supernova.times.max(tmp.sn.bulk) : player.supernova.times.add(1)
            }
            if (post || !hasTree("qu_qol4")) SUPERNOVA.doReset()
        }

        document.body.style.backgroundColor = "#111"
    },
    switchF(i,x) {
        let id = i+""+x
        if (player.supernova.fermions.choosed != id) {
            player.supernova.fermions.choosed = id
            if (x == 6) QUANTUM.doReset(true,false,true)
            else SUPERNOVA.reset(false,false,false,true)
        }
    },
    qu(auto,force,rip,bd) {
        if (QCs.active() && !rip && !bd && !player.qu.rip.active && !tmp.dark.run && !CHALS.inChal(14) && !CHALS.inChal(15)) {
            player.qu.qc.shard = tmp.qu.qc_s+tmp.qu.qc_s_bouns
            player.qu.qc.active = false
        }
        if (player.qu.times.gte(10) || OURO.unl() || force) {
            if (!force) {
                player.qu.points = player.qu.points.add(tmp.qu.gain)
                player.qu.times = player.qu.times.add(tmp.qu.gainTimes)
            }
            ENTROPY.reset(0)
            ENTROPY.reset(1)
            updateQuantumTemp()
            QUANTUM.doReset(force)
            if (rip) {
                if (hasUpgrade('br',4)) for (let x = 0; x < 2; x++) for (let y = 0; y < 6; y++) player.supernova.fermions.tiers[x][y] = E(2)
            }

            addQuote(7)
        } else {
            document.body.style.animation = "implode 2s 1"
            setTimeout(()=>{
                addQuote(7)

                if (player.qu.times.lte(0)) {
                    createPopup(POPUP_GROUPS.qus2.html(),'qus2');
                    createPopup(POPUP_GROUPS.qus1.html(),'qus1');
                }
                
                player.qu.points = player.qu.points.add(tmp.qu.gain)
                player.qu.times = player.qu.times.add(tmp.qu.gainTimes)

                updateQuantumTemp()
                
                QUANTUM.doReset(force)
            },1000)
            setTimeout(()=>{
                document.body.style.animation = ""
            },2000)
        }
        player.qu.auto.time = 0
    },
    enterQC() {
        player.qu.qc.active = !player.qu.qc.active
        QUANTUM.doReset(player.qu.qc.active)
    },
    bigRip() {
        if (tmp.dark.run) return
        if (player.qu.rip.active) player.qu.rip.amt = player.qu.rip.amt.add(tmp.rip.gain)
        player.qu.qc.active = false
        player.qu.rip.first = true
        player.qu.rip.active = !player.qu.rip.active
        QUANTUM.enter(false,true,true)

        addQuote(8)
    },
    dark() {
        player.dark.unl = true
        player.dark.rays = player.dark.rays.add(tmp.dark.gain)
        if (CHALS.inChal(19)) player.dark.rays = player.dark.rays.min(1e12)

        DARK.doReset()

        addQuote(9)
    },
    inf(limit) {
		if (!tmp.inf_unl) INF.load(true)

        if (limit || player.inf.pt_choosed >= 0) {
            if (player.inf.theorem.eq(0)) addTheorem('mass',[0,1,1,1,1,1,1,1],E(1),E(1))
            else addSelectedTheorem(true)
        } else if (hasElement(239) && player.inf.pt_choosed < 0) {
            let fl = Decimal.floor(tmp.core_lvl), pm = getPowerMult()
            for (let i in player.inf.pre_theorem) {
                let t = player.inf.pre_theorem[i]
                player.inf.fragment[t.type] = player.inf.fragment[t.type].add(calcFragmentBase(t,chanceToBool(t.star_c),pm.mul(t.power_m).mul(100).add(100).round().div(100),fl).div(4)) // Math.round(100+pm*t.power_m*100)/100
            }
        }

        if (player.inf.theorem.eq(0)) {
            player.inf.points = player.inf.points.add(2)
            player.inf.total = player.inf.total.add(2)
        }
        else {
            player.inf.points = player.inf.points.add(tmp.IP_gain)
            player.inf.total = player.inf.total.add(tmp.IP_gain)
        }

        player.inf.best = player.inf.best.max(tmp.IP_gain)
        if (tmp.inf_reached) player.inf.theorem = player.inf.theorem.add(1)

        updateInfTemp()

        INF.doReset()

        updateTheoremCore()
        updateTheoremInv()

        addQuote(11)
    },
    t_switch() {
        
    },
}