import React, {useState} from 'react'
import {StyledButton} from "../components/common";
import {AddBooks} from "./addBook";
import {ViewBooks} from "./viewBooks";
import {Networking} from "../util";
import * as Url from "./urls";


export const LitApp = (props) => {
    const [books, setBooks] = useState([]);

    const refreshBooks = () => {
        Networking.send(Url.BOOKS, {method: 'GET'})
            .then(resp => resp.json())
            .then(json => {
                setBooks(json);
            })
    };


    return <>
        <AddBooks books={books} refreshBooks={refreshBooks}/>
        <ViewBooks books={books} refreshBooks={refreshBooks}/>
        <StyledButton variant={'outlined'} color={'primary'} onClick={props.returnToMainApp}>Return to Main
            App</StyledButton>
        <StyledButton variant={'contained'} color={'primary'} onClick={props.logout}>Logout</StyledButton>
    </>
};
