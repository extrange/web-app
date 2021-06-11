import styled from "styled-components";
import {Button} from "@material-ui/core";

const StyledButton = styled(Button)({
    margin: '10px',
});

export const CreateTasklist = props => {
    return (
        <StyledButton
            variant={'contained'}
            color={'secondary'}
            onClick={props.promptCreateTasklist}>
            Create new Tasklist
        </StyledButton>
    )
};
