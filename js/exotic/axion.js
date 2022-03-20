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
		var inc = hasTreeUpg("ext_l5") && tmp.supernova.tree_eff ? tmp.supernova.tree_eff.ext_l5 : E(1)
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
		}

		var sum = normal.add(other.max(0).mul(inc)).mul(AXIONS.costScale())

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
		player.ext.ax.res[type] = player.ext.ax.res[type].sub(E([2,3,5][type]).pow(bulk.sub(player.ext.ax.upgs[i])).mul(cost)).max(0)
		player.ext.ax.upgs[i] = player.ext.ax.upgs[i].add(bulk)
		updateAxionLevelTemp()
	},

	prod(x) {
		if (!AXIONS.unl()) return E(0)

		let r = E(0)
		if (x == 0) r = player.mass.max(1).log10().pow(0.6)
			.mul(EXOTIC.eff().add(1).log(100).add(1).pow(3))
		if (x == 1 && hasTreeUpg("ext_c")) r = player.supernova.times.div(20).max(1).pow(3)
			.mul(EXOTIC.eff().add(1).log10().add(1).sqrt())
		if (x == 2 && hasTreeUpg("ext_e1")) r = player.supernova.radiation.hz.max(1).log10().div(1e3).pow(3).div(1e3)

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
		return (y < 5 ? tmp.ax.upg[x].sub(y * 4).div(y + 1) : E(0))
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

	maxRows: 6,
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
			req: E(0),
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
				return x.add(1).log10().div(3).add(1)
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
				return x.div(3).add(1).log(3).add(1)
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
				return x.add(1).log(3).div(10).add(1)
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},

		8: {
			title: "Supermassive",
			desc: "Hawking Radiation softcap starts later.",
			unl: () => CHROMA.unl(),
			req: E(100),
			eff(x) {
				return x.div(5).add(1).log10().add(1)
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
			title: "Quark Condenser",
			desc: "Neutron Condensers are more powerful.",
			unl: () => CHROMA.unl(),
			req: E(200),
			eff(x) {
				return x.add(1).log10().sqrt().add(1)
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},
		11: {
			title: "Lepton Anomaly",
			desc: "Neutrion and Neut-Muon softcaps are weaker.",
			req: E(5),
			eff(x) {
				return x.div(2).add(27).cbrt().add(2).min(10).div(5)
			},
			effDesc(x) {
				return "^" + format(x,3)
			}
		},

		12: {
			title: "Supernova",
			desc: "Supernova is cheaper.",
			unl: () => CHROMA.unl(),
			req: E(100),
			eff(x) {
				return E(1.01).pow(x)
			},
			effDesc(x) {
				return "^1/"+format(x)
			}
		},
		13: {
			title: "Challenge",
			desc: "Increase the cap of Challenges 7, 9 - 12.",
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
			title: "Dyson Sphere",
			desc: "Increase the cap of Pent 13 effect.",
			unl: () => CHROMA.unl(),
			req: E(10),
			eff(x) {
				return E(1.01).pow(x).sub(1).min(1)
			},
			effDesc(x) {
				return "+^"+format(x,3)
			}
		},
		17: {
			title: "Quasar",
			desc: "Increase the cap of C8.",
			unl: () => CHROMA.unl(),
			req: E(30),
			eff(x) {
				return x.add(1).log(2).mul(100)
			},
			effDesc(x) {
				return "+"+format(x)
			}
		},
		18: {
			title: "Super Stronger",
			desc: "Tickspeed increases Stronger effect.",
			unl: () => CHROMA.unl(),
			req: E(60),
			eff(x) {
				return E(tmp.tickspeedEffect ? tmp.tickspeedEffect.eff : 1).log10().div(1e6).mul(x.sqrt())
			},
			effDesc(x) {
				return "+^"+format(x)
			}
		},
		19: {
			title: "Supergiant",
			desc: "Collapsed star effect boosts Black Hole mass.",
			req: E(100),
			unl: () => CHROMA.unl(),
			eff(x) {
				return E(tmp.stars ? tmp.stars.effect : 1).pow(x.div(1e3).min(.02))
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},

		20: {
			title: "X-Automation",
			desc: "Automate X Axions.",
			unl: () => CHROMA.unl(),
			req: E(1/0)
		},
		21: {
			title: "Y-Automation",
			desc: "Automate Y Axions.",
			unl: () => CHROMA.unl(),
			req: E(1/0)
		},
		22: {
			title: "Monochromacy Challenge",
			desc: "Unlock Challenge 14.",
			unl: () => CHROMA.unl(),
			req: E(1/0)
		},
		23: {
			title: "Shortcuts",
			desc: "Unlock Shortcuts.",
			unl: () => CHROMA.unl(),
			req: E(1/0)
		},
	}
}

function setupAxionHTML() {
	var html = ""
	for (var y = -1; y < AXIONS.maxRows; y++) {
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
	tmp.el.st_res2_disp.setDisplay(CHROMA.unl())

	for (var i = 0; i < 12; i++) {
		tmp.el["ax_upg"+i].setClasses({btn_ax: true, locked: !AXIONS.canBuy(i)})
		tmp.el["ax_upg"+i].setOpacity(tmp.ax.hover.hide.includes("u"+i) ? 0.25 : 1)
		tmp.el["ax_upg"+i].setDisplay(i < 8 || CHROMA.unl())
	}
	for (var i = 0; i < AXIONS.maxRows * 4; i++) {
		tmp.el["ax_boost"+i].setClasses({btn_ax: true, locked: tmp.ax.lvl[i].eq(0), bonus: tmp.ax.hover.bonus.includes("b"+i)})
		tmp.el["ax_boost"+i].setDisplay(AXIONS.ids[i].unl === undefined || AXIONS.ids[i].unl())
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
			tmp.el.ax_eff.setHTML(locked ? "" : "Level: " + format(AXIONS.getBaseLvl(id).sub(AXIONS.ids[id].req.sub(1)), 0) + (AXIONS.getBonusLvl(id).gt(0) ? "+" + format(AXIONS.getBonusLvl(id)) : "") + (id < 20 ? ", Currently: " + AXIONS.ids[id].effDesc(tmp.ax.eff[id]) : ""))
		}
	}
}

function updateAxionLevelTemp() {
	tmp.ax.upg = {}
	tmp.ax.lvl = {}
	for (var i = 0; i < 12; i++) tmp.ax.upg[i] = AXIONS.getUpgLvl(i)
	for (var i = 0; i < AXIONS.maxRows * 4; i++) tmp.ax.lvl[i] = AXIONS.getLvl(i)
}

function updateAxionTemp() {
	if (!EXOTIC.unl(true)) {
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
	for (var i = 0; i < 20; i++) {
		tmp.ax.eff[i] = AXIONS.getEff(i, tmp.ax.lvl[i])
	}
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