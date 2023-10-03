const UPGS = {
    mass: {
        cols: 4,
        1: {
            start: E(10),
            inc: E(1.5)
        },
        2: {
            start: E(20),
            inc: E(4)
        },
        3: {
            start: E(100),
            inc: E(9)
        },
        4: {
            start: E(1e100),
            inc: E(1.5)
        },
    },
    main: {
        temp() {
            tmp.upgs.unl = false
            for (let x = 1; x <= this.cols; x++) {
				let ut = tmp.upgs[x] = {}
                let unl = this[x].unl()
                if (!unl) continue

				tmp.upgs.unl = true
				for (let y = 1; y <= this[x].lens; y++) {
					let u = this[x][y]
					let unl = (u.unl ? u.unl() : true)
					ut[y] = { unl, has: unl && player.mainUpg[this.ids[x]].includes(y) }
					if (unl && u.effect) ut[y] = { ...ut[y], effect: u.effect() }
				}
            }
        },
        ids: [null, 'rp', 'bh', 'atom', 'br'],
        cols: 4,
        over(x,y) { tmp.upgs.msg = [x,y] },
        reset() { tmp.upgs.msg = [0,0] },
        1: {
            title: "Rage Upgrades",
            resName: "Rage Power",
            get res() { return player.rp.points },
            set res(x) { return player.rp.points = E(x) },
            unl() { return tmp.rp.unl },
            auto_unl() { return hasUpgrade("bh",4) || tmp.inf_unl },
            lens: 25,
            1: {
                desc: "Boosters add Musclers.",
                cost: E(1),
                effect: () => player.build.mass_2.amt.mul(2),
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Musclers"
                },
            },
            2: {
                desc: "Strongers add Boosters.",
                cost: E(2),
                effect: () => player.build.mass_3.amt.mul(2),
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Boosters"
                },
            },
            3: {
                desc: "You can automatically buy mass upgrades.",
                cost: E(30),
            },
            4: {
                desc: "Rank 4 reward is better.",
                cost: E(50),
            },
            5: {
                desc: "Double Rage Powers.",
                cost: E(100),
            },
            6: {
                desc: "You can automatically tier up.",
                cost: E(1e3),
            },
            7: {
                desc: "Tickspeed adds Stronger.",
                cost: E(1e4),
                effect() {
					let e38 = hasElement(38) ? elemEffect(38, E(0)) : E(0)
					let x = player.build.tickspeed.amt.div(3)
					if (hasAscension(0,1)) x = x.add(1).mul(e38.add(1))
					else x = x.add(e38)
					return x.floor()
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Stronger"
                },
            },
            8: {
                desc: "Super and Hyper mass upgrade scalings are weaker based on Rage Power.",
                cost: E(1e12),
                effect() {
                    let ret = E(0.9).pow(player.rp.points.max(1).log10().max(1).log10().pow(1.25).softcap(2.5,0.5,0))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(E(1).sub(x).mul(100))+"% weaker"+(x.log(0.9).gte(2.5)?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            9: {
                unl() { return FORMS.bh.unl() },
                desc: "Stronger power is increased by +^0.25.",
                cost: E(1e31),
            },
            10: {
                unl() { return FORMS.bh.unl() },
                desc: "Super Rank scaling is 20% weaker.",
                cost: E(1e43),
            },
            11: {
                unl() { return player.chal.unl },
                desc: "Black Hole mass's gain is boosted by Rage Powers.",
                cost: E(1e72),
                effect() {
                    let ret = player.rp.points.add(1).root(10).softcap('e4000',0.1,0)
                    return overflow(ret.softcap("e1.5e31",0.95,2),'ee185',0.5)
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+(x.gte("e4000")?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            12: {
                unl() { return player.chal.unl },
                desc: "OoMs of Rage powers increase stronger power at a reduced rate.",
                cost: E(1e120),
                effect() {
                    let ret = player.rp.points.max(1).log10().softcap(200,0.75,0).div(1000)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+^"+format(x)+(x.gte(0.2)?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            13: {
                unl() { return player.chal.unl },
                desc: "Mass gain softcap starts 3x later for every Rank you have.",
                cost: E(1e180),
                effect() {
                    let ret = E(3).pow(player.ranks.rank)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return formatMult(x)
                },
            },
            14: {
                unl() { return player.atom.unl },
                desc: "Hyper Tickspeed starts 50 later.",
                cost: E('e320'),
            },
            15: {
                unl() { return player.atom.unl },
                desc: "Mass boosts Atom gain.",
                cost: E('e480'),
                effect() {
                    let ret = player.mass.max(1).log10().pow(1.25)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return formatMult(x)
                },
            },
            16: {
                unl() { return tmp.moreUpgs || tmp.inf_unl },
                desc: `Remove tickspeed power's softcap.`,
                cost: E('e1.8e91'),
            },
            17: {
                unl() { return tmp.mass4Unl || tmp.inf_unl },
                desc: `Overpower power is increased by 0.005.`,
                cost: E('e7.75e116'),
            },
            18: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Fading matter's upgrade applies to rage powers gain at a reduce rate.`,
                cost: E('e1.5e128'),
                effect() {
                    let x = E(10).pow(tmp.matters.upg[12].eff.max(1).log10().pow(.8))
                    return overflow(x,1e20,0.5)
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            19: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Supernovas boost overpower power.`,
                cost: E('e6e144'),
                effect() {
                    let x = player.supernova.times.add(1).log10().div(10).add(1)
                    return x
                },
                effDesc(x=this.effect()) {
                    return formatMult(x)
                },
            },
            20: {
                unl() { return player.dark.exotic_atom.tier.gt(0) || tmp.inf_unl },
                desc: `Corrupted Shards boost normal mass gain.`,
                cost: E('e2e357'),
                effect() {
                    if (tmp.c16.in) return E(1)
                    let x = player.dark.c16.totalS.add(1)
                    return overflow(x,10,0.5).pow(2).overflow('e15000',0.25)
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            21: {
                unl() { return tmp.fifthRowUnl },
                desc: `Rage powers boost dark rays gain.`,
                cost: E('ee32200'),
                effect() {
                    let x = player.rp.points.add(10).log10()
                    return x
                },
                effDesc(x=this.effect()) {
                    return formatMult(x)
                },
            },
            22: {
                unl() { return tmp.fifthRowUnl },
                desc: `Rank Collapse starts later based on rage powers at an extremely reduced rate.`,
                cost: E('ee36000'),
                effect() {
                    let x = player.rp.points.add(1).log10().add(1).log10().add(1)
                    return x
                },
                effDesc(x=this.effect()) {
                    return formatMult(x)+" later"
                },
            },
            23: {
                unl() { return tmp.fifthRowUnl },
                desc: `Stronger Overflows are 15% weaker.`,
                cost: E('ee42000'),
            },
            24: {
                unl() { return tmp.fifthRowUnl },
                desc: `Mass Overflows are 20% weaker.`,
                cost: E('ee85000'),
            },
            25: {
                unl() { return tmp.fifthRowUnl },
                desc: `Rage Powers boost Infinity Points gain.`,
                cost: E('ee115500'),
                effect() {
                    let x = player.rp.points.add(1e10).log10().log10().pow(2.25)
                    return x
                },
                effDesc(x=this.effect()) {
                    return formatMult(x)
                },
            },
        },
        2: {
            title: "Black Hole Upgrades",
            resName: "Dark Matter",
            get res() { return player.bh.dm },
            set res(x) { return player.bh.dm = E(x) },
            unl() { return tmp.bh.unl },
            auto_unl() { return hasUpgrade("atom",2) || tmp.inf_unl },
            lens: 25,
            1: {
                desc: "Mass Upgrades no longer spend mass.",
                cost: E(1),
            },
            2: {
                unl() { return EVO.amt < 1 },
                desc: "Tickspeeds boost BH Condenser Power.",
                cost: E(10),
                effect() {
                    let ret = player.build.tickspeed.amt.add(1).root(8)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            3: {
                desc: "Super Mass Upgrade scales later based on mass of Black Hole.",
                cost: E(100),
                effect() {
                    let ret = player.bh.mass.max(1).log10().pow(1.5).softcap(100,1/3,0).floor()
                    return ret.min(400)
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" later"+(x.gte(100)?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            4: {
                desc: "You can automatically buy Rage Power upgrades.",
                cost: E(1e3),
            },
            5: {
                unl() { return EVO.amt < 1 },
                desc: "You can automatically buy tickspeed.",
                cost: E(1e4),
            },
            6: {
                desc: "Gain 100% of Rage Power gained from reset per second. Rage Powers are boosted by mass of Black Hole.",
                cost: E(1e5),
                effect() {
                    let ret = player.bh.mass.max(1).log10().add(1).pow(2)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            7: {
                unl() { return player.chal.unl },
                desc: "Mass gain softcap starts later based on mass of Black Hole.",
                cost: E(1e12),
                effect() {
                    let ret = player.bh.mass.add(1).root(3)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x later"
                },
            },
            8: {
                unl() { return player.chal.unl },
                desc: "Raise Rage Power gain by 1.15.",
                cost: E(1e14),
            },
            9: {
                unl() { return player.chal.unl },
                desc: "Stronger Effect's softcap starts later based on unspent Dark Matters.",
                cost: E(1e27),
                effect() {
                    let ret = player.bh.dm.max(1).log10().pow(0.5)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x)+" later"
                },
            },
            10: {
                unl() { return player.chal.unl },
                desc: "Mass gain is boosted by OoM of Dark Matters.",
                cost: E(1e33),
                effect() {
                    let ret = E(2).pow(player.bh.dm.add(1).log10().softcap(11600,0.5,0))
                    return ret.min('ee7000')
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+(x.max(1).log2().gte(11600)?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            11: {
                unl() { return player.atom.unl },
                desc: "Mass gain softcap is 10% weaker.",
                cost: E(1e80),
            },
            12: {
                unl() { return player.atom.unl && EVO.amt < 1 },
                desc: "Hyper Tickspeed scales 15% weaker.",
                cost: E(1e120),
            },
            13: {
                unl() { return player.atom.unl },
                desc: "Quark gain is multiplied by 10.",
                cost: E(1e180),
            },
            14: {
                unl() { return player.atom.unl },
                desc: "Neutron Powers boost mass of Black Hole gain.",
                cost: E(1e210),
                effect() {
                    let ret = player.atom.powers[1].add(1).pow(2)
                    return overflow(ret,'ee108',0.25).min(tmp.c16.in?'ee100':'ee110')
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            15: {
                unl() { return player.atom.unl },
                desc: "Atomic Powers add Black Hole Condensers at a reduced rate.",
                cost: E('e420'),
                effect() {
                    if (!tmp.atom.unl) return E(0)
                    return hasAscension(0,42) ? tmp.atom.atomicEff[0] : player.atom.atomic.add(1).log(5).softcap(2e9,0.25,0).softcap(1e10,0.1,0).floor()
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)
                },
            },
            16: {
                unl() { return tmp.moreUpgs || tmp.inf_unl },
                desc: `Red matter's upgrade applies to mass gain at a reduced rate.`,
                cost: E('e5e101'),
                effect() {
                    if (tmp.c16.in) return E(1)
                    let x = tmp.matters.upg[0].eff.max(1).pow(0.75)
                    return x.overflow('e1000',0.5)
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            17: {
                unl() { return tmp.moreUpgs || tmp.inf_unl },
                desc: `Violet matter's upgrade applies to collapsed stars at a reduced rate.`,
                cost: E('e4e113'),
                effect() {
                    let x = tmp.matters.upg[4].eff.max(1).log10().add(1).pow(2)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            18: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Make black hole's effect stronger.`,
                cost: E('e1.5e156'),
            },
            19: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Mass of black hole boosts accelerator power at an extremely reduced rate.`,
                cost: E('e3e201'),
                effect() {
                    let x = player.bh.mass.add(1).log10().add(1).log10().add(1).root(6)
                    return x
                },
                effDesc(x=this.effect()) {
                    return formatMult(x)
                },
            },
            20: {
                unl() { return player.dark.c16.first || tmp.inf_unl },
                desc: `Corrupted Shards boost mass of black hole gain.`,
                cost: E('ee273'),
                effect() {
                    if (tmp.c16.in) return E(1)
                    let x = player.dark.c16.totalS.add(1)
                    return overflow(x,10,0.5).pow(3).overflow('e12000',0.25)
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            21: {
                unl() { return tmp.fifthRowUnl },
                desc: `BH Condenser Siltation starts ^2 later to exponent.`,
                cost: E('ee52500'),
            },
            22: {
                unl() { return tmp.fifthRowUnl },
                desc: `Electron Powers boost Atomic Powers gain.`,
                cost: E('ee75000'),
                effect() {
                    let x = player.atom.powers[2].add(1).log10().add(1).log10().add(1).pow(1000)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            23: {
                unl() { return tmp.fifthRowUnl },
                desc: `Unstable Black Hole decreasing is 25% weaker.`,
                cost: E('ee162500'),
            },
            24: {
                unl() { return tmp.fifthRowUnl },
                desc: `Challenge 12's reward now multiplies each bonus radiation boosts.`,
                cost: E('ee236000'),
            },
            25: {
                unl() { return tmp.fifthRowUnl },
                desc: `Best mass of black hole in C16 boosts Infinity Points gain.`,
                cost: E('ee261500'),
                effect() {
                    let x = expMult(tmp.c16.best_bh_eff,0.4)
                    if (EVO.amt >= 1) x = x.pow(1.4)
                    return x
                },
                effDesc(x=this.effect()) {
                    return formatMult(x)
                },
            },
        },
        3: {
            title: "Atom Upgrades",
            resName: "Atom",
            get res() { return player.atom.points },
            set res(x) { return player.atom.points = E(x) },
            unl() { return player.atom.unl && EVO.amt < 3 },
            auto_unl() { return hasTree("qol1") || tmp.inf_unl },
            lens: 25,
            1: {
                desc: "Start with Mass upgrades unlocked.",
                cost: E(1),
            },
            2: {
                unl() { return EVO.amt < 2 },
                desc: "You can automatically buy BH Condenser and upgrades. Tickspeed no longer spends Rage Powers.",
                cost: E(100),
            },
            3: {
                desc: "Unlock Tetr. Keep BH Upgrade 6 on Atomic.",
                cost: E(1e4),
            },
            4: {
                unl() { return EVO.amt < 2 },
                desc: "Keep Challenges 1-4 and automate Tetr. BH Condensers add Cosmic Ray Power.",
                cost: E(1e9),
                effect() {
                    let ret = player.build.bhc.amt.pow(0.8).mul(0.01)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x)+"x"
                },
            },
            5: {
                desc: "Super Tier starts 10 later.",
                cost: E(1e16),
            },
            6: {
                get desc() { return `Gain 100% of Dark Matters gained from reset per second.` + (EVO.amt >= 2 ? "" : "Mass gain from Black Hole softcap starts later.") },
                get cost() { return EVO.amt >= 2 ? E(1e3) : E(1e18) },
                effect() {
                    if (EVO.amt < 2) return player.atom.atomic.add(1).pow(0.5)
                },
                effDesc(x=this.effect()) {
                    if (EVO.amt < 2) return format(x)+"x later"
                },
            },
            7: {
                unl() { return EVO.amt < 1 },
                desc: "Tickspeed boosts each particle powers gain.",
                cost: E(1e24),
                effect() {
                    let ret = E(1.025).pow(player.build.tickspeed.amt)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            8: {
                desc: "Atomic Powers boost Quark gain.",
                cost: E(1e31),
                effect() {
                    let ret = player.atom.atomic.max(1).log10().add(1)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            9: {
                desc: "Stronger softcap is 15% weaker.",
                cost: E(1e42),
            },
            10: {
                desc: "Tier requirement is halved. Hyper Rank starts later based on Tiers you have.",
                cost: E(5e47),
                effect() {
                    let ret = player.ranks.tier.mul(2).floor()
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" later"
                },
            },
            11: {
                unl() { return MASS_DILATION.unlocked() },
                desc: "Dilated mass also boosts BH Condenser & Cosmic Ray powers at a reduced rate.",
                cost: E('e1640'),
                effect() {
                    let ret = player.md.mass.max(1).log10().add(1).pow(0.1)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            12: {
                unl() { return MASS_DILATION.unlocked() },
                get desc() { return EVO.amt >= 2 ? "Wormhole effects are better." : "Mass from Black Hole effect is better." },
                cost: E('e2015'),
            },
            13: {
                unl() { return (brokeDil() && player.qu.rip.active) || hasElement(128) },
                desc: "Cosmic Ray effect softcap starts x10 later.",
                cost: E('e3.2e11'),
            },
            14: {
                unl() { return (brokeDil() && player.qu.rip.active) || hasElement(128) },
                desc: "Tickspeed, Black Hole Condenser and Cosmic Ray scalings up to Meta start x10 later.",
                cost: E('e4.3e13'),
            },
            15: {
                unl() { return (brokeDil() && player.qu.rip.active) || hasElement(128) },
                desc: "Reduce Cosmic Ray scaling by 20%.",
                cost: E('e3.4e14'),
            },
            16: {
                unl() { return tmp.moreUpgs || tmp.inf_unl },
                desc: `Quark Overflow starts ^10 later.`,
                cost: E('e3e96'),
            },
            17: {
                unl() { return tmp.moreUpgs || tmp.inf_unl },
                desc: `Pink matter's upgrade applies to quark gain at a reduced rate.`,
                cost: E('e7.45e98'),
                effect() {
                    let x = tmp.matters.upg[2].eff.max(1).log10().add(1)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            18: {
                unl() { return (tmp.mass4Unl || tmp.inf_unl) && EVO.amt < 2 },
                desc: `Neutron Power's second effect now provides an expontial boost and applies to mass of black hole.`,
                cost: E('e4.2e120'),
            },
            19: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Yellow matter's upgrade applies to dilated mass overflow at a reduced rate.`,
                cost: E('e8e139'),
                effect() {
                    let x = expMult(tmp.matters.upg[9].eff,1/3)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)+" later"
                },
            },
            20: {
                unl() { return player.dark.c16.first || tmp.inf_unl },
                desc: `Atomic Powers add Overpowers at an extremely reduced rate.`,
                cost: E('e2.7e186'),
                effect() {
                    let x = player.atom.atomic.add(1).log10().add(1).log10().root(2)
                    if (hasUpgrade('br',23)) x = x.pow(2)
                    return overflow(x,10,0.5).floor()
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)
                },
            },
            21: {
                unl() { return tmp.fifthRowUnl },
                desc: `The exponent of any particle powers is raised by 5.`,
                cost: E('ee13950'),
            },
            22: {
                unl() { return tmp.fifthRowUnl },
                desc: `Remove the softcaps of Star Booster's power and effect.`,
                cost: E('ee19750'),
            },
            23: {
                unl() { return tmp.fifthRowUnl },
                desc: `Atom Upgrade 20 is slightly stronger.`,
                cost: E('ee54000'),
            },
            24: {
                unl() { return tmp.fifthRowUnl && EVO.amt < 2 },
                desc: `Star Siltation starts ^2 later to exponent.`,
                cost: E('ee87000'),
            },
            25: {
                unl() { return tmp.fifthRowUnl },
                desc: `Dimensional Mass boosts Infinity Points gain.`,
                cost: E('ee111111'),
                effect() {
                    let x = player.inf.dim_mass.add(10).log10().pow(2.7)
                    if (EVO.amt >= 1) x = x.pow(1.4)
                    return x
                },
                effDesc(x=this.effect()) {
                    return formatMult(x)
                },
            },
        },
        4: {
            title: "Big Rip Upgrades",
            resName: "Death Shard",
            get res() { return player.qu.rip.amt },
            set res(x) { return player.qu.rip.amt = E(x) },
            unl() { return EVO.amt < 5 && player.qu.rip.first },
            auto_unl() { return hasElement(132) || tmp.inf_unl },
            lens: 25,
            1: {
                get desc() { return `Keep ${EVO.amt >= 4 ? "Trinilpentium-305" : "Hydrogen-1"}.` },
                cost: E(5),
            },
            2: {
                desc: `Mass Upgrades & Ranks are no longer nerfed by 8th QC modifier.`,
                cost: E(10),
            },
            3: {
                desc: `Pre-Quantum Global Speed is raised based on Death Shards (before division).`,
                cost: E(20),
                effect() {
                    let x = player.qu.rip.amt.add(1).log10().div(25).add(1)
                    return x.softcap(30,0.5,0)
                },
                effDesc(x=this.effect()) { return "^"+format(x)+x.softcapHTML(30) },
            },
            4: {
                desc: `Start with 2 tiers of each Fermion in Big Rip.`,
                cost: E(100),
            },
            5: {
                desc: `Root Star Booster’s starting cost by 10. Star Booster’s base is increased based on Death Shards.`,
                cost: E(1000),
                effect() {
                    let x = player.qu.rip.amt.add(1).log10().add(1).pow(3)
                    return x
                },
                effDesc(x=this.effect()) { return formatMult(x) },
            },
            6: {
                desc: `Start with all Radiation features unlocked.`,
                cost: E(5000),
            },
            7: {
                desc: `Hybridized Uran-Astatine is twice as effective in Big Rip.`,
                cost: E(100000),
            },
            8: {
                desc: `Passively gain 10% of Quantum Foams & Death Shards you would get from resetting each second.`,
                cost: E(750000),
            },
            9: {
                desc: `Unlock Break Dilation and Prestige (in the mass tab).`,
                cost: E(1e7),
            },
            10: {
                unl() { return brokeDil() || tmp.inf_unl || EVO.amt >= 3 },
                desc: `Chromas are 10% stronger.`,
                cost: E(2.5e8),
            },
            11: {
                unl() { return brokeDil() || tmp.inf_unl || EVO.amt >= 3 },
                desc: `Prestige no longer resets anything.`,
                cost: E(1e10),
            },
            12: {
                unl() { return EVO.amt < 3 && (brokeDil() || tmp.inf_unl) },
                desc: `Mass gain softcap^5 starts later based on Atom.`,
                cost: E(1e16),
                effect() {
                    let x = player.atom.points.add(1).log10().add(1).log10().add(1).root(3)
                    return x
                },
                effDesc(x=this.effect()) { return "^"+format(x)+" later" },
            },
            13: {
                unl() { return brokeDil() || tmp.inf_unl || EVO.amt >= 3 },
                desc: `Death Shard gain is boosted based on Prestige Base.`,
                cost: E(1e17),
                effect() {
                    let x = (tmp.prestiges.base||E(1)).add(1).log10().tetrate(1.5).add(1)
                    return x.min('e2.5e4')
                },
                effDesc(x=this.effect()) { return formatMult(x) },
            },
            14: {
                unl() { return brokeDil() || tmp.inf_unl || EVO.amt >= 3 },
                desc: `Super Fermion Tier starts 10 later (after QC8 nerf).`,
                cost: E(1e22),
            },
            15: {
                unl() { return brokeDil() || tmp.inf_unl || EVO.amt >= 3 },
                desc: `Blueprint Particles boost Pre-Quantum Global Speed slightly.`,
                cost: E(1e24),
            },
            16: {
                unl() { return tmp.moreUpgs || tmp.inf_unl },
                desc: `Unsoftcap the first effect from Alpha, Omega & Sigma particles. They're stronger.`,
                cost: E(1e273),
            },
            17: {
                unl() { return EVO.amt < 2 && (tmp.mass4Unl || tmp.inf_unl) },
                desc: `Dark matter raises atoms gain at a reduced rate.`,
                cost: E('e386'),
                effect() {
                    let x = Decimal.pow(1.1,player.bh.dm.add(1).log10().add(1).log10())
                    return x
                },
                effDesc(x=this.effect()) { return "^"+format(x) },
            },
            18: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Chromas gain is boosted by mass.`,
                cost: E('e408'),
                effect() {
                    let x = Decimal.pow(2,player.mass.add(1).log10().add(1).log10().pow(1.5))
                    return x
                },
                effDesc(x=this.effect()) { return formatMult(x) },
            },
            19: {
                unl() { return tmp.brUnl || tmp.inf_unl },
                desc: `Red Matters reduce Pre-Renown requirements slightly.`,
                cost: E('e463'),
                effect() {
                    let x = player.dark.matters.amt[0].add(1).log10().add(1).log10().add(1).log10().div(60).add(1)
                    if (hasAscension(0,3)) x = x.pow(2)
                    if (hasAscension(0,33)) x = x.pow(2)
                    return x
                },
                effDesc(x=this.effect()) { return formatMult(x)+" cheaper" },
            },
            20: {
                unl() { return player.dark.c16.first || tmp.inf_unl },
                desc: `Total corrupted Shards boost dark rays gain.`,
                cost: E('e784'),
                effect() {
                    let x = player.dark.c16.totalS.add(1)
                    return overflow(x,10,0.5).pow(1.25)
                },
                effDesc(x=this.effect()) {
                    return formatMult(x)
                },
            },
            21: {
                unl() { return tmp.fifthRowUnl },
                desc: `Pre-Infinity Global Speed is raised based on Death Shards at an extremely reduced rate (before division).`,
                cost: E('e67800'),
                effect() {
                    let x = player.qu.rip.amt.add(1).log10().root(3).div(100).add(1)
                    return x
                },
                effDesc(x=this.effect()) { return "^"+format(x) },
            },
            22: {
                unl() { return tmp.fifthRowUnl },
                desc: `Beta Particles's effect is now changed.`,
                cost: E('e74000'),
            },
            23: {
                unl() { return tmp.fifthRowUnl },
                desc: `Quantum Shard's effect now affects death shards at a reduced rate.`,
                cost: E('e80000'),
                effect() {
                    let x = tmp.qu.qc.s_eff.max(1).root(5)
                    return x
                },
                effDesc(x=this.effect()) {
                    return formatMult(x)
                },
            },
            24: {
                unl() { return tmp.fifthRowUnl },
                desc: `Break Dilation Upgrade 5 is overpowered.`,
                cost: E('e690000'),
            },
            25: {
                unl() { return tmp.fifthRowUnl },
                desc: `The softcaps of corrupted shards gain are slightly weaker.`,
                cost: E('e791500'),
            },
        },
    },
}

function canGetUpgrade(id,x) {
	let idx = UPGS.main.ids.indexOf(id), ud = UPGS.main[idx], ut = tmp.upgs[idx][x]
	return ut?.unl && !ut.has && ud.res.gte(ud[x].cost)
}
function buyUpgrade(id,x) {
	if (!canGetUpgrade(id,x)) return
	let idx = UPGS.main.ids.indexOf(id), ud = UPGS.main[idx], ut = tmp.upgs[idx][x]
	ut.has = true
	ud.res = ud.res.sub(ud[x].cost)
	player.mainUpg[id].push(x)
}
function hasUpgrade(id,x) { return tmp.upgs[UPGS.main.ids.indexOf(id)]?.[x]?.has }
function upgEffect(id,x,def=E(1)) { return tmp.upgs[id][x]?tmp.upgs[id][x].effect:def }
function resetMainUpgs(id,keep=[]) {
    let k = []
    let id2 = UPGS.main.ids[id], ut = tmp.upgs[id]
    for (let x of player.mainUpg[id2]) {
		if (keep.includes(x)) k.push(x)
		else if (ut !== undefined) ut[x].has = false
	}
    player.mainUpg[id2] = k
}

//Upgrade Notifications
function updateUpgNotify() {
	delete tmp.upg_notify
	if (!isPreferred("notify")) return

	if (tmp.sn.unl) {
		for (var [x, af] of Object.entries(tmp.sn.tree_afford)) {
			if (!af || !tmp.sn.tree_had.includes(x)) continue
			tmp.upg_notify = ["sn", x]
			return
		}
	}
	if ((player.atom.unl || OURO.unl) && !hasZodiacUpg("aries", "u3")) {
		for (var x = 0; x < 2; x++) {
			for (var y = 1; y <= tmp.elements.unl_length[x]; y++) {
				if (!ELEMENTS.canBuy(y, x)) continue
				tmp.upg_notify = ["el", x, y]
				return
			}
		}
	}
	if (EVO.amt >= 4 && player.evo.const.tier) {
		for (var [i, can] of Object.entries(tmp.evo.zodiac.can)) {
			if (!can) continue
			tmp.upg_notify = ["zd"].concat(i.split("-"))
			return
		}
	}
	if (player.dark.c16.first) {
		for (var [i, ch] of Object.entries(CHARGERS)) {
			i = parseInt(i)
			if (hasCharger(i)) continue
			if (!canCharge(i)) continue
			if (player.dark.c16.shard.lt(ch.cost)) continue
			tmp.upg_notify = ["ch", i+1]
			return
		}
	}
}

function goUpgNotify() {
	if (!tmp.upg_notify) return
	if (tmp.upg_notify[0] == "sn") {
		goToTab("sn-tree")
		tmp.sn.tree_tab = tmp.sn.tree_loc[tmp.upg_notify[1]]
		tmp.sn.tree_choosed = tmp.upg_notify[1]
	}
	if (tmp.upg_notify[0] == "el") {
		goToTab("elements")
		if (tmp.upg_notify[1] != player.atom.elemLayer) changeElemLayer()

		let tier = 0
		while (tmp.upg_notify[2] > ELEMENTS.exp[tier]) tier++
		player.atom.elemTier[player.atom.elemLayer] = tier
		updateElementsHTML()
	}
	if (tmp.upg_notify[0] == "ch") goToTab("c16")
	if (tmp.upg_notify[0] == "zd") {
		goToTab("constellation")
		zodiac_tab = tmp.upg_notify[1]
	}
}