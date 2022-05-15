import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { baseApi } from "../../app/network-core/baseApi";

export const testingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    throwHttpError: build.mutation({
      query: (status) => ({
        url: "test/",
        params: { status },
      }),
    }),
    throwFetchError: build.mutation({
      queryFn: (args, api, extraOptions) =>
        fetchBaseQuery({
          baseUrl: "https://dummy.nicholaslyz.com",
          credentials: "include",
        })(args, api, extraOptions),
    }),
    mutationTest: build.mutation({
      query: () => "test/mutationTest/",
    }),
  }),
});

export const {
  useThrowHttpErrorMutation,
  useThrowFetchErrorMutation,
  useMutationTestMutation,
} = testingApi;
