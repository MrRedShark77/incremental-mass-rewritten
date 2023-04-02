const ENTROPY = {
    ids: ['eth','hr'],
    switch(x) {
        let i = this.ids[x]
        player.qu.en[i][0] = !player.qu.en[i][0]
        if (!player.qu.en[i][0]) {
            player.qu.en[i][3] = 0
            player.qu.en[i][2] = player.qu.en[i][2].max(player.qu.en[i][1])
            player.qu.en[i][1] = E(0)
        }
    },
    reset(x) {
        let i = this.ids[x]
        player.qu.en[i][0] = false
        player.qu.en[i][1] = E(0)
        player.qu.en[i][3] = 0
    },
    gain() {
        let x = tmp.en.eff.eth.mul(getEnRewardEff(6))
        if (hasElement(93)) x = x.mul(tmp.elements.effect[93]||1)
        if (player.md.break.upgs[6].gte(1)) x = x.mul(tmp.bd.upgs[6].eff?tmp.bd.upgs[6].eff[0]:1)
        x = x.mul(tmp.dark.shadowEff.en||1)

        x = x.pow(exoticAEff(0,2))

        x = overflow(x,tmp.en.cap.max(1),0.25)

        return x
    },
    cap() {
        let x = tmp.en.eff.hr
        if (hasElement(177)) x = x.mul(elemEffect(177))
        if (hasElement(179)) x = x.mul(elemEffect(179))
        return x
    },
    evaPow(i) {
        let x = 1
        if (hasTree("en1")) x *= 2
        return x
    },
    evaGain(i) {
        let x = E(player.qu.en[this.ids[i]][3]+1).pow(this.evaPow(i)).mul(getEnRewardEff(2))
        return x
    },
    evaEff(i) {
        let x
        let y = player.qu.en[this.ids[i]][2].max(0)
        if (i==0) {
            x = y.pow(hasTree("en1")?1.5:1).div(2)
        } else if (i==1) {
            x = y.pow(hasTree("en1")?3:2).mul(10)
        }
        return x
    },
    rewards: [
        {
            title: "Entropic Multiplier",

            start: E(100),
            inc: E(10),

            eff(i) {
                let x = hasElement(214) ? Decimal.pow(1.1,i.pow(.8)) : hasElement(114) ? i.add(1).root(1.5) : i.div(2).add(1).root(3)
                return x
            },
            desc(x) { return `Meta Tickspeed, BHC & Cosmic Ray start <b>${x.format()}x</b> later.` },
        },{
            title: "Entropic Accelerator",

            start: E(1000),
            inc: E(20),

            eff(i) {
                if (tmp.c16active) return E(1)
                let x = i.pow(0.5).div(5).add(1)
                return x
            },
            desc(x) { return `Atomic Power’s effect is <b>${formatPercent(x.sub(1))}</b> exponentially stronger.`.corrupt(tmp.c16active) },
        },{
            title: "Entropic Evaporation",

            start: E(1000),
            inc: E(10),

            scale: {s: 10, p: 2},

            eff(i) {
                let b = 3
                if (hasElement(97)) b++
                let x = Decimal.pow(b,i)
                return x
            },
            desc(x) { return `Make evaporated resources gain <b>${x.format(1)}x</b> faster.` },
        },{
            title: "Entropic Converter",

            start: E(10000),
            inc: E(2),

            eff(i) {
                if (tmp.c16active) return [E(0),E(1)]
                let x = i.div(QCs.active()?100:5).softcap(2,0.5,0)
                let y = tmp.tickspeedEffect?tmp.tickspeedEffect.step.pow(x):E(1)
                return [x,y]
            },
            desc(x) { return `Tickspeed Power gives <b>^${x[0].format(2)}</b> boost to BHC & Cosmic Ray Powers.<br>Currently: <b>${x[1].format()}x</b>`.corrupt(tmp.c16active) },
        },{
            title: "Entropic Booster",

            start: E(250000),
            inc: E(2),

            eff(i) {
                if (tmp.c16active) return E(1)
                let x = i.pow(2).div(20).add(1)
                return x
            },
            desc(x) { return `<b>x${x.format(2)}</b> extra Mass upgrades, Tickspeed, BHC and Cosmic Ray.`.corrupt(tmp.c16active) },
        },{
            title: "Entropic Scaling",

            start: E(1e7),
            inc: E(10),

            eff(i) {
                let x = i.root(2).div(10).add(1).pow(-1)
                return x
            },
            desc(x) { return `All pre-Supernova, pre-Pent & pre-Meta scalings are <b>${formatReduction(x)}</b> weaker.` },
        },{
            title: "Entropic Condenser",

            start: E(1e6),
            inc: E(100),

            scale: {s: 5, p: 2.5},

            eff(i) {
                let x = player.qu.en.amt.add(1).log10().mul(2).add(1).pow(i.pow(0.8))
                return x
            },
            desc(x) { return `Entropy boosts itself by <b>${x.format(2)}x</b>.` },
        },{
            title: "Entropic Radiation",

            start: E(1e10),
            inc: E(1.5),

            scale: {s: 20, p: 2.5},

            eff(i) {
                if (tmp.c16active) return E(1)
                let x = player.qu.en.amt.add(1).log10().pow(0.75).mul(i).div(1500).add(1)
                return overflow(x,50,0.5)
            },
            desc(x) { return `Radiation effects are boosted by <b>^${x.format()}</b> based on Entropy.`.corrupt(tmp.c16active) },
        },

        /*
        {
            title: "Entropic Placeholder",

            start: E(100),
            inc: E(10),

            eff(i) {
                let x = E(1)
                return x
            },
            desc(x) { return `Placeholder.` },
        },
        */
    ],
    nextReward(i) {
        let rc = this.rewards[i]
        let r = player.qu.en.rewards[i]

        if (rc.scale) {
            let p = rc.scale.p
            if ((i == 2 || i == 6) && hasElement(106)) p = p**0.85
            if ((i == 2 || i == 6) && hasElement(215)) p = p**0.85
            if ((i == 2) && hasElement(179)) p **= 0.75
            r = r.scale(rc.scale.s, p, 0)
        }
        let x = rc.inc.pow(r).mul(rc.start)
        return x
    },
    getRewards(i) {
        let rc = this.rewards[i]
        let en = player.qu.en.amt

        let x = E(0)
        if (en.gte(rc.start)) {
            x = en.div(rc.start).max(1).log(rc.inc)
            if (rc.scale) {
                let p = rc.scale.p
                if ((i == 2 || i == 6) && hasElement(106)) p = p**0.85
                if ((i == 2 || i == 6) && hasElement(215)) p = p**0.85
                if ((i == 2) && hasElement(179)) p **= 0.75
                x = x.scale(rc.scale.s, p, 0, true)
            }
            x = x.add(1).floor()
        }
        return x
    },
    getRewardEffect(i) {
        if ((player.qu.rip.active || tmp.c16active || player.dark.run.active) && !tmp.en.reward_br.includes(i)) return E(0)
        let x = player.qu.en.rewards[i]

        if (hasElement(91) && (player.qu.rip.active || tmp.c16active || player.dark.run.active) && (i==1||i==4)) x = x.mul(0.1)

        return x
    },
}

