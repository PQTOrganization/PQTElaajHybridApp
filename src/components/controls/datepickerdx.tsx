import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import {
  InputAdornment,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import moment from "moment";

import { useStyles } from "../../shared/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import Skeleton from "react-loading-skeleton";

const DatePickerDX = (props: any) => {
  const classes = useStyles();
  const theme = useTheme();
  const useMobileView = useMediaQuery(theme.breakpoints.down("sm"));

  const isError = props.errorText ?? false;
  const helperText = props.helperText;
  const dateFormat = props.format ?? "DD-MMM-yyyy"; //DATE_FORMAT;
  const platform = navigator?.userAgent ?? "";
  const loading = props.loading ?? false;

  if (loading)
    return (
      <Skeleton
        containerClassName="skeleton-container"
        style={{ height: 56 }}
      />
    );
  else if (props.readOnly)
    return (
      <TextField
        {...props}
        value={props.value ? moment(props.value).format(dateFormat) : ""}
        variant="standard"
        fullWidth
        disabled
        placeholder={helperText}
        helperText=""
        InputLabelProps={{ shrink: true }}
        className={classes.readonly}
      />
    );
  else {
    return (
      <DatePicker
        {...props}
        variant="outlined"
        inputVariant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CalendarIcon />
            </InputAdornment>
          ),
        }}
        renderInput={(params: any) => {
          params.inputProps.value = props.value
            ? moment(props.value).format(dateFormat)
            : "";
          return (
            <TextField
              {...params}
              {...props}
              error={isError}
              helperText={props.errorText ?? props.helperText}
              fullWidth
            />
          );
        }}
      />
    );
  }
};

export default DatePickerDX;
