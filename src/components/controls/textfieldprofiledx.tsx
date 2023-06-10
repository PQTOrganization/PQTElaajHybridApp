import GridDX from "../layout/griddx";
import {InputAdornment,TextField } from '@mui/material';
import Skeleton from "react-loading-skeleton";
const TextFieldProfilesDX=(props: any)=>{
  const loading = props.loading ?? false;
  if (loading)
    return (
      <Skeleton
        containerClassName="skeleton-container"
        style={{ height: 56 }}
      />
    );
  else
    return(
      <GridDX item xs={12}>
  <TextField id="standard-basic" variant="standard" fullWidth placeholder={props.name} value={props.value} {...props}
           sx={{
            '& .MuiInput-root': { padding: '4%' },
            '& .MuiInput-input':{marginLeft:"2%"},
            '& .MuiInputBase-input-MuiInput-input.Mui-disabled':{WebkitTextFillColor:'rgba(0, 0, 0, 0.6)'}
           }}
           InputProps={
            
               {
                  startAdornment: (
                    <InputAdornment position="start">
                      {props.icon}
                    </InputAdornment>
                  ),
                }
          }
          />
          
          </GridDX>
    )
  }
  export default TextFieldProfilesDX;