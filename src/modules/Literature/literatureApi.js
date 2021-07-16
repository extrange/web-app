import { BaseListItemSkeleton } from '../../shared/components/GenericList/BaseListItemSkeleton';
import { joinUrl } from '../../shared/util';
import { baseApi } from './../../app/network-core/baseApi';

const literatureApi = baseApi.injectEndpoints({
    endpoints: build => ({
        searchBook: build.mutation({
            query: q => ({
                url: 'literature/search/',
                params: { q }
            }),
            transformResponse: resp => resp.results
        }),
        googleBookInfo: build.mutation({
            query: isbn => ({
                url: 'literature/bookinfo/',
                params: { isbn }
            })
        }),
        goodreadsBookInfo: build.mutation({
            query: ({ workId, bookId }) => ({
                url: 'literature/bookinfo/',
                params: { work_id: workId, book_id: bookId }
            })
        }),

        // Books
        getBooks: build.query({
            query: () => 'literature/books/'
        }),

        createBook: build.mutation({
            query: data => ({
                url: 'literature/books/',
                method: 'POST',
                body: data
            }),
            onQueryStarted: (queryArg, { dispatch, queryFulfilled }) => {
                /* No skeletons for now */
                queryFulfilled.then(({ data }) =>
                    dispatch(literatureApi.util.updateQueryData('getBooks', undefined, draft => {
                        draft.unshift(data);
                    }))
                )
            }
        }),

        updateBook: build.mutation({
            query: ({ id, ...data }) => ({
                url: joinUrl('literature/books/', id),
                method: 'PUT',
                body: data,
            }),
            /* Optimistically update */
            onQueryStarted: ({ id, ...data }, { dispatch, queryFulfilled }) => {
                let result = dispatch(literatureApi.util.updateQueryData('getBooks', undefined, draft => {
                    let obj = draft.find(e => e.id === id)
                    Object.assign(obj, data)
                }))
                queryFulfilled.catch(result.undo)
            }
        }),

        deleteBook: build.mutation({
            query: ({ id }) => ({
                url: joinUrl('literature/books/', id) + '/',
                method: 'DELETE',
            }),
            /* Optimistically delete */
            onQueryStarted: ({ id }, { dispatch, queryFulfilled }) => {
                let result = dispatch(literatureApi.util.updateQueryData('getBooks', undefined, draft => draft.filter(e => e.id !== id)))
                queryFulfilled.catch(result.undo)
            }
        }),

        // Authors
        getAuthors: build.query({
            query: () => 'literature/authors/'
        }),

        createAuthor: build.mutation({
            query: data => ({
                url: 'literature/authors/',
                method: 'POST',
                body: data
            }),
            onQueryStarted: (queryArg, { dispatch, queryFulfilled }) => {
                /* Show skeleton optimistically */
                let result = dispatch(literatureApi.util.updateQueryData('getAuthors', undefined, draft => {
                    draft.unshift(BaseListItemSkeleton())
                }))
                queryFulfilled.then(result.undo).catch(result.undo)

                /* Update cache with result if successful */
                queryFulfilled.then(({ data }) => {
                    dispatch(literatureApi.util.updateQueryData('getAuthors', undefined, draft => {
                        draft.unshift(data);
                    }))
                })
            }
        }),

        updateAuthor: build.mutation({
            query: ({ id, ...data }) => ({
                url: joinUrl('literature/authors/', id),
                method: 'PUT',
                body: data,
            }),
            /* Optimistically update */
            onQueryStarted: ({ id, ...data }, { dispatch, queryFulfilled }) => {
                let result = dispatch(literatureApi.util.updateQueryData('getAuthors', undefined, draft => {
                    let obj = draft.find(e => e.id === id)
                    Object.assign(obj, data)
                }))
                queryFulfilled.catch(result.undo)
            }
        }),

        deleteAuthor: build.mutation({
            query: ({ id }) => ({
                url: joinUrl('literature/authors/', id) + '/',
                method: 'DELETE'
            }),
            onQueryStarted: ({ id }, { dispatch, queryFulfilled }) => {
                /* Optimistically delete */
                let result = dispatch(literatureApi.util.updateQueryData('getAuthors', undefined, draft => draft.filter(e => e.id !== id)))
                queryFulfilled.catch(result.undo)

                /* Update getBooks cache */
                let bookResult = dispatch(literatureApi.util.updateQueryData('getBooks', undefined,
                    draft => draft.forEach(book => {
                        let idx = book.authors.indexOf(id)
                        if (idx !== -1) book.authors.splice(idx, 1)
                    })
                ))
                queryFulfilled.catch(bookResult.undo)
            }
        }),

        // Genres
        getGenres: build.query({
            query: () => 'literature/genres/'
        }),

        createGenre: build.mutation({
            query: data => ({
                url: 'literature/genres/',
                method: 'POST',
                body: data
            }),
            onQueryStarted: (queryArg, { dispatch, queryFulfilled }) => {
                /* Update cache with result if successful, don't show skeleton for now*/
                queryFulfilled.then(({ data }) => {
                    dispatch(literatureApi.util.updateQueryData('getGenres', undefined, draft => {
                        draft.unshift(data);
                    }))
                })
            }
        }),

        updateGenre: build.mutation({
            query: ({ id, ...data }) => ({
                url: joinUrl('literature/genres/', id),
                method: 'PUT',
                body: data,
            }),
            /* Optimistically update*/
            onQueryStarted: ({ id, ...data }, { dispatch, queryFulfilled }) => {
                let result = dispatch(literatureApi.util.updateQueryData('getGenres', undefined, draft => {
                    let obj = draft.find(e => e.id === id)
                    Object.assign(obj, data)
                }))
                queryFulfilled.catch(result.undo)
            }
        }),

        deleteGenre: build.mutation({
            query: ({ id }) => ({
                url: joinUrl('literature/genres/', id) + '/',
                method: 'DELETE'
            }),
            onQueryStarted: ({ id }, { dispatch, queryFulfilled }) => {
                /* Optimistically delete */
                let result = dispatch(literatureApi.util.updateQueryData('getGenres', undefined, draft => draft.filter(e => e.id !== id)))
                queryFulfilled.catch(result.undo)

                /* Update getBooks cache */
                let bookResult = dispatch(literatureApi.util.updateQueryData('getBooks', undefined,
                    draft => draft.forEach(book => {
                        let idx = book.genres.indexOf(id)
                        if (idx !== -1) book.genres.splice(idx, 1)
                    })
                ))
                queryFulfilled.catch(bookResult.undo)
            }
        }),

        getTypes: build.query({
            query: () => 'literature/types/'
        }),

        createType: build.mutation({
            query: data => ({
                url: 'literature/types/',
                method: 'POST',
                body: data
            }),
            onQueryStarted: (queryArg, { dispatch, queryFulfilled }) => {
                /* Show skeleton optimistically */
                let result = dispatch(literatureApi.util.updateQueryData('getTypes', undefined, draft => {
                    draft.unshift(BaseListItemSkeleton())
                }))
                queryFulfilled.then(result.undo).catch(result.undo)

                /* Update cache with result if successful */
                queryFulfilled.then(({ data }) => {
                    dispatch(literatureApi.util.updateQueryData('getTypes', undefined, draft => {
                        draft.unshift(data);
                    }))
                })
            }
        }),

        updateType: build.mutation({
            query: ({ id, ...data }) => ({
                url: joinUrl('literature/types/', id),
                method: 'PUT',
                body: data,
            }),
            /* Optimistically update */
            onQueryStarted: ({ id, ...data }, { dispatch, queryFulfilled }) => {
                let result = dispatch(literatureApi.util.updateQueryData('getTypes', undefined, draft => {
                    let obj = draft.find(e => e.id === id)
                    Object.assign(obj, data)
                }))
                queryFulfilled.catch(result.undo)
            }
        }),

        deleteType: build.mutation({
            query: ({ id }) => ({
                url: joinUrl('literature/types/', id) + '/',
                method: 'DELETE'
            }),
            onQueryStarted: ({ id }, { dispatch, queryFulfilled }) => {
                /* Optimistically delete */
                let result = dispatch(literatureApi.util.updateQueryData('getTypes', undefined, draft => draft.filter(e => e.id !== id)))
                queryFulfilled.catch(result.undo)

                /* Update getBooks cache.*/
                let bookResult = dispatch(literatureApi.util.updateQueryData('getTypes', undefined,
                    draft => draft.forEach(book => {
                        if (book.type === id) book.type = null
                    })
                ))
                queryFulfilled.catch(bookResult.undo)
            }
        }),

    })
})

export const {
    useSearchBookMutation,
    useGoodreadsBookInfoMutation,
    useGoogleBookInfoMutation,

    useGetBooksQuery,
    useCreateBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,

    useGetAuthorsQuery,
    useCreateAuthorMutation,
    useUpdateAuthorMutation,
    useDeleteAuthorMutation,

    useGetGenresQuery,
    useCreateGenreMutation,
    useUpdateGenreMutation,
    useDeleteGenreMutation,

    useGetTypesQuery,
    useCreateTypeMutation,
    useUpdateTypeMutation,
    useDeleteTypeMutation,

} = literatureApi