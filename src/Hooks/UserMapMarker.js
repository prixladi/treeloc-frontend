import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const useUserMapMarker = (map, initialCoords) => {
  const [data, setData] = useState({ marker: null, coords: initialCoords });

  useEffect(() => {
    const lastMarker = data.marker;
    if (!lastMarker)
      setData({
        marker: new mapboxgl.Marker().setLngLat(initialCoords).addTo(map),
        coords: initialCoords
      });

    const handleOnClick = e => {
      if (lastMarker) lastMarker.remove();

      setData({
        coords: [e.lngLat.lng, e.lngLat.lat],
        marker: new mapboxgl.Marker()
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map)
      });

      map.easeTo({ center: [e.lngLat.lng, e.lngLat.lat] });
    };

    map.on('click', handleOnClick);
    return () => map.off('click', handleOnClick);
  }, [map, data, initialCoords]);

  const setCoords = newCoords => {
    if (data.marker) data.marker.remove();
    map.easeTo({ center: newCoords });
    setData({
      marker: new mapboxgl.Marker().setLngLat(newCoords).addTo(map),
      coords: newCoords
    });
  };

  return [data.coords, setCoords];
};

export { useUserMapMarker };
