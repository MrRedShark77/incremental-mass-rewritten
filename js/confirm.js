const CONFIRMS_FUNCTION = {
    rage() {
        player.rp.points = player.rp.points.add(tmp.rp.gain)
        player.rp.unl = true
        FORMS.rp.doReset()
    },
    bh() {
        player.bh.dm = player.bh.dm.add(tmp.bh.dm_gain)
        player.bh.unl = true
        FORMS.bh.doReset()
    },
    atom() {
        player.atom.points = player.atom.points.add(tmp.atom.gain)
        player.atom.quarks = player.atom.quarks.add(tmp.atom.quarkGain)
        player.atom.unl = true
        ATOM.doReset()
    },
    sn(force,chal,post,fermion) {
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
        } else {
            document.body.style.animation = "implode 2s 1"
            setTimeout(()=>{
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
        if (tmp.c16active || player.dark.run.active) return
        if (player.qu.rip.active) player.qu.rip.amt = player.qu.rip.amt.add(tmp.rip.gain)
        player.qu.qc.active = false
        player.qu.rip.first = true
        player.qu.rip.active = !player.qu.rip.active
        QUANTUM.enter(false,true,true)
    },
    dark() {
        player.dark.unl = true
        player.dark.rays = player.dark.rays.add(tmp.dark.gain)

        DARK.doReset()
    },
}