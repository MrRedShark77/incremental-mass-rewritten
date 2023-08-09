const TABS = {
    choose(x, stab=false) {
        if (!stab) {
            if (x==5) tmp.sn_tab = tmp.tab
            tmp.tab = x
            if (x!=5) {
                tmp.sn_tab = tmp.tab
                tree_update = true
            }
        }
        else {
            tmp.stab[tmp.tab] = x
        }
    },
    1: [
        { id: "Main", icon: "pajamas:weight" },
        { id: "Stats", icon: "material-symbols:query-stats" },
        { id: "Upgrades", icon: "carbon:upgrade", unl() { return player.rp.unl } },
        { id: "Challenges", icon: "material-symbols:star", unl() { return player.chal.unl } },
        { id: "Atom", icon: "eos-icons:atom-electron", color: "cyan", unl() { return player.atom.unl }, style: "atom" },
        { id: "Supernova", icon: "material-symbols:explosion-outline", color: "magenta", unl() { return player.supernova.times.gte(1) || quUnl() }, style: "sn" },
        { id: "Quantum", icon: "material-symbols:grid-4x4-rounded", color: "lightgreen", unl() { return quUnl() }, style: "qu" },
        { id: "Darkness", icon: "ic:baseline-remove-red-eye", color: "grey", unl() { return player.dark.unl }, style: "dark" },
        { id: "Infinity", icon: "game-icons:infinity", color: "orange", unl() { return tmp.inf_unl }, style: "inf" },
        { id: "Galaxy", icon: "solar:black-hole-line-duotone", color: "white", unl() { return player.galaxy.times.gte(1) }, style: "glx" },
        { id: "Multiverse", icon: "solar:star-rings-broken", color: "white", unl() { return tmp.mlt_unl }, style: "mlt" },
        { id: "Options", icon: "mdi:gear" },
    ],
    2: {
        0: [
            { id: "Mass" },
            { id: "Black Hole", unl() { return player.bh.unl }, style: "bh" },
            { id: "Atomic Generator", unl() { return player.atom.unl }, style: "atom" },
            { id: "Stars", unl() { return STARS.unlocked() }, style: "sn" },
            { id: "Indescribable Matter", unl() { return quUnl() }, style: "qu" },
            { id: "The Parallel", unl() { return hasInfUpgrade(9) }, style: "inf" },
            { id: "Antimatter", unl() { return hasElement(268) }, style: "dark" },
            { id: "Multiversal Mass", unl() { return tmp.mlt_unl }, style: "inf" },
        ],
        1: [
            { id: "Ranks Rewards" },
            { id: "Scaling", unl() { return tmp.scaling ? tmp.scaling.super.length>0 : false } },
            { id: "Prestige Rewards", unl() { return hasUpgrade("br",9) } },
            { id: "Beyond-Ranks Rewards", unl() { return tmp.brUnl } },
            { id: "Ascension Rewards", unl() { return tmp.ascensions_unl } },
            { id: "Beyond-Prestiges Rewards", unl() { return tmp.bpUnl } },
        ],
        3: [
            { id: "Challenges" },
            { id: "Quantum Challenge", unl() { return hasTree("unl3") }, style: "qu" },
            //{ id: "Big Rip", unl() { return hasTree("unl4") }, style: "qu" },
        ],
        4: [
            { id: "Particles" },
            { id: "Elements", unl() { return player.chal.comps[7].gte(16) || player.supernova.times.gte(1) || quUnl() } },
            { id: "Mass Dilation", unl() { return MASS_DILATION.unlocked() }, style: "dilation" },
            { id: "Break Dilation", unl() { return hasUpgrade("br",9) }, style: "break_dilation" },
            { id: "Exotic Atoms", unl() { return tmp.eaUnl } },
        ],
        5: [
            { id: "Neutron Tree" },
            { id: "Bosons", unl() { return player.supernova.post_10 } },
            { id: "Fermions", unl() { return player.supernova.fermions.unl } },
            { id: "Radiation", unl() { return tmp.radiation.unl } },
        ],
        6: [
            { id: "Chroma" },
            { id: "Quantum Milestones" },
            { id: "Auto-Quantum", unl() { return tmp.qu.mil_reached[6] } },
            { id: "Primordium", unl() { return PRIM.unl() } },
            { id: "Entropy", unl() { return player.qu.en.unl } },
        ],
        7: [
            { id: "Dark Effects" },
            { id: "Dark Run", unl() { return tmp.darkRunUnlocked } },
            { id: "The Matters", unl() { return tmp.matterUnl } },
            { id: "Corruption", unl() { return player.dark.c16.first } },
        ],
        8: [
            { id: "Core" },
            { id: "Core Effect" },
            { id: "Infinity Upgrades", style: "inf" },
            { id: "Modificators", unl() {return hasElement(253)} },
            { id: "Orb Of Creation - Upgrades", unl() {return player.chal.comps[17].gte(50)} },
        ],
        9: [
            { id: "Galaxy Particles", unl() { return player.galaxy.times.gte(1) }, style: "glx" },
            { id: "Grading", unl() { return player.galaxy.times.gte(1) }, style: "glx" },
        ],
        10: [
            { id: "Travel", style: "mlt" },
            { id: "Circle Perks", unl() { return player.galaxy.times.gte(1) }, style: "mlt" },
        ],
        11: [
            { id: "Options" },
            { id: "Resource Hider" },
        ],
    },
}