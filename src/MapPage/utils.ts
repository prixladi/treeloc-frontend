import {
  WoodyPlantListModel,
  WoodyPlantPreviewModel
} from '../Services/Models';

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
