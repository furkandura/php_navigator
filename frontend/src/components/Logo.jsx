import {useApp} from "../AppContext.jsx";
import logoCiz from "../assets/images/logo_cizz.png";
import logo from "../assets/images/logo.png";
import React from "react";


function Logo() {
    const { cizLogo } = useApp();

    return (
        <img src={cizLogo ? logoCiz : logo} className="w-[138px]" alt=""/>
    );

}

export default Logo;