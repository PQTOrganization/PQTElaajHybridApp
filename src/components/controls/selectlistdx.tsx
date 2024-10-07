import { TextField, MenuItem } from "@mui/material";
import Skeleton from "react-loading-skeleton";
import ArrowDropDownIcon  from '@mui/icons-material/ArrowDropDown';

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
        SelectProps={{
          IconComponent: () => <ArrowDropDownIcon sx={{color:"#8B0037", mr:"12px"}}/>, // Change icon color here
        }}
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
