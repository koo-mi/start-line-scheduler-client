export const URL = import.meta.env.VITE_SERVER_URL;

export const WEATHER_API_URL: string = import.meta.env.VITE_WEATHER_API_URL;
export const WEATHER_API_KEY: string = import.meta.env.VITE_WEATHER_API_KEY;
export const WEATHER_ICON_URL: string = import.meta.env.VITE_WEATHER_ICON_URL;
export const FORECAST_API_URL: string = import.meta.env.VITE_FORECAST_API_URL;

// Limit the address search to only to US / Canada
export const searchOptions = {
    componentRestrictions: { country: ["us", "ca"] },
    types: ['address']
}

// Regex

export const addressRe = /.{4,},.{2,},.{2,}/;