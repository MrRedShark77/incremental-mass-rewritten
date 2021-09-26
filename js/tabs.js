const TABS = {
    choose(x, stab=false) {
        if (!stab && player.tab[0] != x) player.tab[1] = 0
        player.tab[stab?1:0] = x
    },
    1: [
        { id: "Main" },
        { id: "Stats" },
        { id: "Upgrades", unl() { return player.rp.unl } },
        { id: "Black Hole", unl() { return player.bh.unl } },
        { id: "Challenges", unl() { return player.chal.unl } },
        { id: "Options" },
    ],
    2: {
        1: [
            { id: "Ranks Rewards" },
            { id: "Scaling", unl() { return tmp.scaling ? tmp.scaling.super.length>0 : false } },
        ],
    },
}