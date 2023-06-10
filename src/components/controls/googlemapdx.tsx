import { useEffect, useState } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import Geocode from "react-geocode";

import GridDX from "../layout/griddx";
import { getPanelHospitals } from "../../shared/services/commonservice";

const libs = ["geometry", "drawing"];

const GoogleMapDX = (props: any) => {
  const containerStyle = {
    width: "100%",
    height: "calc(100vh - 280px)",
  };

  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA3FzKFHiA7bUcmOaubinG6wqCZt8Dw7Yk",
  });

  const [zoom, setZoom] = useState(12);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<
    google.maps.LatLng | google.maps.LatLngLiteral
  >();
  const [currentCity, setCurrentCity] = useState<any>(null);
  const [hospitalMarkers, setHospitalMarkers] = useState<any>(props.hospitals);
  const [loadingMarkers, setLoadingMarkers] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState<any>(null);

  useEffect(() => {
    Geocode.setApiKey("AIzaSyA3FzKFHiA7bUcmOaubinG6wqCZt8Dw7Yk");
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation) getCurrentLocationCity();
  }, [currentLocation]);

  useEffect(() => {
    // if (currentCity) getHospitalsWithMarkers();
  }, [currentCity]);

  const getCurrentLocationCity = () => {
    if (currentLocation) {
      Geocode.fromLatLng(
        currentLocation.lat.toString(),
        currentLocation.lng.toString()
      ).then(
        (response) => {
          const address = response.results[0].formatted_address;
          let city, state, country;
          for (
            let i = 0;
            i < response.results[0].address_components.length;
            i++
          ) {
            for (
              let j = 0;
              j < response.results[0].address_components[i].types.length;
              j++
            ) {
              switch (response.results[0].address_components[i].types[j]) {
                case "locality":
                  city = response.results[0].address_components[i].long_name;
                  break;
                case "administrative_area_level_1":
                  state = response.results[0].address_components[i].long_name;
                  break;
                case "country":
                  country = response.results[0].address_components[i].long_name;
                  break;
              }
            }
          }

          setCurrentCity(city);
        },
        (error) => {
          console.error(error);
          setCurrentCity("KARACHI");
        }
      );
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log({ position });

      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  return (
    <GridDX container>
      <GridDX xs item={12} sx={{ display: "block" }}>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation}
            zoom={zoom}
            options={{
              disableDefaultUI: false,
              fullscreenControl: false,
              mapTypeControl: false,
              streetViewControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            {currentLocation && (
              <MarkerF
                key="crnt_loc"
                position={currentLocation}
                draggable={false}
              />
            )}

            {loadingMarkers ? (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  justifyContent: "center",
                  backgroundColor: "black",
                  opacity: 0.7,
                  color: "white",
                  padding: 8,
                }}
              >
                Loading Hospital Locations...
              </div>
            ) : (
              hospitalMarkers &&
              hospitalMarkers.map((h: any, i: number) => (
                <MarkerF
                  key={"marker_" + i}
                  position={{ lat: h.lat, lng: h.lng }}
                  draggable={false}
                  title={"Hospital"}
                />
              ))
            )}
          </GoogleMap>
        )}
      </GridDX>
    </GridDX>
  );
};

export default GoogleMapDX;
