import { SelectChangeEvent } from '@mui/material';

/* Data Summary */

export type directionSummary = {
	arrivalTime: string;
	departureTime: string;
	distance: string;
	duration: string;
	stepsSummary: directionStep[];
};

export type directionStep = {
	distance: string;
	duration: string;
	instruction: string;
};

export type locationSummary = locationItem[];

export type locationItem = {
	id: number;
	name: string;
	address: string;
	isHome?: boolean;
	isWork?: boolean;
};

export type checklistSummary = checklistItem[];

export type checklistItem = {
	id: number;
	title: string;
	description?: string;
	priority: string;
	isChecked: boolean;
	isDaily: boolean;
};

/* Modals */

export type ModalBasic = {
	handleClose(): void;
	updateList(): void;
};

export type HandleClose = {
	handleClose(): void;
};

/* Login */
export type LoginState = {
	changeLoginState(state: boolean): void;
};

/* Weather */
export type WeatherData = {
	main: WeatherMain;
	name: string;
	sys: WeatherSys;
	weather: WeatherInfo;
	wind: Wind;
};

export type WeatherMain = {
	feels_like: number;
	humidity: number;
	pressure: number;
	temp: number;
	temp_max: number;
	temp_min: number;
};

export type WeatherSys = {
	sunrise: number;
	sunset: number;
};

export type WeatherInfo = {
	description: string;
	icon: string;
	main: string;
}[];

export type Wind = {
	speed: number;
};

/* Forecast */

export type ForecastData = ForecastItem[];

export type ForecastItem = {
	dt_txt: string;
	main: {
		temp: number;
	};
	weather: WeatherInfo;
	wind: Wind;
};

/* Direction Components */

export type DirectionControlComponent = {
	openTimeModal(): void;
	restoreDefault(): void;
	swapLocations(): void;
	isHome: boolean;
};

export type LocationSelectionComponent = {
	departure: string;
	arrival: string;
	handleStartChange(e: SelectChangeEvent<string>): void;
	handleEndChange(e: SelectChangeEvent<string>): void;
	locationData: locationSummary;
};
