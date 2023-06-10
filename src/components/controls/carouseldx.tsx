import Carousel from "react-material-ui-carousel";
import ButtonDX from "./buttondx";

const CarouselDX = (props: any) => {
  return (
    <Carousel
      {...props}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      height={100}
      animation={"slide"}
      autoPlay={false}
      indicators={false}
      navButtonsAlwaysVisible={true}
      navButtonsWrapperProps={{
        style: { position: "relative", alignSelf: "center" },
      }}
      NavButton={({ onClick, className, style, next, prev }) => {
        if (next)
          return (
            <ButtonDX
              variant="text"
              onClick={onClick}
              sx={{
                backgroundColor: "transparent !important",
                opacity: "1 !important",
              }}
            >
              Next
            </ButtonDX>
          );
        else return null;
      }}
      next={(now, prev) => {
        console.log({ now, prev });

        if (props.totalSlides - 1 == prev) props.lastStepFunction();
      }}
    />
  );
};

export default CarouselDX;
