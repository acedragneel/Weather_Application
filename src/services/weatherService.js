import { DateTime } from "luxon";
import { dateToUtc } from "../components/Inputs";

const API_KEY = "bd29b4e7a9dc1c207749c31f2ff21dd3";

const BASE_URL = "https://api.openweathermap.org/data/2.5"

const getWeatherData = (infoType, searchParams) => {
    const url = new URL(BASE_URL + "/" + infoType);
    url.search = new URLSearchParams({...searchParams, appid:API_KEY}
    )

    console.log(url); 

    return fetch(url)
    .then((res)=> res.json());
    //.then((data)=> data));
};

const formatCurrrentWeather = (data) =>{
    const {
        coord : {lat,lon},
        main: {temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys:{country,sunrise,sunset},
        weather,
        wind: {speed}
    } = data

    const{
        main: details, icon} = weather[0]

    return {lat,lon,temp,feels_like, temp_min,temp_max,humidity,
        name,dt,country,sunrise,sunset,details,icon,speed}
}

const formatForecastWeather = (data) =>{
    let {timezone,daily,hourly} = data;
    daily = daily.slice(1,6).map(d => {
        return{
            title: formatToLocalTime(d.dt, timezone, 'ccc'),
            temp: d.temp.day,
            icon: d.weather[0].icon
        }
    })

    hourly = hourly.slice(1,6).map(d => {
        return{ 
            title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
            temp: d.temp,
            icon: d.weather[0].icon
        }
    })

    return {timezone,daily,hourly}
}

const getFormattedWeatherData = async (searchParams) => {
    console.log("adi", searchParams);

    const formattedCurrrentWeather =  await getWeatherData('weather', searchParams).then(formatCurrrentWeather);

    const {lat, lon} = formattedCurrrentWeather;

    const  formattedForecastWeather = await getWeatherData('onecall',
    { lat,
      lon,
      dt : searchParams.dt,
      exclude:"currently,minutely,alerts", 
      units: searchParams.units,
    }).then(formatForecastWeather);

    return {...formattedCurrrentWeather, ...formattedForecastWeather}
 
};

const formatToLocalTime = (secs, zone, format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a" ) =>
DateTime.fromSeconds(secs).setZone(zone).toFormat(format)

const iconUrlFromCode = (code) => 'http://openweathermap.org/img/wn/'+`${code}`+'@2x.png';

export default getFormattedWeatherData

export {formatToLocalTime, iconUrlFromCode};
