import { useEffect, useState } from "react";
import ValueAddedCard from "../components/business/valueaddedcard";
import GridDX from "../components/layout/griddx";
import { CircularProgress } from "@mui/material";

import { getValueAddedServices } from "../shared/services/commonservice";
import Skeleton from "react-loading-skeleton";
import { useAuthContext } from "../context/authcontext";

const ValueAddedServices = () => {
  const { getToken } = useAuthContext();

  const [valueAddedData, setValueAddedData] = useState<any>();
  const [loading, setLoading] = useState(false);

  const getData = () => {
    setLoading(true);
    const token = getToken();
    getValueAddedServices(token)
      .then((resp) => {
        setValueAddedData(resp);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <GridDX
      container
      sx={{ width: "100%", alignContent: "flex-start" }}
      rowSpacing={2}
    >
      {valueAddedData ? (
        valueAddedData.map((item: any, index: number) => (
          <GridDX item xs={12} key={index}>
            <ValueAddedCard loading={loading} data={item} />
          </GridDX>
        ))
      ) : (
        <Skeleton
          containerClassName="skeleton-container"
          count={4}
          style={{ height: 150, marginBottom: 8 }}
        />
      )}
    </GridDX>
  );
};

export default ValueAddedServices;
