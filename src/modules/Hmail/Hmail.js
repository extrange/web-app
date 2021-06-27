import { useCheckIhisMailQuery, useCheckMohhMailQuery } from "./hmailApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleMailAction } from "./hmailActions";

const CHECK_MAIL_FREQUENCY_MS = 30 * 1000;
const [IHIS, MOHH] = ['IHIS', 'MOHH']

export const Hmail = () => {

    const dispatch = useDispatch()

    /*This hook appears to be keep the same reference when the new data is identical to
    the old data, and therefore cached data is returned, so useEffect calls do not run*/
    const { data: ihisMail } = useCheckIhisMailQuery(undefined, { pollingInterval: CHECK_MAIL_FREQUENCY_MS })
    const { data: mohhMail } = useCheckMohhMailQuery(undefined, { pollingInterval: CHECK_MAIL_FREQUENCY_MS })

    useEffect(() => ihisMail &&
        dispatch(handleMailAction(ihisMail, IHIS)),
        [dispatch, ihisMail])

    useEffect(() => mohhMail &&
        dispatch(handleMailAction(mohhMail, MOHH)),
        [dispatch, mohhMail])

    return null
}; 