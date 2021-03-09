import {Typography} from "@material-ui/core";
import {AppBarResponsive} from "../../shared/AppBarResponsive";
import React, {useEffect, useState} from "react";
import {yupResolver} from '@hookform/resolvers/yup'
import styled from 'styled-components'
import {useForm, useWatch} from "react-hook-form";
import {BACKGROUND_COLOR} from "../../shared/backgroundScreen";
import * as yup from 'yup'
import {ControlHelper} from "../../shared/controlHelper";
import {trim} from "lodash";
import {TextFieldClearableInfo} from "../../shared/textFieldClearableInfo";
import {TextFieldRefreshLoading} from "./textFieldRefreshLoading";
import {formatDistanceToNowStrict} from 'date-fns'
import {TextFieldClearableInfoCurrency} from "./TextFieldClearableInfoCurrency";

/*API Key from dnsproxy@gmail.com*/
const ENDPOINT = 'https://finnhub.io/api/v1/quote?symbol=SPY&token=c10sd6n48v6pp7chu95g'

const FIELDS = {
    portfolioValue: 'portfolioValue',
    spyPrice: 'spyPrice',
    hedgeRatio: 'hedgeRatio',
    delta: 'delta',
}

const emptyStringToUndefined = (val, origVal) => trim(origVal) === '' ? undefined : val

const schema = yup.object({
    portfolioValue: yup.number().positive().required().transform(emptyStringToUndefined),
    spyPrice: yup.number().positive().required().transform(emptyStringToUndefined),
    hedgeRatio: yup.number().positive().max(1).required().transform(emptyStringToUndefined),
    delta: yup.number().positive().max(1).required().transform(emptyStringToUndefined)
})

const Container = styled.div`
  ${BACKGROUND_COLOR};
  max-width: 600px;
`

const StyledTypography = styled(Typography)`
  &.MuiTypography-root {
    white-space: pre-line;
  }
`

const StyledTextFieldClearableInfo = styled(TextFieldClearableInfo)`
  margin: 10px;
  width: min(300px, calc(100vw - 20px));
`

const StyledTextFieldRefresh = styled(TextFieldRefreshLoading)`
  margin: 10px;
  width: min(300px, calc(100vw - 20px));
`

const StyledTextFieldClearableInfoCurrency = styled(TextFieldClearableInfoCurrency)`
  margin: 10px;
  width: min(300px, calc(100vw - 20px));
`

const explanatoryText = `Hedge instrument: SPY puts
NOTE: This calculates a 1:1 put spread, not the 1:1.1 as described in the 'Options Edge' book

Market value of portfolio (that is what is hedged, not invested amount)
Note: As I am only hedging CSPX and IWDA, beta for my portfolio is 1
Take beta of IWDA to be 0.89 for now (see 'Finance and Investing' doc)
Beta of DPYA = IWDP = 0.99
5yr beta of ISAC = 1
Move more than how much then to sell?
`

const formatNoDecimals = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })
const formatDecimals = new Intl.NumberFormat(undefined, {maximumFractionDigits: 1})
const formatDollars = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol'})

const PutStrike = ({control}) => {
    const {spyPrice} = useWatch({
        control,
        name: [FIELDS.spyPrice],
    })
    return <Typography variant={'body1'}>
        8.6% OTM Put strike to sell: {formatNoDecimals.format(0.914 * spyPrice)}
    </Typography>
}

const NotionalAmount = ({control}) => {
    const {portfolioValue, hedgeRatio} = useWatch({
        control,
        name: [FIELDS.portfolioValue, FIELDS.hedgeRatio]
    })
    return <Typography variant={'body1'}>Notional amount: {formatDollars.format(portfolioValue * hedgeRatio)}</Typography>
}

const Contracts = ({control}) => {
    const {portfolioValue, hedgeRatio, delta, spyPrice} = useWatch({
        control,
        name: [FIELDS.portfolioValue, FIELDS.hedgeRatio, FIELDS.delta, FIELDS.spyPrice]
    })

    return <Typography variant={'body1'}>Number of spreads required (i.e. option
        contracts): {formatDecimals.format((portfolioValue * hedgeRatio) / (delta * spyPrice * 100))}</Typography>

}

