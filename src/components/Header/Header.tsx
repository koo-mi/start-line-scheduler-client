import "./Header.scss"
import { AppBar, Toolbar, Link, Button } from "@mui/material"
import logo from "../../assets/images/logo.png"
import { useNavigate } from "react-router-dom";

const Header = ({isLogin, changeLoginState}) => {

    const navigate = useNavigate();

    return (
        <AppBar position="static" className="header">
            <Toolbar sx={{ justifyContent: "space-between" }} className="header__toolbar">
                <Link href="/">
                    <img className="header__logo" src={logo} alt="StartLine Scheduler Logo" />
                </Link>

                {
                    isLogin ?
                        <Button variant="outlined" color="inherit" onClick={()=>{
                            sessionStorage.removeItem("authToken");
                            changeLoginState(false);
                            navigate("/login");
                        }}>Log Out</Button>
                        :
                        <Button variant="outlined" color="inherit" href="/login">Login</Button>
                }
            </Toolbar>
        </AppBar>
    );
};

export default Header;