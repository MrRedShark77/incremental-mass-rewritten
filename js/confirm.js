const CONFIRMS_FUNCTION = {
    rage() {
        player.rp.points = player.rp.points.add(tmp.rp.gain)
        player.rp.unl = true
        FORMS.rp.doReset()

        addQuote(2)
    },
    bh() {
        player.bh.dm = player.bh.dm.add(tmp.bh.dm_gain)
        player.bh.unl = true
        FORMS.bh.doReset()

        addQuote(3)
    },
    atom() {
        player.atom.points = player.atom.points.add(tmp.atom.gain)
        player.atom.quarks = player.atom.quarks.add(tmp.atom.quarkGain)
        player.atom.unl = true
        ATOM.doReset()

        addQuote(4)
    },
    sn(force,chal,post,fermion) {
        addQuote(5)

        if (tmp.supernova.reached || force || fermion) {
            tmp.el.supernova_scene.setDisplay(false)
            if (!force && !fermion) {
                player.supernova.times = player.supernova.post_10 ? player.supernova.times.max(tmp.supernova.bulk) : player.supernova.times.add(1)
            }
            if (post?!hasTree("qu_qol4"):true) {
                tmp.pass = 2
                SUPERNOVA.doReset()
            }
        }
    },
    switchF(i,x) {
        let id = i+""+x
        if (player.supernova.fermions.choosed != id) {
            player.supernova.fermions.choosed = id
            if (x == 6) QUANTUM.doReset(true,false,true)
            if (x == 7) INF.doReset()
            else SUPERNOVA.reset(false,false,false,true)
        }
    },
    qu(auto,force,rip,bd) {
        if (QCs.active() && !rip && !bd && !player.qu.rip.active && !CHALS.inChal(14) && !CHALS.inChal(15) && !player.dark.run.active && !tmp.c16active) {
            player.qu.qc.shard = tmp.qu.qc_s+tmp.qu.qc_s_bouns
            player.qu.qc.active = false
        }
        if (player.qu.times.gte(10) || force) {
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
        if (tmp.c16active || player.dark.run.active || CHALS.inChal(18)) return
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

        DARK.doReset()

        addQuote(9)
    },
    inf(limit) {
        if (limit || player.inf.pt_choosed >= 0) {
            if (player.inf.theorem.eq(0)) addTheorem('mass',[0,1,1,1],1,1)
            else {
                let td = player.inf.pre_theorem[player.inf.pt_choosed==-1?Math.floor(Math.random()*4):player.inf.pt_choosed]

                addTheorem(td.type,td.star_c,Math.floor(tmp.core_lvl),td.power_m*getPowerMult()+1,getCoreChance())
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

        if (tmp.inf_reached) player.inf.theorem = player.inf.theorem.add(1)

        updateInfTemp()

        INF.doReset()

        updateTheoremCore()
        updateTheoremInv()

        addQuote(11)
    },
    glx() {
       GALAXY.doReset()
      addQuote(13)
    },
    t_switch() {
        
    },
}