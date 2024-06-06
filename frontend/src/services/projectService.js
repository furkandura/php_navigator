import * as ConfigStore from "../../wailsjs/go/wailsconfigstore/ConfigStore.js";
import {v4 as uuidv4} from 'uuid';
import {GoCheckIsStartProject,GoOpenWithPhpStorm, GoStartProject, GoStopProject} from "../../wailsjs/go/main/App.js";

async function GetProjectsWithCheck() {
    const projects = await ConfigStore.Get('projects.json', '[]');
    const parsedProjects = JSON.parse(projects);

    const directories = pluck(parsedProjects, 'directory')
    const directoriesStartCheck = await GoCheckIsStartProject(directories);

    console.log(directoriesStartCheck)

    for (let i = 0; i < parsedProjects.length; i++) {
        const project = parsedProjects[i];
        let startInfo = directoriesStartCheck.Data ? directoriesStartCheck.Data.find(dsc => dsc.Directory === project.directory) : null;

        if (startInfo) {
            project.status = true;
            project.port = startInfo.Port;
            project.pid = startInfo.Pid;
        } else {
            project.status = false;
            project.port = null;
            project.pid = null;
        }
    }

    console.log(parsedProjects)

    return parsedProjects;
}

async function GetProjects() {
    const projects = await ConfigStore.Get('projects.json', '[]');
    return JSON.parse(projects);
}

async function GetFavoriteProjects() {
    let favoriteProjects = await GetProjectsWithCheck();

    return favoriteProjects.filter((p) => {
        return p.isFavorite
    });
}

async function AddProject(req) {
    try {
        let projects = await GetProjects();
        req.id = uuidv4();
        projects.push(req)
        await ConfigStore.Set('projects.json', JSON.stringify(projects));

        return true;
    } catch (e) {
        return false;
    }
}

async function GetProjectByUuid(uuid) {
    let projects = await GetProjects();
    return projects.find(p => p.id === uuid);
}

async function UpdateProject(uuid, req) {
    let projects = await GetProjects();
    let projectIndex = projects.findIndex(p => p.id === uuid);

    try {
        projects[projectIndex] = { ...projects[projectIndex], ...req };
        await ConfigStore.Set('projects.json', JSON.stringify(projects));

        return true;
    } catch (e) {
        return false;
    }
}

async function DeleteProject(uuid) {
    let projects = await GetProjects();
    let projectIndex = projects.findIndex(p => p.id === uuid);

    try {
        if (projectIndex !== -1) {
            projects.splice(projectIndex, 1);
            await ConfigStore.Set('projects.json', JSON.stringify(projects));
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

async function StartProject(project) {
    return await GoStartProject(project.directory, project.version);
}

async function OpenWithPhpStorm(project) {
    return await GoOpenWithPhpStorm(project.directory, project.type);
}

async function StopProject(pid) {
    return await GoStopProject(pid.toString());
}

function GetTypes() {
    return [
        {name: "Laravel", key: "laravel"},
        {name: "Symfony", key: "symfony"},
        {name: "Wordpress", key: "wordpress"},
        {name: "Base PHP Project", key: "base_php_project"},
    ]
}


const pluck = (array,key) => array.map(a => a[key]);

export {
    StartProject,
    GetProjects,
    AddProject,
    GetProjectByUuid,
    OpenWithPhpStorm,
    UpdateProject,
    StopProject,
    DeleteProject,
    GetFavoriteProjects,
    GetProjectsWithCheck,
    GetTypes
}