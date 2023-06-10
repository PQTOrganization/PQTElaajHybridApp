import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

import SearchBoxDX from "../controls/searchboxdx";
import GridDX from "../../components/layout/griddx";
import PanelHospitalCard from "./panelhospitalcard";
import GoogleMapWithMarkersDX from "../controls/googlemapwithmarkersdx";
import GoBackIcon from "@mui/icons-material/ArrowBack";

const HospitalCardList = (props: any) => {
  const loading = props.loading ?? false;

  const [searchString, setSearchString] = useState("");
  const [allHospitals, setAllHospitals] = useState<any>(null);
  const [filtered, setFiltered] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [popupMarkers, setPopupMarkers] = useState<any>(null);

  useEffect(() => {
    if (props.hospitals && props.currentLocation) {
      const propsHospital = props.hospitals;

      setAllHospitals(propsHospital.slice());
      setFiltered(propsHospital.slice());

      setCurrentLocation(props.currentLocation);
    }
  }, [props.hospitals, props.currentLocation]);

  useEffect(() => {
    filterHospitalList();
  }, [searchString]);

  const filterHospitalList = () => {
    if (searchString) {
      if (searchString.length < 3) setFiltered(allHospitals.slice());
      else {
        const newFilteredList = allHospitals.filter(
          (h: any) =>
            h.hospitalName.toLowerCase().includes(searchString.toLowerCase()) ||
            h.city.toLowerCase().includes(searchString.toLowerCase())
        );
        setFiltered(newFilteredList);
      }
    }
  };

  const showMapPopup = async (hospitalData: any) => {
    if (hospitalData.lat && hospitalData.lng) {
      const newMarkersData = [
        {
          position: { lat: hospitalData.lat, lng: hospitalData.lng },
          color: "red",
          icon: "hospital",
        },
        {
          position: { lat: currentLocation.lat, lng: currentLocation.lng },
          color: "green",
          icon: null,
        },
      ];

      setPopupMarkers(newMarkersData);
      setShowMap(true);
    }
  };

  if (loading)
    return (
      <Skeleton
        containerClassName="skeleton-container"
        count={4}
        style={{ height: 150, marginBottom: 8 }}
      />
    );
  else
    return (
      <GridDX
        container
        sx={{ width: "100%", alignContent: "flex-start" }}
        rowSpacing={0}
      >
        <Dialog fullScreen open={showMap} onClose={() => setShowMap(false)}>
          <DialogContent sx={{ padding: 0 }}>
            <IconButton
              size="large"
              onClick={() => setShowMap(false)}
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "white",
                zIndex: 10,
              }}
            >
              <GoBackIcon />
            </IconButton>
            <GoogleMapWithMarkersDX markers={popupMarkers} />
          </DialogContent>
        </Dialog>

        <GridDX item xs={12}>
          <SearchBoxDX
            value={searchString}
            onChange={(e: any) => setSearchString(e.target.value)}
          />
        </GridDX>
        <GridDX item xs={12} sx={{ flexDirection: "column" }}>
          {filtered ? (
            filtered.map((h: any, i: number) => (
              <PanelHospitalCard
                key={"hosp_list_" + i}
                data={h}
                showMap={showMapPopup}
              />
            ))
          ) : (
            <Skeleton
              containerClassName="skeleton-container"
              count={4}
              style={{ height: 150, marginBottom: 8 }}
            />
          )}
        </GridDX>
      </GridDX>
    );
};

export default HospitalCardList;
