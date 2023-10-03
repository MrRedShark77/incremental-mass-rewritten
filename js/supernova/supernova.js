const SUPERNOVA = {
    reset(force=false, chal=false, post=false, fermion=false) {
        if (force && !chal && !post && !fermion && !quUnl()) createConfirm("Are you sure to restart?",'sn',()=>CONFIRMS_FUNCTION.sn(force,chal,post,fermion))
        else CONFIRMS_FUNCTION.sn(force,chal,post,fermion)
    },
    doReset() {
        let br = tmp.qu.rip.in
        tmp.sn.time = 0
		if (EVO.amt >= 3) {
            let keep = {
                nebula: {},
                ea: player.evo.proto.exotic_atoms
            }
            for (let [ni,x] of Object.entries(player.evo.proto.nebula)) keep.nebula[ni] = ni.includes('ext') ? x : E(0)
            player.evo.proto = OURO.save.evo.proto
            player.evo.proto.exotic_atoms = keep.ea
            player.evo.proto.nebula = keep.nebula
        }

		//Permanent Stuff
        player.atom.quarks = E(0)

        list_keep = [21,36]
        if (EVO.amt >= 4) list_keep.push(14,18,24,30,43)
        else {
            if (hasTree("qol1")) list_keep.push(14,18)
            if (hasTree("qol2")) list_keep.push(24)
            if (hasTree("qol3")) list_keep.push(43)
            if (quUnl()) list_keep.push(30)
        }
        if (hasUpgrade("br",1)) list_keep.push(EVO.amt >= 4 ? 305 : 1)
        keepElementsOnOuroboric(list_keep)

        keep = []
        for (let x of unchunkify(player.atom.elements)) if (list_keep.includes(x) || x > 86 && x <= 290) keep.push(x)
        player.atom.elements = keep
        if (hasTree("qu_qol9") && QCs.active() && !hasElement(84)) player.atom.elements.push(84)

		if (tmp.atom.unl) {
			//Pre-Ouroboric
			player.atom.points = E(0)
			player.atom.particles = [E(0),E(0),E(0)]
			player.atom.powers = [E(0),E(0),E(0)]
			player.atom.atomic = E(0)
			BUILDINGS.reset('cosmic_ray')

			if (!hasInfUpgrade(18)) {
				let list_keep = [2,5,9]
				if (hasTree("qol2")) list_keep.push(3,6)
				resetMainUpgs(3,list_keep)
			}

			player.md.active = false
			player.md.particles = E(0)
			player.md.mass = E(0)
			for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = E(0)

			if (!hasTree("chal3")) for (let x = 5; x <= 8; x++) player.chal.comps[x] = E(0)
			player.supernova.chal.noTick = true
			player.supernova.chal.noBHC = true
		}
		if (tmp.star_unl) {
			player.stars.unls = 0
			player.stars.generators = [E(0),E(0),E(0),E(0),E(0),E(0),E(0),E(0)]
			player.stars.points = E(0)
			BUILDINGS.reset('star_booster')
		}

		tmp.pass = 1
        ATOM.doReset()
    },
    starGain() {
        let x = E(hasTree("c")?0.2:0)
        if (hasTree("sn1")) x = x.mul(treeEff("sn1"))
        if (hasTree("sn2")) x = x.mul(treeEff("sn2"))
        if (hasTree("sn3")) x = x.mul(treeEff("sn3"))
        if (hasTree("bs3")) x = x.mul(treeEff("bs3"))
        if (hasTree("sn5")) x = x.mul(treeEff("sn5"))

        let qs = Decimal.pow(1.2,player.qu.times.softcap(1e17,0.1,0))
        if (!hasElement(140) || tmp.c16.in) qs = qs.min(1e10)

        if (tmp.qu.mil_reached[6]) x = x.mul(qs.softcap('ee9',0.01,0).softcap('ee10',0.1,0))
        x = x.mul(radBoostEff(11))

        if (hasElement(294)) x = x.pow(1.5)

        return x
    },
    req(x=player.supernova.times) {
        ff = tmp.dark.shadowEff.sn||1
        if (tmp.dark.run) ff /= mgEff(4)[1]

        ml_fp = E(1)
		if (tmp.sn.boson) ml_fp = tmp.sn.boson.upgs.gluon[3].effect
        maxlimit = E(1e20).pow(x.scaleEvery('supernova',false,[1,1,1,1,ff]).div(ml_fp).pow(1.25)).mul(1e90)
        bulk = E(0)
        if (player.stars.points.div(1e90).gte(1)) bulk = player.stars.points.div(1e90).max(1).log(1e20).max(0).root(1.25).mul(ml_fp).scaleEvery('supernova',true,[1,1,1,1,ff]).add(1).floor()
        return {maxlimit: maxlimit, bulk: bulk}
    },
    passiveGain() {
        if (CHALS.inChal(19)) return E(0)
        
        let x = player.stars.points.add(1e10).log10().log10().pow(hasElement(279) ? 3.3 : 3).sub(1)

        x = x.mul(CSEffect("sn_speed")).mul(tmp.chal?.eff[19]||1)

        if (hasElement(46,1)) x = x.mul(muElemEff(46))
        if (hasElement(49,1)) x = x.mul(muElemEff(49))
        if (hasElement(274)) x = x.mul(elemEffect(274))
        if (hasElement(304)) x = x.mul(elemEffect(304))
        if (hasUpgrade('br',22)) x = x.mul(tmp.qu.prim.eff[7])
        x = x.mul(theoremEff('time',5)).mul(escrowBoost('sn')).mul(escrowBoost('sn2'))

        return x
    },
}

