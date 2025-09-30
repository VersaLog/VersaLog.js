const Versalog = require("versalog");
const axios = require("axios");

const logger = new Versalog();
logger.setConfig({
  show_file: false,
  show_tag: true,
  all: true,
  tag: "Request",
  mode: "detailed",
});

async function main() {
  const api = "http://api.openweathermap.org/data/2.5/weather";

  const params = {
    q: "location name",
    appid: "api key",
    units: "metric",
    lang: "ja",
  };

  try {
    const req = await axios.get(api, { params });
    const data = req.data;

    const location_name = data.name;
    const weather_description = data.weather[0].description;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const wind_speed = data.wind.speed;

    logger.info("success");
    const msg = `< ${location_name}の天気予報 >\n\n> 天気\n・${weather_description}\n\n> 気温\n・${temperature}°C\n\n> 湿度\n・${humidity}%\n\n> 気圧\n・${pressure} hPa\n\n> 風速\n・${wind_speed} m/s`;
    console.log(msg);
  } catch (error) {
    logger.error("failed");
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

main();
