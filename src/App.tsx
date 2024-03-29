import './App.scss';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import DirectionPage from './pages/DirectionPage/DirectionPage';
import WeatherPage from './pages/WeatherPage/WeatherPage';
import ChecklistPage from './pages/ChecklistPage/ChecklistPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import BottomNav from './components/BottomNav/BottomNav';
import LocationPage from './pages/LocationPage/LocationPage';

function App() {
	const [isLogin, setIsLogin] = useState<boolean>(!!sessionStorage.authToken);

	function changeLoginState(state: boolean) {
		setIsLogin(state);
	}

	return (
		<>
			<BrowserRouter>
				<Header isLogin={isLogin} changeLoginState={changeLoginState} />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route
						path="/login"
						element={<LoginPage changeLoginState={changeLoginState} />}
					/>
					<Route path="/signup" element={<SignupPage />} />
					<Route path="/direction" element={<DirectionPage />} />
					<Route path="/direction/location" element={<LocationPage />} />
					<Route path="/weather" element={<WeatherPage />} />
					<Route path="/checklist" element={<ChecklistPage />} />
				</Routes>
				<BottomNav />
			</BrowserRouter>
		</>
	);
}

export default App;
