import "./BottomNav.scss";
import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FmdGoodRoundedIcon from '@mui/icons-material/FmdGoodRounded';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';

const BottomNav = () => {

    const navigate = useNavigate();

    // Based on the directory name, change the default value
    const currentDir = useLocation();
    let dir: string = currentDir.pathname.split("/")[1];

    if (dir === "") {dir = "home"} 

    const [value, setValue] = useState(dir);

    const handleChange = (newValue: string) => {
        setValue(newValue);
    };

    if (dir==="signup" || dir === "login") {
        return ;
    }

    return (
        <BottomNavigation className="nav" value={value} onChange={()=>{handleChange}}>
            <BottomNavigationAction
                onClick={() => { navigate("/") }}
                label="Home"
                value="home"
                icon={<HomeRoundedIcon />}
            />
            <BottomNavigationAction
                onClick={() => { navigate("/direction") }}
                label="Direction"
                value="direction"
                icon={<FmdGoodRoundedIcon />}
            />
            <BottomNavigationAction
                onClick={() => { navigate("/weather") }}
                label="Weather"
                value="weather"
                icon={<CloudRoundedIcon />}
            />
            <BottomNavigationAction
                onClick={() => { navigate("/checklist") }}
                label="Checklist"
                value="checklist"
                icon={<ListAltRoundedIcon />}
            />
        </BottomNavigation>
    );
};

export default BottomNav;