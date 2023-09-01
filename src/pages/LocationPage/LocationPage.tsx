import { Box, Container, Modal, Typography } from "@mui/material";
import "./LocationPage.scss";
import AddLocationOutlinedIcon from '@mui/icons-material/AddLocationOutlined';
import { useEffect, useState } from "react";
import axios from "axios";
import LocationAdd from "../../components/LocationAdd/LocationAdd";
import LocationEdit from "../../components/LocationEdit/LocationEdit";
import LocationItem from "../../components/LocationItem/LocationItem";
import DeleteModal from "../../components/DeleteModal/DeleteModal";


const LocationPage = () => {

    const [locData, setLocData] = useState([]);
    const [targetId, setTargetId] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    // States for controlling modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // For closing modals
    function handleAddClose() { setShowAddModal(false) };
    function handleDeleteClose() { setShowDeleteModal(false) };
    function handleEditClose() { setShowEditModal(false) };

    // For opening modals
    function handleEditOpen(id) {
        setTargetId(id);
        setShowEditModal(true);
    }
    function handleDeleteOpen(id) {
        setTargetId(id);
        setShowDeleteModal(true);
    }

    // For detecting any change (add, delete, edit)
    const [refreshList, setRefreshList] = useState(true);
    function updateList() { setRefreshList(!refreshList) };

    // for Axios call
    const URL = import.meta.env.VITE_SERVER_URL
    const token = sessionStorage.authToken;

    useEffect(() => {
        async function getLocation() {
            const locations = await axios.get(`${URL}/direction/location`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLocData(locations.data);
            setIsLoading(false);
        }

        getLocation();
    }, [refreshList])

    if (isLoading) {
        return (<p>Loading...</p>)
    }


    // Axios call for edit is not set 
    // Axios call for edit is not set 
    // Axios call for edit is not set 
    // Axios call for edit is not set 


    return (
        <Container maxWidth="sm" sx={{ mb: "4.5rem" }}>

            {/* Add Modal */}
            <Modal
                open={showAddModal}
                onClose={handleAddClose}
                aria-labelledby="add-modal"
                aria-describedby="add-modal"
            >
                <>
                    <LocationAdd handleAddClose={handleAddClose} updateList={updateList} />
                </>
            </Modal>

            {/* Edit Modal */}
            <Modal
                open={showEditModal}
                onClose={handleEditClose}
                aria-labelledby="edit-modal"
                aria-describedby="edit-modal"
            >
                <>
                    <LocationEdit handleEditClose={handleEditClose} updateList={updateList} id={targetId} />
                </>
            </Modal>

            {/* Delete Modal */}
            <Modal
                open={showDeleteModal}
                onClose={handleDeleteClose}
                aria-labelledby="delete-modal"
                aria-describedby="delete-modal"
            >
                <>
                    <DeleteModal handleDeleteClose={handleDeleteClose} targetId={targetId} updateList={updateList} type="location" endpoint="direction/location"/>
                </>
            </Modal>


            {/* Location Header */}
            <Box className="location__header" sx={{ pb: 0 }}>
                <Typography component="h2" variant="h5" sx={{ fontWeight: 500 }}
                >Manage Locations</Typography>
                <AddLocationOutlinedIcon className="location__add-icon" fontSize="large" onClick={() => { setShowAddModal(true) }} />
            </Box>

            {/* List of Locations */}
            <Box sx={{ bgcolor: '#cfe8fc', mt: 2, display: "flex", flexDirection: "column", p: 2.5 }} borderRadius={3}>

                <ul className="checklist__list">
                    {
                        locData.map((item) => {
                            return (<LocationItem
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                street={item.street}
                                city={item.city}
                                province={item.province}
                                handleEditOpen={handleEditOpen}
                                handleDeleteOpen={handleDeleteOpen}
                            />)
                        })
                    }
                </ul>

            </Box>

        </Container>
    );
};

export default LocationPage;