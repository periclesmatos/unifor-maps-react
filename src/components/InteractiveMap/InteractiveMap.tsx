import { useEffect, useState } from 'react';
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from '@react-google-maps/api';

import { getMarkers, updateMarker } from '../../services/markerService';
import { useMarkerStore } from '../../store/markerStore';
import { useMarkerFormStore } from '../../store/markerFormStore';
import { MarkerType } from '../../types/marker';
import styles from './InteractiveMap.module.css';

// Definindo o centro do mapa com as coordenadas da Unifor.
const center = {
  lat: -3.768791,
  lng: -38.478214,
};

const InteractiveMap: React.FC = () => {
  const { markers, setMarkers, replaceMarker } = useMarkerStore();
  const { setField } = useMarkerFormStore();
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);

  // Buscar marcadores da API quando o componente for montado e atualizar o store.
  // Isso garante que os marcadores sejam carregados assim que o componente for exibido.
  useEffect(() => {
    const fetchMarkers = async () => {
      const data = await getMarkers();
      setMarkers(data);
    };

    fetchMarkers();
  }, [setMarkers]);


  // Atualizar o marcador no store e no banco de dados quando o usuário clicar em um marcador e arrastalo.
  const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent, marker: MarkerType) => {
    const lat = e.latLng?.lat()
    const lng = e.latLng?.lng()

    // Verifica se a latitude e longitude estão definidas antes de atualizar o marcador.
    if (lat !== undefined && lng !== undefined) {
      // Atualiza a latitude e longitude do marcador no store.
      replaceMarker(marker.id, { latitude: lat, longitude: lng });

      try {
        // Atualiza a latitude e longitude do marcador no banco de dados.
        await updateMarker({id: marker.id, titulo: marker.titulo, descricao: marker.descricao, latitude: lat, longitude: lng});
      } catch (error) {
        console.error("Erro ao atualizar marcador no banco:", error);
      }
    }
  }

  // Função para lidar com o clique no mapa e definir a latitude e longitude no formulário.
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      // Quando o usuário clicar no mapa, a latitude e longitude do ponto clicado serão definidas no store.
      if (lat !== undefined && lng !== undefined) {
        setField('latitude', lat);
        setField('longitude', lng);
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        onClick={handleMapClick}
        mapContainerClassName={styles.mapContainer}
        center={center}
        zoom={16.5}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.latitude, lng: marker.longitude }}
            title={marker.titulo}
            draggable={true}
            onDragEnd={(e) => handleMarkerDragEnd(e, marker)}
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
