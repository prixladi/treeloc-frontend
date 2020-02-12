import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const useUserMapMaker = (map, initialCoords) => {
  const [data, setData] = useState({ marker: null, coord: initialCoords });

  useEffect(() => {
    const lastMarker = data.marker;
    if (!lastMarker)
      setData({
        marker: new mapboxgl.Marker().setLngLat(initialCoords).addTo(map),
        coord: initialCoords
      });

    const handleOnClick = e => {
      if (lastMarker) lastMarker.remove();

      setData({
        coords: [e.lngLat.lng, e.lngLat.lat],
        marker: new mapboxgl.Marker()
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map)
      });

      map.flyTo({ center: [e.lngLat.lng, e.lngLat.lat] });
    };

    map.on('click', handleOnClick);
    return () => map.off('click', handleOnClick);
  }, [map, data, initialCoords]);

  return data.coords;
};

export { useUserMapMaker };
