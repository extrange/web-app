import { Button, TextField } from "@material-ui/core";
import { capitalize } from 'lodash';
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useAutosave } from './../../useAutosave';
import { DialogBlurResponsive } from '../DialogBlurResponsive';

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

/*
A list-like view, suitable for list items
If editingTask.id is null, a new task is being created*/
export const BaseItemEdit =
    defaultFieldValues =>
        function BaseItemEditComponent({
            editingItem,
            closeEdit,
            context,
            isItemEmpty,
            itemIdField,
            createItemMutation,
            updateItemMutation,
            deleteItemMutation,
        }) {

            const [createItem] = createItemMutation()
            const [updateItem] = updateItemMutation()
            const [deleteItem] = deleteItemMutation()

            const useAutosaveOptions = useMemo(() => ({
                id: editingItem[itemIdField], // if undefined, will create new item
                updateItem: (id, data) => updateItem({ [itemIdField]: id, ...context, ...data }),
                createItem: data => createItem({ ...context, ...data }).unwrap().then(res => res[itemIdField]),
                deleteItem: id => deleteItem({ ...context, [itemIdField]: id }),
                itemIsEmpty: isItemEmpty,
            }), [context, createItem, deleteItem, editingItem, isItemEmpty, itemIdField, updateItem])


            const { onChange, flush } = useAutosave(useAutosaveOptions)

            const { register, getValues, setValue } = useForm({ defaultValues: editingItem[itemIdField] ? editingItem : defaultFieldValues });

            const keys = useMemo(() => Object.keys(defaultFieldValues), [])

            keys.forEach(register)

            const onClose = () => {
                flush()
                closeEdit()
            }

            return <DialogBlurResponsive
                open
                onClose={onClose}
                footer={<Footer>
                    <FooterRight>
                        <Button
                            variant={'text'}
                            color={'primary'}
                            onClick={onClose}>
                            Close
                        </Button>
                    </FooterRight>
                </Footer>}>
                {keys.map((key, idx) => <StyledTextField
                    label={capitalize(key)}
                    multiline
                    fullWidth
                    name={key}
                    key={key}
                    defaultValue={editingItem[key]}
                    autoFocus={idx === 0 && isItemEmpty(editingItem)}
                    variant={'outlined'}
                    onChange={e => {
                        setValue(key, e.target.value);
                        onChange(getValues())
                    }}
                />)}

            </DialogBlurResponsive>
        };
