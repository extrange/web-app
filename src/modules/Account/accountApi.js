import { baseApi } from "./../../app/network-core/baseApi";

baseApi.enhanceEndpoints({
  addTagTypes: ["otpStatus", "browsers"],
});

const accountApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBrowsers: build.query({
      query: () => "account/browsers/",
      providesTags: ["browsers"],
    }),
    forgetAndLogoutBrowser: build.mutation({
      query: (id) => ({
        url: `account/browsers/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["browsers"],
    }),

    getOtpStatus: build.query({
      query: () => "account/twofactor/",
      providesTags: ["otpStatus"],
    }),

    modify2Fa: build.mutation({
      query: (data) => ({
        url: "account/twofactor/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["otpStatus"],
    }),
  }),
});

export const {
  useGetBrowsersQuery,
  useForgetAndLogoutBrowserMutation,
  useGetOtpStatusQuery,
  useModify2FaMutation,
} = accountApi;
