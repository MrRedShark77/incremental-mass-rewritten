class Element {
	constructor(el) {
		this.id = typeof el == "string" ? el : el.id;
		this.el = document.getElementById(this.id);
	}

	get style() {
		return this.el.style;
	}

	setTxt(txt) {
		this.el.textContent = txt;
	}
	static setTxt(id, txt) {
		new Element(id).setTxt(txt);
	}

	setHTML(html) {
		this.el.innerHTML = html;
	}
	static setHTML(id, html) {
		new Element(id).setHTML(html);
	}
	
	addHTML(html) {
		this.el.innerHTML += html;
	}
	static addHTML(id, html) {
		new Element(id).addHTML(html);
	}

	setDisplay(bool) {
		this.el.style.display = bool ? "" : "none";
	}
	static setDisplay(id, bool) {
		new Element(id).setDisplay(bool);
	}

	addClass(name) {
		this.el.classList.add(name);
	}
	static addClass(id, name) {
		new Element(id).addClass(name);
	}

	removeClass(name) {
		this.el.classList.remove(name);
	}
	static removeClass(id, name) {
		new Element(id).removeClass(name);
	}

	clearClasses() {
		this.el.className = "";
	}
	static clearClasses(id) {
		new Element(id).clearClasses();
	}

	setClasses(data) {
		this.clearClasses();
		let list = Object.keys(data).filter(x => data[x]);
		for (let i = 0; i < list.length; i++) this.addClass(list[i]);
	}
	static setClasses(id, data) {
		new Element(id).setClasses(data);
	}

	setVisible(bool) {
		this.el.style.visibility = bool ? "visible" : "hidden";
	}
	static setVisible(id, bool) {
		new Element(id).setVisible(bool);
	}

	setOpacity(value) {
		this.el.style.opacity = value;
	}
	static setOpacity(id, value) {
		new Element(id).setOpacity(value);
	}

	changeStyle(type, input) {
		this.el.style[type] = input;
	}
	static changeStyle(id, type, input) {
		new Element(id).changeStyle(type, input);
	}

	isChecked() {
		return this.el.checked;
	}
	static isChecked(id) {
		return new Element(id).isChecked();
	}

	static allFromClass(name) {
		return Array.from(document.getElementsByClassName(name)).map(x => new Element(x.id));
	}

	setAttr(name, input) {
		this.el.setAttribute(name, input);
	}
	static setAttr(id, name, input) {
		new Element(id).setAttribute(name, input);
	}

	setTooltip(input) {
		this.setAttr("tooltip", input);
	}
	static setTooltip(id, input) {
		new Element(id).setAttr("tooltip", input);
	}

	setSize(h, w) {
		this.el.style["min-height"] = h + "px";
		this.el.style["min-width"] = w + "px";
	}
	static setSize(id, h, w) {
		new Element(id).setSize(h, w);
	}
}
