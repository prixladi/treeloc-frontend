import React, { useEffect } from 'react';
import { useUserMapMarker } from '../Hooks/UserMapMarker';
import { geolocated, GeolocatedProps } from 'react-geolocated';
import L from 'leaflet';
import { useWoodyPlantsMapControl } from '../Hooks/WoodyPlantsMapControl';
import { setData } from './utils';

interface Props extends GeolocatedProps {
  map: L.Map;
}

const MapLogic = ({ map, coords }: Props) => {
  const [currentCoords, setMarkerCoords] = useUserMapMarker(map);
  const list = useWoodyPlantsMapControl(map, currentCoords);
  
  useEffect(() => {
    if (coords) setMarkerCoords([coords.latitude, coords.longitude]);
    // eslint-disable-next-line
  }, [coords]);

  useEffect(() => {
    setData(map, list);
  }, [map, list]);

  return <div />;
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true
  }
})(MapLogic);
