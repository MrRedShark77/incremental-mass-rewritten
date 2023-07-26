function E(x){return new Decimal(x)};

const EINF = Decimal.dInf
const FPS = 20

function uni(x) { return E(1.5e56).mul(x) }
function mlt(x) { return uni("ee9").pow(x) }

Decimal.prototype.modular=Decimal.prototype.mod=function (other){
    other=E(other);
    if (other.eq(0)) return E(0);
    if (this.sign*other.sign==-1) return this.abs().mod(other.abs()).neg();
    if (this.sign==-1) return this.abs().mod(other.abs());
    return this.sub(this.div(other).floor().mul(other));
};

Decimal.prototype.softcap = function (start, power, mode, dis=false) {
    var x = this.clone()
    if (!dis&&x.gte(start)) {
        if ([0, "pow"].includes(mode)) x = x.div(start).max(1).pow(power).mul(start)
        if ([1, "mul"].includes(mode)) x = x.sub(start).div(power).add(start)
        if ([2, "exp"].includes(mode)) x = expMult(x.div(start), power).mul(start)
    }
    return x
}

Decimal.prototype.scale = function (s, p, mode, rev=false) {
    s = E(s)
    p = E(p)
    var x = this.clone()
    if (x.gte(s)) {
        if ([0, "pow"].includes(mode)) x = rev ? x.div(s).root(p).mul(s) : x.div(s).pow(p).mul(s)
        if ([1, "exp"].includes(mode)) x = rev ? x.div(s).max(1).log(p).add(s) : Decimal.pow(p,x.sub(s)).mul(s)
        if ([2, "dil"].includes(mode)) {
            let s10 = s.log10()
            x = rev ? Decimal.pow(10,x.log10().div(s10).root(p).mul(s10)) : Decimal.pow(10,x.log10().div(s10).pow(p).mul(s10))
        }
        if ([3, "alt_exp"].includes(mode)) x = rev ? x.div(s).max(1).log(p).add(1).mul(s) : Decimal.pow(p,x.div(s).sub(1)).mul(s)
    }
    return x
}

Decimal.prototype.scaleName = function (type, id, rev=false, type_index) {
    var x = this.clone()
    if (SCALE_START[type][id] && SCALE_POWER[type][id]) {
        let s = tmp.scaling_start[type][id]
        let p = tmp.scaling_power[type][id]
        let e = Decimal.pow(SCALE_POWER[type][id],p)
        
        x = x.scale(s,e,type_index%4==3?type_index>=7?3:1:type_index>=6?2:0,rev)
    }
    return x
}

Decimal.prototype.scaleEvery = function (id, rev=false, fp=SCALE_FP[id]?SCALE_FP[id]():[1,1,1,1,1,1]) {
    var x = this.clone()
    for (let i = 0; i < SCALE_TYPE.length; i++) {
        let s = rev?i:SCALE_TYPE.length-1-i
        let sc = SCALE_TYPE[s]

        let f = fp[s]||1

        // if (Decimal.gt(f,1)) console.log(id,format(f))

        // if (tmp.no_scalings[sc].includes(id)) continue

        x = tmp.no_scalings[sc].includes(id) ? rev?x.mul(f):x.div(f) : rev?x.mul(f).scaleName(sc,id,rev,s):x.scaleName(sc,id,rev,s).div(f)
    }
    return x
}

Decimal.prototype.format = function (acc=4, max=12) { return format(this.clone(), acc, max) }

Decimal.prototype.formatGain = function (gain, mass=false) { return formatGain(this.clone(), gain, mass) }

function softcapHTML(x, start, invisible=false) { return !invisible&&E(x).gte(start)?` <span class='soft'>(softcapped)</span>`:"" }

Decimal.prototype.softcapHTML = function (start, invisible) { return softcapHTML(this.clone(), start, invisible) }

function calcOverflow(x,y,s,height=1) { return x.gte(s) ? x.max(1).iteratedlog(10,height).div(y.max(1).iteratedlog(10,height)) : E(1) }

String.prototype.corrupt = function (active=true) { return active ? this.strike() + ` <span class='corrupted_text'>[Corrupted]</span>` : this }

