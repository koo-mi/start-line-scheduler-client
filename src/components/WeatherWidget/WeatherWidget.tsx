import "./WeatherWidget.scss";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { WeatherData } from "../../model/type";


const WeatherWidget = () => {

    const [weatherData, setWeatherData] = useState<WeatherData>(null);
    const [date, setDate] = useState<Date>(new Date());

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const WEATHER_API_KEY: string = import.meta.env.VITE_WEATHER_API_KEY;
    const WEATHER_API_URL: string = import.meta.env.VITE_WEATHER_API_URL;
    const WEATHER_ICON_URL: string = import.meta.env.VITE_WEATHER_ICON_URL;


    useEffect(() => {
        async function getWeather(lat: number, lon: number) {
            try {
                const weatherRes = await axios.get(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

                setWeatherData(weatherRes.data);
                setIsLoading(false);

            } catch (err) {
                console.log(err);
            }
        }

        // Get geolocation
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            // Get weather info based on geolocation
            getWeather(latitude, longitude);
        });

        // Timer
        const timer = setInterval(() => setDate(new Date()), 10000);
        return function cleanup() { clearInterval(timer) };
    }, []);

    if (isLoading) {
        return "Loading...";
    }

    const dateString = date.toDateString().split(" ");
    const timeString = date.toTimeString().split(" ")[0].split(':');

    // Display Time
    const timeDisplay = `${timeString[0]}:${timeString[1]}`;
    const dateDisplay = `${dateString[1]} ${dateString[2]}, ${dateString[3]}`;


    return (
        <Box className="weather-widget" borderRadius={3}>
            <Box className="weather-widget__weather">
                <Box className="weather-widget__current-weather">
                    <Typography>{weatherData.weather[0].main}</Typography>
                    <img src={`${WEATHER_ICON_URL}/${weatherData.weather[0].icon}.png`} alt={`${weatherData.weather[0].main} icon`} />
                </Box>
                <Box className="weather-widget__temp">
                    <p className="weather-widget__current-temp">{Math.round(Number(weatherData.main.temp))}&deg;C</p>
                    <Box className="weather-widget__min-max">
                        <p>{Math.round(Number(weatherData.main.temp_max))}</p>
                        <p>{Math.round(Number(weatherData.main.temp_min))}</p>
                    </Box>
                </Box>
                <Box>
                    <p className="weather-widget__feels">Feels like {Math.round(Number(weatherData.main.feels_like))}&deg;C</p>
                </Box>

            </Box>
            <Box className="weather-widget__datetime">
                <Typography className="weather-widget__time">{timeDisplay}</Typography>
                <Typography>{dateDisplay}</Typography>
                <Typography>{weatherData.name}</Typography>
            </Box>
        </Box>
    );
};

export default WeatherWidget;