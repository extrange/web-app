import { rest } from "msw";
import { API_URL } from "../../app/urls";
import { addHours } from "date-fns";

const TEST_USER = {
  username: "username",
  password: "password",
  otp: "123456",
};

export const login = [
  rest.get(API_URL + "/account/login/", (req, res, context) => {
    return res(
      context.delay(),
      context.status(200),
      context.json({
        user: "nicholaslyz",
        is_superuser: true,
        expiry: addHours(new Date(), 4).toISOString(),
        recaptcha_key: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
      })
    );
  }),

  rest.post(API_URL + "/account/login/", (req, res, context) => {
    const { username, password, otp } = req.body;

    if (username === TEST_USER.username && password === TEST_USER.password) {
      if (TEST_USER.otp) {
        if (!otp)
          return res(
            context.delay(3000),
            context.status(401),
            context.json({
              message: "OTP required",
              otp_required: true,
            })
          );
        if (TEST_USER.otp === otp)
          return res(
            context.delay(3000),
            context.status(200),
            context.json({
              user: "nicholaslyz",
              is_superuser: true,
              expiry: addHours(new Date(), 4).toISOString(),
              recaptcha_key: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
            })
          );
      } else
        return res(
          context.delay(3000),
          context.status(200),
          context.json({
            user: "nicholaslyz",
            is_superuser: true,
            expiry: addHours(new Date(), 4).toISOString(),
            recaptcha_key: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
          })
        );
    }

    return res(
      context.delay(3000),
      context.status(401),
      context.json({
        message: "Invalid credentials",
        invalid_credentials: true,
      })
    );
  }),
];
