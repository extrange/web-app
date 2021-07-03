import {
    ListItem,
    ListItemText
} from "@material-ui/core"
import NoteIcon from '@material-ui/icons/Note'
import React from "react"
import styled from 'styled-components'

const NumberCircle = styled.span`
  margin: auto 5px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  padding: 3px;
  border-radius: 20%;
  font-weight: lighter;
`

/*Recursively sort Genre objects*/
export const recursiveSort = (arr, compareFn, childrenKey = 'children') => {
    let mapped = arr.map(e => e[childrenKey].length ? {
        ...e,
        [childrenKey]: recursiveSort(e[childrenKey], compareFn, childrenKey)
    } : e)
    return mapped.sort(compareFn)
}

/*Get array of ancestors, from top level to direct parent*/
export const getAncestors = (e, genres) => {
    let arr = []
    let currentEl = e
    while (currentEl.parent) {
        // eslint-disable-next-line no-loop-func
        let parent = genres.find(p => p.id === currentEl.parent);
        arr.unshift(parent.name)
        currentEl = parent
    }
    return arr
}

/*Add extra contextual information to the genres object*/
export const mapGenres = (e, genres) => {
    let ancestors = getAncestors(e, genres)
    return ({
        ...e,
        ancestors, /*for display*/
        fullName: [...ancestors, e.name].join(' '), /*for sorting*/
    })
}

/*Will also get book counts for each genre, with each parent's including the sum of their children*/
export const getTreeDataFromGenres = (setEditingItem) => (genres, books) => {
    let genreMap = new Map();
    let root = [];
    let bookCountForGenre = {};

    /*Get count of books for each genre*/
    books.forEach(e => e.genres.forEach(id => id in bookCountForGenre ?
        bookCountForGenre[id] += 1 :
        bookCountForGenre[id] = 1));

    /*Clone genres, add React-Sortable-Tree specific props*/
    genres.forEach(e => genreMap.set(e.id, {
        ...e,
        expanded: true,
        children: [],
        bookCount: bookCountForGenre[e.id] ?? 0,
        title: ({ node }) => <ListItem
            disableGutters
            dense
            onClick={() => setEditingItem(node)}
            button>
            <NumberCircle>{node.bookCount}</NumberCircle>
            <ListItemText primary={`${node.name}`} />
            {node.notes &&
                <NoteIcon />}
        </ListItem>
    }));

    let addCount = (v, numToAdd) => {
        if (!v.parent)
            return;
        let parent = genreMap.get(v.parent);
        parent.bookCount += numToAdd;
        addCount(parent, numToAdd);
    };

    /* Start creating the tree
     * Also add descendent counts*/
    genreMap.forEach(v => {
        if (v.parent) {
            genreMap.get(v.parent).children.push(v);
            addCount(v, v.bookCount);
        } else {
            root.push(v);
        }
    });

    return root;
};
