import { Box } from '@mui/material';
import './Error.scss';

const Error = () => {
	return (
		<Box className="error">
			<div className="error__heading">
				<h1 className="error__code">500</h1>
				<h2 className="error__title">Server Error</h2>
			</div>
			<div className="error__text">
				<p>Internal server problem.</p>
				<p>Please try again later.</p>
			</div>
		</Box>
	);
};

export default Error;