function getEnRewardEff(x,def=1) { return tmp.en.rewards_eff[x] ?? E(def) }

function calcEntropy(dt, dt_offline) {
    if(player.md.break.upgs[10].gte(1) && player.qu.en.unl){
		let s1 = Decimal.pow(4,player.supernova.radiation.hz.add(1).log10().add(1).log10().add(1).log10().add(1)).mul(2.25);
		if (hasTree("en1")) s1 = s1.add(s1.pow(2)).add(s1.pow(3).div(3)); else s1 = s1.add(s1.pow(2).div(2));
		s1 = s1.mul(getEnRewardEff(2));
		if(player.qu.en.eth[2].lt(s1))player.qu.en.eth[2] = s1;
        
		s1 = Decimal.pow(4,player.bh.mass.add(1).log10().add(1).log10().add(1).log10().add(1)).mul(2.25);
		if (hasTree("en1")) s1 = s1.add(s1.pow(2)).add(s1.pow(3).div(3)); else s1 = s1.add(s1.pow(2).div(2));
		s1 = s1.mul(getEnRewardEff(2));
        s1 = s1.mul(tmp.dark.abEff.hr||1)
		if(player.qu.en.hr[2].lt(s1))player.qu.en.hr[2] = s1;
	}
    if (player.qu.en.eth[0]) {
        player.qu.en.eth[3] += dt
        player.qu.en.eth[1] = player.qu.en.eth[1].add(tmp.en.gain.eth.mul(dt))
        let s = player.supernova.radiation.hz.div(player.supernova.radiation.hz.max(1).pow(dt).pow(player.qu.en.eth[3]**(2/3))).sub(1)
        if (s.lt(1)) ENTROPY.switch(0)
        else player.supernova.radiation.hz = s
    }
    if (player.qu.en.hr[0]) {
        player.qu.en.hr[3] += dt
        player.qu.en.hr[1] = player.qu.en.hr[1].add(tmp.en.gain.hr.mul(dt))
        let s = player.bh.mass.div(player.bh.mass.max(1).pow(dt).pow(player.qu.en.hr[3]**(2/3))).sub(1)
        if (s.lt(1)) ENTROPY.switch(1)
        else player.bh.mass = s
    }

    let a = player.qu.en.amt.add(tmp.en.gain.amt.mul(dt))
    if (!hasElement(185)) a = a.min(tmp.en.cap)
    player.qu.en.amt = a

    for (let x = 0; x < ENTROPY.rewards.length; x++) player.qu.en.rewards[x] = player.qu.en.rewards[x].max(tmp.en.rewards[x])
}

