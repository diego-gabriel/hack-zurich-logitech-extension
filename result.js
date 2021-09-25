const url = window.location.href;


function notifyResultPageLoaded() {
	console.log("should notify search")
	localStorage.setItem("pageLoaded", url);
}

if (!/google.com\/search/.test(url)) {
	notifyResultPageLoaded();
}