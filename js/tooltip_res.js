const TOOLTIP_RES = {
    mass: {
        full: "Mass",
        desc() {
            let h = `You have pushed <b>${formatMass(player.mass)}</b>.`;

            if (tmp.overflowBefore.mass.gte(tmp.overflow_start.mass[0]))
            h += `<br>(<b>+${formatMass(tmp.overflowBefore.mass)}</b> gained before <b>overflow</b>)`;

            /*
            if (quUnl())
            h += `
            <br class='line'>You have <b class='red'>${player.rp.points.format(0)} ${player.rp.points.formatGain(tmp.rp.gain.mul(tmp.preQUGlobalSpeed))}</b> Rage Power. (after Quantum)
            <br class='line'>You have <b class='yellow'>${player.bh.dm.format(0)} ${player.bh.dm.formatGain(tmp.bh.dm_gain.mul(tmp.preQUGlobalSpeed))}</b> Dark Matter. (after Quantum)
            `;
            */

            return h
        },
    },
    rp: {
        full: "Rage Power",
        desc() {
            let h = `<i>
            Reach over <b>${formatMass(1e15)}</b> of normal mass to reset previous features for gain Rage Powers.
            </i>`

            return h
        },
    },
    dm: {
        full: "Dark Matter",
        desc() {
            let h = `<i>
            Reach over <b>${format(1e20)}</b> Rage Power to reset all previous features for gain Dark Matters.
            </i>`

            return h
        },
    },
    bh: {
        full: "Black Hole",
        desc() {
            let h = `You have <b>${formatMass(player.bh.mass)}</b> of black hole.`;

            if (tmp.overflowBefore.bh.gte(tmp.overflow_start.bh[0]))
            h += `<br>(<b>+${formatMass(tmp.overflowBefore.bh)}</b> gained before <b>overflow</b>)`;

            if (hasCharger(1))
            h += `
            <br class='line'>You have <b class='corrupted_text'>${formatMass(player.bh.unstable)} ${formatGain(player.bh.unstable,UNSTABLE_BH.calcProduction(),true)}</b> of Unstable Black Hole.
            `;

            /*
            if (quUnl())
            h += `
            <br class='line'>You have <b class='cyan'>${player.atom.points.format(0)} ${player.atom.points.formatGain(tmp.atom.gain.mul(tmp.preQUGlobalSpeed))}</b> Atom. (after Quantum)
            `;
            */

            return h
        },
    },
    atom: {
        full: "Atom",
        desc() {
            let h = `<i>
            Reach over <b>${formatMass(uni(1e100))}</b> of black hole to reset all previous features for gain Atoms & Quarks.
            </i>`

            return h
        },
    },
    quarks: {
        full: "Quark",
        desc() {
            let h = `You have <b>${format(player.atom.quarks,0)}</b> Quark.`;

            if (tmp.overflowBefore.quark.gte(tmp.overflow_start.quark))
            h += `<br>(<b>+${format(tmp.overflowBefore.quark,0)}</b> gained before <b>overflow</b>)`;

            if (tmp.eaUnl) h += `
            <br class='line'>
            You have <b class='orange'>${tmp.exotic_atom.amount.format(0)}</b> Exotic Atoms.
            `

            return h
        },
    },
    md: {
        full: "Mass Dilation",
        desc() {
            let h = `
            You have <b>${formatMass(player.md.mass)} ${player.md.mass.formatGain(tmp.md.mass_gain.mul(tmp.preQUGlobalSpeed),true)}</b> of dilated mass.
            `

            if (tmp.overflowBefore.dm.gte(tmp.overflow_start.dm))
            h += `<br>(<b>+${formatMass(tmp.overflowBefore.dm)}</b> gained before <b>overflow</b>)`;

            if (player.md.break.active)
            h += `
            <br class='line'>
            You have <b class='sky'>${player.md.break.energy.format(0)} ${player.md.break.energy.formatGain(tmp.bd.energyGain)}</b> Relativistic Energy.<br>
            You have <b class='sky'>${formatMass(player.md.break.mass)} ${player.md.break.mass.formatGain(tmp.bd.massGain,true)}</b> of Relativistic Mass.
            `;

            h += `
            <br class='line'><i>
            ${player.md.active?`Reach <b>${formatMass(tmp.md.mass_req)}</b> of normal mass to gain Relativistic Particles, or cancel dilation.`:"Dilate mass, then cancel."}<br><br>Dilating mass will force an atom reset. While mass is dilated, all pre-atom resources and atomic power gain will get their multipliers' exponents raised to 0.8<br>
            </i>`

            return h
        },
    },
    sn: {
        full: "Supernova",
        desc() {
            let h = `
            You have becomed <b>${player.supernova.times.format(0)}</b> ${getScalingName('supernova')}Supernova
            <br class='line'>
            You have <b>${player.stars.points.format(0)} ${player.stars.points.formatGain(tmp.stars.gain.mul(tmp.preQUGlobalSpeed))}</b> Collapsed Star.<br>
            You have <b>${player.supernova.stars.format(0)} ${player.supernova.stars.formatGain(tmp.supernova.star_gain.mul(tmp.preQUGlobalSpeed))}</b> Neutron Star.
            <br class='line'>
            <i>
            ${"Reach over <b>"+format(tmp.supernova.maxlimit)+"</b> collapsed stars to go Supernova"}.
            </i>`

            return h
        },
    },
    glx: {
        full: "Galaxy",
        desc() {
           let h = `You have <b class='galcolor'>`+format(player.galaxy.times,0)+ `</b> Galaxies<br>To collect next Galaxy, you need `+format(tmp.supernova.maxlimitGal) + ` Stars.
           <br class='line'>
           <i>
           </i>`
           return h
        }
    },
    qu: {
        full: "Quantum Foam",
        desc() {
            let h = `<i>
            ${"Reach over <b>"+formatMass(mlt(1e4))+"</b> of normal mass to "+(QCs.active()?"complete Quantum Challenge":"go Quantum")}.
            </i>`

            return h
        },
    },
    br: {
        full: "Death Shard",
        desc() {
            let h = `<i>
            Big Rip the Dimension, then go back.
            <br><br>
            While in Big Rip, Entropy Rewards don't work, all Primordium effects are 50% weaker except for Epsilon Particles, which don't work, supernova tree upgrades qu2 and qu10 don't work, and you are trapped in Quantum Challenge with modifiers [10,2,10,10,5,0,2,10]. Death Shards are gained based on your normal mass while in Big Rip. Unlock various upgrades from Big Rip.
            </i>`

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
            
            h += `<i>
            Require <b>Oganesson-118</b> to go Dark.
            </i>`

            return h
        },
    },
    speed: {
        full: "Global Speed",
        desc() {
            let h = `<i>
            Pre-Quantum: Speeds up the production of pre-Quantum resources (after exponent, dilation, etc.).
            </i>`

            if (tmp.inf_unl) h += `
            <br class='line'>
            <i>
            Pre-Infinity: Speeds up the production of pre-Infinity resources. Applies pre-Quantum global speed. (after exponent, dilation, etc.)
            </i>
            `

            return h
        },
    },
    fss: {
        full: "Final Star Shard (FSS)",
        desc() {
            let h = `
            Your FSS base is <b>${tmp.matters.FSS_base.format(0)}</b>.
            <br class='line'>
            <i>
            Reach over <b>${tmp.matters.FSS_req.format(0)}</b> of FSS's base to get Final Star Shard.
            </i>`

            return h
        },
    },
    corrupt: {
        full: "Corrupted Shard",
        desc() {
            let h = `
            Your best mass of black hole in the 16th Challenge is <b>${formatMass(player.dark.c16.bestBH)}</b>.
            <br class='line'>
            <i>
            Start the 16th Challenge. Earn <b>Corrupted Shards</b> based on your mass of black hole, when exiting the challenge with more than <b>${formatMass('e100')}</b> of black hole.<br><br>
            • You cannot gain rage powers, and all matters' formulas are disabled, and they generate each other. Red matter generates dark matter.<br>
            • Pre-C16 features, such as rank, prestige tiers, main upgrades, elements, tree upgrades, etc. may be corrupted (disabled).<br>
            • You are trapped in Mass Dilation & Dark Run with 100 all glyphs (10 slovak glyphs).<br>
            • Primordium particles are disabled.<br>
            • Pre-Quantum global speed is always set to /100.<br>
            </i>`

            return h
        },
    },
    inf: {
        full: "Infinity",
        desc() {
            let h = `
            Your Infinity Theorem is <b class="yellow">${player.inf.theorem.format(0)}</b>.
            <br class='line'>
            <i>
            Reach over <b>${formatMass(INF.req)}</b> of normal mass to get Infinity Points and choose Theorem in Core.
            <br><br>
            Your normal mass limit is <b>${formatMass(tmp.inf_limit)}</b>
            <br><br>
            Going Infinity resets everything darkness as well!
            </i>`

            return h
        },
    },
    orb: {
        full: "Orb Of Creation",
        desc() {
           let h = `You have <b class='lightsky'>`+format(player.inf.c18.orb,0)+ `</b> Orbs of Creation<br>To collect next Orb, you need `+formatMass(tmp.orbCost) + ` Mass in C18.
           <br class='line'>
           <i>
           Start the 18th challenge. While you get ${formatMass(tmp.orbCost)} mass, you can get <b>Orb of Creations</b><br>
           • You are trapped in C1-C17 challenges<br>
           • You can't gain Dark Rays, But they're capped at 1e12<br>
           • You can't enter Big Rip<br>
           </i>`
           return h
        }
    },

    /**
     * desc() {
            let h = ``

            return h
        },
    */
}

function updateTooltipResHTML(start=false) {
    for (let id in TOOLTIP_RES) {
        if (!start && hover_tooltip.id !== id+'_tooltip') continue;

        let tr_data = TOOLTIP_RES[id]
        let tr = tmp.el[id+'_tooltip']

        if (tr) tr.setTooltip(`<h3>[ ${tr_data.full} ]</h3>`+(tr_data.desc?"<br class='line'>"+tr_data.desc():""))
    }
}