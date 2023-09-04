import { useState, useEffect } from 'react';
import { useFormik } from "formik";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginValidationSchema } from "../../schemas/loginValidationSchema"
import {
    Container,
    TextField,
    Button,
    FormControl,
    Typography,
    Box,
    Alert,
    Select,
    MenuItem,
    InputLabel
} from "@mui/material";
import { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';

/* Sign up */
const SignupPage = () => {

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [signUpErrMsg, setSignUpErrMsg] = useState<string>("");

    const [targetTime, setTargetTime] = useState<Dayjs | null>(null);
    const [timeError, setTimeError] = useState<boolean>(false);

    const navigate = useNavigate();

    // If already logged in, redirect to HomePage
    if (!!sessionStorage.authToken) {
        navigate("/");
    }

    // Validation using formik
    const { values, errors, handleChange, handleBlur, handleSubmit, submitCount } = useFormik({
        initialValues: {
            "name": "",
            "email": "",
            "password": "",
            "confirm_password": "",
            "home_street_address": "",
            "home_city": "",
            "home_province": "",
            "work_street_address": "",
            "work_city": "",
            "work_province": "",
            "default_mode": "",
        },
        validationSchema: loginValidationSchema,
        validateOnChange: submitted,
        validateOnBlur: submitted,
        onSubmit,
    })

    // When user click Sign up button
    const URL = import.meta.env.VITE_SERVER_URL;
    async function onSubmit(val: any) {

        // Set/Reset Time Error Alert
        timeError ? setTimeError(false) : ""
        if (!targetTime) {
            return setTimeError(true);
        }

        // Format default time
        const default_target_time = `${targetTime.$H} ${targetTime.$m}`

        // Create new account 
        try {
            await axios.post(`${URL}/signup`, {
                name: val.name,
                username: val.email,
                password: val.password,
                home_street: homeAddress,
                home_city: val.home_city,
                home_province: val.home_province,
                work_street: workAddress,
                work_city: val.work_city,
                work_province: val.work_province,
                default_mode: val.default_mode,
                default_target_time,    
            })
            // Redirect to login page
            navigate("/login")
        } catch (err: any) {
            console.log(err);
            // Display error alert
            setSignUpErrMsg(err.response.data.message);
        }
    }

    // Start validating after user submits
    useEffect(() => {
        if (submitCount > 0) {
            setSubmitted(true);
        }
    }, [submitCount])


    /* For address search function */
    const [homeAddress, setHomeAddress] = useState("");
    const [workAddress, setWorkAddress] = useState("");


    async function handleHomeSelect(value) {
        const result = await geocodeByAddress(value);
        const formattedAddress = result[0].formatted_address.split(",")

        if (!/\d/.test(formattedAddress[0])) {
            formattedAddress.shift();
        }

        const addressTrim = formattedAddress.map((el) => el.trim());

        setHomeAddress(addressTrim[0]);
        values.home_city = addressTrim[1];
        values.home_province = addressTrim[2].split(' ')[1];
    }

    async function handleWorkSelect(value) {
        const result = await geocodeByAddress(value);
        const formattedAddress = result[0].formatted_address.split(",")

        if (!/\d/.test(formattedAddress[0])) {
            formattedAddress.shift();
        }

        const addressTrim = formattedAddress.map((el) => el.trim());


        setWorkAddress(addressTrim[0]);
        values.work_city = addressTrim[1];
        values.work_province = addressTrim[2].split(' ')[0];
    }

    // Limit address result to only contain address in US/Canada
    const searchOptions = {
        componentRestrictions: { country: ["us", "ca"] },
        types: ['address']
      }

    // Render
    return (
        <Container component="main" maxWidth="xs" sx={{ p: 3 }}>
            <Typography component="h1" variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 700 }}>Sign up</Typography>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: "column", gap: 2, mt: 3 }}>
                    {/* Name */}
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
                    {/* Email */}
                    <TextField
                        name="email"
                        label="Email Address"
                        autoComplete="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    {/* Password */}
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        required
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    {/* Confirm Password */}
                    <TextField
                        name="confirm_password"
                        label="Confirm Password"
                        type="password"
                        value={values.confirm_password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        required
                        error={!!errors.confirm_password}
                        helperText={errors.confirm_password}
                    />
                    {/* Home Address */}
                    <Typography component="h2" variant="h6">Home Address</Typography>
                    {/* Search Field */}
                    <PlacesAutocomplete
                        value={homeAddress}
                        onChange={setHomeAddress}
                        onSelect={handleHomeSelect}
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
                                    error={!!errors.home_street_address}
                                    helperText={errors.home_street_address}
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
                        {/* Home City */}
                        <TextField
                            name="home_city"
                            label="City"
                            value={values.home_city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            required
                            error={!!errors.home_city}
                            helperText={errors.home_city}
                        />
                        {/* Home Province */}
                        <TextField
                            name="home_province"
                            label="State / Province"
                            value={values.home_province}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            required
                            error={!!errors.home_province}
                            helperText={errors.home_province}
                        />
                    </Box>

                    {/* Work Address */}
                    <Typography component="h2" variant="h6">Work Address</Typography>

                    {/* Search Field */}
                    <PlacesAutocomplete
                        value={workAddress}
                        onChange={setWorkAddress}
                        onSelect={handleWorkSelect}
                        searchOptions={searchOptions}
                        highlightFirstSuggestion={true}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <TextField
                                    name="work_street_address"
                                    label="Street Address"
                                    fullWidth
                                    required
                                    error={!!errors.home_street_address}
                                    helperText={errors.home_street_address}
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
                        {/* Work City */}
                        <TextField
                            name="work_city"
                            label="City"
                            value={values.work_city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            required
                            error={!!errors.work_city}
                            helperText={errors.work_city}
                        />
                        {/* Work Province */}
                        <TextField
                            name="work_province"
                            label="State / Province"
                            value={values.work_province}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            required
                            error={!!errors.work_province}
                            helperText={errors.work_province}
                        />
                    </Box>
                    {/* Commute Details */}
                    <Typography component="h2" variant="h6">Commute Detail</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                        {/* Mode of Transportation */}
                        <FormControl>
                            <InputLabel id="default_mode_label">Mode</InputLabel>
                            <Select
                                name="default_mode"
                                labelId="default_mode_label"
                                label="Mode"
                                value={values.default_mode}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value={"driving"}>Driving</MenuItem>
                                <MenuItem value={"transit"}>Transit</MenuItem>
                                <MenuItem value={"walking"}>Walking</MenuItem>
                                <MenuItem value={"bicycling"}>Bicycling</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Target Time */}
                        <Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimePicker']}>
                                    <TimePicker
                                        label="Target Time"
                                        value={targetTime}
                                        onChange={(newValue) => setTargetTime(newValue)}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            {timeError && <Typography component="p" variant='body2' sx={{ mt: 0.5, color: "#d32f2f" }}>Target time is required.</Typography>}
                        </Box>
                    </Box>
                </Box>
                {
                    signUpErrMsg && <Alert severity='error'>{signUpErrMsg}</Alert>
                }
                {/* Submit Button */}
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, p: 1 }}>
                    Sign Up
                </Button>
                <Button type="button" variant="outlined" color='error' onClick={() => { navigate("/login") }} fullWidth sx={{ mt: 1.5, mb: 3, p: 1 }}>
                    Cancel
                </Button>
            </form>
        </Container>
    );
};

export default SignupPage;