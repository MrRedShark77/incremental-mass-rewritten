/* ORIGINAL BY AAREX, EDITED BY MRREDSHARK77 */
const OURO = {
    unl: () => tmp.ouro.unl,
    get save() {
        let s = {
            ouro: {
                apple: E(0),
                berry: E(0),
                energy: 0
            },
            evo: {
                times: 0,

                cp: {
                    m_time: 0,
                    points: E(0),
                    best: E(0),
                    level: E(0),
                },
                wh: {
                    fabric: E(0),
                    mass: [],
                    auto: {},
                    origin: 0,
                    rate: 1,
                },
                proto: {
                    star: E(0),
                    dust: E(0),
                    exotic_atoms: E(0),
                    nebula: {}
                },
				const: {
					tier: 0,
					upg: {}
				},
				cosmo: {
					elixir: E(0),
					roll_time: 15,
					galaxy: [],
					cluster: []
				}
            },
        }
        for (let x = 0; x < WORMHOLE.maxLength; x++) s.evo.wh.mass[x] = E(0)
        for (var i in PROTOSTAR.nebulae) s.evo.proto.nebula[i] = E(0)
        for (let [zi,z] of Object.entries(CONSTELLATION.zodiac)) s.evo.const[zi] = {
            amount: E(0),
            level: 0
        }
        for (let i = 0; i < COSMIC.galaxy_len; i++) s.evo.cosmo.galaxy.push({ type: 0, tier: -1 })
        for (let i = 0; i < COSMIC.cluster_len; i++) s.evo.cosmo.cluster.push(E(0))
        return s
    },
    load(force) {
        let unl = force ?? player.ouro != undefined
        if (unl) player = deepUndefinedAndDecimal(player, this.save)
        else {
            delete player.evo
            delete player.ouro
        }

        tmp.ouro = {
            unl,
            apple_eff: {},
            escrow_boosts: {},
        }
        tmp.evo = {
            fed: {},
            meditation_eff: {},
            wormhole_eff: [],
            nebula_eff: {},
            zodiac: { eff: {} },
            cosmo: { eff: {} },
        }

        this.temp()
    },

    canReset: () => player.chal.comps[20].gte(1),
    reset(force) {
        if (!force && !this.canReset()) return

        if (!tmp.ouro.unl) {
            this.load(true)
            addQuote(13)
        }
        if (canEvolve()) {
            player.evo.times++
            setOuroScene()
        }

        this.doReset()
    },
    doReset() {
        player.build.pe.amt = E(0)
        player.build.fvm.amt = E(0)
        if (OURO.unl()) {
			player.ouro.apple = E(0)
			player.evo.wh.origin = 0
			player.evo.wh.unl = false
		}

        for (let i in CORE) tmp.core_eff[i] = []
        INF.doReset()
        INF.load(false)

        let ek = []
        if (OURO.evo >= 4) ek.push(293)
        let keep = {
            atom: {
                elements: ek,
                muonic_el: unchunkify(player.atom.muonic_el).filter(x => MUONIC_ELEM.upgs[x].berry)
            }
        }

        let newData = getPlayerData()
        let reset = ["rp", "bh", "chal", "atom", "supernova", "qu", "dark", "mainUpg"]
        for (var i of reset) player[i] = deepUndefinedAndDecimal(keep[i], newData[i])

		tmp.rp.unl = false
		tmp.bh.unl = false
		tmp.atom.unl = false
		tmp.star_unl = false
		tmp.sn = {}
		destroyOldData()

        tmp.tab = 0
		tmp.stab = [0]
		tmp.rank_tab = 0
		player.options.nav_hide[2] = false
		player.options.res_hide = {}
        updateMuonSymbol()
    },

    temp() {
        if (!this.unl()) return
        const evo = this.evo

        tmp.ouro.escrow_boosts = this.escrow_boosts
        tmp.ouro.apple_gain = appleGain()
        tmp.ouro.berry_gain = berryGain()
        tmp.ouro.apple_eff = appleEffects()

        if (evo >= 1) tmp.evo.meditation_eff = MEDITATION.eff(player.evo.cp.level)
        if (evo >= 2) WORMHOLE.temp()
        if (evo >= 3) PROTOSTAR.temp()
        if (evo >= 4) CONSTELLATION.temp()
        if (evo >= 5) COSMIC.temp()
    },

    calc(dt) {
        if (!this.unl()) return
        calcSnake(dt)

        const evo = this.evo
        if (evo >= 1) MEDITATION.calc(dt)
        if (evo >= 2) WORMHOLE.calc(dt)
        if (evo >= 3) PROTOSTAR.calc(dt)
        if (evo >= 4) CONSTELLATION.calc(dt)
        if (evo >= 5) COSMIC.calc(dt)
    },

    get evo() { return player.evo ? player.evo.times : 0 },

    get escrow_boosts() {
        let x = {}, evo = this.evo

        if (evo == 1) {
            if (FORMS.bh.unl()) x.bhc = BUILDINGS.eff('mass_3','power',E(1)).div(3).max(1)
            if (player.dark.unl) {
                x.apple = player.evo.cp.level.add(1).log10().div(100).add(1).root(2)
                x.quark_overflow = Decimal.pow(0.925,player.evo.cp.level.add(1).log10().sqrt())
            }
            if (tmp.sn.gen) x.sn = expMult(player.evo.cp.level.add(1),0.4)
        } else if (evo == 2) {
            if (player.atom.unl) x.qk = player.evo.wh.mass[0].add(1).log10().add(1).sqrt()
            if (player.supernova.post_10) {
                x.chal = player.chal.comps[9].add(10).log10()
                x.apple = WORMHOLE.total().add(1).log10().div(20).add(1).cbrt()
            }
            if (hasTree("unl1")) x.rank = player.supernova.radiation.hz.add(10).log10().pow(-.1)
        } else if (evo == 3) {
            if (tmp.SN_passive && player.gal_prestige?.gt(0)) x.sn2 = Decimal.pow(2,player.gal_prestige.pow(1.25))
        }

        return x
    },
}

