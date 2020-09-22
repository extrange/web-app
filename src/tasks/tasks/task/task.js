import React from "react";
import './task.css';

export const Task = (props) =>
    <li className='task'>
        <div className='task__body' onClick={props.handleEditTask}>
            <div className='task__title'>{props.task.title}</div>
            <div className='task__notes'>{props.task.notes}</div>
        </div>
        <div className='task__delete' onClick={props.deleteTask}>DEL</div>
    </li>;