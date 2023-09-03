import "./DirectionPage.scss";
import { Alert, Box, Container, FormControl, MenuItem, Modal, Select, Snackbar, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import arrowIcon from "../../assets/icons/arrow_icon.svg";
import transitIcon from "../../assets/icons/transit_icon.svg";
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import TimeSelectModal from "../../components/TimeSelectModal/TimeSelectModal";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const DirectionPage = () => {

    const navigate = useNavigate();

    const [directionData, setDirectionData] = useState({});
    const [locationData, setLocationData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [departure, setDeparture] = useState();
    const [arrival, setArrival] = useState();

    // Modal & Snackbar
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [locError, setLocError] = useState(false);
    function handleTimeClose() { setShowTimeModal(false); }


    // for Axios call
    const URL = import.meta.env.VITE_SERVER_URL
    const token = sessionStorage.authToken;

    useEffect(() => {
        async function getDirectionData() {

            // If start / end address are the same show err message
            if (sessionStorage.start === sessionStorage.end) {
                return setLocError(true);
            }

            // Get direction data
            const dirRes = await axios.get(`${URL}/direction/${sessionStorage.start}/${sessionStorage.end}/${sessionStorage.time}/${sessionStorage.mode}/${sessionStorage.type}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            // Get location daata 
            const locRes = await axios.get(`${URL}/direction/location`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDeparture(sessionStorage.start);
            setArrival(sessionStorage.end);

            setDirectionData(dirRes.data);
            setLocationData(locRes.data);
            setIsLoading(false);
        }

        getDirectionData();
    }, [sessionStorage.start, sessionStorage.end, sessionStorage.time, sessionStorage.type])

    // Will come back to this
    if (isLoading) { return (<p>Loading...</p>) }

    function chooseType() {
        if (sessionStorage.type === "arrival") {
            return "Arrive by"
        } else if (sessionStorage.type === "departure") {
            return "Depart at"
        }
    }

    function formatTargetTime(time) {
        // for "hr mm" format
        const splitTime = time.split(' ');
        let [hr, min] = splitTime;

        // If the minute is 1 digit, add 0
        if (min.length === 1) {
            min = `0${min}`;
        }

        hr = Number(hr);

        if (hr === 0) {
            return `12:${min}am`;
        } else if (hr < 12) {
            return `${hr}:${min}am`;
        } else if (hr === 12) {
            return `12:${min}pm`;
        } else {
            return `${hr - 12}:${min}pm`;
        }
    }

    function handleStartChange(e) {
        setDeparture(e.target.value);
        sessionStorage.start = e.target.value;
    }

    function handleEndChange(e) {
        setArrival(e.target.value);
        sessionStorage.end = e.target.value;
    }

    return (

        <Container maxWidth="sm" sx={{ mb: "4.5rem" }}>

            {/* Time Selection Modal */}
            <Modal
                open={showTimeModal}
                onClose={handleTimeClose}
                aria-labelledby="time-modal"
                aria-describedby="time-modal"
            >
                <>
                    <TimeSelectModal handleTimeClose={handleTimeClose} />
                </>
            </Modal>

            {/* Alert for location Error */}
            <Snackbar open={locError} autoHideDuration={4000} onClose={() => { setLocError(false) }}>
                <Alert onClose={() => { setLocError(false) }} severity="error" sx={{ width: '100%', mx: 2, my: 5 }}>
                    You must select different location for departure and arrival
                </Alert>
            </Snackbar>


            {/* Direction Header */}
            <Box className="direction-detail__header" sx={{ pb: 0 }}>
                <Typography component="h2" variant="h5" sx={{ fontWeight: 500 }}
                >Directions</Typography>
                <AddLocationAltOutlinedIcon className="direction-detail__location-icon" fontSize="large" onClick={() => { navigate("/direction/location") }} />
            </Box>

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

                                        return <MenuItem key={location.id} value={address}>{location.name}</MenuItem>
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

                                        return <MenuItem key={location.id} value={address}>{location.name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                </div>

                {/* Display Direction Output */}
                <div className='direction-detail__container'>
                    <div className="direction-detail__text-container">
                        <p className='direction-detail__text'>{sessionStorage.type === "arrival" ? "You need to leave by...": "You will get there at..."}</p>
                    </div>
                    <div className="direction-detail__display-container">
                        <img src={transitIcon} alt="transit icon" className='direction-detail__mode-icon' />
                        <div className='direction-detail__time-box'>
                            <h3 className='direction-detail__time'>{directionData.departureTime}</h3>
                        </div>
                    </div>
                </div>
                <div className="direction-detail__info-box">

                    <div className="direction-detail__time-cont">
                        <div>
                            <p className="direction-detail__time-text">{directionData.departureTime} - {directionData.arrivalTime}</p>
                            <p className="direction-detail__dd-text">{directionData.distance} / {directionData.duration}</p>
                        </div>
                    </div>

                    <div className="direction-detail__inst-box">
                        {
                            directionData.stepsSummary.map((step, i) => {
                                // Remove unnecessary address detail
                                const inst = step.instruction.split(',')[0];
                                return (
                                    <div key={i} className="direction-detail__inst">
                                        <p className="direction-detail__inst-item">{inst}</p>
                                        <p className="direction-detail__inst-duration">{step.duration}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </Box>
        </Container>
    );
};

export default DirectionPage;