import './ChecklistItem.scss';
import { Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { useState } from 'react';

const ChecklistItem = ({ id, title, description, isDaily, priority, handleEditOpen, handleDeleteOpen }) => {

    const [checked, setChecked] = useState(false);


    return (
        <li className='checklist__item'>
            <Checkbox checked={checked} value={checked} onChange={() => { setChecked(!checked) }} />
            <div className='checklist__item-box'>
                <div className='checklist__item-title-box'>
                    <h3 className={checked ? "checklist__item-title--crossed" : ""}>{title}</h3>
                    <div className='checklist__item-icons'>
                        <EditIcon onClick={(()=>{handleEditOpen(id)})}/>
                        <BackspaceIcon onClick={()=>{handleDeleteOpen(id)}}/>
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