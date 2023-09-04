import { Box, Container, ToggleButton, ToggleButtonGroup } from "@mui/material";
import "./TimeSelectModal.scss";
import { useState } from "react";
import { LocalizationProvider, StaticTimePicker } from '@mui/x-date-pickers';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { HandleClose } from "../../model/type";


const TimeSelectModal = ({handleClose}: HandleClose) => {

    const [type, setType] = useState<string>(sessionStorage.type);
    const [time, setTime] = useState<any>(dayjs(`2023-09-01T${sessionStorage.time?.split(' ')[0]}:${sessionStorage.time?.split(' ')[1]}`));;

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setType(newAlignment);
    };

    function handleAccept(): void {
        sessionStorage.time = `${time.$H} ${time.$m}`
    }

    function handleClick (e: any): void {
        sessionStorage.type = e.target.value;
    }

    function handleDepartNow (): void {
        const currTime: any = dayjs(new Date());
        sessionStorage.time = `${currTime.$H} ${currTime.$m}`
        sessionStorage.type = "departure";
        handleClose();
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
                                onChange={(newValue: any)=>{setTime(newValue)}}
                                onAccept={handleAccept}
                                onClose={handleClose}
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