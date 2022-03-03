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
        setTimeout(_=>{
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
        mlt (mass of Multiverse): 1e1e9 uni<br>
        `,
    },
    fonts: {
        html: `
            <button class="btn" style="font-family: 'Andy Bold';" onclick="player.options.font = 'Andy Bold'">Andy Bold</button>
            <button class="btn" style="font-family: Arial, Helvetica, sans-ser;" onclick="player.options.font = 'Arial, Helvetica, sans-ser'">Arial</button>
            <button class="btn" style="font-family: Bahnschrift;" onclick="player.options.font = 'Bahnschrift'">Bahnschrift</button>
            <button class="btn" style="font-family: Comic Sans MS;" onclick="player.options.font = 'Comic Sans MS'">Comic Sans MS</button>
            <button class="btn" style="font-family: Courier;" onclick="player.options.font = 'Courier'">Courier</button>
            <button class="btn" style="font-family: Cousine;" onclick="player.options.font = 'Cousine'">Cousine</button>
            <button class="btn" style="font-family: 'Flexi IBM VGA False';" onclick="player.options.font = 'Flexi IBM VGA False'">Flexi IBM VGA False</button>
            <button class="btn" style="font-family: Inconsolata;" onclick="player.options.font = 'Inconsolata'">Inconsolata</button>
            <button class="btn" style="font-family: 'Lucida Handwriting';" onclick="player.options.font = 'Lucida Handwriting'">Lucida Handwriting</button>
            <button class="btn" style="font-family: Monospace-Typewritter;" onclick="player.options.font = 'Monospace-Typewritter'">Monospace Typewritter</button>
            <button class="btn" style="font-family: 'MS Sans Serif';" onclick="player.options.font = 'MS Sans Serif'">MS Sans Serif</button>
            <button class="btn" style="font-family: 'Nova Mono';" onclick="player.options.font = 'Nova Mono'">Nova Mono</button>
            <button class="btn" style="font-family: 'Retron2000';" onclick="player.options.font = 'Retron2000'">Retron 2000</button>
            <button class="btn" style="font-family: 'Roboto Mono';" onclick="player.options.font = 'Roboto Mono'">Roboto Mono</button>
            <button class="btn" style="font-family: Verdana, Geneva, Tahoma, sans-serif;" onclick="player.options.font = 'Verdana, Geneva, Tahoma, sans-serif'">Verdana</button>
        `,
    },
    notations: {
        html: `
            <button class="btn" onclick="player.options.notation = 'mixed_sc'">Mixed Scientific</button>
            <button class="btn" onclick="player.options.notation = 'sc'">Scientific</button>
            <button class="btn" onclick="player.options.notation = 'log'">Logarithm</button>
            <button class="btn" onclick="player.options.notation = 'eng'">Engineering</button><br><br>
            <button class="btn" onclick="player.options.notation = 'st'">Standard</button>
            <button class="btn" onclick="player.options.notation = 'elemental'">Elemental</button>
            <button class="btn" onclick="player.options.notation = 'layer'">Prestige Layer</button>
            <button class="btn" onclick="player.options.notation = 'omega'">Omega</button>
            <button class="btn" onclick="player.options.notation = 'omega_short'">Omega Short</button>
        `,
    },
    supernova10: {
        html: `
            Congratulations!<br><br>You have becomed 10 Supernovae!<br>
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
}

function addPopup(data) {
    tmp.popup.push({
        html: data.html||"",
        button: data.button||"Okay",
        callFunctions: data.callFunction?function() {removePopup();data.callFunctions()}:removePopup,

        width: data.width||600,
        height: data.height||400,
        otherStyle: data.otherStyle||{},
    })
    updatePopup()
}

function updatePopup() {
    tmp.el.popup.setDisplay(tmp.popup.length > 0)
    if (tmp.popup.length > 0) {
        tmp.el.popup_html.setHTML(tmp.popup[0].html)
        tmp.el.popup_html.changeStyle("height", tmp.popup[0].height-35)
        tmp.el.popup_button.setHTML(tmp.popup[0].button)
        tmp.el.popup.changeStyle("width", tmp.popup[0].width)
        tmp.el.popup.changeStyle("height", tmp.popup[0].height)
        for (let x in tmp.popup[0].otherStyle) tmp.el.popup_html.changeStyle(x, tmp.popup[0].otherStyle[x])
    }
}

function removePopup() {
    if (tmp.popup.length <= 1) tmp.popup = []
    let x = []
    for (let i = 1; i < tmp.popup.length; i++) x.push(tmp.popup[i])
    tmp.popup = x
    updatePopup()
}

function updateAarex(toggle) {
	document.querySelectorAll("link").forEach( function(e) {
		if (e.href.includes("aarex.css")) e.remove();
	});

	if (toggle) player.aarex = !player.aarex

	if (player.aarex) {
		var head = document.head;
		var link = document.createElement('link');
		
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = "aarex.css";

		head.appendChild(link);
	}

	document.getElementById("aarex_active").textContent = player.aarex ? "ON" : "OFF"
}