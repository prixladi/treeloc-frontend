import { useState, useEffect } from 'react';
import { Map, Marker, MapLayerEventType, EventData } from 'mapbox-gl';

const useUserMapMarker = (
  map: Map,
  initialCoords: [number, number]
): [[number, number], (newCoords: [number, number]) => void] => {
  const [data, setData] = useState({
    marker: null as Marker | null,
    coords: initialCoords
  });

  useEffect(() => {
    const lastMarker = data.marker;
    if (!lastMarker)
      setData({
        marker: new Marker().setLngLat(initialCoords).addTo(map),
        coords: initialCoords
      });

    const handleOnClick = (e: MapLayerEventType & EventData) => {
      if (lastMarker) lastMarker.remove();
      console.log(e);
      setData({
        coords: [e.lngLat.lng, e.lngLat.lat],
        marker: new Marker()
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map)
      });

      map.easeTo({ center: [e.lngLat.lng, e.lngLat.lat] });
    };

    map.on('click', handleOnClick);
    return () => {
      map.off('click', handleOnClick);
    };
  }, [map, data, initialCoords]);

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
