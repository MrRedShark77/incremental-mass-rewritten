const TOOLTIP_RES = {
    mass: {
        full: "Mass",
        desc() {
            let h = `You have pushed <b>${formatMass(player.mass)}</b>.`;

            if (tmp.overflowBefore.mass.gte(tmp.overflow_start.mass[0]))
            h += `<br>(<b>+${formatMass(tmp.overflowBefore.mass)}</b> gained before <b>overflow</b>)<br>`;
            h += "<br>Click to see mass values."

            return h
        },
    },
    rp: {
        full: "Rage Power",
        desc() {
            let h = `<i>
            Reach over <b>${formatMass(1e14)}</b> of normal mass to reset previous features for gain Rage Powers.
            </i>`

            return h
        },
    },
    cp: {
        full: "Calm Power",
        desc: () => `<i>Reach over <b>${formatMass(1e14)}</b> of normal mass to reset previous features for gain Calm Powers.</i>`
    },
    dm: {
        full: "Dark Matter",
        desc() {
            let r = EVO.amt >= 1 ? `<b>${format(5e3)}</b> Calm Power` : `<b>${format(1e25)}</b> Rage Power`
            return `<i>Reach over ${r} to reset all previous features for gain Dark Matters.</i>`
        },
    },
    fabric: {
        full: "Fabric",
        desc() {
            return `<i>Reach over <b>${format(1e5)}</b> Calm Power to reset all previous features for gain Fabrics.</i>`
        },
    },
    bh: {
        full: "Black Hole",
        desc() {
            if (EVO.amt >= 2) return ``

            let h = `You have <b>${formatMass(player.bh.mass)}</b> of black hole.`;

            if (tmp.overflowBefore.bh.gte(tmp.overflow_start.bh[0]))
            h += `<br>(<b>+${formatMass(tmp.overflowBefore.bh)}</b> gained before <b>overflow</b>)`;

            if (hasCharger(1))
            h += `<br class='line'>You have <b class='corrupted_text'>${formatMass(player.bh.unstable)} ${formatGain(player.bh.unstable,UNSTABLE_BH.calcProduction(),true)}</b> of Unstable Black Hole.`;

            return h
        },
    },
    wormhole: {
        full: "Wormhole",
        desc() {
            return player.evo?`You have <b>${formatMass(WORMHOLE.total())}</b> of wormhole.`:"???";
        },
    },
    atom: {
        full: "Atom",
        desc() {
            let r = EVO.amt >= 2 ? `<b>${format(300,0)}</b> Fabric` : `<b>${formatMass(uni(1e100))}</b> of black hole`

            return `<i>Reach over ${r} to reset all previous features for gain Atoms & Quarks.</i>`
        },
    },
    protostar: {
        full: "Protostar",
        desc: () => `Reach over <b>${format(1e3,0)}</b> Fabric to reset all previous features for gain Protostars & Quarks.`,
    },
    quarks: {
        full: "Quark",
        desc() {
            let h = `You have <b>${format(player.atom.quarks,0)}</b> Quark.`;

            if (tmp.overflowBefore.quark.gte(tmp.overflow_start.quark))
            h += `<br>(<b>+${format(tmp.overflowBefore.quark,0)}</b> gained before <b>overflow</b>)`;

            if (tmp.ea.unl || tmp.epUnl) h += `
            <br class='line'>
            You have <b class='orange'>${tmp.ea.amount.format(0)}</b> Exotic Atoms.
            `
            return h
        },
    },
    md: {
        full: "Mass Dilation",
        desc() {
            let h = `
            You have <b>${formatMass(player.md.mass)} ${player.md.mass.formatGain(tmp.md.mass_gain.mul(tmp.qu.speed),true)}</b> of dilated mass.
            `

            if (tmp.overflowBefore.dm.gte(tmp.overflow_start.dm))
            h += `<br>(<b>+${formatMass(tmp.overflowBefore.dm)}</b> gained before <b>overflow</b>)`;

            if (brokeDil())
            h += `
            <br class='line'>
            You have <b class='sky'>${player.md.break.energy.format(0)} ${player.md.break.energy.formatGain(tmp.bd.energyGain)}</b> Relativistic Energy.<br>
            You have <b class='sky'>${formatMass(player.md.break.mass)} ${player.md.break.mass.formatGain(tmp.bd.massGain,true)}</b> of Relativistic Mass.
            `;

            h += `
            <br class='line'><i>
            ${inMD()?`Reach <b>${formatMass(tmp.md.mass_req)}</b> of normal mass to gain Relativistic Particles, or cancel dilation.`:"Dilate mass, then cancel."}<br><br>Dilating mass will force an atom reset. While mass is dilated, all pre-atom resources and atomic power gain will get their multipliers' exponents raised to 0.8<br>
            </i>`

            return h
        },
    },
    sn: {
        full: "Supernova",
        desc() {
            let h = `
            You became ${getScalingName('supernova')}Supernova <b>${player.supernova.times.format(0)}</b>  times
            <br class='line'>
            You have <b>${player.stars.points.format(0)} ${player.stars.points.formatGain(tmp.stars.gain.mul(tmp.qu.speed))}</b> Collapsed Star.<br>
            You have <b>${player.supernova.stars.format(0)} ${player.supernova.stars.formatGain(tmp.sn.star_gain.mul(tmp.qu.speed))}</b> Neutron Star.
            `

            if (!tmp.sn.gen) h += `<br class='line'>
            <i>Reach over <b>${format(tmp.sn.maxlimit)}</b> collapsed stars to go Supernova.</i>`

            return h
        },
    },
    qu: {
        full: "Quantum Foam",
        desc() {
            let h = `<i>
            Reach over <b>${formatMass(mlt(EVO.amt>=4 ? 1e3 : 1e4))}</b> of normal mass to ${QCs.active()?"complete Quantum Challenge":"go Quantum"}.
            </i>`
            if (EVO.amt >= 4) h += `<br><b class='snake'>Constellation features stay until next Ouroboric.</b>`

            return h
        },
    },
    ue: {
        full: "Universal Elixir",
        desc() {
            return `Reach over <b>${formatMass(mlt(1e3))}</b> of normal mass to go Cosmic.
			<br><b class='green'>Constellations persist until next Ouroboric!</b>`
        },
    },
    br: {
        full: "Death Shard",
        desc() {
            let h = `<i>
            ${player.qu.rip.active ? "Our dimension is Big Ripped. Click to undo." : "Big Rip the Dimension."} (Force a Quantum reset)
            <br><br>
            While in Big Rip, some Entropic Rewards don't work, all Primordium effects are 50% weaker${EVO.amt >= 4 ? "" : "except for Epsilon Particles, which don't work, [qu2] and [qu10] don't work"}, and you are trapped in Quantum Challenge with modifiers ${getQCForceDisp("rip")}. Death Shards are gained based on your normal mass while in Big Rip. Unlock various upgrades from Big Rip.</i>`
			if (EVO.amt == 3) h += "<br class='line'>For this evolution, you can't get Nebulae and buy Protostar Elements!"
			return h
        },
    },
    dark: {
        full: "Dark Ray",
        desc() {
            let h = ``

            if (player.dark.unl) {
                h += `You have <b>${player.dark.shadow.format(0)} ${player.dark.shadow.formatGain(tmp.dark.shadowGain)}</b> Dark Shadow.`
                if (tmp.chal14comp) h += `<br>You have <b>${player.dark.abyssalBlot.format(0)} ${player.dark.abyssalBlot.formatGain(tmp.dark.abGain)}</b> Abyssal Blot.`
                h += `<br class='line'>`
            }
            
            h += `<i>Require <b>Oganesson-118</b> to go Dark.</i><br>
			This resets everything up to this point!`

            return h
        },
    },
    speed: {
        full: "Global Speed",
        desc() {
            let h = ``
			if (quUnl()) h += `<i class='light_green'>
				Pre-Quantum: Speeds up the production of pre-Quantum resources (after exponent, dilation, etc.).
			</i><br>`
			if (tmp.inf_unl) h += `<i class='yellow'>
				Pre-Infinity: Speeds up the production of pre-Infinity resources. Applies pre-Quantum global speed. (after exponent, dilation, etc.)
            </i><br>`
			if (devSpeed != 1) h += `<i class='white'>
				Developer: Console-exclusive command [devSpeed], speeds up everything
            </i><br>`

            return h
        },
    },
    fss: {
        full: "Final Star Shard (FSS)",
        desc() {
            return `Your FSS base is <b>${tmp.matters.FSS_base.format(0)}</b>.
            <br class='line'>
            <i>Reach over <b>${tmp.matters.FSS_req.format(0)}</b> of FSS's base to get Final Star Shard.</i>`
        },
    },
    corrupt: {
        full: "Corrupted Shard",
        desc() {
            let h = `
            Your best ${ EVO.amt >= 2 ? "Wormhole" : "mass of black hole" } in the 16th Challenge is <b>${formatMass(player.dark.c16.bestBH)}</b>.
			<br class='line'>
            ${ player.chal.active == 16 ? "Exit the 16th Challenge." : "Start the 16th Challenge." } (Force a FSS reset!)<br>	
            ${CHALS[16].desc}`

            return h
        },
    },
    inf: {
        full: "Infinity",
        desc() {
			if (!tmp.inf_unl) return `Reach ${formatMass(INF.req)} to go Infinity.`
            let h = `
            Your ${getScalingName('inf_theorem')}Infinity Theorem is <b class="yellow">${player.inf.theorem.format(0)}</b>.
            <br class='line'>
            <i>
            Reach over <b>${formatMass(INF.req)}</b> of normal mass to get Infinity Points and choose Theorem in Core.<br>
            Going Infinity resets everything darkness as well!
            <br><br>
            Your normal mass limit is <b>${formatMass(tmp.inf_limit)}</b>
            </i>`

            return h
        },
    },
    ouroboros: {
        full: "Ouroboric",
        desc() {
			if (!OURO.unl) return "Something happened...";
			return `You're currently at Evolution <b class="snake">${player.evo.times}</b>.<br>
				Evolving will cause something to be changed...<br><br>

				Complete <b class="yellow">Challenge 20</b> to Evolve.
				<br class='line'>
				Ouroboric resets everything up to this point!<br>
				(except Strawberries and Berry Elements)`
        },
    },
}

function updateTooltipResHTML() {
    for (let id in TOOLTIP_RES) {
        if (hover_tooltip.id !== id+'_tooltip') continue;

        let tr_data = TOOLTIP_RES[id]
        let tr = tmp.el[id+'_tooltip']

        if (tr) tr.setTooltip(`<h3 class="${RESOURCES_DIS[id].class}">${tr_data.full}</h3>`+(tr_data.desc?"<br class='line'>"+tr_data.desc():""))
    }
}