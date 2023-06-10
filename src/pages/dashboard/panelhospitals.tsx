import { useEffect, useState } from "react";
import { Typography, Tabs, Tab, Box } from "@mui/material";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";

import ListViewIcon from "@mui/icons-material/List";
import MapViewIcon from "@mui/icons-material/FmdGood";

import GridDX from "../../components/layout/griddx";
import GoogleMapDX from "../../components/controls/googlemapdx";

import HospitalCardList from "../../components/business/hospitalcardlist";

import { useErrorContext } from "../../context/errorcontext";

import Api from "../../shared/api/api";
import { getGeoDistance } from "../../shared/globals";
import { useAuthContext } from "../../context/authcontext";

const PanelHospitals = () => {
  const navigate = useNavigate();

  const { getToken } = useAuthContext();
  const { setError } = useErrorContext();
  const [map, setMap] = useState(/** @type google.maps.Map */ null);

  const [panelHospitals, setPanelHospitals] = useState<any>();
  const [viewType, setViewType] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  function TabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        style={{ width: "100%" }}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  const switchView = (event: any, newValue: number) => {
    setViewType(newValue);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log({ position });

      const current = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setCurrentLocation(current);

      getPanelHospital()
        .then((hospitals) => {
          const newHospitals: any = [];

          for (let index = 0; index < hospitals.length; index++) {
            const hospital = hospitals[index];

            if (hospital.lat && hospital.lng)
              newHospitals.push({
                ...hospital,
                distance: getGeoDistance(
                  current.lat,
                  current.lng,
                  hospital.lat,
                  hospital.lng
                ),
              });
            else newHospitals.push({ ...hospital, distance: 99999 });
          }

          // ASC sort
          newHospitals.sort((a: any, b: any) => a.distance - b.distance);

          setPanelHospitals(newHospitals);
          console.log("newHospitals", newHospitals);
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    });
  }, []);

  const getPanelHospital = async () => {
    const token = getToken();
    var route = `PanelHospital`;
    var body = null;
    var Data = await Api(route, body, "GET", token);
    return Data;
  };

  return (
    <GridDX
      container
      sx={{ width: "100%", alignContent: "flex-start", height: "100%" }}
      rowSpacing={0}
    >
      <GridDX item xs={12}>
        <Tabs
          variant="fullWidth"
          sx={{ width: "100%" }}
          value={viewType}
          onChange={switchView}
        >
          <Tab icon={<ListViewIcon />} iconPosition="start" label="List View" />
          <Tab icon={<MapViewIcon />} iconPosition="start" label="Map View" />
        </Tabs>
      </GridDX>
      <GridDX item xs={12} sx={{ pt: 1 }}>
        <TabPanel value={viewType} index={0}>
          <HospitalCardList
            hospitals={panelHospitals}
            currentLocation={currentLocation}
            loading={loading}
          />
        </TabPanel>
        <TabPanel value={viewType} index={1}>
          {panelHospitals ? (
            <GoogleMapDX hospitals={panelHospitals} />
          ) : (
            <Skeleton
              containerClassName="skeleton-container"
              count={4}
              style={{ height: 150, marginBottom: 8 }}
            />
          )}
        </TabPanel>
      </GridDX>
    </GridDX>
  );
};

export default PanelHospitals;
