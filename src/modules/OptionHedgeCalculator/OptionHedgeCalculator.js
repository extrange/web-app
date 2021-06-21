import {Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {yupResolver} from '@hookform/resolvers/yup'
import styled from 'styled-components'
import {Controller, useForm} from "react-hook-form";
import {BACKGROUND_COLOR} from "../../shared/components/backgroundScreen";
import * as yup from 'yup'
import {trim} from "lodash";
import {TextFieldClearableInfo} from "../../shared/components/textFieldClearableInfo";
import {TextFieldRefreshLoading} from "./textFieldRefreshLoading";
import {formatDistanceToNowStrict} from 'date-fns'
import {TextFieldClearableInfoCurrency} from "./TextFieldClearableInfoCurrency";
import {FieldUseWatch} from "./FieldUseWatch";
import {useGetSpyPriceQuery} from "./optionHedgeCalculatorApi";

const FIELDS = {
    portfolioValue: 'portfolioValue',
    spyPrice: 'spyPrice',
    hedgeRatio: 'hedgeRatio',
    delta: 'delta',
};

const emptyStringToUndefined = (val, origVal) => trim(origVal) === '' ? undefined : val;

const schema = yup.object({
    portfolioValue: yup.number().positive().required().transform(emptyStringToUndefined),
    spyPrice: yup.number().positive().required().transform(emptyStringToUndefined),
    hedgeRatio: yup.number().positive().max(1).required().transform(emptyStringToUndefined),
    delta: yup.number().positive().max(1).required().transform(emptyStringToUndefined)
});

const Container = styled.div`
  ${BACKGROUND_COLOR};
  max-width: 600px;
`;

const StyledTypography = styled(Typography)`
  &.MuiTypography-root {
    white-space: pre-line;
  }
`;

const StyledTextFieldClearableInfo = styled(TextFieldClearableInfo)`
  margin: 10px;
  width: min(300px, calc(100vw - 20px));
`;

const StyledTextFieldRefresh = styled(TextFieldRefreshLoading)`
  margin: 10px;
  width: min(300px, calc(100vw - 20px));
`;

const StyledTextFieldClearableInfoCurrency = styled(TextFieldClearableInfoCurrency)`
  margin: 10px;
  width: min(300px, calc(100vw - 20px));
`;

const explanatoryText = `Hedge instrument: SPY puts
NOTE: This calculates a 1:1 put spread, not the 1:1.1 as described in the 'Options Edge' book

Note: As I am only hedging CSPX and IWDA, beta for my portfolio is 1
Take beta of IWDA to be 0.89 for now (see 'Finance and Investing' doc)
Beta of DPYA = IWDP = 0.99
5yr beta of ISAC = 1

Rehedge in first month ONLY if SPY has moved > 3% from the previous long put strike
`;

const formatNoDecimals = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0});
const formatDecimals = new Intl.NumberFormat(undefined, {maximumFractionDigits: 1});
const formatDollars = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol'
});

export const OptionHedgeCalculator = () => {
    const {refetch, isFetching, data, fulfilledTimeStamp} = useGetSpyPriceQuery()

    const [tooltipText, setTooltipText] = useState('');

    const {
        control,
        setValue,
    } = useForm({
        mode: 'onTouched',
        resolver: yupResolver(schema),
        defaultValues: {
            [FIELDS.portfolioValue]: '',
            [FIELDS.spyPrice]: '',
            [FIELDS.hedgeRatio]: 0.47,
            [FIELDS.delta]: '',
        }
    });

    useEffect(() => void data && setValue(FIELDS.spyPrice, data), [data, setValue])


    return <Container>
        <StyledTypography variant={'body1'}>{explanatoryText}</StyledTypography>

        <Controller
            name={FIELDS.portfolioValue}
            control={control}
            render={({
                         field: {ref, ...field},
                         fieldState: {error}
                     }) =>
                <StyledTextFieldClearableInfoCurrency
                    {...field}
                    error={Boolean(error)}
                    helperText={error?.message}
                    info={'Take beta of IWDA to be 0.89 and exclude bonds e.g. AGGU'}
                    label={'Beta-weighted Portfolio Value (USD)'}
                    variant={'outlined'}
                />}/>

        <Controller
            name={FIELDS.spyPrice}
            control={control}
            render={({
                         field: {ref, ...field},
                         fieldState: {error}
                     }) =>
                <StyledTextFieldRefresh
                    {...field}
                    error={Boolean(error)}
                    helperText={error?.message}
                    label={'SPY Price'}
                    loading={isFetching}
                    onOpen={() => setTooltipText(fulfilledTimeStamp ? 'Last updated ' + formatDistanceToNowStrict(new Date(fulfilledTimeStamp), {addSuffix: true}) : '')}
                    onRefresh={refetch}
                    tooltipText={tooltipText}
                    variant={'outlined'}/>}/>


        <FieldUseWatch
            control={control}
            fieldsToWatch={[FIELDS.spyPrice]}
            Component={({fields: [spyPrice]}) => <Typography variant={'body1'}>
                Strike price for short 8.6% delta OTM, 90-day
                put: {formatNoDecimals.format(0.914 * spyPrice)}
            </Typography>}/>

        <Controller
            name={FIELDS.hedgeRatio}
            control={control}
            render={({
                         field: {ref, ...field},
                         fieldState: {error}
                     }) =>
                <StyledTextFieldClearableInfo
                    {...field}
                    error={Boolean(error)}
                    info={'% of portfolio value to hedge using put options (via delta equivalent amount)'}
                    helperText={error?.message}
                    label={'Hedge Ratio'}
                    variant={'outlined'}/>}/>


        <FieldUseWatch
            control={control}
            fieldsToWatch={[FIELDS.hedgeRatio, FIELDS.portfolioValue]}
            Component={({fields: [hedgeRatio, portfolioValue]}) =>
                <Typography variant={'body1'}>
                    Notional amount to hedge: {formatDollars.format(portfolioValue * hedgeRatio)}
                </Typography>}/>

        <Controller
            name={FIELDS.delta}
            control={control}
            render={({
                         field: {ref, ...field},
                         fieldState: {error}
                     }) =>
                <StyledTextFieldClearableInfo
                    {...field}
                    error={Boolean(error)}
                    info={'Delta of each spread with OTM 8.6% put sold, per option e.g. 0.250'}
                    label={'Delta'}
                    helperText={error?.message}
                    variant={'outlined'}/>}/>

        <FieldUseWatch
            control={control}
            fieldsToWatch={[FIELDS.portfolioValue, FIELDS.hedgeRatio, FIELDS.delta, FIELDS.spyPrice]}
            Component={({fields: [portfolioValue, hedgeRatio, delta, spyPrice]}) =>
                <Typography variant={'body1'}>
                    Number of spreads required (i.e. standard option contracts):
                    {formatDecimals.format(portfolioValue * hedgeRatio / (delta * spyPrice * 100))}
                </Typography>}
        />

    </Container>
};

/*Testing case:
*
* Beta-weighted portfolio value in USD: 1000000
* Current price of SPY: 300
* OTM Put Strike to sell: 274.2
* Hedge ratio: 0.47
* Notional amount: 470000.0
* Delta of 8.6% OTM put spread: 0.21
* Number of spreads required (i.e. option contracts): 74.60317460317461
* */