const INF = {
	get save() {
		let s = {
			inf: {
				theorem: E(0),
				total: E(0),
				points: E(0),
				best: E(0),
				reached: false,

				core: [],
				inv: [],
				upg: [],
				fragment: {},

				pre_theorem: [],
				pt_choosed: -1,
				reroll: E(0),

				dim_mass: E(0),

				cs_amount: E(0),
				cs_double: [E(0),E(0)],
			},
			ascensions: new Array(ASCENSIONS.names.length).fill(E(0)),
			asc_reward: 0,

			gal_prestige: E(0),
			gp_resources: new Array(GAL_PRESTIGE.res_length).fill(E(0)),
		}
		for (let i in CORE) s.inf.fragment[i] = E(0)
		return s
	},
	load(force) {
		let unl = force ?? (player.inf && E(player.inf.theorem).gt(0))
		if (unl) player = deepUndefinedAndDecimal(player, this.save)
		else for (var i in this.save) {
			if (!["asc_reward"].includes(i)) delete player[i]
		}

		tmp.inf_unl = unl
		if (!unl) return

		for (let x in player.inf.core) {
			let c = player.inf.core[x]
			if (c) {
				c.level = E(c.level)
				c.power = E(c.power)
			}
		}
		for (let x in player.inf.inv) {
			let c = player.inf.inv[x]
			if (c) {
				c.level = E(c.level)
				c.power = E(c.power)
			}
		}
		for (let x = 0; x < 4; x++) {
			let t = player.inf.pre_theorem[x]
			if (t) t.power_m = E(t.power_m)
		}

		if (player.inf.pre_theorem.length == 0) generatePreTheorems()
		let tt = {}
		for (let i = 0; i < player.inf.core.length; i++) {
			if (!player.inf.core[i]) continue

			let t = player.inf.core[i].type
			if (!tt[t]) tt[t] = 1
			else tt[t]++

			if (tt[t]>1) {
				for (let j = 0; j < MAX_INV_LENGTH; j++) if (!player.inf.inv[j]) {
					player.inf.inv[j] = player.inf.core[i]
					player.inf.core[i] = undefined
					break
				}

				tt[t]--
			}
		}
		updateInfTemp()
	},

    doReset() {
        player.mass = E(0)

        // QoL
        let iu11 = hasInfUpgrade(11), iu15 = hasInfUpgrade(15)
        if (!hasInfUpgrade(18) || CHALS.inChal(20)) {
            resetMainUpgs(1,[3])
            resetMainUpgs(2,[5,6])
            resetMainUpgs(3,[1,2,6])
        }
        if (!iu11) resetMainUpgs(4,[8])

        let e = [14,18,24,30,122,124,131,136,143,194]
        keepElementsOnOuroboric(e)
        if (hasInfUpgrade(2)) e.push(202)
        if (hasInfUpgrade(3)) e.push(161)
        if (iu15) e.push(218)
        for (let i of unchunkify(player.atom.elements)) if (i > 218 && i <= 290) e.push(i)

        player.atom.elements = e
        player.atom.muonic_el = unchunkify(player.atom.muonic_el).filter(x => MUONIC_ELEM.upgs[x].cs || x > 66)

        for (let x = 1; x <= (hasElement(229) ? 15 : 16); x++) player.chal.comps[x] = E(0)

        player.ranks.beyond = E(0)
        for (let x = 0; x < PRESTIGES.names.length; x++) player.prestiges[x] = E(0)

		// Ouroboric
        if (OURO.unl) resetEvolutionSave("inf")

        // Reset
        player.ranks[RANKS.names[RANKS.names.length-1]] = E(0)
        RANKS.doReset[RANKS.names[RANKS.names.length-1]]()

		if (tmp.rp.unl) {
			player.rp.points = E(0)
			BUILDINGS.reset('tickspeed')
			BUILDINGS.reset('accelerator')
		}
		if (tmp.bh.unl) {
			player.bh.mass = E(0)
			player.bh.dm = E(0)
			BUILDINGS.reset('bhc')

			if (!hasElement(242)) BUILDINGS.reset('fvm')
			player.bh.unstable = E(0)
		}

		player.atom.points = E(0)
		player.atom.quarks = E(0)
		if (tmp.atom.unl) {
			player.atom.atomic = E(0)
			player.atom.particles = [E(0),E(0),E(0)]
			player.atom.powers = [E(0),E(0),E(0)]
			player.atom.atomic = E(0)
			BUILDINGS.reset('cosmic_ray')

			player.md.active = false
			player.md.particles = E(0)
			player.md.mass = E(0)
			for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = E(0)
		}

		if (tmp.sn.unl) {
			player.stars.unls = 0
			player.stars.generators = [E(0),E(0),E(0),E(0),E(0),E(0),E(0),E(0)]
			player.stars.points = E(0)
			BUILDINGS.reset('star_booster')

			tmp.sn.time = 0
			player.supernova.chal.noTick = true
			player.supernova.chal.noBHC = true

			if (CHALS.inChal(19) || !hasElement(47,1)) player.supernova.times = E(0)
			player.supernova.stars = E(0)
			player.supernova.tree = ["qu_qol1", "qu_qol2", "qu_qol3", "qu_qol4", "qu_qol5", "qu_qol6", "qu_qol7", "qu_qol8", "qu_qol9", "qu_qol8a", "unl1", "unl2", "unl3", "unl4",
			"qol1", "qol2", "qol3", "qol4", "qol5", "qol6", "qol7", "qol8", "qol9", 'qu_qol10', 'qu_qol11', 'qu_qol12', 'qu0']

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

			for (let x = 0; x < 2; x++) for (let y = 0; y < 7; y++) player.supernova.fermions.tiers[x][y] = E(0)

			player.supernova.radiation.hz = hasUpgrade('br',6)?E(1e50):E(0)
			for (let x = 0; x < 7; x++) {
				player.supernova.radiation.ds[x] = E(0)
				for (let y = 0; y < 2; y++) player.supernova.radiation.bs[2*x+y] = E(0)
			}
		}

        // Quantum
        let qu = player.qu
        let quSave = getQUSave()

        qu.times = E(10)
        qu.points = E(0)
        qu.bp = E(0)
        qu.chroma = [E(0),E(0),E(0)]
        
        BUILDINGS.reset('cosmic_string')

        qu.prim.theorems = E(0)
        qu.prim.particles = [E(0),E(0),E(0),E(0),E(0),E(0),E(0),E(0)]

        qu.en.amt = E(0)
        qu.en.eth = quSave.en.eth
        qu.en.hr = quSave.en.hr
        qu.en.rewards = quSave.en.rewards

        qu.rip.active = false
        qu.rip.amt = E(0)

		if (tmp.atom.unl) {
			let bmd = player.md.break
			if (!iu11) bmd.active = false
			bmd.energy = E(0)
			bmd.mass = E(0)
			for (let x = 0; x < 12; x++) if (x != 10) bmd.upgs[x] = E(0)
		}

        // Dark Reset
        let dark = player.dark
        let darkSave = getDarkSave()

        dark.rays = hasInfUpgrade(7)?E(1e12):E(0)
        dark.shadow = E(0)
        dark.abyssalBlot = E(0)

        dark.run.active = false
        dark.run.glyphs = [E(0),E(0),E(0),E(0),E(0),E(0)]
        if (!hasInfUpgrade(3)) dark.run.upg = []

        dark.matters = darkSave.matters

        if (iu15) {
            darkSave.c16.first = true
            darkSave.c16.bestBH = dark.c16.bestBH
            darkSave.c16.charger = dark.c16.charger
        }

        dark.c16 = darkSave.c16

        if (hasInfUpgrade(8)) {
            for (let i = 0; i < infUpgEffect(8); i++) dark.c16.tree.push(...TREE_IDS[i][5])
        }

        dark.exotic_atom = darkSave.exotic_atom

        // Other
        if (!hasInfUpgrade(11)) {
            tmp.ranks.tab = 0
            tmp.stab[4] = 0
        }
        
        tmp.stab[7] = 0

        if (!iu15) {
            player.atom.elemTier[0] = 1
            player.atom.elemLayer = 0
            updateMuonSymbol()
        }

        tmp.pass = 1

        // Infinity
		if (!tmp.inf_unl) return
        player.inf.reached = false
        player.inf.dim_mass = E(0)
        player.inf.cs_amount = E(0)

        player.inf.pt_choosed = -1
        generatePreTheorems()

        for (let i = 0; i < GAL_PRESTIGE.res_length; i++) player.gp_resources[i] = E(0)
    },
    req: E(10).pow(Number.MAX_VALUE),
    limit() {
		if (!tmp.inf_unl) return this.req
        return E(10).pow(E(10).pow(Decimal.pow(1.05,player.inf.theorem.scaleEvery('inf_theorem').pow(1.25)).mul(Math.log10(Number.MAX_VALUE))))
    },
    goInf(limit=false) {
        if (player.mass.gte(this.req)) {
            if (limit || player.inf.pt_choosed >= 0 || hasElement(239)) CONFIRMS_FUNCTION.inf(limit)
            else createConfirm(`Are you sure you want to go infinity without selecting any theorem?`,'inf',()=>{CONFIRMS_FUNCTION.inf(limit)})
        }
    },
    level() {
        let s = player.mass.add(1).log10().add(1).log10().div(308).max(1).log(1.1).add(1)
        s = s.mul(E(tmp.c16.best_bh_eff||1).div(3.5e6).max(1).log(1.1).add(1))

        if (hasElement(16,1)) s = s.mul(player.inf.dim_mass.add(1).log(1e6).add(1))
        return s.max(1).root(2).softcap(tmp.inf_level_ss,1/3,0)
    },
    gain() {
        if (player.mass.lt(this.req)) return E(0)
        let x = player.mass.add(1).log10().add(1).log10().sub(307).root(hasInfUpgrade(20) ? 1.9 : 2).div(2)
        x = E(10).pow(x.sub(1))

        if (hasInfUpgrade(5)) x = x.mul(infUpgEffect(5))
        if (hasElement(17,1)) x = x.mul(muElemEff(17))
        if (hasElement(20,1)) x = x.mul(muElemEff(20))
        if (hasElement(282)) x = x.mul(elemEffect(282))

        if (hasBeyondRank(8,1)) x = x.mul(beyondRankEffect(8,1))

        if (hasUpgrade('rp',25)) x = x.mul(upgEffect(1,25))
        if (hasUpgrade('bh',25)) x = x.mul(upgEffect(2,25))
        if (hasUpgrade('atom',25)) x = x.mul(upgEffect(3,25))

        if (hasElement(302)) x = x.mul(elemEffect(302))

        return x.max(1).floor()
    },

    upgs: [
        [
            {
                title: "Require-Free Tree",
                desc: "Upgrades in pre-corrupted tree can be bought without their requirement.",
                cost: E(1),
            },{
                title: "Infinity Mass",
                desc: "Normal mass & BH mass gains are boosted by total infinity points.",
                cost: E(1),
                effect() {
                    let x = player.inf.total
                    return [x.add(1).pow(2).softcap(1e3,0.5,0),overflow(x.add(1).softcap(10,0.5,0),10,0.5)]
                },
                effectDesc: x => "^"+x[0].format(0)+" to normal mass"+x[0].softcapHTML(1e3)+"; ^"+x[1].format(0)+" to BH mass",
            },{
                title: "Legacy Mass Upgrade 4",
                desc: "Start with overpower unlocked, its starting cost is massively decreased (likewise, start with Binilbium-202 unlocked).",
                cost: E(1),
            },{
                title: "Dark Rest",
                desc: "Keep glyph upgrades on infinity (likewise, start with Unhexunium-161 unlocked).",
                cost: E(1),
            },
        ],[
            {
                title: "Tree Automation",
                desc: "Automate pre-corrupted tree.",
                cost: E(3),
            },{
                title: "Self-Infinity",
                desc: "Infinity theorem boosts infinity points gain.",
                cost: E(10),
                effect() {
                    let x = Decimal.pow(hasBeyondRank(6,1)?3:2,player.inf.theorem)
                    return x
                },
                effectDesc: x => formatMult(x,0),
            },{
                title: "Stop Big Rip Switching",
                desc: "Pre-218 big rip elements are now affordable outside Big Rip. Automate elements tier 2 (119th-218th).",
                cost: E(3),
            },{
                title: "Dark Passive",
                desc: "Start with more dark rays (like dark ray’s first reward unlocked).",
                cost: E(3),
            },
        ],[
            {
                title: "Corrupted Construction",
                desc: "Start with rows of upgrades bought in corrupted tree (based on infinity theorems, starting at 2, ending at 5).",
                cost: E(100),
                effect() {
                    let x = Math.min(player.inf.theorem, 4)
                    return x
                },
                effectDesc: x => "Row 1-"+x+" of upgrades",
            },{
                title: "Parallel Extruder",
                desc: "Unlock new generator in Main tab. Also, passively generate Dimensional Mass that increases meta-score of equipped theorems.",
                cost: E(2e3),
            },{
                title: "Final Star Automation",
                desc: "Automate final star shard, and it doesn’t reset anything. Also, start with beyond-ranks automation.",
                cost: E(100),
            },{
                title: "Lethal Universe",
                desc: "Keep big rip upgrades and breaking dilation on infinity.",
                cost: E(50),
            },
        ],[
            {
                title: "Dark Challenge Automation",
                desc: "Automate challenges 13-15.",
                cost: E(6e6),
            },{
                title: "Exotic Speed",
                desc: "Infinity Theorems boost kaon and pion gains.",
                cost: E(6e6),
                effect() {
                    let x = Decimal.pow(hasBeyondRank(6,1)?3:2,player.inf.theorem)

                    return x
                },
                effectDesc: x => formatMult(x,0),
            },{
                title: "Muonic Automation",
                get desc() { return `Automate muonic elements and ${EVO.amt >= 3 ? `exotic nebulae` : `muon-catalyzed fusion`}.` },
                cost: E(6e6),
            },{
                title: "Corrupted Peak",
                desc: "Start with C16 unlocked. Keep corruption upgrades and best BH in C16 on infinity. Unlock more corruption upgrades.",
                cost: E(6e6),
            },
        ],[
            {
                title: "Break Infinity",
                desc: "Remove the mass limit (can lift limitlessly). Unlock Element Tier 3 and new Muonic Elements.",
                cost: E(1e12),
            },
        ],[
            {
                title: "Extraordinary Matters",
                desc: "Every matter upgrade (except red matter) now provides an additional boost to previous matter.",
                cost: E(1e145),
            },{
                title: `'Permanent' Upgrades`,
                desc: "Keep main upgrades on Infinity reset.",
                cost: E(1e155),
            },{
                title: "Blackest Challenges",
                desc: "Remove the cap of Challenge 13-15 completions.",
                cost: E(1e190),
            },{
                title: "Better Infinity",
                desc: "Improve Infinity Points formula.",
                get cost() { return EVO.amt == 3 ? E(1e220) : EVO.amt == 2 ? E(1e204) : E(1e225) },
            },
        ],
    ],

    upg_row_req: [
        1,
        2,
        2,
        6,
        9,
        20,
    ],

    dim_mass: {
        gain() {
            if (!hasInfUpgrade(9)) return E(0)

            let x = BUILDINGS.eff('pe')

            if (hasElement(244)) x = x.mul(elemEffect(244))

            return x
        },
        effect() {
            let x = player.inf.dim_mass.add(1).log10().pow(hasElement(244)?2.2:2)
            if (hasElement(289)) x = x.pow(1.2)

            return x.div(10)
        },
    },
}

