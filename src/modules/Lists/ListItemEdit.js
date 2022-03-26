import DateFns from "@date-io/date-fns";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { formatISO, isValid, parseJSON } from "date-fns";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { DialogBlurResponsive } from "../../shared/components/DialogBlurResponsive";
import { MarkdownEditor } from "../../shared/components/MarkdownEditor/MarkdownEditor";
import { useAutosave } from "../../shared/useAutosave";
import { formatDistanceToNowPretty } from "../../shared/util";

const FooterRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
`;

const StyledTextField = styled(TextField)`
  margin: 5px 0;
`;

/* The popup dialog when editing an item. */
export const ListItemEdit = ({
  editingItem,
  closeEdit,
  context,
  isItemEmpty,
  itemIdField,
  createItemMutation,
  updateItemMutation,
  deleteItemMutation,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [createItem] = createItemMutation();
  const [updateItem] = updateItemMutation();
  const [deleteItem] = deleteItemMutation();

  const useAutosaveOptions = useMemo(
    () => ({
      id: editingItem[itemIdField],
      updateItem: (id, data) =>
        updateItem({ ...context, [itemIdField]: id, ...data }),
      createItem: (data) =>
        createItem({ ...context, ...data })
          .unwrap()
          .then((res) => res.id),
      deleteItem: (id) => deleteItem({ ...context, [itemIdField]: id }),
      itemIsEmpty: isItemEmpty,
    }),
    [
      context,
      createItem,
      deleteItem,
      editingItem,
      isItemEmpty,
      itemIdField,
      updateItem,
    ]
  );

  const { onChange, flush } = useAutosave(useAutosaveOptions);

  const initialTitle = editingItem.title || "";
  const initialNotes = editingItem.notes || "";

  const { register, getValues, setValue } = useForm({
    defaultValues: {
      title: initialTitle,
      notes: initialNotes,
      due_date: editingItem.due_date ?? null,
      pinned: editingItem.pinned,
      completed: editingItem.completed ?? null,
    },
  });

  register("title");
  register("notes");
  register("due_date");
  register("pinned");
  register("completed")

  const onClose = () => {
    flush();
    closeEdit();
  };

  /* If there is any update, it must be after a create.
    startedTimeStamp are used because fulfilledTimeStamp is reset when a 
    new mutation is requested, causing the UI to default to editingItem.updated
    momentarily.*/
  const lastSavedTimeString = editingItem.updated
    ? formatDistanceToNowPretty(parseJSON(editingItem.updated))
    : "";

  /* Prefer operations with the latest possible time */
  const lastCreatedTimeString = editingItem.created
    ? formatDistanceToNowPretty(parseJSON(editingItem.created))
    : "";

  return (
    <DialogBlurResponsive
      open
      onClose={onClose}
      footer={
        <Footer>
          <Tooltip
            arrow
            enterTouchDelay={100}
            interactive
            title={
              lastCreatedTimeString
                ? `Created ${lastCreatedTimeString}`
                : "Not yet created"
            }
          >
            <Typography variant={"body2"} color={"textSecondary"}>
              {lastSavedTimeString
                ? `Last saved ${lastSavedTimeString}`
                : "New item"}
            </Typography>
          </Tooltip>
          <FooterRight>
            <Button variant={"text"} color={"primary"} onClick={onClose}>
              Close
            </Button>
          </FooterRight>
        </Footer>
      }
    >
      <StyledTextField
        label="Title"
        multiline
        fullWidth
        name={"title"}
        autoFocus={!initialTitle && !initialNotes}
        defaultValue={initialTitle}
        variant={"outlined"}
        onChange={(e) => {
          setValue("title", e.target.value);
          onChange(getValues());
        }}
      />
      {fullScreen ? (
        <StyledTextField
          label="Notes"
          multiline
          fullWidth
          defaultValue={getValues("notes")}
          variant={"outlined"}
          onChange={(e) => {
            setValue("notes", e.target.value);
            onChange(getValues());
          }}
        />
      ) : (
        <MarkdownEditor
          defaultValue={getValues("notes")}
          onChange={(newVal) => {
            setValue("notes", newVal);
            onChange(getValues());
          }}
        />
      )}
      <MuiPickersUtilsProvider utils={DateFns}>
        <KeyboardDatePicker
          autoOk
          value={editingItem.due_date || null}
          name={"due_date"}
          onChange={(newVal) => {
            if (isValid(newVal) || newVal === null) {
              setValue(
                "due_date",
                newVal ? formatISO(newVal, { representation: "date" }) : null
              );
              onChange(getValues());
              flush();
            }
          }}
          format={"dd/MM/yyyy"}
          placeholder={"dd/mm/yyyy"}
          inputVariant={"outlined"}
        />
      </MuiPickersUtilsProvider>
      <FormControlLabel
        control={
          <Checkbox
            name={"pinned"}
            checked={editingItem.pinned}
            onChange={({ target: { checked } }) => {
              setValue("pinned", checked);
              onChange(getValues());
              flush();
            }}
          />
        }
        label={'Pinned'}
      />
    </DialogBlurResponsive>
  );
};
