import { useEffect, useState } from 'react';
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from '@react-google-maps/api';

import { getMarkers } from '../../services/markerService';
import { useMarkerStore } from '../../store/markerStore';
import { MarkerType } from '../../types/marker';
import styles from './InteractiveMap.module.css';

const center = {
  lat: -3.768791,
  lng: -38.478214,
};

const InteractiveMap: React.FC = () => {
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
      <GoogleMap
        mapContainerClassName={styles.mapContainer}
        center={center}
        zoom={16.5}
      >
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
            <div className={styles.infoWindow}>
              <h3>{selectedMarker.titulo}</h3>
              <p>{selectedMarker.descricao}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default InteractiveMap;
