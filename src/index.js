let temperatureCelcius;

(function () {
  function getDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
  }

  function getCurrentWeather(city = 'Lagos') {
    let apiKey = '5f472b7acba333cd8a035ea85a0d4d4c';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const icon = document.getElementById('weatherIcon');
    const weatherDesc = document.getElementById("weatherDesc");
    const wind = document.getElementById("wind");
    const humidity = document.getElementById("humidity");
    const temp = document.getElementById("temp");

    fetch(url, { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        getDailyWeather(data.coord);
        const weather = data.weather[0];
        const mainWeather = data.main;

        icon.src = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;
        weatherDesc.innerText = weather.main;
        wind.innerText = `${data.wind.speed} km/h`;
        humidity.innerText = `${mainWeather.humidity}%`;
        temp.innerText = Math.round(mainWeather.temp);
        temperatureCelcius = Math.round(mainWeather.temp);

        document.getElementById("city").innerText = data.name;
      })
      .catch(err => console.error(err));
  }

  function getDailyWeather(coord) {
    let apiKey = '5f472b7acba333cd8a035ea85a0d4d4c';
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`;
    const container = document.getElementById('dailyHolder');

    fetch(url, { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        const daily = data.daily;

        let div = `<div class="row justify-content-between">`;
        daily.forEach((day, i) => {
          if (i < 7) {
            let celcius = Math.round(day.temp.max);
            let feih = Math.round((celcius * 1.8) + 32);
            div += `<div class="col text-center">
              <p class="m-0">${getDay(day.dt)}</p>
              <p class="m-0">
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" width="100">
              </p>
              <p class="m-0"><span class="text-dark text-bold">${celcius}°C</span> <small>${feih}°F</small></p>
            </div>`;
          }
        });

        div += `</div>`;
        container.innerHTML = div;
      })
      .catch(err => console.error(err));
  }

  function setCelcius() {
    document.getElementById("temp").innerText = Math.round(temperatureCelcius);
  }

  function setFeih() {
    document.getElementById("temp").innerText = Math.round((temperatureCelcius * 1.8) + 32);
  }

  function updateTime() {
    const timeElem = document.getElementById("time");
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    const day = days[d.getDay()];

    let hours = d.getHours();
    let minutes = d.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const time = `${hours}:${minutes} ${ampm}`;

    timeElem.innerText = `${day} ${time}`;
  }

  function getCity() {
    const country = document.getElementById("country");
    const cityName = country.value.toLowerCase().replace(/(^|\s)\S/g, (L) => L.toUpperCase());

    getCurrentWeather(country.value);
    document.getElementById("city").innerText = cityName;
  }

  document.getElementById("button").addEventListener("click", getCity);
  document.getElementById("celcius").addEventListener("click", setCelcius);
  document.getElementById("feih").addEventListener("click", setFeih);

  getCurrentWeather('Lagos');
  updateTime();
})();