export const OptionHedgeCalculator = ({logout, returnToMainApp}) => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [spyPriceUpdated, setSpyPriceUpdated] = useState()
    const [tooltipText, setTooltipText] = useState('')
    const [loading, setLoading] = useState(false)

    const {control, setValue, setError, formState: {errors}} = useForm({
        mode: 'onTouched',
        resolver: yupResolver(schema),
        defaultValues: {
            [FIELDS.portfolioValue]: '',
            [FIELDS.spyPrice]: '',
            [FIELDS.hedgeRatio]: 0.47,
            [FIELDS.delta]: '',
        }
    })

    const onClear = name => () => setValue(name, '');

    const getSpyPrice = () => {
        setLoading(true)
        return fetch(ENDPOINT, {method: 'GET'})
            .then(r => r.json())
            .then(({c}) => {
                setValue(FIELDS.spyPrice, c)
                setSpyPriceUpdated(new Date())
                setLoading(false)
            })
            .catch(e => {
                setLoading(false)
                setError(FIELDS.spyPrice, {message: `Failed to fetch from API: ${e}`})
            })
    }


    // eslint-disable-next-line
    useEffect(() => void getSpyPrice(), [])

    return <AppBarResponsive
        appName={'Option Hedge Calculator'}
        titleContent={<Typography variant={"h6"} noWrap>Option Hedge Calculator</Typography>}
        setDrawerOpen={setDrawerOpen}
        logout={logout}
        returnToMainApp={returnToMainApp}
        drawerOpen={drawerOpen}
    >
        <Container>
            <StyledTypography variant={'body1'}>{explanatoryText}</StyledTypography>

            <ControlHelper
                label={'Portfolio Value (USD)'}
                variant={'outlined'}
                info={'Beta-weighted portfolio value in USD'}

                name={FIELDS.portfolioValue}
                Component={StyledTextFieldClearableInfoCurrency}
                control={control}
                errors={errors}
                onClear={onClear(FIELDS.portfolioValue)}
            />

            <ControlHelper
                label={'SPY Price'}
                variant={'outlined'}
                tooltipText={tooltipText}
                onOpen={() => setTooltipText(spyPriceUpdated ? 'Last updated ' + formatDistanceToNowStrict(spyPriceUpdated, {addSuffix: true}) : '')}
                onRefresh={getSpyPrice}
                loading={loading}

                name={FIELDS.spyPrice}
                Component={StyledTextFieldRefresh}
                control={control}
                errors={errors}
                onClear={onClear(FIELDS.spyPrice)}
            />

            <PutStrike control={control}/>


            <ControlHelper
                label={'Hedge Ratio'}
                variant={'outlined'}
                info={'% of portfolio value to hedge using put options (via delta equivalent amount)'}

                name={FIELDS.hedgeRatio}
                Component={StyledTextFieldClearableInfo}
                control={control}
                errors={errors}
                onClear={onClear(FIELDS.hedgeRatio)}
            />

            <NotionalAmount control={control}/>

            <ControlHelper
                label={'Delta'}
                variant={'outlined'}
                info={'Delta of each spread with OTM 8.6% put sold, per option e.g. 0.250'}

                name={FIELDS.delta}
                Component={StyledTextFieldClearableInfo}
                control={control}
                errors={errors}
                onClear={onClear(FIELDS.delta)}
            />

            <Contracts control={control}/>


        </Container>
    </AppBarResponsive>
}

/*Test case:
*
* Beta-weighted portfolio value in USD: 1000000
* Current price of SPY: 300
* OTM Put Strike to sell: 274.2
* Hedge ratio: 0.47
* Notional amount: 470000.0
* Delta of 8.6% OTM put spread: 0.21
* Number of spreads required (i.e. option contracts): 74.60317460317461
* */