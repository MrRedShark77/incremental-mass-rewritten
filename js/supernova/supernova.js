const SUPERNOVA = {
    reset(force=false, chal=false) {
        if (!chal) if (force?!confirm("Are you sure to reset without being Supernova?"):false) return
        if (tmp.supernova.reached || force) {
            tmp.el.supernova_scene.setDisplay(false)
            if (!force) player.supernova.times = player.supernova.times.add(1)
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
        player.stars.generators = [E(0),E(0),E(0),E(0),E(0),E(0)]
        player.stars.points = E(0)

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
        if (player.supernova.tree.includes("sn4")) x = x.mul(tmp.supernova.tree_eff.sn4)
        return x
    },
}

function calcSupernova(dt, dt_offline) {
    if (player.tickspeed.gte(1)) player.supernova.chal.noTick = false
    if (player.bh.condenser.gte(1)) player.supernova.chal.noBHC = false

    if (tmp.supernova.reached && !tmp.offlineActive) {
        if (player.supernova.times.lte(0)) tmp.supernova.time += dt
        else {
            addNotify("You become Supernova!")
            SUPERNOVA.reset()
        }
    }
    if (player.supernova.times.gte(1)) player.supernova.stars = player.supernova.stars.add(tmp.supernova.star_gain.mul(dt_offline))
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
    tmp.supernova.reached = player.stars.points.gte(tmp.stars?tmp.stars.maxlimit:Infinity);
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
        tmp.el.supernova_rank.setTxt(format(player.supernova.times,0))
        tmp.el.supernova_next.setTxt(format(tmp.stars.maxlimit,2))
        tmp.el.neutronStar.setTxt(format(player.supernova.stars,2)+" "+formatGain(player.supernova.stars,tmp.supernova.star_gain))
        updateTreeHTML()
    }
}
 
