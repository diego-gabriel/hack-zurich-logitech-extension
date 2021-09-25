let currentResultNode = -1;
let magicScrollActive = false;
const resultNodes = document.getElementsByClassName("LC20lb DKV0Md");
const QUESTION_CLASS = "r21Kzd";
const HACK_CLASS = "hack";

function findAncestor(node, ancestorClass) {
	let parent = node.parentNode;
	while(parent && !parent.className?.split(' ').includes(ancestorClass)) {
		console.log(parent.classList);
		parent = parent.parentNode;
	}

	return parent;
}

function updateSelectedResultNode() {

	const nodes = document.getElementsByClassName(HACK_CLASS);
	for (let i = 0; i < nodes.length; i++){
		nodes[i].classList.remove(HACK_CLASS);

	}

	if (currentResultNode < resultNodes.length) {
		const node = resultNodes[currentResultNode];

		node.classList.add(HACK_CLASS);
		node.scrollIntoView({
			block: "center",
			inline: "start",
		});
		node.focus({
			preventScroll: true,
		});

	} else {
		console.log("out of bounds "+currentResultNode);
	}
}

function getSearchText() {
	const query = window.location.search.substr(1);
	let searchText = "";

	if (query) {
		const tokens = query.split('&');

		for (let i = 0; i < tokens.length && searchText === ""; i++) {
			if (tokens[i].startsWith("q=")) {
				searchText = decodeURIComponent(tokens[i].substr(2).replaceAll('+', ' '));
			}
		}
	}


	return searchText;
}

function triggerNavigation(e) {
	const currentNode = resultNodes[currentResultNode];
	if (e.which == 2 && currentNode) {
		const parent = currentNode.parentNode;
		const simulatedClick = new MouseEvent('click', {
			button: e.button, 
			which: e.which, 
			ctrlKey: true
		})
		parent.target = "_blank";
		parent.dispatchEvent(simulatedClick);
		chrome.runtime.sendMessage({searchResultOpened: parent.href, searchText: getSearchText()}, (response) => {
			console.log(response);
		});
		moveToNextResult();
	}
}

function onWheelEvent(e) {
	if (magicScrollActive) {
		e.preventDefault();

		if (e.deltaY > 0) {
			moveToNextResult();
		}

		if (e.deltaY < 0) {
			moveToPrevResult();
		}	
	}
}

function moveToNextResult() {
	if (currentResultNode < resultNodes.length-1) {
		currentResultNode++;
		updateSelectedResultNode();
	}
}

function moveToPrevResult() {
	if (currentResultNode > 0) {
		currentResultNode--;
		updateSelectedResultNode();
	}
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';


if (resultNodes.length > 0) {
	window.addEventListener(wheelEvent, onWheelEvent, wheelOpt);
	window.addEventListener('keydown', (e) => {
		magicScrollActive = e.keyCode === 16;
	});
	window.addEventListener('keyup', (e) => {
		if (e.keyCode === 16) {
			magicScrollActive = false;
		}
	});
	document.onmousedown = triggerNavigation;
}
