import { baseApi } from "../network-core/baseApi";

export interface LoginFail {
  message: string;
  otp_required?: boolean;
}
export interface CheckLoginFail extends LoginFail {
  recaptcha_key: string;
}

export interface LoginSuccess {
  user: string;
  is_superuser: boolean;
  expiry: string;
  recaptcha_key: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  save_browser: boolean;
  otp: string | null;
}

export const isLoginSuccess = (
  login: LoginFail | CheckLoginFail | LoginSuccess
): login is LoginSuccess => "user" in login;

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    checkLogin: build.query<LoginSuccess | CheckLoginFail, void>({
      query: () => "account/login/",
    }),
    login: build.mutation<
      LoginSuccess | LoginFail,
      LoginCredentials & {
        token: string;
      }
    >({
      query: (body) => ({
        url: "account/login/",
        method: "POST",
        body,
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: "account/logout/",
        method: "POST",
      }),
    }),
  }),
});

export const { useCheckLoginQuery, useLoginMutation, useLogoutMutation } =
  authApi;
