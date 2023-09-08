const PROTOSTAR = {
	temp() {
		let tt = tmp.evo
		tt.dust_prod = E(0)
		tt.nebula_res = {}
		tt.nebula_eff = {}
		tt.nebula_undim = {}

		let dim_mult = Decimal.mul(appleEffect("ps_dim",E(1)).pow(-1),nebulaEff('ext1',[1])[0])
		let protostar = player.evo.proto.star, dust = player.evo.proto.dust

		for (var ni in this.nebulae) {
			let n = this.nebulae[ni], nb = player.evo.proto.nebula, nbv = nb[ni], ext = ni.includes('ext')
			tt.nebula_eff[ni] = n.eff(nbv)
			tt.nebula_res[ni] = n.res ? n.res(nb) : ext ? dust : protostar
			tt.nebula_undim[ni] = n.undiminish(nb).mul(dim_mult)
			tt.dust_prod = tt.dust_prod.add(nbv.add(1).log10())
		}
		tt.dust_prod = tt.dust_prod.mul(this.dust_mult())

		tt.eaGain = this.eaGain()
	},
	calc(dt) {
		if (player.atom.unl) player.evo.proto.dust = player.evo.proto.dust.add(tmp.evo.dust_prod.mul(dt))
		if (hasElement(24)) player.evo.proto.star = player.evo.proto.star.add(tmp.atom.gain.mul(dt))
		if (hasTree("qol1")) for (let x = 291; x <= Math.min(tmp.elements.unl_length[0], 362); x++) buyElement(x,0)
		if (hasElement(293)) for (let x in NEBULAE_TIER) if (!x.includes('ext') || hasInfUpgrade(14)) this.nebula_click(x)
		if (tmp.epUnl) player.evo.proto.exotic_atoms = player.evo.proto.exotic_atoms.add(tmp.evo.eaGain.mul(dt))
	},

	eaGain() {
		let x = nebulaEff('ext1',[1,E(1)])[1], g = tmp.exotic_atom.gain

		x = x.mul(g[0]).mul(g[1]).mul(25)
		if (hasElement(298)) x = x.mul(elemEffect(298))

		x = x.pow(tmp.dark.abEff.ea||1).pow(nebulaEff('ext2'))
        if (tmp.inf_unl) x = x.pow(theoremEff('atom',4))

		return x
	},

	dust_mult() {
		let x = E(1)
		if (tmp.sn.boson) x = x.mul(tmp.sn.boson.upgs.gluon[5].effect)
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
			return Decimal.pow(2,player.evo.proto.nebula[i].sub(tmp.evo.nebula_undim[i]).add(1).pow(1.5)).mul(5e49)
		}
		return player.evo.proto.nebula[i].sub(tmp.evo.nebula_undim[i]).add(1).pow(1+t).mul(10**t)
	},
	nebula_bulk(i) {
		let t = NEBULAE_TIER[i], ext = i.includes('ext')
		if (ext && t == 1) {
			if (tmp.c16active) return E(0)
			return tmp.evo.nebula_res[i].div(5e49).max(1).log(2).root(1.5).add(tmp.evo.nebula_undim[i]).floor()
		}
		if (!ext) if (tmp.c16active || player.qu.rip.active && (!hasElement(169) || NEBULAE_TIER[i] > 1)) return E(0)
		return tmp.evo.nebula_res[i].div(10**t).root(1+t).add(tmp.evo.nebula_undim[i]).floor()
	},
	nebula_gain(i) {
		return this.nebula_bulk(i).sub(player.evo.proto.nebula[i]).max(0)
	},
	nebulae: {
		//Rows: 4 [3 normal + 1 exotic]
		//Tier 1
		red: {
			undiminish: n => n.green.mul(n.blue).cbrt(),
			undiminishDisp: "green and blue",
			eff: n => n.add(1).pow(hasElement(294) ? .5 : .1),
			effDisp: e => formatMult(e) + " Stronger Power"
		},
		green: {
			undiminish: n => n.red.mul(n.blue).cbrt(),
			undiminishDisp: "red and blue",
			eff: n => n.add(1).root(hasElement(294) ? 1.5 : 3),
			effDisp: e => formatMult(e) + " Calm Power"
		},
		blue: {
			undiminish: n => n.red.mul(n.green).cbrt(),
			undiminishDisp: "red and green",
			eff: n => n.add(1).root(hasElement(294) ? 1.5 : 3),
			effDisp: e => formatMult(e) + " Fabric"
		},
		ext1: {
			name: "Exotic I",
			undiminish: n => player.dark.c16.totalS.mul(expMult(player.evo.proto.exotic_atoms,0.5)).add(1).log10(),
			undiminishDisp: "corrupted shards and exotic atoms",
			get resDisp() {return OURO.evo>=4?"stardust":"nebular dust"},
			unl: () => tmp.epUnl,
			eff: n => [n.add(1).root(3), Decimal.pow(2,n.sub(1)).mul(n).overflow('e2000',0.5)],
			effDisp: e => formatMult(e[0],2)+" diminishing returns, +"+format(e[1],0)+" Exotic Atom's generation"
		},
		//Tier 2
		yellow: {
			undiminish: n => n.cyan.mul(n.magenta).root(4),
			undiminishDisp: "cyan and magenta",
			res: n => n.red.add(n.green),
			resDisp: "red and green",
			unl: () => tmp.sn.unl,
			eff: n => [n.cbrt().div(10).add(1), hasElement(301) ? n.add(1).log10().cbrt().div(60).add(1) : undefined],
			effDisp: e => formatPow(e[0]) + " Star Generators" + (e[1] ? ", " + formatPow(e[1]) + ' to exponent' : "")
		},
		cyan: {
			undiminish: n => n.yellow.mul(n.magenta).root(4),
			undiminishDisp: "yellow and magenta",
			res: n => n.green.add(n.blue),
			resDisp: "green and blue",
			unl: () => tmp.sn.unl,
			eff: n => [n.add(1).root(4), hasElement(301) ? n.add(1).log10().cbrt().div(80).add(1) : undefined],
			effDisp: e => formatPow(e[0]) + " Wormhole" + (e[1] ? ", " + formatPow(e[1]) + ' to exponent' : "")
		},
		magenta: {
			undiminish: n => n.yellow.mul(n.cyan).root(4),
			undiminishDisp: "yellow and cyan",
			res: n => n.red.add(n.blue),
			resDisp: "red and blue",
			unl: () => quUnl(),
			eff: n => Decimal.pow(0.95,n.add(1).log10().root(2)),
			effDisp: e => formatReduction(e) + " Pre-Darkness Scalings"
		},
		ext2: {
			name: "Exotic II",
			undiminish: n => player.evo.wh.mass[6].add(1).log10().mul(player.dark.matters.final).root(4).div(10),
			undiminishDisp: "anti-wormhole and FSS",
			res: n => n.ext1,
			resDisp: "Exotic I",
			unl: () => tmp.epUnl,
			eff: n => n.add(1).root(2),
			effDisp: e => formatPow(e) + " Exotic Atoms"
		},
	},

	setupHTML() {
		let h = ``, n = Object.keys(this.nebulae)
		for (var r = 0; r < Math.ceil(n.length / 4); r++) {
			h += `<div class='table_center proto_table'>`
			for (var i = r * 4; i < r * 4 + 4; i++) {
				if (n[i] === undefined) break
				h += `<button id="proto${i}" onclick="PROTOSTAR.nebula_click('${n[i]}')">
					<h4 id="proto_amt${i}"></h4>
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
		tmp.el.proto_dust_prod.setTxt(player.evo.proto.dust.formatGain(tmp.evo.dust_prod))
		tmp.el.ea_amount.setHTML(tmp.epUnl?`<h4>${format(player.evo.proto.exotic_atoms,0)}</h4> Exotic Atoms <span>${player.evo.proto.exotic_atoms.formatGain(tmp.evo.eaGain)}</span>`:"")
		for (var [i, ni] of Object.entries(Object.keys(this.nebulae))) {
			let nb = this.nebulae[ni]
			tmp.el["proto"+i].setDisplay(nb.unl ? nb.unl() : true)
			tmp.el["proto_amt"+i].setTxt(`${player.evo.proto.nebula[ni].format(0)} ${nb.name??capitalFirst(ni)} Nebulae`)
			tmp.el["proto_gain"+i].setTxt("(+"+this.nebula_gain(ni).format(0)+")")
			tmp.el["proto_dim"+i].setHTML(`Next: ${this.nebula_req(ni).format(0)} ${nb.resDisp??"Protostars"}<br>Reduced on ${this.nebulae[ni].undiminishDisp}`)
			tmp.el["proto_eff"+i].setHTML(nb.effDisp(tmp.evo.nebula_eff[ni]))
		}
	},
}

const NEBULAE_TIER = (()=>{
	let x = {}
	for (let [i,ni] of Object.entries(Object.keys(PROTOSTAR.nebulae))) x[ni] = Math.floor(parseInt(i)/4)+1
	return x
})()

function nebulaEff(i, def = 1) {
	return tmp.evo.nebula_eff[i] ?? def
}