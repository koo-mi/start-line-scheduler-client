import "./Loading.scss"
import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = () => {
    return (
        <Box className="loading">
            <CircularProgress size={70}/>
            <Typography component="h3" variant="h4" className="blinking">Loading</Typography>
        </Box>
    );
};

export default Loading;