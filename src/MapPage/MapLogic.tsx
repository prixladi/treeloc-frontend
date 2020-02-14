import React, { useEffect } from 'react';
import { useUserMapMarker } from '../Hooks/UserMapMarker';
import { geolocated, GeolocatedProps } from 'react-geolocated';
import { Map } from 'mapbox-gl';
import { useWoodyPlantsMapControl } from '../Hooks/WoodyPlantsMapControl';
import { AddLayers } from './Layers';
import { setData } from './utils';

interface Props extends GeolocatedProps {
  map: Map;
}

const MapLogic = ({ map, coords }: Props) => {
  const [currentCoords, setMarkerCoords] = useUserMapMarker(map);
  const list = useWoodyPlantsMapControl(map, currentCoords);

  useEffect(() => {
    setData(map, list);
  }, [map, list]);

  useEffect(() => {
    AddLayers(map);
  }, [map]);

  useEffect(() => {
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
