var popups = []
var popupIndex = 0

function updatePopupIndex() {
    let i
    for (i = 0; i < popups.length; i++) {
        if (!popups[i]) {
            popupIndex = i
            return
        }
    }
    popupIndex = i
}

function addNotify(text, duration=3) {
    tmp.notify.push({text: text, duration: duration});
    if (tmp.notify.length == 1) updateNotify()
}

function removeNotify() {
    if (tmp.saving > 0 && tmp.notify[0]?tmp.notify[0].text="Game Saving":false) tmp.saving--
    if (tmp.notify.length <= 1) tmp.notify = []
    let x = []
    for (let i = 1; i < tmp.notify.length; i++) x.push(tmp.notify[i])
    tmp.notify = x
    tmp.el.notify.setVisible(false)
    updateNotify()
}

function updateNotify() {
    if (tmp.notify.length > 0) {
        tmp.el.notify.setHTML(tmp.notify[0].text)
        tmp.el.notify.setVisible(true)
        tmp.el.notify.setClasses({hide: false})
        setTimeout(()=>{
            tmp.el.notify.setClasses({hide: true})
            setTimeout(removeNotify, 750)
        }, tmp.notify[0].duration*1000)
    }
}

const POPUP_GROUPS = {
    help: {
        html: `
        <h1>Mass</h1><br>
        g (gram): 1 g<br>
        kg (kilogram): 1,000 g<br>
        tonne (tonne): 1,000 kg = 1,000,000 g<br>
        MME (mass of Mount Everest): 1.619e14 tonne = 1.619e20 g<br>
        M⊕ (mass of Earth): 36,886,967 MME = 5.972e27 g<br>
        M☉ (mass of Sun): 333,054 M⊕ = 1.989e33 g<br>
        MMWG (mass of Milky Way Galaxy): 1.5e12 M☉ = 2.9835e45 g<br>
        uni (mass of Universe): 50,276,520,864 MMWG = 1.5e56 g<br>
        mlt (mass of Multiverse): 1e1e9 uni (logarithmic)<br>
        mgv (mass of Megaverse): 1e15 mlt<br>
        giv (mass of Gigaverse): 1e15 mgv<br>
        arv^n (mass of n-th Archverse): 1e15 arv^n-1<br>
        `,
    },
    fonts: {
        // <button class="btn" style="font-family: Comic Sans MS;" onclick="player.options.font = 'Comic Sans MS'">Comic Sans MS</button>
        html: `
            <button class="btn" style="font-family: 'Andy Bold';" onclick="player.options.font = 'Andy Bold'">Andy Bold</button>
            <button class="btn" style="font-family: Arial, Helvetica, sans-ser;" onclick="player.options.font = 'Arial, Helvetica, sans-ser'">Arial</button>
            <button class="btn" style="font-family: Bahnschrift;" onclick="player.options.font = 'Bahnschrift'">Bahnschrift</button>
            <button class="btn" style="font-family: Courier;" onclick="player.options.font = 'Courier'">Courier</button>
            <button class="btn" style="font-family: Cousine;" onclick="player.options.font = 'Cousine'">Cousine</button>
            <button class="btn" style="font-family: 'Flexi IBM VGA False';" onclick="player.options.font = 'Flexi IBM VGA False'">Flexi IBM VGA False</button>
            <button class="btn" style="font-family: Inconsolata;" onclick="player.options.font = 'Inconsolata'">Inconsolata</button>
            <button class="btn" style="font-family: 'Lato';" onclick="player.options.font = 'Lato'">Lato</button>
            <button class="btn" style="font-family: 'Lucida Handwriting';" onclick="player.options.font = 'Lucida Handwriting'">Lucida Handwriting</button>
            <button class="btn" style="font-family: Monospace-Typewritter;" onclick="player.options.font = 'Monospace-Typewritter'">Monospace Typewritter</button>
            <button class="btn" style="font-family: 'MS Sans Serif';" onclick="player.options.font = 'MS Sans Serif'">MS Sans Serif</button>
            <button class="btn" style="font-family: 'Noto Sans JP';" onclick="player.options.font = 'Noto Sans JP'">Noto Sans JP</button>
            <button class="btn" style="font-family: 'Nova Mono';" onclick="player.options.font = 'Nova Mono'">Nova Mono</button>
            <button class="btn" style="font-family: 'Nunito';" onclick="player.options.font = 'Nunito'">Nunito</button>
            <button class="btn" style="font-family: 'Retron2000';" onclick="player.options.font = 'Retron2000'">Retron 2000</button>
            <button class="btn" style="font-family: 'Roboto';" onclick="player.options.font = 'Roboto'">Roboto</button>
            <button class="btn" style="font-family: 'Roboto Mono';" onclick="player.options.font = 'Roboto Mono'">Roboto Mono</button>
            <button class="btn" style="font-family: 'Source Sans Pro';" onclick="player.options.font = 'Source Sans Pro'">Source Sans Pro</button>
            <button class="btn" style="font-family: 'Source Serif Pro';" onclick="player.options.font = 'Source Serif Pro'">Source Serif Pro</button>
            <button class="btn" style="font-family: Verdana, Geneva, Tahoma, sans-serif;" onclick="player.options.font = 'Verdana, Geneva, Tahoma, sans-serif'">Verdana</button>
        `,
    },
    notations: {
        html: `
            <button class="btn" onclick="player.options.notation = 'elemental'">Elemental</button>
            <button class="btn" onclick="player.options.notation = 'eng'">Engineering</button>
            <button class="btn" onclick="player.options.notation = 'inf'">Infinity</button>
            <button class="btn" onclick="player.options.notation = 'mixed_sc'">Mixed Scientific</button>
            <button class="btn" onclick="player.options.notation = 'layer'">Prestige Layer</button>
            <button class="btn" onclick="player.options.notation = 'sc'">Scientific</button>
            <button class="btn" onclick="player.options.notation = 'st'">Standard</button>
            <button class="btn" onclick="player.options.notation = 'old_sc'">Old Scientific</button>
            <button class="btn" onclick="player.options.notation = 'omega'">Omega</button>
            <button class="btn" onclick="player.options.notation = 'omega_short'">Omega Short</button>
        `,
    },
    supernova10: {
        html: `
            Congratulations!<br><br>You have becomed 10 Supernovas!<br>
            And you can manualy supernova!<br><br>
            <b>Bosons are unlocked in Supernova tab!</b>
        `,
        width: 400,
        height: 150,
        otherStyle: {
            'font-size': "14px",
        },
    },
    fermions: {
        html: `
            Congratulations!<br><br>You have beated Challenge 10!<br><br>
            <b>Fermions are unlocked in Supernova tab!</b>
        `,
        width: 400,
        height: 150,
        otherStyle: {
            'font-size': "14px",
        },
    },
    qu: {
        html() { return `
            Congratulations!<br><br>You have reached ${formatMass(mlt(1e4))} of mass after beating Challenge 12!<br><br>
            <b>You need to go Quantum!</b>
        `},
        width: 400,
        height: 150,
        otherStyle: {
            'font-size': "14px",
        },
    },
    qus1: {
        html() { return `
            <img src="images/qu_story1.png"><br><br>
            Mass has collapsed while going Quantum! It looks like evaporation! But at what cost?
        `},
        button: "Uhh Oh",
        otherStyle: {
            'font-size': "14px",
        },
    },
    qus2: {
        html() { return `
            <img src="images/qu_story2.png"><br><br>
            Don’t worry, new mechanics will arrive for you!
        `},
        button: "Cool",
        otherStyle: {
            'font-size': "14px",
        },
    },
    en: {
        html() { return `
            Congratulations!<br><br>You have reached ${formatMass(mlt(7.5e6))} of mass!<br><br>
            <b>Entropy is unlocked in Quantum tab!</b>
        `},
        width: 400,
        height: 150,
        otherStyle: {
            'font-size': "14px",
        },
    },
}

