import {useContext, useEffect, useRef} from "react";
import {NotificationContext} from "../../shared/NotificationProvider/notificationContext";
import {CHECK_MAIL_FREQUENCY_MS, checkMailThrottled} from "./checkMailThrottled";


export const Mail = () => {

    const notificationParams = useContext(NotificationContext);
    const intervalId = useRef();

    useEffect(() => {
            const checkMailAndSetInterval = () => {
                checkMailThrottled(notificationParams);
                if (!intervalId.current)
                    intervalId.current = setInterval(
                        () => checkMailThrottled(notificationParams),
                        CHECK_MAIL_FREQUENCY_MS);
            };

            const onBlur = () => {
                if (intervalId.current) {
                    clearInterval(intervalId.current);
                    intervalId.current = undefined
                }
            };

            /*Run once on mount*/
            checkMailAndSetInterval();

            window.addEventListener('focus', checkMailAndSetInterval);
            window.addEventListener('blur', onBlur);

            // Remove all listeners/sync on unmount
            return () => {
                onBlur();
                window.removeEventListener('focus', checkMailAndSetInterval);
                window.removeEventListener('blur', onBlur)
            }
        }

        //eslint-disable-next-line
        , []);

    return null
};