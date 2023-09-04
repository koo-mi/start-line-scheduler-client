import "./ChecklistEdit.scss"
import { useEffect, useState } from "react";
import { FormikValues, useFormik } from "formik";
import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { checklistValidationSchema } from "../../schemas/checklistValidationSchema";
import axios from "axios";
import ModalHeader from "../ModalHeader/ModalHeader";
import { ModalBasic, checklistItem } from "../../model/type";
import { URL, token } from "../../utils/variables";

interface OwnProps extends ModalBasic {
    targetId: string
}

const ChecklistEdit = ({ handleClose, targetId, updateList }: OwnProps) => {

    const [itemData, setItemData] = useState<checklistItem>({});
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getItemInfo() {
            // Get item data by ID
            const listItemData = await axios.get(`${URL}/checklist/${targetId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            setItemData(listItemData.data);
            setIsLoading(false);
        }

        getItemInfo();
    }, [])

    // Formik
    const { values, errors, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            "title": itemData.title || "",
            "description": itemData.description || "",
            "isDaily": itemData.isDaily || false,
            "priority": itemData.priority || "medium"
        },
        enableReinitialize: true,
        validationSchema: checklistValidationSchema,
        validateOnChange: submitted,
        validateOnBlur: submitted,
        onSubmit,
    })

    // When Submit
    async function onSubmit(val: FormikValues) {
        setSubmitted(true);

        await axios.put(`${URL}/checklist/${targetId}`,
            {
                title: val.title,
                description: val.description,
                isDaily: val.isDaily,
                priority: val.priority
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

        handleClose();
        updateList();
    }

    // Loading
    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <Container component="section" maxWidth="xs" className="modal" sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                <Box sx={{ display: 'flex', backgroundColor: 'white', width: '90%', flexDirection: 'column' }}>
                    {/* Header */}
                    <ModalHeader title="Edit Checklist" handleClose={handleClose} />
                    {/* Form */}
                    <form className="checklist__edit-form" onSubmit={handleSubmit}>
                        {/* Title */}
                        <TextField
                            name="title"
                            label="Title"
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            required
                            error={!!errors.title}
                            helperText={errors.title}
                        />
                        {/* Description */}
                        <TextField
                            name="description"
                            label="Description"
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            error={!!errors.description}
                            helperText={errors.description}
                            rows={4}
                            multiline
                        />
                        {/* Priority / isDaily */}
                        <Box sx={{ display: 'flex', alignItems: "center", gap: 2 }}>
                            <Box sx={{ width: "50%" }}>
                                <FormControl fullWidth>
                                    <InputLabel id="priority-label">Priority</InputLabel>
                                    <Select
                                        labelId="priority-label"
                                        id="priority"
                                        name="priority"
                                        value={values.priority}
                                        label="Priority"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"low"}>Low</MenuItem>
                                        <MenuItem value={"medium"}>Medium</MenuItem>
                                        <MenuItem value={"high"}>High</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ width: "50%" }}>
                                <FormControlLabel control={<Checkbox checked={values.isDaily} name="isDaily" onChange={handleChange} value={values.isDaily} />} label="Daily" />
                            </Box>
                        </Box>

                        {/* Buttons */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button type="button" variant="outlined" onClick={handleClose} fullWidth sx={{ p: 1 }}>
                                Close
                            </Button>
                            <Button type="submit" variant="contained" fullWidth sx={{ p: 1 }}>
                                Edit
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Container>
    );
};

export default ChecklistEdit;