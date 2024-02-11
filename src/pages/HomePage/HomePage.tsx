import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
	Container,
	Box,
	Modal,
	Snackbar,
	Alert,
	SelectChangeEvent
} from '@mui/material';
import Loading from '../../components/Loading/Loading';
import ChecklistItemSimplified from '../../components/ChecklistItemSimplified/ChecklistItemSimplified';
import WeatherWidget from '../../components/WeatherWidget/WeatherWidget';
import './HomePage.scss';
import TimeSelectModal from '../../components/TimeSelectModal/TimeSelectModal';
import {
	checklistSummary,
	directionSummary,
	locationSummary
} from '../../model/type';
import { URL } from '../../utils/variables';
import DirectionControl from '../../components/DirectionControl/DirectionControl';
import LocationSelection from '../../components/LocationSelection/LocationSelection';
import DirectionTimeOutput from '../../components/DirectionTimeOutput/DirectionTimeOutput';

const HomePage = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [departure, setDeparture] = useState<string>('');
	const [arrival, setArrival] = useState<string>('');

	// Holds data from the API
	const [directionData, setDirectionData] = useState<directionSummary | null>(
		null
	);
	const [locationData, setLocationData] = useState<locationSummary>([]);
	const [checklistData, setChecklistData] = useState<checklistSummary>([]);

	const [showTimeModal, setShowTimeModal] = useState(false);
	const [locError, setLocError] = useState(false);

	const token = sessionStorage.authToken;

	useEffect(() => {
		if (!sessionStorage.authToken) {
			return navigate('/login');
		}

		async function getSummary() {
			// Get profile data
			try {
				if (
					!sessionStorage.start ||
					!sessionStorage.end ||
					!sessionStorage.mode ||
					!sessionStorage.time
				) {
					const profile = await axios.get(`${URL}/summary`, {
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					const {
						default_home,
						default_work,
						default_mode,
						default_target_time
					} = profile.data;

					sessionStorage.start = default_home;
					sessionStorage.end = default_work;
					sessionStorage.mode = default_mode;
					sessionStorage.time = default_target_time;
					sessionStorage.type = 'arrival';
					sessionStorage.defStart = default_home;
					sessionStorage.defEnd = default_work;
				}

				// If start / end address are the same show err message
				if (sessionStorage.start === sessionStorage.end) {
					return setLocError(true);
				}

				// For timezone offset in different timezone
				const date = new Date();

				// Get summary data
				const summary = await axios.post(
					`${URL}/summary`,
					{
						origin: sessionStorage.start,
						dest: sessionStorage.end,
						mode: sessionStorage.mode,
						time: sessionStorage.time,
						type: sessionStorage.type,
						timezone: date.getTimezoneOffset() / 60
					},
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);

				// Store data into state variables
				setDirectionData(summary.data.directionData);
				setLocationData(summary.data.locationData);
				setChecklistData(summary.data.checklistData);
				setDeparture(sessionStorage.start);
				setArrival(sessionStorage.end);

				// Store start lat/lng for weather info
				sessionStorage.startLat = summary.data.directionData.start_location.lat;
				sessionStorage.startLng = summary.data.directionData.start_location.lng;

				setIsLoading(false);
			} catch (err: any) {
				// Will come back and change
				console.log(err.response);
				if ((err.response.data.message = 'Invalid Token')) {
					sessionStorage.clear();
					navigate('/login');
				}
			}
		}

		getSummary();
	}, [
		sessionStorage.authToken,
		sessionStorage.time,
		sessionStorage.type,
		sessionStorage.start,
		sessionStorage.end,
		navigate,
		token
	]);

	// If it's still loading
	if (isLoading) {
		return <Loading />;
	}

	// Change the start (departure) select value
	function handleStartChange(e: SelectChangeEvent<string>) {
		// Prevent user from having same origin / dest
		if (sessionStorage.end === e.target.value) {
			return setLocError(true);
		}

		setDeparture(e.target.value);
		sessionStorage.start = e.target.value;
	}

	// Change the end (arrival) select value
	function handleEndChange(e: SelectChangeEvent<string>) {
		// Prevent user from having same origin / dest
		if (sessionStorage.start === e.target.value) {
			return setLocError(true);
		}

		setArrival(e.target.value);
		sessionStorage.end = e.target.value;
	}

	function handleTimeClose() {
		setShowTimeModal(false);
	}

	function swapLocations() {
		// Swapping locations
		setDeparture(sessionStorage.end);
		setArrival(sessionStorage.start);

		const newEnd = sessionStorage.start;
		sessionStorage.start = sessionStorage.end;
		sessionStorage.end = newEnd;
	}

	function restoreDefault() {
		// Restore locations to default
		setDeparture(sessionStorage.defStart);
		setArrival(sessionStorage.defEnd);

		sessionStorage.start = sessionStorage.defStart;
		sessionStorage.end = sessionStorage.defEnd;
	}

	function openTimeModal() {
		setShowTimeModal(true);
	}

	// Render
	return (
		<Container id="main-container" component="main" sx={{ mb: '4.5rem' }}>
			<Modal
				open={showTimeModal}
				onClose={handleTimeClose}
				aria-labelledby="time-modal"
				aria-describedby="time-modal"
			>
				<>
					<TimeSelectModal handleClose={handleTimeClose} />
				</>
			</Modal>

			<Snackbar
				open={locError}
				autoHideDuration={4000}
				onClose={() => {
					setLocError(false);
				}}
			>
				<Alert
					onClose={() => {
						setLocError(false);
					}}
					severity="error"
					sx={{ width: '100%', mx: 2, my: 5 }}
				>
					You must select different location for departure and arrival
				</Alert>
			</Snackbar>

			{/* Weather Component */}
			<WeatherWidget />

			{/* Direction Component */}
			<Box
				sx={{
					bgcolor: '#cfe8fc',
					mt: 2,
					display: 'flex',
					flexDirection: 'column'
				}}
				borderRadius={3}
			>
				{/* Select Location */}
				<div className="select-location__container">
					<DirectionControl
						openTimeModal={openTimeModal}
						restoreDefault={restoreDefault}
						swapLocations={swapLocations}
						isHome={true}
					/>
					<LocationSelection
						locationData={locationData}
						departure={departure}
						handleStartChange={handleStartChange}
						arrival={arrival}
						handleEndChange={handleEndChange}
					/>
				</div>

				{/* Display Direction Output */}
				<DirectionTimeOutput directionData={directionData} isHome={true} />
			</Box>

			{/* Checklist Component */}
			<Box component="ul" className="checklist-home" borderRadius={3}>
				{checklistData.map((item) => {
					return (
						<ChecklistItemSimplified
							key={`${item.id}`}
							title={item.title}
							isDaily={item.isDaily}
							priority={item.priority}
							isChecked={item.isChecked}
							id={item.id}
						/>
					);
				})}
			</Box>
		</Container>
	);
};

export default HomePage;