const QUOTES = [
    null,
    `
    <h2>Chapter 1: The First Lift</h2><br>
    <img class='quote' src='images/quotes/1.png'><br>
    Your potential of gaining weight starts here. How much mass can you gain?
    `,`
    <h2>Chapter 2: Rage Power</h2><br>
    <img class='quote' src='images/quotes/2.png'><br>
    You feel outrageous and want to be energy-efficient. You are stronger with less effort needed.
    `,`
    <h2>Chapter 3: The Black Hole</h2><br>
    <img class='quote' src='images/quotes/3.png'><br>
    You pulled up a hidden mystery of cosmos. The force was so strong, it forms a black hole!
    `,`
    <h2>Chapter 4: The Atom</h2><br>
    <img class='quote' src='images/quotes/4.png'><br>
    You discovered a Atom! You decompose it to find a physical miracle: Gravity. This helps you to go further!
    `,`
    <h2>Chapter 5: Supernova Born</h2><br>
    <img class='quote' src='images/quotes/5.png'><br>
    A new age of stars rises, while the stars collapsed.  Neutron stars felt elder...
    `,`
    <h2>Chapter 6: The Radiation</h2><br>
    <img class='quote' src='images/quotes/6.png'><br>
    As stars radiate, you dig deeper: Radiation.
    `,`
    <h2>Chapter 7: Scale to Quantum</h2><br>
    <img class='quote' src='images/quotes/7.png'><br>
    Mass has collapsed in quantum scale! Good luck on new features!
    `,`
    <h2>Chapter 8: Ripping Universe</h2><br>
    <img class='quote' src='images/quotes/8.png'><br>
    All the spacetime rips before your eyes!
    `,`
    <h2>Chapter 9: Trapped in Darkness</h2><br>
    <img class='quote' src='images/quotes/9.png'><br>
    You rose up the darkness. Time to research the mysteries of matter!
    `,`
    <h2>Chapter 10: The Corruption</h2><br>
    <img class='quote' src='images/quotes/10.png'><br>
    The final challenge stands against you. Good luck!
    `,`
    <h2>Chapter 11: The Infinity</h2><br>
    <img class='quote' src='images/quotes/11.png'><br>
    Infinity. You have been evolved to a god.
    `,`
    <h2>Chapter 12: Broken Infinity</h2><br>
    <img class='quote' src='images/quotes/12.png'><br>
    Your omnipotence ascends as you surpass Infinity.
    `,
]

