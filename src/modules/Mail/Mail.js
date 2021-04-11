import {useContext, useEffect, useRef} from "react";
import {NotificationContext} from "../../shared/NotificationProvider/notificationContext";
import {checkMail} from "./checkMail";

const CHECK_MAIL_FREQUENCY_MS = 5 * 1000

export const Mail = () => {

    const notificationParams = useContext(NotificationContext)
    const intervalId = useRef()

    useEffect(() => {
            const checkMailOnInterval = () =>
                setInterval(
                    () => checkMail(notificationParams),
                    CHECK_MAIL_FREQUENCY_MS)

            /*Set event listener to handle focus/blur events
             * Note: Not consistent in the browser.*/
            const onFocus = () => {
                if (!intervalId.current)
                    intervalId.current = checkMailOnInterval()
            }

            const onBlur = () => {
                if (intervalId.current) {
                    clearInterval(intervalId.current)
                    intervalId.current = undefined
                }

            }

            /*Setup event listener on first run and run once*/
            intervalId.current = checkMailOnInterval()
            checkMail(notificationParams)

            window.addEventListener('focus', onFocus)
            window.addEventListener('blur', onBlur)

            // Remove all listeners/sync on unmount
            return () => {
                clearInterval(intervalId.current)
                intervalId.current = undefined
                window.removeEventListener('focus', onFocus)
                window.removeEventListener('blur', onBlur)
            }
        }

        //eslint-disable-next-line
        , [])

    return null
}