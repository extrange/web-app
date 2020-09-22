//Books in a series should be collapsible
import React, {useEffect} from 'react'
import {Networking} from "../util";
import * as Url from "./urls";
import styled from "styled-components";

const StyledTh = styled.th`
    border: 1px solid black;
`;

const StyledTd = styled.td`
    border: 1px solid black;
`;

const StyledTr = styled.tr`
    :hover, :active, :focus {
        background-color: lightgray;
    }
`;

const StyledTable = styled.table`
    border: 1px solid black;
    border-collapse: collapse;
    max-width: 600px;
`;


export const ViewBooks = ({setBooks, ...props}) => {

    useEffect(() => {
        Networking.send(Url.BOOKS, {method: 'GET'})
            .then(resp => resp.json())
            .then(json => {
                setBooks(json);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>
        <StyledTable>
            <caption><h1>View Books for {}</h1></caption>
            <colgroup>
            </colgroup>
            <thead>
            <StyledTr>
                <StyledTh>ID</StyledTh>
                <StyledTh>Title</StyledTh>
                <StyledTh>Authors</StyledTh>
                <StyledTh>Genre</StyledTh>
                <StyledTh>Type</StyledTh>
                <StyledTh>Description</StyledTh>
                <StyledTh>Date Added</StyledTh>
                <StyledTh>Read Next</StyledTh>
                <StyledTh>Date Read</StyledTh>
                <StyledTh>Image URL</StyledTh>
                <StyledTh>Published</StyledTh>
                <StyledTh>Google ID</StyledTh>
                <StyledTh>Goodreads ID</StyledTh>
                <StyledTh>Series</StyledTh>
                <StyledTh>Series Position</StyledTh>
                <StyledTh>Rating</StyledTh>
                <StyledTh>My Review</StyledTh>
                <StyledTh>Notes</StyledTh>
                <StyledTh>Updated</StyledTh>
            </StyledTr>
            </thead>
            <tbody>
            {props.books.map((val, idx) => {
                return <StyledTr key={idx}>
                    <StyledTd>{val.id}</StyledTd>
                    <StyledTd>{val.title}</StyledTd>
                    <StyledTd>{val.authors}</StyledTd>
                    <StyledTd>{val.genre}</StyledTd>
                    <StyledTd>{val.type}</StyledTd>
                    <StyledTd>{val.description}</StyledTd>
                    <StyledTd>{val.date_added}</StyledTd>
                    <StyledTd>{val.read_next}</StyledTd>
                    <StyledTd>{val.date_read}</StyledTd>
                    <StyledTd>{val.image_url}</StyledTd>
                    <StyledTd>{val.published}</StyledTd>
                    <StyledTd>{val.google_id}</StyledTd>
                    <StyledTd>{val.goodreads_id}</StyledTd>
                    <StyledTd>{val.series}</StyledTd>
                    <StyledTd>{val.series_position}</StyledTd>
                    <StyledTd>{val.rating}</StyledTd>
                    <StyledTd>{val.my_review}</StyledTd>
                    <StyledTd>{val.notes}</StyledTd>
                    <StyledTd>{val.updated}</StyledTd>
                </StyledTr>
            })}
            </tbody>
        </StyledTable>
    </>;
};
