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
    if (player.mainUpg.rp.includes(3)) for (let x = 1; x <= UPGS.mass.cols; x++) if (player.autoMassUpg[x]) UPGS.mass.buyMax(x)
    for (let x = 0; x < RANKS.names.length; x++) {
        let rn = RANKS.names[x]
        if (RANKS.autoUnl[rn]() && player.auto_ranks[rn]) RANKS.bulk(rn)
    }
}

function getPlayerData() {
    return {
        mass: E(0),
        ranks: {
            rank: E(0),
            tier: E(0),
        },
        auto_ranks: {
            rank: false,
            tier: false,
        },
        massUpg: {},
        autoMassUpg: [null,false,false,false],
        mainUpg: {
            rp: [],
        },
        tab: [0,0],
        ranks_reward: 0,
        scaling_ch: 0,
        rp: {
            points: E(0),
            unl: false,
        },
        reset_msg: "",
        main_upg_msg: [0,0],
        tickspeed: E(0),
    }
}

function wipe() {
    player = getPlayerData()
}

function loadPlayer(load) {
    player = Object.assign(getPlayerData(), load)
    convertStringToDecimal()
    player.tab = [0,0]
    player.ranks_reward = 0
    player.scaling_ch = 0
    player.reset_msg = ""
    player.main_upg_msg = [0,0]
}

function convertStringToDecimal() {
    player.mass = E(player.mass)
    player.tickspeed = E(player.tickspeed)
    player.rp.points = E(player.rp.points)
    for (let x = 0; x < RANKS.names.length; x++) player.ranks[RANKS.names[x]] = E(player.ranks[RANKS.names[x]])
    for (let x = 1; x <= UPGS.mass.cols; x++) if (player.massUpg[x] !== undefined) player.massUpg[x] = E(player.massUpg[x])
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
    a.download = "Incremental Mass Rewritten Save.txt"
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
    tmp.el.loading.setDisplay(false)
    tmp.el.app.setDisplay(true)
}