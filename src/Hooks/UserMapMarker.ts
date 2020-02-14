import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Map, Marker, MapLayerEventType, EventData } from 'mapbox-gl';
import { SetPositionControl } from '../MapControls/SetPositionControl';
import { MapCenter } from '../Common/MapConstants';

const control = new SetPositionControl();

const createSetCoordsCallback = (
  marker: Marker | null,
  map: Map,
  setMarker: Dispatch<SetStateAction<Marker | null>>,
  setCoords: Dispatch<SetStateAction<[number, number]>>
) => {
  return (newCoords: [number, number]) => {
    if (marker) marker.remove();
    map.easeTo({ center: newCoords });
    setMarker(new Marker().setLngLat(newCoords).addTo(map));
    setCoords(newCoords);
  };
};

const createMarker = (map: Map, coords: [number, number]) =>
  new Marker().setLngLat(coords).addTo(map);

const registerOnClickHandle = (
  map: Map,
  handle: (e: MapLayerEventType & EventData) => void
) => {
  map.on('click', handle);
  return () => {
    map.off('click', handle);
  };
};

const useUserMapMarker = (
  map: Map
): [[number, number], (newCoords: [number, number]) => void] => {
  const [marker, setMarker] = useState(null as Marker | null);
  const [coords, setCoords] = useState(MapCenter);
  const [posititonMode, setPositionMode] = useState(false);

  useEffect(() => {
    map.addControl(control);
  }, [map]);

  useEffect(() => {
    control.onClickCallback = setPositionMode;
  }, [posititonMode, setPositionMode]);

  useEffect(() => {
    if (!marker) setMarker(createMarker(map, coords));

    if (!posititonMode) return;

    const handleOnClick = (e: MapLayerEventType & EventData) => {
      if (marker) marker.remove();

      setCoords([e.lngLat.lng, e.lngLat.lat]);
      setMarker(createMarker(map, [e.lngLat.lng, e.lngLat.lat]).addTo(map));
      setPositionMode(false);

      map.easeTo({ center: [e.lngLat.lng, e.lngLat.lat] });
    };

    return registerOnClickHandle(map, handleOnClick);
  }, [map, coords, marker, posititonMode]);

  return [coords, createSetCoordsCallback(marker, map, setMarker, setCoords)];
};

export { useUserMapMarker };
