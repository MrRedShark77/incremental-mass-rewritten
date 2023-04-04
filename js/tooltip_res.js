const TOOLTIP_RES = {
    mass: {
        full: "Mass",
        desc() {
            let h = `You have pushed <b>${formatMass(player.mass)}</b>.`;

            if (tmp.overflowBefore.mass.gte(tmp.overflow_start.mass[0]))
            h += `<br>(<b>+${formatMass(tmp.overflowBefore.mass)}</b> gained before <b>overflow</b>)`;

            if (quUnl())
            h += `
            <br class='line'>You have <b class='red'>${player.rp.points.format(0)} ${player.rp.points.formatGain(tmp.rp.gain.mul(tmp.preQUGlobalSpeed))}</b> Rage Power. (after Quantum)
            <br class='line'>You have <b class='yellow'>${player.bh.dm.format(0)} ${player.bh.dm.formatGain(tmp.bh.dm_gain.mul(tmp.preQUGlobalSpeed))}</b> Dark Matter. (after Quantum)
            `;

            return h
        },
    },
    rp: {
        full: "Rage Power",
        desc() {
            let h = `<i>
            Require over <b>${formatMass(1e15)}</b> of normal mass to reset previous features for gain Rage Powers.
            </i>`

            return h
        },
    },
    dm: {
        full: "Dark Matter",
        desc() {
            let h = `<i>
            Require over <b>${format(1e20)}</b> Rage Power to reset all previous features for gain Dark Matters.
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

            if (quUnl())
            h += `
            <br class='line'>You have <b class='cyan'>${player.atom.points.format(0)} ${player.atom.points.formatGain(tmp.atom.gain.mul(tmp.preQUGlobalSpeed))}</b> Atom. (after Quantum)
            `;

            return h
        },
    },
    atom: {
        full: "Atom",
        desc() {
            let h = `<i>
            Require over <b>${formatMass(uni(1e100))}</b> of black hole to reset all previous features for gain Atoms & Quarks.
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
            You have <b class='sky'>${formatMass(player.md.break.mass)} ${player.md.break.mass.formatGain(tmp.bd.massGain,true)}</b> Relativistic Mass.
            `;

            h += `
            <br class='line'><i>
            ${player.md.active?`Reach <b>${formatMass(tmp.md.mass_req)}</b> of normal mass to gain Relativistic Particles, or cancel dilation.`:"Dilate mass, then cancel."}<br><br>When dilating mass, will reset for atom. While mass is dilated: all pre-atom resources, atomic power gains get multiplier's exponent raised to 0.8.<br>
            </i>`

            return h
        },
    },
    sn: {
        full: "Supernova",
        desc() {
            let h = `
            You have <b>${player.stars.points.format(0)} ${player.stars.points.formatGain(tmp.stars.gain.mul(tmp.preQUGlobalSpeed))}</b> Collapsed Star.
            <br class='line'>
            <i>
            ${"Reach over <b>"+format(tmp.supernova.maxlimit)+"</b> collapsed stars to be Supernova"}.
            </i>`

            return h
        },
    },
    qu: {
        full: "Quantum Foam",
        desc() {
            let h = `<i>
            ${"Require over <b>"+formatMass(mlt(1e4))+"</b> of normal mass to "+(QCs.active()?"complete Quantum Challenge":"go Quantum")}.
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
            When Big Rip the Dimension, Entropy Rewards don’t work, all Primordium effects are 50% weaker except Epsilon Particles that don’t work, tree [qu2, qu10] doesn’t work, and you are trapped in Quantum Challenge with modifiers [10,2,10,10,5,0,2,10].
            Death Shards are gained based on your normal mass while Big Ripped.
            Unlock various upgrades from Big Rip.
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
        full: "Pre-Quantum Global Speed",
        desc() {
            let h = `<i>
            Speeds pre-Quantum resources' production. (after exponent & dilation, etc.)
            </i>`

            return h
        },
    },
    fss: {
        full: "Final Star Shard (FSS)",
        desc() {
            let h = `
            Your Final Star Shard's base is <b>${tmp.matters.FSS_base.format(0)}</b>.
            <br class='line'>
            <i>
            Require over <b>${tmp.matters.FSS_req.format(0)}</b> of FSS's base to get Final Star Shard.
            </i>`

            return h
        },
    },
    corrupt: {
        full: "Corrupted Shard",
        desc() {
            let h = `
            Your best mass of black hole in 16th Challenge is <b>${formatMass(player.dark.c16.bestBH)}</b>.
            <br class='line'>
            <i>
            Start the 16th Challenge. Earn <b>Corrupted Shard</b> based on your mass of black hole, when exiting that challenge and reaching <b>${formatMass('e100')}</b> of black hole.<br><br>
            • You cannot gain Rage Power nor dark matters, and all matters’ formula is disabled, and they generate each other. Red matter generates dark matter.<br>
            • Pre-C16 following contents (including rank & prestige tiers, main upgrades, elements, tree and etc.) are corrupted like disabled.<br>
            • You are trapped in Mass Dilation & Dark Run with 100 all glyphs (10 slovak glyphs).<br>
            • Primordium particles disabled.<br>
            • Pre-Quantum global speed always sets to /100.<br>
            </i>`

            return h
        },
    },
    idk: {
        full: "???",
        desc() {
            let h = `
            What am i supposed to do now?...
            <br class='line'>
            <i>
            Reach <b>???</b> of mass to ???.
            </i>
            `

            return h
        },
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

        tr.setTooltip(`<h3>[ ${tr_data.full} ]</h3>`+(tr_data.desc?"<br class='line'>"+tr_data.desc():""))
    }
}