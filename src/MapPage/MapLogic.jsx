import React, { useEffect } from 'react';
import { useUserMapMarker } from '../Hooks/UserMapMarker';
import { geolocated } from 'react-geolocated';

const MapLogic = ({ map, coords }) => {
  const [, setMarkerCoords] = useUserMapMarker(map, [15.4749126, 49.8037633]);

  useEffect(() => {
    console.log(coords);
    if (coords) setMarkerCoords([coords.longitude, coords.latitude]);
  // eslint-disable-next-line
  }, [coords]);

  return <div />;
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true
  }
})(MapLogic);
