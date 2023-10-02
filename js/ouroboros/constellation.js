var const_canvas, const_ctx, const_scroll
var zodiac_tab = "aries"

const CONSTELLATION = {
    require: [
        [()=>player.evo.proto.dust.gte(1e3),()=>`${format(1e3)} Stardust`],
        [()=>player.evo.proto.dust.gte(5e4)&&tmp.evo.zodiac.aries.has>=4,()=>`${format(5e4)} Stardust, 4 Aries Upgrades`],
        [()=>player.evo.proto.dust.gte(1e8)&&player.qu.times.gt(0),()=>`${format(1e8)} Stardust, First ${EVO.amt>=5?'Cosmic':'Quantum'}`],
        [()=>false,()=>`??? Stardust, Evolution 5`],
    ],
    tier() {
        let tier = player.evo.const.tier
        let req = this.require[tier]
        if (!req[0]()) return

        zodiac_tab = Object.keys(this.zodiac)[tier]
        player.evo.const.tier++
    },

    zodiac: {
        aries: {
            name: "Aries",
            tier: 1,
            gain(mult) {
                let x = mult
                return x
            },
            cap: 3,
            upgs: {
                u1: {
                    desc: `Apples boost Zodiac resources and Stardust.`,
                    pos: [360,50],
                    cost: E(50),
                    effect: ()=>player.ouro.apple.pow(.25).div(50).add(1),
                    effDesc: x=>formatMult(x),
                },
                u2: {
                    branch: ["u1"],
                    pos: [240,120],
                    desc: `Aries raises Meditation.`,
                    cost: E(1e3),
                    effect: ()=>getZodiacAmount('aries').add(10).log10().pow(.1),
                    effDesc: x=>formatPow(x),
                },
                o1: {
                    branch: ["u1"],
                    pos: [480,120],
                    desc: `+1 Zodiac Cap.`,
                    cost: E(2e3),
                    perm: true,
                    oct: 1,
                },
                u3: {
                    branch: ["u2"],
                    pos: [240,190],
                    desc: `Automate Elemental.`,
                    cost: E(3e3),
                    perm: true,
                },
                u4: {
                    branch: ["u2"],
                    pos: [480,190],
                    desc: `Gain 25% more Strawberries per Evolution.`,
                    cost: E(2e5),
                    perm: true,
                    effect: ()=>Decimal.pow(1.25,player.evo.times),
                    effDesc: x=>formatMult(x),
                },
            },
        },
        taurus: {
            name: "Taurus",
            tier: 2,
            gain(mult) {
                let x = mult
                return x
            },
            get cap() { return 1 + (hasZodiacUpg('gemini','o1')?1:0) },
            upgs: {
                u1: {
                    desc: `Improve Stardust formula.`,
                    pos: [270,120],
                    cost: E(5000),
                },
                u2: {
                    branch: ["u1"],
                    pos: [360,190],
                    desc: `Yellow Nebulae boost Stardust.`,
                    cost: E(2e4),
                    effect: ()=>player.evo.proto.nebula.yellow.add(1).log10().add(1),
                    effDesc: x=>formatMult(x),
                },
                u3: {
                    branch: ["u2"],
                    pos: [450,120],
                    desc: `Stardust boosts non-exotic Nebulae diminishing returns.`,
                    cost: E(1e5),
                    effect: ()=>player.evo.proto.dust.max(1).pow(.05),
                    effDesc: x=>formatMult(x),
                },
                o1: {
                    unl() { return player.evo.const.tier >= 3 },
                    branch: ["u2"],
                    pos: [360,260],
                    desc: "+1 Gemini Cap.",
                    cost: E(1e5),
                },
                u4: {
                    branch: ["o1"],
                    pos: [240,270],
                    desc: "Quark gain is based on Protostars.",
                    cost: E(2e5),
                },
                u5: {
                    branch: ["o1"],
                    pos: [480,270],
                    desc: "Biennbium-292 can be bought in Big Rips, but weaker. Apples boost this.",
                    cost: E(1e6),

                    effect: ()=>player.ouro.apple.div(1e9).add(1).log(1e3).min(1),
                    effDesc: x=>formatPow(x),
                },
                u6: {
                    unl() { return player.evo.const.tier >= 4 },
                    branch: ["u1"],
                    pos: [240,50],
                    desc: "Apples boost its tier scaling.",
                    cost: EINF,

                    effect: ()=>Math.max(10 - player.ouro.apple.max(1).log10().toNumber() / 10, 6),
                    effDesc: x=>formatMult(10) + " -> " + formatMult(x),
                },
            },
        },
        gemini: {
            name: "Gemini",
            tier: 3,
            gain(mult) {
                let x = mult
                return x
            },
            get cap() { return 2 + (hasZodiacUpg('taurus','o1')?1:0) },
            upgs: {
                u1: {
                    pos: [360,120],
                    desc: "Improve Green Nebulae.",
                    cost: E(1e4),
                },
                u2: {
                    branch: ["u1"],
                    pos: [360,50],
                    desc: "Improve Blue Nebulae.",
                    cost: E(2e4),
                },
                u3: {
                    branch: ["u1"],
                    pos: [430,190],
                    desc: "In Big Rips, Quantum Shards weaken QC modifiers.",
                    cost: E(5e5),

                    effect: ()=>Math.max(1-player.qu.qc.shard/20,.1),
                    effDesc: x=>formatReduction(x) + " weaker"
                },
                o1: {
                    branch: ["u1"],
                    pos: [290,120],
                    desc: "+1 Zodiac cap.",
                    cost: E(1e6),
                    oct: 1,
                },
            },
        },
    },

    buy(zi,ui) {
        if (!tmp.evo.zodiac.can[zi+"-"+ui]) return
        player.evo.const[zi].amount = player.evo.const[zi].amount.sub(this.zodiac[zi].upgs[ui].cost)
        player.evo.const.upg[zi+"-"+ui] = true
        this.zodiacTemp(zi)
    },
    upgGen(zi=zodiac_tab) {
        if (tmp.evo.zodiac.perks<1) return
        if (player.evo.const[zi].level == tmp.evo.zodiac[zi].cap) return
        player.evo.const[zi].level++
        this.temp()
    },

    setupHTML() {
        let h1 = "", h2 = ""

        for (let [zi,z] of Object.entries(this.zodiac)) {
            let h11 = ""
            for (let [ui,u] of Object.entries(z.upgs)) {
                let url = `images/evolution/c_upgs/${zi}-${ui}.png`
                h11 += `<div class='tooltip' id='c_${zi}_upg_${ui}'
                onclick="CONSTELLATION.buy('${zi}','${ui}')"
                style='top: ${u.pos[1]}px; left: ${u.pos[0]}px; background: url("${url}")'></div>`
            }
            h1 += `<div id='c_${zi}_div'>${h11}</div>`
            h2 += `<button class="btn" id="c_${zi}_btn" style="display: none" onclick="zodiac_tab = '${zi}'">${z.name}</button>`
        }

        new Element('const_table').setHTML(h1)
        new Element('zodiac_tabs').setHTML(h2)

        const_scroll = document.getElementById('const_scroll')
        const_canvas = document.getElementById('const_canvas')
        const_ctx = const_canvas.getContext("2d")
    },

    globalMult() {
        let x = E(nebulaEff('yellow'))
        if (hasZodiacUpg('aries','u1')) x = x.mul(zodiacEff('aries','u1'))
        return x
    },

    zodiacTemp(zi) {
        let ct = tmp.evo.zodiac, cu = player.evo.const.upg
        let zt = tmp.evo.zodiac[zi], zp = player.evo.const[zi]
        let zua = 0

        const upgs = this.zodiac[zi].upgs
        let ap = 0

        for (let [ui,u] of Object.entries(upgs)) {
            let unl = !u.unl||u.unl(), bought = cu[zi+"-"+ui]
            if (unl && u.branch) for (let b of u.branch) if (!cu[zi+"-"+b]) unl = false

            let can = unl && !bought && zp.amount.gte(u.cost)
            ct.unl[zi+"-"+ui] = unl
            ct.can[zi+"-"+ui] = can
            if (bought) {
				if (u.effect) tmp.evo.zodiac.eff[zi+"-"+ui] = u.effect()
                if (u.oct) ap += u.oct
                if (u.perm) ct.keep[zi+"-"+ui] = 1
                zua++
            }
        }

        zt.has = zua
        return ap
    },

    temp() {
        const ct = tmp.evo.zodiac, tr = player.evo.const.tier
        let mult = tmp.evo.global_zodiac_mult = this.globalMult()

		if (ct.can == undefined) {
			ct.can = {}
			ct.unl = {}
			ct.keep = {}
		}

        let ap = 0, lp = 0, cp = 0
        for (let [zi,z] of Object.entries(this.zodiac)) {
            let zt = ct[zi] = {}, zp = player.evo.const[zi]
            let lvl = zp.level

            zt.gain = z.gain(Decimal.pow(3, lvl).mul(mult))
            if (tr >= z.tier) cp += zt.cap = z.cap + this.zodiacTemp(zi)
            lp += lvl
        }
        ct.perks = Math.max(0, Math.max(cp - 2, 0) + ap - lp)
    },
    
    calc(dt) {
        const ct = player.evo.const.tier
        for ([zi,z] of Object.entries(this.zodiac)) if (ct >= z.tier) {
            player.evo.const[zi].amount = player.evo.const[zi].amount.add(tmp.evo.zodiac[zi].gain.mul(dt))
        }
        if (hasZodiacUpg('aries','u3')) for (let l = 0; l < 2; l++) buyAllElements(l)
    },

    drawBranch(zi,n1,n2,x1,x2,y1,y2) {
        let bought = player.evo.const.upg[zi+"-"+n2], can = tmp.evo.zodiac.can[zi+"-"+n2]
        const_ctx.lineWidth=bought?6:4;
        const_ctx.beginPath();

        let color = bought?"#ff80ea":can?"#fff":"#333"
        const_ctx.strokeStyle = color;
        const_ctx.moveTo(x1, y1);
        const_ctx.lineTo(x2, y2);
        const_ctx.stroke();
    },

    html() {
        const ct = player.evo.const.tier
        let unlocked = ct >= 1

        tmp.el.const_div.setDisplay(unlocked)
        tmp.el.zodiac_desc.setDisplay(unlocked)
        tmp.el.zodiac_tabs.setDisplay(unlocked)

        let req = this.require[ct]
        tmp.el.const_tier.setDisplay(req)
        if (req) {
            tmp.el.const_tier.setHTML(`
            <h4>Constellation Tier ${format(ct,0)}</h4><br>
            (Req: ${req ? req[1]() : "???"})
            `)
            tmp.el.const_tier.setClasses({btn: true, locked: !req || !req[0]()})
        }

        if (unlocked) {
			let ct = tmp.evo.zodiac
            let ztp = player.evo.const[zodiac_tab], ztt = ct[zodiac_tab]

            tmp.el.zodiac_amount.setHTML(`Level ${format(ztp.level,0)} / ${format(ztt.cap,0)}<br><h3>${ztp.amount.format(0)} ${this.zodiac[zodiac_tab].name}</h3><br>${ztp.amount.formatGain(ztt.gain)}`)
            tmp.el.zodiac_perk.setTxt(format(tmp.evo.zodiac.perks,0)+" Perks")

            tmp.el.const_table.changeStyle('height',CONSTELLATION_MAX_HEIGHTS[zodiac_tab]+'px')

            const_ctx.clearRect(0, 0, const_canvas.width, const_canvas.height);

            let offset = const_scroll.scrollTop
            for (let [zi,z] of Object.entries(this.zodiac)) {
                let id = `c_${zi}`
                tmp.el[id+"_div"].setDisplay(zodiac_tab == zi)
                tmp.el[id+"_btn"].setDisplay(player.evo.const.tier >= z.tier)
                if (zodiac_tab != zi) continue

                let zt = tmp.evo.zodiac[zi], zp = player.evo.const[zi]
                let upgs = z.upgs
				for (let [ui,u] of Object.entries(upgs)) {
                    let u_el = tmp.el[id+"_upg_"+ui]
                    let bought = hasZodiacUpg(zi,ui), unl = ct.unl[zi+"-"+ui] || bought
                    u_el.setDisplay(unl)
                    if (unl) {
						let h = (bought ?
							(u.effDesc ? "Effect: " + u.effDesc(tmp.evo.zodiac.eff[zi+"-"+ui]) + "<br>" : "") +
							(u.perm ? `<b class='snake'>🐍 Stays on Ouroboric!</b>` : "")
						: "Cost: " + u.cost.format(0) + " " + z.name)
						u_el.setClasses( { zodiac_upg: true, tooltip: true, locked: !ct.can[zi+"-"+ui] && !bought, bought } )
                        u_el.setHTML(ct.can[zi+"-"+ui] ? `<h4 class='red'>!</h4>` : ``)
                        u_el.setAttr('tooltip-html', u.desc + (h ? `<br class='line'>` : "") + h)

                        if (u.branch) for (let b of u.branch) if (ct.unl[zi+"-"+b]) {
                            let p = upgs[b].pos
                            this.drawBranch(zi,b,ui,p[0],u.pos[0],p[1]-offset,u.pos[1]-offset)
                        }
                    }
                }
            }
        }
    },
}

function hasZodiacUpg(zi,ui) { return OURO.unl && player.evo.const.upg[zi+"-"+ui] }
function zodiacEff(zi,ui,def=E(1)) { return tmp.evo.zodiac.eff[zi+"-"+ui] ?? def }
function getZodiacAmount(zi) { return player.evo.const[zi].amount }

const CONSTELLATION_MAX_HEIGHTS = (()=>{
    let m = {}
    for (let [zi,z] of Object.entries(CONSTELLATION.zodiac)) {
        let n = 490
        for (let [ui,u] of Object.entries(z.upgs)) n = Math.max(n,u.pos[1]+50)
        m[zi] = n
    }
    return m
})()