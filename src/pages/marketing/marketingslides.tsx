import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

import CarouselDX from "../../components/controls/carouseldx";
import BoxDX from "../../components/layout/boxdx";
import GridDX from "../../components/layout/griddx";

import { marketingSlidesData } from "../../shared/services/commonservice";

const MarketingSlides = () => {
  const navigate = useNavigate();
  const [slides] = useState(marketingSlidesData);

  useEffect(() => {
    if (slides && slides.length === 0) navigate("/hotline", { replace: true });
  }, [slides]);

  const getSlide = (slideData: any) => {
    return (
      <BoxDX
        key={"slide_" + slideData.marketingSlideId}
        sx={{ flexDirection: "column", pb: 2 }}
      >
        <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
          {slideData.slideHeading}
        </Typography>
        <Typography
          variant="body1"
          color="primary"
          sx={{ textAlign: "justify" }}
        >
          {slideData.slideText}
        </Typography>
      </BoxDX>
    );
  };

  const gotoAppStart = () => {
    navigate("/hotline", { replace: true });
  };

  return (
    <GridDX container sx={{ width: "100%", height: "25%" }}>
      <GridDX item xs={12} sx={{ display: "block" }}>
        <CarouselDX
          lastStepFunction={gotoAppStart}
          duration={1000}
          totalSlides={slides.length}
        >
          {slides.map((s: any) => getSlide(s))}
        </CarouselDX>
      </GridDX>
    </GridDX>
  );
};

export default MarketingSlides;
