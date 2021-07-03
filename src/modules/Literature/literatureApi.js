import { baseApi } from './../../app/network-core/baseApi';
import { generateCrudApi } from '../../shared/generateCrudApi';

const generateStub = name => generateCrudApi(`literature/${name.toLowerCase()}s/`, baseApi, {
    get: `get${name}s`,
    create: `create${name}`,
    update: `update${name}`,
    delete: `delete${name}`
})

/* Exclude create method from generateCrudApi for book, for now, because of issues displaying skeletons */
const bookApi = generateCrudApi('literature/books/', baseApi, {
    get: 'getBooks',
    update: 'updateBook',
    delete: 'deleteBook',
})

const authorApi = generateStub('Author')

/* Exclude create method from generateCrudApi for book, for now, because of issues displaying skeletons */
const genreApi = generateCrudApi('literature/genres/', baseApi, {
    get: 'getGenres',
    update: 'updateGenre',
    delete: 'deleteGenre',
})

const typeApi = generateStub('Type')

const literatureApi = baseApi.injectEndpoints({
    endpoints: build => ({
        searchBook: build.mutation({
            query: q => ({
                url: 'literature/search/',
                params: {q}
            }),
            transformResponse: resp => resp.results
        }),
        googleBookInfo: build.mutation({
            query: isbn => ({
                url: 'literature/bookinfo/',
                params: {isbn}
            })
        }),
        goodreadsBookInfo: build.mutation({
            query: ({workId, bookId}) => ({
                url: 'literature/bookinfo/',
                params: {work_id: workId, book_id: bookId}
            })
        }),
        createBook: build.mutation({
            query: data => ({
                url: 'literature/books/',
                method: 'POST',
                body: data,
            }),
            onQueryStarted: (_arg, { dispatch, queryFulfilled }) => {

                /* Update getItems with the newly created item on success*/
                queryFulfilled
                    .then(({ data }) => {
                        dispatch(baseApi.util.updateQueryData('getBooks', undefined, draft => {
                            draft.unshift(data);
                        }));
                    })
            }
        }),
        createGenre: build.mutation({
            query: data => ({
                url: 'literature/genres/',
                method: 'POST',
                body: data,
            }),
            onQueryStarted: (_arg, { dispatch, queryFulfilled }) => {

                /* Update getItems with the newly created item on success*/
                queryFulfilled
                    .then(({ data }) => {
                        dispatch(baseApi.util.updateQueryData('getGenres', undefined, draft => {
                            draft.unshift(data);
                        }));
                    })
            }
        }),
        ...bookApi(build),
        ...authorApi(build),
        ...genreApi(build),
        ...typeApi(build),
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