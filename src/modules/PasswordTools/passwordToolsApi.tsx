import { baseApi } from "../../app/network-core/baseApi";

const passwordToolsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    hibpLookup: build.mutation({
      query: (hash) => ({
        url: "passwords/lookup/",
        params: { hash },
      }),
    }),
  }),
});

export const { useHibpLookupMutation } = passwordToolsApi;
