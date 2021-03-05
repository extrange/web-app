import {BookResult} from "./BookResult";
import styled from "styled-components";
import {Dialog, useMediaQuery, useTheme} from "@material-ui/core";

const CardContainer = styled.div`
    display: flex;
    max-width: 1000px;
    flex-flow: row wrap;
`;


export const SearchBooks = props => {
    let {open, close, results, handleClick} = props;

    const theme = useTheme();
    const fullscreen = useMediaQuery(theme.breakpoints.down('sm'));

    return <Dialog
        open={open}
        onClose={close}
        fullScreen={fullscreen}
    >
        <CardContainer>
            {results.map((result, idx) => {
                return <BookResult
                    result={result}
                    handleClick={() => handleClick(result)}
                    key={idx}
                />
            })}
        </CardContainer>
    </Dialog>
};