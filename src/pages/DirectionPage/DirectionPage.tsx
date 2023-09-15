import "./DirectionPage.scss";
import { Alert, Box, Container, Modal, SelectChangeEvent, Snackbar, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import TimeSelectModal from "../../components/TimeSelectModal/TimeSelectModal";
import { directionSummary, locationSummary } from "../../model/type";
import { URL } from "../../utils/variables";
import DirectionControl from "../../components/DirectionControl/DirectionControl";
import LocationSelection from "../../components/LocationSelection/LocationSelection";
import DirectionTimeOutput from "../../components/DirectionTimeOutput/DirectionTimeOutput";

const DirectionPage = () => {

    const navigate = useNavigate();

    const [directionData, setDirectionData] = useState<directionSummary | null>(null);
    const [locationData, setLocationData] = useState<locationSummary>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [departure, setDeparture] = useState<string>("");
    const [arrival, setArrival] = useState<string>("");

    // Modal & Snackbar
    const [showTimeModal, setShowTimeModal] = useState<boolean>(false);
    const [locError, setLocError] = useState<boolean>(false);

    function handleTimeClose(): void { setShowTimeModal(false); };

    const token = sessionStorage.authToken;

    useEffect(() => {
        async function getDirectionData(): Promise<void> {

            // If start / end address are the same show err message
            if (sessionStorage.start === sessionStorage.end) {
                return setLocError(true);
            }

            // For timezone offset in different timezone
            const date = new Date();

            // Get direction data
            const dirRes = await axios.get(`${URL}/direction/${sessionStorage.start}/${sessionStorage.end}/${sessionStorage.time}/${sessionStorage.mode}/${sessionStorage.type}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    timezone: date.getTimezoneOffset() / 60
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
        // Prevent user from having same origin / dest 
        if (sessionStorage.end === e.target.value) {
            return setLocError(true);
        }

        setDeparture(e.target.value);
        sessionStorage.start = e.target.value;
    }

    function handleEndChange(e: SelectChangeEvent) {
        // Prevent user from having same origin / dest 
        if (sessionStorage.start === e.target.value) {
            return setLocError(true);
        }

        setArrival(e.target.value);
        sessionStorage.end = e.target.value;
    }

    function swapLocations() {
        // Swapping locations
        setDeparture(sessionStorage.end);
        setArrival(sessionStorage.start);

        const newEnd = sessionStorage.start
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

    return (

        <Container component="main" id="main-container" sx={{ mb: "4.5rem" }}>

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

            {/* Direction Details */}
            <Box sx={{ bgcolor: '#cfe8fc', mt: 2, display: "flex", flexDirection: "column" }} borderRadius={3}>

                {/* Select Location */}
                <div className="select-location__container">
                    <DirectionControl
                        openTimeModal={openTimeModal}
                        restoreDefault={restoreDefault}
                        swapLocations={swapLocations}
                        isHome={false}
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
                <DirectionTimeOutput directionData={directionData} isHome={false}/>

                {/* Display Instruction */}
                <div className="direction-detail__info-box">

                    <div className="direction-detail__time-cont">
                        <div>
                            <p className="direction-detail__time-text">{directionData!.departureTime} - {directionData!.arrivalTime}</p>
                            <p className="direction-detail__dd-text">{directionData!.distance} / {directionData!.duration}</p>
                        </div>
                    </div>

                    <div className="direction-detail__inst-box">
                        {
                            directionData!.stepsSummary.map((step, i) => {
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