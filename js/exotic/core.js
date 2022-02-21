let EXOTIC = {
	setup() {
		return {
			amt: E(0),
			chal: { f7: true },
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
		player.ext.chal.f7 = true
		tmp.pass = true

		let list = []
		if (hasTreeUpg("qol_ext4")) list = list.concat("chal1","chal2","chal3","chal4","chal4a","chal5","chal6","chal7")
		if (hasTreeUpg("qol_ext5")) list = list.concat("c","s1","s2","s3","s4","sn1","sn2","sn3","sn4","sn5","m1","m2","m3","rp1","bh1","bh2","t1","gr1","gr2","d1")

		let list_keep = []
		for (let x = 0; x < player.supernova.tree.length; x++) {
			var id = player.supernova.tree[x]
			if (list.includes(id)) list_keep.push(id)
			if (TREE_UPGS.ids[id] && TREE_UPGS.ids[id].perm) list_keep.push(id)
		}
		player.supernova.times = E(0)
		player.supernova.stars = E(0)
		player.supernova.tree = list_keep

		for (let c = 1; c <= 12; c++) player.chal.comps[c] = E(hasTreeUpg("qol_ext4") && c <= 8 ? 50 : 0)

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
		if (tmp.chal.outside) player.ext.chal.f7 = false
		player.ext.ax.res[0] = player.ext.ax.res[0].add(AXIONS.prod(0).mul(dt))
		player.ext.ax.res[1] = player.ext.ax.res[1].add(AXIONS.prod(1).mul(dt))
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
		2: () => hasTreeUpg("eb1"),
		3: () => hasTreeUpg("eb2")
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
			let r = x
			if (AXIONS.unl()) r = r.mul(tmp.ax.eff[9])
			return r.times(10).add(1).log(2).div(500)
		}
	},
	bh3: {
		start: E("e5e8"),
		mul: E("ee9"),
		pow: E(3),
		eff(x) {
			let r = x
			if (AXIONS.unl()) r = r.mul(tmp.ax.eff[10])
			return r.add(1).log(100).add(1).div(10)
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
			return E(tmp.atom ? tmp.atom.atomicEff : E(0)).add(1).pow(x.add(1).log(3).div(100)).sub(1).mul(hasTreeUpg("rad4")?1:2/3)
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
	unl() {
		return tmp.ax && tmp.ax.eff !== undefined
	},

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
		if (x == 0) return sum.add(1).div(15/4).min(min.mul(1.2).add(1)).floor().add(1)
		if (x == 1) return sum.div(4).min(min.mul(1.5).add(1)).floor().add(2)
	},
	cost(i) {
		var normal = E(0)
		var other = E(0)
		var type = Math.floor(i / 4)
		for (var x = 4 * type; x < 4 * type + 4; x++) {
			var lvl = player.ext.ax.upgs[x]
			if (i == x) normal = lvl
			else other = other.add(lvl)
		}
		if (hasTreeUpg("ext_l1")) other = other.mul(0.75)

		var r = E(i >= 4 ? 2 : 1.75)
			.pow(normal.add(other).add(i - 4))
			.mul(i >= 4 ? (1e3 * Math.pow(5, i - 4)) : (50 / (i + 5) * Math.pow(2, i)))
		return r
	},
	bulk(p) {
		var type = Math.floor(p / 4)
		var bulk = player.ext.ax.res[type].max(1).div(tmp.ax.cost[p]).log(i >= 4 ? 5 : 1.75).add(1).floor()

		var lvl = player.ext.ax.upgs[p]
		var max = AXIONS.maxLvl(type)
		return bulk.min(max.sub(lvl)).max(0)
	},
	canBuy(i) {
		if (i % 4 > 0 && player.ext.ax.upgs[i-1].eq(0)) return
		return tmp.ax.bulk[i].gt(0)
	},
	buy(i) {
		var bulk = tmp.ax.bulk[i]
		var cost = tmp.ax.cost[i]
		if (bulk.eq(0)) return
		player.ext.ax.upgs[i] = player.ext.ax.upgs[i].add(bulk)
		player.ext.ax.res[Math.floor(i / 4)] = player.ext.ax.res[Math.floor(i / 4)].sub(E(i >= 4 ? 2 : 1.75, bulk).mul(cost)).max(0)
		updateAxionLevelTemp()
	},

	prod(x) {
		if (x == 0) {
			let r = player.mass.max(1).log10().pow(0.4)
			r = r.mul(player.ext.amt.add(1).log10().pow(2))
			if (hasElement(76)) r = r.mul(tmp.elements && tmp.elements.effect[76])
			return r
		}
		if (x == 1 && hasTreeUpg("ext_c")) return player.supernova.times.div(20).max(1).pow(3)
		return E(0)
	},

	getLvl(p, base) {
		var req = AXIONS.ids[p].req
		var r = AXIONS.getBaseLvl(p).add(AXIONS.getBonusLvl(p))
		if (!base) r = r.sub(req.sub(1))
		return r.max(0)
	},
	getBaseLvl(p) {
		var x = p % 4
		var y = Math.floor(p / 4)
		return player.ext.ax.upgs[x].sub(y * 4).max(0)
			.add(player.ext.ax.upgs[y + 4].sub(x * y).max(0))
	},
	getBonusLvl(p) {
		return E(0)
	},
	getEff(p, l) {
		return AXIONS.ids[p].eff(l)
	},

	ids: {
		0: {
			title: "Supernova Time",
			desc: "Speed up the Supernova productions.",
			req: E(1),
			eff(x) {
				return x.mul(2).add(1).pow(2)
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},
		1: {
			title: "Cosmic Burst",
			desc: "Cosmic Ray softcap starts later.",
			req: E(1),
			eff(x) {
				return x.sqrt().div(10).add(1.2).min(1.6).pow(x)
			},
			effDesc(x) {
				return format(x) + "x later"
			}
		},
		2: {
			title: "Tickspeed Balancing",
			desc: "Outside of challenges, Tickspeed scalings are weaker, but reduce the non-bonus.",
			req: E(1),
			eff(x) {
				return x.add(1).log10().div(2).add(1)
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},
		3: {
			title: "Radiation Scaling",
			desc: "Radiation Boosters scale slower.",
			req: E(1),
			eff(x) {
				return x.pow(0.6).div(135).toNumber()
			},
			effDesc(x) {
				return "-^"+format(x)
			}
		},

		4: {
			title: "Excited Atomic",
			desc: "Raise the base Atomic Power gains.",
			req: E(2),
			eff(x) {
				return x.div(5).add(1).sqrt()
			},
			effDesc(x) {
				return "^" + format(x)
			}
		},
		5: {
			title: "Outrageous",
			desc: "Multiply the cap increases to Rage Power.",
			req: E(2),
			eff(x) {
				return x.add(1).div(x.add(1).log2())
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},
		6: {
			title: "Superranked",
			desc: "Meta Rank scaling is weaker.",
			req: E(5),
			eff(x) {
				return E(1).div(x.add(1).log(5).div(3).add(1))
			},
			effDesc(x) {
				return format(E(1).sub(x).mul(100)) + "%"
			}
		},
		7: {
			title: "Meta Zone",
			desc: "Multiply Meta Boosts based on radiation types.",
			req: E(10),
			eff(x) {
				return x.add(1).log(2).div(10).add(1).min(1.6)
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},

		8: {
			title: "Supermassive [Coming soon!]",
			desc: "Hawking Radiation softcap starts later.",
			req: E(1/0),
			eff(x) {
				return E(1)
			},
			effDesc(x) {
				return "^" + format(x)
			}
		},
		9: {
			title: "Dark Radiation [Coming soon!]",
			desc: "Hawking Radiation is more powerful.",
			req: E(1/0),
			eff(x) {
				return E(1)
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},
		10: {
			title: "Quark Condenser [Coming soon!]",
			desc: "Neutron Condensers are more powerful.",
			req: E(1/0),
			eff(x) {
				return E(1)
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},
		11: {
			title: "Lepton Anomaly [Coming soon!]",
			desc: "Meut-Muon softcap is weaker.",
			req: E(1/0),
			eff(x) {
				return E(1)
			},
			effDesc(x) {
				return "^" + format(x)
			}
		},

		12: {
			title: "Supernova [Coming soon!]",
			desc: "???",
			req: E(1/0),
			eff(x) {
				return E(1)
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},
		13: {
			title: "Challenge [Coming soon!]",
			desc: "Increase the cap of Challenges 7 and 10.",
			req: E(1/0),
			eff(x) {
				return x.times(25)
			},
			effDesc(x) {
				return "+" + format(x)
			}
		},
		14: {
			title: "Impossible [Coming soon!]",
			desc: "Impossible Challenge scaling is weaker.",
			req: E(1/0),
			eff(x) {
				return E(1)
			},
			effDesc(x) {
				return format(E(1).sub(x).mul(100)) + "%"
			}
		},
		15: {
			title: "Pent [Coming soon!]",
			desc: "Pent scales slower.",
			req: E(1/0),
			eff(x) {
				return E(1)
			},
			effDesc(x) {
				return format(E(1).sub(x).mul(100)) + "%"
			}
		},
	}
}

function setupAxionHTML() {
	var html = ""
	for (var y = -1; y < 4; y++) {
		html += "</tr><tr>"
		for (var x = -1; x < 4; x++) {
			if (x == -1 && y == -1) html += "<td class='ax'></td>"
			if (x > -1 && y == -1) html += `<td class='ax'><button class='btn_ax normal' id='ax_upg`+x+`' onmouseover='tmp.ax.hover = "u`+x+`"' onmouseleave='tmp.ax.hover = undefined' onclick="AXIONS.buy(`+x+`)">X`+(x+1)+`</button></td>`
			if (x == -1 && y > -1) html += `<td class='ax'><button class='btn_ax normal' id='ax_upg` +(y+4)+`' onmouseover='tmp.ax.hover = "u`+(y+4)+`"' onmouseleave='tmp.ax.hover = undefined' onclick="AXIONS.buy(`+(y+4)+`)">Y`+(y+1)+`</button></td>`
			if (x > -1 && y > -1) html += `<td class='ax'><button class='btn_ax' id='ax_boost`+(y*4+x)+`' onmouseover='tmp.ax.hover = "b`+(y*4+x)+`"' onmouseleave='tmp.ax.hover = undefined'><img src='images/tree/placeholder.png' style="position: relative"></img></button></td>`
		}
	}
	new Element("ax_table").setHTML(html)
}

function updateAxionHTML() {
	tmp.el.st_res0.setHTML(format(player.ext.ax.res[0]))
	tmp.el.st_res1.setHTML(format(player.ext.ax.res[1]))
	tmp.el.st_gain0.setHTML(formatGain(player.ext.ax.res[0], AXIONS.prod(0)))
	tmp.el.st_gain1.setHTML(formatGain(player.ext.ax.res[1], AXIONS.prod(1)))

	for (var i = 0; i < 8; i++) tmp.el["ax_upg"+i].setClasses({btn_ax: true, locked: !AXIONS.canBuy(i)})
	for (var i = 0; i < 16; i++) tmp.el["ax_boost"+i].setClasses({btn_ax: true, locked: tmp.ax.lvl[i].eq(0)})

	tmp.el.ax_desc.setOpacity(tmp.ax.hover ? 1 : 0)
	if (tmp.ax.hover) {
		if (tmp.ax.hover[0] == "u") {
			var id = tmp.ax.hover[1]
			tmp.el.ax_title.setTxt((id >= 4 ? "Y" : "X") + "-Axion Upgrade " + ((id % 4) + 1))
			tmp.el.ax_req.setHTML("Cost: " + format(tmp.ax.cost[id]) + " " + (id >= 4 ? "Y" : "X") + "-Axions")
			tmp.el.ax_eff.setHTML("Level: " + format(player.ext.ax.upgs[id], 0) + " / " + format(AXIONS.maxLvl(Math.floor(id / 4)), 0))
		}
		if (tmp.ax.hover[0] == "b") {
			var id = tmp.ax.hover.split("b")[1]
			var locked = tmp.ax.lvl[id].eq(0)
			tmp.el.ax_title.setTxt(AXIONS.ids[id].title + " (b" + id + ")")
			tmp.el.ax_req.setTxt(locked ? "Locked (requires " + format(AXIONS.getLvl(id, true)) + " / " + format(AXIONS.ids[id].req, 0) + ")" : AXIONS.ids[id].desc)
			tmp.el.ax_req.setClasses({"red": locked})
			tmp.el.ax_eff.setHTML(locked ? "" : "Level: " + format(AXIONS.getBaseLvl(id).sub(AXIONS.ids[id].req.sub(1)), 0) + (AXIONS.getBonusLvl(id).gt(0) ? "+" + format(AXIONS.getBonusLvl(i)) : "") + ", Currently: " + AXIONS.ids[id].effDesc(tmp.ax.eff[id]))
		}
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

	tmp.ax = {
		lvl: tmp.ax && tmp.ax.lvl,
		bonus: tmp.ax && tmp.ax.bonus,
		hover: tmp.ax && tmp.ax.hover
	}
	if (!tmp.ax.lvl) updateAxionLevelTemp()

	tmp.ax.cost = {}
	tmp.ax.bulk = {}
	tmp.ax.eff = {}
	for (var i = 0; i < 8; i++) {
		tmp.ax.cost[i] = AXIONS.cost(i)
		tmp.ax.bulk[i] = AXIONS.bulk(i)
	}
	for (var i = 0; i < 16; i++) tmp.ax.eff[i] = AXIONS.getEff(i, tmp.ax.lvl[i])
}

/*
11. Supernova Time Boost: Speed up all Supernova productions.
12. Cosmic Burst Boost: Cosmic Ray softcap starts later.
13. Tickspeed Balance Boost: Outside of challenges, Tickspeed scales weaker but reduce the non-bonus.
14. Radiation Scaling Boost: Reduce the Radiation Booster scaling by subtracting the exponent.
21. Excited Atomic Boost: Raise the Atomic Power gains.
22. Outrageous Boost: Multiply the cap increases to RP exponents.
23. Superranked Boost: Meta Rank scaling is weaker.
24. Meta Zone Boost: Meta Boosts are multiplied based on radiation types. - Added
31. Supermassive Boost: Hawking Radiation softcap starts later.
32. Dark Radiation Boost: Hawking Radiation is more powerful.
33. Quark Condenser Boost: Neutron Condensers are more powerful.
34. Lepton Anomaly Boost: Neut-Muon softcap is weaker.
41. Supernova Boost: Raise the Titanium-73 effect more.
42. Challenge Boost: Increase the cap of Challenges 7 and 10.
43. Impossible Boost: Weaken the Impossible Challenge scalings.
44. Pent Boost: Pent requirement increases slower.

Missed. Heavier Boost: Stronger raises levels from Muscler and Booster.
Missed. Meta Radiation Boost: Meta-Boost I is raised. (capped at ^2.5) - Added
*/

future = false