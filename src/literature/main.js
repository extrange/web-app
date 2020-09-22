import React, {useState} from 'react'
import {StyledButton} from "../components/common";
import {AddBooks} from "./addBook";
import {ViewBooks} from "./viewBooks";


export const LitApp = (props) => {
    const [books, setBooks] = useState([]);


    return <>
        <AddBooks books={books} setBooks={setBooks}/>
        <ViewBooks books={books} setBooks={setBooks}/>
        <StyledButton variant={'outlined'} color={'primary'} onClick={props.returnToMainApp}>Return to Main
            App</StyledButton>
        <StyledButton variant={'contained'} color={'primary'} onClick={props.logout}>Logout</StyledButton>
    </>
};
