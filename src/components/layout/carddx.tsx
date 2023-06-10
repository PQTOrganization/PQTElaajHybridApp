import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";

const CardDX = (props: any) => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      {...props}
      sx={{
        borderColor: theme.palette.primary.main,
        borderRadius: "12px",
        ...props.sx,
      }}
    />
  );
};

export default CardDX;
