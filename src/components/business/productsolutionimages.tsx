import { useNavigate } from "react-router-dom";

import {
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { openURLInBrowser } from "../../shared/globals";

const ProductsSolutionsImage = (props: any) => {
  const navigate = useNavigate();
  const data = props.data ?? "";

  // const openURLInBrowser = (url: string) => {
  //   navigate("/webpage", { state: { url } });
  // };

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        style={{ fontWeight: "500", fontSize: "20px", color: "#7C1516" }}
      >
        {props.title}
      </Grid>
      <Grid item xs={12}>
        <ImageList
          sx={{
            gridAutoFlow: "column",
            gridTemplateColumns: "repeat(auto-fill,minmax(98%,1fr)) !important",
            gridAutoColumns: "minmax(100%, 1fr)",
            boxShadow:
              "0px 8px 10px rgba(0, 0, 0, 0.14), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 5px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          {data &&
            data.map((item: any) => (
              <a onClick={() => openURLInBrowser(item?.url)}>
                <ImageListItem>
                  <img
                    src={
                      item?.src ??
                      "https://propertywiselaunceston.com.au/wp-content/themes/property-wise/images/no-image@2x.png"
                    }
                  />
                  {!item.src && (
                    <ImageListItemBar position="top" title={item.name} />
                  )}
                </ImageListItem>
              </a>
            ))}
        </ImageList>
      </Grid>
    </Grid>
  );
};
export default ProductsSolutionsImage;
