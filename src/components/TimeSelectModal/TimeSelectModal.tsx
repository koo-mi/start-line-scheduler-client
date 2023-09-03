import { Box, Container, ToggleButton, ToggleButtonGroup } from "@mui/material";
import "./TimeSelectModal.scss";
import { useState } from "react";
import { LocalizationProvider, StaticTimePicker } from '@mui/x-date-pickers';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";

const TimeSelectModal = ({handleTimeClose}) => {

    const [type, setType] = useState(sessionStorage.type);
    const [time, setTime] = useState<Dayjs>(dayjs(`2023-09-01T${sessionStorage.time?.split(' ')[0]}:${sessionStorage.time?.split(' ')[1]}`));;

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setType(newAlignment);
    };

    function handleAccept() {
        sessionStorage.time = `${time.$H} ${time.$m}`
    }

    function handleClick (e){
        sessionStorage.type = e.target.value;
    }


    function handleDepartNow (e) {
        const currTime = dayjs(new Date());
        sessionStorage.time = `${currTime.$H} ${currTime.$m}`
        sessionStorage.type = "departure";
        handleTimeClose();
    }

    return (
        <Container component="section" maxWidth="xs" className="modal" sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                <Box sx={{ display: 'flex', backgroundColor: 'white', width: '100%', flexDirection: 'column', alignItems: "center" }}>
                    <ToggleButtonGroup
                        className="time-modal__select-type"
                        color="primary"
                        value={type}
                        onChange={handleChange}
                        exclusive
                    >
                        <ToggleButton value="departure" onClick={handleClick}>Depart at</ToggleButton>
                        <ToggleButton value="arrival" onClick={handleClick}>Arrive by</ToggleButton>
                        <ToggleButton value="now" onClick={handleDepartNow}>Depart Now</ToggleButton>
                    </ToggleButtonGroup>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                            components={['StaticTimePicker']}
                        >
                            <DemoItem>
                                <StaticTimePicker 
                                value={time} 
                                onChange={(newValue)=>{setTime(newValue)}}
                                onAccept={handleAccept}
                                onClose={handleTimeClose}
                                />
                            </DemoItem>
                        </DemoContainer>
                    </LocalizationProvider>
                </Box>
            </Box>
        </Container>
    );
};

export default TimeSelectModal;