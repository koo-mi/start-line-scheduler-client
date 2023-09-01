import { Box, Typography } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const ModalHeader = ({ title, handleClose }) => {

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, mx: 2, borderBottom: 1 }}>
            <Typography component="h3" variant="h5">{title}</Typography>
            <CloseRoundedIcon onClick={handleClose} />
        </Box>
    );
};

export default ModalHeader;