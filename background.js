// chrome.runtime.onInstalled.addListener(function() {
// 	chrome.tabs.onActivated.addListener(async info => {
// 		const tab = await chrome.tabs.get(info.tabId);

// 		const isGoogleSearch = tab.url.startsWith('https://www.google.com/search');
// 		if (isGoogleSearch) {
// 			const resultNodes = searchResultNodes(tab);
// 			console.log(resultNodes);
// 			console.log(tab);
// 		}
// 	});
// });

// function searchResultNodes(tab) {
// 	const res = [];
// 	const resultClass = "LC20lb DKV0Md";

// 	return res;
// }