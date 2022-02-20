let EXOTIC = {
	setup() {
		return {
			amt: E(0),
			ax: AXIONS.setup()
		}
	},

	unlocked() {
		return player.chal.comps[12].gte(1) || player.ext.amt.gte(1)
	},
	gain() {
		if (player.chal.comps[12].eq(0)) return E(0)
		return player.mass.add(1).log10().div(1e9).add(1)
			.pow(player.supernova.times.mul(player.chal.comps[12].add(1)).div(500))
	},
	reset(force) {
		if (!force) {
			if (player.chal.comps[12].eq(0)) return
			player.ext.amt = player.ext.amt.add(EXOTIC.gain())
		}
		EXOTIC.doReset()
	},
	doReset() {
		player.ext.time = 0
		tmp.pass = true

		let list = []
		if (player.supernova.tree.includes("qol_ext4")) list = list.concat("chal1","chal2","chal3","chal4","chal4a","chal5","chal6","chal7")
		if (player.supernova.tree.includes("qol_ext5")) list = list.concat("c","s1","s2","s3","s4","sn1","sn2","sn3","sn4","sn5","m1","m2","m3","rp1","bh1","bh2","t1","gr1","gr2","d1")

		let list_keep = []
		for (let x = 0; x < player.supernova.tree.length; x++) {
			var id = player.supernova.tree[x]
			if (list.includes(id)) list_keep.push(id)
			if (TREE_UPGS.ids[id] && TREE_UPGS.ids[id].perm) list_keep.push(id)
		}
		player.supernova.times = E(0)
		player.supernova.stars = E(0)
		player.supernova.tree = list_keep

		for (let c = 1; c <= 12; c++) player.chal.comps[c] = E(player.supernova.tree.includes("qol_ext4") && c <= 8 ? 50 : 0)

		player.supernova.bosons = {
			pos_w: E(0),
			neg_w: E(0),
			z_boson: E(0),
			photon: E(0),
			gluon: E(0),
			graviton: E(0),
			hb: E(0),
		}
		player.supernova.b_upgs = {
			photon: [ E(0), E(0), E(0), E(0) ],
			gluon: [ E(0), E(0), E(0), E(0) ],
		}
		player.supernova.fermions = {
			unl: false,
			points: [E(0),E(0)],
			tiers: [[E(0),E(0),E(0),E(0),E(0),E(0)],[E(0),E(0),E(0),E(0),E(0),E(0)]],
			choosed: "",
			choosed2: "",
		}
		player.supernova.radiation = {
			hz: E(0),
			ds: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0) ],
			bs: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0) ],
		}
		player.supernova.auto = {
			on: -2,
			t: 0
		}

		SUPERNOVA.doReset()
		updateTemp()

		tmp.pass = false
	},

	calc(dt) {
		player.ext.ax.res[0] = player.ext.ax.res[0].add(AXIONS.prod(0).mul(dt))
	}
}

function updateExoticHTML() {
	tmp.el.app_ext.setDisplay(tmp.tab == 6)
	if (tmp.tab == 6) {
		tmp.el.extAmt2.setHTML(format(player.ext.amt,2) + " (+" + format(EXOTIC.gain(),2) + ")")
		updateAxionHTML()
	}
}


//Extra Buildings
let EXTRA_BUILDINGS = {
	unls: {
		2: () => player.supernova.tree.includes("eb1"),
		3: () => player.supernova.tree.includes("eb2")
	},
	max: 3,
	kind: ["bh", "ag"],
	start: {
		bh: 2,
		ag: 2
	},
	res: {
		bh: () => player.bh.dm,
		ag: () => player.atom.points,
	},
	saves: {
		bh: () => player.bh,
		ag: () => player.atom,
	},
	bh2: {
		start: E("e2e6"),
		mul: E("ee6"),
		pow: E(2),
		eff(x) {
			return x.times(10).add(1).log(2).div(500)
		}
	},
	bh3: {
		start: E("e5e8"),
		mul: E("ee9"),
		pow: E(3),
		eff(x) {
			return x.add(1).log(100).add(1).div(10)
		}
	},
	ag2: {
		start: E("ee6"),
		mul: E("e5e5"),
		pow: E(2.5),
		eff(x) {
			return x.times(tmp.atom ? tmp.atom.atomicEff : E(0)).pow(.75).div(3e3)
		}
	},
	ag3: {
		start: E("e7.5e9"),
		mul: E("e2.5e9"),
		pow: E(2),
		eff(x) {
			if (x.eq(0)) return E(0)
			return E(tmp.atom ? tmp.atom.atomicEff : E(0)).add(1).pow(x.add(1).log(3).div(100)).sub(1).mul(player.supernova.tree.includes("rad4")?1:2/3)
		}
	}
}

