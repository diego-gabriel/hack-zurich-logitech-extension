const searchedUrls = {}

chrome.runtime.onInstalled.addListener(function() {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (sender.tab) {
			if ("searchResultOpened" in request) {
				searchedUrls[request.searchResultOpened] = request.searchText;
				sendResponse("Okey");
			}
			if ("searchResultLoaded" in request) {
				// send message
				sendResponse({searchText: searchedUrls[request.searchResultLoaded]});
			}
		}
		return true;
	});
});