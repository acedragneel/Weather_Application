import './App.css';
import TopButtons from './components/TopButtons';
import Inputs from './components/Inputs';
import TimeAndLocation from './components/TimeAndLocation';
import TempratureAndDetails from './components/TempratureAndDetails';
import Forecast from './components/Forecast';
import getFormattedWeatherData from './services/weatherService';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dateToUtc } from './components/Inputs';


function App() {

  const [query,setQuery] = useState({q:'London'})
  const [date,setDate] = useState({dt:dateToUtc(new Date())})
  const [units, setUnits] = useState('metric')
  const [weather,setWeather] = useState(null)

  useEffect (() =>{
    const fetchWeather = async() =>{
      const message = query.q ? query.q : "current location.";

      toast.info("Fetching weather for " + message);
      console.log("adi", date);
      //const data = 
      await getFormattedWeatherData({ ...query,...date, units }).then(
        (data) =>{
          toast.success(
            `Successfully fetched weather for ${data.name}, ${data.country}}.`
          );
          setWeather(data);
          console.log(data);
          console.log(date);
        })

    };
  
    fetchWeather();
  }, [query, units, date]) 

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-700 to-blue-700";

    return "from-yellow-700 to-orange-700";
  };

  return (
    <div
      className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br  h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}
    >
      <TopButtons setQuery={setQuery}/>
      <Inputs setQuery={setQuery} units ={units} setUnits={setUnits} setDate ={setDate}/>


      {weather && (
        <div>
          <TimeAndLocation weather={weather}/>
          <TempratureAndDetails weather={weather}/>

          <Forecast title="Hourly forecast" items ={weather.hourly} />
          <Forecast title="Daily forecast" items ={weather.daily} />
        </div>
      )}

      <ToastContainer autoClose={5000} theme="colored" newestOnTop={true} />
    </div>
  );
}

export default App;
