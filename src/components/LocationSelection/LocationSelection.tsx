import { FormControl, MenuItem, Select } from '@mui/material';
import './LocationSelection.scss';

import arrowIcon from '../../assets/icons/arrow_icon.svg';
import { LocationSelectionComponent } from '../../model/type';

const LocationSelection = ({
	departure,
	handleStartChange,
	locationData,
	arrival,
	handleEndChange
}: LocationSelectionComponent) => {
	return (
		<div className="select-location__location-selection">
			{/* Departure */}
			<FormControl fullWidth>
				<Select
					id="start"
					value={departure}
					onChange={handleStartChange}
					inputProps={{ IconComponent: () => null }}
				>
					{locationData.map((location) => {
						return (
							<MenuItem key={`${location.id}`} value={location.address}>
								{location.name}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>

			<img src={arrowIcon} alt="arrow icon" />

			{/* Arrival */}
			<FormControl fullWidth>
				<Select
					id="end"
					value={arrival}
					onChange={handleEndChange}
					inputProps={{ IconComponent: () => null }}
				>
					{locationData.map((location) => {
						return (
							<MenuItem key={`${location.id}`} value={location.address}>
								{location.name}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
		</div>
	);
};

export default LocationSelection;
