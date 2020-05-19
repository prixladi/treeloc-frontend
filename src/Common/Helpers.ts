import { WoodyPlantPreviewModel } from '../Services/Models';

export const isObjectId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

export const getFirstPositionFromPlant = (
  model: WoodyPlantPreviewModel
): GeoJSON.Position | null => {
  switch (model.location?.geometry?.type) {
    case 'Point':
      return (model.location?.geometry as GeoJSON.Point).coordinates;
    case 'MultiPoint':
      return (model.location?.geometry as GeoJSON.MultiPoint).coordinates[0];
    case 'LineString':
      return (model.location?.geometry as GeoJSON.LineString).coordinates[0];
    case 'MultiLineString':
      return (model.location?.geometry as GeoJSON.MultiLineString)
        .coordinates[0][0];
    case 'Polygon':
      return (model.location?.geometry as GeoJSON.Polygon).coordinates[0][0];
    case 'MultiPolygon':
      return (model.location?.geometry as GeoJSON.MultiPolygon)
        .coordinates[0][0][0];
    default:
      return null;
  }
};
