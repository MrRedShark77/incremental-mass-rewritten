var const_canvas, const_ctx, const_scroll
var zodiac_tab = "aries"

const CONSTELLATION = {
    require: [
        [()=>player.evo.proto.dust.gte(1e3),()=>`${format(1e3)} Stardust`],
        [()=>player.evo.proto.dust.gte(1e4)&&tmp.evo.zodiac_has.aries>=3,()=>`${format(1e4)} Stardust, 3 Aries Upgrades`],
        [()=>player.evo.proto.dust.gte(1e10)&&player.qu.times.gt(0),()=>`${format(1e10)} Stardust, First ${OURO.evo>=5?'Cosmic':'Quantum'}`],
    ],
    tier() {
        let req = this.require[player.evo.const.tier]
        if (!req || !req[0]()) return
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
                    get desc() { return `Apples boost all zodiac resources.` },
                    pos: [360,50],
                    cost: E(250),
                    effect: ()=>player.ouro.apple.add(1).log10().add(1).log10().add(1).pow(2),
                    effDesc: x=>formatMult(x),
                },
                u2: {
                    branch: ["u1"],
                    get desc() { return `Aries boosts Meditation.` },
                    cost: E(500),
                    pos: [240,120],
                    effect: ()=>expMult(getZodiacAmount('aries').add(1), 0.5),
                    effDesc: x=>formatMult(x),
                },
                o1: {
                    branch: ["u1"],
                    get desc() { return `+2 Zodiac Cap.` },
                    oct: 2,
                    cost: E(1000),
                    pos: [480,120],
                },
                u3: {
                    branch: ["u2"],
                    get desc() { return `Automate all Elements.` },
                    cost: E(1e4),
                    pos: [240,190],
                },
                u4: {
                    branch: ["u2"],
                    get desc() { return `Gain 25% more Strawberries per Evolution.` },
                    cost: E(1e5),
                    pos: [480,190],
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
            get cap() { return 3 + (hasZodiacUpg('gemini','o1')?1:0) },
            upgs: {
                u1: {
                    get desc() { return `Stardust's formula is better.` },
                    pos: [50,50],
                    cost: E(250),
                },
                u2: {
                    branch: ["u1"],
                    get desc() { return `Yellow Nebulae boosts Stardust.` },
                    cost: E(1e4),
                    pos: [360,50],
                    effect: ()=>player.evo.proto.nebula.yellow.add(1).log10().add(1),
                    effDesc: x=>formatMult(x),
                },
                u3: {
                    branch: ["u2"],
                    get desc() { return `Stardust boosts non-exotic Nebulae diminishing returns.` },
                    pos: [670,50],
                    cost: E(5e4),
                    effect: ()=>expMult(player.evo.proto.dust.add(1),0.5),
                    effDesc: x=>formatMult(x),
                },
                o1: {
                    unl() { return player.evo.const.tier >= 3 },
                    branch: ["u2"],
                    get desc() { return `+1 Gemini Cap.` },
                    cost: E(2.5e5),
                    pos: [360,120],
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
            get cap() { return 3 + (hasZodiacUpg('taurus','o1')?1:0) },
            upgs: {
                u1: {
                    get desc() { return `Improve Green Nebulae.` },
                    cost: E(1e4),
                    pos: [360,50],
                },
                u2: {
                    branch: ["u1"],
                    get desc() { return `Improve Blue Nebulae.` },
                    cost: E(1e5),
                    pos: [290,120],
                },
                u3: {
                    unl() { return player.dark.c16.first },
                    branch: ["u1"],
                    get desc() { return `Improve Anti-Wormhole.` },
                    cost: E(3e5),
                    pos: [430,120],
                },
                o1: {
                    branch: ["u2","u3"],
                    get desc() { return `+1 Taurus Cap.` },
                    cost: E(1e6),
                    pos: [360,190],
                },
            },
        },
    },

    buy(zi,ui) {
        if (!tmp.evo.zodiac[zi].can[ui]) return;
        player.evo.const[zi].amount = player.evo.const[zi].amount.sub(this.zodiac[zi].upgs[ui].cost)
        player.evo.const.upg[zi+"-"+ui] = true
        this.zodiacTemp(zi)
    },
    upgGen(zi=zodiac_tab) {
        if (tmp.evo.zodiac_perks<1) return
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
        let x = nebulaEff('yellow',E(1))
        if (hasZodiacUpg('aries','u1')) x = x.mul(zodiacUpgEff('aries','u1'))
        return x
    },

    zodiacTemp(zi) {
        let cu = player.evo.const.upg
        let zt = tmp.evo.zodiac[zi], zp = player.evo.const[zi]
        let zua = 0

        const upgs = this.zodiac[zi].upgs
        let ap = 0

		zt.unl = {}
		zt.can = {}
        for (let [ui,u] of Object.entries(upgs)) {
            let unl = !u.unl||u.unl()
            if (unl && u.branch) for (let b of u.branch) if (!cu[zi+"-"+b]) {
                unl = false
                break
            }
            let can = unl && zp.amount.gte(u.cost)
            zt.unl[ui] = unl
            zt.can[ui] = can
            if (u.effect) tmp.evo.zodiac_eff[zi+"-"+ui] = u.effect()

            if (cu[zi+"-"+ui]) {
                if (u.oct) ap += u.oct
                zua++
            }
        }

        tmp.evo.zodiac_has[zi] = zua

        return ap
    },

    temp() {
        const ct = player.evo.const.tier
        let mult = tmp.evo.global_zodiac_mult = this.globalMult()
        let ap = 0, lp = 0, cp = 0
        for ([zi,z] of Object.entries(this.zodiac)) {
            let zt = tmp.evo.zodiac[zi], zp = player.evo.const[zi]
            let lvl = zp.level

            zt.gain = z.gain(Decimal.pow(2.5, lvl).mul(mult))
            if (ct >= z.tier) cp += zt.cap = z.cap + this.zodiacTemp(zi)
            lp += lvl
        }
        tmp.evo.zodiac_perks = Math.max(0, Math.max(cp - 2, 0) + ap - lp)
    },
    
    calc(dt) {
        const ct = player.evo.const.tier
        for ([zi,z] of Object.entries(this.zodiac)) if (ct >= z.tier) {
            player.evo.const[zi].amount = player.evo.const[zi].amount.add(tmp.evo.zodiac[zi].gain.mul(dt))
        }
        if (hasZodiacUpg('aries','u3')) for (let l = 0; l < 2; l++) {
            let ul = tmp.elements.unl_length[l]
            for (let x = 1; x <= ul; x++) buyElement(x,l)
        }
    },

    drawBranch(zi,n1,n2,x1,x2,y1,y2) {
        let bought = player.evo.const.upg[zi+"-"+n2], can = tmp.evo.zodiac[zi].can[n2]
        const_ctx.lineWidth=bought?12:6;
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

        let req = this.require[ct]
        tmp.el.const_tier.setDisplay(req)
        if (req) {
            tmp.el.const_tier.setHTML(`
            <h4>Constellation Tier ${format(ct,0)}</h4><br>
            Require to evolve: ${req ? req[1]() : "???"}
            `)
            tmp.el.const_tier.setClasses({btn: true, locked: !req || !req[0]()})
        }

        if (unlocked) {
            let ztp = player.evo.const[zodiac_tab], ztt = tmp.evo.zodiac[zodiac_tab]

            tmp.el.zodiac_amount.setHTML(`Level ${format(ztp.level,0)} / ${format(ztt.cap,0)}<br><h3>${ztp.amount.format(0)} ${this.zodiac[zodiac_tab].name}</h3><br>${ztp.amount.formatGain(ztt.gain)}`)
            tmp.el.zodiac_perk.setTxt(format(tmp.evo.zodiac_perks,0)+" Perks")

            tmp.el.const_table.changeStyle('height',CONSTELLATION_MAX_HEIGHTS[zodiac_tab]+'px')

            const_ctx.clearRect(0, 0, const_canvas.width, const_canvas.height);

            let offest = const_scroll.scrollTop

            for (let [zi,z] of Object.entries(this.zodiac)) {
                let id = `c_${zi}`
                tmp.el[id+"_div"].setDisplay(zodiac_tab == zi)
                tmp.el[id+"_btn"].setDisplay(ct >= z.tier)
                const upgs = z.upgs
                let zt = tmp.evo.zodiac[zi], zp = player.evo.const[zi]

                if (zodiac_tab == zi) for (let [ui,u] of Object.entries(upgs)) {
                    let u_el = tmp.el[id+"_upg_"+ui]
                    let unl = zt.unl[ui], bought = hasZodiacUpg(zi,ui)
                    u_el.setDisplay(unl)
                    if (unl) {
						u_el.setClasses( { zoviac_upg: true, tooltip: true } )
                        u_el.setAttr('tooltip-html',u.desc
                        + (u.effDesc && bought
                            ? "<br class='line'> Effect: " + u.effDesc(tmp.evo.zodiac_eff[zi+"-"+ui])
                            : bought
                            ? ""
                            : "<br class='line'> Cost: " + u.cost.format(0) + " " + z.name
                        ))

                        if (u.branch) for (let b of u.branch) if (zt.unl[b]) {
                            let p = upgs[b].pos
                            this.drawBranch(zi,b,ui,p[0],u.pos[0],p[1]-offest,u.pos[1]-offest)
                        }
                    }
                }
            }
        }
    },
}

function hasZodiacUpg(zi,ui) { return tmp.ouro.unl && player.evo.const.upg[zi+"-"+ui] }
function zodiacUpgEff(zi,ui,def=E(1)) { return tmp.evo.zodiac_eff[zi+"-"+ui] ?? def }
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