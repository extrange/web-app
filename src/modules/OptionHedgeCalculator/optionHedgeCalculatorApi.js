import {baseApi} from "../../app/network-core/baseApi";
import {baseQuery} from "../../app/network-core/baseQuery";

/*API Key from dnsproxy@gmail.com*/
const ENDPOINT = 'https://finnhub.io/api/v1/quote?symbol=SPY&token=c10sd6n48v6pp7chu95g';

const optionHedgeCalculatorApi = baseApi.injectEndpoints({
    endpoints: build => ({
        getSpyPrice: build.query({
            queryFn: (arg, api) => baseQuery({
                baseUrl: ENDPOINT,
            })(arg, api),
            transformResponse: resp => resp.c
        })
    })
})

export const {useGetSpyPriceQuery} = optionHedgeCalculatorApi