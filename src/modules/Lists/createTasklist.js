import {StyledButton} from "../../shared/common";

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
