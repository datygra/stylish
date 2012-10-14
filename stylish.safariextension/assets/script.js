var d = document,
	dl = d.location,
	w = window;

ping('getStyles',dl.href);

function injectStyle(css,id) {
	if (!dl.host) return;
//	if (w != w.top) return;
	if (d.getElementById(''+id)) removeStyle(id);
	var regex_timer = /\?timer=(.\d)/gi,
		regex_rnd = /\?rnd=(.\d)/gi,
		time = (new Date()).getTime(),
		timer = function(s,n) {return '?timer='+Math.floor(time/(1000*parseInt(n)))}, // Cahche images for 10 minutes
		rnd = '?rnd='+Math.random(),
		style = d.createElement('style');
	style.setAttribute('id', '' + id);
	style.style.display = 'none !important';
	style.setAttribute('type', 'text/css');
	style.innerText = css.replace(/\r|\n/gm,'').replace(regex_timer,timer).replace(regex_rnd,rnd);
//	d.documentElement.insertBefore(style, null);
//	d.head ? d.head.appendChild(style) : d.documentElement.appendChild(style);
	(d.head || d.documentElement).appendChild(style, null);
}

function removeStyle(id) {
	if (e = document.getElementById(''+id)) {
		e.parentNode.removeChild(e);
	}
}

function ping(name, data) {
    safari.self.tab.dispatchMessage(name, data);
}
 
function pong(event) {
	var n = event.name,
		t = event.target,
		m = event.message;
	switch(n) {
		case 'injectStyle':
			if (m.location == dl.href) injectStyle(m.css,m.id);
		break;
		case 'removeStyle':
			removeStyle(m.id);
		break;
		case 'updateStyle':
		break;
		case 'applyStyle':
			ping('applyStyle',{"id":m.id, "href":dl.href});
		break;
	}
}

function log(l) {
	console.log('injected: ',l);
};

safari.self.addEventListener("message", pong, false);
