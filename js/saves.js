function E(x){return new Decimal(x)};

function uni(x) { return E(1.5e56).mul(x) }

Decimal.prototype.modular=Decimal.prototype.mod=function (other){
    other=E(other);
    if (other.eq(0)) return E(0);
    if (this.sign*other.sign==-1) return this.abs().mod(other.abs()).neg();
    if (this.sign==-1) return this.abs().mod(other.abs());
    return this.sub(this.div(other).floor().mul(other));
};

Decimal.prototype.softcap = function (start, power, mode) {
    var x = this.clone()
    if (x.gte(start)) {
        if ([0, "pow"].includes(mode)) x = x.div(start).pow(power).mul(start)
        if ([1, "mul"].includes(mode)) x = x.sub(start).div(power).add(start)
        if ([2, "exp"].includes(mode)) x = expMult(x.div(start), power).mul(start)
    }
    return x
}

function calc(dt, dt_offline) {
    player.mass = player.mass.add(tmp.massGain.mul(dt))
    if (player.mainUpg.rp.includes(3)) for (let x = 1; x <= UPGS.mass.cols; x++) if (player.autoMassUpg[x] && (player.ranks.rank.gte(x) || player.mainUpg.atom.includes(1))) UPGS.mass.buyMax(x)
    if (FORMS.tickspeed.autoUnl() && player.autoTickspeed) FORMS.tickspeed.buyMax()
    if (FORMS.bh.condenser.autoUnl() && player.bh.autoCondenser) FORMS.bh.condenser.buyMax()
    if (player.atom.elements.includes(18) && player.atom.auto_gr) ATOM.gamma_ray.buyMax()
    if (player.mass.gte(1.5e136)) player.chal.unl = true
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
    if (player.atom.elements.includes(14)) player.atom.quarks = player.atom.quarks.add(tmp.atom.quarkGain.mul(dt*tmp.atom.quarkGainSec))
    if (player.atom.elements.includes(24)) player.atom.points = player.atom.points.add(tmp.atom.gain.mul(dt))
    if (player.atom.elements.includes(30) && !(CHALS.inChal(9) || FERMIONS.onActive("12"))) for (let x = 0; x < 3; x++) player.atom.particles[x] = player.atom.particles[x].add(player.atom.quarks.mul(dt/10))
    if (player.atom.elements.includes(43)) for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) if ((player.supernova.tree.includes("qol3") || player.md.upgs[x].gte(1)) && (MASS_DILATION.upgs.ids[x].unl?MASS_DILATION.upgs.ids[x].unl():true)) MASS_DILATION.upgs.buy(x)
    if (player.bh.unl && tmp.pass) player.bh.mass = player.bh.mass.add(tmp.bh.mass_gain.mul(dt))
    if (player.atom.unl && tmp.pass) {
        player.atom.atomic = player.atom.atomic.add(tmp.atom.atomicGain.mul(dt))
        for (let x = 0; x < 3; x++) player.atom.powers[x] = player.atom.powers[x].add(tmp.atom.particles[x].powerGain.mul(dt))
    }
    if (player.supernova.tree.includes("qol1")) for (let x = 1; x <= tmp.elements.unl_length; x++) if (x<=tmp.elements.upg_length) ELEMENTS.buyUpg(x)
    player.md.mass = player.md.mass.add(tmp.md.mass_gain.mul(dt))
    if (player.supernova.tree.includes("qol3")) player.md.particles = player.md.particles.add(player.md.active ? tmp.md.rp_gain.mul(dt) : tmp.md.passive_rp_gain.mul(dt))
    if (player.supernova.tree.includes("qol4")) STARS.generators.unl(true)
    if (player.supernova.tree.includes("qol7")) {
        for (let x = 0; x < BOSONS.upgs.ids.length; x++) {
            let id = BOSONS.upgs.ids[x]
            for (let y = 0; y < BOSONS.upgs[id].length; y++) BOSONS.upgs.buy(id,y)
        }
    }
    RADIATION.autoBuyBoosts()
    calcStars(dt)
    calcSupernova(dt, dt_offline)

    if (player.supernova.tree.includes("qol6")) CHALS.exit(true)

    tmp.pass = true

    player.offline.time = Math.max(player.offline.time-tmp.offlineMult*dt_offline,0)
    player.time += dt

    if (player.chal.comps[10].gte(1) && !player.supernova.fermions.unl) {
        player.supernova.fermions.unl = true
        addPopup(POPUP_GROUPS.fermions)
    }
}

function getPlayerData() {
    let s = {
        mass: E(0),
        ranks: {
            rank: E(0),
            tier: E(0),
            tetr: E(0),
            pent: E(0),
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
        md: {
            active: false,
            particles: E(0),
            mass: E(0),
            upgs: [],
        },
        stars: {
            unls: 0,
            boost: E(0),
            points: E(0),
            generators: [E(0),E(0),E(0),E(0),E(0)],
        },
        supernova: {
            times: E(0),
            post_10: false,
            stars: E(0),
            tree: [],
            chal: {
                noTick: true,
                noBHC: true,
            },
            bosons: {
                pos_w: E(0),
                neg_w: E(0),
                z_boson: E(0),
                photon: E(0),
                gluon: E(0),
                graviton: E(0),
                hb: E(0),
            },
            b_upgs: {
                photon: [],
                gluon: [],
            },
            fermions: {
                unl: false,
                points: [E(0),E(0)],
                tiers: [[E(0),E(0),E(0),E(0),E(0),E(0)],[E(0),E(0),E(0),E(0),E(0),E(0)]],
                choosed: "",
            },
            radiation: {
                hz: E(0),
                ds: [],
                bs: [],
            },
        },
        reset_msg: "",
        main_upg_msg: [0,0],
        tickspeed: E(0),
        options: {
            font: 'Verdana',
            notation: 'sc'
        },
        confirms: {},
        offline: {
            active: true,
            current: Date.now(),
            time: 0,
        },
        time: 0,
    }
    for (let x = 1; x <= UPGS.main.cols; x++) {
        s.auto_mainUpg[UPGS.main.ids[x]] = false
        s.mainUpg[UPGS.main.ids[x]] = []
    }
    for (let x = 1; x <= CHALS.cols; x++) s.chal.comps[x] = E(0)
    for (let x = 0; x < CONFIRMS.length; x++) s.confirms[CONFIRMS[x]] = true
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) s.md.upgs[x] = E(0)
    for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) s.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = E(0)
    for (let x = 0; x < 7; x++) {
        s.supernova.radiation.ds.push(E(0))
        s.supernova.radiation.bs.push(E(0),E(0))
    }
    return s
}

