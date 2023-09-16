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
        if ([3, "log"].includes(mode)) x = x.div(start).log(power).add(1).mul(start)
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
    player.time += dt
    tmp.tree_time = (tmp.tree_time+dt) % 3
    if (player.chal.comps[10].gte(1) && !player.supernova.fermions.unl) {
        player.supernova.fermions.unl = true
        createPopup(POPUP_GROUPS.fermions.html,'fermions')
    }

    if (tmp.inf_time != 0) return
	let evo = OURO.evo
	onPass()
	OURO.calc(dt)

	let du_gs = tmp.preQUGlobalSpeed.mul(dt)
	let inf_gs = tmp.preInfGlobalSpeed.mul(dt)
	player.mass = player.mass.add(tmp.massGain.mul(du_gs))
	if (!tmp.brokenInf) player.mass = player.mass.min(tmp.inf_limit)
	
	if (tmp.chal.unl) player.chal.unl = true
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		if (tmp.brUnl && x < 4 || RANKS.autoUnl[rn]() && player.auto_ranks[rn]) RANKS.reset(rn, true)
	}
	if (player.auto_ranks.beyond && (hasBeyondRank(2,1)||hasInfUpgrade(10)||OURO.evo>=1)) BEYOND_RANKS.reset(true)
	for (let x = 0; x < PRES_LEN; x++) if (PRESTIGES.autoUnl[x]() && player.auto_pres[x]) PRESTIGES.reset(x,true)
	for (let x = 1; x <= UPGS.main.cols; x++) {
		let id = UPGS.main.ids[x]
		let upg = UPGS.main[x]
		if (upg.unl()) if (upg.auto_unl ? upg.auto_unl() : false) if (player.auto_mainUpg[id]) for (let y = 1; y <= upg.lens; y++) buyUpgrade(id, y)
	}
	if (evo < 1) if (tmp.passive >= 1) player.rp.points = player.rp.points.add(tmp.rp.gain.mul(du_gs))
	if (evo < 2) {
		if (tmp.passive >= 2) player.bh.dm = player.bh.dm.add(tmp.bh.dm_gain.mul(du_gs))
		if (tmp.bh.unl && !player.qu.en.hr[0]) player.bh.mass = player.bh.mass.add(tmp.bh.mass_gain.mul(du_gs))
	}
	if (player.atom.unl) {
		if (hasElement(14)) player.atom.quarks = player.atom.quarks.add(tmp.atom.quarkGain.mul(du_gs.mul(tmp.atom.quarkGainSec)))
		if (hasTree("qol1")) for (let x = 1; x <= Math.min(player.dark.unl?118:117, tmp.elements.unl_length[0]); x++) ELEMENTS.buyUpg(x)
		if (hasTree("qol4")) STARS.generators.unl(true)
	}
	if (tmp.atom.unl) {
		player.atom.atomic = player.atom.atomic.add(tmp.atom.atomicGain.mul(du_gs))
		for (let x = 0; x < 3; x++) player.atom.powers[x] = player.atom.powers[x].add(tmp.atom.particles[x].powerGain.mul(du_gs))

		if (hasTree("qol3")) player.md.particles = player.md.particles.add(inMD() ? tmp.md.rp_gain.mul(du_gs) : tmp.md.passive_rp_gain.mul(du_gs))
		player.md.mass = player.md.mass.add(tmp.md.mass_gain.mul(du_gs))

		if (hasElement(24)) player.atom.points = player.atom.points.add(tmp.atom.gain.mul(du_gs))
		if (hasElement(30) && !(CHALS.inChal(9) || FERMIONS.onActive("12"))) for (let x = 0; x < 3; x++) player.atom.particles[x] = player.atom.particles[x].add(player.atom.quarks.mul(du_gs).div(10))
		if (hasElement(43)) for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) if ((hasTree("qol3") || player.md.upgs[x].gt(0)) && (MASS_DILATION.upgs.ids[x].unl?MASS_DILATION.upgs.ids[x].unl():true)) MASS_DILATION.upgs.buy(x)
		if (hasElement(123)) for (let x = 0; x < MASS_DILATION.break.upgs.ids.length; x++) if (MASS_DILATION.break.upgs.ids[x].unl?MASS_DILATION.break.upgs.ids[x].unl():true) MASS_DILATION.break.upgs.buy(x)
	}

	RADIATION.autoBuyBoosts()
	calcStars(du_gs)
	calcSupernova(dt)
	calcQuantum(dt)
	calcDark(inf_gs)
	calcInf(dt)

	BUILDINGS.tick()

	if (hasTree("qol6")) CHALS.exit(true)
	if (hasTree("qu_qol3") && OURO.evo < 2) for (let x = 1; x <= 4; x++) player.chal.comps[x] = player.chal.comps[x].max(tmp.chal.bulk[x].min(tmp.chal.max[x]))
	if (hasTree("qu_qol5") && OURO.evo < 3) for (let x = 5; x <= 8; x++) player.chal.comps[x] = player.chal.comps[x].max(tmp.chal.bulk[x].min(tmp.chal.max[x]))
    if (OURO.evo < 4) {
        if (hasElement(122)) for (let x = 9; x <= 11; x++) player.chal.comps[x] = player.chal.comps[x].max(tmp.chal.bulk[x].min(tmp.chal.max[x]))
	    if (hasElement(131)) player.chal.comps[12] = player.chal.comps[12].max(tmp.chal.bulk[12].min(tmp.chal.max[12]))
    }
	if (hasInfUpgrade(12)) for (let x = 13; x <= 15; x++) player.chal.comps[x] = player.chal.comps[x].max(tmp.chal.bulk[x].min(tmp.chal.max[x]))
}

