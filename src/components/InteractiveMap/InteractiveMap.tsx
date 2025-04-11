import { useEffect, useState, useRef } from 'react';
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  Libraries
} from '@react-google-maps/api';

import { getMarkers, updateMarker } from '../../services/markerService';
import { useMarkerStore } from '../../store/markerStore';
import { useMarkerFormStore } from '../../store/markerFormStore';
import { MarkerType } from '../../types/marker';
import { setMarkerDistances } from '../../utils/mapUtils';
import styles from './InteractiveMap.module.css';

// Definindo o centro do mapa com as coordenadas da Unifor.
const center = {
  lat: -3.768791,
  lng: -38.478214,
};

const libraries: Libraries = ['geometry'];

const InteractiveMap: React.FC = () => {
  const markers = useMarkerStore((state) => state.markers);
  const setMarkers = useMarkerStore((state) => state.setMarkers);
  const replaceMarker = useMarkerStore((state) => state.replaceMarker);
  const setField = useMarkerFormStore((state) => state.setField);

  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null); // Estado para armazenar o marcador selecionado.
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null); // Estado para armazenar a localização do usuário.
  const mapRef = useRef<google.maps.Map | null>(null); // Referência para o mapa.

  // Função para lidar com o carregamento do mapa.
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map; // agora temos acesso direto ao mapa
  };

  // Buscar marcadores da API quando o componente for montado e atualizar o store.
  // Isso garante que os marcadores sejam carregados assim que o componente for exibido.
  useEffect(() => {
    const fetchMarkers = async () => {
      const data = await getMarkers();
      setMarkers(data);
    };

    fetchMarkers();
  }, [setMarkers]);

  // Obter a localização do usuário quando o componente for montado.
  // Isso garante que a localização do usuário seja obtida assim que o componente for exibido.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const current = {
            lat: position.coords.latitude,
            lng: position.coords.longitude, 
          };
          setUserLocation(current); // Atualiza a localização do usuário no estado.
          setMarkerDistances(current.lat, current.lng); // Atualiza as distâncias dos marcadores em relação à localização do usuário.
          // mapRef.current?.setCenter(current); // Centraliza o mapa na localização do usuário.
        },
        (error) => {
          console.error('Erro ao obter localização do usuário:', error);
        },
        {
          enableHighAccuracy: false, // Habilita alta precisão na localização.
          maximumAge: 0, // Não usa localização armazenada em cache.
          timeout: 5000, // Define um tempo limite de 5 segundos para obter a localização.
        }
      );
    }
  }, []);

  // Atualizar o marcador no store e no banco de dados quando o usuário clicar em um marcador e arrastalo.
  const handleMarkerDragEnd = async (
    e: google.maps.MapMouseEvent,
    marker: MarkerType
  ) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();

    if (lat !== undefined && lng !== undefined) {
      // Atualiza a latitude e longitude do marcador no store.
      replaceMarker(marker.id, { latitude: lat, longitude: lng });

      try {
        // Atualiza a latitude e longitude do marcador no banco de dados.
        await updateMarker({
          id: marker.id,
          titulo: marker.titulo,
          descricao: marker.descricao,
          latitude: lat,
          longitude: lng,
        });
      } catch (error) {
        console.error('Erro ao atualizar marcador no banco:', error);
      }
    }
  };

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
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <GoogleMap
        onLoad={handleMapLoad}
        onClick={handleMapClick}
        mapContainerClassName={styles.mapContainer}
        center={center}
        zoom={16.5}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon='http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            title='Sua localização'
          />
        )}
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
