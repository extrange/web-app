import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React, { useEffect, useState } from "react";
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import styled from 'styled-components';
import { BACKGROUND_COLOR } from "../../shared/components/backgroundScreen";
import { Loading } from "../../shared/components/Loading";
import { useGetBooksQuery } from "./literatureApi";
import { getTreeDataFromGenres, recursiveSort } from "./utils";


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

export const GenreTreeView = ({
    updateItemMutation,
    items: genres,
    loading,
    setEditingItem,
}) => {

    const [treeState, setTreeState] = useState([])

    const { data: books } = useGetBooksQuery()
    const [updateGenre] = updateItemMutation()

    /* Set tree state */
    useEffect(() => {
        if (!genres || !books) return
        setTreeState(recursiveSort(getTreeDataFromGenres(setEditingItem)(genres, books), (a, b) => a.name.localeCompare(b.name)))
    }, [books, genres, setEditingItem])

    /* TODO Why can't I update name/notes and parent simultaneously? */
    const onMoveNode = ({
        node: { title, id, children, parent, ...data },
        nextParentNode
    }) => {
        if (parent === (nextParentNode ? nextParentNode.id : null)) return
        updateGenre({ id, parent: nextParentNode && nextParentNode.id, ...data })
    }

    if (loading || !genres || !books) return (
        <Loading fullscreen={false} />
    )

    return (
        <Container>
            <StyledFab color={'primary'} onClick={() => setEditingItem(true)}>
                <AddIcon />
            </StyledFab>
            
                <StyledSortableTree
                    canDrop={({ prevParent, nextParent }) => prevParent?.id !== nextParent?.id}
                    getNodeKey={({ node }) => node.id}
                    onChange={setTreeState}
                    onMoveNode={onMoveNode}
                    rowHeight={35}
                    treeData={treeState}
                    isVirtualized={false}
                />
            
        </Container>
    )
}


