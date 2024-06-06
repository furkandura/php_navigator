import {GoSendNotification} from "../../wailsjs/go/main/App.js";


async function SendNotification(title, message) {
    return await GoSendNotification(title, message);
}


export {
    SendNotification,
}