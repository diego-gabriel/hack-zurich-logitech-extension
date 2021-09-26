const url = window.location.href;
const HACK_HIGHLIGHTED = "hack-highlighted";
const HACK_MARKED = 'hack-mark';

let marked = [];
let currentHighlighted = 0;
let magicScrollActive2 = false;

function mark(word) {
	var body = document.getElementsByTagName("body")[0];
	var nodesBuff = body.getElementsByTagName("*");
	const nodes = [];

	for (let i = 0; i < nodesBuff.length; i++) {
		nodes.push(nodesBuff[i]);
	}

	for (let i = 0; i < nodes.length; i++) {
		const elem = nodes[i];
		let originalText = elem.children.length == 0 ? elem.innerHTML : "";
		let innerText = originalText.toLowerCase();
		const index = innerText.indexOf(word);
		if (index >= 0) {
		   innerText = "<span>"+originalText.substring(0,index)+"</span><span class='hack-mark'>" + originalText.substring(index,index+word.length) + "</span><span>" + originalText.substring(index + word.length) +"</span>";
		   elem.innerHTML = innerText;
		}
	}

}

function highlight() {
	const nodes = document.getElementsByClassName(HACK_HIGHLIGHTED);
	for (let i = 0; i < nodes.length; i++){
		nodes[i].classList.remove(HACK_HIGHLIGHTED);
	}

	if (currentHighlighted < marked.length) {
		const node = marked[currentHighlighted];

		node.classList.add(HACK_HIGHLIGHTED);
		node.scrollIntoView({
			block: "center",
			inline: "start",
		});
		node.focus({
			preventScroll: true,
		});

	} 

}

function onWheelEvent2(e) {
	if (magicScrollActive2) {
		e.preventDefault();

		if (e.deltaY > 0) {
			moveToNextMatch2();
		}

		if (e.deltaY < 0) {
			moveToPrevMatch2();
		}	
	}
}

function moveToNextMatch2() {
	if (currentHighlighted < marked.length-1) {
		currentHighlighted++;
		highlight();
	}
}

function moveToPrevMatch2() {
	if (currentHighlighted > 0) {
		currentHighlighted--;
		highlight();
	}
}



function doStuff() {
	chrome.runtime.sendMessage({searchResultLoaded: window.location.href}, (response) => {

		if (!response || !response.searchText) {
			return;
		}

		const searchWords = response.searchText.split(" ");
		for(let i = 0; i < searchWords.length; i++) {
			mark(searchWords[i]);
		}
		marked = document.getElementsByClassName(HACK_MARKED);

		if (marked.length > 0) {

			highlight();

			// modern Chrome requires { passive: false } when adding event
			var supportsPassive = false;
			try {
			  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
			    get: function () { supportsPassive = true; } 
			  }));
			} catch(e) {}

			var wheelOpt = supportsPassive ? { passive: false } : false;
			var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';


			window.addEventListener(wheelEvent, onWheelEvent2, wheelOpt);
			window.addEventListener('keydown', (e) => {
				magicScrollActive2 = e.keyCode === 16;
			});
			window.addEventListener('keyup', (e) => {
				if (e.keyCode === 16) {
					magicScrollActive2 = false;
				}
			});
		}

	});
}

if (!/^https:\/\/(www\.)?google.com/.test(url)) {
	setTimeout(doStuff, 1000);
}


