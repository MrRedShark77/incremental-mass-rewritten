const COSMIC = {
	roll(a) {
		for (let i of a) {
			let g = player.evo.cosmo.uni[i] ?? { mode: 0 }
			g.type = this.types[Math.randomInt(0, this.types.length)]
			g.tier = E(Math.random()).log(0.1).add(1).floor()
			player.evo.cosmo.uni[i] = g
		}
	},
	rollAll() {
		let a = []
		for (let i = 0; i < this.len; i++) if (!player.evo.cosmo.uni[i]) a.push(i)
		this.roll(a)
	},

	//Calculation
	calc(dt) {
		let cs = player.evo.cosmo
		if (!cs.unl) return

		cs.score = cs.score.max(tmp.evo.cosmo.score)
		cs.roll_time -= dt
		if (cs.roll_time < 0) {
			this.rollAll()
			cs.roll_time = 15
		}
	},
	temp() {
		let cs = player.evo.cosmo, ct = tmp.evo.cosmo
		let cn = [], ci = ct.highlight = []
		ct.score = E(0)
		for (var i = 0; i < this.len; i++) {
			let g = cs.uni[i]
			if (!g || cn.includes(g.type)) continue

			cn.push(g.type)
			ci.push(i)
			ct.score = ct.score.add(g.tier)
		}

		ct.eff = {}
		for (var [i, c] of Object.entries(this.cluster_effs)) {
			if (!c.unl()) continue
			ct.eff[i] = c.eff(cs.score)
		}
	},

	//Galaxies
	len: 6,
	types: ["g0", "g1", "g2", "g3", "ch"],
	click(x) {
		player.evo.cosmo.uni[x] = undefined
	},
	cluster_effs: {
		test: {
			unl: () => true,
			eff: i => i,
			disp: () => "This will be fully implemented in 0.8 release."
		}
	},

	//Tab
	setupHTML() {
		let h = ``
		for (var i = 0; i < this.len; i++) h += `<button id="uni_${i}" onclick="COSMIC.click(${i})"></button>`
		new Element("uni_table").setHTML(h)
	},
	html() {
		let cs = player.evo.cosmo, ct = tmp.evo.cosmo
		tmp.el.reroll_time.setTxt(formatTime(cs.roll_time))

		for (var i = 0; i < this.len; i++) {
			let g = cs.uni[i]
			tmp.el["uni_"+i].setClasses( { cosmo: true, highlight: ct.highlight.includes(i) } )
			tmp.el["uni_"+i].setHTML(g != undefined ? `
				<div class="tier">${format(g.tier, 0)}</sup></div>
				<div class="sym">${g.type}</div>
				<div class="desc">(Click to prune)</div>
			` : ``)
		}

		let h = ""
		for (var [i, c] of Object.entries(ct.eff)) h += this.cluster_effs[i].disp(c) + "<br>"
		tmp.el["cluster_div"].setHTML(`<h4>Score: ${format(ct.score, 0)} | Best: ${format(cs.score, 0)}</h4><br>`+h)
	}
}