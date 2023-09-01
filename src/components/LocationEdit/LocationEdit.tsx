import { Box, Button, Checkbox, Container, FormControlLabel, TextField } from "@mui/material";
import ModalHeader from "../ModalHeader/ModalHeader";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { locationValidationSchema } from "../../schemas/locationValidationSchema";
import axios from "axios";

const LocationEdit = ({ handleEditClose, updateList, id }) => {

    const [formData, setFormData] = useState({});
    
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    // Formik
    const { values, errors, handleChange, handleBlur } = useFormik({
        initialValues: {
            "name": formData.name || "",
            "street": formData.street || "",
            "city": formData.city || "",
            "province": formData.province || "",
            "isDefault": false
        },
        enableReinitialize: true,
        validationSchema: locationValidationSchema,
        validateOnChange: submitted,
        validateOnBlur: submitted,
        onSubmit,
    })

    // For Axios call
    const URL = import.meta.env.VITE_SERVER_URL;
    const token = sessionStorage.authToken;

    useEffect(()=>{
        async function getLocDataById() {
            const locData = await axios.get(`${URL}/direction/location/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setFormData(locData.data);
            setIsLoading(false);
        }

        getLocDataById();
    }, [])

    // When user sumbits the form
    async function onSubmit(e) {
        e.preventDefault();

        if (!submitted) {
            setSubmitted(true);
        }

        await axios.put(`${URL}/direction/location/${id}`,
            {
                name: values.name,
                street: values.street,
                city: values.city,
                province: values.province
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        handleEditClose();
        updateList();
    }

    if (isLoading) {
        return (<p>Loading...</p>)
    }

    return (
        <Container component="section" maxWidth="xs" className="modal" sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                <Box sx={{ display: 'flex', backgroundColor: 'white', width: '90%', flexDirection: 'column' }}>
                    {/* Header */}
                    <ModalHeader title="Edit Location" handleClose={handleEditClose} />

                    {/* Form */}
                    <form className="checklist__add-form" onSubmit={onSubmit}>
                        <TextField
                            name="name"
                            label="Name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        {/* Street */}
                        <TextField
                            name="street"
                            label="Street Address"
                            value={values.street}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            required
                            error={!!errors.street}
                            helperText={errors.street}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {/* City */}
                            <TextField
                                name="city"
                                label="City"
                                value={values.city}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                required
                                error={!!errors.city}
                                helperText={errors.city}
                            />
                            {/* Province */}
                            <TextField
                                name="province"
                                label="State / Province"
                                value={values.province}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                required
                                error={!!errors.province}
                                helperText={errors.province}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Box sx={{ width: "50%" }}></Box>
                            <Box sx={{ width: "50%" }}>
                                <FormControlLabel control={<Checkbox checked={values.isDefault} name="isDefault" onChange={handleChange} value={values.isDefault} />} label="Default" />
                            </Box>
                        </Box>

                        {/* Buttons */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button type="button" variant="outlined" onClick={handleEditClose} fullWidth sx={{ p: 1 }}>
                                Close
                            </Button>
                            <Button type="submit" variant="contained" fullWidth sx={{ p: 1 }}>
                                Edit
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Container >
    );
};

export default LocationEdit;