const IU_LENGTH = (()=>{
    let n = 0
    for (let x in INF.upgs) n += INF.upgs[x].length
    return n
})()

function generatePreTheorems() {
    for (let i = 0; i < 4; i++) player.inf.pre_theorem[i] = createPreTheorem()
}

function hasInfUpgrade(i) { return tmp.inf_unl && player.inf.upg.includes(i) }

function buyInfUpgrade(r,c) {
    let id = r*4+c
    if (r > 4) id -= 3

    if (hasInfUpgrade(id)) return

    let u = INF.upgs[r][c]
    let cost = u.cost

    if (player.inf.points.gte(cost) && player.inf.theorem.gte(INF.upg_row_req[r])) {
        player.inf.upg.push(id)
        player.inf.points = player.inf.points.sub(cost).max(0).round()

        if (r == 4 && c == 0) addQuote(12)
    }
}

function infUpgEffect(i,def=1) { return tmp.iu_eff[i] || def }

function updateInfTemp() {
    tmp.IP_gain = INF.gain()
    tmp.inf_limit = INF.limit()
    tmp.inf_reached = player.mass.gte(tmp.inf_limit)
	if (!tmp.inf_unl) return

    updateAscensionsTemp()
    updateGPTemp()
    updateCSTemp()
    tmp.dim_mass_gain = INF.dim_mass.gain()
    tmp.dim_mass_eff = INF.dim_mass.effect()

    for (let r in INF.upgs) {
        r = parseInt(r)

        let ru = INF.upgs[r]

        for (let c in ru) {
            c = parseInt(c)

            let u = ru[c]
            let id = r*4+c
            if (r > 4) id -= 3

            if (u.effect) tmp.iu_eff[id] = u.effect()
        }
    }
    updateCoreTemp()

    tmp.inf_level_ss = E(5)
    if (hasElement(222)) tmp.inf_level_ss = tmp.inf_level_ss.add(5)
    if (hasElement(235)) tmp.inf_level_ss = tmp.inf_level_ss.add(5)
    if (tmp.chal) tmp.inf_level_ss = tmp.inf_level_ss.add(tmp.chal.eff[17]||0)
}

