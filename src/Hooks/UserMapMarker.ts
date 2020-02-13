import { useState, useEffect } from 'react';
import { Map, Marker, MapLayerEventType, EventData } from 'mapbox-gl';
import { SetPositionControl } from '../MapControls/SetPositionControl';

const control = new SetPositionControl();

const useUserMapMarker = (
  map: Map,
  initialCoords: Coordinates
): [[number, number], (newCoords: [number, number]) => void] => {
  const [data, setData] = useState({
    marker: null as Marker | null,
    coords: [initialCoords.longitude, initialCoords.latitude] as [
      number,
      number
    ]
  });
  const [posititonMode, setPositionMode] = useState(false);

  useEffect(() => {
    map.addControl(control);
  }, [map]);

  useEffect(() => {
    control.onClickCallback = setPositionMode;
  }, [posititonMode, setPositionMode]);

  useEffect(() => {
    if (!posititonMode && data.marker) return;

    const lastMarker = data.marker;
    if (!lastMarker)
      setData({
        marker: new Marker()
          .setLngLat([initialCoords.longitude, initialCoords.latitude])
          .addTo(map),
        coords: [initialCoords.longitude, initialCoords.latitude]
      });

    const handleOnClick = (e: MapLayerEventType & EventData) => {
      if (lastMarker) lastMarker.remove();

      setData({
        coords: [e.lngLat.lng, e.lngLat.lat],
        marker: new Marker().setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(map)
      });
      setPositionMode(false);

      map.easeTo({ center: [e.lngLat.lng, e.lngLat.lat] });
    };

    map.on('click', handleOnClick);
    return () => {
      map.off('click', handleOnClick);
    };
  }, [map, data, initialCoords, posititonMode]);

  const setCoords = (newCoords: [number, number]) => {
    if (data.marker) data.marker.remove();
    map.easeTo({ center: newCoords });
    setData({
      marker: new Marker().setLngLat(newCoords).addTo(map),
      coords: newCoords
    });
  };

  return [data.coords, setCoords];
};

export { useUserMapMarker };
