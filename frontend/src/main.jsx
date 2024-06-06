import React from 'react'
import {createRoot} from 'react-dom/client'
import {HashRouter, Route, Routes} from "react-router-dom";
import Projects from "./pages/Projects.jsx";
import Settings from "./pages/Settings.jsx";
import './index.css'
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import ProjectEdit from "./pages/ProjectEdit.jsx";
import ProjectAdd from "./pages/ProjectAdd.jsx";


const root = createRoot(document.getElementById('root'))

root.render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path="/" element={<Home/>} index></Route>
                <Route path="/project/add" element={<ProjectAdd/>}></Route>
                <Route path="/project/:id/edit" element={<ProjectEdit/>}></Route>
                <Route path="/projects" element={<Projects/>}></Route>
                <Route path="/settings" element={<Settings/>}></Route>
            </Route>
        </Routes>
    </HashRouter>
)
