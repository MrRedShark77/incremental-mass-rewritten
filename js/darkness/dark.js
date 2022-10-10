const DARK = {
    gain() {
        let x = E(1)

        x = x.mul(tmp.dark.shadowEff.ray)

        return x.floor()
    },
    rayEffect() {
        let a = player.dark.rays
        let x = {}

        x.shadow = a.max(1).pow(2)

        return x
    },
    reset(force=false) {
        if (hasElement(118)||force) {
            if (force) this.doReset()
            else if (player.confirms.dark) createConfirm("Are you sure you want to raise dark?",'dark',CONFIRMS_FUNCTION.dark)
            else CONFIRMS_FUNCTION.dark()
        }
    },
    doReset() {
        let qu = player.qu
        let bmd = player.md.break
        let quSave = getQUSave()

        qu.points = E(0)
        qu.bp = E(0)
        qu.chroma = [E(0),E(0),E(0)]
        qu.cosmic_str = E(0)

        qu.prim.theorems = E(0)
        qu.prim.particles = [E(0),E(0),E(0),E(0),E(0),E(0),E(0),E(0)]

        qu.en.amt = E(0)
        qu.en.eth = quSave.en.eth
        qu.en.hr = quSave.en.hr
        qu.en.rewards = quSave.en.rewards

        qu.rip.active = false
        qu.rip.amt = E(0)

        let k = []

        if (hasElement(127)) k.push(8,9)
        else bmd.active = false
        bmd.energy = E(0)
        bmd.mass = E(0)
        for (let x = 0; x < 10; x++) bmd.upgs[x] = E(0)

        resetMainUpgs(4,k)
        
        if (!hasElement(124)) {
            let qk = ["qu_qol1", "qu_qol2", "qu_qol3", "qu_qol4", "qu_qol5", "qu_qol6", "qu_qol7", "qu_qol8", "qu_qol9", "qu_qol8a", "unl1", "unl2", "unl3", "unl4",
            "qol1", "qol2", "qol3", "qol4", "qol5", "qol6", "qol7", "qol8", "qol9"]

            let qk2 = []
            for (let x = 0; x < player.supernova.tree.length; x++) if (qk.includes(player.supernova.tree[x])) qk2.push(player.supernova.tree[x])
            player.supernova.tree = qk2
        }

        for (let x = 0; x < player.prestiges.length; x++) player.prestiges[x] = E(0)

        let ke = []
        for (let x = 0; x < player.atom.elements.length; x++) {
            let e = player.atom.elements[x]
            if (e < 87 || e > 118) ke.push(e)
        }
        player.atom.elements = ke

        QUANTUM.doReset(true,true)

        tmp.rank_tab = 0
        if (tmp.stab[4] == 3 && !hasElement(127)) tmp.stab[4] = 0

        tmp.pass = false
    },
    shadowGain() {
        let x = E(1)

        x = x.mul(tmp.dark.rayEff.shadow)
        x = x.mul(tmp.bd.upgs[11].eff||1)
        if (hasElement(119)) x = x.mul(elemEffect(119))

        return x
    },
    shadowEff() {
        let x = {}
        let a = player.dark.shadow

        x.ray = a.add(1).log10().add(1)
        x.mass = a.add(1).log10().add(1).root(2)

        if (a.gte(1e6)) x.bp = a.div(1e6).pow(10)

        return x
    },
}

function calcDark(dt, dt_offline) {
    if (player.dark.unl) {
        player.dark.shadow = player.dark.shadow.add(tmp.dark.shadowGain.mul(dt))
    }
}

function updateDarkTemp() {
    let dtmp = tmp.dark

    dtmp.rayEff = DARK.rayEffect()
    dtmp.shadowGain = DARK.shadowGain()
    dtmp.shadowEff = DARK.shadowEff()
    dtmp.gain = DARK.gain()
}

function updateDarkHTML() {
    let og = hasElement(118)
    let unl = og || player.dark.unl
    let dtmp = tmp.dark
	tmp.el.dark_div.setDisplay(unl)
	if (unl) tmp.el.darkAmt.setHTML(player.dark.rays.format(0)+"<br>("+(og?"+"+dtmp.gain.format(0):"require Og-118")+")")

    if (tmp.tab == 7) {
        tmp.el.darkRay.setHTML(player.dark.rays.format(0))
        tmp.el.darkShadow.setHTML(player.dark.shadow.format(0)+" "+player.dark.shadow.formatGain(tmp.dark.shadowGain))

        let eff = dtmp.shadowEff

        let e = `
            Boosts mass gain by <b>^${eff.mass.format(3)}</b><br>
            Boosts dark ray gain by <b>x${eff.ray.format(3)}</b>
        `

        if (eff.bp) e += `<br>Boosts blueprint particles gain by <b>x${eff.bp.format(3)}</b>`

        tmp.el.dsEff.setHTML(e)

        eff = dtmp.rayEff

        tmp.el.drEff.setHTML(`
            Boosts dark shadows gain by <b>x${eff.shadow.format(2)}</b>
        `)
    }
}

function getDarkSave() {
    let s = {
        unl: false,
        rays: E(0),
        shadow: E(0),
    }
    return s
}