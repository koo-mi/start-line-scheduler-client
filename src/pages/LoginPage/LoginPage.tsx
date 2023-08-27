import { useState, useEffect } from 'react';
import { useFormik } from "formik";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    TextField,
    Checkbox,
    Button,
    FormControlLabel,
    Link,
    Grid,
    Typography,
    Box,
    Alert,
} from "@mui/material";
import { loginValidationSchema } from "../../schemas/loginValidationSchema"


/* Login */
const LoginPage = () => {

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [loginErrMsg, setLoginErrMsg] = useState<string>("");

    const navigate = useNavigate();

    // If already logged in, redirect to HomePage
    if (!!sessionStorage.authToken) {
        navigate("/");
    }

    // Validation using formik
    const { values, errors, handleChange, handleBlur, handleSubmit, submitCount } = useFormik({
        initialValues: {
            "email": "",
            "password": "",
        },
        validationSchema: loginValidationSchema,
        validateOnChange: submitted,
        validateOnBlur: submitted,
        onSubmit,
    })

    // When user click Sign in button
    const URL = import.meta.env.VITE_SERVER_URL;
    async function onSubmit(val: any) {

        setLoginErrMsg("");     // Reset error message

        try {
            // Get token from the server
            const res = await axios.post(`${URL}/login`, { username: val.email, password: val.password });
            sessionStorage.authToken = res.data.token;
            navigate("/");

        } catch (err: any) {
            // Display error alert
            setLoginErrMsg(err.response.data.error.message);
        }
    }

    // Start validating after user submits
    useEffect(() => {
        if (submitCount > 0) {
            setSubmitted(true);
        }
    }, [submitCount])

    return (
        <Container component="main" maxWidth="xs" sx={{ p: 3 }}>
            <Grid container direction="column">
                <Typography component="h1" variant="h4" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>Login</Typography>
                <Typography component="h2" variant="body1" sx={{ mb: 3, color: "grey" }}>Please sign in to continue.</Typography>
            </Grid>
            {/* Form */}
            <form onSubmit={handleSubmit}>
                {/* Email */}
                <TextField
                    name="email"
                    label="Email Address"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ mt: 2, mb: 2 }}
                />

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
                <Grid container justifyContent={"space-between"} alignItems={"center"} sx={{ mt: 1, mb: 1.5 }}>
                    <Grid item>
                        <FormControlLabel
                            control={<Checkbox value="remember" />}
                            color="primary"
                            label="Remember me"
                        />
                    </Grid>
                    <Grid item>
                        <Link underline="none" fontWeight={700}>Forgot password?</Link>
                    </Grid>
                </Grid>
                {
                    loginErrMsg ?
                        <Alert severity='error'>{loginErrMsg}</Alert>
                        : ""
                }
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 1.5, mb: 3, p: 1}}>
                    Sign In
                </Button>
            </form>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems:"center", gap: 1 }}>
                <Typography>Don't have an account?</Typography>
                <Link href="/signup" underline="none" fontWeight={700}>Sign up</Link>
            </Box>
        </Container>
    );
};

export default LoginPage;
