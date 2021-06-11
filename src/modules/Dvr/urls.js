import {API_URL, FILES_URL} from "../../app/urls";

export const DVR_URL = `${API_URL}/dvr`;
export const DVR_STREAM_URL = `${FILES_URL}/dvr_stream`;

export const getChannelUrl = (uuid, channel) =>
    `${DVR_STREAM_URL}/${uuid}/${channel}.mpd`;