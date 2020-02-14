import React, { useEffect } from 'react';
import { useUserMapMarker } from '../Hooks/UserMapMarker';
import { geolocated, GeolocatedProps } from 'react-geolocated';
import { Map } from 'mapbox-gl';
import { useGeoWoodyPlantsLoader } from '../Hooks/GeoWoodyPlantsLoader';
import { AddLayers } from './Layers';
import { setData } from './utils';
import { FindWoodyPlantsControl } from '../MapControls/FindWoodyPlantsControl';

interface Props extends GeolocatedProps {
  map: Map;
}

const MapLogic = ({ map, coords }: Props) => {
  const [currentCoords, setMarkerCoords] = useUserMapMarker(map);
  const [list, loadAsync] = useGeoWoodyPlantsLoader();

  useEffect(() => {
    setData(map, list);
  }, [map, list]);

  useEffect(() => {
    loadAsync(0, 5, currentCoords);
    // eslint-disable-next-line
  }, [currentCoords]);

  useEffect(() => {
    map.addControl(new FindWoodyPlantsControl());
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
