import { rest } from 'msw'
import { addHours } from 'date-fns'
import { API_URL } from "../../app/urls";

/* Always pass login */
export const login = [
    rest.get(API_URL + '/account/login/', (req, res, context) => {
        return res(
            context.delay(),
            context.status(200),
            context.json({
                "user": "nicholaslyz",
                "is_superuser": true, 
                "expiry": addHours(new Date(), 4).toISOString(), 
                "recaptcha_key": "6LeqZqIaAAAAAAO03xwyC8SrpGSRWbFqD-vpMe72"
            })
        )
    })
]