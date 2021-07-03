import { joinUrl } from "./util";
import { nanoid } from '@reduxjs/toolkit';

/**
 * Helper function to generate CRUD endpoints.
 * Can be used with GenericList.
 * 
 * Optimistic update and delete (create doesn't show a skeleton due to
 *  problems rendering a skeleton in tables (for now))
 * 
 * No cache invalidation (cache is modified optimistically and rolled back if necessary)
 */
export const generateCrudApi = (url, api, { get, create, update, delete: _delete }) => build => {

    let obj = {}


    if (!get)
        throw new Error(`'get' must be supplied, but got ${typeof get}`)

    obj[get] = build.query({
        query: () => url
    })


    if (create) {

        obj[create] = build.mutation({
            query: data => ({
                url,
                method: 'POST',
                body: data,
            }),
            onQueryStarted: (_arg, { dispatch, queryFulfilled }) => {
                /* Optimistically show skeleton */
                let id = nanoid()
                let result = dispatch(api.util.updateQueryData(get, undefined, draft => {
                    draft.unshift({ isSkeleton: true, id })
                }))

                /* Update getItems with the newly created item on success*/
                queryFulfilled
                    .then(({ data }) => {
                        result.undo()
                        dispatch(api.util.updateQueryData(get, undefined, draft => {
                            draft.unshift(data);
                        }));
                    })
                    .catch(result.undo)
            }
        })
    }

    if (update) {

        obj[update] = build.mutation({
            query: ({ id, ...data }) => ({
                url: joinUrl(url, id) + '/',
                method: 'PUT',
                body: data,
            }),
            /* Optimistically update the item, rollback if failure*/
            onQueryStarted: ({ id, ...data }, { dispatch, queryFulfilled }) => {
                let result = dispatch(api.util.updateQueryData(get, undefined, draft => {
                    let obj = draft.find(e => e.id === id)
                    Object.assign(obj, data)
                }))
                queryFulfilled.catch(result.undo)
            }
        })
    }

    if (_delete) {
        obj[_delete] = build.mutation({
            query: ({ id }) => ({
                url: joinUrl(url, id) + '/',
                method: 'DELETE',
            }),

            /* Optimistically delete item */
            onQueryStarted: ({ id }, { dispatch, queryFulfilled }) => {
                let result = dispatch(api.util.updateQueryData(get, undefined, draft => draft.filter(e => e.id !== id)))
                queryFulfilled.catch(result.undo)
            }
        })
    }

    return obj
}