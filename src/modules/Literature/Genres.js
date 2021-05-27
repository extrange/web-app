import SortableTree from "react-sortable-tree";
import 'react-sortable-tree/style.css';
import styled from 'styled-components'
import {recursiveSort} from "./utils";
import React, {useCallback, useEffect, useState} from "react";
import AddIcon from "@material-ui/icons/Add";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    IconButton,
    ListItem,
    ListItemText
} from "@material-ui/core";
import {BACKGROUND_COLOR} from "../../shared/backgroundScreen";
import {GenreDialog} from "./GenreDialog";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import NoteIcon from '@material-ui/icons/Note';
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";


const StyledSortableTree = styled(SortableTree)`

  .rst__lineHalfHorizontalRight::before,
  .rst__lineFullVertical::after,
  .rst__lineHalfVerticalTop::after,
  .rst__lineHalfVerticalBottom::after,
  .rst__lineChildren::after {
    background-color: white;
  }

  .rst__rowContents {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }

  .rst__moveHandle {
    width: 20px;
    border: none;
    box-shadow: none;
    background-color: transparent;
  }
`

const StyledFab = styled(Fab)`
  position: fixed;
  z-index: 1;
  bottom: 20px;
  right: 20px;
`;


const Container = styled.div`
  ${BACKGROUND_COLOR};
`

export const NumberCircle = styled.span`
  margin: auto 5px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  padding: 3px;
  border-radius: 20%;
  font-weight: lighter;
`

export const Genres = ({
                           books,
                           genres,
                           getGenres,
                           addGenre,
                           updateGenre,
                           deleteGenre,
                           setTitleEndAdornment,
                       }) => {

    const [treeState, setTreeState] = useState([])
    const [editingItem, setEditingItem] = useState(false);
    const [genreInfoDialogOpen, setGenreInfoDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const onChange = useCallback(_genres => setTreeState(recursiveSort(getTreeDataFromGenres(_genres, books), (a, b) => a.name.localeCompare(b.name))), [books])
    const onDelete = id => {
        setLoading(true)
        deleteGenre(id)
            .then(getGenres)
            .then(() => setLoading(false));
    }
    const onClose = () => setEditingItem(null);
    const onSubmit = (data, id) => {
        if (id) {
            // Editing item
            setLoading(true)
            updateGenre(data, id)
                .then(getGenres)
                .then(() => setLoading(false));
            setEditingItem(null)
        } else {
            // Adding item
            setLoading(true)
            addGenre(data)
                .then(getGenres)
                .then(() => setLoading(false));
            setEditingItem(null)
        }
    };

    /*Will also get book counts for each genre, with each parent's including the sum of their children*/
    const getTreeDataFromGenres = (genres, books) => {
        let genreMap = new Map()
        let root = []
        let bookCountForGenre = {}

        /*Get count of books for each genre*/
        books.forEach(e => e.genres.forEach(id =>
            id in bookCountForGenre ?
                bookCountForGenre[id] += 1 :
                bookCountForGenre[id] = 1))

        /*Clone genres, add React-Sortable-Tree specific props*/
        genres.forEach(e => genreMap.set(e.id, {
            ...e,
            expanded: true,
            children: [],
            bookCount: bookCountForGenre[e.id] ?? 0,
            title: ({node}) => <ListItem
                disableGutters
                dense
                onClick={() => setEditingItem(node)}
                button>
                <NumberCircle>{node.bookCount}</NumberCircle>
                <ListItemText primary={`${node.name}`}/>
                {node.notes &&
                <NoteIcon/>}
            </ListItem>
        }))

        let addCount = (v, numToAdd) => {
            if (!v.parent) return
            let parent = genreMap.get(v.parent)
            parent.bookCount += numToAdd
            addCount(parent, numToAdd);
        }

        /* Start creating the tree
         * Also add descendent counts*/
        genreMap.forEach(v => {
            if (v.parent) {
                genreMap.get(v.parent).children.push(v);
                addCount(v, v.bookCount)
            } else {
                root.push(v);
            }
        })

        return root
    }

    const onMoveNode = ({
                            node: {title, id, children, parent, ...data},
                            nextParentNode
                        }) => {
        if (parent === (nextParentNode ? nextParentNode.id : null)) return
        setLoading(true)
        updateGenre({...data, parent: nextParentNode && nextParentNode.id}, id)
            .then(getGenres)
            .then(() => setLoading(false))

    }

    useEffect(() => onChange(genres), [genres, onChange])

    useEffect(() => {
        setTitleEndAdornment(<>
            <IconButton onClick={() => setGenreInfoDialogOpen(true)}>
                <InfoOutlinedIcon/>
            </IconButton>
            {loading && <CircularProgress size={20}/>}
        </>)
        return () => setTitleEndAdornment(null)
    }, [loading, setTitleEndAdornment])

    return <DndProvider backend={HTML5Backend}>
        <Dialog
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
        <Container>
            <StyledFab color={'primary'} onClick={() => setEditingItem(true)}>
                <AddIcon/>
            </StyledFab>
            {editingItem && <GenreDialog
                genres={genres}
                editingItem={editingItem}
                onClose={onClose}
                onDelete={onDelete}
                onSubmit={onSubmit}
            />}
            <StyledSortableTree
                canDrop={({prevParent, nextParent}) => prevParent?.id !== nextParent?.id}
                getNodeKey={({node}) => node.id}
                onChange={setTreeState}
                onMoveNode={onMoveNode}
                rowHeight={35}
                treeData={treeState}
                isVirtualized={false}
            />
        </Container>
    </DndProvider>

}