function infButton() {
    if (tmp.inf_time == 2) {
        tmp.inf_time += 1

        INF.goInf(true)

        document.body.style.animation = "inf_reset_2 2s 1"
        setTimeout(()=>{
            tmp.inf_time += 1
            tmp.el.inf_popup.setDisplay(false)

            setTimeout(()=>{
                tmp.inf_time = 0
                document.body.style.backgroundColor = 'hsl(0, 0%, 7%)'
            },1000)
        },1000)
    }
}

function calcInf(dt) {
    if (!tmp.brokenInf && tmp.inf_reached && tmp.inf_time == 0) {
		let INF_MSGS = {
			0: "You have reached the limit of lifting where only gods withstand... You need to condense all your progress to evolve!",
			2: "<b class='corrupted_text'>Conflictingly, corruption spreads to Infinity. It's up to you to proceed.</b>"
		}
		if (tmp.inf_unl || !INF_MSGS[EVO.amt]) {
			INF.goInf(true)
			addNotify("You've gone Infinity!")
		} else {
			tmp.el.inf_msg.setHTML(INF_MSGS[EVO.amt])
			tmp.inf_time += 1
			document.body.style.animation = "inf_reset_1 5s 1"

			setTimeout(()=>{
				tmp.inf_time += 1
				document.body.style.backgroundColor = 'orange'
				tmp.el.inf_popup.setDisplay(true)
			},3000)
		}
    }
	if (tmp.inf_time) player.mass = tmp.inf_limit
	if (!tmp.inf_unl) return

    if (!player.inf.reached && player.mass.gte(INF.req)) player.inf.reached=true

    if (hasInfUpgrade(4)) for (let x = 0; x < TREE_TYPES.qu.length; x++) TREE_UPGS.buy(TREE_TYPES.qu[x], true)
    if (hasInfUpgrade(6)) for (let x = 119; x <= 218; x++) buyElement(x,0)

    player.inf.dim_mass = player.inf.dim_mass.add(tmp.dim_mass_gain.mul(dt))

    if (hasElement(232) && !tmp.pass) {
        let cs = tmp.c16.shardGain
        player.dark.c16.shard = player.dark.c16.shard.add(cs.mul(dt))
        player.dark.c16.totalS = player.dark.c16.totalS.add(cs.mul(dt))
    }

    if (hasElement(265)) player.inf.best = player.inf.best.max(tmp.IP_gain)

    if (hasElement(235)) {
        let ig = player.inf.best.div(1e2).mul(CSEffect("inf_speed")).mul(dt)

        player.inf.points = player.inf.points.add(ig)
        player.inf.total = player.inf.total.add(ig)
    }

    if (tmp.cs.unl) {
		player.inf.cs_amount = CORRUPTED_STAR.calcNextGain(player.inf.cs_amount,tmp.cs.speed.mul(dt))
		if (hasElement(285)) {
			buyCSUpg(0)
			buyCSUpg(1)
		}
	}

    if (hasElement(253)) {
        for (let i in player.inf.core) {
            let p = player.inf.core[i]
            if (p) player.inf.fragment[p.type]=player.inf.fragment[p.type].add(calcFragmentBase(p,p.star,p.power).mul(dt/100))
        }
    }

	for (let x = 0; x < ASCENSIONS.names.length; x++) if (ASCENSIONS.autoUnl[x]()) ASCENSIONS.reset(x,true)

	if (hasElement(304) && tmp.gp.res.gte(tmp.gp.req)) player.gal_prestige = player.gal_prestige.add(1)
    for (let i = 0; i < GAL_PRESTIGE.res_length; i++) player.gp_resources[i] = player.gp_resources[i].add(tmp.gp.res_gain[i].mul(dt))
}

