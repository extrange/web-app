import HomeIcon from '@material-ui/icons/Home';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import PeopleIcon from '@material-ui/icons/People';
import TitleIcon from '@material-ui/icons/Title';
import { GenericList } from '../../shared/components/GenericList/GenericList';
import { Books } from "./Books";
import { Genres } from './Genres';
import { useCreateAuthorMutation, useCreateTypeMutation, useDeleteAuthorMutation, useDeleteTypeMutation, useGetAuthorsQuery, useGetTypesQuery, useUpdateAuthorMutation, useUpdateTypeMutation } from './literatureApi';

export const submodules = {
    BOOKS: {
        name: 'Books',
        Icon: HomeIcon,
        jsx: Books,
    },
    AUTHORS: {
        name: 'Authors',
        Icon: PeopleIcon,
        jsx: GenericList,
        props: {
            getItemsQuery: useGetAuthorsQuery,
            createItemMutation: useCreateAuthorMutation,
            updateItemMutation: useUpdateAuthorMutation,
            deleteItemMutation: useDeleteAuthorMutation,
            defaultItemValues: { name: '', notes: '' }
        }
    },
    GENRES: {
        name: 'Genres',
        Icon: InsertDriveFileIcon,
        jsx: Genres
    },
    TYPES: {
        name: 'Types',
        Icon: TitleIcon,
        jsx: GenericList,
        props: {
            getItemsQuery: useGetTypesQuery,
            createItemMutation: useCreateTypeMutation,
            updateItemMutation: useUpdateTypeMutation,
            deleteItemMutation: useDeleteTypeMutation,
            defaultItemValues: { name: '', notes: '' }
        }
    }
}