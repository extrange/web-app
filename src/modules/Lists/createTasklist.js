import {StyledButton} from "../../common/common";

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
