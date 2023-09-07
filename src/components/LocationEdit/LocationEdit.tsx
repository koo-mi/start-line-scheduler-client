import { Box, Button, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, SelectChangeEvent, TextField } from "@mui/material";
import ModalHeader from "../ModalHeader/ModalHeader";
import { FormikValues, useFormik } from "formik";
import { useEffect, useState } from "react";
import { locationValidationSchema } from "../../schemas/locationValidationSchema";
import axios from "axios";
import PlacesAutocomplete, { geocodeByAddress } from "react-places-autocomplete";
import { ModalBasic, locationItem } from "../../model/type";
import { URL, searchOptions } from "../../utils/variables";

interface OwnProps extends ModalBasic {
    id: string
}

const LocationEdit = ({ handleClose, updateList, id }: OwnProps) => {

    const [formData, setFormData] = useState<locationItem | null>(null);

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [address, setAddress] = useState<string>("");

    // Formik
    const { values, errors, handleChange, handleBlur } = useFormik({
        initialValues: {
            "name": formData?.name || "",
            "isDefault": findDefault() || "",
            "isWork": formData?.isWork,
            "isHome": formData?.isHome,
        },
        enableReinitialize: true,
        validationSchema: locationValidationSchema,
        validateOnChange: submitted,
        validateOnBlur: submitted,
        onSubmit,
    })

    // format the value for isDefault
    function findDefault(): string {
        if (formData?.isWork) {
            return "work";
        } else if (formData?.isHome) {
            return "home";
        }
        return ""
    }

    const token = sessionStorage.authToken;

    useEffect(() => {
        async function getLocDataById() {
            const locData = await axios.get(`${URL}/direction/location/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setAddress(locData.data.address);
            setFormData(locData.data);
            setIsLoading(false);
        }

        getLocDataById();
    }, [])

    // Submit
    async function onSubmit(e: FormikValues) {
        e.preventDefault();

        if (!submitted) {
            setSubmitted(true);
        }

        // Simple validation for address 
        const addressRe = /\d+\s.{2,},.{2,},.{2,}/;
        const checkAddress = addressRe.test(address);

        if (!checkAddress) {
            return
        }

        await axios.put(`${URL}/direction/location/${id}`,
            {
                name: values.name,
                address: address,
                isHome: values.isHome,
                isWork: values.isWork,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        // Edit session storage data if it is currently selected location
        if (values.isHome) {
            sessionStorage.start = address;
        }

        if (values.isWork) {
            sessionStorage.end = address;
        }

        handleClose();
        updateList();
    }

    // Loading
    if (isLoading) {
        return (<p>Loading...</p>)
    }

    /* Search */

    async function handleAddressSelect(value: string) {
        const result = await geocodeByAddress(value);
        const formattedAddress = result[0].formatted_address

        setAddress(formattedAddress);
    }


    /* Default */

    function handleDefaultChange(e: SelectChangeEvent<string>) {
        if (e.target.value === "home") {
            setFormData({ ...formData!, isHome: true, isWork: false })
        } else if (e.target.value === "work") {
            setFormData({ ...formData!, isHome: false, isWork: true })
        }
    }

    return (
        <Container component="section" maxWidth="xs" className="modal" sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                <Box sx={{ display: 'flex', backgroundColor: 'white', width: '90%', flexDirection: 'column' }}>
                    {/* Header */}
                    <ModalHeader title="Edit Location" handleClose={handleClose} />

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
                        {/* Search Field */}
                        <PlacesAutocomplete
                            value={address}
                            onChange={setAddress}
                            onSelect={handleAddressSelect}
                            searchOptions={searchOptions}
                            highlightFirstSuggestion={true}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <TextField
                                        name="home_address"
                                        label="Address"
                                        fullWidth
                                        required
                                        {...getInputProps({
                                            placeholder: 'Search Address ...',
                                            className: 'location-search-input',
                                        })}
                                    />
                                    <div className="autocomplete-dropdown-container">
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map((suggestion, i) => {
                                            const className = suggestion.active
                                                ? 'suggestion-item--active'
                                                : 'suggestion-item';
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                    key={i}
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>

                        {/* Choose Default */}
                        <FormControl>
                            <FormLabel id="select-default">Default</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="select-default"
                                value={values.isDefault}
                                onChange={handleDefaultChange}
                                name="isDefault"
                            >
                                <FormControlLabel value="home" control={<Radio />} label="Home" />
                                <FormControlLabel value="work" control={<Radio />} label="Work" />
                            </RadioGroup>
                        </FormControl>

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
        </Container >
    );
};

export default LocationEdit;