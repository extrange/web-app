import {StyledListItem, StyledListItemSecondaryAction} from "../../../components/styledListItem";
import {IconButton, ListItemText} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

export const Tasklist = ({handleDelete, onClick, value}) => (

    <StyledListItem
        button
        onClick={onClick}
        dense
        $hideBackground
        $reserveSpace={false}
    >
        <ListItemText
            primary={value}
            primaryTypographyProps={{noWrap: true}}
        />
        <StyledListItemSecondaryAction>
            <IconButton
                edge={'end'}
                onClick={handleDelete}>
                <DeleteIcon/>
            </IconButton>
        </StyledListItemSecondaryAction>

    </StyledListItem>
);