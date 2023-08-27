const PROTOSTAR = {
	temp() {
		let tt = tmp.evo
		tt.dust_prod = E(0)
		tt.nebula_eff = {}
		tt.nebula_undim = {}

		let dim_mult = appleEffect("ps_undim")

		for (var ni in this.nebulae) {
			let n = this.nebulae[ni], nb = player.evo.proto.nebula
			tt.nebula_eff[ni] = n.eff(nb[ni])
			tt.nebula_undim[ni] = n.undiminish(nb).mul(dim_mult)
			tt.dust_prod = tt.dust_prod.add(nb[ni].add(1).log10())
		}
		tt.dust_prod = tt.dust_prod.mul(this.dust_mult())
	},
	calc(dt) {
		if (player.atom.unl) player.evo.proto.dust = player.evo.proto.dust.add(tmp.evo.dust_prod.mul(dt))
		if (hasElement(24)) player.evo.proto.star = player.evo.proto.star.add(tmp.atom.gain.mul(dt))
		if (hasTree("qol1")) for (let x = 291; x <= Math.min(tmp.elements.unl_length[0], 362); x++) buyElement(x,0)
	},

	dust_mult() {
		return E(1)
	},

	nebula_click(i) {
		let nb = player.evo.proto.nebula
		nb[i] = nb[i].max(this.nebula_bulk(i))
	},
	nebula_req(i) {
		return player.evo.proto.nebula[i].sub(tmp.evo.nebula_undim[i]).add(1).pow(2).mul(10)
	},
	nebula_bulk(i) {
		return player.evo.proto.star.div(10).root(2).add(tmp.evo.nebula_undim[i]).floor()
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
			eff: n => n.add(1).pow(.001),
			effDisp: e => formatMult(e) + " Stronger Power"
		},
		green: {
			undiminish: n => n.red.mul(n.blue).cbrt(),
			undiminishDisp: "red and blue",
			eff: n => n.add(1).cbrt(),
			effDisp: e => formatMult(e) + " Calm Power"
		},
		blue: {
			undiminish: n => n.red.mul(n.green).cbrt(),
			undiminishDisp: "red and green",
			eff: n => n.add(1).cbrt(),
			effDisp: e => formatMult(e) + " Fabric"
		},
		ext1: {
			undiminish: n => E(0),
			undiminishDisp: "nothing",
			unl: _ => false,
			eff: n => n,
			effDisp: e => formatMult(e)
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
		tmp.el.proto_dust.setTxt(formatMass(player.evo.proto.dust))
		tmp.el.proto_dust_prod.setTxt(player.evo.proto.dust.formatGain(tmp.evo.dust_prod))
		for (var [i, ni] of Object.entries(Object.keys(this.nebulae))) {
			let nb = this.nebulae[ni]
			tmp.el["proto"+i].setDisplay(nb.unl ? nb.unl() : true)
			tmp.el["proto_amt"+i].setTxt(`${player.evo.proto.nebula[ni].format(0)} ${capitalFirst(ni)} Nebulae`)
			tmp.el["proto_gain"+i].setTxt("(+0)")
			tmp.el["proto_dim"+i].setHTML(`Next: ${this.nebula_req(ni).format(0)} Protostars<br>Reduced on ${this.nebulae[ni].undiminishDisp}`)
			tmp.el["proto_eff"+i].setHTML(nb.effDisp(tmp.evo.nebula_eff[ni]))
		}
	},
}

function nebulaEff(i, def = 1) {
	return tmp.evo.nebula_eff[i] ?? def
}