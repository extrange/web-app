import {API_URL, FILES_URL} from "../../app/urls";
import {Networking} from "../../app/network/networking";

export const DVR_URL = `${API_URL}/dvr`;
export const DVR_STREAM_URL = `${FILES_URL}/dvr_stream`;

export const getOrRefreshChannel = channel =>
    Networking.send(`${DVR_URL}/?channel=${channel}`, {
        method: 'GET'
    })
    .then(resp => resp.json());

export const getChannelUrl = (uuid, channel) =>
    `${DVR_STREAM_URL}/${uuid}/${channel}.mpd`;