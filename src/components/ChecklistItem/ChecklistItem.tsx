import './ChecklistItem.scss';
import { Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { useState } from 'react';
import axios from 'axios';
import { checklistItem } from '../../model/type';
import { URL } from '../../utils/variables';

// Props
interface OwnProps extends checklistItem {
    handleEditOpen(id: string): void,
    handleDeleteOpen(id: string): void
}

const ChecklistItem = ({ id, title, description, isChecked, handleEditOpen, handleDeleteOpen, priority, isDaily }: OwnProps) => {

    const [checked, setChecked] = useState<boolean>(isChecked);

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
            console.log("unable to update at the moment")
        }
    }

    return (
        <li className='checklist__item'>
            <Checkbox checked={checked} value={checked} onChange={handleCheck} />
            <div className={`checklist__item-box ${priority === "high" ? "checklist__item-box--high" : ""} ${priority === "low" ? "checklist__item-box--low" : ""}`}>
                <div className='checklist__item-title-box'>
                    <h3 className={`checklist__item-title ${checked ? "checklist__item-title--crossed" : ""}`}>{title}
                        {
                            isDaily &&
                            (<span role='img' aria-label='daily'>
                                &#128257;
                            </span>)
                        }
                    </h3>
                    <div className='checklist__item-icons'>
                        <EditIcon onClick={(() => { handleEditOpen(`${id}`) })} />
                        <BackspaceIcon onClick={() => { handleDeleteOpen(`${id}`) }} />
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