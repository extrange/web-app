import { baseApi } from "../network-core/baseApi";
import { parseISO } from "date-fns";

const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch notifications, converting ISO8601 dates
     * to milliseconds since epoch (timestamps), the same used
     * for app notifications.
     */
    getNotifications: build.query({
      query: () => "notifications/",
      transformResponse: (response) =>
        response.map(({ created, dismissed, ...rest }) => ({
          created: created ? parseISO(created).getTime() : null,
          dismissed: dismissed ? parseISO(dismissed).getTime() : null,
          ...rest,
        })),
    }),

    dismissNotification: build.mutation({
      query: ({ id }) => ({
        url: `notifications/${id}/`,
        method: "DELETE",
      }),

      /* Optimistically update */
      onQueryStarted: ({ id }, { dispatch, queryFulfilled }) => {
        let result = dispatch(
          notificationsApi.util.updateQueryData(
            "getNotifications",
            undefined,
            (draft) => draft.filter((e) => e.id !== id)
          )
        );
        queryFulfilled.catch(result.undo);
      },
    }),
  }),
});

export const { useGetNotificationsQuery, useDismissNotificationMutation } =
  notificationsApi;