function calcSupernova(dt) {
    let su = player.supernova
    if (tmp.sn.reached && (tmp.start || su.times.gte(1)) && !su.post_10) {
        if (supernovaAni()) tmp.sn.time += dt
        else {
            addNotify("You become Supernova!")
            SUPERNOVA.reset()
        }
    }
    if (!tmp.sn.unl) return

    let du_gs = tmp.qu.speed.mul(dt)
    if (player.build.tickspeed.amt.gte(1)) su.chal.noTick = false
    if (player.build.bhc.amt.gte(1)) su.chal.noBHC = false

	if (tmp.sn.gen) su.times = su.times.add(tmp.sn.passive.mul(dt))
	else if (hasTree("qu_qol4")) su.times = su.times.max(tmp.sn.bulk)
    if (tmp.sn.unl) su.stars = su.stars.add(tmp.sn.star_gain.mul(dt).mul(tmp.qu.speed))

    if (!su.post_10 && su.times.gte(10)) {
        su.post_10 = true
        createPopup(POPUP_GROUPS.supernova10.html,'post10sn')
    }

	if (su.post_10) {
		for (let x in BOSONS.names) {
			let id = BOSONS.names[x]
			su.bosons[id] = su.bosons[id].add(tmp.sn.boson.gain[id].mul(du_gs))
		}
		if (hasTree("qol7")) {
			for (let x = 0; x < BOSONS.upgs.ids.length; x++) {
				let id = BOSONS.upgs.ids[x]
				for (let y = 0; y < BOSONS.upgs[id].length; y++) BOSONS.upgs.buy(id,y)
			}
		}
	}

    if (su.fermions.unl) {
        let w = hasElement(3,1) ? 7 : 6

        if (tmp.sn.ferm.ch[0] >= 0) {
            su.fermions.tiers[tmp.sn.ferm.ch[0]][tmp.sn.ferm.ch[1]] = su.fermions.tiers[tmp.sn.ferm.ch[0]][tmp.sn.ferm.ch[1]]
            .max(tmp.sn.ferm.tiers[tmp.sn.ferm.ch[0]][tmp.sn.ferm.ch[1]])
        }
        if (tmp.sn.ferm.ch[0] != 0 || tmp.sn.ferm.ch[1] >= 6) if (hasTree("qu_qol8") && !(!hasTree("qu_qol8a")&&QCs.active())) for (let i = 0; i < 2; i++) for (let j = 0; j < w; j++) if (j < FERMIONS.getUnlLength()) {
            let f = FERMIONS.types[i][j]
            if (f.unl && !f.unl()) continue;
            su.fermions.tiers[i][j] = su.fermions.tiers[i][j]
            .max(tmp.sn.ferm.tiers[i][j])
        }
        for (let x = 0; x < 2; x++) su.fermions.points[x] = su.fermions.points[x].add(tmp.sn.ferm.gains[x].mul(du_gs))
    }

    if (hasTree("unl1")) {
        if (!player.qu.en.eth[0]) su.radiation.hz = su.radiation.hz.add(tmp.sn.rad.hz_gain.mul(du_gs))
        for (let x = 0; x < RAD_LEN; x++) su.radiation.ds[x] = su.radiation.ds[x].add(tmp.sn.rad.ds_gain[x].mul(du_gs))
		RADIATION.autoBuyBoosts()
    }
}

