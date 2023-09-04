/* Data Summary */

export type directionSummary = {
    arrivalTime: string,
    departureTime: string,
    distance: string,
    duration: string,
    stepsSummary: directionStep[],
}

export type directionStep = {
    distance: string,
    duration: string,
    instruction: string,
}

export type locationSummary = locationItem[]

export type locationItem = {
    id: Number,
    name: string,
    street: string,
    city: string,
    province: string,
    isHome?: boolean,
    isWork?: boolean,
}

export type checklistSummary = checklistItem[]

export type checklistItem = {
    id: Number,
    title: string,
    description: string,
    priority: string,
    isChecked: boolean,
    isDaily: boolean
}


/* Modals */

export type ModalBasic = {
    handleClose():void,
    updateList(): void 
}

export type HandleClose = {
    handleClose():void
}


/* Login */
export type LoginState = {
    changeLoginState(state: boolean): void
}

/* Weather */
export type WeatherData = {
    main: WeatherMain,
    name: string,
    sys: WeatherSys,
    weather: WeatherInfo,
    wind: Wind
}

export type WeatherMain = {
    feels_like: Number,
    humidity: Number,
    pressure: Number,
    temp: Number,
    temp_max: Number,
    temp_min: Number,
}

export type WeatherSys = {
    sunrise: Number,
    sunset: Number
}

export type WeatherInfo = {
    description: string,
    icon: string,
    main: string,
}[]

export type Wind = {
    speed: Number,
}

/* Forecast */

export type ForecastData = ForecastItem[];

export type ForecastItem = {
    dt_txt: string,
    main: {
        temp: Number
    },
    weather: WeatherInfo,
    wind: Wind
}