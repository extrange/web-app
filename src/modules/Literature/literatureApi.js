import { baseApi } from './../../app/network-core/baseApi';
import { BaseGetCreateSkeleton, generateCrudApi } from '../../shared/generateCrudApi';

const generateStub = (name, getCreateSkeleton = BaseGetCreateSkeleton) => generateCrudApi(`literature/${name.toLowerCase()}s/`, baseApi, {
    get: `get${name}s`,
    create: `create${name}`,
    update: `update${name}`,
    delete: `delete${name}`,
    getCreateSkeleton,
})

/* Exclude create method from generateCrudApi for book, for now, because of issues displaying skeletons */
const bookApi = generateStub('Book', null)
const authorApi = generateStub('Author')
/* Exclude create method from generateCrudApi for book, for now, because of issues displaying skeletons */
const genreApi = generateStub('Genre', null)
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