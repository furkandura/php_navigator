import * as ConfigStore from "../../wailsjs/go/wailsconfigstore/ConfigStore.js";


async function SetVersions(versions) {
    return await ConfigStore.Set('versions.json', JSON.stringify(versions));
}

async function GetVersions() {
    const res =  await ConfigStore.Get('versions.json', '[]');
    return JSON.parse(res);
}

export {
    SetVersions,
    GetVersions
}