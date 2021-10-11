function E(x){return new Decimal(x)};

Decimal.prototype.softcap = function (start, power, mode) {
    var x = this.clone()
    if (x.gte(start)) {
        if ([0, "pow"].includes(mode)) x = x.div(start).pow(power).mul(start)
        if ([1, "mul"].includes(mode)) x = x.sub(start).div(power).add(start)
    }
    return x
}

function calc(dt) {
    player.mass = player.mass.add(tmp.massGain.mul(dt))
    if (player.mainUpg.rp.includes(3)) for (let x = 1; x <= UPGS.mass.cols; x++) if (player.autoMassUpg[x] && (player.ranks.rank.gte(x) || player.mainUpg.atom.includes(1))) UPGS.mass.buyMax(x)
    if (FORMS.tickspeed.autoUnl() && player.autoTickspeed) FORMS.tickspeed.buyMax()
    if (FORMS.bh.condenser.autoUnl() && player.bh.autoCondenser) FORMS.bh.condenser.buyMax()
    if (player.atom.elements.includes(18) && player.atom.auto_gr) ATOM.gamma_ray.buyMax()
    for (let x = 0; x < RANKS.names.length; x++) {
        let rn = RANKS.names[x]
        if (RANKS.autoUnl[rn]() && player.auto_ranks[rn]) RANKS.bulk(rn)
    }
    for (let x = 1; x <= UPGS.main.cols; x++) {
        let id = UPGS.main.ids[x]
        let upg = UPGS.main[x]
        if (upg.auto_unl ? upg.auto_unl() : false) if (player.auto_mainUpg[id]) for (let y = 1; y <= upg.lens; y++) if (upg[y].unl ? upg[y].unl() : true) upg.buy(y)
    }
    if (player.mainUpg.bh.includes(6) || player.mainUpg.atom.includes(6)) player.rp.points = player.rp.points.add(tmp.rp.gain.mul(dt))
    if (player.mainUpg.atom.includes(6)) player.bh.dm = player.bh.dm.add(tmp.bh.dm_gain.mul(dt))
    if (player.atom.elements.includes(14)) player.atom.quarks = player.atom.quarks.add(tmp.atom?tmp.atom.quarkGain.mul(dt/20):0)
    if (player.bh.unl) player.bh.mass = player.bh.mass.add(tmp.bh.mass_gain.mul(dt))
    if (player.atom.unl) {
        player.atom.atomic = player.atom.atomic.add(tmp.atom.atomicGain.mul(dt))
        for (let x = 0; x < 3; x++) player.atom.powers[x] = player.atom.powers[x].add(tmp.atom.particles[x].powerGain.mul(dt))
    }
    if (player.mass.gte(1.5e136)) player.chal.unl = true
}

function getPlayerData() {
    let s = {
        mass: E(0),
        ranks: {
            rank: E(0),
            tier: E(0),
            tetr: E(0),
        },
        auto_ranks: {
            rank: false,
            tier: false,
        },
        auto_mainUpg: {
            
        },
        massUpg: {},
        autoMassUpg: [null,false,false,false],
        autoTickspeed: false,
        mainUpg: {
            
        },
        tab: [0,0],
        ranks_reward: 0,
        scaling_ch: 0,
        rp: {
            points: E(0),
            unl: false,
        },
        bh: {
            unl: false,
            dm: E(0),
            mass: E(0),
            condenser: E(0),
            autoCondenser: false,
        },
        chal: {
            unl: false,
            active: 0,
            choosed: 0,
            comps: {},
        },
        atom: {
            unl: false,
            points: E(0),
            atomic: E(0),
            auto_gr: false,
            gamma_ray: E(0),
            quarks: E(0),
            particles: [E(0), E(0), E(0)],
            powers: [E(0), E(0), E(0)],
            ratio: 0,
            dRatio: [1,1,1],
            elements: [],
        },
        reset_msg: "",
        main_upg_msg: [0,0],
        tickspeed: E(0),
        options: {
            font: 'Verdana',
        },
        confirms: {},
    }
    for (let x = 1; x <= UPGS.main.cols; x++) {
        s.auto_mainUpg[UPGS.main.ids[x]] = false
        s.mainUpg[UPGS.main.ids[x]] = []
    }
    for (let x = 1; x <= CHALS.cols; x++) s.chal.comps[x] = E(0)
    for (let x = 0; x < CONFIRMS.length; x++) s.confirms[CONFIRMS[x]] = true
    return s
}

function wipe() {
    player = getPlayerData()
}

function loadPlayer(load) {
    player = Object.assign(getPlayerData(), load)
    for (let x = 0; x < Object.keys(player).length; x++) {
        let k = Object.keys(player)[x]
        if (typeof player[k] == 'object' && getPlayerData()[k]) player[k] = Object.assign(getPlayerData()[k], load[k])
    }
    convertStringToDecimal()
    player.tab = [0,0]
    player.reset_msg = ""
    player.main_upg_msg = [0,0]
    player.chal.choosed = 0
}

function convertStringToDecimal() {
    player.mass = E(player.mass)
    player.tickspeed = E(player.tickspeed)
    player.rp.points = E(player.rp.points)

    player.bh.dm = E(player.bh.dm)
    player.bh.mass = E(player.bh.mass)
    player.bh.condenser = E(player.bh.condenser)

    player.atom.points = E(player.atom.points)
    player.atom.atomic = E(player.atom.atomic)
    player.atom.gamma_ray = E(player.atom.gamma_ray)
    player.atom.quarks = E(player.atom.quarks)
    for (let x = 0; x < ATOM.particles.names.length; x++) {
        player.atom.particles[x] = E(player.atom.particles[x])
        player.atom.powers[x] = E(player.atom.powers[x])
    }

    for (let x = 0; x < RANKS.names.length; x++) player.ranks[RANKS.names[x]] = E(player.ranks[RANKS.names[x]])
    for (let x = 1; x <= UPGS.mass.cols; x++) if (player.massUpg[x] !== undefined) player.massUpg[x] = E(player.massUpg[x])
    for (let x = 1; x <= CHALS.cols; x++) player.chal.comps[x] = E(player.chal.comps[x])
}

function save(){
    if (localStorage.getItem("testSave") == '') wipe()
    localStorage.setItem("testSave",btoa(JSON.stringify(player)))
}

function load(x){
    if(typeof x == "string" & x != ''){
        loadPlayer(JSON.parse(atob(x)))
    } else {
        wipe()
    }
}

function exporty() {
    save();
    let file = new Blob([btoa(JSON.stringify(player))], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "Incremental Mass Rewritten Save - "+new Date().toGMTString()+".txt"
    a.click()
}

function importy() {
    let loadgame = prompt("Paste in your save WARNING: WILL OVERWRITE YOUR CURRENT SAVE")
    if (loadgame != null) {
        load(loadgame)
        location.reload()
    }
}

function loadGame() {
    wipe()
    load(localStorage.getItem("testSave"))
    setupHTML()
    setInterval(save,1000)
    updateTemp()
    updateHTML()
    for (let x = 0; x < 3; x++) {
        let r = document.getElementById('ratio_d'+x)
        r.value = player.atom.dRatio[x]
        r.addEventListener('input', e=>{
            let n = Number(e.target.value)
            if (n < 1) {
                player.atom.dRatio[x] = 1
                r.value = 1
            } else {
                if (Math.floor(n) != n) r.value = Math.floor(n)
                player.atom.dRatio[x] = Math.floor(n)
            }
        })
    }
    tmp.el.loading.setDisplay(false)
    tmp.el.app.setDisplay(true)
}