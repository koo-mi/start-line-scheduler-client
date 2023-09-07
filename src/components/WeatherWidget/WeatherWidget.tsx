import "./WeatherWidget.scss";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { WeatherData } from "../../model/type";
import { WEATHER_API_KEY, WEATHER_API_URL, WEATHER_ICON_URL } from "../../utils/variables";


const WeatherWidget = () => {

    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [date, setDate] = useState<Date>(new Date());

    const [isLoading, setIsLoading] = useState<boolean>(true);

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

        navigator.geolocation.watchPosition(function (_position) {
            // Get geolocation
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                // Get weather info based on geolocation
                getWeather(latitude, longitude);
            });
        },
            function (error) {
                if (error.code == error.PERMISSION_DENIED)
                    getWeather(sessionStorage.startLat, sessionStorage.startLng);
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
                    <Typography>{weatherData!.weather[0].main}</Typography>
                    <img src={`${WEATHER_ICON_URL}/${weatherData!.weather[0].icon}.png`} alt={`${weatherData!.weather[0].main} icon`} />
                </Box>
                <Box className="weather-widget__temp">
                    <p className="weather-widget__current-temp">{Math.round(weatherData!.main.temp)}&deg;C</p>
                    <Box className="weather-widget__min-max">
                        <p>{Math.round(weatherData!.main.temp_max)}</p>
                        <p>{Math.round(weatherData!.main.temp_min)}</p>
                    </Box>
                </Box>
                <Box>
                    <p className="weather-widget__feels">Feels like {Math.round(weatherData!.main.feels_like)}&deg;C</p>
                </Box>

            </Box>
            <Box className="weather-widget__datetime">
                <Typography className="weather-widget__time">{timeDisplay}</Typography>
                <Typography>{dateDisplay}</Typography>
                <Typography>{weatherData!.name}</Typography>
            </Box>
        </Box>
    );
};

export default WeatherWidget;