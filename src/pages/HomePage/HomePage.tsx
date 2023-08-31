import './HomePage.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Container, Box } from "@mui/material"

import arrowIcon from "../../assets/icons/arrow_icon.svg";
import transitIcon from "../../assets/icons/transit_icon.svg";
import Loading from '../../components/Loading/Loading';
import ChecklistItemSimplified from '../../components/ChecklistItemSimplified/ChecklistItemSimplified';
import WeatherWidget from '../../components/WeatherWidget/WeatherWidget';


const HomePage = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // Holds data from the API
    const [directionData, setDirectionData] = useState({});
    const [locationData, setLocationData] = useState({});
    const [checklistData, setChecklistData] = useState([]);

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
                const profile = await axios.get(`${URL}/summary`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const { default_home, default_work, default_mode, default_target_time } = profile.data;

                // Get summary data
                const summary = await axios.post(`${URL}/summary`, {
                    origin: default_home,
                    dest: default_work,
                    mode: default_mode,
                    time: default_target_time
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

                setIsLoading(false);
            } catch (err) {
                // Will come back and change
                console.log(err.response.data.message);
            }

            

        }

        getSummary();

    }, [sessionStorage.authToken])

    // If it's still loading
    if (isLoading) {
        return <Loading />
    }

    return (
        <Container maxWidth="sm" sx={{ mb: "4.5rem" }}>

            {/* Weather Component */}
            <WeatherWidget />

            {/* Direction Component */}
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
                <div className='direction__container'>
                    <div className="direction__text-container">
                        <p className='direction__text'>You need to leave by...</p>
                    </div>
                    <div className="direction__display-container">
                        <img src={transitIcon} alt="transit icon" className='direction__mode-icon' />
                        <div className='direction__time-box'>
                            <h3 className='direction__time'>{directionData.departureTime}</h3>
                        </div>
                    </div>
                </div>
            </Box>

            {/* Checklist Component */}
            <Box component="ul" className='checklist-home' borderRadius={3}>
                {
                    checklistData.map((item) => {
                        return <ChecklistItemSimplified
                            key={item.id}
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