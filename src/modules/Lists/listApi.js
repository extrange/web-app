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

            /* Update getItems with the newly created item on success */
            onQueryStarted: ({ list }, { dispatch, queryFulfilled }) => {
                queryFulfilled.then(({ data }) =>
                    dispatch(listApi.util.updateQueryData('getItems', list, draft => {
                        draft.unshift(data)
                    })))
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
    useGetItemsQuery,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
} = listApi