function calc(dt) {
    let du_gs = tmp.preQUGlobalSpeed.mul(dt)
    let inf_gs = tmp.preInfGlobalSpeed.mul(dt)

    if (tmp.pass<=0 && tmp.inf_time == 0) {
        player.mass = player.mass.add(tmp.massGain.mul(du_gs))
        if (!tmp.brokenInf) player.mass = player.mass.min(tmp.inf_limit)
        
        if (player.mass.gte(1.5e136)) player.chal.unl = true
        for (let x = 0; x < RANKS.names.length; x++) {
            let rn = RANKS.names[x]
            if (tmp.brUnl && x < 4 || RANKS.autoUnl[rn]() && player.auto_ranks[rn]) RANKS.bulk(rn)
        }
        if (player.auto_ranks.beyond && (hasBeyondRank(2,1)||hasInfUpgrade(10))) BEYOND_RANKS.reset(true)
        for (let x = 0; x < PRES_LEN; x++) if (PRESTIGES.autoUnl[x]() && player.auto_pres[x]) PRESTIGES.reset(x,true)
        for (let x = 0; x < ASCENSIONS.names.length; x++) if (ASCENSIONS.autoUnl[x]() && player.auto_asc[x]) ASCENSIONS.reset(x,true)
        for (let x = 1; x <= UPGS.main.cols; x++) {
            let id = UPGS.main.ids[x]
            let upg = UPGS.main[x]
            if (upg.auto_unl ? upg.auto_unl() : false) if (player.auto_mainUpg[id]) for (let y = 1; y <= upg.lens; y++) if (upg[y].unl ? upg[y].unl() : true) upg.buy(y)
        }
        if (player.mainUpg.bh.includes(6) || player.mainUpg.atom.includes(6)) player.rp.points = player.rp.points.add(tmp.rp.gain.mul(du_gs))
        if (player.mainUpg.atom.includes(6)) player.bh.dm = player.bh.dm.add(tmp.bh.dm_gain.mul(du_gs))
        if (hasElement(14)) player.atom.quarks = player.atom.quarks.add(tmp.atom.quarkGain.mul(du_gs.mul(tmp.atom.quarkGainSec)))
        if (hasElement(24)) player.atom.points = player.atom.points.add(tmp.atom.gain.mul(du_gs))
        if (hasElement(30) && !(CHALS.inChal(9) || FERMIONS.onActive("12"))) for (let x = 0; x < 3; x++) player.atom.particles[x] = player.atom.particles[x].add(player.atom.quarks.mul(du_gs).div(10))
        if (hasElement(43)) for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) if ((hasTree("qol3") || player.md.upgs[x].gte(1)) && (MASS_DILATION.upgs.ids[x].unl?MASS_DILATION.upgs.ids[x].unl():true)) MASS_DILATION.upgs.buy(x)
        if (hasElement(123)) for (let x = 0; x < MASS_DILATION.break.upgs.ids.length; x++) if (MASS_DILATION.break.upgs.ids[x].unl?MASS_DILATION.break.upgs.ids[x].unl():true) MASS_DILATION.break.upgs.buy(x)
        if (player.bh.unl && !player.qu.en.hr[0]) player.bh.mass = player.bh.mass.add(tmp.bh.mass_gain.mul(du_gs))
        if (player.atom.unl) {
            player.atom.atomic = player.atom.atomic.add(tmp.atom.atomicGain.mul(du_gs))
            for (let x = 0; x < 3; x++) player.atom.powers[x] = player.atom.powers[x].add(tmp.atom.particles[x].powerGain.mul(du_gs))
        }
        if (hasTree("qol1")) for (let x = 1; x <= (player.dark.unl?118:117); x++) if (x<=tmp.elements.upg_length) ELEMENTS.buyUpg(x)
        player.md.mass = player.md.mass.add(tmp.md.mass_gain.mul(du_gs))
        if (hasTree("qol3")) player.md.particles = player.md.particles.add(player.md.active ? tmp.md.rp_gain.mul(du_gs) : tmp.md.passive_rp_gain.mul(du_gs))
        if (hasTree("qol4")) STARS.generators.unl(true)
        if (hasTree("qol7")) {
            for (let x = 0; x < BOSONS.upgs.ids.length; x++) {
                let id = BOSONS.upgs.ids[x]
                for (let y = 0; y < BOSONS.upgs[id].length; y++) BOSONS.upgs.buy(id,y)
            }
        }

        for (let i = 0; i < GAL_PRESTIGE.res_length; i++) player.gp_resources[i] = player.gp_resources[i].add(tmp.gp.res_gain[i].mul(dt))

        RADIATION.autoBuyBoosts()
        calcStars(du_gs)
        calcSupernova(dt)
        calcQuantum(dt)
        calcDark(inf_gs)
        calcInf(dt)

        BUILDINGS.tick()

        if (tmp.SN_passive) player.supernova.times = player.supernova.times.add(tmp.supernova.passive.mul(dt))
        else if (hasTree("qu_qol4")) player.supernova.times = player.supernova.times.max(tmp.supernova.bulk)

        if (hasTree("qol6")) CHALS.exit(true)

        if (true) {
            if (hasTree("qu_qol3")) for (let x = 1; x <= 4; x++) player.chal.comps[x] = player.chal.comps[x].max(tmp.chal.bulk[x].min(tmp.chal.max[x]))
            if (hasTree("qu_qol5")) for (let x = 5; x <= 8; x++) player.chal.comps[x] = player.chal.comps[x].max(tmp.chal.bulk[x].min(tmp.chal.max[x]))
            if (hasElement(122)) for (let x = 9; x <= 11; x++) player.chal.comps[x] = player.chal.comps[x].max(tmp.chal.bulk[x].min(tmp.chal.max[x]))
            if (hasElement(131)) player.chal.comps[12] = player.chal.comps[12].max(tmp.chal.bulk[12].min(tmp.chal.max[12]))
            if (hasInfUpgrade(12)) for (let x = 13; x <= 15; x++) player.chal.comps[x] = player.chal.comps[x].max(tmp.chal.bulk[x].min(tmp.chal.max[x]))
        }
    }

    tmp.pass = Math.max(0,tmp.pass-1)

    player.time += dt

    tmp.tree_time = (tmp.tree_time+dt) % 3

    if (player.chal.comps[10].gte(1) && !player.supernova.fermions.unl) {
        player.supernova.fermions.unl = true
        createPopup(POPUP_GROUPS.fermions.html,'fermions')
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
            hex: E(0),
            beyond: E(0),
        },
        auto_ranks: {
            rank: false,
            tier: false,
        },
        auto_pres: [],
        prestiges: [],
        auto_asc: [],
        ascensions: new Array(ASCENSIONS.names.length).fill(E(0)),
        gal_prestige: E(0),
        gp_resources: new Array(GAL_PRESTIGE.res_length).fill(E(0)),
        auto_mainUpg: {},
        mainUpg: {},
        ranks_reward: 0,
        pres_reward: 0,
        asc_reward: 0,
        scaling_ch: 0,
        build: {},
        rp: {
            points: E(0),
            unl: false,
        },
        bh: {
            unl: false,
            dm: E(0),
            mass: E(0),
            unstable: E(0),
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
            quarks: E(0),
            particles: [E(0), E(0), E(0)],
            powers: [E(0), E(0), E(0)],
            ratio: 0,
            dRatio: [1,1,1],
            elements: [],
            muonic_el: [],
            elemTier: [1,1],
            elemLayer: 0,
        },
        md: {
            active: false,
            particles: E(0),
            mass: E(0),
            upgs: [],

            break: {
                active: false,
                energy: E(0),
                mass: E(0),
                upgs: [],
            },
        },
        stars: {
            unls: 0,
            points: E(0),
            generators: [E(0),E(0),E(0),E(0),E(0),E(0)],
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
                tiers: [[E(0),E(0),E(0),E(0),E(0),E(0),E(0)],[E(0),E(0),E(0),E(0),E(0),E(0),E(0)]],
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
        accelerator: E(0),
        options: {
            font: 'Verdana',
            notation: 'sc',
            tree_animation: 0,
            massDis: 0,
            res_hide: {},

            nav_hide: [],
        },
        confirms: {},
        offline: {
            active: true,
            current: Date.now(),
            time: 0,
        },
        quotes: [],
        time: 0,
    }

    for (let x in BUILDINGS_DATA) s.build[x] = {
        amt: E(0),
        auto: false,
    }

    for (let x = 0; x < PRES_LEN; x++) s.prestiges.push(E(0))
    for (let x = 1; x <= UPGS.main.cols; x++) {
        s.auto_mainUpg[UPGS.main.ids[x]] = false
        s.mainUpg[UPGS.main.ids[x]] = []
    }
    for (let x = 1; x <= CHALS.cols; x++) s.chal.comps[x] = E(0)
    for (let x = 0; x < CONFIRMS.length; x++) s.confirms[CONFIRMS[x]] = true
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) s.md.upgs[x] = E(0)
    for (let x = 0; x < MASS_DILATION.break.upgs.ids.length; x++) s.md.break.upgs[x] = E(0)
    for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) s.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = E(0)
    for (let x = 0; x < 7; x++) {
        s.supernova.radiation.ds.push(E(0))
        s.supernova.radiation.bs.push(E(0),E(0))
    }
    s.qu = getQUSave()
    s.dark = getDarkSave()
    s.inf = getInfSave()
    return s
}

