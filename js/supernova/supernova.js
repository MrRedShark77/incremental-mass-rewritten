const SUPERNOVA = {
    reset(force=false, chal=false, post=false, fermion=false) {
        if (!chal && !post && !fermion) if ((force && player.confirms.sn)?!confirm("Are you sure to reset without being Supernova?"):false) return
        if (tmp.supernova.reached || force || fermion) {
            tmp.el.supernova_scene.setDisplay(false)
            if (!force && !fermion) {
                player.supernova.times = player.supernova.post_10 ? player.supernova.times.max(tmp.supernova.bulk) : player.supernova.times.add(1)
            }
            tmp.pass = true
            this.doReset()
        }
    },
    doReset() {
        tmp.supernova.time = 0

        player.atom.points = E(0)
        player.atom.quarks = E(0)
        player.atom.particles = [E(0),E(0),E(0)]
        player.atom.powers = [E(0),E(0),E(0)]
        player.atom.atomic = E(0)
        player.atom.gamma_ray = E(0)
        
        let list_keep = [2,5]
        if (player.supernova.tree.includes("qol2")) list_keep.push(6)
        let keep = []
        for (let x = 0; x < player.mainUpg.atom.length; x++) if (list_keep.includes(player.mainUpg.atom[x])) keep.push(player.mainUpg.atom[x])
        player.mainUpg.atom = keep

        list_keep = [21,36]
        if (player.supernova.tree.includes("qol1")) list_keep.push(14,18)
        if (player.supernova.tree.includes("qol2")) list_keep.push(24)
        if (player.supernova.tree.includes("qol3")) list_keep.push(43)
        keep = []
        for (let x = 0; x < player.atom.elements.length; x++) if (list_keep.includes(player.atom.elements[x])) keep.push(player.atom.elements[x])
        player.atom.elements = keep

        player.md.active = false
        player.md.particles = E(0)
        player.md.mass = E(0)
        for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = E(0)

        player.stars.unls = 0
        player.stars.generators = [E(0),E(0),E(0),E(0),E(0)]
        player.stars.points = E(0)
        player.stars.boost = E(0)

        if (!player.supernova.tree.includes("chal3")) for (let x = 5; x <= 8; x++) player.chal.comps[x] = E(0)

        ATOM.doReset()

        player.supernova.chal.noTick = true
        player.supernova.chal.noBHC = true

        tmp.pass = false
    },
    starGain() {
        let x = E(player.supernova.tree.includes("c")?0.1:0)
        if (player.supernova.tree.includes("sn1")) x = x.mul(tmp.supernova.tree_eff.sn1)
        if (player.supernova.tree.includes("sn2")) x = x.mul(tmp.supernova.tree_eff.sn2)
        if (player.supernova.tree.includes("sn3")) x = x.mul(tmp.supernova.tree_eff.sn3)
        if (player.supernova.tree.includes("bs3")) x = x.mul(tmp.supernova.tree_eff.bs3)
        x = x.mul(tmp.radiation.bs.eff[11])
        return x
    },
    req(x=player.supernova.times) {
        ml_fp = E(1).mul(tmp.bosons.upgs.gluon[3].effect)
        maxlimit = E(1e20).pow(x.div(ml_fp).pow(1.25)).mul(1e90)
        bulk = player.stars.points.div(1e90).max(1).log(1e20).max(0).root(1.25).mul(ml_fp).add(1).floor()
        if (player.stars.points.div(1e90).lt(1)) bulk = E(0)
        if (scalingActive("supernova", x.max(bulk), "super")) {
            let start = getScalingStart("super", "supernova");
            let power = getScalingPower("super", "supernova");
            let exp = E(3).pow(power);
            maxlimit =
                E(1e20).pow(
                    x
                    .pow(exp)
                    .div(start.pow(exp.sub(1))).div(ml_fp)
                    .pow(1.25)
                ).mul(1e90).floor()
            bulk = player.stars.points
                .div(1e90)
                .max(1)
                .log(1e20)
                .root(1.25).mul(ml_fp)
                .mul(start.pow(exp.sub(1)))
                .root(exp)
                .add(1)
                .floor();
        }
        if (scalingActive("supernova", x.max(bulk), "hyper")) {
            let start = getScalingStart("super", "supernova");
            let power = getScalingPower("super", "supernova");
            let exp = E(3).pow(power);
            let start2 = getScalingStart("hyper", "supernova");
            let power2 = getScalingPower("hyper", "supernova");
            let exp2 = E(3).pow(power2);
            maxlimit =
                E(1e20).pow(
                    x
                    .pow(exp2)
                    .div(start2.pow(exp2.sub(1)))
                    .pow(exp)
                    .div(start.pow(exp.sub(1))).div(ml_fp)
                    .pow(1.25)
                ).mul(1e90).floor()
            bulk = player.stars.points
                .div(1e90)
                .max(1)
                .log(1e20)
                .root(1.25).mul(ml_fp)
                .mul(start.pow(exp.sub(1)))
                .root(exp)
                .mul(start2.pow(exp2.sub(1)))
                .root(exp2)
                .add(1)
                .floor();
        }
        if (scalingActive("supernova", x.max(bulk), "ultra")) {
            let start = getScalingStart("super", "supernova");
            let power = getScalingPower("super", "supernova");
            let exp = E(3).pow(power);
            let start2 = getScalingStart("hyper", "supernova");
            let power2 = getScalingPower("hyper", "supernova");
            let exp2 = E(3).pow(power2);
            let start3 = getScalingStart("ultra", "supernova");
            let power3 = getScalingPower("ultra", "supernova");
            let exp3 = E(5).pow(power3);
            maxlimit =
                E(1e20).pow(
                    x
                    .pow(exp3)
                    .div(start3.pow(exp3.sub(1)))
                    .pow(exp2)
                    .div(start2.pow(exp2.sub(1)))
                    .pow(exp)
                    .div(start.pow(exp.sub(1))).div(ml_fp)
                    .pow(1.25)
                ).mul(1e90).floor()
            bulk = player.stars.points
                .div(1e90)
                .max(1)
                .log(1e20)
                .root(1.25).mul(ml_fp)
                .mul(start.pow(exp.sub(1)))
                .root(exp)
                .mul(start2.pow(exp2.sub(1)))
                .root(exp2)
                .mul(start3.pow(exp3.sub(1)))
                .root(exp3)
                .add(1)
                .floor();
        }
        if (scalingActive("supernova", x.max(bulk), "meta")) {
            let start = getScalingStart("super", "supernova");
            let power = getScalingPower("super", "supernova");
            let exp = E(3).pow(power);
            let start2 = getScalingStart("hyper", "supernova");
            let power2 = getScalingPower("hyper", "supernova");
            let exp2 = E(3).pow(power2);
            let start3 = getScalingStart("ultra", "supernova");
            let power3 = getScalingPower("ultra", "supernova");
            let exp3 = E(5).pow(power3);
            let start4 = getScalingStart("meta", "supernova");
            let power4 = getScalingPower("meta", "supernova");
            let exp4 = E(1.025).pow(power4);
            maxlimit =
                E(1e20).pow(
                    exp4.pow(x.sub(start4)).mul(start4)
                    .pow(exp3)
                    .div(start3.pow(exp3.sub(1)))
                    .pow(exp2)
                    .div(start2.pow(exp2.sub(1)))
                    .pow(exp)
                    .div(start.pow(exp.sub(1))).div(ml_fp)
                    .pow(1.25)
                ).mul(1e90).floor()
            bulk = player.stars.points
                .div(1e90)
                .max(1)
                .log(1e20)
                .root(1.25).mul(ml_fp)
                .mul(start.pow(exp.sub(1)))
                .root(exp)
                .mul(start2.pow(exp2.sub(1)))
                .root(exp2)
                .mul(start3.pow(exp3.sub(1)))
                .root(exp3)
                .div(start4)
			    .max(1)
			    .log(exp4)
			    .add(start4)
                .add(1)
                .floor();
        }
        return {maxlimit: maxlimit, bulk: bulk}
    },
}

