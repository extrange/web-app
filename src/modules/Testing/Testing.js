import {AppBar} from "../../app/AppBar/AppBar";
import {useState} from "react";
import {Button} from "@material-ui/core";
import {DUMMY_URL, TEST_URL} from "../../app/urls";
import {send} from "../../app/appSlice";
import {useDispatch} from "react-redux";


export const Testing = () => {
    const [drawerOpen, setDrawerOpen] = useState()
    const dispatch = useDispatch()

    const throw401Error = () => dispatch(send({url: TEST_URL + `?status=401&response=json`}))
    const throw500Error = () => dispatch(send({url: TEST_URL + `?status=500&response=json`}))
    const throwFetchError = () => dispatch(send({url: DUMMY_URL}))

    return <AppBar
    drawerOpen={drawerOpen}
    setDrawerOpen={setDrawerOpen}>
        <Button onClick={throw401Error}>Throw 401 error</Button>
        <Button onClick={throw500Error}>Throw 500 error</Button>
        <Button onClick={throwFetchError}>Throw fetch error</Button>
    </AppBar>
}