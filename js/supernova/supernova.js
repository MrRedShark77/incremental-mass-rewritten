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
        return x
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
        if (tmp.fermions.ch[0] >= 0) player.supernova.fermions.tiers[tmp.fermions.ch[0]][tmp.fermions.ch[1]] = player.supernova.fermions.tiers[tmp.fermions.ch[0]][tmp.fermions.ch[1]]
        .max(tmp.fermions.tiers[tmp.fermions.ch[0]][tmp.fermions.ch[1]])
        for (let x = 0; x < 2; x++) player.supernova.fermions.points[x] = player.supernova.fermions.points[x].add(tmp.fermions.gains[x].mul(dt))
    }
}

function updateSupernovaTemp() {
    if (!tmp.supernova) {
        tmp.supernova = {
            time: 0,
            tree_choosed: "",
            tree_had: [],
            tree_eff: {},
            tree_unlocked: {},
            tree_afford: {},
        }
        for (let i = 0; i < 19; i++) {
            for (let j = 0; j < 19; j++) {
                let id = TREE_IDS[i][j]
                if (TREE_UPGS.ids[id]) tmp.supernova.tree_had.push(id)
            }
        }
    }
    tmp.supernova.reached = tmp.stars?player.stars.points.gte(tmp.supernova.maxlimit):false;

    tmp.supernova.ml_fp = E(1).mul(tmp.bosons.upgs.gluon[3].effect)
    tmp.supernova.maxlimit = E(1e20).pow(player.supernova.times.div(tmp.supernova.ml_fp).pow(1.25)).mul(1e90)
    tmp.supernova.bulk = player.stars.points.div(1e90).max(1).log(1e20).max(0).root(1.25).mul(tmp.supernova.ml_fp).add(1).floor()
    if (player.stars.points.div(1e90).lt(1)) tmp.supernova.bulk = E(0)
    if (scalingActive("supernova", player.supernova.times.max(tmp.supernova.bulk), "super")) {
		let start = getScalingStart("super", "supernova");
		let power = getScalingPower("super", "supernova");
		let exp = E(3).pow(power);
		tmp.supernova.maxlimit =
			E(1e20).pow(
                player.supernova.times
                .pow(exp)
			    .div(start.pow(exp.sub(1))).div(tmp.supernova.ml_fp)
                .pow(1.25)
            ).mul(1e90).floor()
        tmp.supernova.bulk = player.stars.points
            .div(1e90)
            .max(1)
            .log(1e20)
            .root(1.25).mul(tmp.supernova.ml_fp)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
			.add(1)
			.floor();
	}

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
    }
}