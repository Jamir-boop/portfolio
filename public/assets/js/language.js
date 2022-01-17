function checkNavLang() {
	const changeToLang = document.querySelector(".change_language");
	const currentLang = document.querySelector(".selected_language");

	const customLang = localStorage.getItem("lang");
	if (customLang !== null) {
		languageto(customLang);
		return;
	}

	if (navigator.language.indexOf("es") != -1) {
		currentLang.innerHTML = "es";
		changeToLang.innerHTML = "en";
		languageto("es");
		return;
	}
	if (navigator.language.indexOf("en") != -1) {
		currentLang.innerHTML = "en";
		changeToLang.innerHTML = "es";
		languageto("en");
	}
}

function languageto(selection) {
	const data = {
		en: {
			about: "about",
			calltoaction: "projects",
			project_vertical: "projects",
			aboutme_vertical: "about&nbsp;me",
		},
		es: {
			about: "info",
			calltoaction: "proyectos",
			project_vertical: "proyectos",
			aboutme_vertical: "sobre&nbsp;mi",
		},
	};

	selection = selection.toLowerCase();
	localStorage.setItem("lang", selection);
	let alternative = "en";
	if (selection == "en") alternative = "es";

	const changeToLang = document.querySelector(".change_language");
	const currentLang = document.querySelector(".selected_language");
	currentLang.innerHTML = selection;
	changeToLang.innerHTML = alternative;

	document.querySelector("html").lang = selection;
	document.querySelector("#start_button").innerHTML =
		"<span id='emoji'>🤓</span>" + data[selection].calltoaction;
	calltoaction_hover();
	document.querySelector(".main__about small").innerHTML =
		data[selection].about;
	document.querySelector(".proyectos #infinite_vertical span").innerHTML =
		data[selection].project_vertical;
	document.querySelector(".aboutme #infinite_vertical span").innerHTML =
		data[selection].aboutme_vertical;
}
checkNavLang();

function calltoaction_hover() {
	const emojis = ["⚡", "😜", "🤯", "🤓", "💖", "😎", "🧐", "🙃", "😳", "🔥"];
	const emoji_span = document.getElementById("emoji");
	emoji_span.innerHTML = emojis[0];
	document
		.getElementById("start_button")
		.addEventListener("mouseenter", () => {
			emoji_span.innerHTML =
				emojis[Math.floor(Math.random() * emojis.length)];
		});

	window.onfocus = () => {
		const start_button = document.getElementById("start_button");
		const before = window.getComputedStyle(start_button, ":before");

		start_button.style.setProperty("--opacity", "1");
		start_button.style.setProperty(
			"--animation",
			"start_button_shine 480ms backwards"
		);
		console.log(before.opacity);
		setTimeout(() => {
			start_button.style.setProperty("--opacity", "0");
			start_button.style.setProperty("--animation", "none");
		}, 500);
	};
}
