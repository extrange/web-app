import { debounce } from 'lodash';
import { useCallback, useRef } from "react";

const defaultState = { id: null, data: null, pendingData: false, creationInProgress: false, flushing: true }

/**
 * Autosave hook.
 * Saves items via updateItem on debounced intervals.
 * Calls createItem if id is not provided.
 * Optionally deletes item on flush.
 * 
 * Note: provided functions must be memoized, otherwise
 * the debounced onChange function will not be referentially stable,
 * and cause unnecessary re-renders
 * 
 * Provides:
 * onChange: data => void
 * flush: () => void (flush all pending debounced onChange callbacks)
 * 
 * Required props:
 * updateItem: (id, data) => Promise || void
 * 
 * Required if id is null:
 * createItem: (data) => id: Promise<String>
 * 
 * Optional, delete item if empty, and only on flush():
 * deleteItem: (id) => Promise || void
 * 
 * Required if deleteItem is provided:
 * itemIsEmpty: data => Boolean
 */
export const useAutosave = ({
    id = null,
    createItem,
    updateItem,
    deleteItem,
    itemIsEmpty = () => false,
    wait = 1000,
    maxWait,
}) => {

    /* Validate arguments */
    if (typeof updateItem !== 'function') {
        throw new Error(`updateItem must be a function, but got ${typeof updateItem}`)
    } else if (!id && typeof createItem !== 'function') {
        throw new Error(`createItem must be provided if id is null/undefined, but got ${typeof createItem}`)
    } else if (!!deleteItem && typeof deleteItem !== 'function') {
        throw new Error(`deleteItem must be a function, but got ${typeof deleteItem}`)
    } else if (!!deleteItem && typeof itemIsEmpty !== 'function') {
        throw new Error(`itemIsEmpty must be provided with deleteItem, but got ${typeof itemIsEmpty}`)
    }

    /* Store a copy of the item's id (updated on props change via useEffect) */
    const state = useRef({ ...defaultState, id })

    /* Update item (or delete, if flushing) */
    const updateOrDelete = useCallback((id, data) => {
        if (state.current.flushing && itemIsEmpty(data)) {
            deleteItem(id)
            state.current.data = null // Clear data so that a second deleteItem won't be called
        } else {
            updateItem(id, data)
        }
    }, [deleteItem, itemIsEmpty, updateItem])

    const _onChange = useCallback(async data => {
        state.current.data = data

        if (state.current.id) {

            /* id was supplied or item was created, update*/
            updateOrDelete(state.current.id, data)

        } else if (state.current.creationInProgress) {

            /* Flag data for update later when id is available */
            state.current.pendingData = true

        } else {
            /* New item, and it is empty, and we are flushing:
            don't create the item */
            if (state.current.flushing && itemIsEmpty(data)) return

            /* id is null, and creation has not yet occurred - create item */
            state.current.creationInProgress = true
            let newId = await createItem(data)
            state.current.creationInProgress = false
            state.current.id = newId

            /* Execute and clear pendingData if any*/
            if (state.current.pendingData) {
                updateOrDelete(newId, state.current.data)
                state.current.pendingData = false
            }
        }
    }, [createItem, itemIsEmpty, updateOrDelete])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onChange = useCallback(
        debounce(_onChange, wait, Object.assign({}, maxWait ? { maxWait } : undefined)),
        [_onChange, wait, maxWait]
    )

    const flush = useCallback(() => {

        state.current.flushing = true
        onChange.flush()

        /* Bail if item doesn't exist, e.g. flush() was called on a
         new item where id = null and _onChange wasn't called */
        if (!id && !state.current.id) return

        /* onChange.flush() will not execute deleteItem if no changes are in the queue.
        This manually checks and fires a delete if necessary. */
        if (state.current.data && itemIsEmpty(state.current.data)) {
            deleteItem(state.current.id)
        }
    }, [deleteItem, id, itemIsEmpty, onChange])

    return {
        onChange,
        flush
    }
}