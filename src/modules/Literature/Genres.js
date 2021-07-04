import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { useEffect, useState } from "react";
import { GenericList } from "../../shared/components/GenericList/GenericList";
import { GenreEdit } from './GenreEdit';
import { GenreTreeView } from "./GenreTreeView";
import { useCreateGenreMutation, useDeleteGenreMutation, useGetGenresQuery, useUpdateGenreMutation } from "./literatureApi";


export const Genres = ({ setTitleEndAdornment }) => {

    const [genreInfoDialogOpen, setGenreInfoDialogOpen] = useState(false);

    useEffect(() => {
        setTitleEndAdornment(<>
            <IconButton onClick={() => setGenreInfoDialogOpen(true)}>
                <InfoOutlinedIcon />
            </IconButton>
        </>)
        return () => setTitleEndAdornment(null)
    }, [setTitleEndAdornment])

    return <>
        <Dialog
            fullScreen={false}
            disableScrollLock
            open={genreInfoDialogOpen}
            onClose={() => setGenreInfoDialogOpen(false)}>
            <DialogTitle>Genre Notes</DialogTitle>
            <DialogContent>
                <DialogContentText component={'div'}>
                    A book can belong to multiple tags e.g.
                    <ul>
                        <li>Fahrenheit 451 belongs to 'Science Fiction', 'Dystopian'</li>
                    </ul>

                    Books can be tagged with both a tag as well as its parent:
                    searching for the parent tag will also include all child tags

                    <ul>
                        <li>If a tag is deleted/modified, it is deleted/modified on all books</li>
                        <li>A parent tag cannot be deleted if it has children</li>
                    </ul>

                    Also, book counts by genre will not add up to the total number of books. This is because
                    some books can belong to two top-level genres, for example Finance and Programming.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color={'primary'} onClick={() => setGenreInfoDialogOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
        <GenericList
            getItemsQuery={useGetGenresQuery}
            createItemMutation={useCreateGenreMutation}
            updateItemMutation={useUpdateGenreMutation}
            deleteItemMutation={useDeleteGenreMutation}
            defaultItemValues={{ name: '', notes: '' }}
            List={GenreTreeView}
            ItemEdit={GenreEdit}
        />
    </>
}