import {Button} from "@material-ui/core";
import {useThrowFetchErrorMutation, useThrowHttpErrorMutation} from "./testingApi";
import {useDispatch} from "react-redux";
import {throwAsyncThunkReject, throwAsyncThunkRejectWithValue} from "./util";
import styled from 'styled-components'
import {clearNetworkError} from "../../app/appSlice";

const StyledDiv = styled.div`
  display: grid;
  grid-gap: 20px;
  max-width: 300px;
  margin: 10px;
`

export const Testing = () => {

    const dispatch = useDispatch()
    const [throwHttpError] = useThrowHttpErrorMutation()
    const [throwFetchError] = useThrowFetchErrorMutation()

    return <StyledDiv>
        <Button variant={'contained'} onClick={() => throwHttpError(401)}>Throw 401 error</Button>
        <Button variant={'contained'} onClick={() => throwHttpError(500)}>Throw 500 error</Button>
        <Button variant={'contained'} onClick={() => throwFetchError()}>Throw fetch error</Button>
        <Button variant={'contained'} onClick={() => dispatch(throwAsyncThunkReject())}>
            Throw asyncThunkReject
        </Button>
        <Button variant={'contained'} onClick={() => dispatch(throwAsyncThunkRejectWithValue())}>
            Throw asyncThunkRejectWithValue
        </Button>
        <Button variant={'contained'} onClick={() => dispatch(clearNetworkError())}>Clear</Button>
    </StyledDiv>
}