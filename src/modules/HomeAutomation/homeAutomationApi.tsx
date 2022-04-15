import { baseApi } from "../../app/network-core/baseApi";

const homeAutomationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sendCommand: build.mutation({
      query: (command) => ({
        url: "home-automation/send",
        method: "POST",
        body: { command },
      }),
    }),
  }),
});

export const { useSendCommandMutation } = homeAutomationApi;
