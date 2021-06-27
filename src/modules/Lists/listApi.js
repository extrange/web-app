import { nanoid } from '@reduxjs/toolkit';
import { baseApi } from "../../app/network-core/baseApi";

baseApi.enhanceEndpoints({
    addTagTypes: ['lists', 'items']
})

/* Optimistic updates for update and delete operations */
const listApi = baseApi.injectEndpoints({
    endpoints: build => ({
        getLists: build.query({
            query: () => `tasks/tasklists/`,
            providesTags: ['lists']
        }),

        createList: build.mutation({
            query: ({ title }) => ({
                url: `tasks/tasklists/`,
                method: 'POST',
                body: { title }
            }),

            /* Invalidate cache for now since I'm not sure if lists are sorted
            alphabetically by the server */
            invalidatesTags: ['lists']
        }),

        updateList: build.mutation({
            query: ({ id, title }) => ({
                url: `tasks/tasklists/${id}/`,
                method: 'PUT',
                body: { id, title }
            }),

            /* Optimistically update */
            onQueryStarted: ({ id, ...data }, { dispatch, queryFulfilled }) => {
                let result = dispatch(listApi.util.updateQueryData('getLists', undefined, draft => {
                    let obj = draft.find(e => e.id === id)
                    Object.assign(obj, data)
                }))
                queryFulfilled.catch(result.undo)
            }
        }),

        deleteList: build.mutation({
            query: ({ id }) => ({
                url: `tasks/tasklists/${id}/`,
                method: 'DELETE',
            }),

            /* Optimistically delete */
            onQueryStarted: ({ id }, { dispatch, queryFulfilled }) => {
                let result = dispatch(listApi.util.updateQueryData('getLists', undefined, draft =>
                    draft.filter(e => e.id !== id)))
                queryFulfilled.catch(result.undo)
            }
        }),

        getItems: build.query({
            query: list => `tasks/tasklists/${list}/tasks/`,
            providesTags: (_result, _error, list) => [{ type: 'lists', id: list }],
        }),

        createItem: build.mutation({
            query: ({ list, title, notes }) => ({
                url: `tasks/tasklists/${list}/tasks/`,
                method: 'POST',
                body: { title, notes, tasklist: list }
            }),

            onQueryStarted: ({ list }, { dispatch, queryFulfilled }) => {
                /* Optimistically show skeleton */
                let id = nanoid()
                let result = dispatch(listApi.util.updateQueryData('getItems', list, draft => {
                    draft.unshift({ isSkeleton: true, id })
                }))

                /* Update getItems with the newly created item on success, and remove skeleton*/
                queryFulfilled
                    .then(({ data }) => {
                        dispatch(listApi.util.updateQueryData('getItems', list, draft => {
                            draft.unshift(data);
                            let idx = draft.findIndex(e => e.id === id)
                            if (idx !== -1)
                                draft.splice(idx, 1)
                        }));
                    })
                    .catch(result.undo)
            }
        }),

        updateItem: build.mutation({
            query: ({ list, id, title, notes }) => ({
                url: `tasks/tasklists/${list}/tasks/${id}/`,
                method: 'PUT',
                body: { title, notes, tasklist: list }
            }),

            /* Optimistically update the item (it will exist in cache IF createItem was successful,
                due to onQueryStarted in createItem) */
            onQueryStarted: ({ list, id, ...data }, { dispatch, queryFulfilled }) => {
                let result = dispatch(listApi.util.updateQueryData('getItems', list, draft => {
                    let obj = draft.find(e => e.id === id)
                    Object.assign(obj, data)
                }))
                queryFulfilled.catch(result.undo)
            }
        }),

        deleteItem: build.mutation({
            query: ({ list, id }) => ({
                url: `tasks/tasklists/${list}/tasks/${id}/`,
                method: 'DELETE',
            }),

            /* Optimistically delete item */
            onQueryStarted: ({ list, id }, { dispatch, queryFulfilled }) => {
                let result = dispatch(listApi.util.updateQueryData('getItems', list, draft => draft.filter(e => e.id !== id)))
                queryFulfilled.catch(result.undo)
            }
        })
    })
})



export const {
    useGetListsQuery,
    useCreateListMutation,
    useUpdateListMutation,
    useDeleteListMutation,

    useGetItemsQuery,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
} = listApi