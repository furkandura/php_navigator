import React, {useContext, useEffect, useRef, useState} from "react";
import {FiFolderPlus} from "react-icons/fi";
import {GoSelectFolderDialog} from "../../wailsjs/go/main/App.js";
import * as ProductService from "../services/projectService";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useApp} from "../AppContext.jsx";
import * as PHPService from "../services/phpService.js";

function ProjectAdd() {
    const { setLoading } = useApp();

    const navigate = useNavigate();

    const [versions, setVersions] = useState([])

    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const versionRef = useRef(null);
    const [directory, setDirectory] = useState(null)
    const addToFavoritesRef = useRef(null);
    const projectTypeRef = useRef(null);

    useEffect(() => {
        fetch();
    }, []);

    const fetch = async () => {
        const versions = await PHPService.GetVersions();
        setVersions(versions)
    }

    const openDialog = async () => {
        const response = await GoSelectFolderDialog();
        setDirectory(response.Data.Directory)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let request = {
            'name': nameRef.current.value,
            'description': descriptionRef.current.value,
            'version': versionRef.current.value,
            'directory': directory,
            'type': projectTypeRef.current.value,
            'isFavorite': addToFavoritesRef.current.checked
        };

        setLoading(true);
        const response = await ProductService.AddProject(request)
        setLoading(false);

        if (response) {
            toast.success("Project created.")
            navigate("/projects")
        } else {
            toast.error("Project not created.")
        }
    }
    return (
        <div className="w-full">
            <h1 className="text-[17px] font-bold mb-4 text-primary">Add Project</h1>


            <form className="w-full" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Name</label>
                    <input type="text"
                           className="input input-bordered input-sm w-full" required ref={nameRef}/>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Description</label>
                    <textarea className="textarea textarea-bordered textarea-sm w-full" ref={descriptionRef}></textarea>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">PHP Version</label>
                    <select name="" className="select select-bordered select-sm w-full" required={true}
                            ref={versionRef}>
                        {versions.map(v => <option value={v}>{v}</option>)}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Project Type</label>
                    <select name="" className="select select-bordered select-sm w-full" required={true}
                            ref={projectTypeRef}>
                        <option value="">Select...</option>
                        {ProductService.GetTypes().map(t => <option value={t.key}>{t.name}</option>)}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Directory</label>


                    <div className="flex w-full gap-2 ">
                        <div className="w-2/3">
                            <input type="text"
                                   className="input caret-transparent pointer-events-none input-bordered input-sm w-full"
                                   required={true}
                                   defaultValue={directory}/>
                            <div className="label">
                                <span className="label-text-alt">You should choose the public folder in projects like Symfony and Laravel.</span>
                                <span className="label-text-alt"></span>
                            </div>
                        </div>

                        <button type="button"
                                className={`btn btn-sm w-1/3 btn-outline font-light border-[#3D434C] flex items-center`}
                                onClick={() => openDialog()}>
                            <FiFolderPlus size={15} className="-mt-0.5"/>
                            Choose
                        </button>
                    </div>
                </div>


                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Add to Favorites</label>
                    <input type="checkbox" className="toggle toggle-primary" ref={addToFavoritesRef}/>
                </div>


                <button type="submit" className="btn btn-sm btn-success float-right">
                    Create
                </button>
            </form>

        </div>
    );
}

export default ProjectAdd