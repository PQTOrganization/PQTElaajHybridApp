import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import Skeleton from "react-loading-skeleton";

import BoxDX from "./boxdx";
import GridDX from "./griddx";
import CardDX from "./carddx";

const HorizontalScrollCardsDX = (props: any) => {
  var loading = props.loading ?? false;

  const theme = useTheme();
  const [cardsData, setCardsData] = useState<any>([]);

  useEffect(() => {
    if (props.cardsData) {
      const sortedData = props.cardsData.sort((a: any, b: any) => {
        var textA = a.employeeSRNumber.toUpperCase();
        var textB = b.employeeSRNumber.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });

      setCardsData(sortedData);
    }
  }, [props.cardsData]);

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
        sx={{
          display: "flex",
          flexWrap: "none",
          justifyContent: "left",
          my: 1,
        }}
      >
        {cardsData?.map((data: any, i: number) => (
          <CardDX
            key={"hcard_" + i}
            sx={{ minWidth: 300, mr: 2, display: "flex" }}
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
          </CardDX>
        ))}
      </BoxDX>
    );
};

export default HorizontalScrollCardsDX;
