import React from "react";
import './createTask.css'
import {StyledButton} from "../../../components/common";

export const CreateTask = props => {
    return (
        <StyledButton
            variant={'contained'}
            color={'secondary'}
            onClick={props.createTask}>
            <div className='task__title'>Create Task</div>
        </StyledButton>
    )
};
