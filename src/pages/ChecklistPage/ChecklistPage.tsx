import "./ChecklistPage.scss";
import { Box, Container, Modal, Typography } from "@mui/material";
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import ChecklistAdd from "../../components/ChecklistAdd/ChecklistAdd";
import ChecklistItem from "../../components/ChecklistItem/ChecklistItem";
import { useEffect, useState } from "react";
import axios from "axios";
import ChecklistEdit from "../../components/ChecklistEdit/ChecklistEdit";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { checklistSummary } from "../../model/type";
import { URL, token } from "../../utils/variables";

const ChecklistPage = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    const [checklist, setChecklist] = useState<checklistSummary>([]);
    const [targetId, setTargetId] = useState<string>("");

    // States for controlling modal
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);

    // For closing modals
    function handleAddClose() { setShowAddModal(false) };
    function handleDeleteClose() { setShowDeleteModal(false) };
    function handleEditClose() { setShowEditModal(false) };

    // For opening modals
    function handleEditOpen(id: string) {
        setTargetId(id);
        setShowEditModal(true);
    }
    function handleDeleteOpen(id: string) {
        setTargetId(id);
        setShowDeleteModal(true);
    }

    // For detecting any change (add, delete, edit)
    const [refreshList, setRefreshList] = useState(true);
    function updateList() { setRefreshList(!refreshList) };

    
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
                    <ChecklistAdd handleClose={handleAddClose}
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
                        handleClose={handleEditClose}
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
                    <DeleteModal
                        handleClose={handleDeleteClose}
                        targetId={targetId}
                        updateList={updateList} 
                        type="item"
                        endpoint="checklist"/>
                </>
            </Modal>

            {/* Checklist Header */}
            <Box className="checklist__header">
                <Typography component="h2" variant="h5" sx={{fontWeight: 500}}>Checklist</Typography>
                <NoteAddOutlinedIcon className="checklist__add-icon" fontSize="large" onClick={() => { setShowAddModal(true) }} />
            </Box>

            {/* Checklist Content */}
            <ul className="checklist__list">
                {
                    checklist.map((item) => {
                        return <ChecklistItem
                            key={`${item.id}`}
                            title={item.title}
                            description={item.description}
                            isDaily={item.isDaily}
                            priority={item.priority}
                            isChecked={item.isChecked}
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