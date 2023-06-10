import { TextField, InputAdornment } from "@mui/material/";
import Autocomplete from "@mui/material/Autocomplete";
import Skeleton from "react-loading-skeleton";

import { useStyles } from "../../shared/styles";
import ToolTipHelper from "./tooltip";

const AutoCompleteListDX = (props: any) => {
  const classes = useStyles();

  const helperText = props.helperText ?? "";
  const checkValue = props.value ?? "";
  const isError = props.errorText ?? false;
  const loading = props.loading ?? false;

  if (loading)
    return (
      <Skeleton
        containerClassName="skeleton-container"
        style={{ height: 56 }}
      />
    );
  else if (props.readOnly) {
    return (
      <TextField
        {...props}
        variant="standard"
        fullWidth
        multiline
        disabled
        placeholder={helperText}
        helperText=""
        InputLabelProps={{ shrink: true }}
        className={classes.readonly}
        value={checkValue}
      ></TextField>
    );
  } else
    return (
      <Autocomplete
        fullWidth
        disableClearable
        options={props.list}
        autoHighlight
        getOptionLabel={(option: any) => option.value || ""}
        {...props}
        renderInput={(params) => {
          const defaultEndAdornment = params.InputProps.endAdornment;

          return (
            <TextField
              {...params}
              error={isError}
              helperText={props.errorText ?? props.helperText}
              label={props.label}
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password", // disable autocomplete and autofill
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment:
                  props.tip == null ? (
                    defaultEndAdornment
                  ) : (
                    <>
                      <InputAdornment position="end">
                        <ToolTipHelper title={props.tip} />
                      </InputAdornment>
                      {defaultEndAdornment}
                    </>
                  ),
              }}
              variant={!props.readOnly ? "outlined" : "standard"}
              disabled={props.readOnly || props.disabled}
              InputLabelProps={{ shrink: props.readOnly }}
              className={classes.selectStyle} // VERY IMPORTANT
            />
          );
        }}
      />
    );
};

export default AutoCompleteListDX;
