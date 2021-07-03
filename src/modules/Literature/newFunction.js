import React from "react";
import {
    ListItem,
    ListItemText
} from "@material-ui/core";
import NoteIcon from '@material-ui/icons/Note';
import { NumberCircle } from "./Genres";

export function newFunction(setEditingItem) {
    return (genres, books) => {
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
}