function updateExtraBuildingHTML(type, x) {
	let unl = EXTRA_BUILDINGS.unls[x]()
	let id = type+"_b"+x+"_"
	tmp.el[id+"div"].setDisplay(unl)
	if (!unl) return

	tmp.el[id+"cost"].setHTML(format(tmp.eb[type+x].cost,0))
	tmp.el[id+"btn"].setClasses({btn: true, locked: tmp.eb[type+x].gain.lte(getExtraBuildings(type,x))})
	tmp.el[id+"lvl"].setHTML(format(getExtraBuildings(type,x),0))
	tmp.el[id+"pow"].setHTML(format(tmp.eb[type+x].eff))
}

function updateExtraBuildingsHTML(type) {
	for (let b = EXTRA_BUILDINGS.start[type]; b <= EXTRA_BUILDINGS.max; b++) updateExtraBuildingHTML(type, b)
}

function updateExtraBuildingTemp() {
	let data = {}
	tmp.eb = data
	for (let k = 0; k < EXTRA_BUILDINGS.kind.length; k++) {
		let id = EXTRA_BUILDINGS.kind[k]
		for (let b = EXTRA_BUILDINGS.start[id]; b <= EXTRA_BUILDINGS.max; b++) {
			if (EXTRA_BUILDINGS.unls[b]()) {
				let amt = getExtraBuildings(id, b)
				let data = EXTRA_BUILDINGS[id+b]
				let cost = data.mul.pow(amt.pow(data.pow)).mul(data.start)
				let res = EXTRA_BUILDINGS.res[id]()
				tmp.eb[id+b] = {
					cost: cost,
					gain: cost.gt(res) ? E(0) : res.div(data.start).log(data.mul).root(data.pow).add(1).floor(),
					eff: data.eff(amt),
				}
			}
		}
	}
}

function getExtraBuildings(type, x) {
	return E(EXTRA_BUILDINGS.saves[type]()["eb"+x] || 0)
}
function resetExtraBuildings(type) {
	for (let b = EXTRA_BUILDINGS.start[type]; b <= EXTRA_BUILDINGS.max; b++) delete EXTRA_BUILDINGS.saves[type]()["eb"+b]
}
function buyExtraBuildings(type, x) {
	if (!EXTRA_BUILDINGS.unls[x]()) return
	if (tmp.eb[type+x].gain.lt(getExtraBuildings(type,x))) return
	EXTRA_BUILDINGS.saves[type]()["eb"+x] = tmp.eb[type+x].gain
}

//AXIONS
let AXIONS = {
	setup() {
		return {
			res: [ E(0), E(0) ],
			upgs: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0) ]
		}
	},
	maxLvl(x) {
		var sum = E(0)
		var min = E(1/0)
		for (var i = 4 * x; i < 4 * x + 4; i++) {
			sum = player.ext.ax.upgs[i].add(sum)
			min = player.ext.ax.upgs[i].min(min)
		}
		return sum.add(1).div(15/4).min(min.mul(1.2).add(1)).floor().add(1)
	},
	cost(i) {
		var sum = E(0)
		var type = Math.floor(i / 4)
		for (var x = 4 * type; x < 4 * type + 4; x++) sum = player.ext.ax.upgs[x].add(sum)
		var r = E(2).pow(sum).mul(50/(i+5)*Math.pow(2,i))
		return r
	},
	bulk(i) {
		var lvl = player.ext.ax.upgs[i]
		var max = AXIONS.maxLvl(Math.floor(i / 4))
		var bulk = player.ext.ax.res[Math.floor(i / 4)].div(AXIONS.cost(i)).log(2).add(1).floor()
		return bulk.min(max.sub(lvl)).max(0)
	},
	canBuy(i) {
		return AXIONS.bulk(i).gt(0)
	},
	buy(i) {
		var bulk = AXIONS.bulk(i)
		var cost = AXIONS.cost(i)
		if (bulk.eq(0)) return
		player.ext.ax.upgs[i] = player.ext.ax.upgs[i].add(bulk)
		player.ext.ax.res[Math.floor(i / 4)] = player.ext.ax.res[Math.floor(i / 4)].sub(E(2, bulk).sub(1).times(cost)).max(0)
		updateAxionLevelTemp()
	},

	prod(x) {
		return player.mass.max(1).log10().pow(0.4)
			.mul(player.ext.amt.add(1).log10().pow(2))
	},

	getUpgs(p) {
		return [player.ext.ax.upgs[p % 4], player.ext.ax.upgs[Math.floor(p / 4) + 4]]
	},
	getLvl(p) {
		return AXIONS.getBaseLvl(p).add(AXIONS.getBonusLvl(p))
	},
	getBaseLvl(p) {
		var r = AXIONS.getUpgs(p)
		return r[0].add(r[1])
	},
	getBonusLvl(p) {
		return E(0)
	},
	getEff(p, l) {
		return AXIONS.eff[p](l)
	},

	eff: {
		0(x) {
			return x.mul(2).add(1).pow(2)
		},
		1(x) {
			return x.sqrt().div(10).add(1.2).min(1.6).pow(x)
		},
		2(x) {
			return x.add(1).log10().div(2).add(1)
		},
		3(x) {
			return x.sqrt().div(150).toNumber()
		}
	}
}

