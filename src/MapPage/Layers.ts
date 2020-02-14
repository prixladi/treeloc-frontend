import { Map, MapLayerEventType, EventData } from 'mapbox-gl';
import { createPopup } from '../Popups/MapFeaturePupup';

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

  map.on('mouseenter', Layers._Polygons, function() {
    const canvas = map.getCanvas();
    if (canvas.style.cursor === '') canvas.style.cursor = 'pointer';
  });

  map.on('mouseleave', Layers._Polygons, function() {
    const canvas = map.getCanvas();
    if (canvas.style.cursor === 'pointer') map.getCanvas().style.cursor = '';
  });

  map.on(
    'click',
    Layers._Polygons,
    (ev: MapLayerEventType['click'] & EventData) => createPopup(ev, map)
  );

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

  map.on('mouseenter', Layers._Points, function() {
    const canvas = map.getCanvas();
    if (canvas.style.cursor === '') canvas.style.cursor = 'pointer';
  });

  map.on('mouseleave', Layers._Points, function() {
    const canvas = map.getCanvas();
    if (canvas.style.cursor === 'pointer') map.getCanvas().style.cursor = '';
  });

  map.on(
    'click',
    Layers._Points,
    (ev: MapLayerEventType['click'] & EventData) => createPopup(ev, map)
  );

  map.addLayer({
    id: Layers._Lines,
    type: 'line',
    source: 'data',
    paint: {
      'line-color': '#135200'
    },
    filter: ['==', '$type', 'LineString']
  });

  map.on('mouseenter', Layers._Lines, function() {
    const canvas = map.getCanvas();
    if (canvas.style.cursor === '') canvas.style.cursor = 'pointer';
  });

  map.on('mouseleave', Layers._Lines, function() {
    const canvas = map.getCanvas();
    if (canvas.style.cursor === 'pointer') map.getCanvas().style.cursor = '';
  });

  map.on('click', Layers._Lines, (ev: MapLayerEventType['click'] & EventData) =>
    createPopup(ev, map)
  );
};
