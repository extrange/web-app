import React from "react";
import './tasklist.css'

export class Tasklist extends React.Component {
    render() {
        return (
            <li className='tasklist'>
                <div className='tasklist__title'
                     onClick={this.props.onClick}>
                    {this.props.value}
                </div>
                <div className='tasklist__delete'
                     onClick={this.props.handleDelete}>DEL
                </div>
            </li>
        )
    }
}
