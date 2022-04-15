import { useWatch } from "react-hook-form";
import React from "react";

/*Isolate rendering of an array of fields (convenience)*/
export const FieldUseWatch = ({ control, fieldsToWatch, Component }) => {
  const fields = useWatch({
    control,
    name: fieldsToWatch,
  });
  return <Component fields={fields} />;
};
