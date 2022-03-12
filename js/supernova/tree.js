const TREE_IDS = [
    ["qol_ext2","qol_ext1","","qol1","","","s3","s2","s1","c","sn1","sn2","sn3","","","chal1","","","feat1"],
    ["qol_ext4","qol_ext3","qol2","qol3","qol4","","s4","","m1","rp1","bh1","","sn4","","chal2","chal4a","chal3","","feat2"],
    ["qol_ext6","qol_ext5","qol5","qol6","qol7","","","m2","t1","","bh2","gr1","sn5","","","chal4","","","feat3"],
    ["qol_ext8","qol_ext7","","unl1","qol8","","m3","","","d1","","","gr2","","chal5","chal6","chal7","","feat4"],
    ["qol_ext9","qol_ext10","","qol10","qol9","","","bs4","bs2","bs1","bs3","","","","","chal8","","","feat5"],
    ["","","","","","","fn8","","","fn1","fn5","","","","","","","","feat6"],
    ["","","","","","","fn7","fn6","fn2","fn3","fn4","","","","","","","","feat7"],
    ["","","","","","","","rad4","rad2","rad1","rad3","rad5","","","","","","","feat8"],
    ["","","","","","","","","","","","","","","","","","","feat9"],
    ["","","","","","","","","","eb1","eb2","ext_c","","","","","","","feat10"],
    ["","","","","","","","","","","ext_l1","","ext_b1","","","","","",""],
    ["","","","","","","","","","ext_l2","ext_l3","ext_e1","ext_b2","ext_b3","","","","",""],
    ["","","","","","","","","","ext_l5","ext_l4","","","","","","","",""],
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
            if (TREE_UPGS.ids[x].onBuy) TREE_UPGS.ids[x].onBuy()
        }
    },
    ids: {
        c: {
            desc: `Start generating 0.1 Neutron Star per second (not affected by offline production).`,
			perm: true,
            cost: E(0),
        },
        sn1: {
            branch: ["c"],
            desc: `Tickspeed affects Neutron Star gain at a reduced rate.`,
            cost: E(10),
            effect() {
                let x = player.tickspeed.add(1).pow(0.25)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        sn2: {
            branch: ["sn1"],
            desc: `Supernova boosts Neutron Star gain.`,
            cost: E(350),
            effect() {
                let x = E(2).add(hasTreeUpg("sn4")?tmp.supernova.tree_eff.sn4:0).pow(player.supernova.times.softcap(15,0.8,0).softcap(25,0.5,0))
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        sn3: {
            branch: ["sn2"],
            desc: `Blue star boost Neutron star gain at a reduced rate.`,
            req() { return player.supernova.times.gte(6) },
            reqDesc: `6 Supernovae.`,
            cost: E(50000),
            effect() {
                let x = player.stars.generators[4].max(1).log10().add(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        sn4: {
            branch: ["sn3"],
            desc: `Tree “sn2”'s effect base is increased by Supernova.`,
            unl() { return player.supernova.post_10 },
            req() { return player.supernova.times.gte(13) },
            reqDesc: `13 Supernovae.`,
            cost: E(1e8),
            effect() {
                let x = player.supernova.times.mul(0.1).softcap(1.5,0.75,0)
                return x
            },
            effDesc(x) { return "+"+format(x)+getSoftcapHTML(x,1.5) },
        },
        m1: {
            branch: ["c"],
            desc: `Neutron star multiplies Mass gain.`,
            cost: E(100),
            effect() {
                let x = E(1e100).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return format(x)+"x"+getSoftcapHTML(x.max(1).log(1e100),1e3) },
        },
        m2: {
            branch: ["m1"],
            desc: `Multiplies the Mass requirement for softcap^2 by 1.5`,
            cost: E(800),
        },
        m3: {
            branch: ["m2"],
            unl() { return player.supernova.fermions.unl && hasTreeUpg("fn1") },
            desc: `Mass gain softcap^2-3 starts later based on Supernovae.`,
            cost: E(1e46),
            effect() {
                let x = player.supernova.times.mul(0.0125).add(1)
                return x
            },
            effDesc(x) { return "^"+format(x)+" later" },
        },
        t1: {
            branch: ["m1", 'rp1'],
			req() {
				if (hasTreeUpg("qol_ext1")) return true
				return player.supernova.chal.noTick && player.mass.gte(E("1.5e1.650056e6").pow(hasTreeUpg('bh2')?1.46:1))
			},
            reqDesc() {return `Reach ${formatMass(E("1.5e1.650056e6").pow(hasTreeUpg('bh2')?1.46:1))} without buying Tickspeed in Supernova run. You can still obtain Tickspeed from Cosmic Rays.`},
            desc: `Tickspeed Power is raised to the 1.15th.`,
            cost: E(1500),
        },
        rp1: {
            branch: ["c"],
            desc: `Neutron Stars multiplies Rage Powers gain`,
            cost: E(200),
            effect() {
                let x = E(1e50).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return format(x)+"x"+getSoftcapHTML(x.max(1).log(1e50),1e3)},
        },
        bh1: {
            branch: ["c"],
            desc: `Neutron Star multiplies Dark Matters gain.`,
            cost: E(400),
            effect() {
                let x = E(1e35).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return format(x)+"x"+getSoftcapHTML(x.max(1).log(1e35),1e3) },
        },
        bh2: {
            branch: ['bh1'],
			req() {
				if (hasTreeUpg("qol_ext1")) return true
				return player.supernova.chal.noBHC && player.bh.mass.gte("1.5e1.7556e4")
			},
            reqDesc() {return `Reach ${format("e1.75e4")} uni of black hole without buying any BH Condenser in Supernova run.`},
            desc: `BH Condenser power is raised to the 1.15th.`,
            cost: E(1500),
        },
        s1: {
            branch: ["c"],
            desc: `Neutron Star boosts last star gain.`,
            cost: E(400),
            effect() {
                let x = player.supernova.stars.add(1).pow(1.4)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        s2: {
            branch: ["s1"],
            req() { return player.supernova.times.gte(3) },
            reqDesc: `3 Supernovae.`,
            desc: `Star boost's Tetr's softcap is 50% weaker.`,
            cost: E(2500),
        },
        s3: {
            branch: ["s2"],
            req() { return player.supernova.times.gte(4) },
            reqDesc: `4 Supernovae.`,
            desc: `Star generators are stronger based on Supernova.`,
            cost: E(10000),
            effect() {
                let x = player.supernova.times.max(0).root(10).mul(0.1).add(1)
                return x
            },
            effDesc(x) { return "^"+format(x) },
        },
        s4: {
            branch: ["s3"],
            req() { return player.supernova.times.gte(6) },
            reqDesc: `6 Supernovae.`,
            desc: `Beyond unlocking stars, Star Unlocker will transform into Booster.`,
            cost: E(1e5),
        },
        qol1: {
            req() { return player.supernova.times.gte(2) },
            reqDesc: `2 Supernovae.`,
            desc: `Start with Silicon-14 & Argon-18 unlocked. You can now automatically buy Elements & Atom upgrades.`,
			perm: true,
            cost: E(1500),
        },
        qol2: {
            branch: ["qol1"],
            req() { return player.supernova.times.gte(3) },
            reqDesc: `3 Supernovae.`,
            desc: `Start with Chromium-24 and Atom upgrade 6 unlocked.`,
			perm: true,
            cost: E(2000),
        },
        qol3: {
            branch: ["qol2"],
            req() { return player.supernova.times.gte(4) },
            reqDesc: `4 Supernovae.`,
            desc: `Start with Techntium-43 unlocked, improve their element better. You can automatically gain Relativistic particles from mass.`,
			perm: true,
            cost: E(10000),
        },
        qol4: {
            branch: ["qol3"],
            unl() { return player.supernova.post_10 },
            req() { return player.supernova.times.gte(12) },
            reqDesc: `12 Supernovae.`,
            desc: `You can now automatically buy Star unlockers & boosters.`,
			perm: true,
            cost: E(1e8),
        },
        qol5: {
            branch: ["qol4"],
            req() { return player.supernova.times.gte(16) },
            reqDesc: `16 Supernovae.`,
            desc: `Tetrs no longer resets anything.`,
			perm: true,
            cost: E(1e13),
        },
        qol6: {
            branch: ["qol5"],
            req() { return player.supernova.times.gte(17) },
            reqDesc: `17 Supernovae.`,
            desc: `While in any challenge, you can now automatically complete it before exiting.`,
			perm: true,
            cost: E(1e15),
        },
        qol7: {
            branch: ["qol6"],
            unl() { return player.supernova.fermions.unl && hasTreeUpg("fn2") },
            req() { return player.supernova.times.gte(40) },
            reqDesc: `40 Supernovae.`,
            desc: `You can now automatically buy Photon & Gluon upgrades, they no longer spent their amount.`,
			perm: true,
            cost: E(1e48),
        },
        chal1: {
            req() { return player.supernova.times.gte(4) },
            reqDesc: `4 Supernovae.`,
            desc: `Add 100 more C7 & C8 maximum completions.`,
            cost: E(6000),
        },
        chal2: {
            branch: ["chal1"],
            req() {
				if (hasTreeUpg("qol_ext1")) return true
                for (let x = 1; x <= 4; x++) if (player.chal.comps[x].gte(1)) return false
                return player.mass.gte(E('e2.05e6').mul(1.5e56))
            },
            reqDesc() { return `Reach ${format('e2.05e6')} uni without challenge 1-4 completions in Supernova run.` },
            desc: `Keep challenge 1-4 completions on reset.`,
            cost: E(1e4),
        },
        chal3: {
            branch: ["chal1"],
            req() {
				if (hasTreeUpg("qol_ext1")) return true
                for (let x = 5; x <= 8; x++) if (player.chal.comps[x].gte(1)) return false
                return player.bh.mass.gte(E('e1.75e4').mul(1.5e56))
            },
            reqDesc() { return `Reach ${format('e1.75e4')} uni of black hole without challenge 5-8 completions in Supernova run.` },
            desc: `Keep challenge 5-8 completions on reset.`,
            cost: E(1e4),
        },
        chal4: {
            branch: ["chal2","chal3"],
            desc: `Unlock new challenge.`,
            cost: E(1.5e4),
        },
        chal4a: {
            unl() { return player.supernova.post_10 },
            branch: ["chal4"],
            desc: `Make 9th Challenges effect better.`,
            cost: E(1e8),
        },
        chal5: {
            branch: ["chal4"],
            desc: `Unlock new challenge.`,
            cost: E(1e17),
        },
        gr1: {
            branch: ["bh1"],
            desc: `BH Condensers power boost Cosmic Rays power.`,
            req() { return player.supernova.times.gte(7) },
            reqDesc: `7 Supernovae.`,
            cost: E(1e6),
            effect() {
                let x = tmp.bh?tmp.bh.condenser_eff.pow.max(1).root(3):E(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        gr2: {
            unl() { return player.supernova.fermions.unl },
            branch: ["gr1"],
            desc: `Cosmic Rays Power is raised to 1.25th power.`,
            cost: E(1e20),
        },
        bs1: {
            unl() { return player.supernova.post_10 },
            req() { return player.supernova.times.gte(15) },
            reqDesc: `15 Supernovae`,
            desc: `Tickspeed affect Higgs Bosons gain at a reduced rate.`,
            cost: E(1e13),
            effect() {
                let x = player.tickspeed.add(1).pow(0.6)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        bs2: {
            branch: ["bs1"],
            desc: `Photon, Gluon powers up each other.`,
            cost: E(1e14),
            effect() {
                let x = expMult(player.supernova.bosons.photon.max(1),1/2,2)
                let y = expMult(player.supernova.bosons.gluon.max(1),1/2,2)
                return [x,y]
            },
            effDesc(x) { return format(x[1])+"x to Photon, "+format(x[0])+"x to Gluon" },
        },
        bs3: {
            branch: ["bs1"],
            desc: `Neutrons gain is affected by Graviton's effect at a reduced rate.`,
            cost: E(1e14),
            effect() {
                let x = tmp.bosons.effect.graviton[0].add(1).root(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        bs4: {
            unl() { return player.supernova.fermions.unl },
            branch: ["bs2"],
            desc: `Raise Z Bosons gain to the 1.5th power.`,
            cost: E(1e24),
        },
        fn1: {
            unl() { return player.supernova.fermions.unl },
            branch: ["bs1"],
            desc: `Tickspeed affect each Fermions gain at a reduced rate.`,
            cost: E(1e27),
            effect() {
                let x = E(1.25).pow(player.tickspeed.pow(0.4))
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        fn2: {
            branch: ["fn1"],
            req() { return hasTreeUpg("qol_ext1") || (player.mass.div('1.5e56').gte("ee6") && player.md.active && FERMIONS.onActive("01")) },
            reqDesc() { return `Reach ${formatMass(E('e1e6').mul(1.5e56))} while dilating mass in [Down]` },
            desc: `Unlock 2 new types of U-Quark & U-Fermion.`,
            cost: E(1e33),
        },
        fn3: {
            branch: ["fn1"],
            req() { return player.supernova.fermions.points[0].gte(1e7) || player.supernova.fermions.points[1].gte(1e7) },
            reqDesc() { return `Reach ${format(1e7)} of any Fermions` },
            desc: `Super Fermion's Tier scaling is 7.5% weaker.`,
            cost: E(1e30),
        },
        fn4: {
            unl() { return hasTreeUpg("fn2") },
            branch: ["fn1"],
            desc: `2nd Photon & Gluon upgrades are slightly stronger.`,
            cost: E(1e39),
        },
        fn5: {
            unl() { return hasTreeUpg("fn2") },
            branch: ["fn1"],
            req() { return hasTreeUpg("qol_ext1") || (player.atom.quarks.gte("e12500") && FERMIONS.onActive("10")) },
            reqDesc() { return `Reach ${format("e12500")} quarks while in [Electron]` },
            desc: `[Electron] max tier is increased by 35. Its effect softcap is weaker.`,
            cost: E(1e42),
        },
        fn6: {
            branch: ["fn2"],
            req() { return hasTreeUpg("qol_ext1") || (player.mass.gte(uni('e4e4')) && FERMIONS.onActive("02") && CHALS.inChal(5)) },
            reqDesc() { return `Reach ${formatMass(uni("e4e4"))} while in [Charm] & Challenge 5.` },
            desc: `Unlock 2 new more types of U-Quark & U-Fermion.`,
            cost: E(1e48),
        },
        d1: {
            unl() { return hasTreeUpg("fn6") },
            branch: ["rp1"],
            desc: `Generating Relativistic particles outside Mass dilation is 25% stronger.`,
            cost: E(1e51),
        },
        unl1: {
            branch: ["qol7"],
            unl() { return hasTreeUpg("fn6") },
            req() { return player.supernova.times.gte(44) },
            reqDesc: `44 Supernovae.`,
            desc: `Unlock Radiation.`,
            cost: E(5e52),
        },
        rad1: {
            unl() { return tmp.radiation.unl },
            desc: `Gain more frequency based on Supernova, any more radiation if you unlocked next radiation.`,
            cost: E(1e54),
            effect() {
                let x = player.supernova.times.add(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        rad2: {
            branch: ["rad1"],
            desc: `Gain more Radiation based on Supernovae.`,
            cost: E(1e72),
            effect() {
				let sn = player.supernova.times
				let b = sn.div(300).add(1)
				if (future && sn.gt(300)) b = E(2).pow(sn.div(300).sqrt()) //For a future upgrade
                let x = b.pow(sn.sub(40)).max(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        qol8: {
            branch: ["qol7"],
            unl() { return hasTreeUpg("qol7") },
            req() { return player.supernova.times.gte(50) },
            reqDesc: `50 Supernovae.`,
            desc: `You can automatically sweep challenges and fermions with at least 15 completions / tiers, after 1.5 seconds of Supernova.`,
            cost: E(1e65),
			perm: true,
        },
        fn7: {
            branch: ["fn6"],
            unl() { return hasTreeUpg("rad1") },
            desc: `Unlock 2 even more types of U-Quark & U-Fermion.`,
            cost: E(1e80),
        },
        chal6: {
            branch: ["chal5"],
            desc: `Unlock new challenge.`,
            cost: E(1e94),
        },
        sn5: {
            branch: ["sn4"],
            unl() { return hasTreeUpg("rad1") },
            desc: `Supernova scalings are no longer rounded down to a integer, and unlock Pent.`,
            cost: E(1e90),
        },
        fn8: {
            branch: ["fn7"],
            desc: `Unlock 2 final types of U-Quark & U-Fermion.`,
            cost: E(1e128),
        },
        rad3: {
            branch: ["rad1"],
            desc: `Extra levels are raised based on radiation types.`,
            cost: E(4.56789e123),
        },
        qol9: {
            branch: ["qol8"],
            desc: `You can enter both U-Quarks and U-Leptons.`,
            cost: E(1e120),
			perm: true,
        },
        chal7: {
            branch: ["chal6"],
            desc: `Unlock the finale of Supernova Challenges, Challenge 12.`,
            cost: E(1e165),
        },
        qol10: {
            branch: ["qol9"],
            desc: `You can do 2 challenges at once from sweeping. [Coming really soon!]`,
            cost: E(1/0),
			perm: true,
        },
        rad4: {
            unl() { return player.ext.amt.gte(1) },
            branch: ["rad2"],
            desc: `All Radiation Meta-Boosts are 50% stronger.`,
            cost: E(1e190),
        },

		/* EXOTIC */
        eb1: {
            unl() { return player.ext.amt.gte(1) },
            desc: `Unlock Black Hole and Atomic Buildings #2.`,
            cost: E(1e10),
			perm: true,
        },
        eb2: {
			branch: ["eb1"],
            desc: `Unlock Black Hole and Atomic Buildings #3.`,
            cost: E(1e200),
			perm: true,
        },
		chal8: {
			branch: ["chal7"],
			req() { return player.ext.amt.gte(EXOTIC.amt(1e32)) },
			reqDesc() { return "Get " + format(EXOTIC.amt(1e32)) + " Exotic Matter." },
			desc: `Unlock the introduction challenge of the Exotic side, Challenge 13.`,
			cost: E(0),
			perm: true,
		},
		rad5: {
			unl() { return player.ext.amt.gte(1) },
			branch: ["rad3"],
			desc: `Meta-Boost I is stronger based on Pents.`,
			cost: E("1e370"),
			perm: true,
		},
		ext_c: {
			branch: ["eb2"],
			req() { return player.ext.amt.gte(EXOTIC.amt(1e5)) },
			reqDesc() { return "Get " + format(EXOTIC.amt(1e5)) + " Exotic Matter." },
			desc: `Start producing Y-Axions based on Supernovae.`,
			cost: E("3.333e333"),
			perm: true,
			icon: "axion",
		},
		ext_l1: {
			branch: ["ext_c"],
			req() { return player.ext.amt.gte(EXOTIC.amt(1e8)) },
			reqDesc() { return "Get " + format(EXOTIC.amt(1e8)) + " Exotic Matter." },
			desc: `Axion Levels increase costs 20% slower.`,
			cost: E("1e400"),
			perm: true,
			onBuy: updateAxionLevelTemp,
			icon: "axion",
		},
		ext_l2: {
			branch: ["ext_l1"],
			req() { return player.ext.amt.gte(EXOTIC.amt(hasTreeUpg("ext_l3") ? 1e35 : 1e11)) },
			reqDesc() { return "Get " + format(EXOTIC.amt(hasTreeUpg("ext_l3") ? 1e35 : 1e11)) + " Exotic Matter. [increased with ext_l3]" },
			desc: `Axion Levels synergize with ones from the other side.`,
			cost: E(0),
			perm: true,
			onBuy: updateAxionLevelTemp,
			icon: "axion",
		},
		ext_l3: {
			branch: ["ext_l1"],
			req() { return player.ext.amt.gte(EXOTIC.amt(hasTreeUpg("ext_l2") ? 1e35 : 1e11)) },
			reqDesc() { return "Get " + format(EXOTIC.amt(hasTreeUpg("ext_l2") ? 1e35 : 1e11)) + " Exotic Matter. [increased with ext_l2]" },
			desc: `Axion Levels cheapen the nearest ones.`,
			cost: E(0),
			perm: true,
			onBuy: updateAxionLevelTemp,
			icon: "axion",
		},
		ext_l4: {
			branch: ["ext_l2", "ext_l3"],
			req() { return hasTreeUpg("ext_l2") && hasTreeUpg("ext_l3") },
			reqDesc() { return "Get 'ext_l2' and 'ext_l3' upgrades." },
			desc: `Axion Levels cheapen ones on the right / underneath.`,
			cost: E("1e2500"),
			perm: true,
			onBuy: updateAxionLevelTemp,
			icon: "axion",
		},
		ext_l5: {
			unl() { return player.chal.comps[13].gte(12) },
			branch: ["ext_l4"],
			req() { return player.ext.amt.gte(EXOTIC.amt(1e250)) },
			reqDesc() { return "Get " + format(EXOTIC.amt(1e250)) + " Exotic Matter." },
			desc: `Axion Levels cheapen the farther ones behind.`,
			cost: E(1/0),
			perm: true,
			onBuy: updateAxionLevelTemp,
			icon: "axion",
		},
		ext_b1: {
			unl() { return hasTreeUpg("ext_l2") || hasTreeUpg("ext_l3") },
			branch: ["ext_c"],
			req() { return player.ext.amt.gte(EXOTIC.amt(1e25)) },
			reqDesc() { return "Get " + format(EXOTIC.amt(1e25)) + " Exotic Matter." },
			desc: `Row-4 levels synergize with row-1 levels.`,
			cost: E(0),
			perm: true,
			onBuy: updateAxionLevelTemp,
			icon: "axion",
		},
		ext_b2: {
			unl() { return player.chal.comps[13].gte(12) },
			branch: ["ext_b1"],
			req() { return player.ext.amt.gte(EXOTIC.amt(hasTreeUpg("ext_b3") ? "1e2000" : "1e600")) },
			reqDesc() { return "Get " + format(EXOTIC.amt(hasTreeUpg("ext_b3") ? "1e2000" : "1e600")) + " Exotic Matter." },
			desc: `Levels synergize boosts diagonally on the right. [Coming soon!]`,
			cost: E(1/0),
			perm: true,
			onBuy: updateAxionLevelTemp,
			icon: "axion",
		},
		ext_b3: {
			unl() { return player.chal.comps[13].gte(12) },
			branch: ["ext_b1"],
			req() { return player.ext.amt.gte(EXOTIC.amt(hasTreeUpg("ext_b2") ? "1e2000" : "1e600")) },
			reqDesc() { return "Get " + format(EXOTIC.amt(hasTreeUpg("ext_b2") ? "1e2000" : "1e600")) + " Exotic Matter." },
			desc: `Levels synergize boosts diagonally on the left. [Coming soon!]`,
			cost: E(1/0),
			perm: true,
			onBuy: updateAxionLevelTemp,
			icon: "axion",
		},
		ext_e1: {
			unl() { return player.chal.comps[13].gte(12) },
			branch: ["ext_c"],
			req() { return player.ext.amt.gte(EXOTIC.amt("1e400")) },
			reqDesc() { return "Get " + format(EXOTIC.amt("1e400")) + " Exotic Matter." },
			desc: `Start producing Z-Axions based on Frequency.`,
			cost: E(0),
			perm: true,
			icon: "axion",
		},
		qol_ext1: {
			branch: ["qol1"],
			unl() { return hasTreeUpg("qol_ext4") },
			req() { return player.supernova.times.gte(4) },
			reqDesc() { return `${format(4,0)} Supernovae` },
			desc: `You don't need to do requirements before buying several Supernova upgrades.`,
			perm: true,
			cost: E(2000),
			icon: "exotic",
			effect() {
				let x = E(1)
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		qol_ext2: {
			branch: ["qol_ext1"],
			req() { return player.ext.amt.gte(EXOTIC.amt(10)) },
			reqDesc() { return format(EXOTIC.amt(10)) + " Exotic Matter" },
			desc: `Reduce the auto-sweeper threshold to 10.`,
			perm: true,
			cost: E(1e100),
			icon: "exotic",
			effect() {
				let x = E(1)
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		qol_ext3: {
			branch: ["qol_ext1"],
			desc: `Radiation Boosters are fully automated for at least 100,000 radiation.`,
			perm: true,
			cost: E(1e185),
			icon: "exotic",
			effect() {
				let x = E(1)
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		qol_ext4: {
			branch: ["qol_ext1"],
			req() {
				let sum = E(0)
				for (var i = 1; i <= CHALS.cols; i++) sum = sum.add(player.chal.comps[i])
				return sum.round().gte(6e3)
			},
			reqDesc: `Get 6,000 challenge completions.`,
			desc: `Keep the 'chal' upgrades except you start with 50 completions and 10 tiers for each Fermion.`,
			perm: true,
			cost: E(1e200),
			icon: "exotic",
			effect() {
				let x = E(1)
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		qol_ext5: {
			branch: ["qol_ext1"],
			desc: `Keep the core Supernova upgrades.`,
			perm: true,
			cost: E(1e170),
			icon: "exotic",
			effect() {
				let x = E(1)
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		qol_ext6: {
			branch: ["qol_ext1"],
			desc: `Keep the Boson - Fermion upgrades, and start with 10 completions for C9 - 12.`,
			perm: true,
			cost: E(1e250),
			icon: "exotic",
			effect() {
				let x = E(1)
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		qol_ext7: {
			branch: ["qol_ext1"],
			desc: `Keep the Radiation upgrades.`,
			perm: true,
			cost: E("1e400"),
			icon: "exotic",
			effect() {
				let x = E(1)
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		qol_ext8: {
			branch: ["qol_ext1"],
			desc: `Automatically gain C1 - 4 completions without entering.`,
			perm: true,
			cost: E("1e800"),
			icon: "exotic",
			effect() {
				let x = E(1)
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		qol_ext9: {
			branch: ["qol_ext8"],
			desc: `Automatically gain C5 - 8 completions without entering.`,
			perm: true,
			cost: E("1e2000"),
			icon: "exotic",
			effect() {
				let x = E(1)
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		qol_ext10: {
			branch: ["qol_ext9"],
			desc: `Automatically go Supernova when you gain 30% more.`,
			perm: true,
			cost: E("1e3000"),
			icon: "exotic",
			effect() {
				let x = E(1)
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},

		/* FEATS */
		feat1: {
			unl() { return hasTreeUpg("rad1") },
			req() {
				if (!player.supernova.fermions.choosed) return
				if (!player.supernova.fermions.choosed2) return

				if (!featCheck()) return

				return player.mass.lt(player.stats.maxMass.pow(1e-3))
			},
			reqDesc: `Get at most ^0.001 of best mass within a U-Quark and a U-Lepton. [Automation must be on for feats 1 - 3!]`,
			desc: `Gain 3x more Radiation.`,
			perm: true,
			cost: E(1e130),
		},
		feat2: {
			unl() { return hasTreeUpg("rad1") },
			req() {
				if (player.chal.active) return
				if (!player.md.active) return

				if (!featCheck()) return

				return player.mass.gte(player.supernova.maxMass.pow(0.1))
			},
			reqDesc: `Get ^0.1 of best mass for this Supernova within Mass Dilation.`,
			desc: `Add ^0.015 to Titanium-73 effect.`,
			perm: true,
			cost: E(1e140),
		},
		feat3: {
			unl() { return hasTreeUpg("rad1") },
			req() { return player.mass.gte(uni("e2.5e10")) && player.mainUpg.rp.length + player.mainUpg.bh.length + player.mainUpg.atom.length < 30 },
			reqDesc() { return "Get " + formatMass(uni("ee25")) + " with at most 30 Main Upgrades. [Turn off automation in Upgrades and restart a Supernova run first!]" },
			desc: `All Tickspeed scalings scale 35% weaker.`,
			perm: true,
			cost: E(1e155),
		},
		feat4: {
			unl() { return player.ext.amt.gte(1) },
			req() {
				if (player.mass.lt(mlt(1))) return false
				let sum = E(0)
				for (var i = 1; i <= CHALS.cols; i++) sum = sum.add(player.chal.comps[i])
				for (var i = 1; i <= 4; i++) if (player.chal.comps[i].lte(sum.mul(.05))) return true
				return false
			},
			reqDesc() { return `Get ${formatMass(mlt(1))} mass with one black hole challenge have at most 5% of total completions.` },
			desc: `Reduce the auto-sweeper threshold by 2 completions / tiers.`,
			perm: true,
			cost: E(1e100),
		},
		feat5: {
			unl() { return player.ext.amt.gte(1) },
			req() { return player.mass.gte(mlt(1)) && player.ext.time <= 3600 },
			reqDesc() { return `Reach ${formatMass(mlt(1))} mass in 1 hour of Exotic Run.` },
			desc: `+^0.05 to Mass and Rage gain exponents and their caps.`,
			perm: true,
			cost: E(1e40),
		},
		feat6: {
			unl() { return player.ext.amt.gte(1) },
			req() { return player.mass.lt(uni("ee10")) && tmp.supernova.bulk.sub(player.supernova.times).round().gte(15) },
			reqDesc() { return `Get +15 Supernova gains in under ${formatMass(uni("ee10"))} mass` },
			desc: `Pre-Ultra Supernova scalings start 1 later.`,
			perm: true,
			cost: E(0),
		},
		feat7: {
			unl() { return player.ext.amt.gte(1) },
			req() { return player.mass.gte(uni("ee11")) & player.ext.chal.f7 },
			reqDesc() { return `Reach ${formatMass(uni("ee11"))} mass while being stuck in any challenge throughout a Exotic run.` },
			desc: `Hardened Challenges scaling is 5% weaker.`,
			perm: true,
			cost: E(0),
		},
		feat8: {
			unl() { return player.chal.comps[13].gte(12) },
			req() { return false },
			reqDesc() { return `???` },
			desc: `Supernova scalings start 3 later.`,
			perm: true,
			cost: E(0),
		},
		feat9: {
			unl() { return player.chal.comps[13].gte(12) },
			req() { return false },
			reqDesc() { return `???` },
			desc: `Make Exotic Matter stranger than before!`,
			perm: true,
			cost: E(0),
			onBuy: () => player.ext.amt = EXOTIC.reduce(EXOTIC.extLvl(), player.ext.amt)
		},
		feat10: {
			unl() { return player.chal.comps[13].gte(12) },
			req() { return false },
			reqDesc() { return `???` },
			desc: `Make Exotic Matter stranger than before!`,
			perm: true,
			cost: E(0),
			onBuy: () => player.ext.amt = EXOTIC.reduce(EXOTIC.extLvl(), player.ext.amt)
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

function hasTreeUpg(x) {
	return player.supernova.tree.includes(x)
}

function featCheck() {
	if (!(player.auto_ranks.rank && player.auto_ranks.tier && player.auto_ranks.tetr && player.auto_ranks.pent)) return
	if (!(player.autoMassUpg[1] && player.autoMassUpg[2] && player.autoMassUpg[3] && player.autoTickspeed)) return
	if (!(player.auto_mainUpg.rp && player.auto_mainUpg.bh && player.auto_mainUpg.atom)) return
	if (!(player.bh.autoCondenser && player.atom.auto_gr)) return
	if (player.chal.active) return
	if (player.supernova.time < 5) return
	return true
}

function setupTreeHTML() {
    let tree_table = new Element("tree_table")
	let table = ``
	for (let i = 0; i < 19; i++) {
        table += `<div style="min-width: 1406px; text-align: center; min-height: 74px; max-height: 74px">`
        for (let j = 0; j < 19; j++) {
            let id = TREE_IDS[i][j]
            let option = id == "" ? `style="visibility: hidden"` : ``
            let img = !TREE_UPGS.ids[id] ? `` : TREE_UPGS.ids[id].icon ? ` <img src="images/tree/${TREE_UPGS.ids[id].icon}.png">` : TREE_UPGS.ids[id].noIcon ? ` <img src="images/tree/placeholder.png">` : `<img src="images/tree/${id}.png">`
            table += `<button id="treeUpg_${id}" class="btn_tree" onclick="TREE_UPGS.buy('${id}'); tmp.supernova.tree_choosed = '${id}'" ${option}>${img}</button>`
        }
        table += `</div>`
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
        if (branch.length > 0 && tmp.supernova.tree_unlocked[id]) for (let y in branch) if (tmp.supernova.tree_unlocked[branch[y]]) {
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

const TREE_ANIM = ["Circle", "Square", "OFF"]
const CR = 5
const SR = 7.0710678118654755

function drawTreeBranch(num1, num2) {
    var start = document.getElementById("treeUpg_"+num1).getBoundingClientRect();
    var end = document.getElementById("treeUpg_"+num2).getBoundingClientRect();
    var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft) - (window.innerWidth-tree_canvas.width)/2;
    var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop) - (window.innerHeight-tree_canvas.height-7);
    var x2 = end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft) - (window.innerWidth-tree_canvas.width)/2;
    var y2 = end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop) - (window.innerHeight-tree_canvas.height-7);
    tree_ctx.lineWidth=10;
    tree_ctx.beginPath();
    tree_ctx.strokeStyle = hasTreeUpg(num2)?"#00520b":tmp.supernova.tree_afford[num2]?"#fff":"#333";
    tree_ctx.moveTo(x1, y1);
    tree_ctx.lineTo(x2, y2);
    tree_ctx.stroke();

    if (player.options.tree_animation != 2) {
        tree_ctx.fillStyle = player.supernova.tree.includes(num2)?"#4b0":"#444";
        let tt = [tmp.tree_time, (tmp.tree_time+1)%3, (tmp.tree_time+2)%3]
        for (let i = 0; i < 3; i++) {
            let [t, dx, dy] = [tt[i], x2-x1, y2-y1]
            let [x, y] = [x1+dx*t/3, y1+dy*t/3]
            tree_ctx.beginPath();
            if (player.options.tree_animation == 1) {
                let a = Math.atan2(y1-y2,dx)-Math.PI/4
                tree_ctx.moveTo(x+SR*Math.cos(a), y-SR*Math.sin(a))
                for (let j = 1; j <= 3; j++) tree_ctx.lineTo(x+SR*Math.cos(a+Math.PI*j/2), y-SR*Math.sin(a+Math.PI*j/2))
            } else if (player.options.tree_animation == 0) {
                tree_ctx.arc(x, y, CR, 0, Math.PI*2, true);
            }
            tree_ctx.fill();
        }
    }
}

function changeTreeAnimation() {
    player.options.tree_animation = (player.options.tree_animation + 1) % 3;
}

function updateTreeHTML() {
    let req = ""
	let perm = ""
    if (tmp.supernova.tree_choosed != "") {
		req = TREE_UPGS.ids[tmp.supernova.tree_choosed].req?`<span class="${TREE_UPGS.ids[tmp.supernova.tree_choosed].req()?"green":"red"}">${TREE_UPGS.ids[tmp.supernova.tree_choosed].reqDesc?" Require: "+(typeof TREE_UPGS.ids[tmp.supernova.tree_choosed].reqDesc == "function"?TREE_UPGS.ids[tmp.supernova.tree_choosed].reqDesc():TREE_UPGS.ids[tmp.supernova.tree_choosed].reqDesc):""}</span>`:""
		perm = TREE_UPGS.ids[tmp.supernova.tree_choosed].perm ? `<span class='yellow'> [Permanent]</span>` : ``
	}
    tmp.el.tree_desc.setHTML(
        tmp.supernova.tree_choosed == "" ? `<div style="font-size: 12px; font-weight: bold;"><span class="gray">(click any tree upgrade to show)</span></div>`
        : `<div style="font-size: 12px; font-weight: bold;"><span class="gray">(click again to buy if affordable)</span>${req}</div>
        <span class="sky">[${tmp.supernova.tree_choosed}] ${TREE_UPGS.ids[tmp.supernova.tree_choosed].desc}</span>${perm}<br>
        <span>Cost: ${format(TREE_UPGS.ids[tmp.supernova.tree_choosed].cost,2)} Neutron star</span><br>
        <span class="green">${TREE_UPGS.ids[tmp.supernova.tree_choosed].effDesc?"Currently: "+TREE_UPGS.ids[tmp.supernova.tree_choosed].effDesc(tmp.supernova.tree_eff[tmp.supernova.tree_choosed]):""}</span>
        `
    )
    for (let x = 0; x < tmp.supernova.tree_had.length; x++) {
        let id = tmp.supernova.tree_had[x]
        let unl = tmp.supernova.tree_unlocked[id]
        tmp.el["treeUpg_"+id].setVisible(unl)
        if (unl) tmp.el["treeUpg_"+id].setClasses({btn_tree: true, locked: !tmp.supernova.tree_afford[id], bought: hasTreeUpg(id), perm: hasTreeUpg(id) && TREE_UPGS.ids[id].perm, choosed: id == tmp.supernova.tree_choosed})
    }
}
