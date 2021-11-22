const SCALE_START = {
    super: {
        rank: E(50),
		tier: E(10),
		tetr: E(7),
        massUpg: E(100),
		tickspeed: E(100),
		bh_condenser: E(100),
		gamma_ray: E(100),
		supernova: E(15),
    },
	hyper: {
		rank: E(120),
		massUpg: E(500),
		tickspeed: E(250),
		bh_condenser: E(300),
		gamma_ray: E(300),
	},
	ultra: {
		rank: E(600),
		tickspeed: E(700),
		bh_condenser: E(750),
		gamma_ray: E(800),
	},
}

const SCALE_TYPE = ['super', 'hyper', 'ultra', 'meta'] // super, hyper, ultra, meta
const FULL_SCALE_NAME = ['Super', 'Hyper', 'Ultra', 'Meta']

const SCALING_RES = {
    rank(x=0) { return player.ranks.rank },
	tier(x=0) { return player.ranks.tier },
	tetr(x=0) { return player.ranks.tetr },
	tickspeed(x=0) { return player.tickspeed },
    massUpg(x=1) { return E(player.massUpg[x]||0) },
	bh_condenser(x=0) { return player.bh.condenser },
	gamma_ray(x=0) { return player.atom.gamma_ray },
	supernova(x=0) { return player.supernova.times },
}

const NAME_FROM_RES = {
	rank: "Rank",
	tier: "Tier",
	tetr: "Tetr",
	massUpg: "Mass Upgrades",
	tickspeed: "Tickspeed",
	bh_condenser: "Black Hole Condenser",
	gamma_ray: "Gamma Ray",
	supernova: "Supernova",
}

function updateScalingHTML() {
	let s = SCALE_TYPE[player.scaling_ch]
	tmp.el.scaling_name.setTxt(FULL_SCALE_NAME[player.scaling_ch])
	if (!tmp.scaling) return
	for (let x = 0; x < SCALE_TYPE.length; x++) {
		tmp.el["scaling_div_"+x].setDisplay(player.scaling_ch == x)
		if (player.scaling_ch == x) {
			let key = Object.keys(SCALE_START[SCALE_TYPE[x]])
			for (let y = 0; y < key.length; y++) {
				let have = tmp.scaling[SCALE_TYPE[x]].includes(key[y])
				tmp.el['scaling_'+x+'_'+key[y]+'_div'].setDisplay(have)
				if (have) {
					tmp.el['scaling_'+x+'_'+key[y]+'_power'].setTxt(format(getScalingPower(SCALE_TYPE[x], key[y]).mul(100))+"%")
					tmp.el['scaling_'+x+'_'+key[y]+'_start'].setTxt(format(getScalingStart(SCALE_TYPE[x], key[y]),0))
				}
			}
		}
	}
}

function updateScalingTemp() {
	if (!tmp.scaling) tmp.scaling = {}
	for (let x = 0; x < SCALE_TYPE.length; x++) {
		tmp.scaling[SCALE_TYPE[x]] = []
		let key = Object.keys(SCALE_START[SCALE_TYPE[x]])
		for (let y = 0; y < key.length; y++) {
			if (scalingActive(key[y], SCALING_RES[key[y]](), SCALE_TYPE[x])) tmp.scaling[SCALE_TYPE[x]].push(key[y])
		}
	}
}

function scalingActive(name, amt, type) {
	if (SCALE_START[type][name] === undefined) return false
	amt = E(amt);
	return amt.gte(getScalingStart(type, name));
}

function getScalingName(name, x=0) {
	let cap = Object.keys(SCALE_START).length;
	let current = "";
	let amt = SCALING_RES[name](x);
	for (let n = cap - 1; n >= 0; n--) {
		if (scalingActive(name, amt, Object.keys(SCALE_START)[n]))
			return capitalFirst(Object.keys(SCALE_START)[n]) + (Object.keys(SCALE_START)[n]=="meta"?"-":" ");
	}
	return current;
}

function getScalingStart(type, name) {
	let start = E(SCALE_START[type][name])
	if (type=="super") {
		if (name=="rank") {
			if (CHALS.inChal(1)) return E(25)
			start = start.add(tmp.chal?tmp.chal.eff[1].rank:0)
		}
		if (name=="tier") {
			if (player.mainUpg.atom.includes(5)) start = start.add(10)
		}
		if (name=="massUpg") {
			if (CHALS.inChal(1)) return E(25)
			if (player.mainUpg.bh.includes(3)) start = start.add(tmp.upgs?tmp.upgs.main?tmp.upgs.main[2][3].effect:0:0)
		}
		if (name=='tickspeed') {
			if (CHALS.inChal(1)) return E(50)
		}
	}
	if (type=="hyper") {
		if (name=="tickspeed") {
			if (player.mainUpg.rp.includes(14)) start = start.add(50)
			if (player.ranks.tetr.gte(5)) start = start.add(RANKS.effect.tetr[5]())
		}
		if (name=="rank") {
			if (player.mainUpg.atom.includes(10)) start = start.add(tmp.upgs?tmp.upgs.main?tmp.upgs.main[3][10].effect:0:0)
		}
	}
	if (type=="ultra") {
		if (name=="tickspeed") {
			if (player.ranks.tetr.gte(5)) start = start.add(RANKS.effect.tetr[5]())
		}
	}
	return start.floor()
}

function getScalingPower(type, name) {
	let power = E(1)
	if (type=="super") {
		if (name=="rank") {
			if (player.mainUpg.rp.includes(10)) power = power.mul(0.8)
			if (player.ranks.tetr.gte(4)) power = power.mul(RANKS.effect.tetr[4]())
		}
		if (name=="tier") {
			if (player.ranks.tetr.gte(4)) power = power.mul(0.8)
			if (player.atom.elements.includes(37)) power = power.mul(tmp.elements.effect[37])
		}
		if (name=="massUpg") {
			if (player.mainUpg.rp.includes(8)) power = power.mul(tmp.upgs.main?tmp.upgs.main[1][8].effect:1)
		}
		if (name=='tickspeed') {
			power = power.mul(tmp.chal?tmp.chal.eff[1].tick:1)
		}
		if (name=='bh_condenser') {
			if (player.atom.elements.includes(15)) power = power.mul(0.8)
		}
		if (name=='gamma_ray') {
			if (player.atom.elements.includes(15)) power = power.mul(0.8)
		}
	}
	if (type=="hyper") {
		if (name=="rank") {
			if (player.ranks.tetr.gte(1)) power = power.mul(0.85)
			if (player.atom.elements.includes(27)) power = power.mul(0.75)
		}
		if (name=="massUpg") {
			if (player.mainUpg.bh.includes(12)) power = power.mul(0.85)
		}
		if (name=='tickspeed') {
			if (player.mainUpg.bh.includes(12)) power = power.mul(0.85)
			if (player.atom.elements.includes(27)) power = power.mul(0.75)
		}
		if (name=='bh_condenser') {
			if (player.atom.elements.includes(55)) power = power.mul(0.75)
		}
		if (name=='gamma_ray') {
			if (player.atom.elements.includes(55)) power = power.mul(0.75)
		}
	}
	if (type=="ultra") {
		if (name=="rank") {
			if (player.atom.elements.includes(27)) power = power.mul(0.75)
		}
		if (name=='tickspeed') {
			if (player.atom.elements.includes(27)) power = power.mul(0.75)
		}
		if (name=='bh_condenser') {
			if (player.atom.elements.includes(55)) power = power.mul(0.75)
		}
		if (name=='gamma_ray') {
			if (player.atom.elements.includes(55)) power = power.mul(0.75)
		}
	}
	return power
}
