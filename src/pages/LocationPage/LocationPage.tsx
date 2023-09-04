import { Box, Container, Modal, Typography } from "@mui/material";
import "./LocationPage.scss";
import AddLocationOutlinedIcon from '@mui/icons-material/AddLocationOutlined';
import { useEffect, useState } from "react";
import axios from "axios";
import LocationAdd from "../../components/LocationAdd/LocationAdd";
import LocationEdit from "../../components/LocationEdit/LocationEdit";
import LocationItem from "../../components/LocationItem/LocationItem";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { locationSummary } from "../../model/type";
import { URL, token } from "../../utils/variables";


const LocationPage = () => {

    const [locData, setLocData] = useState<locationSummary>([]);
    const [targetId, setTargetId] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(true);

    // States for controlling modal
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);

    // For closing modals
    function handleAddClose(): void { setShowAddModal(false) };
    function handleDeleteClose(): void { setShowDeleteModal(false) };
    function handleEditClose(): void { setShowEditModal(false) };

    // For opening modals
    function handleEditOpen(id: string): void {
        setTargetId(id);
        setShowEditModal(true);
    }
    function handleDeleteOpen(id: string): void {
        setTargetId(id);
        setShowDeleteModal(true);
    }

    // For detecting any change (add, delete, edit)
    const [refreshList, setRefreshList] = useState<boolean>(true);
    function updateList(): void { setRefreshList(!refreshList) };


    useEffect(() => {
        async function getLocation(): Promise<void> {
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
                    <LocationAdd handleClose={handleAddClose} updateList={updateList} />
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
                    <LocationEdit handleClose={handleEditClose} updateList={updateList} id={targetId} />
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
                    <DeleteModal handleClose={handleDeleteClose} targetId={targetId} updateList={updateList} type="location" endpoint="direction/location"/>
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
                                key={`${item.id}`}
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