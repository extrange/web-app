import { baseApi } from "../../app/network-core/baseApi";
import { baseQueryWithRetry } from "../../app/network-core/baseQuery";

export const testingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    throwHttpError: build.mutation({
      query: (status) => ({
        url: "test/",
        params: { status },
      }),
    }),
    throwFetchError: build.mutation({
      queryFn: (arg, api, extraOptions) =>
        baseQueryWithRetry({
          baseUrl: "https://dummy.nicholaslyz.com",
          credentials: "include",
        })(arg, api, extraOptions),
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
