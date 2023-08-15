const TABS_DATA = {
    "mass"  : { name: "Mass" },
    "bh"    : { name: "Black Hole", style: "bh" },
    "atomic": { name: "Atomic Generator", style: "atom" },
    'star'  : { name: "Stars", style: "sn" },
    'bp'    : { name: "Indescribable Matter", style: "qu" },
    'tp'    : { name: "The Parallel", style: "inf" },
    'snake' : { name: "The Snake", style: "ouro" },

    'rank-reward': { name: "Ranks Rewards" },
    'scaling'    : { name: "Scaling" },
    'pres-reward': { name: "Prestige Rewards" },
    'bd-reward'  : { name: "Beyond-Ranks Rewards" },
    'asc-reward' : { name: "Ascension Rewards" },

    'main-upg': { name: "Main Upgrades" },

    'chal': { name: "Challenges" },
    'qc'  : { name: "Quantum Challenge", style: "qu" },

    'particles': { name: "Particles" },
    'elements' : { name: "Elements" },
    'dil'      : { name: "Mass Dilation", style: "dilation" },
    'break-dil': { name: "Break Dilation", style: "break_dilation" },
    'ext-atom' : { name: "Exotic Atoms" },

    'sn-tree': { name: "Neutron Tree" },
    'boson'  : { name: "Bosons" },
    'ferm'   : { name: "Fermions" },
    'rad'    : { name: "Radiation" },

    'chroma' : { name: "Chroma" },
    'qu-mil' : { name: "Quantum Milestones" },
    'auto-qu': { name: "Auto-Quantum" },
    'prim'   : { name: "Primordium" },
    'entropy': { name: "Entropy" },

    'dark-eff': { name: "Dark Effects" },
    'dark-run': { name: "Dark Run" },
    'matters' : { name: "The Matters" },
    'c16'     : { name: "Corruption" },

    'inf-core': { name: "Core" },
    'core-eff': { name: "Core Effect" },
    'inf-upgs': { name: "Infinity Upgrades", style: "inf" },
    'c-star'  : { name: "Corrupted Star" },

    'options' : { name: "Options" },
    'res-hide': { name: "Resource Hider" },
}

function chooseTab(x, stab=false) {
    if (!stab) tmp.tab = x
    else tmp.stab[tmp.tab] = x

    tmp.stab[tmp.tab] ??= 0

    updateTabTemp()
}

function updateTabTemp() {
    let s = TABS[tmp.tab].stab

    if (s) {
        let t = s[tmp.stab[tmp.tab]]

        tmp.tab_name = Array.isArray(t) ? t[0] : t
    } else {
        tmp.tab_name = ""
    }
}

