import { baseApi } from "../network-core/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    checkLogin: build.query({
      query: () => "account/login/",
    }),
    login: build.mutation({
      query: (body) => ({
        url: "account/login/",
        method: "POST",
        body,
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: "account/logout/",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCheckLoginQuery,
  useRecaptchaKeyQuery,
  useLoginMutation,
  useLogoutMutation,
} = authApi;