function wipe(reload=false) {
    if (reload) {
        wipe()
        save()
        location.reload()
    }
    else player = getPlayerData()
}

function loadPlayer(load) {
    const DATA = getPlayerData()
    player = deepNaN(load, DATA)
    player = deepUndefinedAndDecimal(player, DATA)
    convertStringToDecimal()
    player.qu.qc.presets = player.qu.qc.presets.slice(0,5)
    player.reset_msg = ""
    player.main_upg_msg = [0,0]
    player.chal.choosed = 0
    if (player.dark.c16.first && player.dark.c16.totalS.eq(0) && player.dark.c16.shard.gt(0)) player.dark.c16.totalS = player.dark.c16.shard
    for (i = 0; i < 2; i++) for (let x = 0; x < FERMIONS.types[i].length; x++) {
        let f = FERMIONS.types[i][x]
        player.supernova.fermions.tiers[i][x] = player.supernova.fermions.tiers[i][x].min(typeof f.maxTier == "function" ? f.maxTier() : f.maxTier||1/0)
    }
    if (typeof player.atom.elemTier == "number") player.atom.elemTier = [player.atom.elemTier,1]
    if (player.inf.pre_theorem.length == 0) generatePreTheorems()

    let tt = {}

    for (let i = 0; i < player.inf.core.length; i++) {
        if (!player.inf.core[i]) continue

        let t = player.inf.core[i].type
        if (!tt[t]) tt[t] = 1
        else tt[t]++

        if (tt[t]>1) {
            for (let j = 0; j < MAX_INV_LENGTH; j++) if (!player.inf.inv[j]) {
                player.inf.inv[j] = player.inf.core[i]
                player.inf.core[i] = undefined
                break
            }

            tt[t]--
        }
    }

    checkBuildings()
}