function addQuote(i, debug=false) {
    if (!debug) {
        if (player.quotes.includes(i)) return;

        player.quotes.push(i)
    }

    createPopup(QUOTES[i],'quote'+i,`Let's Go!`)
}

function createPopup(text, id, txtButton) {
    if (popups.includes(id)) return

    popups[popupIndex] = id
    updatePopupIndex()

    const popup = document.createElement('div')
    popup.className = 'popup'
    popup.innerHTML = `
    <div>
        ${text}
    </div><br>
    `

    const textButton = document.createElement('button')
    textButton.className = 'btn'
    textButton.innerText = txtButton||"Ok"
    textButton.onclick = () => {
        popups[popups.indexOf(id)] = undefined
        updatePopupIndex()
        popup.remove()
    }

    popup.appendChild(textButton)

    document.getElementById('popups').appendChild(popup)
}

function createConfirm(text, id, yesFunction, noFunction) {
    if (popups.includes(id)) return

    popups[popupIndex] = id
    updatePopupIndex()

    const popup = document.createElement('div')
    popup.className = 'popup'
    popup.innerHTML = `
    <div>
        ${text}
    </div><br>
    `

    const yesButton = document.createElement('button')
    yesButton.className = 'btn'
    yesButton.innerText = "Yes"
    yesButton.onclick = () => {
        popups[popups.indexOf(id)] = undefined
        updatePopupIndex()
        if (yesFunction) yesFunction()
        popup.remove()
    }

    const noButton = document.createElement('button')
    noButton.className = 'btn'
    noButton.innerText = "No"
    noButton.onclick = () => {
        popups[popups.indexOf(id)] = undefined
        updatePopupIndex()
        if (noFunction) noFunction()
        popup.remove()
    }

    popup.appendChild(yesButton)
    popup.appendChild(noButton)

    document.getElementById('popups').appendChild(popup)
}

function createPrompt(text, id, func) {
    if (popups.includes(id)) return

    popups[popupIndex] = id
    updatePopupIndex()

    const popup = document.createElement('div')
    popup.className = 'popup'
    popup.innerHTML = `
    <div>
        ${text}
    </div><br>
    `

    const br = document.createElement("br")

    const input = document.createElement('input')

    const textButton = document.createElement('button')
    textButton.className = 'btn'
    textButton.innerText = "Ok"
    textButton.onclick = () => {
        popups[popups.indexOf(id)] = undefined
        updatePopupIndex()
        if (func) func(input.value)
        popup.remove()
    }

    popup.appendChild(input)

    popup.appendChild(br)

    popup.appendChild(textButton)

    document.getElementById('popups').appendChild(popup)
}

let SEED = [42421n, 18410740n, 9247923n]

