import { TextField, MenuItem } from "@mui/material";
import Skeleton from "react-loading-skeleton";

const SelectListDX = (props: any) => {
  const isError = props.errorText ?? false;
  const helperText = props.helperText ?? props.label;
  const loading = props.loading ?? false;

  if (loading)
    return (
      <Skeleton
        containerClassName="skeleton-container"
        style={{ height: 56 }}
      />
    );
  else
    return (
      <TextField
        select
        fullWidth
        error={isError}
        helperText={props.errorText}
        {...props}
      >
        {props.items &&
          props.items.map((item: any, index: number) => (
            <MenuItem key={props.name + index} value={item.value}>
              {item.text}
            </MenuItem>
          ))}
      </TextField>
    );
};

export default SelectListDX;