function calcSupernova(dt, dt_offline) {
    if (player.tickspeed.gte(1)) player.supernova.chal.noTick = false
    if (player.bh.condenser.gte(1)) player.supernova.chal.noBHC = false

    if (tmp.supernova.reached && (!tmp.offlineActive || player.supernova.times.gte(1)) && !player.supernova.post_10) {
        if (player.supernova.times.lte(0)) tmp.supernova.time += dt
        else {
            addNotify("You become Supernova!")
            SUPERNOVA.reset()
        }
    }
    if (player.supernova.times.gte(1)) player.supernova.stars = player.supernova.stars.add(tmp.supernova.star_gain.mul(dt_offline))

    if (!player.supernova.post_10 && player.supernova.times.gte(10)) {
        player.supernova.post_10 = true
        addPopup(POPUP_GROUPS.supernova10)
    }

    if (player.supernova.post_10) for (let x in BOSONS.names) {
        let id = BOSONS.names[x]
        player.supernova.bosons[id] = player.supernova.bosons[id].add(tmp.bosons.gain[id].mul(dt))
    }

    if (player.supernova.fermions.unl) {
        if (tmp.fermions.ch[0] >= 0) {
            let maxTier = tmp.fermions.maxTier[tmp.fermions.ch[0]][tmp.fermions.ch[1]]
            player.supernova.fermions.tiers[tmp.fermions.ch[0]][tmp.fermions.ch[1]] = player.supernova.fermions.tiers[tmp.fermions.ch[0]][tmp.fermions.ch[1]]
            .max(tmp.fermions.tiers[tmp.fermions.ch[0]][tmp.fermions.ch[1]]).min(maxTier)
        }
        for (let x = 0; x < 2; x++) player.supernova.fermions.points[x] = player.supernova.fermions.points[x].add(tmp.fermions.gains[x].mul(dt))
    }

    if (tmp.radiation.unl) {
        player.supernova.radiation.hz = player.supernova.radiation.hz.add(tmp.radiation.hz_gain.mul(dt))
        for (let x = 0; x < RAD_LEN; x++) player.supernova.radiation.ds[x] = player.supernova.radiation.ds[x].add(tmp.radiation.ds_gain[x].mul(dt))
    }
}

