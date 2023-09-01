import "./DirectionPage.scss";
import { Box, Container, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import arrowIcon from "../../assets/icons/arrow_icon.svg";
import transitIcon from "../../assets/icons/transit_icon.svg";
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';

const DirectionPage = () => {

    const navigate = useNavigate();

    const [directionData, setDirectionData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // for Axios call
    const URL = import.meta.env.VITE_SERVER_URL
    const token = sessionStorage.authToken;

    useEffect(() => {
        async function getDirectionData() {
            // Get profile data
            const profile = await axios.get(`${URL}/summary`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const { default_home, default_work, default_mode, default_target_time } = profile.data;

            // Get direction data
            const dirRes = await axios.get(`${URL}/direction/${default_home}/${default_work}/${default_target_time}/${default_mode}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setDirectionData(dirRes.data);
            setIsLoading(false);
        }

        getDirectionData();
    }, [])

    // Will come back to this
    if (isLoading) { return (<p>Loading...</p>) }

    return (
        <Container maxWidth="sm" sx={{ mb: "4.5rem" }}>

            {/* Direction Header */}
            <Box className="direction-detail__header" sx={{pb:0}}>
                <Typography component="h2" variant="h5" sx={{fontWeight: 500}}
                >Directions</Typography>
                <AddLocationAltOutlinedIcon className="direction-detail__location-icon" fontSize="large" onClick={()=>{navigate("/direction/location")}}/>
            </Box>

            <Box sx={{ bgcolor: '#cfe8fc', mt: 2, display: "flex", flexDirection: "column" }} borderRadius={3}>
                {/* Select Location */}
                <div className='select-location__container'>
                    <div className='select-location__item'>
                        <p>Home</p>
                    </div>
                    <img src={arrowIcon} alt="arrow icon" />
                    <div className='select-location__item'>
                        <p>Work</p>
                    </div>
                </div>
                {/* Display Direction Output */}
                <div className='direction-detail__container'>
                    <div className="direction-detail__text-container">
                        <p className='direction-detail__text'>You need to leave by...</p>
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