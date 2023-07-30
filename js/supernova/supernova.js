const SUPERNOVA = {
    reset(force=false, chal=false, post=false, fermion=false) {
        if (!chal && !post && !fermion) {
            if (force && player.confirms.sn) createConfirm("Are you sure to reset without being Supernova?",'sn',()=>CONFIRMS_FUNCTION.sn(force,chal,post,fermion))
            else CONFIRMS_FUNCTION.sn(force,chal,post,fermion)
        }
        else CONFIRMS_FUNCTION.sn(force,chal,post,fermion)
    },
    doReset() {
        let br = player.qu.rip.active || tmp.c16active || inDarkRun()
        tmp.supernova.time = 0

        player.atom.points = E(0)
        player.atom.quarks = E(0)
        player.atom.particles = [E(0),E(0),E(0)]
        player.atom.powers = [E(0),E(0),E(0)]
        player.atom.atomic = E(0)
        BUILDINGS.reset('cosmic_ray')
        
        let list_keep = [2,5]
        if (hasTree("qol2")) list_keep.push(6)
        let keep = []
        for (let x = 0; x < player.mainUpg.atom.length; x++) if (list_keep.includes(player.mainUpg.atom[x])) keep.push(player.mainUpg.atom[x])
        if (!hasInfUpgrade(18)) player.mainUpg.atom = keep

        list_keep = [21,36]
        if (player.mainUpg.br.includes(1)) list_keep.push(1)
        if (hasTree("qol1")) list_keep.push(14,18)
        if (hasTree("qol2")) list_keep.push(24)
        if (hasTree("qol3")) list_keep.push(43)
        if (quUnl()) list_keep.push(30)
        keep = []
        for (let x = 0; x < player.atom.elements.length; x++) if (list_keep.includes(player.atom.elements[x]) || player.atom.elements[x] > 86) keep.push(player.atom.elements[x])
        player.atom.elements = keep
        if (hasTree("qu_qol9") && QCs.active() && !player.atom.elements.includes(84)) player.atom.elements.push(84)

        player.md.active = false
        player.md.particles = E(0)
        player.md.mass = E(0)
        for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = E(0)

        player.stars.unls = 0
        player.stars.generators = [E(0),E(0),E(0),E(0),E(0),E(0),E(0),E(0)]
        player.stars.points = E(0)
        BUILDINGS.reset('star_booster')

        if (!hasTree("chal3")) for (let x = 5; x <= 8; x++) player.chal.comps[x] = E(0)

        ATOM.doReset()

        player.supernova.chal.noTick = true
        player.supernova.chal.noBHC = true

        updateTemp()

        tmp.pass = 2
    },
    starGain() {
        let x = E(hasTree("c")?0.1:0)
        if (hasTree("sn1")) x = x.mul(tmp.supernova.tree_eff.sn1)
        if (hasTree("sn2")) x = x.mul(tmp.supernova.tree_eff.sn2)
        if (hasTree("sn3")) x = x.mul(tmp.supernova.tree_eff.sn3)
        if (hasTree("bs3")) x = x.mul(tmp.supernova.tree_eff.bs3)
        if (hasTree("sn5")) x = x.mul(tmp.supernova.tree_eff.sn5)

        let qs = Decimal.pow(1.2,player.qu.times.softcap(1e17,0.1,0))
        if (!hasElement(140) || tmp.c16active) qs = qs.min(1e10)

        if (tmp.qu.mil_reached[6]) x = x.mul(qs.softcap('ee9',0.01,0).softcap('ee10',0.1,0))
        x = x.mul(tmp.radiation.bs.eff[11])
        return x
    },
    req(x=player.supernova.times) {
        ff = tmp.dark.shadowEff.sn||1
        if (tmp.c16active || inDarkRun()) ff /= mgEff(4)[1]

        ml_fp = E(1).mul(tmp.bosons.upgs.gluon[3].effect)
        maxlimit = E(1e20).pow(x.scaleEvery('supernova',false,[1,1,1,1,ff]).div(ml_fp).pow(1.25)).mul(1e90)
        bulk = E(0)
        if (player.stars.points.div(1e90).gte(1)) bulk = player.stars.points.div(1e90).max(1).log(1e20).max(0).root(1.25).mul(ml_fp).scaleEvery('supernova',true,[1,1,1,1,ff]).add(1).floor()
        return {maxlimit: maxlimit, bulk: bulk}
    },
    passiveGain() {
        if (CHALS.inChal(19)) return E(0)
        
        let x = player.stars.points.add(1e10).log10().log10().pow(hasElement(279) ? 3.3 : 3).sub(1)

        x = x.mul(tmp.cs_effect.sn_speed||1).mul(tmp.chal?.eff[19]||1)

        if (hasElement(46,1)) x = x.mul(muElemEff(46))
        if (hasElement(49,1)) x = x.mul(muElemEff(49))
        if (hasElement(274)) x = x.mul(elemEffect(274))
        if (hasUpgrade('br',22)) x = x.mul(tmp.prim.eff[7])
        x = x.mul(theoremEff('time',5))

        return x
    },
}

