const CONFIRMS_FUNCTION = {
    rp() {
        let g = tmp.rp.gain, r = EVO.amt >= 1 ? player.evo.cp : player.rp

        r.points = r.points.add(g)
		r.unl = true

        FORMS.rp.doReset()
        addQuote(2)
    },
    bh() {
        let g = tmp.bh.dm_gain

        if (EVO.amt >= 2) {
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
		if (EVO.amt >= 3) player.evo.proto.star = player.evo.proto.star.add(tmp.atom.gain)
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
    qu(auto,force,rip) {
		if (quUnl() || OURO.unl) QUANTUM.performReset(force, rip)
        else {
            document.body.style.animation = "implode 2s 1"
            setTimeout(()=>QUANTUM.performReset(force, rip),1000)
            setTimeout(()=>{
                document.body.style.animation = ""
            },2000)
        }
    },
    enterQC() {
        player.qu.qc.active = !player.qu.qc.active
        QUANTUM.doReset(player.qu.qc.active)
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
            let fl = Decimal.floor(tmp.core_lvl)
            for (let i in player.inf.pre_theorem) {
                let t = player.inf.pre_theorem[i]
                player.inf.fragment[t.type] = player.inf.fragment[t.type].add(calcFragmentBase(t,chanceToBool(t.star_c),getPower(t.power_m),fl).div(4)) // Math.round(100+pm*t.power_m*100)/100
            }
        }

        if (player.inf.theorem.eq(0)) {
            player.inf.points = player.inf.points.add(2)
            player.inf.total = player.inf.total.add(2)
        } else {
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
}

const RESET_CONFIRMS = {
	rp: {
		color: `red`,
		title: `1: Rage`,
		gain: "Rage Power",
		unls: "Tickspeed and Upgrades",
		quoteSkip: 2
	},
	bh: {
		color: `yellow`,
		title: `2: Black Hole`,
		gain: "Dark Matters",
		unls: "Black Hole",
		quoteSkip: 3
	},
	atom: {
		title: `3: Atomic`,
		gain: "Atoms and Quarks",
		unls: "Cosmic Rays and Quarks",
		quoteSkip: 4
	},
	qu: {
		color: `light_green`,
		title: `5: Quantum`,
		gain: "Quantum Foam",
		unls: "Cosmic Strings and Chroma",
		quoteSkip: 7
	},
	dark: {
		color: `gray`,
		title: `6: Darkness`,
		gain: "Dark Rays",
		unls: "Element Tier 2",
		quoteSkip: 9
	}
}

function getResetConfirm(id, func) {
	if (!func) func = CONFIRMS_FUNCTION[id]

	let d = RESET_CONFIRMS[id]
	if (player.quotes.includes(d.quoteSkip)) func()
	else createConfirm(`
		<h3 class='${d.color}'>${d.title} reset</h3><br>
		This resets almost everything up to this point, in exchange for ${d.gain}.
		<br class='line'>
		<b class='yellow'>You'll also unlock: ${d.unls}</b>
	`, id, func)
}