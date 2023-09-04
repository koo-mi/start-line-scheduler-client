import { Box, Typography } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { HandleClose } from "../../model/type";

interface OwnProps extends HandleClose {
    title: string
}

const ModalHeader = ({ title, handleClose }: OwnProps) => {

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, mx: 2, borderBottom: 1 }}>
            <Typography component="h3" variant="h5">{title}</Typography>
            <CloseRoundedIcon onClick={handleClose} />
        </Box>
    );
};

export default ModalHeader;