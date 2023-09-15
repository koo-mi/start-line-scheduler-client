import { IconButton, Tooltip } from '@mui/material';
import './DirectionControl.scss';

// Icons
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import { chooseType, formatTargetTime } from '../../utils/functions';
import { useNavigate } from 'react-router-dom';
import { DirectionControlComponent } from '../../model/type';


const DirectionControl = ({ openTimeModal, restoreDefault, swapLocations, isHome }: DirectionControlComponent) => {

    const navigate = useNavigate();

    return (
        <div className='select-location__actions'>
            <div className='select-location__time-selection' onClick={openTimeModal}>
                <p>{chooseType()} {formatTargetTime(sessionStorage.time)}</p>
                <ArrowDropDownIcon />
            </div>

            <div className='select-location__icons'>
                <Tooltip title="swap location" placement='top'>
                    <IconButton color='inherit' onClick={swapLocations}>
                        <SwapHorizRoundedIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="restore default" placement='top'>
                    <IconButton color='inherit' onClick={restoreDefault}>
                        <SettingsBackupRestoreIcon />
                    </IconButton>
                </Tooltip>
                {
                    isHome &&
                    <Tooltip title="location page" placement='top'>
                        <IconButton color='inherit' onClick={() => { navigate("./direction/location") }}>
                            <AddLocationAltOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                }
            </div>
        </div>
    );
};

export default DirectionControl;