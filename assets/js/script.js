// Initializing Variables
var city = $('#get-city');
var searchCity = $('#search-city');
var searchList = $('#search-list');
var createButton;
var localStorageLength;
var latitude;
var longitude;

//Render whatever is present in local storage
for (var i = 0; i < localStorage.length; i++) {
    createButton =$("<button class='w-full text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 search-history'>"
    + JSON.parse(localStorage.getItem(i))
    + "</button>")
    searchList.append(createButton);
}

//Searching city name and saving it to local storage
searchCity.on('click', function () {
    if (city.val() === '') {
        alert("Please enter City Name");
    }
    else {
        createButton = $("<button class='w-full text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 search-history'>" + city.val() + "</button>")
        searchList.append(createButton);
        fetchWeather(city.val());
        saveLastCity();
    }
});

//Event Listner on Search History
$('.search-history').click(function() {
    fetchWeather($(this).text());
})

//Function to get weather
function fetchWeather(input) {

    //fetching lat and long for weather search
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + input + '&limit=1&appid=8e6644460f79289a6c57818a06a12a8d')

    .then ((response) => {
        if (!response.ok) {
          alert("Write Proper City Name");
        }
        return response.json();
    })
    .then(function (data) {
        latitude = data[0].lat;
        longitude = data[0].lon;


        fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=8e6644460f79289a6c57818a06a12a8d')
        .then (function (response) {
            return response.json();
        })
        .then(function (data) {
            $('#city-date').text(input + dayjs().format(' (MM/DD/YYYY)'));
            $('#day-icon').attr('src', 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '.png');
            $('#day-icon').attr('alt', data.weather[0].main + ' weather icon');
            $('#day-temp').text('Temp: ' + data.main.temp + '°C');
            $('#day-wind').text('Wind: ' + data.wind.speed + ' km/h');
            $('#day-humidity').text('Humidity: ' + data.main.humidity + '%');
        })

        fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=8e6644460f79289a6c57818a06a12a8d')
        .then (function (response) {
            return response.json();
        })
        .then(function (data) {
            var filteredData = data.list.filter(element => element.dt_txt.includes('12:00:00'))
            console.log(filteredData)
            for (i = 0; i < 5; i++) {
                var date = filteredData[i].dt_txt
                var newDate = date.replace(' 12:00:00', '');
                var newDateFormat = dayjs(newDate).format('MM/DD/YYYY')
                $('#day-' + (i+1) + '-date').text(newDateFormat);
                $('#day-' + (i+1) + '-icon').attr('src', 'https://openweathermap.org/img/wn/' + filteredData[i].weather[0].icon + '.png');
                $('#day-' + (i+1) + '-icon').attr('alt', filteredData[i].weather[0].main + ' weather icon');
                $('#day-' + (i+1) + '-temp').text('Temp: ' + filteredData[i].main.temp + '°C');
                $('#day-' + (i+1) + '-wind').text('Wind: ' + filteredData[i].wind.speed + ' km/h');
                $('#day-' + (i+1) + '-humidity').text('Humidity: ' + filteredData[i].main.humidity + '%');
            }
        });
    });
}


// function to save searched cities in local storage
function saveLastCity() {
    localStorageLength = localStorage.length;
    localStorage.setItem(localStorageLength, JSON.stringify(city.val()));
}
