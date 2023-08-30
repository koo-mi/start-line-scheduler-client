import "./ChecklistItemSimplified.scss";
import { Checkbox } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const ChecklistItemSimplified = ({ id, title, isDaily, priority, isChecked }) => {

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