import {
  WoodyPlantListModel,
  WoodyPlantPreviewModel
} from '../Services/Models';

import { Map, GeoJSONSource } from 'mapbox-gl';

export const setData = (map: Map, list: WoodyPlantListModel | null) => {
  const data = {
    type: 'FeatureCollection',
    features: getFeaturesFromList(list)
  } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

  const source = map.getSource('data') as GeoJSONSource;

  if (source) source.setData(data);
  else {
    map.addSource('data', ({
      type: 'geojson',
      data: data
    } as unknown) as GeoJSONSource);
  }
};

export const getFeaturesFromList = (
  list: WoodyPlantListModel | null
): GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] => {
  if (!list) return [];

  const filtered = list.woodyPlants.filter(
    (plant: WoodyPlantPreviewModel) =>
      plant.location && plant.location?.geometry
  );

  return filtered.map(plant => ({
    type: 'Feature',
    geometry: plant.location?.geometry as GeoJSON.Geometry,
    properties: {}
  }));
};
