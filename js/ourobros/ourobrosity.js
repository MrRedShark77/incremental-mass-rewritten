/* ORIGINAL BY AAREX, EDITED BY MRREDSHARK77 */

const OURO = {
    unl: _ => tmp.ouro.unl,
    save() {
        let s = {
            ouro: {
                apple: E(0),
                berry: E(0),
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
                },
            }
        }
        for (let x = 0; x < WORMHOLE.maxLength; x++) s.evo.wh.mass[x] = E(0)
        return s
    },
    load(force) {
        let unl = force || player.ouro != undefined
        if (unl) player = deepUndefinedAndDecimal(player, this.save())
        tmp.ouro = {
            unl,
            apple_eff: {},
            escrow_boosts: {},
        }
        tmp.evo = {
            mediation_eff: {},
            mediation_loss: {},

            wormhole_eff: [],
            wormhole_mult: [],
            wormhole_power: E(2),
        }
        this.temp()
    },

    canReset: _ => player.chal.comps[20].gte(1),
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
        let newData = getPlayerData()
        player.inf = newData.inf
        INF.doReset()

        player.build.pe.amt = E(0)
        player.build.fvm.amt = E(0)
        player.ouro.apple = E(0)

        let mu_keep = player.atom.muonic_el.filter(x => MUONIC_ELEM.upgs[x].berry)
        let keep = { atom: { muonic_el: mu_keep } }
        let reset = ["rp", "bh", "chal", "atom", "supernova", "qu", "dark", "gal_prestige", "ascensions", "mainUpg"]
        for (var i of reset) player[i] = deepUndefinedAndDecimal(keep[i], newData[i])

        tmp.tab = 0; tmp.stab = [0];
        updateTemp()
    },

    temp() {
        if (!this.unl()) return
        const evo = this.evolution

        tmp.ouro.escrow_boosts = this.escrow_boosts
        tmp.ouro.apple_gain = appleGain()
        tmp.ouro.berry_gain = berryGain()
        tmp.ouro.apple_eff = appleEffects()

        if (evo >= 1) {
            tmp.evo.mediation_eff = MEDIATION.eff(player.evo.cp.level)
            tmp.evo.mediation_loss = MEDIATION.loss(player.evo.cp.level)
        }

        if (evo >= 2) WORMHOLE.temp()
    },

    calc(dt) {
        if (!this.unl()) return
        const evo = this.evolution

        calcSnake(dt)

        if (evo >= 1) MEDIATION.calc(dt)
        if (evo >= 2) WORMHOLE.calc(dt)
    },

    get evolution() { return player.evo ? player.evo.times : 0 },

    get escrow_boosts() {
        let x = {}, evo = this.evolution

        if (evo == 1) {
            if (player.dark.unl) {
                x.apple = player.evo.cp.level.add(1).log10().div(100).add(1).root(2)
                x.quark_overflow = Decimal.pow(0.925,player.evo.cp.level.add(1).log10().root(2))
            }
            if (tmp.SN_passive) x.sn = expMult(player.evo.cp.level.add(1),0.4)
        }

        return x
    },
}

const EVOLUTION_DATA = [
    null,
    [
        `<img src="images/rp.png"> Rage ➜ Calm <img src="images/evolution/calm_power.png">`,
        `<span>Break the madness of Infinity. Reincarnate as a serpent.</span>`
    ],
    [
        `<img src="images/dm.png"> Dark Matter ➜ Fabric <img src="images/evolution/fabric.png">`,
        `<span>Evaporate what causes destruction. Black Hole.</span>`
    ],
]

function escrowBoost(id,def=1) { return tmp.ouro.escrow_boosts[id] ?? def }

function setOuroScene(show=true) {
    tmp.el.ouro_scene.setDisplay(show);

    if (show) {
        const evo = EVOLUTION_DATA[player.evo.times]

        tmp.el.ouro_evo.setHTML(evo[0])
        tmp.el.ouro_quotes.setHTML(evo[1])
    }
}

function canEvolve() {
    return player.evo.times < 2
}

