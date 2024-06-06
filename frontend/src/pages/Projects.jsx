import React, {useEffect, useState} from "react";
import {VscDebugStart, VscDebugStop} from "react-icons/vsc";
import {SiPhpstorm} from "react-icons/si";
import {CgBrowser} from "react-icons/cg";
import {Link} from "react-router-dom";
import * as ProjectService from "../services/projectService";
import * as NotificationService from "../services/notificationService.js";
import {toast} from "react-toastify";
import {BrowserOpenURL} from "../../wailsjs/runtime/runtime.js";
import {useApp} from "../AppContext.jsx";

function Projects() {
    const { setLoading, setCizLogo } = useApp();


    const [modalProject, setModalProject] = useState('')

    const [projects, setProjects] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false)

    useEffect(() => {
        fetch();
    }, []);

    const fetch = async () => {
        setLoading(true)
        let response = await ProjectService.GetProjectsWithCheck();
        setProjects(response)
        setLoading(false)
    }

    const openModal = (project) => {
        setModalProject(project)
        setIsOpenModal(true)
    }

    const openPhpStorm = async () => {
        const response = await ProjectService.OpenWithPhpStorm(modalProject)

        if (!response.Status) {
            toast.error(response.Error)
        }

        setIsOpenModal(false)
    }

    const startProject = async (project) => {
        setLoading(true)
        const startProjectResponse = await ProjectService.StartProject(project)

        if (startProjectResponse.Status) {
            await fetch();
            await NotificationService.SendNotification("Started", `${project.name} project successfully started.`)
        } else {
            toast.error(startProjectResponse.Error)
        }

        setLoading(false)

        let cizLogoInterval = setInterval(() => {
            setCizLogo(prevState => !prevState);
        }, 200);

        setTimeout(() => {
            clearInterval(cizLogoInterval)
            setCizLogo(false)
        }, 2000);

    }

    const stopProject = async (project) => {
        setLoading(true)

        const stopProjectResponse = await ProjectService.StopProject(project.pid)

        if (stopProjectResponse.Status) {
            await fetch();
            await NotificationService.SendNotification("Stopped", `${project.name} project successfully stopped.`)
        } else {
            toast.error(startProjectResponse.Error)
        }

        setLoading(false)
    }

    return (
        <div className="overflow-x-auto">

            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {projects.length > 0 && projects.map((project) => (
                    <tr key={project.id}>
                        <td>{project.name}</td>
                        <td>
                            {project.status ?
                                <span onClick={() => stopProject(project)}
                                      className="cursor-pointer text-error"><VscDebugStop size={20}/></span>
                                :
                                <span onClick={() => startProject(project)}
                                      className="cursor-pointer text-success"><VscDebugStart size={22}/></span>
                            }
                        </td>
                        <td>
                            <div className="flex gap-2">
                                <button className="btn btn-neutral btn-xs" onClick={() => openModal(project)}>
                                    Open
                                </button>

                                <Link to={`/project/${project.id}/edit`} className="btn btn-success btn-xs">
                                    Edit
                                </Link>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <dialog className={`modal ${isOpenModal ? `modal-open` : ``}`}>
                <div className="modal-box w-[450px]">
                    <div className="flex w-full gap-2">
                        <button
                            disabled={!modalProject.port}
                            onClick={() => {
                                BrowserOpenURL("http://localhost:"+modalProject.port);
                                setIsOpenModal(false)
                            }}
                            className="btn btn-ghost font-medium text-[13px]">
                            <CgBrowser size={30}/>
                            <span className="font-medium">Open with Browser</span>
                        </button>
                        <button
                            onClick={() => openPhpStorm()}
                            className="btn btn-ghost font-medium text-[13px]">
                            <SiPhpstorm size={27}/>
                            <span className="font-medium">Open with PHPStorm</span>
                        </button>
                    </div>

                    <div className="modal-action">
                        <button className="btn btn-sm  font-medium" onClick={() => setIsOpenModal(false)}>Close</button>
                    </div>
                </div>
            </dialog>


        </div>
    );
}

export default Projects