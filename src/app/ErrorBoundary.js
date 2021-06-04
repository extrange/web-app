import {Component} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    styled as muiStyled
} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

const StyledDialog = muiStyled(Dialog)(({theme}) => ({
    /*As zIndex is set inline in Dialog, style must be overridden with !important*/
    zIndex: `${theme.zIndex.snackbar + 1} !important`,
}));

/*Catch-all for any application errors*/
export class ErrorBoundary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            errorInfo: null,
            dialogOpen: false,
        };
    }

    static getDerivedStateFromError(error) {
        return {error: error};
    }

    setDialogOpen = state => this.setState({dialogOpen: state});

    componentDidCatch(error, errorInfo) {
        /*Errors are not logged currently*/
    }

    render() {
        return this.state.error
            ? <>
                <StyledDialog
                    open={this.state.dialogOpen}
                    onClose={() => this.setDialogOpen(false)}
                    scroll={'body'}
                >

                    <DialogTitle>{this.state.error.toString()}</DialogTitle>

                    <DialogContent>
                        <DialogContentText>{this.state.errorInfo?.componentStack}</DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            variant={'text'}
                            color={'primary'}
                            onClick={() => this.setDialogOpen(false)}
                        >Close
                        </Button>
                    </DialogActions>

                </StyledDialog>
                <Snackbar open>
                    <Alert
                        severity={'error'}
                        action={<>
                            <Button
                                variant={'text'}
                                color={'primary'}
                                onClick={() => this.setDialogOpen(true)}
                            >Details</Button>
                            <Button
                                variant={'text'}
                                color={'primary'}
                                onClick={() => window.location.reload()
                                }
                            >Reload</Button>
                        </>
                        }>
                        Application Error
                    </Alert>
                </Snackbar>
            </>
            : this.props.children
    }

}