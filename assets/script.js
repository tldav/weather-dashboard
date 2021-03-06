// DOM Variables
$cityDisplay = $("#city-name");
$searchBtn = $("#search-button");
$searchInput = $("#search-input");
$searchList = $(".list-group");
$weatherStage = $("#weather-stage");
$tCurrent = $("#t-li");
$hCurrent = $("#h-li");
$wCurrent = $("#w-li");
$uCurrent = $("#u-li");
$weatherIcon = $("#icon");
$forecastStage = $("#forecast-stage");

// API Variables
var apiKey = "&appId=a9ef19731f63676098dba0a6b2b8502e";
var nowUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?";
var queryCity = $searchInput.val();

// Current date/time stored in a variable
var date = new Date().toLocaleDateString("en-US");

$searchBtn.on("click", function() {
	// Set the city name in the API url to the user inputted city
	queryCity = $searchInput.val();

	$.ajax({
		url: nowUrl + queryCity + apiKey,
		method: "GET"
	}).then(function(response) {
		// Targets city and weather info from the JSON object
		var cityName = response.name;
		var temperature = (response.main.temp - 273.15) * 1.8 + 32;
		temperature = Math.floor(temperature);
		var humidity = response.main.humidity;
		var windSpeed = response.wind.speed;
		// var iconCode = response.weather[0].icon;
		// var iconUrl =
		// 	"http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

		// Displays the current city and weather based on user input
		$cityDisplay.text(cityName + " " + date);
		// $weatherIcon.attr("src", iconUrl);
		$tCurrent.text("Temperature: " + temperature + " \u00B0F");
		$hCurrent.text("Humidity: " + humidity + "%");
		$wCurrent.text("Wind Speed: " + windSpeed + " MPH");

		// Stores longitude and latitude from first ajax call into variables to be used in the UV ajax call
		var longitude = response.coord.lon;
		var latitude = response.coord.lat;
		// UV index ajax call
		$.ajax({
			url: uvUrl + "lat=" + latitude + "&lon=" + longitude + apiKey,
			method: "GET"
		}).then(function(uvResponse) {
			// Stores and displays the UV index with the current weather
			var uvIndex = uvResponse.value;
			$uCurrent.text("UV Index: " + uvIndex);
		});
	});

	// Displays the weather
	$weatherStage.removeClass("hidden");
	forecast();

	var createList = $("<a>")
		.attr("href", "#")
		.addClass("list-group-item list-group-item-action")
		.text(queryCity);
	$searchList.append(createList);
	$searchInput.val("");
});

function forecast() {
	// Removes forecast of prior searches
	$forecastStage.empty();

	$.ajax({
		url: forecastUrl + queryCity + apiKey,
		method: "GET"
	}).then(function(response) {
		var forecast = response.list;
		// loops through the results
		for (var i = 0; i < forecast.length; i++) {
			var day = String(forecast[i].dt_txt.split(" ")[0]);
			var temperature = (forecast[i].main.temp - 273.15) * 1.8 + 32;
			temperature = Math.floor(temperature);
			var humidity = forecast[i].main.humidity;
			var iconCode = forecast[i].weather[0].icon;
			var iconUrl =
				"http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

			// only grabs forecast results with a time of noon
			var hour = forecast[i].dt_txt.split("-")[2].split(" ")[1];

			if (hour === "12:00:00") {
				var forecastDiv = $("<div>").addClass("col-6 col-lg-2");
				var cardDiv = $("<div>").addClass(
					"card bg-primary text-white p-2"
				);
				var forecastDate = $("<h5>").text(day);
				var iconImg = $("<img>").attr("src", iconUrl);
				var forecastTemp = $("<p>").text(
					"Temp: " + temperature + " \u00B0F"
				);
				var forecastHumidity = $("<p>").text(
					"Humidity: " + humidity + "%"
				);

				cardDiv.append(
					forecastDate,
					iconImg,
					forecastTemp,
					forecastHumidity
				);
				forecastDiv.append(cardDiv);
				$forecastStage.append(forecastDiv);
			}
		}
		$forecastStage.removeClass("hidden");
	});
}
