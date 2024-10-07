import { useEffect, useState } from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";

import GridDX from "../layout/griddx";
import ButtonDX from "./buttondx";
import { openGoogleMapsApp } from "../../shared/globals";

const libs = ["geometry", "drawing"];

const GoogleMapWithMarkersDX = (props: any) => {
  const [directionsResponse, setDirectionsResponse] = useState<any>(null);

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA3FzKFHiA7bUcmOaubinG6wqCZt8Dw7Yk",
  });

  const [zoom] = useState(12);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [markers, setMarkers] = useState<any>(null);

  useEffect(() => {
    if (props.markers && isLoaded) {
      setMarkers(props.markers);
      calculateRoute();
    }
  }, [isLoaded, props.markers, map]);

  const openGoogleMaps = () => {
    const destinationLat = props.markers[0].position.lat
    const destinationLng =  props.markers[0].position.lng
    const currentLat =  props.markers[1].position.lat
    const currentLng = props.markers[1].position.lng

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

  const calculateRoute = async () => {
    const origin = {
      lat: props.markers[1].position.lat,
      lng: props.markers[1].position.lng,
    };
    const destination = {
      lat: props.markers[0].position.lat,
      lng: props.markers[0].position.lng,
    };

    const directionsService = new google.maps.DirectionsService();

    await directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  return (
    <GridDX container>
      <GridDX xs item={12} sx={{ display: "block" }}>
        {isLoaded && markers && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={
              markers && markers.length > 0
                ? markers[0].position
                : { lat: 0, lng: 0 }
            }
            zoom={zoom}
            options={{
              disableDefaultUI: false,
              fullscreenControl: false,
              mapTypeControl: false,
              streetViewControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
            {markers &&
              markers.map((m: any, i: number) => (
                <MarkerF
                  key={"marker_" + i}
                  position={m.position}
                  draggable={false}
                  icon={
                    m.icon
                      ? "/map/medical.png"
                      : {
                          url: `http://maps.google.com/mapfiles/ms/icons/${m.color}-dot.png`,
                        }
                  }
                />
              ))}
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
          </GoogleMap>
        )}
      </GridDX>
    </GridDX>
  );
};

export default GoogleMapWithMarkersDX;
