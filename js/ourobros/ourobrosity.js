/* ORIGINAL BY AAREX, EDITED BY MRREDSHARK77 */

const OURO = {
    unl: _ => tmp.ouro.unl,
    save() {
        let s = {
            ouro: {
                apple: E(0),
            },
            evo: {
                times: 0,

                cp: {
                    m_time: 0,
                    points: E(0),
                    level: E(0),
                },
            }
        }
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

        let keep = {}
        let reset = ["rp", "bh", "chal", "atom", "supernova", "qu", "dark", "gal_prestige", "ascensions", "mainUpg"]
        for (var i of reset) player[i] = deepUndefinedAndDecimal(keep[i], newData[i])

        tmp.tab = 0; tmp.stab = [0];

        tmp.pass = 2;

        updateTemp()
    },

    temp() {
        if (!this.unl()) return

        tmp.ouro.escrow_boosts = this.escrow_boosts
        tmp.ouro.apple_gain = appleGain()
        tmp.ouro.apple_eff = appleEffects()

        tmp.evo.mediation_eff = MEDIATION.eff(player.evo.cp.level)
        tmp.evo.mediation_loss = MEDIATION.loss(player.evo.cp.level)
    },

    calc(dt) {
        if (!this.unl()) return
        let evo = this.evolution

        calcSnake(dt)

        if (evo >= 1) {
            if (player.mainUpg.bh.includes(6) || player.mainUpg.atom.includes(6)) player.evo.cp.points = player.evo.cp.points.add(tmp.rp.gain.mul(dt))

            let med_loss = tmp.evo.mediation_loss
            if (player.evo.cp.level.gte(med_loss.start)) player.evo.cp.level = player.evo.cp.level.sub(med_loss.speed.mul(dt/10)).max(med_loss.start)

            if (hasElement(70,1)) {
                let t = player.evo.cp.m_time + dt
                if (t >= 1) {
                    let w = Math.floor(t)
                    player.evo.cp.level = player.evo.cp.level.add(MEDIATION.level_gain.mul(w))
                    t -= w
                }
                player.evo.cp.m_time = t
            }
        }
    },

    get evolution() { return player.evo ? player.evo.times : 0 },

    get escrow_boosts() {
        let x = {}, evo = this.evolution

        if (evo == 1) {
            if (player.bh.unl) x.bhc = BUILDINGS.eff('mass_2','power',E(1)).add(1).log10().add(1).root(2)
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
    return player.evo.times == 0
}

function updateOurobrosHTML() {
    const evo_unl = OURO.unl()

    let map = tmp.tab_name

    if (map == 'mass') {
        let unl = evo_unl && player.rp.unl

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

            tmp.el.mediation_desc.setHTML(h)
        }
    } else if (tmp.tab_name == 'snake') {
        tmp.el.snake_stats.setHTML( 'Moves without Feeding: '+snake.moves+' / 15 | Length: '+snake.bodies.length )

        snake.canvas.style.backgroundPosition = `${snake.cam_pos.x}px ${snake.cam_pos.y}px`

        drawSnake()

        let h = ``, eff = tmp.ouro.apple_eff

        if (eff.mass) h += `<br>${formatMult(eff.mass,2)} to normal mass`
        if (eff.cp) h += `<br>${formatMult(eff.cp,2)} to Calm Powers`

        tmp.el.apples.setHTML(`You have <h3>${player.ouro.apple.format(0)}</h3> apples. (+${tmp.ouro.apple_gain.format(0)}/feed)<b class='sky'>${h}</b>`)

        h = ``, eff = tmp.ouro.escrow_boosts

        if (eff.bhc) h += `Booster's power boosts BHC's power at a reduced rate (<b>${formatMult(eff.bhc,2)}</b>)<br>`

        tmp.el.escrow_boosts.setHTML(h)
    }
}

const MEDIATION = {
    mediate() {
        let lvl = this.level_gain
        if (lvl.lt(1)) return;
        player.evo.cp.level = player.evo.cp.level.add(lvl)
        player.evo.cp.points = E(0)
    },
    get level_gain() {
        let cp = expMult(player.evo.cp.points,0.5)

        if (player.atom.unl && tmp.atom) cp = cp.mul(tmp.atom.atomicEff[1])

        return cp.floor()
    },
    loss(lvl) {
        let start = E(10)
        let speed = E(1)

        if (lvl.gte(start)) speed = speed.mul(lvl.div(start))

        //losing is faster at higher values
        return { speed, start }
    },
    eff(lvl) {
        let eff = {}

        eff.mass1 = lvl.add(1)
        if (hasElement(67,1)) eff.mass2 = lvl.div(100).add(1)
        if (hasElement(69,1)) eff.mass3 = lvl.add(1).log10().div(10).add(1)

        return eff
    }
}