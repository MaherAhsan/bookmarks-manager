$(document).ready(function () {
	const isObject = (obj) => {
		return typeof obj === "object" && obj !== null && !Array.isArray(obj);
	};
	function appendHeading(element) {
		let heading = document.createElement("h3");
		let collapse = document.createElement("img");
		collapse.dataset.name = "image";
		collapse.src = "images/right.png";
		collapse.className = "icon right";
		let expand = document.createElement("img");
		expand.src = "images/down.png";
		expand.dataset.name = "image";
		expand.className = "icon collapse-true";
		heading.innerHTML = element.title;
		heading.dataset.name = "heading";
		heading.id = element.id;
		heading.append(collapse);
		heading.className = "list-group-item heading";
		heading.append(expand);
		// let line = document.createElement("hr");
		list.append(heading);
		// list.append(line);
	}
	function loop(element) {
		let allBookmarks = [];
		let ul = document.createElement("ul");
		ul.className = "collapse-true";

		ul.dataset.id = element.id;
		$(`[data-id='${element.parentId}'`).append(ul);
		if (element.hasOwnProperty("url")) {
			let bookmarks = document.createElement("li");
			let image = document.createElement("img");
			image.src = "images/2.png";
			image.dataset.name = "image";
			image.className = "icon";
			bookmarks.innerHTML = element.title;
			let button = document.createElement("button");
			button.innerHTML = "&times";
			button.id = element.id;
			bookmarks.dataset.name = "bookmarks";
			bookmarks.dataset.url = element.url;
			button.dataset.name = "remove-child";
			bookmarks.appendChild(image);
			bookmarks.append(button);
			bookmarks.className = "list-group-item";
			ul.append(bookmarks);
			ul.className = "link";
		} else {
			element.children.forEach((element) => {
				let boolean = element.hasOwnProperty("url");
				if (boolean === false) {
					let bookmarks = document.createElement("li");
					let image = document.createElement("img");
					image.dataset.name = "image";
					image.src = "images/1.png";
					image.className = "icon";
					let collapse = document.createElement("img");
					collapse.dataset.name = "image";
					collapse.src = "images/right.png";
					collapse.className = "icon right";
					let expand = document.createElement("img");
					expand.dataset.name = "image";
					expand.src = "images/down.png";
					bookmarks.className = "list-group-item";
					expand.className = "icon down collapse-true";
					bookmarks.innerHTML = element.title;
					let button = document.createElement("button");
					button.innerHTML = "&times";
					button.id = element.id;
					bookmarks.id = element.id;
					bookmarks.dataset.name = "folders";
					button.dataset.name = "remove-tree";
					bookmarks.append(collapse);
					bookmarks.append(expand);

					bookmarks.append(image);
					bookmarks.append(button);
					ul.append(bookmarks);
				}
				loop(element);
			});
		}
	}
	function main() {
		chrome.bookmarks.getTree().then(function (arr) {
			$("#list").html("");
			arr[0].children.forEach((element) => {
				if (element.children.length > 0) {
					console.log(element);
					if (element.title === "Bookmarks bar") {
						appendHeading(element);
						loop(element);
					}
					if (element.title === "Other bookmarks") {
						appendHeading(element);
						loop(element);
					}
					if (element.title === "Speed Dials") {
						appendHeading(element);
						loop(element);
					}
					if (element.title === "Trash") {
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
	$("#list").on("click", (e) => {
		if (e.target.dataset.name === "remove-child") {
			console.log(e.target.id);
			chrome.bookmarks.remove(e.target.id);
		}
		if (e.target.dataset.name === "remove-tree") {
			console.log(e.target.id);
			chrome.bookmarks.removeTree(e.target.id);
		}
		if (e.target.dataset.name === "bookmarks") {
			chrome.tabs.create({
				url: e.target.dataset.url,
			});
		}
		if (e.target.tagName == "img") {
			console.log(e.target);
		}
		if (e.target.dataset.name === "folders") {
			$(`#${e.target.id}`).next().toggleClass("collapse-true");
			e.target.firstElementChild.classList.toggle("collapse-true");
			e.target.children[1].classList.toggle("collapse-true");
		}
		if (e.target.dataset.name === "heading") {
			console.log(e.target);
			$(`#${e.target.id}`).next().toggleClass("collapse-true");
			e.target.firstElementChild.classList.toggle("collapse-true");
			e.target.children[1].classList.toggle("collapse-true");
			$(".link").removeClass("collapse-true");
		}
		if (e.target.dataset.name === "image") {
			e.target.parentElement;
			$(`#${e.target.parentElement.id}`).next().toggleClass("collapse-true");
			e.target.parentElement.firstElementChild.classList.toggle(
				"collapse-true"
			);
			e.target.parentElement.children[1].classList.toggle("collapse-true");
			$(".link").removeClass("collapse-true");
		}
	});
});