function updateOuroborosHTML() {
    const evo_unl = OURO.unl(), evo = OURO.evolution

    let map = tmp.tab_name

    if (map == 'mass') {
        let unl = evo >= 1 && player.rp.unl

        tmp.el.mediation_div.setDisplay(unl)
        if (unl) {
            let lvl_gain = MEDIATION.level_gain, lvl = player.evo.cp.level, loss = tmp.evo.mediation_loss

            tmp.el.mediation_btn.setHTML(`Mediate with all Calm Power.<br>(+${lvl_gain.format(0)} Level)`)
            tmp.el.mediation_btn.setClasses({btn: true, locked: lvl_gain.lt(1)})

            let eff = tmp.evo.mediation_eff, h = `
            <h4>Level: ${lvl.format(0)}</h4> ${lvl.gte(loss.start) ? '(-'+loss.speed.div(10).format(2)+'/s)' : ""}
            <br>${formatMult(eff.mass1)} to Muscler's power.
            `

            if (eff.mass2) h += `<br>${formatMult(eff.mass2,2)} to Booster's power`
            if (eff.mass3) h += `<br>${formatMult(eff.mass3,2)} to Stronger's power`
            if (eff.mass3_softcap) h += `<br>${formatReduction(eff.mass3_softcap,2)} to Stronger softcaps' weakness`
            if (eff.mass_softcap) h += `<br>${formatReduction(eff.mass_softcap,2)} to normal mass softcaps' weakness`

            tmp.el.mediation_desc.setHTML(h)
        }
    } else if (tmp.tab_name == 'snake') {
        tmp.el.snake_stats.setHTML(
			('Length: '+snake.bodies.length)+
			(snake.move_max < Infinity ? ' | Moves without Feeding: '+snake.moves+' / '+snake.move_max : "")+
			(snake.powerup ? " | Powerup: "+capitalFirst(snake.powerup)+" ("+formatTime(snake.powerup_time,0)+")": "")
		)

        snake.canvas.style.backgroundPosition = `${snake.cam_pos.x}px ${snake.cam_pos.y}px`

        drawSnake()

        let h = ``, eff = tmp.ouro.apple_eff

        if (eff.mass) h += `<br>${formatMult(eff.mass,2)} to normal mass`
        if (eff.cp) h += `<br>${formatMult(eff.cp,2)} to Calm Powers`

        if (eff.cp_lvl) h += `<br>${formatMult(eff.cp_lvl,2)} to Mediation levels`
        if (eff.fabric) h += `<br>${formatMult(eff.fabric,2)} to Fabrics`
        if (eff.wh_loss) h += `<br>${formatReduction(eff.wh_loss,2)} to Wormhole's lossless-ness`

        if (eff.dark) h += `<br>${formatMult(eff.dark,2)} to Dark Rays`
        if (eff.glyph) h += `<br>${formatMult(eff.glyph,2)} to Mass Glyphs`

        tmp.el.apples.setHTML(`You have <h3>${player.ouro.apple.format(0)}</h3> apples. (+${tmp.ouro.apple_gain.format(0)}/feed)<b class='sky'>${h}</b>`)

        h = ``, eff = tmp.ouro.escrow_boosts

        if (eff.apple) h += `Mediation boosts apple feeded (<b>^${format(eff.apple,2)}</b>)<br>`
        if (eff.quark_overflow) h += `Mediation weakens quark overflows (<b>${formatReduction(eff.quark_overflow,2)}</b>)<br>`
        if (eff.sn) h += `Mediation boosts supernova generation (<b>${formatMult(eff.sn,2)}</b>)<br>`

        tmp.el.escrow_boosts.setHTML(h)

        h = `
        You have <h4>${player.ouro.berry.format(0)}</h4> strawberries that can be spent for muonic elements. (+${tmp.ouro.berry_gain.format(0)}/feed)
        `

        tmp.el.ouro_other_res.setHTML(h)
    } else if (tmp.tab_name == 'wh') {
        WORMHOLE.html()
    }
}

function setupOuroHTML() {
    setupWormholeHTML()
}