import { Map } from 'mapbox-gl';

export const Layers = {
  _Points: 'Points',
  _Polygons: 'Polygons',
  _Lines: 'Lines'
};

export const AddLayers = (map: Map): void => {
  map.addLayer({
    id: Layers._Polygons,
    type: 'fill',
    source: 'data',
    paint: {
      'fill-color': '#135200',
      'fill-opacity': 0.4
    },
    filter: ['==', '$type', 'Polygon']
  });

  map.addLayer({
    id: Layers._Points,
    type: 'circle',
    source: 'data',
    paint: {
      'circle-radius': 6,
      'circle-color': '#135200'
    },
    filter: ['==', '$type', 'Point']
  });

  map.addLayer({
    id: Layers._Lines,
    type: 'line',
    source: 'data',
    paint: {
      'line-color': '#135200'
    },
    filter: ['==', '$type', 'LineString']
  });
};