function onPass(offline) {
	if (!tmp.pass) return
	tmp.pass = 0

	updateTemp()
	player.atom.elements = chunkify(player.atom.elements)
	player.atom.muonic_el = chunkify(player.atom.muonic_el)
	calcNextElements()
	updateUpgNotify()
	EVO.update_fed()
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
        auto_mainUpg: {},
        mainUpg: {},
        ranks_reward: 0,
        pres_reward: 0,
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
            generators: [E(0),E(0),E(0),E(0),E(0),E(0),E(0),E(0)],
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
        options: {
            font: 'Verdana',
            notation: 'sc',
            tree_animation: 0,
            massDis: 0,
            massType: 0,
            snake_speed: 0,

            nav_hide: [],
            res_hide: {},
            pins: [],
            prefer: {},
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
    return s
}

function wipe(reload=false) {
	player = getPlayerData()
	onLoad()
	if (reload) {
        save()
        location.reload()
    }
}

function loadPlayer(load) {
    const DATA = getPlayerData()
    player = deepNaN(load, DATA)
    player = deepUndefinedAndDecimal(player, DATA)

    player.qu.qc.presets = player.qu.qc.presets.slice(0,5)
    player.reset_msg = ""
    player.chal.choosed = 0
    if (player.dark.run.gmode == 2) player.dark.run.gmode = 0
    if (player.dark.c16.first && player.dark.c16.totalS.eq(0) && player.dark.c16.shard.gt(0)) player.dark.c16.totalS = player.dark.c16.shard
    for (i = 0; i < 2; i++) for (let x = 0; x < FERMIONS.types[i].length; x++) {
        let f = FERMIONS.types[i][x]
        player.supernova.fermions.tiers[i][x] = player.supernova.fermions.tiers[i][x].min(typeof f.maxTier == "function" ? f.maxTier() : f.maxTier||1/0)
    }
    if (typeof player.atom.elemTier == "number") player.atom.elemTier = [player.atom.elemTier,1]
	if (player.options.nav_hide[2]) goToTab(player.options.pins[0])

    checkBuildings()
	onLoad()
	destroyOldData()
}

function onLoad() {
	INF.load()
	OURO.load()
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

function destroyOldData() {
	delete player.massUpg
	delete player.main_upg_msg
	delete player.tickspeed
	delete player.accelerator
	delete player.autoMassUpg
	delete player.autoTickspeed
	delete player.autoAccel
	delete player.atom.auto_gr
	delete player.qu.auto_cr

	let evo = OURO.evo
	if (evo >= 1) {
		if (player.rp.unl) player.evo.cp.unl = player.rp.unl
		delete player.rp
	}
	if (evo >= 2) {
		if (player.bh.unl) player.evo.wh.unl = player.bh.unl
		delete player.bh
	} else {
		delete player.bh.autoCondenser
		delete player.bh.autoFVM
	}
	if (evo >= 3) {
		delete player.atom.points
		delete player.atom.atomic
		delete player.atom.particles
		delete player.atom.powers
		delete player.atom.ratio
		delete player.atom.dRatio
		delete player.md
	}
	if (evo >= 4) {
		delete player.stars
		delete player.supernova
	}

	//Ouroboric
	delete player.evo?.constellation
}

function cannotSave() { return tmp.sn.reached && player.supernova.times.lt(1) && !quUnl() || tmp.inf_reached && !hasInfUpgrade(16) || onImport }

function save() {
    let str = btoa(JSON.stringify(player))
    if (cannotSave() || findNaN(str, true)) return
    if (localStorage.getItem("betaSave2") == '') wipe()
    localStorage.setItem("betaSave2",str)
    tmp.prevSave = localStorage.getItem("betaSave2")
    if (tmp.saving < 1) tmp.saving++
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

let onImport = 0
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
        else if (st == 'Q3OvX1Zt5:id') {
            addNotify('Please lift mass, please!!!<br><img style="width: 100%; height: 100%" src="https://www.davelabowitz.com/wp-content/uploads/Sisyphus-e1557869810488.jpg">')
            var s = document.getElementById('sisyphus'), f = () => {
                s.style.display='block'
                s.style.animation='sisyphus 2s linear'
                setTimeout(()=>{
                    s.style.display='none'
                },2e3)
                setTimeout(f,(Math.random()*4+4)*1e3)
            }
            setTimeout(f,1e3)
            return
        }
        if (loadgame != null) {
            let keep = player
            try {
				if (findNaN(loadgame, true)) {
					addNotify("Error Importing, because it got NaNed")
					return
				}
				onImport = true
				localStorage.setItem("betaSave2", loadgame)
				location.reload()
            } catch (error) {
                addNotify("Error Importing")
                player = keep
            }
        }
    })
}

