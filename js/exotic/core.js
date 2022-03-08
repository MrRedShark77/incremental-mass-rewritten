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
	reset(force, auto) {
		if (!force) {
			if (player.chal.comps[12].eq(0)) return false
			player.ext.amt = player.ext.amt.add(EXOTIC.gain())
		} else if (!auto && player.confirms.ext && !confirm("Are you sure?")) return false
		EXOTIC.doReset()
		return true
	},
	doReset() {
		player.ext.time = 0
		player.ext.chal.f7 = true
		tmp.pass = true

		let list = []
		if (hasTreeUpg("qol_ext4")) list = list.concat("chal1","chal2","chal3","chal4","chal4a","chal5","chal6","chal7")
		if (hasTreeUpg("qol_ext5")) list = list.concat("c","s1","s2","s3","s4","sn1","sn2","sn3","sn4","sn5","m1","m2","m3","rp1","bh1","bh2","t1","gr1","gr2","d1")
		if (hasTreeUpg("qol_ext6")) list = list.concat("bs1","bs2","bs3","bs4","fn1","fn2","fn3","fn4","fn5","fn6","fn7","fn8")
		if (hasTreeUpg("qol_ext7")) list = list.concat("unl1","rad1","rad2","rad3","rad4","rad5")

		let list_keep = []
		for (let x = 0; x < player.supernova.tree.length; x++) {
			var id = player.supernova.tree[x]
			if (list.includes(id)) list_keep.push(id)
			if (TREE_UPGS.ids[id] && TREE_UPGS.ids[id].perm) list_keep.push(id)
		}
		player.supernova.times = E(0)
		player.supernova.stars = E(0)

		for (let c = 1; c <= 12; c++) player.chal.comps[c] = E(hasTreeUpg("qol_ext4") && c <= 8 ? 50 : hasTreeUpg("qol_ext6") ? 10 : 0)

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
			dual: player.supernova.fermions.dual
		}
		if (hasTreeUpg("qol_ext4")) {
			for (var i = 0; i < 2; i++) {
				for (var t = 0; t < 6; t++) player.supernova.fermions.tiers[i][t] = E(10)
			}
		}
		player.supernova.radiation = {
			hz: E(0),
			ds: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0) ],
			bs: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0) ],
		}
		player.supernova.auto = {
			toggle: player.supernova.auto.toggle,
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
		tmp.el.extAmt2.setHTML(format(player.ext.amt,2)+"<br>"+formatGainOrGet(player.ext.amt, EXOTIC.gain()))
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
			let r = x.times(5).add(1).log(2).div(500)
			if (AXIONS.unl()) r = r.mul(tmp.ax.eff[9])
			return r
		}
	},
	bh3: {
		start: E("e5e8"),
		mul: E("ee9"),
		pow: E(3),
		eff(x) {
			let r = x.add(1).log10().div(3).add(1).div(10)
			if (AXIONS.unl()) r = r.mul(tmp.ax.eff[10])
			return r
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
			let exp = x.add(1).log(3).div(100)
			return E(tmp.atom ? tmp.atom.atomicEff : E(0)).add(1).pow(exp.min(1/10)).sub(1).mul(hasTreeUpg("rad4")?1:2/3).mul(exp.mul(10).max(1))
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
			res: [ E(0), E(0), E(0) ],
			upgs: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0) ]
		}
	},
	maxLvl(x) {
		var sum = E(0)
		var min = E(1/0)
		for (var i = 4 * x; i < 4 * x + 4; i++) {
			sum = tmp.ax.upg[i].add(sum)
			min = tmp.ax.upg[i].min(min)
		}
		if (x == 0) return sum.add(1).div(15/4).min(min.mul(1.2).add(1)).floor().add(1)
		if (x == 1) return sum.div(4).min(min.mul(1.5).add(1)).floor().add(2)
		if (x == 2) return E(1)
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
		if (type < 2) {
			if (hasTreeUpg("ext_l3")) {
				if (i % 4 < 3) other = other.sub(player.ext.ax.upgs[i + 1].div(2))
				if (i % 4 > 0) other = other.sub(player.ext.ax.upgs[i - 1].div(2))
			}
			if (hasTreeUpg("ext_l4")) {
				if (i % 4 > 0) other = other.sub(player.ext.ax.upgs[i - 1].div(3))
				if (i % 4 > 1) other = other.sub(player.ext.ax.upgs[i - 2].div(3))
				if (i % 4 > 2) other = other.sub(player.ext.ax.upgs[i - 3].div(3))
			}
			if (hasTreeUpg("ext_l5")) {
				if (i % 4 == 0) other = other.sub(player.ext.ax.upgs[i + 3].div(5))
				if (i % 4 <= 1) other = other.sub(player.ext.ax.upgs[i + 2].div(5))
			}
		}

		var sum = normal.add(other).mul(AXIONS.costScale())

		var r = E([2,3,5][type])
			.pow(sum.add(i - 4))
			.mul(i >= 4 ? (1e3 * Math.pow(5, i - 4)) : (50 / (i + 5) * Math.pow(3, i)))
		return r
	},
	costScale() {
		var r = E(1)
		if (hasTreeUpg("ext_l1")) r = E(0.8)
		if (tmp.chal) r = r.mul(tmp.chal.eff[13])
		return r
	},
	bulk(p) {
		var type = Math.floor(p / 4)
		var bulk = player.ext.ax.res[type].max(1).div(tmp.ax.cost[p]).log([2,3,5][type]).div(AXIONS.costScale()).add(1).floor()

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
		var type = Math.floor(i / 4)
		if (bulk.eq(0)) return
		player.ext.ax.upgs[i] = player.ext.ax.upgs[i].add(bulk)
		player.ext.ax.res[type] = player.ext.ax.res[type].sub(E([2,3,5][type], bulk).mul(cost)).max(0)
		updateAxionLevelTemp()
	},

	prod(x) {
		if (!AXIONS.unl()) return E(0)

		let r = E(0)
		if (x == 0) r = player.mass.max(1).log10().pow(0.6)
			.mul(player.ext.amt.add(1).log(100).add(1).pow(3))
		if (x == 1 && hasTreeUpg("ext_c")) r = player.supernova.times.div(20).max(1).pow(3)
			.mul(player.ext.amt.add(1).log10().add(1).sqrt())
		if (x == 2 && hasTreeUpg("ext_e1")) r = E(0)

		if (hasElement(77)) r = r.mul(tmp.elements && tmp.elements.effect[77])
		return r
	},

	getUpgLvl(i) {
		var r = player.ext.ax.upgs[i]
		var type = Math.floor(i / 4)
		if (hasTreeUpg("ext_l2") && type < 2) r = r.add(player.ext.ax.upgs[[i+4,i-4][type]].div([1.5,i*1.5][type]))
		return r.max(0)
	},
	getLvl(p, base) {
		var req = AXIONS.ids[p].req
		var r = AXIONS.getBaseLvl(p).add(AXIONS.getBonusLvl(p))
		if (!base) r = r.sub(req)
		return r.max(0)
	},
	getBaseLvl(p) {
		var x = p % 4
		var y = Math.floor(p / 4)
		return tmp.ax.upg[x].sub(y * 4).div(y + 1).max(0)
			.add(tmp.ax.upg[y + 4].sub(x * y).max(0))
	},
	getBonusLvl(p) {
		var x = p % 4
		var y = Math.floor(p / 4)
		var r = E(0)
		if (y > 0) r = tmp.ax.upg[y + 3].sub((x + 4) * (y + 1)).div(y + 2).max(0)
		if (hasTreeUpg("ext_b1") && y == 0) r = AXIONS.getBaseLvl(p + 12).mul(2).add(r)
		return r
	},
	getEff(p, l) {
		return AXIONS.ids[p].eff(l)
	},

	ids: {
		0: {
			title: "Supernova Time",
			desc: "Speed up the Supernova productions.",
			req: E(0),
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
			req: E(00),
			eff(x) {
				return x.sqrt().div(10).min(4).add(1.2).pow(x)
			},
			effDesc(x) {
				return format(x) + "x later"
			}
		},
		2: {
			title: "Tickspeed Balancing",
			desc: "Outside of challenges, Tickspeed scalings are weaker, but reduce the non-bonus.",
			req: E(0),
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
			req: E(0.5),
			eff(x) {
				return x.pow(0.6).div(135).min(0.05)
			},
			effDesc(x) {
				return "-^"+format(x)
			}
		},

		4: {
			title: "Excited Atomic",
			desc: "Raise the base Atomic Power gains.",
			req: E(1),
			eff(x) {
				return x.div(3).add(1).pow(2/3).min(7.5)
			},
			effDesc(x) {
				return "^" + format(x)
			}
		},
		5: {
			title: "Outrageous",
			desc: "Multiply the cap increases to Rage Power.",
			req: E(0.5),
			eff(x) {
				return x.add(1).div(x.max(1).log(5).add(1))
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
			req: E(7),
			eff(x) {
				return x.add(1).log(3).div(10).add(1).min(1.6)
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
			title: "Dark Radiation",
			desc: "Hawking Radiation is more powerful.",
			req: E(4),
			eff(x) {
				return x.add(1).sqrt()
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
			title: "Lepton Anomaly",
			desc: "Neut-Muon softcap is weaker.",
			req: E(10),
			eff(x) {
				return x.div(2).add(16).sqrt().add(1).min(6).div(5)
			},
			effDesc(x) {
				return "^" + format(x,3)
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
			title: "Challenge",
			desc: "Increase the cap of Challenges 7, 10 - 12.",
			req: E(0),
			eff(x) {
				return x.times(25)
			},
			effDesc(x) {
				return "+" + format(x)
			}
		},
		14: {
			title: "Impossible",
			desc: "Impossible Challenge scaling is weaker.",
			req: E(5),
			eff(x) {
				return E(1).div(x.add(1).log10().div(100).add(1))
			},
			effDesc(x) {
				return format(E(1).sub(x).mul(100)) + "%"
			}
		},
		15: {
			title: "Pent",
			desc: "Pent scales slower.",
			req: E(1),
			eff(x) {
				return E(1).div(x.mul(2).add(1).log2().div(10).add(1))
			},
			effDesc(x) {
				return format(E(1).sub(x).mul(100)) + "%"
			}
		},

		16: {
			title: "Placeholder [Unlock]",
			desc: "Placeholder.",
			req: E(1/0)
		},
		17: {
			title: "Placeholder [Unlock]",
			desc: "Placeholder.",
			req: E(1/0)
		},
		18: {
			title: "Placeholder [Unlock]",
			desc: "Placeholder.",
			req: E(1/0)
		},
		19: {
			title: "Placeholder [Unlock]",
			desc: "Placeholder.",
			req: E(1/0)
		},
	}
}

function setupAxionHTML() {
	var html = ""
	for (var y = -1; y < 5; y++) {
		html += "</tr><tr>"
		for (var x = -1; x < 5; x++) {
			var x_empty = x == -1 || x == 4
			var y_empty = y == -1
			if (x_empty && y_empty) html += "<td class='ax'></td>"
			if (!x_empty && y_empty) html += `<td class='ax'><button class='btn_ax normal' id='ax_upg`+x+`' onmouseover='hoverAxion("u`+x+`")' onmouseleave='hoverAxion()' onclick="AXIONS.buy(`+x+`)">X`+(x+1)+`</button></td>`
			if (x_empty && !y_empty && y < 4) {
				var type = x == 4 ? 2 : 1
				html += `<td class='ax'><button class='btn_ax normal' id='ax_upg` +(y+4*type)+`' onmouseover='hoverAxion("u`+(y+4*type)+`")' onmouseleave='hoverAxion()' onclick="AXIONS.buy(`+(y+4*type)+`)">`+["","Y","Z"][type]+(y+1)+`</button></td>`
			}
			if (!x_empty && !y_empty) html += `<td class='ax'><button class='btn_ax' id='ax_boost`+(y*4+x)+`' onmouseover='hoverAxion("b`+(y*4+x)+`")' onmouseleave='hoverAxion()'><img src='images/axion/b`+(y*4+x)+`.png' style="position: relative"></img></button></td>`
		}
	}
	new Element("ax_table").setHTML(html)
}

function updateAxionHTML() {
	tmp.el.st_res0.setHTML(format(player.ext.ax.res[0]))
	tmp.el.st_res1.setHTML(format(player.ext.ax.res[1]))
	tmp.el.st_res2.setHTML(format(player.ext.ax.res[2]))
	tmp.el.st_gain0.setHTML(formatGain(player.ext.ax.res[0], AXIONS.prod(0)))
	tmp.el.st_gain1.setHTML(formatGain(player.ext.ax.res[1], AXIONS.prod(1)))
	tmp.el.st_gain2.setHTML(formatGain(player.ext.ax.res[2], AXIONS.prod(2)))

	for (var i = 0; i < 12; i++) {
		tmp.el["ax_upg"+i].setClasses({btn_ax: true, locked: !AXIONS.canBuy(i)})
		tmp.el["ax_upg"+i].setOpacity(tmp.ax.hover.hide.includes("u"+i) ? 0.25 : 1)
	}
	for (var i = 0; i < 20; i++) {
		tmp.el["ax_boost"+i].setClasses({btn_ax: true, locked: tmp.ax.lvl[i].eq(0), bonus: tmp.ax.hover.bonus.includes("b"+i)})
		tmp.el["ax_boost"+i].setOpacity(tmp.ax.hover.bonus.includes("b"+i) ? 1 : tmp.ax.hover.hide.includes("b"+i) || tmp.ax.lvl[i].eq(0) ? 0.25 : 1)
	}

	tmp.el.ax_desc.setOpacity(tmp.ax.hover.id ? 1 : 0)
	if (tmp.ax.hover.id) {
		if (tmp.ax.hover.id[0] == "u") {
			var id = Number(tmp.ax.hover.id.split("u")[1])
			var type = Math.floor(id / 4)
			var name = ["X","Y","Z"][type]
			tmp.el.ax_title.setTxt(name + "-Axion Upgrade " + ((id % 4) + 1))
			tmp.el.ax_req.setHTML("Cost: " + format(tmp.ax.cost[id]) + " " + name + "-Axions")
			tmp.el.ax_req.setClasses({"red": !AXIONS.canBuy(id)})
			tmp.el.ax_eff.setHTML("Level: " + format(player.ext.ax.upgs[id], 0) + " / " + format(AXIONS.maxLvl(type), 0) + " (" + format(tmp.ax.upg[id]) + ")")
		}
		if (tmp.ax.hover.id[0] == "b") {
			var id = Number(tmp.ax.hover.id.split("b")[1])
			var locked = tmp.ax.lvl[id].eq(0)
			tmp.el.ax_title.setTxt(AXIONS.ids[id].title + " (b" + id + ")")
			tmp.el.ax_req.setTxt(locked ? "Locked (requires " + format(AXIONS.getLvl(id, true)) + " / " + format(AXIONS.ids[id].req, 0) + ")" : AXIONS.ids[id].desc)
			tmp.el.ax_req.setClasses({"red": locked})
			tmp.el.ax_eff.setHTML(locked ? "" : "Level: " + format(AXIONS.getBaseLvl(id).sub(AXIONS.ids[id].req.sub(1)), 0) + (AXIONS.getBonusLvl(id).gt(0) ? "+" + format(AXIONS.getBonusLvl(id)) : "") + (id < 16 ? ", Currently: " + AXIONS.ids[id].effDesc(tmp.ax.eff[id]) : ""))
		}
	}
}

function updateAxionLevelTemp() {
	tmp.ax.upg = {}
	tmp.ax.lvl = {}
	for (var i = 0; i < 12; i++) tmp.ax.upg[i] = AXIONS.getUpgLvl(i)
	for (var i = 0; i < 20; i++) tmp.ax.lvl[i] = AXIONS.getLvl(i)
}

function updateAxionTemp() {
	if (!EXOTIC.unlocked()) {
		tmp.ax = {}
		return
	}

	tmp.ax = {
		lvl: tmp.ax && tmp.ax.lvl,
		upg: tmp.ax && tmp.ax.upg,
		hover: (tmp.ax && tmp.ax.hover) || {id: "", hide: [], bonus: []}
	}
	if (!tmp.ax.lvl) updateAxionLevelTemp()

	tmp.ax.cost = {}
	tmp.ax.bulk = {}
	tmp.ax.eff = {}
	for (var i = 0; i < 12; i++) {
		tmp.ax.cost[i] = AXIONS.cost(i)
		tmp.ax.bulk[i] = AXIONS.bulk(i)
	}
	for (var i = 0; i < 16; i++) tmp.ax.eff[i] = AXIONS.getEff(i, tmp.ax.lvl[i])
}

function hoverAxion(x) {
	tmp.ax.hover.id = x
	tmp.ax.hover.hide = []
	tmp.ax.hover.bonus = []
	if (!x) return
	if (tmp.ax.hover.id[0] == "u") {
		let id = Number(tmp.ax.hover.id.split("u")[1])
		for (var i = 0; i < 12; i++) if (i != id) tmp.ax.hover.hide.push("u"+i)
		for (var i = 0; i < 20; i++) {
			let [px,py] = [i%4, Math.floor(i/4)]

			let hide = true
			let bonus = false
			if (id >= 8) hide = true
			else if (id >= 4) {
				bonus = py == id - 3 && tmp.ax.upg[id].gt((px + 4) * (py + 1))
				hide = !bonus && (py == id - 4 ? tmp.ax.upg[id].lte(px * py) : true)
			} else hide = (px != id) || (tmp.ax.upg[id].lte(py*4))
			if (hide) tmp.ax.hover.hide.push("b"+i)
			if (bonus) tmp.ax.hover.bonus.push("b"+i)
		}
	}
	if (tmp.ax.hover.id[0] == "b") {
		let id = Number(tmp.ax.hover.id.split("b")[1])
		let [px, py] = [id%4, Math.floor(id/4)]
		for (var i = 0; i < 20; i++) if (i != id) tmp.ax.hover.hide.push("b"+i)
		for (var i = 0; i < 12; i++) {
			let hide = true
			if (py < 4) {
				if (i < 4 && px == i && tmp.ax.upg[i].gt(py * 4)) hide = false
				if (i >= 4 && py == i - 4 && tmp.ax.upg[i].gt(px * py)) hide = false
				if (i >= 4 && py == i - 3 && tmp.ax.upg[i - 1].div(py + 2).gt((px + 4) * py)) hide = false
			}
			if (hide) tmp.ax.hover.hide.push("u"+i)
		}
	}
}

/*
Missed. Heavier Boost: Stronger raises levels from Muscler and Booster.
Missed. Meta Radiation Boost: Meta-Boost I is raised. (capped at ^2.5) - Added
*/

future = false