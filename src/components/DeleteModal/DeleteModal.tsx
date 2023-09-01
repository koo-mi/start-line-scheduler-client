import { Box, Button, Container, Typography } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BackspaceIcon from '@mui/icons-material/Backspace';
import axios from "axios";


const DeleteModal = ({ handleDeleteClose, targetId, updateList, type, endpoint }) => {

    // Axios variables
    const URL = import.meta.env.VITE_SERVER_URL
    const token = sessionStorage.authToken;

    async function handleDelete() {
        await axios.delete(`${URL}/${endpoint}/${targetId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        handleDeleteClose();
        updateList();
    }

    return (
        <Container component="section" maxWidth="xs" className="modal" sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                <Box sx={{ display: 'flex', backgroundColor: 'white', width: '90%', flexDirection: 'column', p: 2 }}>
                    {/* Header */}
                    <Box sx={{ textAlign: "right" }}>
                        <CloseRoundedIcon onClick={handleDeleteClose} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography component="h3" variant="h5" sx={{ fontWeight: 700 }}>
                            Delete Confirmation
                        </Typography>
                    </Box>

                    {/* Text */}
                    <Box sx={{ p: 3, textAlign: "center" }}>
                        <Typography>Are you sure you want to delete this {type}? You cannot undo this action.</Typography>

                    </Box>

                    {/* Button */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button type="button" variant="outlined" onClick={handleDeleteClose} fullWidth sx={{ p: 1 }}>
                            Close
                        </Button>
                        <Button type="button" variant="contained" color="error" fullWidth sx={{ p: 1 }} startIcon={<BackspaceIcon />} onClick={handleDelete}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default DeleteModal;