function convertStringIntoAGY(s) {
    let ca = ` abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,?!/<>@#$%^&*()_-+=~№;:'"[]{}|`, cl = BigInt(ca.length), r = 0n, sd = SEED[0], result = ''

    for (let i = BigInt(s.length)-1n; i >= 0n; i--) {
        let q = BigInt(ca.indexOf(s[i])), w = q >= 0n ? cl**(BigInt(s.length)-i-1n)*q : 0

        if (i % 2n == 0n && w % 3n == i % (w % 4n + 2n)) w *= (w % 4n + 2n) * (i + 1n)

        r += w * sd

        sd = (sd + SEED[2]**(i % 3n + i * (q + 2n) % 3n)) % SEED[1]
    }

    while (r > 0n) {
        result += ca[r % cl]

        r /= cl
    }

    return result
}

function keyEvent(e) {
    let k = e.keyCode

    // console.log(k)

    if (k == 38 || k == 40) {
        let v = k == 40 ? 1 : -1, t = tmp.tab, s = t

        while (true) {
            t += v
            tt = TABS[1][t]
            if (!tt) {
                tmp.tab = s
                return
            }
            else if (!tt.unl || tt.unl()) {
                tmp.tab = t
                return
            }
        }
    } else if (k == 37 || k == 39) {
        if (!TABS[2][tmp.tab]) return

        let v = k == 39 ? 1 : -1, t = tmp.stab[tmp.tab], s = t

        while (true) {
            t += v
            tt = TABS[2][tmp.tab][t]
            if (!tt) {
                tmp.stab[tmp.tab] = s
                return
            }
            else if (!tt.unl || tt.unl()) {
                tmp.stab[tmp.tab] = t
                return
            }
        }
    }
}

function hideNavigation(i) { player.options.nav_hide[i] = !player.options.nav_hide[i]; updateNavigation() }

function updateNavigation() {
    let ids = [["nav_left_hider","tabs"],["nav_right_hider","resources_table"]]
    let w = 450

    for (i in player.options.nav_hide) {
        let h = player.options.nav_hide[i]

        tmp.el[ids[i][0]].setClasses({toggled: h})
        tmp.el[ids[i][1]].setDisplay(!h)
        if (h) w -= i == 0 ? 198 : 248
    }

    let p = `calc(100% - ${w}px)`

    tmp.el.main_app.changeStyle('width',p)
    tmp.el.nav_btns.changeStyle('width',p)
}

function setupStatsHTML() {
    let h = ""

    for (let i in RANKS.names) {
        h += `<div id="stats_${RANKS.names[i]}_btn" style="width: 145px"><button class="btn_tab" onclick="player.ranks_reward = ${i}">${RANKS.fullNames[i]}</button></div>`
    }

    new Element("ranks_reward_btn").setHTML(h)

    h = ""

    for (let i in SCALE_TYPE) {
        h += `<div id="stats_${SCALE_TYPE[i]}_btn" style="width: 145px"><button class="btn_tab" onclick="player.scaling_ch = ${i}">${FULL_SCALE_NAME[i]}</button></div>`
    }

    new Element("scaling_btn").setHTML(h)

    h = ""

    for (let i in PRESTIGES.names) {
        h += `<div id="stats_${PRESTIGES.names[i]}_btn" style="width: 145px"><button class="btn_tab" onclick="player.pres_reward = ${i}">${PRESTIGES.fullNames[i]}</button></div>`
    }

    new Element("pres_reward_btn").setHTML(h)

    h = ""

    for (let i in ASCENSIONS.names) {
        h += `<div id="stats_${ASCENSIONS.names[i]}_btn" style="width: 145px"><button class="btn_tab" onclick="player.asc_reward = ${i}">${ASCENSIONS.fullNames[i]}</button></div>`
    }

    new Element("asc_reward_btn").setHTML(h)
}

/*
ranks_reward: 0,
pres_reward: 0,
scaling_ch: 0,
*/

function updateStatsHTML() {
    if (tmp.stab[1] == 0) for (let i in RANKS.names) {
        tmp.el[`stats_${RANKS.names[i]}_btn`].setDisplay(player.ranks[RANKS.names[i]].gt(0))
    }
    else if (tmp.stab[1] == 1) for (let i in SCALE_TYPE) {
        tmp.el[`stats_${SCALE_TYPE[i]}_btn`].setDisplay(tmp.scaling[SCALE_TYPE[i]].length>0)
    }
    else if (tmp.stab[1] == 2) for (let i in PRESTIGES.names) {
        tmp.el[`stats_${PRESTIGES.names[i]}_btn`].setDisplay(player.prestiges[i].gt(0))
    }
    else if (tmp.stab[1] == 4) for (let i in ASCENSIONS.names) {
        tmp.el[`stats_${ASCENSIONS.names[i]}_btn`].setDisplay(player.ascensions[i].gt(0))
    }
}