function clonePlayer(obj,data) {
    let unique = {}

    for (let k in obj) {
        if (data[k] == null || data[k] == undefined) continue
        unique[k] = Object.getPrototypeOf(data[k]).constructor.name == "Decimal"
        ? E(obj[k])
        : typeof obj[k] == 'object'
        ? clonePlayer(obj[k],data[k])
        : obj[k]
    }

    return unique
}

function deepNaN(obj, data) {
    for (let k in obj) {
        if (typeof obj[k] == 'string') {
            if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) obj[k] = data[k]
        } else {
            if (typeof obj[k] != 'object' && isNaN(obj[k])) obj[k] = data[k]
            if (typeof obj[k] == 'object' && data[k] && obj[k] != null) obj[k] = deepNaN(obj[k], data[k])
        }
    }
    return obj
}

function deepUndefinedAndDecimal(obj, data) {
    if (obj == null) return data
    for (let k in data) {
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
    for (let x = 1; x <= CHALS.cols; x++) player.chal.comps[x] = E(player.chal.comps[x])
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = E(player.md.upgs[x]||0)
    for (let x = 0; x < MASS_DILATION.break.upgs.ids.length; x++) player.md.break.upgs[x] = E(player.md.break.upgs[x]||0)
    for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) player.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = E(player.supernova.b_upgs[BOSONS.upgs.ids[x]][y]||0)

    for (let x in player.inf.core) {
        let c = player.inf.core[x]
        if (c) {
            c.level = E(c.level)
            c.power = E(c.power)
        }
    }
    for (let x in player.inf.inv) {
        let c = player.inf.inv[x]
        if (c) {
            c.level = E(c.level)
            c.power = E(c.power)
        }
    }
    for (let x = 0; x < 4; x++) {
        let t = player.inf.pre_theorem[x]
        if (t) t.power_m = E(t.power_m)
    }
}

function cannotSave() { return tmp.supernova.reached && player.supernova.times.lt(1) && !quUnl() || tmp.inf_reached && !hasInfUpgrade(16) }

