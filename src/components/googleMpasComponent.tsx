import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { MarkerType } from "../types/marker";
import { getMarkers } from "../services/api";

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "400px",
  margin: "0 auto",
  border: "2px solid black",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

const center = {
  lat: -3.768791,
  lng: -38.478214,
};

const GoogleMapsComponent: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerType[]>([]);

  useEffect(() => {
    const fetchMarkers = async () => {
      const data = await getMarkers();
      setMarkers(data);
    };

    fetchMarkers();
  }, []);

  const handlerMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const newMarker: MarkerType = {
      id: markers.length + 1,
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng(),
    };
    setMarkers([...markers, newMarker]);
  }

  return (
    <LoadScript googleMapsApiKey="AIzaSyDHaqB0Vaa7e5yH3yn8I0MPhKeOOpHpdi0">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16.9} onClick={handlerMapClick}>
        {markers.map(marker => (
          <Marker key={marker.id} position={{ lat: marker.latitude, lng: marker.longitude }} />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}

export default GoogleMapsComponent;