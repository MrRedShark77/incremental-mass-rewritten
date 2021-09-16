function updateMassTemp() {
    tmp.massGain = FORMS.massGain()
}

function updateTickspeedTemp() {
    tmp.tickspeedEffect = FORMS.tickspeed.effect()
}

function updateUpgradesTemp() {
    if (!tmp.upgs) tmp.upgs = {}
    UPGS.mass.temp()
    UPGS.main.temp()
}

function updateRagePowerTemp() {
    if (!tmp.rp) tmp.rp = {}
    tmp.rp.can = FORMS.rp.gain().gte(1)
}

function updateTemp() {
    updateScalingTemp()
    updateUpgradesTemp()
    updateRagePowerTemp()
    updateTickspeedTemp()
    updateMassTemp()
    updateRanksTemp()
}