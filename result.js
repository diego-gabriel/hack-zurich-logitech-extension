const url = window.location.href;

if (!/^https:\/\/(www\.)?google.com\/search/.test(url)) {
	window.addEventListener("load", function() {
		chrome.runtime.sendMessage({searchResultLoaded: window.location.href}, (response) => {
			const searchWords = response.searchText.split(" ");
			for(let i = 0; i < searchWords.length; i++) {
				window.find(searchWords[i]);
			}
		});



		// const xpath = "//*[contains(text(),'dog')]";
		// const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)
		// let node = result.iterateNext();
		// const xs = [];
		// while (node) {
		// 	xs.push(node);
		// 	node = result.iterateNext();
		// }
		// console.log(xs);
		var nodes = document.getElementsByTagName("*");
		let leafNodes = [];

		for (let i = 0; i < nodes.length; i++) {
			const elem = nodes[i];
			if (elem.children.length == 0 && elem.textContent.toLowerCase().includes("dog")) {
				leafNodes.push(elem)
			}
		}

		debugger;
	});
}
