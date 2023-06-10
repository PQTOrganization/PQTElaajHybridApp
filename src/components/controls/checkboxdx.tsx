import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const CheckBoxDX = (props: any) => {
  return (
    <FormControlLabel
      control={<Checkbox defaultChecked />}
      {...props}
      sx={{ ...props.sx, marginRight: 0 }}
      label={props.label}
    />
  );
};

export default CheckBoxDX;
