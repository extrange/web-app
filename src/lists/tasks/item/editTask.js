import {useState} from 'react';
import {StyledTextField} from "../../../components/common";
import styled from "styled-components";
import muiStyled from "@material-ui/core/styles/styled"
import {MarkdownEditor} from "../../../components/markdownEditor";
import {Button, Dialog, DialogActions, DialogTitle, useMediaQuery} from "@material-ui/core";
import {useForm} from "react-hook-form";
import Hidden from "@material-ui/core/Hidden";
import {withSetDefaultValueOnMount} from "../../../components/withSetDefaultValueOnMount";
import {useTheme} from "@material-ui/core/styles";
import {OverlayScrollbarOptions} from "../../../theme";
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledButton = muiStyled(Button)({
    margin: '10px'
});

const StyledOverlayScrollbars = styled(OverlayScrollbarsComponent)`
  width: min(100vw, 600px);
  max-width: 800px;
`;

const StyledDialog = styled(Dialog)`
  @supports (backdrop-filter: blur(5px)) {
    .MuiDialog-container {
      backdrop-filter: blur(5px);
    }

    .MuiDialog-paper {
      background: none;
    }
  }

  .MuiDialog-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

`;

export const EditTask = ({editingTask, createTask, updateTask, onCancelEdit}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const initialTitle = editingTask?.title || '';
    const initialNotes = editingTask?.notes || '';

    const {register, getValues, setValue} = useForm({
        defaultValues: {
            'title': initialTitle,
            'notes': initialNotes,
        }
    });

    register({name: 'title'});
    register({name: 'notes'});


    const handleSubmit = event => {
        let id = editingTask['id'];
        let tasklist = editingTask['list'];
        let {title, notes} = getValues();

        //Do not trigger submission if nothing was changed
        if (title === initialTitle && notes === initialNotes) {
            onCancelEdit();
            return;
        }

        if (id === null)
            createTask(tasklist, title, notes);
        else
            updateTask(id, tasklist, title, notes);

        event.preventDefault();
    };

    const handleCancelEdit = () => {
        let {title, notes} = getValues();
        if (title !== initialTitle || notes !== initialNotes) {
            setDialogOpen(true)
        } else
            onCancelEdit()
    };

    const handleDiscard = () => {
        setDialogOpen(false);
        onCancelEdit()
    };

    const UncontrolledStyledTextField = withSetDefaultValueOnMount(StyledTextField);
    const UncontrolledMarkdownEditor = withSetDefaultValueOnMount(MarkdownEditor);

    return <>
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
        >
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogActions>
                <Button
                    variant={'text'}
                    color={'primary'}
                    onClick={() => setDialogOpen(false)}
                >Cancel
                </Button>

                <Button
                    variant={'text'}
                    color={'primary'}
                    onClick={handleDiscard}
                >Discard
                </Button>
            </DialogActions>

        </Dialog>
        <StyledDialog
            open={Boolean(editingTask)}
            onClose={handleCancelEdit}
            fullScreen={fullScreen}>
            <StyledOverlayScrollbars
                options={OverlayScrollbarOptions}
            className={'os-host-flexbox'}>
                <StyledTextField
                    label='Title'
                    multiline
                    fullWidth
                    name={'title'}
                    autoFocus={!initialTitle && !initialNotes}
                    defaultValue={initialTitle}
                    onChange={e => setValue('title', e.target.value)}
                />


                <Hidden mdUp>
                    <UncontrolledStyledTextField
                        label='Notes'
                        multiline
                        fullWidth
                        getInitialValue={() => getValues('notes')}
                        onChange={e => setValue('notes', e.target.value)}
                    />
                </Hidden>

                <Hidden smDown>
                    <UncontrolledMarkdownEditor
                        getInitialValue={() => getValues('notes')}
                        onChange={newVal => setValue('notes', newVal)}
                    />
                </Hidden>

            </StyledOverlayScrollbars>
            <ButtonContainer>

                    <StyledButton
                        variant={'outlined'}
                        color={'primary'}
                        onClick={handleCancelEdit}
                    > Cancel
                    </StyledButton>

                    <StyledButton
                        variant={'contained'}
                        color={'primary'}
                        onClick={handleSubmit}
                    >Submit
                    </StyledButton>

                </ButtonContainer>
        </StyledDialog>
    </>
};
