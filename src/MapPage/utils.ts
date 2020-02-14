import {
  WoodyPlantListModel,
  WoodyPlantPreviewModel
} from '../Services/Models';

import { Map, GeoJSONSource } from 'mapbox-gl';

export const Sources = {
  _Points: 'points',
  _Lines: 'lines',
  _Polygons: 'polygons'
};

const getPointFeaturesFromList = (
  list: WoodyPlantListModel | null
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
      imgUrl: plant.imageUrl
    }
  }));
};

const getLineFeaturesFromList = (
  list: WoodyPlantListModel | null
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
      imgUrl: plant.imageUrl
    }
  }));
};

const getPolygonFeaturesFromList = (
  list: WoodyPlantListModel | null
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
      imgUrl: plant.imageUrl
    }
  }));
};

export const setData = (map: Map, list: WoodyPlantListModel | null) => {
  const pointData = {
    type: 'FeatureCollection',
    features: getPointFeaturesFromList(list)
  } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

  const lineData = {
    type: 'FeatureCollection',
    features: getLineFeaturesFromList(list)
  } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

  const polygonData = {
    type: 'FeatureCollection',
    features: getPolygonFeaturesFromList(list)
  } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

  const pointSource = map.getSource(Sources._Points) as GeoJSONSource;
  const lineSource = map.getSource(Sources._Lines) as GeoJSONSource;
  const polygonSource = map.getSource(Sources._Polygons) as GeoJSONSource;

  if (pointSource) pointSource.setData(pointData);
  else {
    map.addSource(Sources._Points, ({
      type: 'geojson',
      data: pointData,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    } as unknown) as GeoJSONSource);
  }

  if (lineSource) lineSource.setData(lineData);
  else {
    map.addSource(Sources._Lines, ({
      type: 'geojson',
      data: lineData
    } as unknown) as GeoJSONSource);
  }

  if (polygonSource) polygonSource.setData(polygonData);
  else {
    map.addSource(Sources._Polygons, ({
      type: 'geojson',
      data: polygonData
    } as unknown) as GeoJSONSource);
  }
};
