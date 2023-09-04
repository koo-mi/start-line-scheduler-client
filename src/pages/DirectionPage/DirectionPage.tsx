import "./DirectionPage.scss";
import { Alert, Box, Container, FormControl, MenuItem, Modal, Select, SelectChangeEvent, Snackbar, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import arrowIcon from "../../assets/icons/arrow_icon.svg";
import transitIcon from "../../assets/icons/transit_icon.svg";
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import TimeSelectModal from "../../components/TimeSelectModal/TimeSelectModal";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { directionSummary, locationSummary } from "../../model/type";
import { URL, token } from "../../utils/variables";
import { chooseType, formatTargetTime } from "../../utils/functions";

const DirectionPage = () => {

    const navigate = useNavigate();

    const [directionData, setDirectionData] = useState<directionSummary>({});
    const [locationData, setLocationData] = useState<locationSummary>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [departure, setDeparture] = useState<string>("");
    const [arrival, setArrival] = useState<string>("");

    // Modal & Snackbar
    const [showTimeModal, setShowTimeModal] = useState<boolean>(false);
    const [locError, setLocError] = useState<boolean>(false);

    function handleTimeClose(): void { setShowTimeModal(false); };

    
    useEffect(() => {
        async function getDirectionData(): Promise<void> {

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

    function handleStartChange(e: SelectChangeEvent) {
        setDeparture(e.target.value);
        sessionStorage.start = e.target.value;
    }

    function handleEndChange(e: SelectChangeEvent) {
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
                    <TimeSelectModal handleClose={handleTimeClose} />
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
                <div className='direction-detail__container'>
                    <div className="direction-detail__text-container">
                        <p className='direction-detail__text'>{sessionStorage.type === "arrival" ? "You need to leave by..." : "You will get there at..."}</p>
                    </div>
                    <div className="direction-detail__display-container">
                        <img src={transitIcon} alt="transit icon" className='direction-detail__mode-icon' />
                        <div className='direction-detail__time-box'>
                            <h3 className='direction-detail__time'>{sessionStorage.type === "arrival" ? `${directionData.departureTime}` : `${directionData.arrivalTime}`}</h3>
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