const TABS = [
    { name: "Main", icon: "pajamas:weight", stab: [
        'mass',
        ['bh', () => player.bh.unl],
        ['atomic', () => player.atom.unl],
        ['star', () => STARS.unlocked()],
        ['bp', () => quUnl()],
        ['tp', () => hasInfUpgrade(9), () => OURO.evolution < 1],
        ['snake', null, () => OURO.evolution > 0],
    ] },
    { name: "Stats", icon: "material-symbols:query-stats", stab: [
        'rank-reward',
        ['scaling', () => tmp.scaling && tmp.scaling.super.length>0],
        ['pres-reward', () => hasUpgrade("br",9)],
        ['bd-reward', () => tmp.brUnl],
        ['asc-reward', () => tmp.ascensions_unl],
    ] },
    { name: "Upgrades", icon: "carbon:upgrade", stab: [
        'main-upg',
        ['elements', null, () => OURO.evolution > 0],
    ] },
    { name: "Challenges", icon: "material-symbols:star", unl() { return player.chal.unl }, stab: [
        'chal',
        ['qc', () => hasTree("unl3")],
    ] },
    { name: "Atom", icon: "eos-icons:atom-electron", color: "cyan", unl() { return player.atom.unl }, style: "atom", stab: [
        'particles',
        ['elements', () => player.chal.comps[7].gte(16) || player.supernova.times.gte(1) || quUnl(), () => OURO.evolution < 1],
        ['dil', () => MASS_DILATION.unlocked()],
        ['break-dil', () => hasUpgrade("br",9)],
        ['ext-atom', () => tmp.eaUnl],
    ] },
    { name: "Supernova", icon: "material-symbols:explosion-outline", color: "magenta", unl() { return player.supernova.times.gte(1) || quUnl() }, style: "sn", stab: [
        'sn-tree',
        ['boson', () => player.supernova.post_10],
        ['ferm', () => player.supernova.fermions.unl],
        ['rad', () => tmp.radiation.unl],
    ] },
    { name: "Quantum", icon: "material-symbols:grid-4x4-rounded", color: "lightgreen", unl() { return quUnl() }, style: "qu", stab: [
        'chroma',
        'qu-mil',
        ['auto-qu', () => tmp.qu.mil_reached[6]],
        ['prim', () => PRIM.unl()],
        ['entropy', () => player.qu.en.unl],
    ] },
    { name: "Darkness", icon: "ic:baseline-remove-red-eye", color: "grey", unl() { return player.dark.unl }, style: "dark", stab: [
        'dark-eff',
        ['dark-run', () => tmp.darkRunUnlocked],
        ['matters', () => tmp.matterUnl],
        ['c16', () => player.dark.c16.first],
    ] },
    { name: "Infinity", icon: "game-icons:infinity", color: "orange", unl() { return tmp.inf_unl }, style: "inf", stab: [
        'inf-core',
        'core-eff',
        'inf-upgs',
        ['tp', () => hasInfUpgrade(9), () => OURO.evolution > 0],
        ['c-star', () => tmp.CS_unl],
    ] },
    { name: "Options", icon: "mdi:gear", stab: [
        'options',
        'res-hide',
    ] },
]

function setupTabHTML() {
    let tabs = new Element("tabs")
	let stabs = new Element("stabs")
	let table = ""
	let table2 = ""

	for (let [i,x] of Object.entries(TABS)) {
		table += `<div>
			<button onclick="chooseTab(${i})" class="btn_tab ${x.style??""}" id="tab${i}">${x.icon ? `<iconify-icon icon="${x.icon}" width="72" style="color: ${x.color||"white"}"></iconify-icon>` : ""}<div>${x.name}</div></button>
		</div>`
		if (x.stab) {
			let a = `<div id="stabs${i}" class="table_center stab_btn">`
			for (let [j,y] of Object.entries(x.stab)) {
                if (Array.isArray(y)) y = y[0]

                let td = TABS_DATA[y]

				a += `<div style="width: 160px" id="stab_div${i}_${j}">
					<button onclick="chooseTab(${j}, true)" class="btn_tab ${td.style??""}" id="stab${i}_${j}">${td.name}</button>
				</div>`
			}
			a += `</div>`
			table2 += a
		}
	}
	tabs.setHTML(table)
	stabs.setHTML(table2)
}

function updateTabsHTML() {
	let s = !player.options.nav_hide[0]
	tmp.el.stabs_div.setDisplay(TABS[tmp.tab].stab)
	
	for (let [x,tab] of Object.entries(TABS)) {
		if (s) {
			tmp.el["tab"+x].setDisplay(!tab.unl || tab.unl())
			tmp.el["tab"+x].setClasses({btn_tab: true, [tab.style ?? "normal"]: true, choosed: x == tmp.tab})
		}

		if (tab.stab) {
			tmp.el["stabs"+x].setDisplay(x == tmp.tab)
			if (x == tmp.tab) for (let [y,stab] of Object.entries(tab.stab))  {
                let id, unl = true

                if (Array.isArray(stab)) {
                    if (stab[2]) {
                        unl = stab[2]()
                        tmp.el["stab_div"+x+"_"+y].setDisplay(unl)
                    }

                    tmp.el["stab"+x+"_"+y].setDisplay(unl && (!stab[1] || stab[1]()))
                    id = stab[0]
                }
                else id = stab

                td = TABS_DATA[id]
				
				if (unl) tmp.el["stab"+x+"_"+y].setClasses({btn_tab: true, [td.style ?? "normal"]: true, choosed: y == tmp.stab[x]})
			}
		}
	}

    for (let x in TABS_DATA) {
        if (tmp.el["tab_div-"+x]) tmp.el["tab_div-"+x].setDisplay(tmp.tab_name == x)
    }
}