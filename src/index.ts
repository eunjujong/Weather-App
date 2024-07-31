import { displayWeatherData } from './weatherDisplay';

const office = 'MPX'; // example office ID

const fetchAndDisplayData = async () => {
  await displayWeatherData(office);
};

setInterval(fetchAndDisplayData, 3600 * 1000);

fetchAndDisplayData();
