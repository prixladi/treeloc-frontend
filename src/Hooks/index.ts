import {
  WoodyPlantFilterModel,
  WoodyPlantListModel,
  WoodyPlantSortModel
} from '../Services/Models';
import { useState, useEffect } from 'react';
import { getWoodyPlantsByFilterAsync } from '../Services/WoodyPlantsService';

export const useWoodyPlantsLoader = (
  initialFilter: WoodyPlantFilterModel,
  initialSort: WoodyPlantSortModel
): [
  WoodyPlantListModel | null,
  (flter: WoodyPlantFilterModel, sort: WoodyPlantSortModel) => void
] => {
  var [list, setList] = useState(null as WoodyPlantListModel | null);

  const fetchPlantsAsync = async (
    filter: WoodyPlantFilterModel,
    sort: WoodyPlantSortModel
  ) => {
    setList(await getWoodyPlantsByFilterAsync(filter, sort));
  };

  useEffect(() => {
    fetchPlantsAsync(initialFilter, initialSort);
  });

  return [list, fetchPlantsAsync];
};
