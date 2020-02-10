import {
  WoodyPlantFilterModel,
  WoodyPlantListModel,
  WoodyPlantSortModel
} from './Models';
import { getAsync } from '../Api';
import { _WoodyPlantsList } from '../Api/Routes';
import { buildQuery } from './Utils';

export const getWoodyPlantsByFilterAsync = async (
  filter: WoodyPlantFilterModel,
  sort: WoodyPlantSortModel
): Promise<WoodyPlantListModel> => {
  var model = await getAsync({
    url: `${_WoodyPlantsList}?${buildQuery(filter, sort)}`
  });
  return await model.json();
};
