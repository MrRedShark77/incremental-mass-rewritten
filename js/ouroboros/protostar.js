const PROTOSTAR = {
	temp() {
		let tu_1 = hasZodiacUpg('taurus','u1')
		let tu_3 = hasZodiacUpg('taurus','u3'), tu_3_eff = zodiacEff('taurus','u3')

		let tt = tmp.evo.neb
		tt.dust_prod = E(tu_1 ? 1 : 0)
		tt.res = {}
		tt.eff = {}
		tt.undim = {}

		let dim_mult = Decimal.mul(appleEffect("ps_dim",E(1)).pow(-1),nebulaEff('ext1',[1])[0])
		let protostar = player.evo.proto.star, dust = player.evo.proto.dust

		for (var ni in this.nebulae) {
			let n = this.nebulae[ni], nb = player.evo.proto.nebula, nbv = nb[ni], ext = ni.includes('ext')
			tt.eff[ni] = n.eff(nbv)
			tt.res[ni] = n.res ? n.res(nb) : ext ? dust : protostar

			let dim = n.undiminish(nb).mul(dim_mult)
			if (tu_3 && !ext) dim = dim.mul(tu_3_eff) 
			tt.undim[ni] = dim
			
			tt.dust_prod = tu_1 ? tt.dust_prod.mul(nbv.add(1).log10().add(1)) : tt.dust_prod.add(nbv.add(1).log10())
		}
		tt.dust_prod = tt.dust_prod.mul(this.dust_mult()).sub(tu_1?1:0)

		tt.eaGain = this.eaGain()
	},
	calc(dt) {
		if (EVO.amt >= 4 && player.qu.en.eth[0]) player.evo.proto.dust = player.evo.proto.dust.div(E(10).pow(dt).pow(player.qu.en.eth[3]))
        else if (player.atom.unl) player.evo.proto.dust = player.evo.proto.dust.add(tmp.evo.neb.dust_prod.mul(dt))

		if (tmp.passive >= 3) player.evo.proto.star = player.evo.proto.star.add(tmp.atom.gain.mul(dt))

		if (hasTree("qol1")) for (let x = 291; x <= Math.min(tmp.elements.unl_length[0], 362); x++) buyElement(x,0)
		if (hasElement(293)) for (let x in NEBULAE_TIER) if (!x.includes('ext') || hasInfUpgrade(14)) this.nebula_click(x)
		if (tmp.epUnl) player.evo.proto.exotic_atoms = player.evo.proto.exotic_atoms.add(tmp.evo.neb.eaGain.mul(dt))
	},

	eaGain() {
		let x = nebulaEff('ext1',[1,E(1)])[1], g = tmp.ea.gain

		x = x.mul(g[0]).mul(g[1]).mul(25)
		if (hasElement(298)) x = x.mul(elemEffect(298))

		x = x.pow(tmp.dark.abEff.ea||1).pow(nebulaEff('ext2'))
        if (tmp.inf_unl) x = x.pow(theoremEff('atom',4))
		return x
	},

	dust_mult() {
		let x = Decimal.mul(CSEffect('sd_mult'),tmp.chal?.eff[19]??1)
		if (tmp.sn.boson) x = x.mul(tmp.sn.boson.upgs.gluon[5].effect)
        if (hasZodiacUpg('aries','u1')) x = x.mul(zodiacEff('aries','u1'))
		if (hasZodiacUpg('taurus','u2')) x = x.mul(zodiacEff('taurus','u2'))
		if (tmp.inf_unl) x = x.pow(theoremEff('atom',6))
		return x
	},

	nebula_click(i) {
		if (this.nebulae[i].unl && !this.nebulae[i].unl()) return
		let nb = player.evo.proto.nebula
		nb[i] = nb[i].max(this.nebula_bulk(i))
	},
	nebula_req(i) {
		let t = NEBULAE_TIER[i]
		if (i.includes('ext') && t == 1) {
			return Decimal.pow(2, player.evo.proto.nebula[i].sub(tmp.evo.neb.undim[i]).max(0).add(1).pow(1.5)).mul(EVO.amt >= 4 ? 5e15 : 5e49)
		}
		return player.evo.proto.nebula[i].sub(tmp.evo.neb.undim[i]).max(0).add(1).pow(1+t).mul(10**t)
	},
	nebula_bulk(i) {
		let t = NEBULAE_TIER[i], ext = i.includes('ext')
		if (ext && t == 1) {
			if (tmp.c16.in) return E(0)
			return tmp.evo.neb.res[i].div(EVO.amt >= 4 ? 5e15 : 5e49).max(1).log(2).root(1.5).add(tmp.evo.neb.undim[i]).floor()
		}
		if (!ext && EVO.amt < 4) {
			let cond1 = tmp.c16.in || player.qu.rip.active
			let cond2 = !hasElement(169) || NEBULAE_TIER[i] > 1
			if (cond1 && cond2) return E(0)
		}
		return tmp.evo.neb.res[i].div(10**t).root(1+t).add(tmp.evo.neb.undim[i]).floor()
	},
	nebula_gain(i) {
		return this.nebula_bulk(i).sub(player.evo.proto.nebula[i]).max(0)
	},
	nebulae: {
		//Tier 1
		red: {
			color: "#f00",
			undiminish: n => n.green.mul(n.blue).cbrt(),
			undiminishDisp: "green and blue",
			eff: n => n.add(1).pow(hasElement(294) ? (EVO.amt >= 4 ? .2 : .5) : .1),
			effDisp: e => formatMult(e) + " Stronger Power"
		},
		green: {
			color: "#0f0",
			undiminish: n => n.red.mul(n.blue).cbrt(),
			undiminishDisp: "red and blue",
			eff: n => n.add(1).pow(hasZodiacUpg('gemini','u1') ? 2 : hasElement(294) ? 2/3 : 1/3),
			effDisp: e => formatMult(e) + " Calm Power"
		},
		blue: {
			color: "#07f",
			undiminish: n => n.red.mul(n.green).cbrt(),
			undiminishDisp: "red and green",
			eff: n => n.add(1).pow(hasZodiacUpg('gemini','u2') ? 1.5 : hasElement(294) ? 2/3 : 1/3),
			effDisp: e => formatMult(e) + " Fabric"
		},
		ext1: {
			name: "Exotic I",
			color: "#f30",
			undiminish: n => player.dark.c16.totalS.mul(expMult(player.evo.proto.exotic_atoms, 0.5)).add(1).log10().div(EVO.amt >= 4 ? 50 : 1),
			undiminishDisp: "corrupted shards and exotic atoms",
			resDisp: "stardust",

			unl: () => tmp.epUnl,
			eff: n => [n.add(1).root(3), Decimal.pow(2,n.sub(1)).mul(n).overflow('e2000',0.5)],
			effDisp: e => formatMult(e[0],2)+" diminishing returns, +"+format(e[1],0)+" Exotic Atom's generation"
		},

		//Tier 2
		yellow: {
			color: "#fb0",
			undiminish: n => n.cyan.mul(n.magenta).root(4),
			undiminishDisp: "cyan and magenta",
			res: n => n.red.add(n.green),
			resDisp: "red and green",

			unl: () => tmp.sn.unl || player.evo.const.tier >= 1,
			eff: n => player.evo.const.tier >= 1 ? n.add(1).log10().add(1).pow(.5) : [n.cbrt().div(10).add(1), hasElement(301) ? n.add(1).log10().cbrt().div(60).add(1) : undefined],
			effDisp: e => player.evo.const.tier >= 1 ? formatMult(e) + " Zodiac" : formatPow(e[0]) + " Star Generators" + (e[1] ? ", " + formatPow(e[1]) + ' to exponent' : "")
		},
		cyan: {
			color: "#0bf",
			undiminish: n => n.yellow.mul(n.magenta).root(4),
			undiminishDisp: "yellow and magenta",
			res: n => n.green.add(n.blue),
			resDisp: "green and blue",

			unl: () => tmp.sn.unl || player.evo.const.tier >= 1,
			eff: n => [n.add(1).root(4), hasElement(301) ? n.add(1).log10().cbrt().div(80).add(1) : undefined],
			effDisp: e => formatPow(e[0]) + " Wormhole" + (e[1] ? ", " + formatPow(e[1]) + ' to exponent' : "")
		},
		magenta: {
			color: "#d0f",
			undiminish: n => n.yellow.mul(n.cyan).root(4),
			undiminishDisp: "yellow and cyan",
			res: n => n.red.add(n.blue),
			resDisp: "red and blue",

			unl: () => quUnl() || player.evo.cosmo.unl,
			eff: n => E(.95).pow(n.add(1).log10().pow(hasElement(309) ? elemEffect(309, .6) : .5)),
			effDisp: e => formatReduction(e) + " Pre-Darkness Scalings"
		},
		ext2: {
			name: "Exotic II",
			color: "#f30",
			undiminish: n => EVO.amt >= 4 ? E(0) : player.evo.wh.mass[6].add(1).log10().mul(player.dark.matters.final).root(4).div(10),
			undiminishDisp: "anti-wormhole and FSS",
			res: n => n.ext1,
			resDisp: "Exotic I",
			unl: () => tmp.epUnl,
			eff: n => n.add(1).root(2),
			effDisp: e => formatPow(e) + " Exotic Atoms"
		},

		//Tier 3
		orange: {
			color: "#f70",
			unl: () => [4,5].includes(EVO.amt) && player.dark.unl,
			undiminish: n => n.turquoise.mul(n.purple).root(5),
			undiminishDisp: "turquoise and purple",
			res: n => n.red.add(1).log2().add(1).mul(n.yellow.add(1).log2().add(1)).pow(2).sub(1),
			resDisp: "product of log2(red) and log2(yellow)",
			eff: n => n.div(5).add(1).log10().add(1).pow(.75),
			effDisp: e => formatPow(e) + " Dark Rays & Shadows"
		},
		turquoise: {
			color: "#0f9",
			unl: () => [4,5,6].includes(EVO.amt) && tmp.matterUnl,
			undiminish: n => n.orange.mul(n.purple).root(5),
			undiminishDisp: "orange and purple",
			res: n => n.green.add(1).log2().add(1).mul(n.cyan.add(1).log2().add(1)).pow(2).sub(1),
			resDisp: "product of log2(green) and log2(cyan)",
			eff: n => n.add(1).pow(.05),
			effDisp: e => formatMult(e) + " Matter's Exponent"
		},
		purple: {
			color: "#70f",
			unl: () => [4,5,6].includes(EVO.amt) && player.dark.c16.first,
			undiminish: n => player.dark.c16.shard.max(1).log10().div(10).add(1),
			undiminishDisp: "corrupted shard",
			res: n => n.blue.add(1).log2().add(1).mul(n.magenta.add(1).log2().add(1)).sub(1),
			resDisp: "product of log2(blue) and log2(magenta)",
			eff: n => n.add(1).log10().div(15).add(1),
			effDisp: e => formatPow(e) + " Corrupted Shard"
		},
	},

	setupHTML() {
		let h = ``, n = Object.keys(this.nebulae)
		for (var r = 0; r < Math.ceil(n.length / 4); r++) {
			h += `<div class='table_center proto_table'>`
			for (var i = r * 4; i < r * 4 + 4; i++) {
				if (n[i] === undefined) break
				h += `<button id="proto${i}" onclick="PROTOSTAR.nebula_click('${n[i]}')">
					<h4 style='color: ${this.nebulae[n[i]].color}' id="proto_amt${i}"></h4>
					<span id="proto_gain${i}"></span>
					<br>
					<b id="proto_eff${i}"></b><br>
					<span id="proto_dim${i}" style='font-size: 10px'></span>
				</button>`
			}
			h += `</div><br>`
		}
		new Element("proto_table").setHTML(h)
	},
	html() {
		tmp.el.proto_star.setTxt(player.evo.proto.star.format(0))
		tmp.el.proto_dust.setHTML(player.evo.proto.dust.format(0))
		tmp.el.proto_dust_prod.setTxt(player.evo.proto.dust.formatGain(tmp.evo.neb.dust_prod))
		tmp.el.ea_amount.setHTML(tmp.epUnl?`<h4>${format(player.evo.proto.exotic_atoms,0)}</h4> Exotic Atoms <span>${player.evo.proto.exotic_atoms.formatGain(tmp.evo.neb.eaGain)}</span>`:"")
		for (var [i, ni] of Object.entries(Object.keys(this.nebulae))) {
			let nb = this.nebulae[ni], amt = player.evo.proto.nebula[ni]
			tmp.el["proto"+i].setDisplay(nb.unl ? nb.unl() : true)
			tmp.el["proto_amt"+i].setTxt(`${amt.format(0)} ${nb.name??capitalFirst(ni)} Nebulae`)
			tmp.el["proto_gain"+i].setTxt(amt.lt(1e5) ? "(+"+this.nebula_gain(ni).format(0)+")" : "")
			tmp.el["proto_dim"+i].setHTML(
			(amt.lt(1e5) ? `Next: ${this.nebula_req(ni).format(0)} ${nb.resDisp??"Protostars"}<br>` : ``) +
			`Reduced on ${this.nebulae[ni].undiminishDisp}`
			)
			tmp.el["proto_eff"+i].setHTML(nb.effDisp(tmp.evo.neb.eff[ni]))
		}
	},
}

const NEBULAE_TIER = (()=>{
	let x = {}
	for (let [i,ni] of Object.entries(Object.keys(PROTOSTAR.nebulae))) x[ni] = Math.floor(parseInt(i)/4)+1
	return x
})()

function nebulaEff(i, def = 1) {
	return tmp.evo.neb.eff[i] ?? def
}