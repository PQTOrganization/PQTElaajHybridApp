import React from "react";
import BoxDX from "./boxdx";
import userIcon from "./../../assets/user.png";

// <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</a>

const ImagePlaceholderDX = (props: {
  alt?: string;
  height?: number | string;
  width?: number | string;
  src?: string;
}) => {
  return (
    <BoxDX
      component="img"
      sx={{
        height: props.height ? props.height : 50,
        width: props.width ? props.width : 50,
        borderRadius: 50,
        maxHeight: { xs: 233, md: 167 },
        maxWidth: { xs: 350, md: 250 },
      }}
      alt={props.alt ? props.alt : ""}
      src={props.src ? props.src : userIcon}
    />
  );
};

export default ImagePlaceholderDX;
