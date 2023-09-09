const COSMIC = {
	roll(a) {
		for (let i of a) {
			let g = player.evo.cosmo.galaxy[i]
			g.type = Math.randomInt(0, 4)
			g.tier = Math.min(Math.floor(Math.log10(1 / Math.random()) / Math.log10(5)), this.cluster_len - 1)
		}
	},
	rollAll() {
		let a = []
		for (let i = 0; i < this.galaxy_len; i++) a.push(i)
		this.roll(a)
	},

	galaxy_len: 6,

	canGroup(i) {
		return tmp.evo.cosmo.can[i] != undefined && player.evo.cosmo.cluster[i].lt(this.clusterCap(i))
	},
	group(i) {
		if (!this.canGroup(i)) return
		player.evo.cosmo.cluster[i] = player.evo.cosmo.cluster[i].add(1)
		this.roll(tmp.evo.cosmo.can[i])
		delete tmp.evo.cosmo.can[i]
	},
	clusterCap(i) {
		return E(5).mul(i == this.cluster_len - 1 ? 1 : player.evo.cosmo.cluster[i+1].add(1))
	},
	clusters: [
		{
			eff: i => 1,
			desc: x => `Boost something. <h4>${formatMult(x)}</h4>`,
		}, {
			eff: i => 1,
			desc: x => `Boost something again. <h4>${formatMult(x)}</h4>`,
		}, {
			eff: i => 1,
			desc: x => `Boost something yet again. <h4>${formatMult(x)}</h4>`,
		}
	],

	//Calculation
	calc(dt) {
		let cs = player.evo.cosmo
		if (!cs.unl) return

		cs.roll_time -= dt
		if (cs.roll_time < 0) {
			this.rollAll()
			cs.roll_time = 15
		}
	},
	temp() {
		let gr = [], gr_i = []
		for (let i = 0; i < this.cluster_len; i++) {
			gr.push([])
			gr_i.push([])
		}

		for (let i = 0; i < this.galaxy_len; i++) {
			let g = player.evo.cosmo.galaxy[i]
			if (g.tier == -1) continue
			if (gr[g.tier].includes(g.type)) continue
			if (gr[g.tier].length == 4) continue
			gr[g.tier].push(g.type)
			gr_i[g.tier].push(i)
		}

		let tcc = tmp.evo.cosmo.can = {}
		let tch = []
		for (let i = 0; i < this.cluster_len; i++) {
			if (gr[i].length < 4) continue
			tcc[i] = gr_i[i]
			tch = tch.concat(tcc[i])
		}
		tmp.evo.cosmo.highlight = tch

		let tce = tmp.evo.cosmo.eff = []
		for (var i = 0; i < this.cluster_len; i++) tce[i] = this.clusters[i].eff(player.evo.cosmo.cluster[i])
	},

	//Tab
	setupHTML() {
		let h = ``
		for (var i = 0; i < this.galaxy_len; i++) h += `<div id="galaxy_${i}"></div>`
		new Element("galaxy_table").setHTML(h)

		h = ``
		for (var i = 0; i < this.cluster_len; i++) h += `<button id="cluster_${i}" onclick='COSMIC.group(${i})'></button>`
		new Element("cluster_table").setHTML(h)
	},
	html() {
		let cs = player.evo.cosmo
		tmp.el.reroll_time.setTxt(formatTime(cs.roll_time))

		for (var i = 0; i < this.galaxy_len; i++) {
			let g = cs.galaxy[i]
			tmp.el["galaxy_"+i].setClasses( { cosmo_gal: true, highlight: tmp.evo.cosmo.highlight.includes(i) } )
			tmp.el["galaxy_"+i].setHTML(g.tier >= 0 ? `
				<div class="gal_sym">${g.type}</div>
				<div class="gal_tier">${g.tier}</div>
			` : ``)
		}

		for (var i = 0; i < this.cluster_len; i++) {
			tmp.el["cluster_"+i].setClasses({ galactic: true, locked: !this.canGroup(i) })
			tmp.el["cluster_"+i].setHTML(`
				<h4>Cluster Tier ${i+1}</h4><br>
				${cs.cluster[i].format(0)} / ${this.clusterCap(i).format(0)}
				<br class='line'>
				${this.clusters[i].desc(clusterEff(i))}
			`)
		}
	}
}

COSMIC.cluster_len = COSMIC.clusters.length

function clusterEff(i, def = 1) {
	return tmp.evo.cosmo.eff[i] ?? E(def)
}