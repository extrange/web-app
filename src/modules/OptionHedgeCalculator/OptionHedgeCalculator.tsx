import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@material-ui/core";
import { trim } from "lodash";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import { BACKGROUND_COLOR } from "../../shared/components/backgroundScreen";
import { TextFieldClearable } from "../../shared/components/textFieldClearable";
import { TextFieldClearableInfo } from "../../shared/components/textFieldClearableInfo";
import { explanatoryText } from "./explanatoryText";
import { FieldUseWatch } from "./FieldUseWatch";
import { TextFieldClearableInfoCurrency } from "./TextFieldClearableInfoCurrency";

const FIELDS = {
  portfolioValue: "portfolioValue",
  spyPrice: "spyPrice",
  hedgeRatio: "hedgeRatio",
  delta: "delta",
};

const emptyStringToUndefined = (val, origVal) =>
  trim(origVal) === "" ? undefined : val;

const schema = yup.object({
  portfolioValue: yup
    .number()
    .positive()
    .required()
    .transform(emptyStringToUndefined),
  spyPrice: yup
    .number()
    .positive()
    .required()
    .transform(emptyStringToUndefined),
  hedgeRatio: yup
    .number()
    .positive()
    .max(1)
    .required()
    .transform(emptyStringToUndefined),
  delta: yup
    .number()
    .positive()
    .max(1)
    .required()
    .transform(emptyStringToUndefined),
});

const Container = styled.div`
  ${BACKGROUND_COLOR};
  max-width: 600px;
`;

const StyledTypography = styled(Typography)`
  p {
    margin: 0 0 10px;
  }
`;

const StyledTextFieldClearable = styled(TextFieldClearable)`
  margin: 10px;
  width: min(300px, calc(100vw - 20px));
`;

const StyledTextFieldClearableInfo = styled(TextFieldClearableInfo)`
  margin: 10px;
  width: min(300px, calc(100vw - 20px));
`;

const StyledTextFieldClearableInfoCurrency = styled(
  TextFieldClearableInfoCurrency
)`
  margin: 10px;
  width: min(300px, calc(100vw - 20px));
`;

const formatNoDecimals = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

const formatDecimals = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
});

const formatDollars = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  currencyDisplay: "symbol",
});

export const OptionHedgeCalculator = () => {
  const { control } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: {
      [FIELDS.portfolioValue]: "",
      [FIELDS.spyPrice]: "",
      [FIELDS.hedgeRatio]: 0.47,
      [FIELDS.delta]: "",
    },
  });

  return (
    <Container>
      <StyledTypography
        variant={"body1"}
        dangerouslySetInnerHTML={{ __html: explanatoryText }}
      ></StyledTypography>

      <Controller
        name={FIELDS.portfolioValue}
        control={control}
        render={({ field: { ref, ...field }, fieldState: { error } }) => (
          <StyledTextFieldClearableInfoCurrency
            {...field}
            error={Boolean(error)}
            helperText={error?.message}
            info={"Take beta of IWDA to be 0.89 and exclude bonds e.g. AGGU"}
            label={"Beta-weighted Portfolio Value (USD)"}
            variant={"outlined"}
          />
        )}
      />

      <Controller
        name={FIELDS.spyPrice}
        control={control}
        render={({ field: { ref, ...field }, fieldState: { error } }) => (
          <StyledTextFieldClearable
            {...field}
            error={Boolean(error)}
            helperText={error?.message}
            label={"SPY Price"}
            variant={"outlined"}
          />
        )}
      />

      <FieldUseWatch
        control={control}
        fieldsToWatch={[FIELDS.spyPrice]}
        Component={({ fields: [spyPrice] }) => (
          <Typography variant={"body1"}>
            Strike price for short 8.6% delta OTM, 90-day put:{" "}
            {formatNoDecimals.format(0.914 * spyPrice)}
          </Typography>
        )}
      />

      <Controller
        name={FIELDS.hedgeRatio}
        control={control}
        render={({ field: { ref, ...field }, fieldState: { error } }) => (
          <StyledTextFieldClearableInfo
            {...field}
            error={Boolean(error)}
            info={
              "% of portfolio value to hedge using put options (via delta equivalent amount)"
            }
            helperText={error?.message}
            label={"Hedge Ratio"}
            variant={"outlined"}
          />
        )}
      />

      <FieldUseWatch
        control={control}
        fieldsToWatch={[FIELDS.hedgeRatio, FIELDS.portfolioValue]}
        Component={({ fields: [hedgeRatio, portfolioValue] }) => (
          <Typography variant={"body1"}>
            Notional amount to hedge:{" "}
            {formatDollars.format(portfolioValue * hedgeRatio)}
          </Typography>
        )}
      />

      <Controller
        name={FIELDS.delta}
        control={control}
        render={({ field: { ref, ...field }, fieldState: { error } }) => (
          <StyledTextFieldClearableInfo
            {...field}
            error={Boolean(error)}
            info={
              "Delta of each spread with OTM 8.6% put sold, per option e.g. 0.250"
            }
            label={"Delta"}
            helperText={error?.message}
            variant={"outlined"}
          />
        )}
      />

      <FieldUseWatch
        control={control}
        fieldsToWatch={[
          FIELDS.portfolioValue,
          FIELDS.hedgeRatio,
          FIELDS.delta,
          FIELDS.spyPrice,
        ]}
        Component={({
          fields: [portfolioValue, hedgeRatio, delta, spyPrice],
        }) => (
          <Typography variant={"body1"}>
            Number of spreads required (i.e. standard option contracts):
            {formatDecimals.format(
              (portfolioValue * hedgeRatio) / (delta * spyPrice * 100)
            )}
          </Typography>
        )}
      />
    </Container>
  );
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
