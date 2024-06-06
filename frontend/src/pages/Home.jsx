import React, {useEffect, useState} from "react";
import * as ProductService from "../services/projectService";
import {useApp} from "../AppContext.jsx";
import {toast} from "react-toastify";
import * as NotificationService from "../services/notificationService.js";

function Home() {
    const { setLoading, setCizLogo } = useApp();
    const [favoriteLoading, setFavoriteLoading] = useState(false)
    const [favoriteProjects, setFavoriteProjects] = useState([])


    useEffect(() => {
        fetch();
    }, []);

    const fetch = async () => {
        //setLoading(true);
        setFavoriteLoading(true)
        const response = await ProductService.GetFavoriteProjects();
        setFavoriteLoading(false)
        //setLoading(false);
        setFavoriteProjects(response)
    }

    const startProject = async (project) => {
        setLoading(true)

        const startProjectResponse = await ProductService.StartProject(project)

        if (startProjectResponse.Status) {
            await fetch();
            await NotificationService.SendNotification("Started", `${project.name} project successfully started.`)
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

        const stopProjectResponse = await ProductService.StopProject(project.pid)

        if (stopProjectResponse.Status) {
            await fetch();
            await NotificationService.SendNotification("Stopped", `${project.name} project successfully stopped.`)
        }

        setLoading(false)
    }

    return (
        <div className="w-full">
            <div>
                <h1 className="text-[17px] font-bold mb-4 text-primary flex gap-2 items-center">
                    Favorite Projects
                </h1>
                <div className="grid grid-cols-4 gap-3">
                    {favoriteProjects.length > 0 && favoriteProjects.map(project => (
                        <button key={project.id} className="btn btn-neutral h-full py-4 font-medium" onClick={() => {project.status  ? stopProject(project) : startProject(project)}}>
                            <div
                                className={`btn btn-circle text-[19.5px] font-bold ${project.status ? 'btn-error' : 'btn-success'} btn-sm flex items-center justify-center text-[#242b32]`}>
                                {project.name.substring(0, 1).toUpperCase()}
                            </div>
                            <span className="text-[13px] w-full">{project.name}</span>
                        </button>
                    ))}

                    {favoriteProjects.length === 0 && favoriteLoading && (
                        <>
                            <div className="skeleton w-full h-[88px]"></div>
                            <div className="skeleton w-full h-[88px]"></div>
                            <div className="skeleton w-full h-[88px]"></div>
                            <div className="skeleton w-full h-[88px]"></div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home