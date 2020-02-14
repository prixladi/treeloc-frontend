import { Map, MapLayerEventType, EventData } from 'mapbox-gl';
import { createPopup } from '../Popups/MapFeaturePupup';
import { Sources } from './utils';

export const Layers = {
  _Points: 'Points',
  _ClusteredPoints: 'CLusteredPoints',
  _PointClusters: 'PointClusters',
  _Polygons: 'Polygons',
  _Lines: 'Lines'
};

export const AddLayers = (map: Map): void => {
  map.addLayer({
    id: Layers._Points,
    type: 'circle',
    source: Sources._Points,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': 6,
      'circle-color': '#135200'
    }
  });

  map.addLayer({
    id: Layers._ClusteredPoints,
    type: 'circle',
    source: Sources._Points,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#237804',
        50,
        '#389e0d',
        250,
        '#52c41a'
      ],
      'circle-radius': ['step', ['get', 'point_count'], 10, 50, 20, 250, 30]
    }
  });

  map.addLayer({
    id: Layers._PointClusters,
    type: 'symbol',
    source: Sources._Points,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    },
    paint: {
      'text-color': 'white'
    }
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
    source: Sources._Lines,
    paint: {
      'line-color': '#135200',
      'line-width': 3
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

  map.addLayer({
    id: Layers._Polygons,
    type: 'fill',
    source: Sources._Polygons,
    paint: {
      'fill-color': '#135200',
      'fill-opacity': 0.4
    }
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
};