function updateSupernovaTemp() {
    let req_data = SUPERNOVA.req()
    tmp.supernova.maxlimit = req_data.maxlimit
    tmp.supernova.bulk = req_data.bulk

    tmp.supernova.reached = tmp.stars?player.stars.points.gte(tmp.supernova.maxlimit):false;

    for (let x = 0; x < tmp.supernova.tree_had.length; x++) {
        let id = tmp.supernova.tree_had[x]
        let branch = TREE_UPGS.ids[id].branch||""
        let unl = TREE_UPGS.ids[id].unl?TREE_UPGS.ids[id].unl():true
        let can = player.supernova.stars.gte(TREE_UPGS.ids[id].cost) && !player.supernova.tree.includes(id) && (TREE_UPGS.ids[id].req?TREE_UPGS.ids[id].req():true)
        if (branch != "") for (let x = 0; x < branch.length; x++) if (!player.supernova.tree.includes(branch[x])) {
            unl = false
            can = false
            break
        }
        tmp.supernova.tree_unlocked[id] = unl
        tmp.supernova.tree_afford[id] = can
        if (TREE_UPGS.ids[id].effect) tmp.supernova.tree_eff[id] = TREE_UPGS.ids[id].effect()
    }
    tmp.supernova.star_gain = SUPERNOVA.starGain()
}

function updateSupernovaEndingHTML() {
    if (tmp.supernova.reached && !tmp.offlineActive && player.supernova.times.lte(0)) {
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
    if (player.supernova.times.lte(0)?!tmp.supernova.reached:true) document.body.style.backgroundColor = tmp.tab == 5 ? "#000" : "#111"

    tmp.el.app_supernova.setDisplay((player.supernova.times.lte(0) ? !tmp.supernova.reached : true) && tmp.tab == 5)

    if (tmp.tab == 5) {
        tmp.el.supernova_scale.setTxt(getScalingName('supernova'))
        tmp.el.supernova_rank.setTxt(format(player.supernova.times,0))
        tmp.el.supernova_next.setTxt(format(tmp.supernova.maxlimit,2))
        if (tmp.stab[5] == 0) {
            tmp.el.neutronStar.setTxt(format(player.supernova.stars,2)+" "+formatGain(player.supernova.stars,tmp.supernova.star_gain))
            updateTreeHTML()
        }
        if (tmp.stab[5] == 1) updateBosonsHTML()
        if (tmp.stab[5] == 2) updateFermionsHTML()
        if (tmp.stab[5] == 3) updateRadiationHTML()
    }
}