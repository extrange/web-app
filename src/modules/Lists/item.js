import {IconButton, ListItemText} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {StyledListItem, StyledListItemSecondaryAction} from "../../common/styledListItem";


export const Item = ({deleteTask, handleEditTask, task}) =>
    <StyledListItem
        button
        onClick={() => handleEditTask(task)}
        $reserveSpace={true}
    >
        <ListItemText
            primary={task.title}
            secondary={task.notes}
            secondaryTypographyProps={{noWrap: true}}
        />
        <StyledListItemSecondaryAction>
            <IconButton
                edge={'end'}
                onClick={e => {
                    e.stopPropagation();
                    deleteTask();
                }}>
                <DeleteIcon/>
            </IconButton>
        </StyledListItemSecondaryAction>

    </StyledListItem>;