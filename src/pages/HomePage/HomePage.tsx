import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Container, Box, Select, MenuItem, FormControl, Modal, Snackbar, Alert, SelectChangeEvent } from "@mui/material"
import arrowIcon from "../../assets/icons/arrow_icon.svg";
import transitIcon from "../../assets/icons/transit_icon.svg";
import Loading from '../../components/Loading/Loading';
import ChecklistItemSimplified from '../../components/ChecklistItemSimplified/ChecklistItemSimplified';
import WeatherWidget from '../../components/WeatherWidget/WeatherWidget';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './HomePage.scss';
import TimeSelectModal from '../../components/TimeSelectModal/TimeSelectModal';
import { checklistSummary, directionSummary, locationSummary } from '../../model/type';


const HomePage = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [departure, setDeparture] = useState<string>("");
    const [arrival, setArrival] = useState<string>("");

    // Holds data from the API
    const [directionData, setDirectionData] = useState<directionSummary>(null);
    const [locationData, setLocationData] = useState<locationSummary>([]);
    const [checklistData, setChecklistData] = useState<checklistSummary>([]);

    const [showTimeModal, setShowTimeModal] = useState(false);
    const [locError, setLocError] = useState(false);

    // for Axios call
    const URL = import.meta.env.VITE_SERVER_URL
    const token = sessionStorage.authToken;

    useEffect(() => {
        if (!sessionStorage.authToken) {
            navigate("/login");
        }

        async function getSummary() {
            // Get profile data
            try {
                if (!sessionStorage.start || !sessionStorage.end || !sessionStorage.mode || !sessionStorage.time) {

                    const profile = await axios.get(`${URL}/summary`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    const { default_home, default_work, default_mode, default_target_time } = profile.data;

                    sessionStorage.start = default_home;
                    sessionStorage.end = default_work;
                    sessionStorage.mode = default_mode;
                    sessionStorage.time = default_target_time;
                    sessionStorage.type = "arrival"

                }

                // If start / end address are the same show err message
                if (sessionStorage.start === sessionStorage.end) {
                    return setLocError(true);
                }

                // Get summary data
                const summary = await axios.post(`${URL}/summary`, {
                    origin: sessionStorage.start,
                    dest: sessionStorage.end,
                    mode: sessionStorage.mode,
                    time: sessionStorage.time,
                    type: sessionStorage.type
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })

                // Store data into state variables
                setDirectionData(summary.data.directionData);
                setLocationData(summary.data.locationData);
                setChecklistData(summary.data.checklistData);
                setDeparture(sessionStorage.start);
                setArrival(sessionStorage.end);

                setIsLoading(false);
            } catch (err: any) {
                // Will come back and change
                console.log(err.response.data.message);
                if (err.response.data.message = "Invalid Token") {
                    sessionStorage.clear();
                    navigate("/login");
                }
            }
        }

        getSummary();

    }, [sessionStorage.authToken, sessionStorage.time, sessionStorage.type, sessionStorage.start, sessionStorage.end])


    console.log(checklistData);

    // If it's still loading
    if (isLoading) {
        return <Loading />
    }

    function handleStartChange(e: SelectChangeEvent<string>) {
        setDeparture(e.target.value);
        sessionStorage.start = e.target.value;
    }

    function handleEndChange(e: SelectChangeEvent<string>) {
        setArrival(e.target.value);
        sessionStorage.end = e.target.value;
    }

    function formatTargetTime(time: string) {
        // for "hr mm" format
        const splitTime: string[] = time.split(' ');
        let [hr, min] = splitTime;

        // If the minute is 1 digit, add 0
        if (min.length === 1) {
            min = `0${min}`;
        }

        const hour = Number(hr);

        if (hour === 0) {
            return `12:${min}am`;
        } else if (hour < 12) {
            return `${hour}:${min}am`;
        } else if (hour === 12) {
            return `12:${min}pm`;
        } else {
            return `${hour - 12}:${min}pm`;
        }
    }

    function handleTimeClose() { setShowTimeModal(false); }

    function chooseType() {
        if (sessionStorage.type === "arrival") {
            return "Arrive by"
        } else if (sessionStorage.type === "departure") {
            return "Depart at"
        }
    }

    return (
        <Container maxWidth="sm" sx={{ mb: "4.5rem" }}>

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

            <Snackbar open={locError} autoHideDuration={4000} onClose={() => { setLocError(false) }}>
                <Alert onClose={() => { setLocError(false) }} severity="error" sx={{ width: '100%', mx: 2, my: 5 }}>
                    You must select different location for departure and arrival
                </Alert>
            </Snackbar>


            {/* Weather Component */}
            <WeatherWidget />

            {/* Direction Component */}
            <Box sx={{ bgcolor: '#cfe8fc', mt: 2, display: "flex", flexDirection: "column" }} borderRadius={3}>
                {/* Select Location */}
                <div className="select-location__container">

                    <div className='select-location__time-selection' onClick={() => { setShowTimeModal(true) }}>
                        <p>{chooseType()} {formatTargetTime(sessionStorage.time)}</p>
                        <ArrowDropDownIcon />
                    </div>

                    <div className='select-location__location-selection'>

                        {/* Departure */}
                        <FormControl fullWidth>
                            <Select
                                id="start"
                                value={departure}
                                onChange={handleStartChange}
                                inputProps={{ IconComponent: () => null }}
                            >
                                {
                                    locationData.map((location) => {
                                        const address = `${location.street} ${location.city} ${location.province}`.replaceAll(' ', '+')

                                        return <MenuItem key={`${location.id}`} value={address}>{location.name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>

                        <img src={arrowIcon} alt="arrow icon" />

                        {/* Arrival */}
                        <FormControl fullWidth>
                            <Select
                                id="end"
                                value={arrival}
                                onChange={handleEndChange}
                                inputProps={{ IconComponent: () => null }}
                            >
                                {
                                    locationData.map((location) => {
                                        const address = `${location.street} ${location.city} ${location.province}`.replaceAll(' ', '+')

                                        return <MenuItem key={`${location.id}`} value={address}>{location.name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                </div>
                {/* Display Direction Output */}
                <div className='direction__container'>
                    <div className="direction__text-container">
                        <p className='direction__text'>{sessionStorage.type === "arrival" ? "You need to leave by..." : "You will get there at..."}</p>
                    </div>
                    <div className="direction__display-container">
                        <img src={transitIcon} alt="transit icon" className='direction__mode-icon' />
                        <div className='direction__time-box'>
                            <h3 className='direction__time'>
                                {sessionStorage.type === "arrival" ? `${directionData.departureTime}` : `${directionData.arrivalTime}`}</h3>
                        </div>
                    </div>
                </div>
            </Box>

            {/* Checklist Component */}
            <Box component="ul" className='checklist-home' borderRadius={3}>
                {
                    checklistData.map((item) => {
                        return <ChecklistItemSimplified
                            key={`${item.id}`}
                            title={item.title}
                            isDaily={item.isDaily}
                            priority={item.priority}
                            isChecked={item.isChecked}
                            id={item.id}
                        />
                    })
                }
            </Box>
        </Container>
    );
};

export default HomePage;