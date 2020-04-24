import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { SetPositionControl } from '../MapControls/SetPositionControl';
import { MapCenter } from '../Common/MapConstants';
import L from 'leaflet'

const control = new SetPositionControl();

const createSetCoordsCallback = (
  marker: L.Marker | null,
  map: L.Map,
  setMarker: Dispatch<SetStateAction<L.Marker | null>>,
  setCoords: Dispatch<SetStateAction<[number, number]>>
) => {
  return (newCoords: [number, number]) => {
    if (marker) marker.remove();
    setMarker(new L.Marker(newCoords).addTo(map));
    setCoords(newCoords);
  };
};

const createMarker = (map: L.Map, coords: [number, number]) =>
  new L.Marker(coords).addTo(map);

const registerOnClickHandle = (
  map: L.Map,
  handle: (e: L.LeafletMouseEvent) => void
) => {
  map.on('click', handle);
  return () => {
    map.off('click', handle);
  };
};

const useUserMapMarker = (
  map: L.Map
): [[number, number], (newCoords: [number, number]) => void] => {
  const [marker, setMarker] = useState(null as L.Marker | null);
  const [coords, setCoords] = useState(MapCenter);
  const [posititonMode, setPositionMode] = useState(false);

  useEffect(() => {
    map.addControl(control);
    L.DomUtil.removeClass(map.getContainer(),'crosshair-cursor-enabled');
  }, [map]);

  useEffect(() => {
    control.onClickCallback = () => {
      setPositionMode(!posititonMode);
      if (!posititonMode) L.DomUtil.addClass(map.getContainer(),'crosshair-cursor-enabled');
      else L.DomUtil.removeClass(map.getContainer(),'crosshair-cursor-enabled');
    };
  }, [posititonMode, setPositionMode, map]);

  useEffect(() => {
    if (!marker) setMarker(createMarker(map, coords));

    if (!posititonMode) return;

    const handleOnClick = (e: L.LeafletMouseEvent) => {
      if (marker) marker.remove();

      setCoords([e.latlng.lat, e.latlng.lng]);
      setMarker(createMarker(map, [e.latlng.lat, e.latlng.lng]).addTo(map));
      setPositionMode(false);
      L.DomUtil.removeClass(map.getContainer(),'crosshair-cursor-enabled');
    };

    return registerOnClickHandle(map, handleOnClick);
  }, [map, coords, marker, posititonMode]);

  return [coords, createSetCoordsCallback(marker, map, setMarker, setCoords)];
};

export { useUserMapMarker };
