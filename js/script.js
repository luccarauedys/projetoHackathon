const btnGetPermission = document.getElementById('btnGetPermission');

function getPermission() {
  window.navigator.geolocation.getCurrentPosition(getLocation, () =>
    alert('Não podemos acessar sua localização :/')
  );
}

btnGetPermission.addEventListener('click', getPermission);

function getLocation(geolocation) {
  let latitude = geolocation.coords.latitude.toString();
  let longitude = geolocation.coords.longitude.toString();

  callAPI(latitude, longitude);
}

function callAPI(lat, lon) {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f068bf83c3071f1f4410c84b9d67694f`;
  const promise = axios.get(`${URL}`);
  promise.then(getWeather);
  promise.catch((err) => {
    console.error(err);
  });
}

function getWeather(response) {
  const city = response.data.name;
  const country = response.data.sys.country;
  const mainInfos = response.data.main;
  const weatherInfos = response.data.weather[0];

  let {
    temp,
    feels_like: feelsLike,
    temp_max: tempMax,
    temp_min: tempMin,
  } = mainInfos;

  let { main: situation } = weatherInfos;

  temp = (temp - 273).toFixed(1);
  feelsLike = (feelsLike - 273).toFixed(1);
  tempMax = (tempMax - 273).toFixed(1);
  tempMin = (tempMin - 273).toFixed(1);

  const infos = [temp, feelsLike, situation, tempMin, tempMax, city, country];

  renderInfos(infos);
}

function renderInfos(infos) {
  const [temp, feelsLike, situation, tempMin, tempMax, city, country] = infos;

  const home = document.getElementById('home');
  home.style.display = 'none';

  if(situation.includes("Rain") || situation.includes("rain")){
    document.body.style.backgroundImage = "url('../images/rain.jpg')";
  } 
  else if (situation.includes("Clouds") || situation.includes("clouds")){
    document.body.style.backgroundImage = "url('../images/clouds.jpg')";
  } 
  else if (situation.includes("Clear") || situation.includes("clear")){
    document.body.style.backgroundImage = "url('../images/clearSky.jpg')";
  } 
  else if (situation.includes("Snow") || situation.includes("snow")){
    document.body.style.backgroundImage = "url('../images/snow.jpg')";
  } 

  const main = document.getElementById('main');
  main.innerHTML = `
      <div class="container glass" id="weatherInfos">
        <div class="mainInfos">
          <h3>${city}, ${country}</h3>
          <h1 class="temp">${temp}&degC</h1>
        </div>
        <div class="moreInfos">
          <h3 class="subtitle">Mais informações</h3>
          <p class="infos">Sensação térmica de ${feelsLike}&degC, com temperatura mínima prevista de ${tempMin}&degC e máxima de ${tempMax}&degC.</p>
        </div>
        <button id="btnHome">Voltar para home</button>
      </div>
    </section>
  `;

  const btnHome = document.getElementById("btnHome");
  btnHome.addEventListener('click', () => {
    window.location.reload();
  });
}
