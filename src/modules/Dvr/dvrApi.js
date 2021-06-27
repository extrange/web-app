
import { FILES_URL } from '../../app/urls';
import { baseApi } from './../../app/network-core/baseApi';

const dvrApi = baseApi.injectEndpoints({
    endpoints: build => ({
        getOrRefreshChannel: build.query({
            query: channel => ({
                url: 'dvr/',
                params: { channel }
            })
        }),
    })
})

export const {
    useGetOrRefreshChannelQuery
} = dvrApi

export const getChannelUrl = (uuid, channel) =>
`${FILES_URL}/dvr_stream/${uuid}/${channel}.mpd`;