function checkNaN() {
    let naned = findNaN(player)
    if (naned) {
        addNotify("Game Data got NaNed because of "+naned.bold())
        resetTemp()
        loadGame(false, true)
        tmp.start = 1
        tmp.pass = 1
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
    if (ticks > 500) {
        bonusDiff = (ticks - 500) / FPS / 500
        ticks = 500
    }
    for (let i=0; i<ticks; i++) {
        updateTemp()
        calc(1/FPS+bonusDiff)
    }

    let h = `You were gone offline for <b>${formatTime(sec)}</b>.<br>`

    let s = {
        mass: player.mass.max(1).div(player_before.mass.max(1)).log10(),
        bh_mass: tmp.bh.unl ? player.bh.mass.max(1).div(player_before.bh.mass.max(1)).log10() : E(1),
        quarks: player.atom.quarks.max(1).div(player_before.atom.quarks.max(1)).log10(),
        sn: tmp.sn.unl ? player.supernova.times.sub(player_before.supernova.times) : E(1),
    }

    let s2 = {
        mass: player.mass.max(1).log10().max(1).div(player_before.mass.max(1).log10().max(1)).log10(),
        bh_mass: tmp.bh.unl ? player.bh.mass.max(1).log10().max(1).div(player_before.bh.mass.max(1).log10().max(1)).log10() : E(1),
        quarks: player.atom.quarks.max(1).log10().max(1).div(player_before.atom.quarks.max(1).log10().max(1)).log10(),
    }

    if (s2.mass.gte(10)) h += `<br>Your mass's exponent<sup>2</sup> is increased by <b>${s2.mass.format(2)}</b>.`
    else if (s.mass.gte(10)) h += `<br>Your mass's exponent is increased by <b>${s.mass.format(2)}</b>.`

    if (s2.bh_mass.gte(10)) h += `<br>Your exponent<sup>2</sup> of mass of black hole is increased by <b>${s2.bh_mass.format(2)}</b>.`
    else if (s.bh_mass.gte(10)) h += `<br>Your exponent of mass of black hole is increased by <b>${s.bh_mass.format(2)}</b>.`

    if (s2.quarks.gte(10)) h += `<br>Your quark's exponent<sup>2</sup> is increased by <b>${s2.quarks.format(2)}</b>.`
    else if (s.quarks.gte(10)) h += `<br>Your quark's exponent is increased by <b>${s.quarks.format(2)}</b>.`

    if (s.sn.gte(1e3)) h += `<br>You were becomed <b>${s.sn.format(0)}</b> more supernovas.`

    createPopup(h,'offline')
}