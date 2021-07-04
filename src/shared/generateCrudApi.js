import { joinUrl } from "./util";
import { nanoid } from '@reduxjs/toolkit';

export const BaseGetCreateSkeleton = queryArg => ({ isSkeleton: true, id: nanoid() })

/**
 * Helper function to generate CRUD endpoints.
 * Can be used with GenericList.
 * 
 * Assumes URL endpoints are of the form 'itemType/itemId/'
 * Will not pass any arguments to cache update logic
 * 
 * Optimistic update and delete (create doesn't show a skeleton due to
 *  problems rendering a skeleton in tables (for now))
 * 
 * No cache invalidation (cache is modified optimistically and rolled back if necessary)
 */
export const generateCrudApi = (url, api, {
    get,
    create,
    update,
    delete: _delete,
    getCreateSkeleton = BaseGetCreateSkeleton
}) => build => {

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
            onQueryStarted: (queryArg, { dispatch, queryFulfilled }) => {
                /* Optimistically show skeleton if enabled*/
                if (getCreateSkeleton) {
                    let result = dispatch(api.util.updateQueryData(get, undefined, draft => {
                        draft.unshift(getCreateSkeleton(queryArg))
                    }))
                    queryFulfilled.then(result.undo).catch(result.undo)
                }

                /* Update getItems with the newly created item on success*/
                queryFulfilled
                    .then(({ data }) => {
                        dispatch(api.util.updateQueryData(get, undefined, draft => {
                            draft.unshift(data);
                        }));
                    })
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