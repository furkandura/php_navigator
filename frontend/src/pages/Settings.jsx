import React, {useEffect, useState} from "react";
import {FiFolder, FiFolderPlus} from "react-icons/fi";
import {FaTimes} from "react-icons/fa";
import {GoSelectFolderDialog} from "../../wailsjs/go/main/App.js";
import * as PHPService from "../services/phpService.js";
import {toast} from "react-toastify";


function Settings() {

    const [selectedVersion, setSelectedVersion] = useState('')
    const [versions, setVersions] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false)


    useEffect(() => {
        fetch();
    }, []);

    const fetch = async () => {
        const versions = await PHPService.GetVersions();

        console.log(versions)
        setVersions(versions)
    }
    const openDialog = async () => {
        const response = await GoSelectFolderDialog();
        if (response.Data.Directory) {
            setSelectedVersion(response.Data.Directory)
        }
    }

    const addVersion = () => {
        setVersions([...versions, selectedVersion])
        setIsOpenModal(false)
    }

    const deleteVersion = (key) => {
        const newVersions = [...versions];
        newVersions.splice(key, 1);
        setVersions(newVersions);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await PHPService.SetVersions(versions);
        toast.success("Saved settings.")
    }

    return (
        <>
            <div className="w-full">
                <h1 className="text-[17px] font-bold mb-4 text-primary">Settings</h1>

                <form className="w-full" onSubmit={handleSubmit}>


                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">PHP Versions</label>

                        <ul className="flex flex-col gap-2 w-full">
                            {versions.length > 0 && versions.map((v, k) =>
                                <li key={v}
                                    className="w-full flex items-center bg-base-300 rounded p-3 justify-between">
                                    <div className="flex gap-2 items-center">
                                        <FiFolder size={20}/>
                                        <span className="font-medium text[12px]">{v}</span>
                                    </div>

                                    <FaTimes size={20} onClick={() => deleteVersion(k)}
                                             className="hover:text-error cursor-pointer"/>
                                </li>
                            )}

                            {versions.length === 0 && <li className="text-gray-600">version not found</li>}
                        </ul>

                        <button type="button" onClick={() => setIsOpenModal(true)} className="btn btn-xs btn-primary mt-3">
                            Add Version
                        </button>
                    </div>


                    <button type="submit" className="btn btn-sm btn-success float-right">
                        Save
                    </button>
                </form>

            </div>

            <dialog className={`modal ${isOpenModal ? `modal-open` : ``}`}>
                <div className="modal-box w-[500px]">
                    <h3 className="font-bold text-md">Add PHP Version</h3>

                    <div className="flex w-full  gap-2 mt-3">
                        <div className="w-full">
                            <input type="text" className="input input-bordered input-sm w-full"
                                   defaultValue={selectedVersion} onChange={(e) => setSelectedVersion(e.target.value)}/>
                            <div className="label">
                                <span className="label-text-alt">Example: /usr/local/php7.4/bin</span>
                                <span className="label-text-alt"></span>
                            </div>
                        </div>

                        <button type="button"
                                className="btn btn-sm w-1/3 btn-outline font-light border-[#3D434C] flex items-center"
                                onClick={() => openDialog()}>
                            <FiFolderPlus size={15} className="-mt-0.5"/>
                            Choose
                        </button>
                    </div>

                    <div className="modal-action flex">
                        <button className="btn btn-sm  font-medium" onClick={() => setIsOpenModal(false)}>Close</button>
                        <button className="btn btn-sm btn-success  font-medium" onClick={() => addVersion()}>Add</button>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default Settings