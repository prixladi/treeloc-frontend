import React, { useEffect } from 'react';
import { useUserMapMarker } from '../Hooks/UserMapMarker';
import { geolocated, GeolocatedProps } from 'react-geolocated';
import { Map, GeoJSONSource } from 'mapbox-gl';
import { useWoodyPlantsLoader } from '../Hooks/WoodyPlantsLoader';
import { AddLayers, Layers } from './Layers';
import { getFeaturesFromList } from './utils';

export const MapCenter: [number, number] = [15.4749126, 49.8037633];
export const InitialCoordinates: Coordinates = {
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  speed: null,
  accuracy: 1,
  longitude: MapCenter[0],
  latitude: MapCenter[1]
};

const initialFilter = { skip: 0, take: 5 };

interface Props extends GeolocatedProps {
  map: Map;
}

const MapLogic = ({ map, coords }: Props) => {
  const [currentCoords, setMarkerCoords] = useUserMapMarker(
    map,
    coords ?? InitialCoordinates
  );
  const [list, loadAsync] = useWoodyPlantsLoader(initialFilter);

  useEffect(() => {
    const data = {
      type: 'FeatureCollection',
      features: getFeaturesFromList(list)
    } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

    const source = map.getSource('data') as GeoJSONSource;

    if (source) source.setData(data);
    else {
      map.addSource('data', ({
        type: 'geojson',
        data: data
      } as unknown) as GeoJSONSource);
    }
  }, [map, list]);

  useEffect(() => {
    loadAsync({
      skip: 0,
      take: 5,
      point: {
        latitude: currentCoords[0],
        longitude: currentCoords[1]
      }
    });
    // eslint-disable-next-line
  }, [currentCoords]);

  useEffect(() => {
    AddLayers(map);
    map.on('click', Layers._Points, x => console.log(x));
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
