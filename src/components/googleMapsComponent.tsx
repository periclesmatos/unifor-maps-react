import { useEffect, useState } from 'react';
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from '@react-google-maps/api';
import { getMarkers } from '../services/markerService';
import { useMarkerStore } from '../store/markerStore';
import { MarkerType } from '../types/marker';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '400px',
  margin: '0 auto',
  border: '2px solid black',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

const center = {
  lat: -3.768791,
  lng: -38.478214,
};

const GoogleMapsComponent: React.FC = () => {
  const { markers, setMarkers } = useMarkerStore();
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      const data = await getMarkers();
      setMarkers(data);
    };

    fetchMarkers();
  }, [setMarkers]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16.9}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.latitude, lng: marker.longitude }}
            draggable={true}
            title={marker.titulo}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}
        {selectedMarker && (
          <InfoWindow
          position={{
            lat: selectedMarker.latitude,
            lng: selectedMarker.longitude,
          }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div style={{ maxWidth: "200px", fontFamily: "Arial, sans-serif" }}>
            <h3 style={{ margin: "0", fontSize: "16px", color: "#2c3e50" }}>
              {selectedMarker.titulo}
            </h3>
            <p style={{ margin: "5px 0 0", fontSize: "14px", color: "#555" }}>
              {selectedMarker.descricao}
            </p>
          </div>
        </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapsComponent;
