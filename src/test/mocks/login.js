import { sample } from 'lodash';
import { rest } from 'msw';
import { API_URL } from "../../app/urls";

const VALUES = {
    LOGIN_SUCCESS: 1,
    REQ_OTP: 2,
    INVALID_CREDENTIALS: 3,
}

export const login = [


    rest.get(API_URL + '/account/login/', (req, res, context) => {
        return res(
            context.delay(1000),
            context.status(401),
            context.json({
                message: 'Not logged in',
                recaptcha_key: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"})
        )
    }),

    rest.post(API_URL + '/account/login/', (req, res, context) => {

        const val = sample(VALUES)

        switch (val) {
            // case VALUES.LOGIN_SUCCESS: return res(
            //     context.delay(3000),
            //     context.status(200),
            //     context.json({
            //         "user": "nicholaslyz",
            //         "is_superuser": true, 
            //         "expiry": addHours(new Date(), 4).toISOString(), 
            //         "recaptcha_key": "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            //     })
            // )
            // case VALUES.REQ_OTP: return res (
            //     context.delay(3000),
            //     context.status(401),
            //     context.json({
            //         message: 'OTP required',
            //         otp_required: true,
            //     })
            // )
            default: return res (
                context.delay(3000), 
                context.status(401),
                context.json({
                    message: 'Invalid credentials',
                    invalid_credentials: true,
                })
            )
        }

        
    })
]