function wipe(reload=false) {
    if (reload) {
        wipe()
        save()
        resetTemp()
        loadGame(false)
    }
    else player = getPlayerData()
}

function loadPlayer(load) {
    const DATA = getPlayerData()
    player = deepNaN(load, DATA)
    player = deepUndefinedAndDecimal(player, DATA)
    convertStringToDecimal()
    player.reset_msg = ""
    player.main_upg_msg = [0,0]
    player.chal.choosed = 0
    for (i = 0; i < 2; i++) for (let x = 0; x < FERMIONS.types[i].length; x++) {
        let f = FERMIONS.types[i][x]
        player.supernova.fermions.tiers[i][x] = player.supernova.fermions.tiers[i][x].min(typeof f.maxTier == "function" ? f.maxTier() : f.maxTier||1/0)
    }
    let off_time = (Date.now() - player.offline.current)/1000
    if (off_time >= 60 && player.offline.active) player.offline.time += off_time
}

function deepNaN(obj, data) {
    for (let x = 0; x < Object.keys(obj).length; x++) {
        let k = Object.keys(obj)[x]
        if (typeof obj[k] == 'string') {
            if ((obj[k] == "NaNeNaN" || obj[k] == null) && Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = data[k]
        } else {
            if (typeof obj[k] != 'object' && isNaN(obj[k])) obj[k] = data[k]
            if (typeof obj[k] == 'object' && data[k] && obj[k] != null) obj[k] = deepNaN(obj[k], data[k])
        }
    }
    return obj
}

function deepUndefinedAndDecimal(obj, data) {
    if (obj == null) return data
    for (let x = 0; x < Object.keys(data).length; x++) {
        let k = Object.keys(data)[x]
        if (obj[k] === null) continue
        if (obj[k] === undefined) obj[k] = data[k]
        else {
            if (Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = E(obj[k])
            else if (typeof obj[k] == 'object') deepUndefinedAndDecimal(obj[k], data[k])
        }
    }
    return obj
}

function convertStringToDecimal() {
    for (let x = 1; x <= UPGS.mass.cols; x++) if (player.massUpg[x] !== undefined) player.massUpg[x] = E(player.massUpg[x])
    for (let x = 1; x <= CHALS.cols; x++) player.chal.comps[x] = E(player.chal.comps[x])
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = E(player.md.upgs[x]||0)
    for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) player.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = E(player.supernova.b_upgs[BOSONS.upgs.ids[x]][y]||0)
}

function cannotSave() { return tmp.supernova.reached && player.supernova.times.lt(1) }

function save(){
    if (cannotSave()) return
    if (localStorage.getItem("testSave") == '') wipe()
    localStorage.setItem("testSave",btoa(JSON.stringify(player)))
    if (tmp.saving < 1) {addNotify("Game Saved", 3); tmp.saving++}
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

function export_copy() {
    let copyText = document.getElementById('copy')
    copyText.value = btoa(JSON.stringify(player))
    copyText.style.visibility = "visible"
    copyText.select();
    document.execCommand("copy");
    copyText.style.visibility = "hidden"
    addNotify("Copied to Clipboard")
}

function importy() {
    let loadgame = prompt("Paste in your save WARNING: WILL OVERWRITE YOUR CURRENT SAVE")
    if (loadgame == 'monke') {
        addNotify('monke<br><img style="width: 100%; height: 100%" src="https://i.kym-cdn.com/photos/images/original/001/132/314/cbc.jpg">')
        return
    }
    if (loadgame == 'matt parker') {
        addNotify('2+2=5<br><img src="https://cdn2.penguin.com.au/authors/400/106175au.jpg">')
        return
    }
    if (loadgame == 'SUPERNOVA.get()') {
        addNotify('<img src="https://steamuserimages-a.akamaihd.net/ugc/83721257582613769/22687C6536A50ADB3489A721A264E0EF506A89B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false">',6)
        return
    }
    if (loadgame != null) {
        let keep = player
        try {
            setTimeout(_=>{
                load(loadgame)
                save()
                resetTemp()
                loadGame(false)
            }, 200)
        } catch (error) {
            addNotify("Error Importing")
            player = keep
        }
    }
}

function loadGame(start=true) {
    wipe()
    load(localStorage.getItem("testSave"))
    setupHTML()
    
    if (start) {
        setInterval(save,60000)
        for (let x = 0; x < 50; x++) updateTemp()
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
        setInterval(loop, 50)
        setInterval(updateStarsScreenHTML, 50)
        treeCanvas()
        setInterval(drawTreeHTML, 50)
    }
}