function calcSupernova(dt) {
    let du_gs = tmp.preQUGlobalSpeed.mul(dt)
    let su = player.supernova

    if (player.build.tickspeed.amt.gte(1)) su.chal.noTick = false
    if (player.build.bhc.amt.gte(1)) su.chal.noBHC = false

    if (tmp.supernova.reached && (tmp.start || su.times.gte(1)) && !su.post_10) {
        if (su.times.lte(0)) tmp.supernova.time += dt
        else {
            addNotify("You become Supernova!")
            SUPERNOVA.reset()
        }
    }
    if (su.times.gte(1) || quUnl()) su.stars = su.stars.add(tmp.supernova.star_gain.mul(dt).mul(tmp.preQUGlobalSpeed))

    if (!su.post_10 && su.times.gte(10)) {
        su.post_10 = true
        createPopup(POPUP_GROUPS.supernova10.html,'post10sn')
    }

    if (su.post_10) for (let x in BOSONS.names) {
        let id = BOSONS.names[x]
        su.bosons[id] = su.bosons[id].add(tmp.bosons.gain[id].mul(du_gs))
    }

    if (su.fermions.unl) {
        let w = hasElement(3,1) ? 7 : 6

        if (tmp.fermions.ch[0] >= 0) {
            su.fermions.tiers[tmp.fermions.ch[0]][tmp.fermions.ch[1]] = su.fermions.tiers[tmp.fermions.ch[0]][tmp.fermions.ch[1]]
            .max(tmp.fermions.tiers[tmp.fermions.ch[0]][tmp.fermions.ch[1]])
        }
        if (tmp.fermions.ch[0] != 0 || tmp.fermions.ch[1] >= 6) if (hasTree("qu_qol8") && !(!hasTree("qu_qol8a")&&QCs.active())) for (let i = 0; i < 2; i++) for (let j = 0; j < w; j++) if (j < FERMIONS.getUnlLength()) {
            su.fermions.tiers[i][j] = su.fermions.tiers[i][j]
            .max(tmp.fermions.tiers[i][j])
        }
        for (let x = 0; x < 2; x++) su.fermions.points[x] = su.fermions.points[x].add(tmp.fermions.gains[x].mul(du_gs))
    }

    if (tmp.radiation.unl) {
        if (!player.qu.en.eth[0]) su.radiation.hz = su.radiation.hz.add(tmp.radiation.hz_gain.mul(du_gs))
        for (let x = 0; x < RAD_LEN; x++) su.radiation.ds[x] = su.radiation.ds[x].add(tmp.radiation.ds_gain[x].mul(du_gs))
    }
}

