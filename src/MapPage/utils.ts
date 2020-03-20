import {
  WoodyPlantListModel,
  WoodyPlantPreviewModel
} from '../Services/Models';

import L from 'leaflet';
import 'leaflet.markercluster';
import 'Leaflet.Deflate';
import { deflate } from './deflateUtils';
import { treeIcon } from '../Common/MapConstants';
import { buildDescription } from '../Popups/FeatureDescritionBuilder';

export const Sources = {
  _Points: 'points',
  _Lines: 'lines',
  _Polygons: 'polygons'
};

const getPointFeaturesFromList = (
  list: WoodyPlantListModel | null,
  currentCoords: [number, number]
): GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] => {
  if (!list) return [];

  const filtered = list.woodyPlants.filter(
    (plant: WoodyPlantPreviewModel) =>
      plant.location &&
      plant.location?.geometry &&
      (plant.location?.geometry.type === 'Point' ||
        plant.location?.geometry.type === 'MultiPoint')
  );

  return filtered.map(plant => ({
    type: 'Feature',
    geometry: plant.location?.geometry as GeoJSON.Geometry,
    properties: {
      name: plant.localizedNames.czech,
      species: plant.localizedSpecies.czech,
      note: plant.localizedNotes.czech,
      imgUrls: plant.imageUrls,
      currentCoords: currentCoords,
      coords: (plant.location?.geometry as GeoJSON.Point).coordinates
    }
  }));
};

const getLineFeaturesFromList = (
  list: WoodyPlantListModel | null,
  currentCoords: [number, number]
): GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] => {
  if (!list) return [];

  const filtered = list.woodyPlants.filter(
    (plant: WoodyPlantPreviewModel) =>
      plant.location &&
      plant.location?.geometry &&
      (plant.location?.geometry.type === 'LineString' ||
        plant.location?.geometry.type === 'MultiLineString')
  );

  return filtered.map(plant => ({
    type: 'Feature',
    geometry: plant.location?.geometry as GeoJSON.Geometry,
    properties: {
      name: plant.localizedNames.czech,
      species: plant.localizedSpecies.czech,
      note: plant.localizedNotes.czech,
      imgUrls: plant.imageUrls,
      currentCoords: currentCoords
    }
  }));
};

const getPolygonFeaturesFromList = (
  list: WoodyPlantListModel | null,
  currentCoords: [number, number]
): GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] => {
  if (!list) return [];

  const filtered = list.woodyPlants.filter(
    (plant: WoodyPlantPreviewModel) =>
      plant.location &&
      plant.location?.geometry &&
      (plant.location?.geometry.type === 'Polygon' ||
        plant.location?.geometry.type === 'MultiPolygon')
  );

  return filtered.map(plant => ({
    type: 'Feature',
    geometry: plant.location?.geometry as GeoJSON.Geometry,
    properties: {
      name: plant.localizedNames.czech,
      species: plant.localizedSpecies.czech,
      note: plant.localizedNotes.czech,
      imgUrls: plant.imageUrls,
      currentCoords: currentCoords
    }
  }));
};

let pointLayer: L.Layer | null = null;
let lineLayer: L.Layer | null = null;
let polygonLayer: L.Layer | null = null;
let deflated: any | null = null;

export const setData = (
  map: L.Map,
  list: WoodyPlantListModel | null,
  currentCoords: [number, number]
) => {
  if (!list) return;

  const pointData = {
    type: 'FeatureCollection',
    features: getPointFeaturesFromList(list, currentCoords)
  } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

  const lineData = {
    type: 'FeatureCollection',
    features: getLineFeaturesFromList(list, currentCoords)
  } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

  const polygonData = {
    type: 'FeatureCollection',
    features: getPolygonFeaturesFromList(list, currentCoords)
  } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

  if (pointLayer) pointLayer.remove();
  if (lineLayer) lineLayer.remove();
  if (polygonLayer) polygonLayer.remove();
  if (deflated) deflated.remove();

  const onEachFeature = (
    feature: GeoJSON.Feature<GeoJSON.Geometry, any>,
    layer: L.Layer
  ) => {
    if (feature.properties) {
      layer.bindPopup(
        buildDescription({
          name: feature.properties.name,
          species: feature.properties.species,
          note: feature.properties.note,
          imgUrls: feature.properties.imgUrls,
          currentCoords: feature.properties.currentCoords,
          coords: feature.properties.coords
        })
      );
    }
  };

  pointLayer = L.geoJSON(pointData, {
    pointToLayer: (_, yx) => {
      const marker = new L.Marker(yx, {
        icon: treeIcon
      });
      return marker;
    },
    onEachFeature: onEachFeature
  });

  lineLayer = L.geoJSON(lineData, {
    style: { color: '#135200' },
    onEachFeature: onEachFeature
  });

  polygonLayer = L.geoJSON(polygonData, {
    style: { color: '#135200' },
    onEachFeature: onEachFeature
  });

  deflated = deflate();

  if (pointData.features.length > 0) pointLayer.addTo(deflated);
  if (lineData.features.length > 0) lineLayer.addTo(deflated);
  if (polygonData.features.length > 0) polygonLayer.addTo(deflated);

  deflated.addTo(map);
};
