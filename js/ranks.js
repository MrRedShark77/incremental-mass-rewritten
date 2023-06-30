const RANKS = {
    names: ['rank', 'tier', 'tetr', 'pent', 'hex'],
    fullNames: ['Rank', 'Tier', 'Tetr', 'Pent', 'Hex'],
    reset(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].add(1)
            let reset = true
            if (tmp.chal14comp || tmp.inf_unl) reset = false
            else if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            else if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            else if (type == "tetr" && hasTree("qol5")) reset = false
            else if (type == "pent" && hasTree("qol8")) reset = false
            if (reset) this.doReset[type]()
            updateRanksTemp()

            addQuote(1)
        }
    },
    bulk(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].max(tmp.ranks[type].bulk.max(player.ranks[type].add(1)))
            let reset = true
            if (tmp.chal14comp || tmp.inf_unl) reset = false
            if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            else if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            else if (type == "tetr" && hasTree("qol5")) reset = false
            else if (type == "pent" && hasTree("qol8")) reset = false
            if (reset) this.doReset[type]()
            updateRanksTemp()
        }
    },
    unl: {
        tier() { return player.ranks.rank.gte(3) || player.ranks.tier.gte(1) || player.mainUpg.atom.includes(3) || tmp.radiation.unl || tmp.inf_unl },
        tetr() { return player.mainUpg.atom.includes(3) || tmp.radiation.unl || tmp.inf_unl },
        pent() { return tmp.radiation.unl || tmp.inf_unl },
        hex() { return tmp.chal13comp || tmp.inf_unl },
    },
    doReset: {
        rank() {
            player.mass = E(0)
            for (let x = 1; x <= UPGS.mass.cols; x++) if (player.massUpg[x]) player.massUpg[x] = E(0)
        },
        tier() {
            player.ranks.rank = E(0)
            this.rank()
        },
        tetr() {
            player.ranks.tier = E(0)
            this.tier()
        },
        pent() {
            player.ranks.tetr = E(0)
            this.tetr()
        },
        hex() {
            player.ranks.pent = E(0)
            this.pent()
        },
    },
    autoSwitch(rn) { player.auto_ranks[rn] = !player.auto_ranks[rn] },
    autoUnl: {
        rank() { return player.mainUpg.rp.includes(5) || tmp.inf_unl },
        tier() { return player.mainUpg.rp.includes(6) || tmp.inf_unl },
        tetr() { return player.mainUpg.atom.includes(5) || tmp.inf_unl },
        pent() { return hasTree("qol8") || tmp.inf_unl },
        hex() { return true },
    },
    desc: {
        rank: {
            '1': "unlock mass upgrade 1.",
            '2': "unlock mass upgrade 2, reduce mass upgrade 1 scaling by 20%.",
            '3': "unlock mass upgrade 3, reduce mass upgrade 2 scaling by 20%, and mass upgrade 1 boosts itself.",
            '4': "reduce mass upgrade 3 scaling by 20%.",
            '5': "mass upgrade 2 boosts itself.",
            '6': "boost mass gain by (x+1)^2, where x is rank.",
            '13': "triple mass gain.",
            '14': "double Rage Powers gain.",
            '17': "Rank 6 reward effect is better. [(x+1)^2 -> (x+1)^x^1/3]",
            '34': "mass upgrade 3 softcaps 1.2x later.",
            '40': "adds tickspeed power based on ranks.",
            '45': "rank boosts Rage Powers gain.",
            '90': "rank 40 reward is stronger.",
            '180': "mass gain is raised by 1.025.",
            '220': "rank 40 reward is overpowered.",
            '300': "rank multiplies quark gain.",
            '380': "rank multiplies mass gain.",
            '800': "make mass gain softcap 0.25% weaker based on rank, hardcaps at 25%.",
        },
        tier: {
            '1': "reduce rank requirements by 20%.",
            '2': "raise mass gain by 1.15",
            '3': "reduce all mass upgrade scalings by 20%.",
            '4': "adds +5% tickspeed power for every tier you have, softcaps at +40%.",
            '6': "boost rage powers based on tiers.",
            '8': "Tier 6's reward is boosted based on dark matters.",
            '12': "Tier 4's reward is twice as effective and the softcap is removed.",
            '30': "stronger effect's softcap is 10% weaker.",
            '55': "make rank 380's effect stronger based on tier.",
            '100': "Super Tetr scales 5 later.",
        },
        tetr: {
            '1': "reduce tier requirements by 25%, and hyper rank scaling is 15% weaker.",
            '2': "mass upgrade 3 boosts itself.",
            '3': "raise tickspeed effect by 1.05.",
            '4': "Super rank scaling is weaker based on tier, and super tier scales 20% weaker.",
            '5': "Hyper/Ultra Tickspeed starts later based on tetr.",
            '8': "Mass gain softcap^2 starts ^1.5 later.",
        },
        pent: {
            '1': "reduce tetr requirements by 15%, and Meta-Rank starts 1.1x later.",
            '2': "tetr boosts all radiations gain.",
            '4': "Meta-Tickspeeds start later based on Supernovas.",
            '5': "Meta-Ranks start later based on Pent.",
            '8': "Mass gain softcap^4 starts later based on Pent.",
            '15': "remove 3rd softcap of Stronger's effect.",
        },
        hex: {
            '1': "reduce pent reqirements by 20%.",
            '4': "increase dark ray gain by +20% per hex.",
            '6': "remove first softcap of normal mass gain.",
            '10': "remove second softcap of normal mass gain.",
            '13': "remove third softcap of normal mass gain.",
            '17': "remove fourth softcap of normal mass gain.",
            '36': "remove fifth softcap of normal mass gain.",
            '43': "hex 4's effect is overpowered.",
            '48': "remove sixth softcap of normal mass gain.",
            '62': "remove seventh softcap of normal mass gain.",
            '91': "+0.15 to matter exponents.",
            '157': "remove eighth softcap of normal mass gain.",
        },
    },
    effect: {
        rank: {
            '3'() {
                let ret = E(player.massUpg[1]||0).div(20)
                return ret
            },
            '5'() {
                let ret = E(player.massUpg[2]||0).div(40)
                return ret
            },
            '6'() {
                let ret = player.ranks.rank.add(1).pow(player.ranks.rank.gte(17)?player.ranks.rank.add(1).root(3):2)
                return ret
            },
            '40'() {
                let ret = player.ranks.rank.root(2).div(100)
                if (player.ranks.rank.gte(90)) ret = player.ranks.rank.root(1.6).div(100)
                if (player.ranks.rank.gte(220)) ret = player.ranks.rank.div(100)
                return ret
            },
            '45'() {
                let ret = player.ranks.rank.add(1).pow(1.5)
                return ret
            },
            '300'() {
                let ret = player.ranks.rank.add(1)
                return ret
            },
            '380'() {
                let ret = E(10).pow(player.ranks.rank.sub(379).pow(1.5).pow(player.ranks.tier.gte(55)?RANKS.effect.tier[55]():1).softcap(1000,0.5,0))
                return ret
            },
            '800'() {
                let ret = E(1).sub(player.ranks.rank.sub(799).mul(0.0025).add(1).softcap(1.25,0.5,0).sub(1)).max(0.75)
                return ret
            },
        },
        tier: {
            '4'() {
                let ret = E(0)
                if (player.ranks.tier.gte(12)) ret = player.ranks.tier.mul(0.1)
                else ret = player.ranks.tier.mul(0.05).add(1).softcap(1.4,0.75,0).sub(1)
                return ret
            },
            '6'() {
                let ret = E(2).pow(player.ranks.tier)
                if (player.ranks.tier.gte(8)) ret = ret.pow(RANKS.effect.tier[8]())
                return overflow(ret,'ee100',0.5)
            },
            '8'() {
                let ret = player.bh.dm.max(1).log10().add(1).root(2)
                return ret
            },
            '55'() {
                let ret = player.ranks.tier.max(1).log10().add(1).root(4)
                return ret
            },
        },
        tetr: {
            '2'() {
                let ret = E(player.massUpg[3]||0).div(400)
                if (ret.gte(1) && hasPrestige(0,15)) ret = ret.pow(1.5)
                return ret
            },
            '4'() {
                let ret = E(0.96).pow(player.ranks.tier.pow(1/3))
                return ret
            },
            '5'() {
                let ret = player.ranks.tetr.pow(4).softcap(1000,0.25,0)
                return ret
            },
        },
        pent: {
            '2'() {
                let ret = E(1.3).pow(player.ranks.tetr.softcap(12e10,0.1,0))
                return ret
            },
            '4'() {
                let ret = player.supernova.times.add(1).root(5)
                return ret
            },
            '5'() {
                let ret = E(1.05).pow(player.ranks.pent.min(1500))
                return ret
            },
            '8'() {
                let ret = E(1.1).pow(player.ranks.pent)
                return ret
            },
        },
        hex: {
            '4'() {
                let hex = player.ranks.hex
                let ret = hex.mul(.2).add(1)
                if (hex.gte(43)) ret = ret.pow(hex.div(10).add(1).root(2))
                return overflow(ret,1e11,0.5)
            },
        },
    },
    effDesc: {
        rank: {
            3(x) { return "+"+format(x) },
            5(x) { return "+"+format(x) },
            6(x) { return format(x)+"x" },
            40(x) {  return "+"+format(x.mul(100))+"%" },
            45(x) { return format(x)+"x" },
            300(x) { return format(x)+"x" },
            380(x) { return format(x)+"x" },
            800(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
        },
        tier: {
            4(x) { return "+"+format(x.mul(100))+"%" },
            6(x) { return format(x)+"x" },
            8(x) { return "^"+format(x) },
            55(x) { return "^"+format(x) },
        },
        tetr: {
            2(x) { return "+"+format(x) },
            4(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
            5(x) { return "+"+format(x,0)+" later" },
        },
        pent: {
            2(x) { return format(x)+"x" },
            4(x) { return format(x)+"x later" },
            5(x) { return format(x)+"x later" },
            8(x) { return "^"+format(x)+" later" },
        },
        hex: {
            4(x) { return format(x,1)+"x" },
        },
    },
    fp: {
        rank() {
            let f = E(1)
            if (player.ranks.tier.gte(1)) f = f.mul(1/0.8)
            if (!hasCharger(3)) f = f.mul(tmp.chal.eff[5].pow(-1))
            return f
        },
        tier() {
            let f = E(1)
            f = f.mul(tmp.fermions.effs[1][3])
            if (player.ranks.tetr.gte(1)) f = f.mul(1/0.75)
            if (player.mainUpg.atom.includes(10)) f = f.mul(2)
            return f
        },
    },
}

const CORRUPTED_PRES = [
    [10,40],
]

const PRESTIGES = {
    names: ['prestige','honor','glory','renown','valor'],
    fullNames: ["Prestige Level", "Honor", 'Glory', 'Renown','Valor'],
    baseExponent() {
        let x = 0
        if (hasElement(100)) x += tmp.elements.effect[100]
        if (hasPrestige(0,32)) x += prestigeEff(0,32,0)
        x += tmp.fermions.effs[1][6]||0
        x += glyphUpgEff(10,0)
        if (tmp.inf_unl) x += theoremEff('mass',3,0)
        x += 1

        if (hasBeyondRank(4,2)) x *= beyondRankEffect(4,2)
        if (tmp.c16active || player.dark.run.active) x /= mgEff(5)
        return x
    },
    base() {
        let x = E(1)

        for (let i = 0; i < RANKS.names.length; i++) {
            let r = player.ranks[RANKS.names[i]]
            let br = E(tmp.beyond_ranks.max_tier)
        if (hasPrestige(0,18) && i == 0) r = r.mul(2)
        if (hasBeyondPres(1,2)) x = x.add(br).mul(r.add(1))
           else x = x.mul(r.add(1))
        }

        if (tmp.dark.abEff.pb) x = x.mul(tmp.dark.abEff.pb)

        if (hasBeyondRank(2,1)) x = x.mul(beyondRankEffect(2,1))
        if (player.chal.comps[17].gte(1)) x=hasTree('glx4')?x.mul(player.chal.comps[17].mul(5.15).pow(10.5).add(1)):x.mul(player.chal.comps[17].mul(2.15).pow(10.5).add(1).softcap(1e13,0.15,0))

        return x.sub(1)
    },
    req(i) {
        let x = EINF, fp = this.fp(i), y = player.prestiges[i]
        let ifp = E(1)
        if (tmp.inf_unl) ifp = ifp.mul(theoremEff('mass',4))
        switch (i) {
            case 0:
                x = Decimal.pow(1.1,y.scaleEvery('prestige',false,[0,0,0,fp]).pow(1.1)).mul(2e13)
                break;
            case 1:
                x = y.div(fp).scaleEvery('honor',false).pow(1.25).mul(3).add(4)
                break;
            case 2:
                x = hasElement(167)?y.div(fp).scaleEvery('glory',false).pow(1.25).mul(3.5).add(5):y.pow(1.3).mul(4).add(6)
                break;
            case 3:
                x = y.div(fp).scaleEvery('renown',false).pow(1.25).mul(3).add(9)
                break;
                case 4:
                    x = y.div(fp).scaleEvery('valor',false).pow(1.15).mul(6).add(14)
                    break;
            default:
                x = EINF
                break;
        }
        return x.ceil()
    },
    bulk(i) {
        let x = E(0), y = i==0?tmp.prestiges.base:player.prestiges[i-1], fp = this.fp(i)
        let ifp = E(1)
        switch (i) {
            case 0:
                if (y.gte(2e13)) x = y.div(2e13).max(1).log(1.1).max(0).root(1.1).scaleEvery('prestige',true,[0,0,0,fp]).add(1)
                break;
            case 1:
                if (y.gte(4)) x = y.sub(4).div(3).max(0).root(1.25).scaleEvery('honor',true).mul(fp).add(1)
                break
            case 2:
                if (y.gte(6)) x = hasElement(167)?y.sub(5).div(3.5).max(0).root(1.25).scaleEvery('glory',true).mul(fp).add(1):y.sub(6).div(4).max(0).root(1.3).mul(fp).add(1)
                break
            case 3:
                if (y.gte(9)) x = y.sub(9).div(3).max(0).root(1.25).scaleEvery('renown',true).mul(fp).add(1)
                break 
            case 4:
                if (y.gte(14)) x = y.sub(14).div(6).max(0).root(1.15).scaleEvery('valor',true).mul(fp).add(1)
                break 
            default:
                x = E(0)
                break;
        }
        return x.floor()
    },
    fp(i) {
        let fp = 1
        if (player.prestiges[2].gte(1) && i < 2) fp *= 1.15
        if (player.prestiges[3].gte(1) && i < 3) fp *= 1.1
        if (hasUpgrade('br',19) && i < 3) fp *= upgEffect(4,19)
        if (tmp.inf_unl) fp *=(theoremEff('mass',4))
        return fp
    },
    unl: [
        ()=>true,
        ()=>true,
        ()=>tmp.chal14comp||tmp.inf_unl,
        ()=>tmp.brUnl||tmp.inf_unl,
        ()=>hasElement(255),
    ],
    noReset: [
        ()=>hasUpgrade('br',11)||tmp.inf_unl,
        ()=>tmp.chal13comp||tmp.inf_unl,
        ()=>tmp.chal15comp||tmp.inf_unl,
        ()=>tmp.inf_unl,
        ()=>player.prestiges[4].gte(2)||tmp.ascensions_unl,
    ],
    autoUnl: [
        ()=>tmp.chal13comp||tmp.inf_unl,
        ()=>tmp.chal14comp||tmp.inf_unl,
        ()=>tmp.chal15comp||tmp.inf_unl,
        ()=>tmp.inf_unl,
        ()=>player.prestiges[4].gte(2)||tmp.ascensions_unl
    ],
    autoSwitch(x) { player.auto_pres[x] = !player.auto_pres[x] },
    rewards: [
        {
            "1": `All Mass softcaps up to ^5 start ^10 later.`,
            "2": `Quantum Shard Base is increased by 0.5.`,
            "3": `Quadruple Quantum Foam and Death Shard gain.`,
            "5": `Pre-Quantum Global Speed is raised by ^2 (before division).`,
            "6": `Tickspeed Power softcap starts ^100 later.`,
            "8": `Mass softcap^5 starts later based on Prestige.`,
            "10": `Gain more Relativistic Energy based on Prestige.`,
            "12": `Stronger Effect's softcap^2 is 7.04% weaker.`,
            "15": `Tetr 2's reward is overpowered.`,
            "18": `Rank’s effect on Prestige Base is doubled.`,
            "24": `Super Cosmic Strings scale 20% weaker.`,
            "28": `Remove all softcaps from Gluon Upgrade 4's effect.`,
            "32": `Prestige Base’s exponent is increased based on Prestige Level.`,
            "40": `Chromium-24 is slightly stronger.`,
            "70": `Lawrencium-103 is slightly stronger.`,
            "110": `Ununennium-119 is slightly stronger.`,
            "190": `Zirconium-40 is slightly stronger.`,
            "218": `Unquadpentium-145 is slightly stronger.`,
            "233": `Red Matter boosts Dark Ray.`,
            "382": `Matter exponent is increased by prestige level. Collapsed star's effect is overpowered.`,
            "388": `Hybridized Uran-Astatine also applies to pre-Meta pre-Glory at a reduced rate.`,
            "552": `Exotic supernova starts x1.25 later.`,
            "607": `Chromas gain is increased by prestige base.`,
            "651": `Hyper Hex starts x1.33 later.`,
            "867": `Lithium-3 now provides an exponential boost. Meta-Cosmic Ray scaling starts ^8 later.`,
            "1337": `Pre-Quantum Global Speed boosts matter exponent at a reduced rate. Prestige Level 382 is stronger.`,
        },
        {
            "1": `All-star resources are squared.`,
            "2": `Meta-Supernova starts 100 later.`,
            "3": `Bosonic resources are boosted based on Prestige Base.`,
            "4": `Gain 5 free levels of each Primordium Particle.`,
            "5": `Pent 5's reward is stronger based on Prestige Base.`,
            "7": `Quarks are boosted based on Honor.`,
            "15": `Super & Hyper cosmic strings scale weaker based on Honor.`,
            "22": `Raise dark shadow gain by 1.1.`,
            "33": `Hybridized Uran-Astatine applies to pre-Meta Pent requirements at a reduced rate.`,
            "46": `Add 500 more C13-15 max completions.`,
            "66": `All Fermions' scaling is 20% weaker.`,
            "91": `FSS base is raised to the 1.05th power.`,
            "127": `Remove all pre-Exotic scalings from Rank & Tier, but nullify C5's reward and Hybridized Uran-Astatine’s first effect for Rank & Tier.`,
            "139": `Matters' production is tripled every FSS. FV Manipulator's cost is slightly weaker.`,
            "167": `Abyssal Blot's fourth reward is raised by FSS.`,
            "247": `Muon's production is increased by MCF tier.`,
            "300": `Softcaps of Meta-Quark and Meta-Lepton are slightly weaker.`,
            400: `Each particle power's 1st effect is stronger.`,
            510: `Raise Kaon & Pion gains to the 1.1th power.`,
            950: `Bitripentium-235 is raised to the 1.25th power.`,
        },
        {
            "1": `The requirement for prestige levels & honors are 15% lower.`,
            "3": `Break dilation upgrade 12 is cheaper.`,
            "4": `Unlock new effect for Hybridized Uran-Astatine.`,
            "5": `Glory boosts glyphic mass.`,
            "8": `Glory reduces Black Hole Overflow nerf.`,
            "22": `Glory boosts all matters gain.`,
            "25": `Uncap pre-darkness challenges' completion cap. C7's reward is changed.`,
            "28": `FV Manipulator Power is boosted by Honor.`,
            "34": `Pions boost Kaons gain at a reduced rate.`,
            "40": `[ct4]'s effect is better.`,
            45: `Unstable BH affects mass of black hole overflow^2 starting.`,
        },
        {
            "1": `The requirements for previous prestiges are 10% lower.`,
            "2": `Exotic Supernova starts x1.25 later every Renown.`,
            "4": `Corrupted shard gain is increased by +50% per Renown.`,
            "6": `Exotic Atoms boost their other resources.`,
        },
        {
            "1": `Increase Newton Modificator Power is 1.25x stronger per Valor.`,
            "2": `Automate Valor and it doesnt reset anything.`,
            131: 'Hyper-Glory is 50% weaker.',
        },
    ],
    rewardEff: [
        {
            "8": [()=>{
                let x = player.prestiges[0].root(2).div(2).add(1)
                return x
            },x=>"^"+x.format()+" later"],
            "10": [()=>{
                let x = Decimal.pow(2,player.prestiges[0])
                return x
            },x=>x.format()+"x"],
            "32": [()=>{
                let x = player.prestiges[0].div(1e4).toNumber()
                return x
            },x=>"+^"+format(x)],
            "233": [()=>{
                let x = player.dark.matters.amt[0].add(1).log10().add(1).log10().add(1).pow(2)
                return x
            },x=>"x"+format(x)],
            "382": [()=>{
                let x = player.prestiges[0].max(0).root(2).div(1e3)
                if (hasPrestige(0,1337)) x = x.mul(10)
                return x.toNumber()
            },x=>"+"+format(x)],
            "388": [()=>{
                let x = tmp.qu.chroma_eff[1][1].root(2)
                return x
            },x=>formatReduction(x)+" weaker"],
            "607": [()=>{
                let x = tmp.prestiges.base.max(1).pow(1.5).softcap('e7500',0.1,0)
                return x
            },x=>"x"+format(x)+softcapHTML(x,'e7500')],
            "1337": [()=>{
                let x = tmp.preQUGlobalSpeed.max(1).log10().add(1).log10().div(10)
                return x.toNumber()
            },x=>"+"+format(x)],
            /*
            "1": [()=>{
                let x = E(1)
                return x
            },x=>{
                return x.format()+"x"
            }],
            */
        },
        {
            "3": [()=>{
                let x = tmp.prestiges.base.max(1).log10().div(10).add(1).root(2)
                return x
            },x=>"^"+x.format()],
            "5": [()=>{
                let x = tmp.prestiges.base.max(1).log10().div(10).add(1).root(3)
                return x
            },x=>"x"+x.format()],
            "7": [()=>{
                let x = player.prestiges[1].add(1).root(3)
                return x
            },x=>"^"+x.format()],
            "15": [()=>{
                let x = player.prestiges[1].root(1.5).div(10).add(1).pow(-1)
                return x
            },x=>formatReduction(x)+" weaker"],
            "33": [()=>{
                let x = tmp.qu.chroma_eff[1][0].max(1).log10().add(1).pow(2)
                return x
            },x=>"x"+x.format()+" later"],
            "139": [()=>{
                let x = Decimal.pow(3,player.dark.matters.final)
                return x
            },x=>"x"+x.format(0)],
            "247": [()=>{
                let x = Decimal.pow(player.dark.exotic_atom.tier+1,1.5)
                return x
            },x=>"x"+x.format()],
        },
        {
            "5": [()=>{
                let x = player.prestiges[2].root(2).div(10).add(1)
                return x.toNumber()
            },x=>"x"+format(x,2)],
            "8": [()=>{
                let x = player.prestiges[2].root(3).div(10).add(1).pow(-1)
                return x.toNumber()
            },x=>formatReduction(x)+" weaker"],
            "22": [()=>{
                let x = Decimal.pow(2,player.prestiges[2].pow(.5))
                return x
            },x=>"x"+format(x)],
            "28": [()=>{
                let x = player.prestiges[1].root(2).div(10).add(1)
                return x
            },x=>"x"+format(x)],
            "34": [()=>{
                let x = player.dark.exotic_atom.amount[1].add(1).log10().add(1).pow(1.5)
                return x
            },x=>"x"+format(x)],
            45: [()=>{
                let x = hasElement(224) ? Decimal.pow(1.1,player.bh.unstable.root(4)) : player.bh.unstable.add(1)
                if (tmp.c16active) x = overflow(x.log10().add(1).root(2),10,0.5)
                x = overflow(x,1e100,0.5)
                overflow(x,'1e1000',0.5)
                return overflow(x,'1e1300',0.05)
            },x=>"^"+format(x)+" later"],
        },
        {
            "2": [()=>{
                let base = 1.25
                if (hasBeyondPres(1,1)) base += beyondPresEff(1,1)
                let x = Decimal.pow(base,player.prestiges[3])
                return x
            },x=>"x"+x.format()+" later"],
            "4": [()=>{
                let x = player.prestiges[3].div(2).add(1)
                return x
            },x=>"x"+x.format()],
            "6": [()=>{
                let x = tmp.exotic_atom.amount.add(1).log10().add(1).mul(hasElement(22,1)?muElemEff(22):1)
                x = x.softcap(40000,hasElement(264)?1:0.25,0)
                x = x.softcap(22000000,0.15,0)
                return x.pow(hasElement(264)?1.5:1)
            },x=>"x"+x.format()+(prestigeEff(3,6).gte(40000) && !hasElement(264)?` <span class='soft'>(softcapped)</span>`:'')+(prestigeEff(3,6).gte(22000000)? ` <span class='soft'>(softcapped^2)</span>`:'')],
        },
        {
            "1": [()=>{
                let x = Decimal.pow(1.25,player.prestiges[4])
                return x
            },x=>"x"+x.format()],
        },
    ],
    reset(i, bulk = false) {
        let b = this.bulk(i)
        if (i==0?tmp.prestiges.base.gte(tmp.prestiges.req[i]):player.prestiges[i-1].gte(tmp.prestiges.req[i])) if (!bulk || b.gt(player.prestiges[i]) ) {
            if (bulk) player.prestiges[i] = b
            else player.prestiges[i] = player.prestiges[i].add(1)

            if (!this.noReset[i]()) {
                for (let j = i-1; j >= 0; j--) {
                    player.prestiges[j] = E(0)
                }
                QUANTUM.enter(false,true,false,true)
            }
            
            updateRanksTemp()
        }
    },
}

const PRES_LEN = PRESTIGES.fullNames.length

function hasPrestige(x,y) { return player.prestiges[x].gte(y) && !(tmp.c16active && CORRUPTED_PRES[x] && CORRUPTED_PRES[x].includes(y)) }

function prestigeEff(x,y,def=E(1)) { return tmp.prestiges.eff[x][y] || def }

function updateRanksTemp() {
    if (!tmp.ranks) tmp.ranks = {}
    for (let x = 0; x < RANKS.names.length; x++) if (!tmp.ranks[RANKS.names[x]]) tmp.ranks[RANKS.names[x]] = {}
    let ifp = E(1)
    if (tmp.inf_unl) ifp = ifp.mul(theoremEff('mass',2))
    let fp2 = tmp.qu.chroma_eff[1][0]

    let tetr_fp2 = hasCharger(8) ? 1 : fp2

    let rt_fp2 = hasPrestige(1,127) ? tmp.c16active ? 5e2 : 1 : fp2
    let ffp = E(1)
    let ffp2 = 1
    if (tmp.c16active || player.dark.run.active) ffp2 /= mgEff(5)

    let fp = RANKS.fp.rank().mul(ffp)
    tmp.ranks.rank.req = E(10).pow(player.ranks.rank.div(ifp).div(ffp2).scaleEvery('rank',false,[1,1,1,1,rt_fp2]).div(fp).pow(1.15)).mul(10)
    tmp.ranks.rank.bulk = E(0)
    if (player.mass.gte(10)) tmp.ranks.rank.bulk = player.mass.div(10).max(1).log10().root(1.15).mul(fp).scaleEvery('rank',true,[1,1,1,1,rt_fp2]).mul(ffp2).mul(ifp).add(1).floor();
    tmp.ranks.rank.can = player.mass.gte(tmp.ranks.rank.req) && !CHALS.inChal(5) && !CHALS.inChal(10) && !FERMIONS.onActive("03") && (!CHALS.inChal(18) || hasOrbUpg(0))

    fp = RANKS.fp.tier().mul(ffp)
    tmp.ranks.tier.req = player.ranks.tier.div(ifp).div(ffp2).scaleEvery('tier',false,[1,1,1,rt_fp2]).div(fp).add(2).pow(2).floor()
    tmp.ranks.tier.bulk = player.ranks.rank.max(0).root(2).sub(2).mul(fp).scaleEvery('tier',true,[1,1,1,rt_fp2]).mul(ffp2).mul(ifp).add(1).floor();

    fp = E(1).mul(ffp)
    let pow = 2
    if (hasElement(44)) pow = 1.75
    if (hasElement(9)) fp = fp.mul(1/0.85)
    if (player.ranks.pent.gte(1)) fp = fp.mul(1/0.85)
    if (hasElement(72)) fp = fp.mul(1/0.85)

    let tps = 0

    tmp.ranks.tetr.req = player.ranks.tetr.div(ifp).div(ffp2).scaleEvery('tetr',false,[1,1,1,tetr_fp2]).div(fp).pow(pow).mul(3).add(10-tps).floor()
    tmp.ranks.tetr.bulk = player.ranks.tier.sub(10-tps).div(3).max(0).root(pow).mul(fp).scaleEvery('tetr',true,[1,1,1,tetr_fp2]).mul(ffp2).mul(ifp).add(1).floor();

    fp = E(1).mul(ffp)
    let fpa = hasPrestige(1,33) ? [1,1,1,prestigeEff(1,33,1)] : []
    if (player.ranks.hex.gte(1)) fp = fp.div(0.8)
    pow = 1.5
    tmp.ranks.pent.req = player.ranks.pent.div(ifp).div(ffp2).scaleEvery('pent',false,fpa).div(fp).pow(pow).add(15-tps).floor()
    tmp.ranks.pent.bulk = player.ranks.tetr.sub(15-tps).gte(0)?player.ranks.tetr.sub(15-tps).max(0).root(pow).mul(fp).scaleEvery('pent',true,fpa).mul(ffp2).mul(ifp).add(1).floor():E(0);

    fp = E(1)
    pow = 1.8
    let s = 20
    if (hasElement(167)) {
        s /= 2
        pow *= 0.9
    }
    tmp.ranks.hex.req = player.ranks.hex.div(ifp).div(ffp2).div(fp).scaleEvery('hex',false).pow(pow).add(s-tps).floor()
    tmp.ranks.hex.bulk = player.ranks.pent.sub(s-tps).gte(0)?player.ranks.pent.sub(s-tps).max(0).root(pow).scaleEvery('hex',true).mul(fp).mul(ffp2).mul(ifp).add(1).floor():E(0);

    for (let x = 0; x < RANKS.names.length; x++) {
        let rn = RANKS.names[x]
        if (x > 0) {
            tmp.ranks[rn].can = player.ranks[RANKS.names[x-1]].gte(tmp.ranks[rn].req)
        }
    }

    // Prestige

    tmp.prestiges.baseMul = PRESTIGES.base()
    tmp.prestiges.baseExp = PRESTIGES.baseExponent()
    tmp.prestiges.base = tmp.prestiges.baseMul.pow(tmp.prestiges.baseExp)
    for (let x = 0; x < PRES_LEN; x++) {
        tmp.prestiges.req[x] = PRESTIGES.req(x)
        for (let y in PRESTIGES.rewardEff[x]) {
            if (PRESTIGES.rewardEff[x][y]) tmp.prestiges.eff[x][y] = PRESTIGES.rewardEff[x][y][0]()
        }
    }

    updateAscensionsTemp()
    // Beyond
updateBeyondPresTemp()
    let p = 1

    if (hasElement(221)) p /= 0.95

    tmp.beyond_ranks.tier_power = p

    tmp.beyond_ranks.max_tier = BEYOND_RANKS.getTier()
    tmp.beyond_ranks.latestRank = BEYOND_RANKS.getRankFromTier(tmp.beyond_ranks.max_tier)

    tmp.beyond_ranks.req = BEYOND_RANKS.req()
    tmp.beyond_ranks.bulk = BEYOND_RANKS.bulk()

    for (let x in BEYOND_RANKS.rewardEff) {
        for (let y in BEYOND_RANKS.rewardEff[x]) {
            if (BEYOND_RANKS.rewardEff[x][y]) tmp.beyond_ranks.eff[x][y] = BEYOND_RANKS.rewardEff[x][y][0]()
        }
    }
}

const BEYOND_RANKS = {
    req() {
        let x = player.ranks.beyond.pow(1.25).mul(10).add(180).ceil()
        return x
    },
    bulk() {
        let x = player.ranks.hex.gte(180)?player.ranks.hex.sub(180).div(10).max(0).root(1.25).add(1).floor():E(0)
        return x
    },
    getTier() {
        let x = player.ranks.beyond.gt(0)?player.ranks.beyond.log10().max(0).pow(.8).mul(tmp.beyond_ranks.tier_power).add(1).floor().toNumber():1
        return x
    },
    getRankFromTier(i) {
        let hp = Decimal.pow(10,Math.pow((i-1)/tmp.beyond_ranks.tier_power,1/.8)).ceil()

        return player.ranks.beyond.div(hp).floor()
    },
    getRequirementFromTier(i,t=tmp.beyond_ranks.latestRank,mt=tmp.beyond_ranks.max_tier) {
        return Decimal.pow(10,Math.pow(mt/tmp.beyond_ranks.tier_power,1/.8)-Math.pow((mt-i)/tmp.beyond_ranks.tier_power,1/.8)).mul(Decimal.add(t,1)).ceil()
    },

    reset(auto=false) {
        if (player.ranks.hex.gte(tmp.beyond_ranks.req) && (!auto || tmp.beyond_ranks.bulk.gt(player.ranks.beyond))) {
            player.ranks.beyond = auto ? player.ranks.beyond.max(tmp.beyond_ranks.bulk) : player.ranks.beyond.add(1)

            if (hasBeyondRank(2,2)||hasInfUpgrade(10)) return;

            player.ranks.hex = E(0)
            DARK.doReset()
        }
    },

    rewards: {
        1: {
            1: `Add 0.5 to matter exponents.`,
            2: `All matter upgrades are stronger based on dark ray.`,
            4: `Hybridized Uran-Astatine's second effect is stronger based on FSS.`,
            7: `Matters gain is boosted by Hept.`,
        },
        2: {
            1: `Automate Beyond-Ranks. Beyond-Ranks now affect prestige base.`,
            2: `Beyond-Ranks will no longer reset anything. [Meta-Lepton]'s effect is multiplied by 8.`,
            4: `Accelerator's effect affects tickspeed, BHC & cosmic ray powers. Chromas gain is raised to the 1.1th power.`,
            7: `Gain more fermions based on Hept, except Meta-Fermions.`,
            10: `Raise mass of black hole to the 1.2th power.`,
            15: `Remove all scalings from mass upgrades 1-3.`,
            17: `[qu9] is more effective based on mass of black hole. Exotic Supernova starts later based on Quantizes.`,
            20: `C1's reward is changed.`,
        },
        3: {
            1: `Mass & Stronger Overflow is weaker based on archverse tier of normal mass.`,
            2: `Super FSS starts +1 later.`,
            4: `Beyond Rank boosts Kaon & Pion gain.`,
            12: `Remove the softcap of dark ray's fourth reward.`,
            18: `Super FSS scales +2.5% weaker per beyond-ranks' maximum tier (capped at 50%).`,
            32: `Argon-18 affects tickspeed's power.`,
        },
        4: {
            1: `Beta Particles affect supercritical supernova starting at a reduced rate.`,
            2: `Prestige base's exponent is increased by +20% per beyond-ranks' maximum tier, starting at Dec.`,
            40: `[Tau]'s reward is cubed.`,
        },
        5: {
            2: `Super FSS starts +1 later per beyond-ranks' maximum tier, starting at Dec.`,
            7: `Remove pre-meta scalings from Prestige Level.`,
            11: `Remove pre-ultra scalings from Pent.`,
            23: `Add matter exponent based on beyond-ranks' maximum tier.`,
        },
        6: {
            1: `Boost Muonic Phosphorus effect by 3.00x per beyond-ranks' maximum tier.`,
            2: `Muonic Titanium is stronger based on mass (starts at e3e788).`,
            27: `Best mass of black hole in C16 boosts Corrupted Shards gain.`,
        },
        7: {
            3: `Super Infinity Theorems starts +3 later per beyond-ranks' maximum tier (Starts at Dec).`,
            42: `Stronger softcap^2 is 15% weaker.`,
            78: `Overpower softcap^2 is 15% weaker.`,
        },
        8: {
            2: `Super FSS starts +1 later per beyond-ranks' maximum tier (Starts at Dodec).`,
        },
    },

    rewardEff: {
        1: {
            2: [
                ()=>{
                    let x = player.dark.rays.add(1).log10().root(2).softcap(10,0.25,0).toNumber()/100+1

                    return x
                },
                x=>formatPercent(x-1)+" stronger"+softcapHTML(x,1.1),
            ],
            4: [
                ()=>{
                    let x = player.dark.matters.final.pow(.75).div(10).add(1)

                    return x
                },
                x=>formatPercent(x-1)+" stronger",
            ],
            7: [
                ()=>{
                    let x = player.ranks.beyond.add(1).root(2)

                    return x
                },
                x=>"^"+format(x),
            ],
        },
        2: {
            1: [
                ()=>{
                    let x = player.ranks.beyond.pow(3).add(1)

                    return x
                },
                x=>"x"+format(x),
            ],
            7: [
                ()=>{
                    let x = player.ranks.beyond.add(1).log10().add(1).pow(2)

                    return overflow(x,10,0.5)
                },
                x=>"x"+format(x),
            ],
            17: [
                ()=>{
                    let x = player.bh.mass.add(1).log10().add(1).log10().add(1).pow(2)
                    
                    let y = player.qu.times.add(1).log10().root(2).div(8).add(1)

                    return [x,y]
                },
                x=>"x"+format(x[0])+" effective; x"+format(x[1])+" later",
            ],
        },
        3: {
            1: [
                ()=>{
                    let x = Decimal.pow(0.99,player.mass.div(1.5e56).max(1).log10().div(1e9).max(1).log10().div(15).root(3))

                    return x
                },
                x=>formatReduction(x)+" weaker",
            ],
            4: [
                ()=>{
                    let x = player.ranks.beyond.add(1).log10().add(1).pow(2)

                    return x
                },
                x=>"x"+format(x),
            ],
            18: [
                ()=>{
                    let x = 1-tmp.beyond_ranks.max_tier*0.025

                    return Math.max(0.5,x)
                },
                x=>formatReduction(x)+" weaker",
            ],
        },
        4: {
            1: [
                ()=>{
                    let x = overflow(tmp.prim.eff[7].div(5),1e6,0.5)

                    return x
                },
                x=>"+"+format(x)+" later",
            ],
            2: [
                ()=>{
                    let x = (tmp.beyond_ranks.max_tier-3)**0.2*0.2+1

                    return Math.max(1,x)
                },
                x=>"x"+format(x,1),
            ],
        },
        5: {
            2: [
                ()=>{
                    let x = tmp.beyond_ranks.max_tier-3

                    return Math.max(1,x)
                },
                x=>"+"+format(x,0)+" later",
            ],
            23: [
                ()=>{
                    let x = tmp.beyond_ranks.max_tier-3**0.2+1

                    return x
                },
                x=>"+"+format(x,3),
            ],
        },
        6: {
            1: [
                ()=>{
                    let x = tmp.beyond_ranks.max_tier*3

                    return Math.max(1,x)
                },
                x=>"x"+format(x,0),
            ],
            2: [
                ()=>{
                    let x = E(1)
                    if (player.mass.gte('e3e788')) x = player.mass.div('e3e788').max(1).log10().log10().log10().log2().div(3).add(1)

                    return x
                },
                x=>"x"+format(x,3),
            ],
            27: [
                ()=>{
                    let x = E(1)
                     x = player.dark.c16.bestBH.max(1).log10().div(3).add(1)

                    return x
                },
                x=>"x"+format(x,3),
            ],
        },
        7: {
            3: [
                ()=>{
                    let x = (tmp.beyond_ranks.max_tier-3)*3

                    return Math.max(1,x)
                },
                x=>"+"+format(x,0)+" later",
            ],
        },
        8: {
            2: [
                ()=>{
                    let x = (tmp.beyond_ranks.max_tier-4)

                    return Math.max(1,x)
                },
                x=>"+"+format(x,0)+" later",
            ],
        },
    },
}

const RTNS = [
    ['','Rank','Tier','Tetr','Pent','Hex','Hept','Oct','Enne'],
    ['','dec','icos'], // d>2 -> cont
    ['','hect'], // h>1 -> ct
]

const RTNS2 = [
    ['','un','do','tri','tetra','penta','hexa','hepta','octa','nona'], // d < 3
    ['','un','du','tria','tetra','penta','hexa','hepta','octa','nona'],
    ['','un','di','tri','tetra','penta','hexa','hepta','octa','nona'], // h
]

function getRankTierName(i) {
    if (i >= 999) return '['+format(i,0,9,'sc')+']'
    else {
        if (i < 9) return RTNS[0][i]
        i += 1
        let m = ''
        let h = Math.floor(i / 100), d = Math.floor(i / 10) % 10, o = i % 10

        if (d > 1 && o == 1) m += 'hen' 
        else if (d == 2 && o == 3) m += 'tr' 
        else m += RTNS2[0][o]
        if (d > 2) m += RTNS2[1][d] + 'cont'
        else m += RTNS[1][d]
        if (h > 0 && d > 0) m += 'a'
        if (h > 0) m += (h > 1 ? RTNS2[2][h] + 'ct' : 'hect')

        return capitalFirst(m)
    }
}

function hasBeyondRank(x,y) {
    let t = tmp.beyond_ranks.max_tier, lt = tmp.beyond_ranks.latestRank||E(0)
    return t > x || t == x && lt.gte(y)
}

function beyondRankEffect(x,y,def=1) {
    let e = tmp.beyond_ranks.eff[x]
    return e?e[y]||def:def
}

function updateRanksHTML() {
    tmp.el.rank_tabs.setDisplay(hasUpgrade('br',9))
    tmp.el.asc_btn.setDisplay(tmp.ascensions_unl)
    for (let x = 0; x < 3; x++) {
        tmp.el["rank_tab"+x].setDisplay(tmp.rank_tab == x)
    }

    if (tmp.rank_tab == 0) {
        for (let x = 0; x < RANKS.names.length; x++) {
            let rn = RANKS.names[x]
            let unl = (!tmp.brUnl || x > 3)&&(RANKS.unl[rn]?RANKS.unl[rn]():true)
            tmp.el["ranks_div_"+x].setDisplay(unl)
            if (unl) {
                let keys = Object.keys(RANKS.desc[rn])
                let desc = ""
                for (let i = 0; i < keys.length; i++) {
                    if (player.ranks[rn].lt(keys[i])) {
                        desc = ` At ${RANKS.fullNames[x]} ${format(keys[i],0)}, ${RANKS.desc[rn][keys[i]]}`
                        break
                    }
                }
    
                tmp.el["ranks_scale_"+x].setTxt(getScalingName(rn))
                tmp.el["ranks_amt_"+x].setTxt(format(player.ranks[rn],0))
                tmp.el["ranks_"+x].setClasses({btn: true, reset: true, locked: !tmp.ranks[rn].can})
                tmp.el["ranks_desc_"+x].setTxt(desc)
                tmp.el["ranks_req_"+x].setTxt(x==0?formatMass(tmp.ranks[rn].req):RANKS.fullNames[x-1]+" "+format(tmp.ranks[rn].req,0))
                tmp.el["ranks_auto_"+x].setDisplay(RANKS.autoUnl[rn]())
                tmp.el["ranks_auto_"+x].setTxt(player.auto_ranks[rn]?"ON":"OFF")
            }
        }

        let unl = tmp.brUnl

        tmp.el.pre_beyond_ranks.setDisplay(unl)
        tmp.el.beyond_ranks.setDisplay(unl)
        if (unl) {
            let h = ''
            for (let x = 0; x < 4; x++) {
                let rn = RANKS.names[x]
                h += '<div>' + getScalingName(rn) + RANKS.fullNames[x] + ' ' + format(player.ranks[rn],0) + '</div>'
            }
            tmp.el.pre_beyond_ranks.setHTML(h)

            // Beyond Rank

            tmp.el.br_auto.setDisplay(hasBeyondRank(2,1)||hasInfUpgrade(10))
            tmp.el.br_auto.setTxt(player.auto_ranks.beyond?"ON":"OFF")

            let t = tmp.beyond_ranks.max_tier
            h = ''

            for (let x = Math.min(3,t)-1; x >= 0; x--) {
                h += getRankTierName(t+5-x) + " " + (x == 0 ? tmp.beyond_ranks.latestRank.format(0) : BEYOND_RANKS.getRankFromTier(t-x).format(0)) + (x>0?'<br>':"")
            }

            tmp.el.br_amt.setHTML(h)

            let r = '', b = false

            for (tt in BEYOND_RANKS.rewards) {
                b = false
                for (tr in BEYOND_RANKS.rewards[tt]) {
                    tt = Number(tt)
                    if (tt > t || (tmp.beyond_ranks.latestRank.lt(tr) && tt == t)) {
                        r = "At "+getRankTierName(tt+5)+" "+format(tr,0)+" - "+BEYOND_RANKS.rewards[tt][tr]
                        b = true
                        break
                    }
                }
                if (b) break;
            }

            h = `
                Reset your Hexes (and force a darkness reset) but hept/oct/enne etc. up. ${r}<br>
                To ${getRankTierName(t+5)} up, require ${getRankTierName(t+4)} ${
                    t == 1
                    ? tmp.beyond_ranks.req.format(0)
                    : BEYOND_RANKS.getRequirementFromTier(1,tmp.beyond_ranks.latestRank,t-1).format(0)
                }.<br>
                To ${getRankTierName(t+6)} up, require ${getRankTierName(t+5)} ${BEYOND_RANKS.getRequirementFromTier(1,0).format(0)}.
            `

            tmp.el.br_desc.setHTML(h)
            tmp.el.br_desc.setClasses({btn: true, reset: true, locked: player.ranks.hex.lt(tmp.beyond_ranks.req)})
        }
    }
    if (tmp.rank_tab == 1) {
        tmp.el.pres_base.setHTML(`${tmp.prestiges.baseMul.format(0)}<sup>${format(tmp.prestiges.baseExp)}</sup> = ${tmp.prestiges.base.format(0)}`)

        for (let x = 0; x < PRES_LEN; x++) {
            let unl = PRESTIGES.unl[x]?PRESTIGES.unl[x]():true

            tmp.el["pres_div_"+x].setDisplay(unl && (!tmp.bpUnl || x > 3))

            if (unl) {
                let p = player.prestiges[x] || E(0)
                let keys = Object.keys(PRESTIGES.rewards[x])
                let desc = ""
                for (let i = 0; i < keys.length; i++) {
                    if (p.lt(keys[i]) && (tmp.chal13comp || p.lte(PRES_BEFOREC13[x]||Infinity))) {
                        desc = ` At ${PRESTIGES.fullNames[x]} ${format(keys[i],0)}, ${PRESTIGES.rewards[x][keys[i]]}`
                        break
                    }
                }

                tmp.el["pres_scale_"+x].setTxt(getScalingName(PRESTIGES.names[x]))
                tmp.el["pres_amt_"+x].setTxt(format(p,0))
                tmp.el["pres_"+x].setClasses({btn: true, reset: true, locked: x==0?tmp.prestiges.base.lt(tmp.prestiges.req[x]):player.prestiges[x-1].lt(tmp.prestiges.req[x])})
                tmp.el["pres_desc_"+x].setTxt(desc)
                tmp.el["pres_req_"+x].setTxt(x==0?format(tmp.prestiges.req[x],0)+" of Prestige Base":PRESTIGES.fullNames[x-1]+" "+format(tmp.prestiges.req[x],0))
                tmp.el["pres_auto_"+x].setDisplay(PRESTIGES.autoUnl[x]())
                tmp.el["pres_auto_"+x].setTxt(player.auto_pres[x]?"ON":"OFF")
            }
        }
        updateBeyondPresHTML()
    }
    if (tmp.rank_tab == 2) {
        updateAscensionsHTML()
    }
}

const PRES_BEFOREC13 = [40,7]
