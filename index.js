const list = document.getElementById("list");
const isObject = (obj) => {
	return typeof obj === "object" && obj !== null && !Array.isArray(obj);
};
function appendHeading(element) {
	let heading = document.createElement("h3");
	heading.innerHTML = element.title;
	list.append(heading);
}
function loop(element) {
	let ul = document.createElement("ul");
	ul.dataset.id = element.id;
	let list = document.querySelector(`[data-id='${element.parentId}'`);
	list.append(ul);
	if (element.hasOwnProperty("url")) {
		let bookmarks = document.createElement("li");
		let image = document.createElement("img");
		image.src = "images/2.png";
		image.className = "icon";
		bookmarks.innerHTML = element.title;
		let button = document.createElement("button");
		button.innerHTML = "&times";
		bookmarks.dataset.name = "bookmarks";
		bookmarks.dataset.url = element.url;
		button.className = "remove-child";
		button.id = element.id;
		bookmarks.append(image);
		bookmarks.append(button);
		ul.append(bookmarks);
	} else {
		element.children.forEach((element) => {
			let boolean = element.hasOwnProperty("url");
			if (boolean === false) {
				let bookmarks = document.createElement("li");
				let image = document.createElement("img");
				image.src = "images/1.png";
				image.className = "icon";
				bookmarks.innerHTML = element.title;
				let button = document.createElement("button");
				button.innerHTML = "&times";
				button.id = element.id;
				button.className = "remove-tree";
				bookmarks.appendChild(image);
				bookmarks.append(button);
				ul.append(bookmarks);
			}
			loop(element);
		});
	}
}
function main() {
	chrome.bookmarks.getTree().then(function (arr) {
		list.innerHTML = "";
		arr[0].children.forEach((element) => {
			if (element.children.length > 0) {
				if (element.title === "Bookmarks bar") {
					appendHeading(element);
					loop(element);
				}
				if (element.title === "Other bookmarks") {
					appendHeading(element);
					loop(element);
				}
			}
		});
	});
}
main();
chrome.bookmarks.onChanged.addListener(main);
chrome.bookmarks.onChildrenReordered.addListener(main);
chrome.bookmarks.onCreated.addListener(main);
chrome.bookmarks.onImportEnded.addListener(main);
chrome.bookmarks.onMoved.addListener(main);
chrome.bookmarks.onRemoved.addListener(main);
list.addEventListener("click", (e) => {
	if (e.target.className === "remove-child") {
		chrome.bookmarks.remove(e.target.id);
	}
	if (e.target.className === "remove-tree") {
		chrome.bookmarks.removeTree(e.target.id);
	}
	if (e.target.dataset.name === "bookmarks") {
		chrome.tabs.create({
			url: e.target.dataset.url,
		});
	}
});
