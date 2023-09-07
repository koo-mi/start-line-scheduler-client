import axios from "axios";
import { useEffect, useState } from "react";
import "./WeatherPage.scss";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { ForecastData, WeatherData } from "../../model/type";
import { FORECAST_API_URL, WEATHER_API_KEY, WEATHER_API_URL, WEATHER_ICON_URL } from "../../utils/variables";


const WeatherPage = () => {

    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getWeather(lat: number, lon: number) {
            try {
                const currRes = await axios.get(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

                const forecastRes = await axios.get(`${FORECAST_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&cnt=4`)

                setCurrentWeather(currRes.data);
                setForecast(forecastRes.data.list);
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
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    function formatForecastTime(dt: string): string {
        const timeOnly = dt.split(' ')[1].split(':')[0];

        if (Number(timeOnly) < 12) {
            if (timeOnly.length !== 1) {
                return `${timeOnly[1]}am`
            }
            return `${timeOnly}am`
        } else if (Number(timeOnly) === 12) {
            return "12pm"
        } else {
            return `${(Number(timeOnly) - 12)}pm`
        }
    }

    function formatSunTime(dt: number): string {
        const timeOnly: string = new Date(dt).toTimeString().split(' ')[0];
        const hrmmss: string[] = timeOnly.split(":");

        return `${hrmmss[0]}:${hrmmss[1]}`;
    }


    return (
        <main className="weather-page">
            <div className="weather-page__container">

                {/* Main Info */}
                <section className="weather-page__main-info">
                    <div className="weather-page__location">
                        <LocationOnOutlinedIcon />
                        <h2>{currentWeather!.name}</h2>
                    </div>

                    <h4 className="weather-page__date">{new Date().toDateString()}</h4>

                    <div className="weather-page__temp-box" >
                        <div>
                            <img src={`${WEATHER_ICON_URL}/${currentWeather!.weather[0].icon}.png`} alt={currentWeather!.weather[0].main} />
                        </div>
                        <div>
                            <div className="weather-page__temp-status">
                                <p className="weather-page__temp">{Math.round(Number(currentWeather!.main.temp))}&deg;C</p>
                                <p className="weather-page__status">{currentWeather!.weather[0].main}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Detail Info */}
                <section className="weather-page__detail-info">
                    <div className="weather-page__detail-row">
                        <div className="weather-page__detail-box">
                            <p className="weather-page__detail-value">{Math.round(Number(currentWeather!.main.temp_max))}</p>
                            <p className="weather-page__detail-property">High</p>
                        </div>
                        <div className="weather-page__detail-box">
                            <p className="weather-page__detail-value">{`${currentWeather!.wind.speed}`}</p>
                            <p className="weather-page__detail-property">{"Wind (m/s)"}</p>
                        </div>
                        <div className="weather-page__detail-box">
                            <p className="weather-page__detail-value">{formatSunTime(currentWeather!.sys.sunrise)}</p>
                            <p className="weather-page__detail-property">Sunrise</p>
                        </div>
                    </div>
                    <div className="weather-page__detail-row">
                        <div className="weather-page__detail-box">
                            <p className="weather-page__detail-value">{Math.round(Number(currentWeather!.main.temp_min))}</p>
                            <p className="weather-page__detail-property">Low</p>
                        </div>
                        <div className="weather-page__detail-box">
                            <p className="weather-page__detail-value">{`${currentWeather!.main.humidity}`}</p>
                            <p className="weather-page__detail-property">Humidity</p>
                        </div>
                        <div className="weather-page__detail-box">
                            <p className="weather-page__detail-value">{formatSunTime(currentWeather!.sys.sunset)}</p>
                            <p className="weather-page__detail-property">Sunset</p>
                        </div>
                    </div>
                </section>

                {/* Forecast */}
                <section className="weather-page__forecast">
                    <div className="forecast">
                        <p>{formatForecastTime(forecast[0].dt_txt)}</p>
                        <img src={`${WEATHER_ICON_URL}/${forecast[0].weather[0].icon}.png`} />
                        <p>{Math.round(forecast[0].main.temp)}&deg;</p>
                    </div>
                    <div className="forecast">
                        <p>{formatForecastTime(forecast[1].dt_txt)}</p>
                        <img src={`${WEATHER_ICON_URL}/${forecast[1].weather[0].icon}.png`} />
                        <p>{Math.round(forecast[1].main.temp)}&deg;</p>
                    </div>
                    <div className="forecast">
                        <p>{formatForecastTime(forecast[2].dt_txt)}</p>
                        <img src={`${WEATHER_ICON_URL}/${forecast[2].weather[0].icon}.png`} />
                        <p>{Math.round(forecast[2].main.temp)}&deg;</p>
                    </div>
                    <div className="forecast">
                        <p>{formatForecastTime(forecast[3].dt_txt)}</p>
                        <img src={`${WEATHER_ICON_URL}/${forecast[3].weather[0].icon}.png`} />
                        <p>{Math.round(forecast[3].main.temp)}&deg;</p>
                    </div>
                </section>

            </div>
        </main>
    );
};

export default WeatherPage;