const EVO = {
	msg: [
		null,
		[
			`<img src="images/rp.png"> Rage ➜ Calm <img src="images/evolution/calm_power.png">`,
			`Break the madness of Infinity. Reincarnate as a serpent.`
		],
		[
			`<img src="images/dm.png"> Dark Matter ➜ Fabric <img src="images/evolution/fabric.png">`,
			`Evaporate what causes destruction. Black Hole.`
		],
		[
			`<img src="images/atom.png"> Atoms ➜ Protostars <img src="images/evolution/protostar.png">`,
			`The first glimpses of shattering, all starts small.`
		],
		[
			`<img src="images/sn.png"> Supernova ➜ Constellation <img src="images/evolution/constellation.png">`,
			`No longer exploding, now start exploring.`
		],
	],

    feed: [
        null,
        {},
        {
            e0_219: "corrupted",
            e0_228: "corrupted",
            e0_245: "corrupted",
            e0_248: "corrupted",
            e0_249: "corrupted",
            e0_268: "corrupted",
            e0_287: "corrupted",
            e0_289: "corrupted",
            e1_41: "paralyzed",
            e1_57: "paralyzed",
            ch8: "paralyzed",
        },
        {
            e0_221: "paralyzed",
            e1_19: "paralyzed",
            e1_25: "paralyzed",
            e1_29: "paralyzed",
            e1_32: "paralyzed",
            e1_34: "paralyzed",
            e1_39: "paralyzed",
            e1_51: "paralyzed",
            e1_52: "paralyzed",
            e1_61: "paralyzed",
            cs_ea_reward: "paralyzed",
            ch15: "corrupted",
        },
        {

        },
    ],
    fed_msg: {
        corrupted: "".corrupt(),
        paralyzed: "<b class='saved_text'>[Paralyzed]</b>"
    },
    isFed(x) {
        return tmp.evo.fed[x]
    },
    update_fed() {
        let tt = tmp.evo.fed = {}
        for (var i = 1; i <= OURO.evo; i++) tt = Object.assign(tt, this.feed[i])
    },
}

function escrowBoost(id,def=1) { return tmp.ouro.escrow_boosts[id] ?? def }

function setOuroScene(show=true) {
    tmp.el.ouro_scene.setDisplay(show);

    if (show) {
        const evo = EVO.msg[player.evo.times]

        tmp.el.ouro_evo.setHTML(evo[0])
        tmp.el.ouro_quotes.setHTML(evo[1])
    }
}

function canEvolve() {
    return player.evo.times < 4
}