function save(){
    let str = btoa(JSON.stringify(player))
    if (cannotSave() || findNaN(str, true)) return
    if (localStorage.getItem("testSave") == '') wipe()
    localStorage.setItem("testSave",str)
    tmp.prevSave = localStorage.getItem("testSave")
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
    let str = btoa(JSON.stringify(player))
    if (findNaN(str, true)) {
        addNotify("Error Exporting, because it got NaNed")
        return
    }
    save();
    let file = new Blob([str], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "Incremental Mass Rewritten Save - "+new Date().toGMTString()+".txt"
    a.click()
}

function export_copy() {
    let str = btoa(JSON.stringify(player))
    if (findNaN(str, true)) {
        addNotify("Error Exporting, because it got NaNed")
        return
    }

    let copyText = document.getElementById('copy')
    copyText.value = str
    copyText.style.visibility = "visible"
    copyText.select();
    document.execCommand("copy");
    copyText.style.visibility = "hidden"
    addNotify("Copied to Clipboard")
}

function importy() {
    createPrompt("Paste in your save WARNING: WILL OVERWRITE YOUR CURRENT SAVE",'import',loadgame=>{
        let st = ""
        if (loadgame.length <= 100) st = convertStringIntoAGY(loadgame)
        if (ssf[2](loadgame)) return
        if (st == 'OJY$VFe*b') {
            addNotify('monke<br><img style="width: 100%; height: 100%" src="https://i.kym-cdn.com/photos/images/original/001/132/314/cbc.jpg">')
            return
        }
        else if (st == 'p4H)pb{v2y5?g!') {
            addNotify('2+2=5<br><img src="https://cdn2.penguin.com.au/authors/400/106175au.jpg">')
            return
        }
        else if (st == 'L5{W*oI.NhA-lE)C1#e') {
            addNotify('<img src="https://steamuserimages-a.akamaihd.net/ugc/83721257582613769/22687C6536A50ADB3489A721A264E0EF506A89B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false">',6)
            return
        }
        else if (st == 'a+F4gro<?/Sd') {
            addNotify('YOU ARE CURSED FOREVER!!!')
            player.options.font = 'Wingding'
            return
        }
        if (loadgame != null) {
            let keep = player
            try {
                setTimeout(()=>{
                    if (findNaN(loadgame, true)) {
                        addNotify("Error Importing, because it got NaNed")
                        return
                    }
                    load(loadgame)
                    save()
                    resetTemp()
                    loadGame(false)
                    location.reload()
                }, 200)
            } catch (error) {
                addNotify("Error Importing")
                player = keep
            }
        }
    })
}

function loadGame(start=true, gotNaN=false) {
    if (!gotNaN) tmp.prevSave = localStorage.getItem("testSave")
    wipe()
    load(tmp.prevSave)
    
    if (start) {
        setupHTML()
        setupTooltips()
        updateQCModPresets()

        setInterval(save,60000)
        for (let x = 0; x < 5; x++) updateTemp()

        updateHTML()

        let t = (Date.now() - player.offline.current)/1000
        if (player.offline.active && t > 60) simulateTime(t)

        updateTooltipResHTML(true)
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
        document.getElementById('auto_qu_input').value = player.qu.auto.input
        document.getElementById('auto_qu_input').addEventListener('input', e=>{
            player.qu.auto.input = e.target.value
        })
        document.onmousemove = e => {
            tmp.cx = e.clientX
            tmp.cy = e.clientY
        }
        document.addEventListener('keydown', e => {keyEvent(e)})
        updateTheoremInv()
        updateTheoremCore()
        updateNavigation()
        updateMuonSymbol(true)
        setInterval(loop, 1000/FPS)
        setInterval(updateStarsScreenHTML, 1000/FPS)
        treeCanvas()
        setInterval(drawTreeHTML, 10)
        setInterval(checkNaN,1000)
        setInterval(updateOneSec,1000)

        setTimeout(()=>{
            tmp.start = true
        },2000)

        if (tmp.april) createConfirm("Do you want to disable softcap everywhere?",'april',()=>{
            createPopup(`You trolled! I can't disable softcap! April Fools! <br><br> <img src="https://media.tenor.com/GryShD35-psAAAAM/troll-face-creepy-smile.gif">`,'troll','Dammit!')
            document.body.style.background = `url(https://usagif.com/wp-content/uploads/2021/4fh5wi/troll-face-26.gif)`
            tmp.aprilEnabled = true
        },()=>{
            createPopup(`<img style="width: 200px; height: 200px" src="https://media.tenor.com/U1dgzSAQk8wAAAAd/kys.gif">`,'kys','die')
        })
    }
}

function checkNaN() {
    let naned = findNaN(player)

    if (naned) {
        console.log(naned)

        addNotify("Game Data got NaNed because of "+naned.bold())

        resetTemp()
        tmp.start = true
        loadGame(false, true)
        for (let x = 0; x < 5; x++) updateTemp()
    }
}

function isNaNed(val) {
    return typeof val == "number" ? isNaN(val) : Object.getPrototypeOf(val).constructor.name == "Decimal" ? isNaN(val.mag) : false
}

function findNaN(obj, str=false, data=getPlayerData(), node='player') {
    if (str ? typeof obj == "string" : false) obj = JSON.parse(atob(obj))
    for (let k in obj) {
        if (typeof obj[k] == "number") if (isNaNed(obj[k])) return node+'.'+k
        if (str) {
            if (typeof obj[k] == "string") if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return node+'.'+k
        } else {
            if (obj[k] == null || obj[k] == undefined ? false : Object.getPrototypeOf(obj[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return node+'.'+k
        }
        if (typeof obj[k] == "object") {
            let node2 = findNaN(obj[k], str, data[k], (node?node+'.':'')+k)
            if (node2) return node2
        }
    }
    return false
}

function overflow(number, start, power, meta=1){
	if(isNaN(number.mag))return new Decimal(0);
	start=Decimal.iteratedexp(10,meta-1,1.0001).max(start);
	if(number.gte(start)){
        let s = start.iteratedlog(10,meta)
		number=Decimal.iteratedexp(10,meta,number.iteratedlog(10,meta).div(s).pow(power).mul(s));
	}
	return number;
}

Decimal.prototype.overflow = function (start, power, meta) { return overflow(this.clone(), start, power, meta) }

function tetraflow(number,start,power) { // EXPERIMENTAL FUNCTION - x => 10^^((slog10(x)-slog10(s))*p+slog10(s))
    if(isNaN(number.mag))return new Decimal(0);
	start=E(start);
	if(number.gte(start)){
        let s = start.slog(10)
        // Fun Fact: if 0 < number.slog(10) - start.slog(10) < 1, such like overflow(number,start,power,start.slog(10).sub(1).floor())
		number=Decimal.tetrate(10,number.slog(10).sub(s).mul(power).add(s))
	}
	return number;
}

Decimal.prototype.addTP = function (val) {
    var e = this.clone()
    return Decimal.tetrate(10, e.slog(10).add(val))
}

function simulateTime(sec) {
    let ticks = sec * FPS
    let bonusDiff = 0
    let player_before = clonePlayer(player,getPlayerData());
    if (ticks > 1000) {
        bonusDiff = (ticks - 1000) / FPS / 1000
        ticks = 1000
    }
    for (let i=0; i<ticks; i++) {
        updateTemp()
        calc(1/FPS+bonusDiff)
        // console.log(player.bh.mass.div(player_before.bh.mass).log10().format())
    }

    let h = `You were gone offline for <b>${formatTime(sec)}</b>.<br>`

    let s = {
        mass: player.mass.max(1).div(player_before.mass.max(1)).log10(),
        bh_mass: player.bh.mass.max(1).div(player_before.bh.mass.max(1)).log10(),
        quarks: player.atom.quarks.max(1).div(player_before.atom.quarks.max(1)).log10(),
        sn: player.supernova.times.sub(player_before.supernova.times),
    }

    let s2 = {
        mass: player.mass.max(1).log10().max(1).div(player_before.mass.max(1).log10().max(1)).log10(),
        bh_mass: player.bh.mass.max(1).log10().max(1).div(player_before.bh.mass.max(1).log10().max(1)).log10(),
        quarks: player.atom.quarks.max(1).log10().max(1).div(player_before.atom.quarks.max(1).log10().max(1)).log10(),
    }

    // console.log(s2)

    if (s2.mass.gte(10)) h += `<br>Your mass's exponent<sup>2</sup> is increased by <b>${s2.mass.format(2)}</b>.`
    else if (s.mass.gte(10)) h += `<br>Your mass's exponent is increased by <b>${s.mass.format(2)}</b>.`

    if (s2.bh_mass.gte(10)) h += `<br>Your exponent<sup>2</sup> of mass of black hole is increased by <b>${s2.bh_mass.format(2)}</b>.`
    else if (s.bh_mass.gte(10)) h += `<br>Your exponent of mass of black hole is increased by <b>${s.bh_mass.format(2)}</b>.`

    if (s2.quarks.gte(10)) h += `<br>Your quark's exponent<sup>2</sup> is increased by <b>${s2.quarks.format(2)}</b>.`
    else if (s.quarks.gte(10)) h += `<br>Your quark's exponent is increased by <b>${s.quarks.format(2)}</b>.`

    if (s.sn.gte(1e3)) h += `<br>You were becomed <b>${s.sn.format(0)}</b> more supernovas.`

    createPopup(h,'offline')
}