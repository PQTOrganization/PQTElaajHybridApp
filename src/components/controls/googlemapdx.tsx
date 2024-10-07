import { useEffect, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import Geocode from "react-geocode";
import GridDX from "../layout/griddx";
import AlertComponenet from "../alerts/alert";
import ButtonDX from "./buttondx";
import AutoCompleteListDX from "./autocompletelistdx";
import { openGoogleMapsApp } from "../../shared/globals";

const libs = ["geometry", "drawing"];

const GoogleMapDX = (props: any) => {
  const containerStyle = {
    width: "100%",
    height: "calc(100vh - 280px)",
  };

  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA3FzKFHiA7bUcmOaubinG6wqCZt8Dw7Yk",
    libraries: ["places"],
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
  const [searchString, setSearchString] = useState<any>("");
  const [searchedLocation, setSearchedLocation] = useState<
    google.maps.LatLng | google.maps.LatLngLiteral | null
  >(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // var directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
  //   /** @type google.maps.DirectionsRenderer */ new google.maps.DirectionsRenderer()
  // );

  useEffect(() => {
    Geocode.setApiKey("AIzaSyA3FzKFHiA7bUcmOaubinG6wqCZt8Dw7Yk");
    getCurrentLocation();
    // directionsRendererRef = new google.maps.DirectionsRenderer();
  }, []);

  useEffect(() => {
    if (currentLocation) getCurrentLocationCity();
  }, [currentLocation]);

  useEffect(() => {
    if (searchedLocation) {
      fetchDirections(searchedLocation);
    }
  }, [searchedLocation]);

  useEffect(() => {
    if (!directionsRenderer?.setDirections) {
      return;
    }
    directionsRenderer.setMap(map);
    directionsRenderer.setDirections(directionsResponse);
  }, [directionsResponse]);

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
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };
  const [showAlert, setShowAlert] = useState<any>(null);

  const fetchDirections = (destination: any) => {
    if (currentLocation && destination) {
      const directionsService = new google.maps.DirectionsService();
      setDirectionsResponse(null);
      directionsService.route(
        {
          origin: currentLocation,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setZoom(15);
            setDirectionsResponse(response);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  };

  const handleMarkerClick = (hospital: any) => {
    const destination = { lat: hospital.lat, lng: hospital.lng };

    fetchDirections(destination);
  };
  const openGoogleMaps = () => {
    const destinationLat = searchedLocation?.lat;
    const destinationLng = searchedLocation?.lng;
    const currentLat = currentLocation?.lat;
    const currentLng = currentLocation?.lng;

    if (currentLat && currentLng && destinationLat && destinationLng) {
      const win: any = window;
      if (win?.ReactNativeWebView) {
        openGoogleMapsApp(
          JSON.stringify({
            currentLat: currentLat,
            currentLng: currentLng,
            destinationLat: destinationLat,
            destinationLng: destinationLng,
          })
        );
      } else {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLat},${currentLng}&destination=${destinationLat},${destinationLng}&travelmode=driving`;
        window.open(url, "_blank");
      }
    } else {
      console.error(
        "Current location or destination location is not available"
      );
    }
  };

  const handleSearch = (hospitalName: any) => {
    if (hospitalName) {
      const filteredHospitals = props.hospitals.filter((hospital: any) =>
        hospital.hospitalName.toLowerCase().includes(hospitalName.toLowerCase())
      );
      if (filteredHospitals.length > 0) {
        const firstMatch = filteredHospitals[0];
        setSearchedLocation({ lat: firstMatch.lat, lng: firstMatch.lng });
        setZoom(15);
        setHospitalMarkers(filteredHospitals);
        setShowAlert(false);
        setShowButton(true);
      } else {
        setShowAlert(true);
        setShowButton(false);
      }
    } else {
      setHospitalMarkers(props.hospitals);
      setSearchedLocation(null);
      setShowButton(false);
      setShowAlert(false);
    }
  };

  return (
    <GridDX container>
      {isLoaded && (
        <>
          <GridDX item xs={12}>
            <AutoCompleteListDX
              label="Search for a Hospital..."
              list={props.hospitals}
              value={searchString}
              onInputChange={(e: any) => {
                setInputValue(e.target.value);
                setIsOpen(e.target.value.length > 2);
              }}
              onChange={(event: any, newValue: any) => {
                if (newValue) {
                  setSearchString({
                    id: newValue.hospitalId,
                    value: newValue.hospitalName,
                  });
                  handleSearch(newValue.hospitalName);
                  setIsOpen(false);
                }
              }}
              InputLabelProps={{ style: { pointerEvents: "auto" } }}
              isSearch={true}
              open={isOpen}
            />
          </GridDX>
          <GridDX
            item
            xs={12}
            sx={{position: "absolute",left: "0", right: "0", bottom: "0"}}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={searchedLocation || currentLocation}
              zoom={zoom}
              options={{
                disableDefaultUI: false,
                fullscreenControl: false,
                mapTypeControl: false,
                streetViewControl: false,
              }}
              onLoad={(map) => {
                setMap(map);
                let directionsRenderer = new google.maps.DirectionsRenderer();
                directionsRenderer.setMap(map);
                setDirectionsRenderer(directionsRenderer);
              }}
              onUnmount={() => setMap(null)}
            >
              <AlertComponenet
                open={showAlert}
                alert="This hospital doesn't exist on the map"
                handleClose={() => setShowAlert(false)}
              />

              {currentLocation && (
                <MarkerF
                  key="crnt_loc"
                  position={currentLocation}
                  draggable={false}
                />
              )}
              {searchedLocation && (
                <MarkerF
                  key="srch_loc"
                  position={searchedLocation}
                  draggable={false}
                  title="Searched Location"
                />
              )}
              {showButton && (
                <ButtonDX
                  onClick={openGoogleMaps}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    m: "0px 0px 25px  8px",
                  }}
                >
                  Get Directions
                </ButtonDX>
              )}

              {/* {directionsResponse && (
                <DirectionsRenderer
                  directions={directionsResponse}
                  ref={directionsRendererRef}
                />
              )} */}

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
                    onClick={() => handleMarkerClick(h)}
                  />
                ))
              )}
            </GoogleMap>
          </GridDX>
        </>
      )}
    </GridDX>
  );
};

export default GoogleMapDX;