function updateSupernovaTemp() {
	if (EVO.amt >= 4) {
		tmp.sn = {}
		return
	}

	let tsn = tmp.sn
    tsn.unl = EVO.amt < 4 && (player.supernova.times.gte(1) || quUnl())
    tsn.gen = hasElement(36,1)
    if (tsn.gen) {
        tsn.reached = false
        tsn.passive = SUPERNOVA.passiveGain()
    } else {
        let req_data = SUPERNOVA.req()
        tsn.maxlimit = req_data.maxlimit
        tsn.bulk = req_data.bulk
        tsn.reached = tmp.stars?player.stars.points.gte(tsn.maxlimit):false;
    }
	if (tsn.tree_eff == undefined) {
		tsn.time = 0
		tsn.tree_tab = 0
		tsn.tree_choosed = ""
		tsn.tree_had = []
		tsn.tree_had2 = []
		tsn.auto_tree = []
		tsn.tree_eff = {}
		tsn.tree_unlocked = {}
		tsn.tree_afford = {}
		tsn.tree_afford2 = []
		tsn.tree_loc = {}
		for (let j = 0; j < TREE_TAB.length; j++) {
			tsn.tree_had2[j] = []
			tsn.tree_afford2[j] = []
		}
		for (let i = 0; i < TREE_IDS.length; i++) {
			for (let j = 0; j < TREE_TAB.length; j++) {
				for (let k = 0; k < TREE_IDS[i][j].length; k++) {
					let id = TREE_IDS[i][j][k]
					if (id != "") {
						let u = TREE_UPGS.ids[id]
						tsn.tree_had2[j].push(id)
						tsn.tree_had.push(id)
					}
				}
			}
		}
	}

	updateRadiationTemp()
	updateFermionsTemp()
    updateBosonsTemp()
	updateTreeTemp()
}

function supernovaAni() {
	return tmp.sn.reached && !tmp.sn.unl && !OURO.unl
}

function updateSupernovaEndingHTML() {
    if (tmp.sn.reached && tmp.start && supernovaAni()) {
        tmp.tab = 5
        tmp.stab[5] ||= 0
        document.body.style.backgroundColor = `hsl(0, 0%, ${7-Math.min(tmp.sn.time/2,1)*7}%)`
        tmp.el.supernova_scene.setDisplay(tmp.sn.time>2)
        tmp.el.sns1.setOpacity(Math.max(Math.min(tmp.sn.time-2,1),0))
        tmp.el.sns2.setOpacity(Math.max(Math.min(tmp.sn.time-2.5,1),0))
        tmp.el.sns3.setOpacity(Math.max(Math.min(tmp.sn.time-3,1),0))
        tmp.el.sns4.setOpacity(Math.max(Math.min(tmp.sn.time-3.5,1),0))
        tmp.el.sns5.setVisible(tmp.sn.time>4)
        tmp.el.sns5.setOpacity(Math.max(Math.min(tmp.sn.time-4,1),0))
        return
    }

    if (tmp.tab_name == "sn-tree") {
        tmp.el.neutronStar.setTxt(format(player.supernova.stars,2)+" "+formatGain(player.supernova.stars,tmp.sn.star_gain.mul(tmp.qu.speed)))
        updateTreeHTML()
    }
    else if (tmp.tab_name == "boson") updateBosonsHTML()
    else if (tmp.tab_name == "ferm") updateFermionsHTML()
    else if (tmp.tab_name == "rad") updateRadiationHTML()
}