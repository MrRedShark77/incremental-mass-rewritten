function loadGame(start=true, gotNaN=false) {
    if (!gotNaN) tmp.prevSave = localStorage.getItem("betaSave2")
    wipe()
    load(tmp.prevSave)
    
    if (start) {
        setupHTML()
        setupTooltips()
        setupSnake()
        updateQCModPresets()

        setInterval(save,60000)
        OURO.load()
        for (let x = 0; x < 5; x++) updateTemp()

        updateHTML()

        let t = (Date.now() - player.offline.current)/1000
        if (player.offline.active && t > 60) simulateTime(t)

        updateTooltipResHTML(true)
        for (let x = 0; x < 3; x++) {
            let r = document.getElementById('ratio_d'+x)
            r.value = player.atom.dRatio[x]
            r.addEventListener('input', e=>{
                let n = Number(e.target.value)
                if (n < 1) {
                    player.atom.dRatio[x] = 1
                    r.value = 1
                } else {
                    if (Math.floor(n) != n) r.value = Math.floor(n)
                    player.atom.dRatio[x] = Math.floor(n)
                }
            })
        }
        document.getElementById('auto_qu_input').value = player.qu.auto.input
        document.getElementById('auto_qu_input').addEventListener('input', e=>{
            player.qu.auto.input = e.target.value
        })
        document.onmousemove = e => {
            tmp.cx = e.clientX
            tmp.cy = e.clientY
        }
        document.addEventListener('keydown', e => {keyEvent(e)})
        updateTheoremInv()
        updateTheoremCore()
        updateNavigation()
        updateMuonSymbol(true)
        setInterval(loop, 1000/FPS)
        setInterval(updateStarsScreenHTML, 1000/FPS)
        treeCanvas()
        setInterval(drawTreeHTML, 10)
        setInterval(checkNaN,1000)
        setInterval(updateOneSec,1000)

        setTimeout(()=>{
            tmp.start = true
        },2000)

        if (tmp.april) createConfirm("Do you want to disable softcap everywhere?",'april',()=>{
            createPopup(`You trolled! I can't disable softcap! April Fools! <br><br> <img src="https://media.tenor.com/GryShD35-psAAAAM/troll-face-creepy-smile.gif">`,'troll','Dammit!')
            document.body.style.background = `url(https://usagif.com/wp-content/uploads/2021/4fh5wi/troll-face-26.gif)`
            tmp.aprilEnabled = true
        },()=>{
            createPopup(`<img style="width: 200px; height: 200px" src="https://media.tenor.com/U1dgzSAQk8wAAAAd/kys.gif">`,'kys','die')
        })
    }
}