function setupInfHTML() {
    setupCoreHTML()
    setupInfUpgradesHTML()
}

function updateInfHTML() {
    if (tmp.tab_name == "tp") {
        tmp.el.dim_mass.setTxt(formatMass(player.inf.dim_mass)+" "+player.inf.dim_mass.formatGain(tmp.dim_mass_gain,true))
        tmp.el.dim_mass_eff.setHTML("+"+tmp.dim_mass_eff.format())

        BUILDINGS.update('pe')
    }
    else if (tmp.tab_name == "inf-core") updateCoreHTML()
    else if (tmp.tab_name == "core-eff") {
        let h = ``
        for (let t in CORE) {
            let hh = ``, ct = CORE[t], ctmp = tmp.core_eff[t], s = tmp.core_score[t]
            for (let i = 0; i < MAX_STARS; i++) {
                if (s[i].gt(0)) {
                    let desc = ct.preEff[i]
                    if (desc && typeof desc == 'function') desc = desc()
                    hh += "Meta-Score "+format(s[i],2)+" | "+(desc || '???.')+` <b class='sky'>(${ct.effDesc[i](ctmp[i])})</b><br>`
                }
            }
            let f = player.inf.fragment[t]
            if (f.gt(0)) hh += `<br>${f.format(0)} ${ct.title.split(' ')[0]} Fragments | ${ct.fragment[1](tmp.fragment_eff[t])}<br>`
            if (hh != '') h += `<h2>${ct.title} <b>(${format(core_tmp[t].total_p.mul(100),0)}%)</b></h2><br>`+hh+'<br>'
        }
        tmp.el.core_eff_div.setHTML(h||"Place any theorem in core to show effects!")
    }
    else if (tmp.tab_name == "inf-upgs") {
        tmp.el.ip_amt.setHTML(player.inf.points.format(0) + (hasElement(235)?" "+player.inf.points.formatGain(player.inf.best.div(1e2).mul(CSEffect("inf_speed"))):""))

        for (let r in INF.upgs) {
            r = parseInt(r)

            let unl = (r == 0 || player.inf.theorem.gte(INF.upg_row_req[r-1])) && (r < 5 || player.chal.comps[19].gte([10,4,2,3,2][EVO.amt]))

            tmp.el['iu_row'+r].setDisplay(unl)

            if (!unl) continue;

            let ru = INF.upgs[r], req = player.inf.theorem.gte(INF.upg_row_req[r])

            for (let c in ru) {
                c = parseInt(c)

                let id = r*4+c
                if (r > 4) id -= 3

                let el = tmp.el[`iu_${id}_div`]

                if (el) {
                    let u = ru[c], b = hasInfUpgrade(id)

                    el.setClasses({inf_upg: true, locked: !b && (player.inf.points.lt(u.cost) || !req), bought: b})

                    tmp.el[`iu_${id}_desc`].setHTML(b?u.effectDesc?"<br>Effect: "+u.effectDesc(infUpgEffect(id)):"":"<br>Cost: <b>"+u.cost.format(0)+"</b> Infinity Points")
                }
            }
        }
    }
    else if (tmp.tab_name == "c-star") updateCSHTML()
}

function setupInfUpgradesHTML() {
    let html = ''

    for (let r in INF.upgs) {
        r = parseInt(r)

        let h = `<div class='table_center' id='iu_row${r}'>
        <div class='iu_req_div'><div>Require ${INF.upg_row_req[r]} Infinity Theorem</div></div>`

        let ru = INF.upgs[r]

        for (let c in ru) {
            c = parseInt(c)

            let u = ru[c], id = r*4+c
            if (r > 4) id -= 3

            h += `
            <button class='inf_upg' id='iu_${id}_div' onclick='buyInfUpgrade(${r},${c})'>
                <img src='images/upgrades/iu${id}.png'>
                <div>
                    <b>${u.title}</b><br>
                    ${u.desc}<br>
                    <span id='iu_${id}_desc'></span>
                </div>
            </button>
            `
        }

        html += h + `</div>`
    }

    new Element('inf_upg_table').setHTML(html)
}