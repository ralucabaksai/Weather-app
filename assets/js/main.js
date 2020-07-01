const url = 'http://api.openweathermap.org/data/2.5/weather?';
const apiKey = 'appid=207414ebaee9e5ea84e2cf27cf0d1235';
const unitsButton = document.querySelector('button');
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temperature-value p');
const locationElement = document.querySelector('.location p');
const notificationElement = document.querySelector('.notification');
const weather = {};
let units = localStorage.getItem('units');
localStorage.setItem('units', 'metric');
// console.log(units);
let unitsCookie = getCookie('units');

function setCookie(name, value, days) {
	var expires = '';
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = '; expires=' + date.toUTCString();
	}
	document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name) {
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	document.cookie = name + '=; Max-Age=-99999999;';
}

navigator.geolocation.getCurrentPosition(getWether, showError);

function showError(error) {
	notificationElement.style.display = 'block';
	notificationElement.innerHTML = `<p>${error.message}</p>`;
}

function getWether(position) {
	const lat = position.coords.latitude;
	const long = position.coords.longitude;
	let api = '';
	// console.log(lat);
	// console.log(long);
	const celsius = 'units=metric';
	const fahrenheit = 'units=imperial';
	// console.log(units);

	if (unitsCookie !== 'imperial') {
		api = `${url}&lat=${lat}&lon=${long}&${celsius}&${apiKey}`;
	} else {
		api = `${url}&lat=${lat}&lon=${long}&${fahrenheit}&${apiKey}`;
	}
	// console.log(api);
	fetch(api)
		.then(respose => respose.json())
		.then(data => {
			// console.log(data);
			// console.log(data.name);
			// console.log(data.main.temp);
			// console.log(data.weather[0].icon);
			weather.temperature = data.main.temp;
			weather.location = data.name;
			weather.iconId = data.weather[0].icon;
		})
		.then(() => displayWeather());
}
function displayWeather() {
	iconElement.innerHTML = `<img src="/assets/img/${weather.iconId}.png">`;
	if (unitsCookie === 'metric') {
		tempElement.innerHTML = `${weather.temperature}°<span>C</span>`;
	} else {
		tempElement.innerHTML = `${weather.temperature}°<span>F</span>`;
	}
	locationElement.innerHTML = `${weather.location}`;
}

// setCookie('units', 'metric', 9999);

unitsButton.addEventListener('click', () => {
	units = localStorage.getItem('units');
	unitsCookie = getCookie('units');
	console.log(unitsCookie);

	if (unitsCookie === 'metric') {
		// localStorage.setItem('units', 'imperial');
		// units = localStorage.getItem('units');
		setCookie('units', 'imperial', 99999);
		unitsCookie = getCookie('units');
		console.log(unitsCookie);
		navigator.geolocation.getCurrentPosition(getWether, showError);
	} else {
		// localStorage.setItem('units', 'metric');
		// units = localStorage.getItem('units');
		// console.log(units);

		setCookie('units', 'metric', 99999);
		unitsCookie = getCookie('units');
		console.log(unitsCookie);
		navigator.geolocation.getCurrentPosition(getWether, showError);
	}
});
