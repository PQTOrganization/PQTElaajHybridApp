import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import Skeleton from "react-loading-skeleton";

import BoxDX from "./boxdx";
import GridDX from "./griddx";
import "./stackedcards.css";

const StackedCards = (props: any) => {
  var loading = props.loading ?? false;

  const theme = useTheme();
  const [cardsData, setCardsData] = useState<any>([]);

  let touchstartY = 0;
  let touchendY = 0;

  useEffect(() => {
    if (props.cardsData) {
      const sortedData = props.cardsData.sort((a: any, b: any) => {
        var textA = a.employeeSRNumber.toUpperCase();
        var textB = b.employeeSRNumber.toUpperCase();
        return textA > textB ? -1 : textA < textB ? 1 : 0;
      });

      setCardsData(sortedData);
    }
  }, [props.cardsData]);

  const onTouchStart = (e: any) => {
    touchstartY = e.changedTouches[0].screenY;
  };

  const onTouchEnd = (e: any) => {
    touchendY = e.changedTouches[0].screenY;
    checkDirection();
  };

  const checkDirection = () => {
    if (touchendY < touchstartY) swipeUp();
    //if (touchendY > touchstartY) swipeDown();
  };

  const swipeUp = () => {
    if (cardsData.length > 1) {
      console.log("swipe up");

      const origData = [...cardsData];
      const lastElement = origData.pop(); // last element is on the top
      origData.unshift(lastElement);

      setCardsData(origData);
    }
  };

  if (loading)
    return (
      <Skeleton
        containerClassName="skeleton-container"
        style={{ height: 250 }}
      />
    );
  else
    return (
      <BoxDX
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="container"
      >
        <div className="card-stack">
          <ul className="card-list">
            {cardsData &&
              cardsData.map((data: any, i: number) => (
                <li
                  key={"card_" + i}
                  className="card"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid",
                    borderColor: theme.palette.primary.main,
                    top: (cardsData.length - 1 - i) * 15,
                  }}
                >
                  <GridDX
                    container
                    sx={{
                      width: "100%",
                      color: theme.palette.primary.main,
                      fontSize: 14,
                      margin: 16,
                    }}
                    rowSpacing={1}
                  >
                    <GridDX item xs={4}>
                      Name:
                    </GridDX>
                    <GridDX item xs={8}>
                      {data.employeeName}
                    </GridDX>
                    <GridDX item xs={4}>
                      Policy#:
                    </GridDX>
                    <GridDX item xs={8}>
                      {data.policyNumber}
                    </GridDX>
                    <GridDX item xs={4}>
                      Status:
                    </GridDX>
                    <GridDX item xs={8}>
                      Enforced
                    </GridDX>
                    <GridDX item xs={4}>
                      Age:
                    </GridDX>
                    <GridDX item xs={8}>
                      {data.age}
                    </GridDX>
                    <GridDX item xs={4}>
                      Employer:
                    </GridDX>
                    <GridDX item xs={8}>
                      {data.companyName}
                    </GridDX>
                    <GridDX item xs={4}>
                      Employee #:
                    </GridDX>
                    <GridDX item xs={8}>
                      {data.employeeFolioId}
                    </GridDX>
                    <GridDX item xs={4}>
                      Relation:
                    </GridDX>
                    <GridDX item xs={8}>
                      {data.relation}
                    </GridDX>
                  </GridDX>
                </li>
              ))}
          </ul>
        </div>
      </BoxDX>
    );
};

export default StackedCards;