function setupAxionHTML() {
	var html = ""
	for (var y = 0; y <= 4; y++) {
		html += "</tr><tr>"
		for (var x = 0; x <= 4; x++) {
			if (x == 0 && y == 0) html += "<td class='ax'></td>"
			if (x > 0 && y == 0) html += "<td class='ax'><button class='btn_ax normal' id='ax_upg"+x+"'>X</button></td>"
			if (x == 0 && y > 0) html += "<td class='ax'><button class='btn_ax normal' id='ax_upg"+(y+4)+"'>Y</button></td>"
			if (x > 0 && y > 0) html += "<td class='ax'><button class='btn_ax' id='ax_boost"+(y*4+x)+"'><img src='images/tree/placeholder.png'></img></button></td>"
		}
	}
	new Element("ax_table").setHTML(html)
}

function updateAxionHTML() {
	tmp.el.st_res0.setHTML(format(player.ext.ax.res[0]))
	tmp.el.st_gain0.setHTML(formatGain(player.ext.ax.res[0], AXIONS.prod(0)))
	for (var i = 0; i < 4; i++) {
		tmp.el["st_upg"+i].setClasses({btn: true, full: true, locked: !AXIONS.canBuy(i)})
		tmp.el["st_lvl"+i].setHTML(format(player.ext.ax.upgs[i], 0) + " / " + format(AXIONS.maxLvl(0), 0))
		tmp.el["st_eff"+i].setHTML(format(tmp.ax.eff[i]))
		tmp.el["st_cost"+i].setHTML(format(AXIONS.cost(i), 0))
	}
}

function updateAxionLevelTemp() {
	tmp.ax.lvl = {}
	for (var i = 0; i < 16; i++) tmp.ax.lvl[i] = AXIONS.getLvl(i)
}

function updateAxionTemp() {
	if (!EXOTIC.unlocked()) {
		tmp.ax = {}
		return
	}

	tmp.ax = { lvl: tmp.ax && tmp.ax.lvl }
	if (!tmp.ax.lvl) updateAxionLevelTemp()

	tmp.ax.eff = {}
	for (var i = 0; i < 16; i++) if (AXIONS.eff[i]) tmp.ax.eff[i] = AXIONS.getEff(i, tmp.ax.lvl[i])
}

/*
11.
12.
13.
14.
21. Excited Atomic Boost: Raise the Atomic Power gains.
22. Outrageous Boost: Multiply the cap increases to RP exponents.
23. Superranked Boost: Meta Rank scaling is weaker.
24. Meta Zone Boost: Meta Boosts are multiplied based on radiation types.
31. Supermassive Boost: Hawking Radiation softcap starts later.
32. Dark Radiation Boost: Hawking Radiation is more powerful.
33. Quark Condenser Boost: Neutron Condensers are more powerful.
34. Lepton Anomaly Boost: Neut-Muon softcap is weaker.
41. Supernova Boost: Raise the Titanium-73 effect more.
42. Challenge Boost: Increase the completion cap of Challenge 7.
43. Impossible Boost: Weaken the Impossible Challenge scalings.
44. Pent Boost: Pent requirement increases slower.
*/