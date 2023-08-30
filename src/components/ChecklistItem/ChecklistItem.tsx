import './ChecklistItem.scss';
import { Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { useState } from 'react';
import axios from 'axios';

const ChecklistItem = ({ id, title, description, isDaily, priority, isChecked, handleEditOpen, handleDeleteOpen }) => {

    const [checked, setChecked] = useState(isChecked);

    // for Axios call
    const URL = import.meta.env.VITE_SERVER_URL
    const token = sessionStorage.authToken;
    
    async function handleCheck() {
        try {
            await axios.patch(`${URL}/checklist/${id}`,
                { checked: !checked },
                {
                    headers: { Authorization: `Bearer ${token}` }
                })
            setChecked(!checked);
        } catch (err) {
            // Will come back to this
            console.log("unable to update at the moment")
        }
    }

    return (
        <li className='checklist__item'>
            <Checkbox checked={checked} value={checked} onChange={handleCheck} />
            <div className='checklist__item-box'>
                <div className='checklist__item-title-box'>
                    <h3 className={`checklist__item-title ${checked ? "checklist__item-title--crossed" : ""}`}>{title}</h3>
                    <div className='checklist__item-icons'>
                        <EditIcon onClick={(() => { handleEditOpen(id) })} />
                        <BackspaceIcon onClick={() => { handleDeleteOpen(id) }} />
                    </div>
                </div>
                {
                    description &&
                    <div className='checklist__item-description'>
                        <p className={`checklist__item-text ${checked && "checklist__item-text--crossed"}`}>{description}</p>
                    </div>
                }
            </div>
        </li>
    );
};

export default ChecklistItem;