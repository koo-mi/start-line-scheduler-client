import "./ChecklistAdd.scss"
import { useState } from "react";
import { FormikValues, useFormik } from "formik";
import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { checklistValidationSchema } from "../../schemas/checklistValidationSchema";
import axios from "axios";
import ModalHeader from "../ModalHeader/ModalHeader";
import { ModalBasic } from "../../model/type";

const ChecklistAdd = ({ handleClose, updateList }: ModalBasic) => {
    const [submitted, setSubmitted] = useState<boolean>(false);

    const { values, errors, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            "title": "",
            "description": "",
            "isDaily": false,
            "priority": "medium"
        },
        validationSchema: checklistValidationSchema,
        validateOnChange: submitted,
        validateOnBlur: submitted,
        onSubmit,
    })

    const URL = import.meta.env.VITE_SERVER_URL;
    const token = sessionStorage.authToken;

    async function onSubmit(val: FormikValues) {
        setSubmitted(true);

        await axios.post(`${URL}/checklist`,
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
            });

        handleClose();
        updateList();
    }

    return (
        <Container component="section" maxWidth="xs" className="modal" sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                <Box sx={{ display: 'flex', backgroundColor: 'white', width: '90%', flexDirection: 'column' }}>
                    {/* Header */}
                    <ModalHeader title="Add New Item" handleClose={handleClose} />
                    {/* Form */}
                    <form className="checklist__add-form" onSubmit={handleSubmit}>
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
                                Add
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Container>
    );
};

export default ChecklistAdd;