function updateSupernovaTemp() {
    let c16 = tmp.c16active

    if (tmp.SN_passive) {
        tmp.supernova.reached = false

        tmp.supernova.passive = SUPERNOVA.passiveGain()
    } else {
        let req_data = SUPERNOVA.req()
        tmp.supernova.maxlimit = req_data.maxlimit
        tmp.supernova.bulk = req_data.bulk

        tmp.supernova.reached = tmp.stars?player.stars.points.gte(tmp.supernova.maxlimit):false;
    }

    let no_req1 = hasInfUpgrade(0)
    let can_buy = !CHALS.inChal(19)

    for (let i = 0; i < TREE_TAB.length; i++) {
        tmp.supernova.tree_afford2[i] = []
        for (let j = 0; j < tmp.supernova.tree_had2[i].length; j++) {
            let id = tmp.supernova.tree_had2[i][j]
            let t = TREE_UPGS.ids[id]

            let branch = t.branch||""
            let unl = !t.unl||t.unl()
            let req = !t.req||t.req()
            let bought = player.supernova.tree.includes(id) || player.dark.c16.tree.includes(id)
            if (tmp.qu.mil_reached[1] && NO_REQ_QU.includes(id)) req = true
            if (no_req1 && !CS_TREE.includes(id)) req = true
            let can = can_buy && (t.qf?player.qu.points:t.cs?player.dark.c16.shard:player.supernova.stars).gte(t.cost) && !bought && req
            if (branch != "") for (let x = 0; x < branch.length; x++) if (!(player.supernova.tree.includes(branch[x]) || player.dark.c16.tree.includes(branch[x]))) {
                unl = false
                can = false
                break
            }
            tmp.supernova.tree_unlocked[id] = unl || bought
            tmp.supernova.tree_afford[id] = can
            if (can && unl && !(c16 && CORRUPTED_TREE.includes(id))) tmp.supernova.tree_afford2[i].push(id)
            if (t.effect) {
                tmp.supernova.tree_eff[id] = t.effect()
            }
        }
    }

    tmp.supernova.star_gain = SUPERNOVA.starGain()
}

function updateSupernovaEndingHTML() {
    if (tmp.supernova.reached && tmp.start && player.supernova.times.lte(0) && !player.supernova.post_10) {
        tmp.tab = 5
        document.body.style.backgroundColor = `hsl(0, 0%, ${7-Math.min(tmp.supernova.time/4,1)*7}%)`
        tmp.el.supernova_scene.setDisplay(tmp.supernova.time>4)
        tmp.el.sns1.setOpacity(Math.max(Math.min(tmp.supernova.time-4,1),0))
        tmp.el.sns2.setOpacity(Math.max(Math.min(tmp.supernova.time-7,1),0))
        tmp.el.sns3.setOpacity(Math.max(Math.min(tmp.supernova.time-10,1),0))
        tmp.el.sns4.setOpacity(Math.max(Math.min(tmp.supernova.time-14,1),0))
        tmp.el.sns5.setVisible(tmp.supernova.time>17)
        tmp.el.sns5.setOpacity(Math.max(Math.min(tmp.supernova.time-17,1),0))
    }
    // if ((player.supernova.times.lte(0)?!tmp.supernova.reached:true) || quUnl()) document.body.style.backgroundColor = tmp.tab == 5 ? "#000" : "#111"

    // tmp.el.app_supernova.setDisplay((player.supernova.times.lte(0) ? !tmp.supernova.reached || quUnl() : true) && tmp.tab == 5)

    if (tmp.tab == 5) {
        if (tmp.stab[5] == 0) {
            tmp.el.neutronStar.setTxt(format(player.supernova.stars,2)+" "+formatGain(player.supernova.stars,tmp.supernova.star_gain.mul(tmp.preQUGlobalSpeed)))
            updateTreeHTML()
        }
        if (tmp.stab[5] == 1) updateBosonsHTML()
        if (tmp.stab[5] == 2) updateFermionsHTML()
        if (tmp.stab[5] == 3) updateRadiationHTML()
    }
}