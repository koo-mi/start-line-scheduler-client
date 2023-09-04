import { Box, Button, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import ModalHeader from "../ModalHeader/ModalHeader";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { locationValidationSchema } from "../../schemas/locationValidationSchema";
import axios from "axios";
import PlacesAutocomplete, { geocodeByAddress } from "react-places-autocomplete";

const LocationEdit = ({ handleEditClose, updateList, id }) => {

    const [formData, setFormData] = useState({});

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [address, setAddress] = useState("");

    const [prevAddress, setPrevAddress] = useState("");

    // Formik
    const { values, errors, handleChange, handleBlur } = useFormik({
        initialValues: {
            "name": formData.name || "",
            "city": formData.city || "",
            "province": formData.province || "",
            "isDefault": findDefault() || "",
            "isWork": formData.isWork,
            "isHome": formData.isHome,
        },
        enableReinitialize: true,
        validationSchema: locationValidationSchema,
        validateOnChange: submitted,
        validateOnBlur: submitted,
        onSubmit,
    })

    function findDefault():string {
        if (formData.isWork) {
            return "work";
        } else if (formData.isHome) {
            return "home";
        }
        return ""
    }

    // For Axios call
    const URL = import.meta.env.VITE_SERVER_URL;
    const token = sessionStorage.authToken;

    useEffect(() => {
        async function getLocDataById() {
            const locData = await axios.get(`${URL}/direction/location/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setPrevAddress(`${locData.data.street} ${locData.data.city} ${locData.data.province}`.replaceAll(' ', '+'));

            setAddress(locData.data.street);
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
                street: address,
                city: values.city,
                province: values.province,
                isHome: values.isHome,
                isWork: values.isWork,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        // Edit session storage data if it is currently selected location
        if (prevAddress === sessionStorage.start) {
            sessionStorage.start = `${address} ${values.city} ${values.province}`.replaceAll(' ', '+')
        }

        if (prevAddress === sessionStorage.end) {
            sessionStorage.end = `${address} ${values.city} ${values.province}`.replaceAll(' ', '+')
        }

        handleEditClose();
        updateList();
    }

    if (isLoading) {
        return (<p>Loading...</p>)
    }

    /* Search */

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

    /* Default */

    function handleDefaultChange(e) {
        if (e.target.value === "home") {
            setFormData({...formData, isHome: true, isWork: false})
        } else if (e.target.value === "work") {
            setFormData({...formData, isHome: false, isWork: true})
        }
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