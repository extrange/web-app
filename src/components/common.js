import styled from 'styled-components'
import {Button, Slide, useScrollTrigger} from "@material-ui/core";

export const HideOnScroll = ({children, target}) => {
    const trigger = useScrollTrigger({threshold: 50, target});
    return <Slide direction={'down'} in={!trigger}>
        {children}
    </Slide>
};

const MuiStyledButton = styled(Button)({
    margin: '10px',
});

/**
 * Plain button with 10px margin
 * @type {function(JSX.Element): *}
 */
export const StyledButton = ({variant, color, onClick, ...props}) => <MuiStyledButton
    variant={variant}
    color={color}
    onClick={onClick}
    {...props}
/>;