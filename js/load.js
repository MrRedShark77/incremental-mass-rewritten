function loadGame() {
    tmp.prevSave = localStorage.getItem("betaSave2")
    load(tmp.prevSave)

	document.getElementById('auto_qu_input').addEventListener('input', e=>{
		player.qu.auto.input = e.target.value
	})
	document.onmousemove = e => {
		tmp.cx = e.clientX
		tmp.cy = e.clientY
	}
	document.addEventListener('keydown', e => {keyEvent(e)})

	setupHTML()
	setupTooltips()
	treeCanvas()

	tmp.start = true
	checkPostLoad()

	setInterval(loop, 1000/FPS)
	setInterval(updateStarsScreenHTML, 1000/FPS)
	setInterval(save, 30000)
	setInterval(drawTreeHTML, 10)
	setInterval(checkNaN,1000)
	setInterval(updateOneSec,1000)

	if (tmp.april) createConfirm("Do you want to disable softcap everywhere?",'april',()=>{
		createPopup(`You trolled! I can't disable softcap! April Fools! <br><br> <img src="https://media.tenor.com/GryShD35-psAAAAM/troll-face-creepy-smile.gif">`,'troll','Dammit!')
		document.body.style.background = `url(https://usagif.com/wp-content/uploads/2021/4fh5wi/troll-face-26.gif)`
		tmp.aprilEnabled = true
	},()=>{
		createPopup(`<img style="width: 200px; height: 200px" src="https://media.tenor.com/U1dgzSAQk8wAAAAd/kys.gif">`,'kys','die')
	})
}