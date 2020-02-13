import {
  WoodyPlantFilterModel,
  WoodyPlantListModel,
  WoodyPlantSortModel
} from '../Services/Models';
import { useState, useEffect } from 'react';
import { getWoodyPlantsByFilterAsync } from '../Services/WoodyPlantsService';

export const useWoodyPlantsLoader = (
  initialFilter: WoodyPlantFilterModel,
  initialSort?: WoodyPlantSortModel
): [
  WoodyPlantListModel | null,
  (flter: WoodyPlantFilterModel, sort?: WoodyPlantSortModel) => Promise<void>
] => {
  var [list, setList] = useState(null as WoodyPlantListModel | null);

  const loadAsync = async (
    filter: WoodyPlantFilterModel,
    sort?: WoodyPlantSortModel
  ): Promise<void> => {
    setList(await getWoodyPlantsByFilterAsync(filter, sort));
  };

  useEffect(() => {
    loadAsync(initialFilter, initialSort);
  }, [initialFilter, initialSort]);

  return [list, loadAsync];
};
