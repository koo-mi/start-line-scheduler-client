import "./ChecklistPage.scss";
import { Box, Container, Modal, Typography } from "@mui/material";
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import ChecklistAdd from "../../components/ChecklistAdd/ChecklistAdd";
import ChecklistItem from "../../components/ChecklistItem/ChecklistItem";
import { useEffect, useState } from "react";
import axios from "axios";
import ChecklistEdit from "../../components/ChecklistEdit/ChecklistEdit";
import ChecklistDelete from "../../components/ChecklistDelete/ChecklistDelete";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";

const ChecklistPage = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const [checklist, setChecklist] = useState([]);
    const [targetId, setTargetId] = useState("");

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


    // Axios variables
    const URL = import.meta.env.VITE_SERVER_URL
    const token = sessionStorage.authToken;

    useEffect(() => {
        // If not logged in, redirect to login page
        if (!sessionStorage.authToken) {
            navigate("/login");
        }

        // Get checklist data for the user and put it into [checklist]
        async function getChecklistData() {
            try {
                const listData = await axios.get(`${URL}/checklist`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setChecklist(listData.data);
                setIsLoading(false);
            } catch (err) {
                // Will come back and change
                setHasError(true);
            }
        }
        getChecklistData();
    }, [refreshList])

    if (hasError) {
        return <Error />
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <Container maxWidth="sm" sx={{mb: "4.5rem"}}>
            {/* Add Modal */}
            <Modal
                open={showAddModal}
                onClose={handleAddClose}
                aria-labelledby="add-modal"
                aria-describedby="add-modal"
            >
                <>
                    <ChecklistAdd handleAddClose={handleAddClose}
                        updateList={updateList} />
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
                    <ChecklistEdit
                        handleEditClose={handleEditClose}
                        targetId={targetId}
                        updateList={updateList} />
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
                    <ChecklistDelete
                        handleDeleteClose={handleDeleteClose}
                        targetId={targetId}
                        updateList={updateList} />
                </>
            </Modal>

            {/* Checklist Header */}
            <Box className="checklist__header">
                <Typography component="h2" variant="h5">Checklist</Typography>
                <NoteAddOutlinedIcon className="checklist__add-icon" fontSize="large" onClick={() => { setShowAddModal(true) }} />
            </Box>

            {/* Checklist Content */}
            <ul className="checklist__list">
                {
                    checklist.map((item) => {
                        return <ChecklistItem
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            isDaily={item.isDaily}
                            priority={item.priority}
                            id={item.id}
                            handleDeleteOpen={handleDeleteOpen}
                            handleEditOpen={handleEditOpen}
                        />
                    })
                }
            </ul>
        </Container>

    );
};

export default ChecklistPage;