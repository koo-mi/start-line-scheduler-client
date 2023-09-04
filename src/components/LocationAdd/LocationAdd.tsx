import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar, TextField } from "@mui/material";
import "./LocationAdd.scss";
import ModalHeader from "../ModalHeader/ModalHeader";
import { useFormik } from "formik";
import { useState } from "react";
import { locationValidationSchema } from "../../schemas/locationValidationSchema";
import axios from "axios";
import PlacesAutocomplete, { geocodeByAddress } from "react-places-autocomplete";

const LocationAdd = ({ handleAddClose, updateList }) => {

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [defaultPlace, setDefaultPlace] = useState("");

    // Formik
    const { values, errors, handleChange, handleBlur } = useFormik({
        initialValues: {
            "name": "",
            "street": "",
            "city": "",
            "province": "",
            "isWork": false,
            "isHome": false
        },
        validationSchema: locationValidationSchema,
        validateOnChange: submitted,
        validateOnBlur: submitted,
        onSubmit
    })

    // For Axios call
    const URL = import.meta.env.VITE_SERVER_URL;
    const token = sessionStorage.authToken;

    // When user sumbits the form
    async function onSubmit(e) {
        e.preventDefault();
        if (!submitted) {
            setSubmitted(true);
        }

        try {
            await axios.post(`${URL}/direction/location`,
                {
                    name: values.name,
                    street: address,
                    city: values.city,
                    province: values.province,
                    isHome: values.isHome,
                    isWork: values.isWork
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            handleAddClose();
            updateList();
        } catch (err) {
            console.log(err);
        }
    }

    /* Search */
    const [address, setAddress] = useState("");

    async function handleAddressSelect(value) {
        const result = await geocodeByAddress(value);
        const formattedAddress = result[0].formatted_address.split(",")

        if (!/\d/.test(formattedAddress[0])) {
            formattedAddress.shift();
        }

        const addressTrim = formattedAddress.map((el) => el.trim());

        setAddress(addressTrim[0]);
        values.city = addressTrim[1];
        values.province = addressTrim[2].split(' ')[0];
    }

    // Limit address result to only contain address in US/Canada
    const searchOptions = {
        componentRestrictions: { country: ["us", "ca"] },
        types: ['address']
    }

    // Default onChange
    function handleDefaultChange(e) {
        if (e.target.value === "home") {
            setDefaultPlace("home");
            values.isHome = true;
            values.isWork = false;
        } else if (e.target.value === "work") {
            setDefaultPlace("work");
            values.isHome = false;
            values.isWork = true;
        }
    }

    return (
        <Container component="section" maxWidth="xs" className="modal" sx={{ display: 'flex' }}>

            <Box sx={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                <Box sx={{ display: 'flex', backgroundColor: 'white', width: '90%', flexDirection: 'column' }}>
                    {/* Header */}
                    <ModalHeader title="Add New Location" handleClose={handleAddClose} />

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
                                        name="home_street_address"
                                        label="Street Address"
                                        fullWidth
                                        required
                                        error={!!errors.street}
                                        helperText={errors.street}
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

                        {/* Choose Default */}
                        <FormControl>
                            <FormLabel id="select-default">Default</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="select-default"
                                value={defaultPlace}
                                onChange={handleDefaultChange}
                                name="isDefault"
                            >
                                <FormControlLabel value="home" control={<Radio />} label="Home" />
                                <FormControlLabel value="work" control={<Radio />} label="Work" />
                            </RadioGroup>
                        </FormControl>

                        {/* Buttons */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button type="button" variant="outlined" onClick={handleAddClose} fullWidth sx={{ p: 1 }}>
                                Close
                            </Button>
                            <Button type="submit" variant="contained" fullWidth sx={{ p: 1 }}>
                                Add
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Container >
    );
};

export default LocationAdd;