function updateEntropyTemp() {
    let rbr = []
    if (hasElement(91)) rbr.push(1,4)
    if (hasElement(96)) rbr.push(3)
    if (hasElement(109)) rbr.push(0)
    if (hasElement(130)) rbr.push(5,7)
    tmp.en.reward_br = rbr

    for (let x = 0; x < ENTROPY.rewards.length; x++) {
        let rc = ENTROPY.rewards[x]
        tmp.en.rewards[x] = ENTROPY.getRewards(x)
        tmp.en.rewards_eff[x] = rc.eff(ENTROPY.getRewardEffect(x))
    }
    for (let x = 0; x < 2; x++) {
        let id = ENTROPY.ids[x]
        tmp.en.gain[id] = ENTROPY.evaGain(x)
        tmp.en.eff[id] = ENTROPY.evaEff(x)
    }
    tmp.en.cap = ENTROPY.cap()
    tmp.en.gain.amt = ENTROPY.gain()
}

function updateEntropyHTML() {
    tmp.el.enEva1.setTxt(player.supernova.radiation.hz.format())
    tmp.el.enEva2.setTxt(formatMass(player.bh.mass))

    tmp.el.enAmt1.setTxt(player.qu.en.eth[2].format())
    tmp.el.enAmt2.setTxt(player.qu.en.amt.format(1) + " / " + tmp.en.cap.format(1))
    tmp.el.enAmt3.setTxt(player.qu.en.hr[2].format())

    tmp.el.enGain.setTxt(player.qu.en.amt.formatGain(tmp.en.gain.amt))

    tmp.el.enEff1.setTxt(tmp.en.eff.eth.format(1))
    tmp.el.enEff2.setTxt(tmp.en.eff.hr.format(1))

    tmp.el.evaBtn1.setHTML(
        player.qu.en.eth[0]
        ? `Stop Evaporating to get<br>${player.qu.en.eth[1].format()}<br>best Enthalpy`
        : `Evaporate your frequency to gain Enthalpy`
    )
    tmp.el.evaBtn2.setHTML(
        player.qu.en.hr[0]
        ? `Stop Evaporating to get<br>${player.qu.en.hr[1].format()}<br>best Hawking Radiation`
        : `Evaporate your mass of Black Hole to gain Hawking Radiation`
    )

    for (let x = 0; x < ENTROPY.rewards.length; x++) {
        let rs = player.qu.en.rewards[x]
        let rc = ENTROPY.rewards[x]
        tmp.el["en_reward"+x].setTxt(rs.format(0))
        tmp.el["en_scale"+x].setTxt(rc.scale?rs.gte(rc.scale.s)?"2":"":"")
        tmp.el["en_reward_next"+x].setTxt(ENTROPY.nextReward(x).format())
        tmp.el["en_reward_eff"+x].setHTML(rc.desc(getEnRewardEff(x)))
    }
}

function setupEntropyHTML() {
    let table = new Element("en_table")
    let html = ""
    for (let x = 0; x < ENTROPY.rewards.length; x++) {
        let rc = ENTROPY.rewards[x]
        html += `
        <div class="en_reward_div">
            <div style="text-align: left; width: 312px;">
                <b class="en_sub_reward">${rc.title}<sup id="en_scale${x}"></sup>:</b> <span id="en_reward${x}">0</span><br>
                <b class="en_sub_reward">Next at: </b> <span id="en_reward_next${x}">0</span>
            </div>
            <div class="en_reward">
                <span id="en_reward_eff${x}"></span>
            </div>
        </div>
        `
    }
    table.setHTML(html)
}