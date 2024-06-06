import {Link, NavLink, Outlet} from "react-router-dom";
import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {GrAdd} from "react-icons/gr";
import {BsLightningCharge} from "react-icons/bs";
import {TbSettings2} from "react-icons/tb";
import {BiHome} from "react-icons/bi";
import {Slide, ToastContainer} from "react-toastify";
import Loading from "../components/Loading.jsx";
import AppProvider from "../AppContext.jsx";
import Logo from "../components/Logo.jsx";

function Layout() {

    return (
        <AppProvider>
            <div className="h-screen flex text-[14px]">
                <div className="w-1/4 h-full flex items-center justify-between flex-col bg-[#14191D] px-4 py-8">

                    <div className="flex flex-col gap-4 items-center">
                        <Logo/>
                        <ul className="menu bg-base-200 w-56 rounded-box mt-1">
                            <li className="mb-1.5">
                                <NavLink to="/">
                                    <BiHome size={15}/> Home
                                </NavLink>
                            </li>
                            <li className="mb-1.5">
                                <NavLink to="/projects">
                                    <BsLightningCharge size={15}/> Projects
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/project/add">
                                    <GrAdd size={14}/> Add Project
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="w-full">
                        <Link className="btn btn-sm w-full btn-primary" to="/settings">
                            <TbSettings2 size={18}/> Settings
                        </Link>
                    </div>
                </div>

                <div className="w-3/4 h-full px-4 py-8">
                    <Outlet/>
                </div>

                <ToastContainer theme="dark" hideProgressBar={true} autoClose={2000} ransition={Slide}/>
                <Loading/>
            </div>
        </AppProvider>
    );
}

export default Layout