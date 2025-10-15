import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '15px'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const GoogleMapComponent = ({ events = [], selectedEvent, onEventSelect }) => {
  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {events.map(event => (
          event.latitude && event.longitude && (
            <Marker
              key={event.id}
              position={{
                lat: parseFloat(event.latitude),
                lng: parseFloat(event.longitude)
              }}
              onClick={() => onEventSelect(event)}
            />
          )
        ))}
        
        {selectedEvent && selectedEvent.latitude && selectedEvent.longitude && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedEvent.latitude),
              lng: parseFloat(selectedEvent.longitude)
            }}
            onCloseClick={() => onEventSelect(null)}
          >
            <div className="map-info-window">
              <h4>{selectedEvent.title}</h4>
              <p>{selectedEvent.location}</p>
              <p>{new Date(selectedEvent.date).toLocaleDateString()}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;