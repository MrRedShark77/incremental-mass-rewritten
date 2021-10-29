const TREE_IDS = [
    ["","","","","qol1","","","s2","s1","c","sn1","sn2","","","chal1","","","",""],
    ["","","","qol2","","","","","m1","rp1","bh1","","","","","","","",""],
    ["","","","","","","","m2","t1","","bh2","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
    ["","","","","","","","","","","","","","","","","","",""],
]

var tree_canvas,tree_ctx,tree_update=true

const TREE_UPGS = {
    buy(x) {
        if (tmp.supernova.tree_choosed == x && tmp.supernova.tree_afford[x]) {
            player.supernova.stars = player.supernova.stars.sub(this.ids[x].cost).max(0)
            player.supernova.tree.push(x)
        }
    },
    ids: {
        c: {
            desc: `Start generating 0.1 neutron star (not affected by offline production).`,
            cost: E(0),
        },
        sn1: {
            branch: ["c"],
            desc: `Tickspeed affect Neutron stars gain at a reduced rate.`,
            cost: E(10),
            effect() {
                let x = player.tickspeed.add(1).pow(0.25)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        sn2: {
            branch: ["sn1"],
            desc: `Supernova boost Neutron stars gain.`,
            cost: E(400),
            effect() {
                let x = E(2).pow(player.supernova.times)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        m1: {
            branch: ["c"],
            desc: `Neutron star multiple mass gains.`,
            cost: E(100),
            effect() {
                let x = E(1e100).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return format(x)+"x"+(x.max(1).log(1e100).gte(1e3)?" <span class='soft'>(softcapped)</span>":"") },
        },
        m2: {
            branch: ["m1"],
            desc: `Raise mass gain softcap^2 to 1.5th power.`,
            cost: E(1000),
        },
        t1: {
            branch: ["m1", 'rp1'],
            req() { return player.supernova.chal.noTick && player.mass.gte(E("1.5e1.650056e6").pow(player.supernova.tree.includes('bh2')?1.46:1)) },
            reqDesc() {return `Reach ${formatMass(E("1.5e1.650056e6").pow(player.supernova.tree.includes('bh2')?1.46:1))} without buying Tickspeed in Supernova run.`},
            desc: `Tickspeed power is now ^1.15 stronger.`,
            cost: E(1500),
        },
        rp1: {
            branch: ["c"],
            desc: `Neutron star multiple rage powers gain.`,
            cost: E(200),
            effect() {
                let x = E(1e50).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return format(x)+"x"+(x.max(1).log(1e50).gte(1e3)?" <span class='soft'>(softcapped)</span>":"") },
        },
        bh1: {
            branch: ["c"],
            desc: `Neutron star multiple dark matters gain.`,
            cost: E(400),
            effect() {
                let x = E(1e35).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return format(x)+"x"+(x.max(1).log(1e35).gte(1e3)?" <span class='soft'>(softcapped)</span>":"") },
        },
        bh2: {
            branch: ['bh1'],
            req() { return player.supernova.chal.noBHC && player.bh.mass.gte("1.5e1.7556e4") },
            reqDesc() {return `Reach ${format("e1.75e4")} uni of balck hole without buying BH Condenser in Supernova run.`},
            desc: `BH Condenser power is now ^1.15 stronger.`,
            cost: E(1500),
        },
        s1: {
            branch: ["c"],
            desc: `Neutron star boost last stars gain.`,
            cost: E(400),
            effect() {
                let x = player.supernova.stars.add(1).pow(1.25)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        s2: {
            branch: ["s1"],
            req() { return player.supernova.times.gte(3) },
            reqDesc: `3 Supernovas.`,
            desc: `Tetr which boosts star effect, softcap is 50% weaker.`,
            cost: E(2500),
        },
        qol1: {
            req() { return player.supernova.times.gte(2) },
            reqDesc: `2 Supernovas.`,
            desc: `Start with Silicon-14 unlocked. You can now automatically buy Elements & Atom upgrades.`,
            cost: E(1000),
        },
        qol2: {
            branch: ["qol1"],
            req() { return player.supernova.times.gte(3) },
            reqDesc: `3 Supernovas.`,
            desc: `Start with Chromium-24 & Atom upgrade 6 unlocked.`,
            cost: E(2000),
        },
        chal1: {
            req() { return player.supernova.times.gte(4) },
            reqDesc: `4 Supernovas.`,
            desc: `Add 100 more C7-8 maximum completions.`,
            cost: E(5000),
        },
        /*
        x: {
            unl() { return true },
            req() { return true },
            reqDesc: ``,
            desc: `Placeholder.`,
            cost: E(1/0),
            effect() {
                let x = E(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        */
    },
}

function setupTreeHTML() {
    let tree_table = new Element("tree_table")
	let table = ``
	for (let i = 0; i < 19; i++) {
        table += `<div class="table_center"><div class="table_center" style="min-width: 1406px">`
        for (let j = 0; j < 19; j++) {
            let id = TREE_IDS[i][j]
            let option = id == "" ? `style="visibility: hidden"` : ``
            let img = TREE_UPGS.ids[id]?`<img src="images/tree/${id}.png">`:""
            table += `<button id="treeUpg_${id}" class="btn_tree" onclick="TREE_UPGS.buy('${id}'); tmp.supernova.tree_choosed = '${id}'" ${option}>${img}</button>`
        }
        table += `</div></div>`
	}
	tree_table.setHTML(table)
}

function retrieveCanvasData() {
	let treeCanv = document.getElementById("tree_canvas")
	if (treeCanv===undefined||treeCanv===null) return false;
    tree_canvas = treeCanv
	tree_ctx = tree_canvas.getContext("2d");
	return true;
}

function resizeCanvas() {
    if (!retrieveCanvasData()) return
	tree_canvas.width = 0;
	tree_canvas.height = 0;
	tree_canvas.width = tree_canvas.clientWidth
	tree_canvas.height = tree_canvas.clientHeight
}

function drawTreeHTML() {
    if (tmp.tab == 5) {
        if (tree_canvas.width == 0 || tree_canvas.height == 0) resizeCanvas()
        drawTree()
    }
}

function drawTree() {
	if (!retrieveCanvasData()) return;
	tree_ctx.clearRect(0, 0, tree_canvas.width, tree_canvas.height);
	for (let x in tmp.supernova.tree_had) {
        let id = tmp.supernova.tree_had[x]
        let branch = TREE_UPGS.ids[id].branch||[]
        if (branch.length > 0 && TREE_UPGS.ids[id].nul?TREE_UPGS.ids[id].nul():true) for (let y in branch) {
			drawTreeBranch(branch[y], id)
		}
	}
}

function treeCanvas() {
    if (!retrieveCanvasData()) return
    if (tree_canvas && tree_ctx) {
        window.addEventListener("resize", resizeCanvas)

        tree_canvas.width = tree_canvas.clientWidth
        tree_canvas.height = tree_canvas.clientHeight
    }
}

function drawTreeBranch(num1, num2) {
    var start = document.getElementById("treeUpg_"+num1).getBoundingClientRect();
    var end = document.getElementById("treeUpg_"+num2).getBoundingClientRect();
    var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft) - (window.innerWidth-tree_canvas.width)/2;
    var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop) - (window.innerHeight-tree_canvas.height-45);
    var x2 = end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft) - (window.innerWidth-tree_canvas.width)/2;
    var y2 = end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop) - (window.innerHeight-tree_canvas.height-45);
    tree_ctx.lineWidth=10;
    tree_ctx.beginPath();
    tree_ctx.strokeStyle = player.supernova.tree.includes(num2)?"#00520b":tmp.supernova.tree_afford[num2]?"#fff":"#333";
    tree_ctx.moveTo(x1, y1);
    tree_ctx.lineTo(x2, y2);
    tree_ctx.stroke();
}

function updateTreeHTML() {
    let req = ""
    if (tmp.supernova.tree_choosed != "") req = TREE_UPGS.ids[tmp.supernova.tree_choosed].req?`<span class="${TREE_UPGS.ids[tmp.supernova.tree_choosed].req()?"green":"red"}">${TREE_UPGS.ids[tmp.supernova.tree_choosed].reqDesc?" Require: "+(typeof TREE_UPGS.ids[tmp.supernova.tree_choosed].reqDesc == "function"?TREE_UPGS.ids[tmp.supernova.tree_choosed].reqDesc():TREE_UPGS.ids[tmp.supernova.tree_choosed].reqDesc):""}</span>`:""
    tmp.el.tree_desc.setHTML(
        tmp.supernova.tree_choosed == "" ? ""
        : `<div style="font-size: 12px; font-weight: bold;"><span class="gray">(click again to buy if affordable)</span>${req}</div>
        <span class="sky">${TREE_UPGS.ids[tmp.supernova.tree_choosed].desc}</span><br>
        <span>Cost: ${format(TREE_UPGS.ids[tmp.supernova.tree_choosed].cost,2)} Neutron star</span><br>
        <span class="green">${TREE_UPGS.ids[tmp.supernova.tree_choosed].effDesc?"Currently: "+TREE_UPGS.ids[tmp.supernova.tree_choosed].effDesc(tmp.supernova.tree_eff[tmp.supernova.tree_choosed]):""}</span>
        `
    )
    for (let x = 0; x < tmp.supernova.tree_had.length; x++) {
        let id = tmp.supernova.tree_had[x]
        let unl = TREE_UPGS.ids[id].unl?TREE_UPGS.ids[id].unl():true
        tmp.el["treeUpg_"+id].setVisible(unl)
        if (unl) tmp.el["treeUpg_"+id].setClasses({btn_tree: true, locked: !tmp.supernova.tree_afford[id], bought: player.supernova.tree.includes(id), choosed: id == tmp.supernova.tree_choosed})
    }
}