function updateOuroborosHTML() {
    const evo_unl = OURO.unl(), evo = OURO.evo

    let map = tmp.tab_name

    if (map == 'mass') {
        let unl = evo >= 1 && FORMS.rp.unl()

        tmp.el.meditation_div.setDisplay(unl)
        if (unl) {
            let lvl_gain = MEDITATION.level_gain, lvl = player.evo.cp.level

            tmp.el.meditation_btn.setHTML(`Meditate with all Calm Power.<br>(+${lvl_gain.format(0)} Level)`)
            tmp.el.meditation_btn.setClasses({btn: true, locked: !MEDITATION.can()})

            let eff = tmp.evo.meditation_eff, h = `
            <h4>Level: ${lvl.format(0)}</h4> ${lvl.gte(10) ? '(-'+lvl.div(100).format(2)+'/s)' : ""}
            <br>${formatMult(eff.mass1)} to Muscler's power.
            `

            if (eff.mass2) h += `<br>${formatMult(eff.mass2,2)} to Booster's power`
            if (eff.mass3) h += `<br>${formatMult(eff.mass3,2)} to Stronger's power`
            if (eff.mass3_softcap) h += `<br>${formatReduction(eff.mass3_softcap,2)} to Stronger softcaps' weakness`
            if (eff.mass_softcap) h += `<br>${formatReduction(eff.mass_softcap,2)} to normal mass softcaps' weakness`

            tmp.el.meditation_desc.setHTML(h)
        }
    } else if (tmp.tab_name == 'snake') {
        let head = snake.snakes[0]
        tmp.el.snake_stats.setHTML(
            ('Length: '+head.len)+
            (snake.move_max < Infinity ? ' | Moves without Feeding: '+head.moves+' / '+snake.move_max : "")+
            (snake.powerup ? " | Powerup: "+capitalFirst(snake.powerup)+" ("+formatTime(snake.powerup_time,0)+")": "")
        )

        snake.canvas.style.backgroundPosition = `${snake.cam_pos.x}px ${snake.cam_pos.y}px`

        drawSnake()

        let h = ``, eff = tmp.ouro.apple_eff

        if (eff.mass) h += `<br>${formatMult(eff.mass[0],2) + (hasElement(85,1) ? ", ^" + format(eff.mass[1]) : "")} to normal mass`
        if (eff.cp) h += `<br>${formatMult(eff.cp,2)} to Calm Powers`

        if (eff.cp_lvl) h += `<br>${formatMult(eff.cp_lvl,2)} to Meditation levels`
        if (eff.fabric) h += `<br>${formatMult(eff.fabric,2)} to Fabrics`
        if (eff.wh_loss) h += `<br>${formatMult(eff.wh_loss,2)} to Wormhole's lossless-ness`
        if (eff.ps) h += `<br>${formatMult(eff.ps,2)} to Protostars`
        if (eff.ps_dim) h += `<br>${formatReduction(eff.ps_dim,2)} to Nebulae diminishing returns`

        if (eff.dark) h += `<br>${formatMult(eff.dark,2)} to Dark Rays`
        if (eff.glyph) h += `<br>${formatMult(eff.glyph,2)} to Mass Glyphs`

        tmp.el.snake_boosts.setHTML(`<b class='sky'>${h}</b>`)

        h = ``, eff = tmp.ouro.escrow_boosts

        if (eff.bhc) h += `Stronger power boosts BHC power (<b>${formatMult(eff.bhc)}</b>)<br>`
        if (eff.quark_overflow) h += `Meditation weakens quark overflows (<b>${formatReduction(eff.quark_overflow)}</b>)<br>`
        if (eff.sn) h += `Meditation boosts supernova generation (<b>${formatMult(eff.sn)}</b>)<br>`

        if (eff.qk) h += `First Wormhole raises Quarks (<b>^${format(eff.qk)}</b>)`.corrupt(tmp.c16.in)+"<br>"
        if (eff.chal) h += `Challenge 9 completions scale C5-8 slower (<b>${formatMult(eff.chal)}</b>)<br>`
        if (eff.rank) h += `Frequency weakens Super - Ultra Rank (<b>${formatReduction(eff.rank)}</b>)<br>`

        if (eff.sn2) h += `Galactic prestige boosts supernova generation (<b>${formatMult(eff.sn2)}</b>)<br>`

        if (eff.apple) h += `${[null, "Meditation", "Wormhole", "Protostar"][OURO.evo]} boosts apple feeded (<b>^${format(eff.apple)}</b>)<br>`

        tmp.el.escrow_boosts.setHTML(h)
        tmp.el.snake_boom.setDisplay(OURO.evo >= 2)
    } else if (tmp.tab_name == 'wh') {
        WORMHOLE.html()
    } else if (tmp.tab_name == 'proto') {
        PROTOSTAR.html()
    } else if (tmp.tab_name == 'constellation') {
        CONSTELLATION.html()
    } else if (tmp.tab_name == 'cosmo') {
        COSMIC.html()
    }
}

function setupOuroHTML() {
    setupWormholeHTML()
    PROTOSTAR.setupHTML()
    CONSTELLATION.setupHTML()
    COSMIC.setupHTML()
}

//Others
function playSavedAnimation() {
    tmp.ouro.time = 0
    tmp.ouro.interval = setInterval(() => {
        tmp.ouro.time += 0.1
        if (tmp.ouro.time >= 10) {
            delete tmp.ouro.time
            clearInterval(tmp.ouro.interval)
        }
    }, 100)
}

function getEvo2Ch8Boost() {
    return player.dark.exotic_atom.tier.min(7).add(6).div(10).max(1).pow(-.5)
}