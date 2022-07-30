const DIM = {
    reset() {
        createConfirm("Are you sure you want to enter Portal?",
        _=>createConfirm("ARE YOU REALLY SURE? IT RESETS EVERYTHING AS POSSIBLE, RESETS QOL!",
        _=>createConfirm("YOU HAD LASTEST CHANCE TO ENTER PORTAL!?",_=>{
            tmp.dim.reset = true

            tmp.el.white_background.changeStyle("opacity",1)

            setTimeout(_=>{
                tmp.dim.resetStep++

                tmp.el.dim_popup.setHTML(player.dim_shard==0?`
                    You have entered the Portal for the first time!<br><br>
                    Check out the Dimensional Tab!
                `:`
                    You have entered the Portal<br><br><b>${player.dim_shard+1}</b><br><br>times!
                `)

                player.dim_shard++
                updateTemp()
                this.doReset()

                tmp.el.dim_popup.changeStyle("opacity",1)

                setTimeout(_=>{
                    tmp.el.dim_popup.changeStyle("opacity",0)

                    setTimeout(_=>{
                        tmp.dim.resetStep = 0
                        tmp.dim.reset = false

                        tmp.el.white_background.changeStyle("opacity",0)
                    },2000)
                },5000)
            },5000)
        })))
    },
    doReset() {
        let d = player.dim_shard

        // reset infusions and idk

        player.anti.mass = E(0)
        for (let x = 0; x < INFUSIONS_LEN; x++) player.anti.infusions[x] = 0

        player.accelerator = E(0)
        player.free_tickspeed = E(0)

        // reset everything

        player.ranks[RANKS.names[RANKS.names.length-1]] = E(0)
        RANKS.doReset[RANKS.names[RANKS.names.length-1]]()  

        player.mainUpg.rp = []
        player.rp.points = E(0)
        player.tickspeed = E(0)
        player.bh.mass = E(0)

        player.atom.atomic = E(0)
        player.bh.dm = E(0)
        player.bh.condenser = E(0)
        player.mainUpg.bh = []
        for (let x = 1; x <= 12; x++) player.chal.comps[x] = E(0)

        player.atom.points = E(0)
        player.atom.quarks = E(0)
        player.atom.particles = [E(0),E(0),E(0)]
        player.atom.powers = [E(0),E(0),E(0)]
        player.atom.atomic = E(0)
        player.atom.gamma_ray = E(0)
        player.mainUpg.atom = []
        player.atom.elements = []
        player.md.active = false
        player.md.particles = E(0)
        player.md.mass = E(0)
        for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = E(0)
        player.stars.unls = 0
        player.stars.generators = [E(0),E(0),E(0),E(0),E(0)]
        player.stars.points = E(0)
        player.stars.boost = E(0)

        player.supernova.times = E(0)
        player.supernova.stars = E(0)
        player.supernova.tree = []
        player.supernova.bosons = {
            pos_w: E(0),
            neg_w: E(0),
            z_boson: E(0),
            photon: E(0),
            gluon: E(0),
            graviton: E(0),
            hb: E(0),
        }
        for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) player.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = E(0)
        player.supernova.fermions.points = [E(0),E(0)]
        player.supernova.fermions.choosed = ""
        for (let x = 0; x < 2; x++) if (!hasTree("qu_qol"+(2+4*x)) || force) player.supernova.fermions.tiers[x] = [E(0),E(0),E(0),E(0),E(0),E(0)]
        player.supernova.radiation.hz = E(0)
        for (let x = 0; x < 7; x++) {
            player.supernova.radiation.ds[x] = E(0)
            for (let y = 0; y < 2; y++) player.supernova.radiation.bs[2*x+y] = E(0)
        }
        let qu_keep = {
            reached: player.qu.reached,
            qc_presets: player.qu.qc.presets,
        }
        player.qu = getQUSave()
        player.qu.reached = qu_keep.reached
        player.qu.qc.presets = qu_keep.qc_presets
        player.supernova.post_10 = false
        player.rp.unl = false
        player.bh.unl = false
        player.atom.unl = false
        player.md.break = {
            active: false,
            energy: E(0),
            mass: E(0),
            upgs: [],
        }
        for (let x = 0; x < MASS_DILATION.break.upgs.ids.length; x++) player.md.break.upgs[x] = E(0)
        for (let x = 0; x < PRES_LEN; x++) player.prestiges[x] = E(0)
        player.mainUpg.br = []

        tmp.tab = 0
        tmp.stab = [0,0,0,0,0,0,0,0]
        tmp.qc_tab = 0
        tmp.rank_tab = 0
        tmp.tree_tab = 0
        tmp.sn_tab = 0

        if (d >= 2) {
            player.rp.unl = true
            player.bh.unl = true
            player.atom.unl = true
            player.qu.times = E(10)

            player.mainUpg.bh = [5,6]
            player.mainUpg.atom = [2,6]

            player.atom.elements = [14,18,24,30,43]
            player.supernova.tree = ["qol1",'qol3','qola1','qu_qol1','qol4','qol6','qol7']

            player.supernova.times = E(10)
        }

        updateTemp()

        tmp.pass = false
    },
    boost() {
        let d = player.dim_shard

        return {
            massExp: 0.95**(d**0.6),
            rpExp: 0.95**(d**0.6),
            globalSpeed: Decimal.pow(10,d**1.25),
        }
    },
    enterPortal() {
        tmp.anti_tab = !tmp.anti_tab

        if (tmp.anti_tab) {
            document.getElementById("anti-tab").removeAttribute("disabled")
        } else {
            document.getElementById("anti-tab").setAttribute("disabled","")
        }

        updateHTML()
    },
    boostDesc: [
        [
            _=>true,
            _=>`
            <b class="red">-</b> Multipliers' exponent of Normal Mass & BH Mass is reduced by <b>^${format(tmp.dim.boost.massExp,3)}</b><br>
            <b class="red">-</b> Divide the Pre-Quantum Global Speed by <b>${tmp.dim.boost.globalSpeed.format(3)}</b><br>
            <b class="green">+</b> Unlock <b>Accelerator, Extended Elements</b>.
            `,
        ],[
            _=>player.dim_shard>=2,
            _=>`
            <b class="red">-</b> Multiplier's exponent of Rage Power is reduced by <b>^${format(tmp.dim.boost.rpExp,3)}</b><br>
            <b class="green">+</b> Start with Quantum unlocked.
            `,
        ],
    ],
}

function getDimSave() {
    let s = {

    }
    return s
}

function updateDimTemp() {
    let d = tmp.dim

    d.boost = DIM.boost()
}

function updateDimHTML() {
    let unl = dimUnl()
	tmp.el.dim_div.setDisplay(unl)
    tmp.el.portal_div.setDisplay(unl)
	if (unl) tmp.el.dimAmt.setHTML(format(player.dim_shard,0))
}

function dimUnl() { return player.dim_shard > 0 }

function setupDimBoostHTML() {
    let table = new Element("dim_boost_table")
	html = ""
	for (let x in DIM.boostDesc) {
        html += `<div id="dim_boost${x}"></div>`
    }
	table.setHTML(html)
}