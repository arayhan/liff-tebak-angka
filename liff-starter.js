window.onload = function() {
	const useNodeJS = false; // if you are not using a node server, set this value to false
	const defaultLiffId = "1653715875-Q78N4vB6"; // change the default LIFF value if you are not using a node server

	// DO NOT CHANGE THIS
	let myLiffId = "";

	// if node is used, fetch the environment variable and pass it to the LIFF method
	// otherwise, pass defaultLiffId
	if (useNodeJS) {
		fetch("/send-id")
			.then(function(reqResponse) {
				return reqResponse.json();
			})
			.then(function(jsonResponse) {
				myLiffId = jsonResponse.id;
				initializeLiffOrDie(myLiffId);
			})
			.catch(function(error) {
				document.getElementById("liffAppContent").classList.add("hidden");
				document
					.getElementById("nodeLiffIdErrorMessage")
					.classList.remove("hidden");
			});
	} else {
		myLiffId = defaultLiffId;
		initializeLiffOrDie(myLiffId);
	}
};

/**
 * Check if myLiffId is null. If null do not initiate liff.
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiffOrDie(myLiffId) {
	if (!myLiffId) {
		document.getElementById("liffAppContent").classList.add("hidden");
		document.getElementById("liffIdErrorMessage").classList.remove("hidden");
	} else {
		initializeLiff(myLiffId);
	}
}

/**
 * Initialize LIFF
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiff(myLiffId) {
	liff
		.init({
			liffId: myLiffId
		})
		.then(() => {
			// start to use LIFF's api
			initializeApp();
		})
		.catch(err => {
			document.getElementById("liffAppContent").classList.add("hidden");
			document
				.getElementById("liffInitErrorMessage")
				.classList.remove("hidden");
		});
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
	displayLiffData();
	displayIsInClientInfo();
	registerButtonHandlers();

	// check if the user is logged in/out, and disable inappropriate button
	if (liff.isLoggedIn()) {
		document.getElementById("liffLogoutButton").classList.remove("hidden");
	} else {
		document.getElementById("liffLoginButton").classList.remove("hidden");
	}
}

/**
 * Display data generated by invoking LIFF methods
 */
function displayLiffData() {
	document.getElementById("isInClient").textContent = liff.isInClient();
	document.getElementById("isLoggedIn").textContent = liff.isLoggedIn();
	if (!JSON.parse(localStorage.getItem("userData"))) {
		liff
			.getProfile()
			.then(function(data) {
				localStorage.setItem("userData", JSON.stringify(data));
				window.location.reload();
			})
			.then(function() {});
	}
}

/**
 * Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
 */
function displayIsInClientInfo() {
	if (liff.isInClient()) {
		document.getElementById("isInClientMessage").textContent =
			"You are opening the app in the in-app browser of LINE.";
	} else {
		document.getElementById("isInClientMessage").textContent =
			"You are opening the app in an external browser.";
	}
}

function registerButtonHandlers() {
	document
		.getElementById("openWindowButton")
		.addEventListener("click", function() {
			liff.openWindow({
				url: "https://liff-tebak-angka.herokuapp.com", // Isi dengan Endpoint URL aplikasi web Anda
				external: true
			});
		});

	document
		.getElementById("closeWindowButton")
		.addEventListener("click", function() {
			if (!liff.isInClient()) {
				sendAlertIfNotInClient();
			} else {
				liff.closeWindow();
			}
		});

	document
		.getElementById("liffLoginButton")
		.addEventListener("click", function() {
			if (!liff.isLoggedIn()) {
				liff.login().then(function() {
					window.location.reload();
				});
			}
		});

	document
		.getElementById("liffLogoutButton")
		.addEventListener("click", function() {
			if (liff.isLoggedIn()) {
				liff.logout();
				localStorage.removeItem("userData");
				window.location.reload();
			}
		});

	document
		.getElementById("sendMessageButton")
		.addEventListener("click", function() {
			if (!liff.isInClient()) {
				sendAlertIfNotInClient();
			} else {
				liff
					.sendMessages([
						{
							type: "text",
							text:
								"Ayo ikutan main tebak angka! \n https://liff-tebak-angka.herokuapp.com/"
						}
					])
					.then(function() {
						window.alert("Pesan telah dikirim!");
					})
					.catch(function(error) {
						window.alert("Error sending message: " + error);
					});
			}
		});
}
function sendAlertIfNotInClient() {
	alert(
		"This button is unavailable as LIFF is currently being opened in an external browser."
	);
}

/**
 * Toggle specified element
 * @param {string} elementId The ID of the selected element
 */
function toggleElement(elementId) {
	const elem = document.getElementById(elementId);
	if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
		elem.style.display = "none";
	} else {
		elem.style.display = "block";
	}
}
