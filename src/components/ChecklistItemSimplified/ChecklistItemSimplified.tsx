import "./ChecklistItemSimplified.scss";
import { Checkbox } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { checklistItem } from "../../model/type";
import { URL } from "../../utils/variables";

const ChecklistItemSimplified = ({ id, title, isChecked }: checklistItem) => {

    const [checked, setChecked] = useState(isChecked);

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
        <li className='checklist-home__item'>
            {/* Checkbox */}
            <Checkbox checked={checked} value={checked} size="small" onChange={handleCheck} />
            {/* Title */}
            <div className={`checklist-home__item-title-box`}>
                <h3 className={`checklist-home__item-title ${checked ? "checklist-home__item-title--crossed" : ""}`}>{title}</h3>
            </div>
        </li >
    );
};

export default ChecklistItemSimplified;