import { WoodyPlantFilterModel, WoodyPlantSortModel } from './Models';

export const buildQuery = (
  filter: WoodyPlantFilterModel,
  sort?: WoodyPlantSortModel
): string => {
  let query = `Skip=${filter.skip}&Take=${filter.take}`;

  if (filter.text) query += `&Text=${filter.text}`;

  if (filter.distance) query += `&Distance=${filter.distance / 6378}`;

  if (filter.point)
    query += `&Point.Latitude=${filter.point.latitude}&Point.Longitude=${filter.point.longitude}`;

  if(sort && sort.sortBy)
    query += `&SortBy=${sort.sortBy}&Ascending=${sort.ascending}`

  return query;
};
