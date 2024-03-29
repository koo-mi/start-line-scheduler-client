import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
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
	Alert
} from '@mui/material';
import { loginValidationSchema } from '../../schemas/loginValidationSchema';
import { LoginState } from '../../model/type';
import { URL } from '../../utils/variables';

const LoginPage = ({ changeLoginState }: LoginState) => {
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [loginErrMsg, setLoginErrMsg] = useState<string>('');
	const [rememberMe, setRememberMe] = useState<boolean>(false);

	const navigate = useNavigate();

	useEffect(() => {
		// If already logged in, redirect to HomePage
		if (!!sessionStorage.authToken) {
			navigate('/');
		}

		if (localStorage.email) {
			setRememberMe(true);
		}
	}, [navigate]);

	// Validation using formik
	const {
		values,
		errors,
		handleChange,
		handleBlur,
		handleSubmit,
		submitCount
	} = useFormik({
		initialValues: {
			email: localStorage.email || '',
			password: ''
		},
		validationSchema: loginValidationSchema,
		validateOnChange: submitted,
		validateOnBlur: submitted,
		onSubmit
	});

	// Submit
	async function onSubmit(val: any): Promise<void> {
		setLoginErrMsg(''); // Reset error message;
		if (rememberMe) {
			localStorage.email = val.email;
		} else {
			localStorage.removeItem('email');
		}

		try {
			// Get token from the server
			const res = await axios.post(`${URL}/login`, {
				username: val.email,
				password: val.password
			});
			sessionStorage.authToken = res.data.token;
			changeLoginState(true);
			navigate('/');
		} catch (err: any) {
			// Display error alert
			setLoginErrMsg(err.response.data.error.message);
			val.password = '';
		}
	}

	function handleRemember() {
		setRememberMe(!rememberMe);
	}

	async function createGuest() {
		// Check if userUuid exist in localStorage
		let userUuid = localStorage.userUuid;
		// If not, create one and store it into localStorage
		if (!localStorage.userUuid) {
			userUuid = uuidv4();
			localStorage.userUuid = userUuid;
		}

		try {
			const res = await axios.post(`${URL}/guest`, { userUuid });
			sessionStorage.authToken = res.data.token;
			changeLoginState(true);
			navigate('/');
		} catch (err) {
			console.log(err);
		}
	}

	// Start validating after user submits
	useEffect(() => {
		if (submitCount > 0) {
			setSubmitted(true);
		}
	}, [submitCount]);

	return (
		<Container component="main" id="main-container" sx={{ p: 3 }}>
			<Grid container direction="column">
				<Typography
					component="h1"
					variant="h4"
					sx={{ mt: 3, mb: 1, fontWeight: 700 }}
				>
					Login
				</Typography>
				<Typography
					component="h2"
					variant="body1"
					sx={{ mb: 3, color: 'grey' }}
				>
					Please sign in to continue.
				</Typography>
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
					fullWidth
					required
					error={!!errors.email}
					// @ts-ignore
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
				<Grid
					container
					justifyContent={'space-between'}
					alignItems={'center'}
					sx={{ mt: 1, mb: 1.5 }}
				>
					<Grid item>
						<FormControlLabel
							control={
								<Checkbox checked={rememberMe} onChange={handleRemember} />
							}
							color="primary"
							label="Remember me"
						/>
					</Grid>
					<Grid item>
						<Link underline="none" fontWeight={700}>
							Forgot password?
						</Link>
					</Grid>
				</Grid>
				{loginErrMsg ? <Alert severity="error">{loginErrMsg}</Alert> : ''}
				<Button
					type="submit"
					variant="contained"
					fullWidth
					sx={{ mt: 1.5, mb: 1, p: 1 }}
				>
					Sign In
				</Button>
				<Button
					onClick={createGuest}
					variant="outlined"
					color="info"
					fullWidth
					sx={{ mb: 3, p: 1 }}
				>
					Login as Guest
				</Button>
			</form>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 1
				}}
			>
				<Typography>Don't have an account?</Typography>
				<Link href="/signup" underline="none" fontWeight={700}>
					Sign up
				</Link>
			</Box>
		</Container>
	);
};

export default LoginPage;
