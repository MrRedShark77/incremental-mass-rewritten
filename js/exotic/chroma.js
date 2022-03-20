let CHROMA = {
	unl: () => player.chal.comps[13].gte(15)
}

function toggleChromaBG() {
	if (player.options.noChroma && !confirm("Warning! This will cause high performance for your PC / phone! Are you sure about that?!")) return
	player.options.noChroma = !player.options.noChroma
}

function updateChromaScreen() {
	let unl = CHROMA.unl() && !player.options.noChroma
	tmp.el.chroma_bg.setDisplay(unl)
	if (!unl) return

	let progress = player.stats.maxMass.log10().log10().sub(14).div(16).max(0).min(1).toNumber()
	tmp.el.chroma_bg1.setOpacity(progress)
	tmp.el.chroma_bg2.setOpacity(progress)

	//WARNING: PERFORMANCE!
	let high = false
	tmp.el.chroma_bg2.style.setProperty('background', high ? "linear-gradient(45deg, transparent, white, transparent, transparent)" : "linear-gradient(45deg, transparent, white)")
	tmp.el.chroma_bg3.setDisplay(high)
	if (high) tmp.el.chroma_bg3.setOpacity(progress)
}