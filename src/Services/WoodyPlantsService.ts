import {
  WoodyPlantFilterModel,
  WoodyPlantListModel,
  WoodyPlantSortModel,
  WoodyPlantDetailModel,
} from './Models';
import { getAsync } from '../Api';
import { _WoodyPlantsList, _WoodyPlantDetail } from '../Api/Routes';
import { buildQuery } from './Utils';
import { notification } from 'antd';

export const getWoodyPlantByIdAsync = async (
  id: string
): Promise<WoodyPlantDetailModel | null> => {
  try {
    var response = await getAsync({
      url: `${_WoodyPlantDetail(id)}`,
    });

    if (response.ok) return await response.json();

    if (response.status !== 404) NotifyApiError();
    const responseText = await response.text();
    console.log(responseText);
    return null;
  } catch (error) {
    NotifyApiError();
    return null;
  }
};

export const getWoodyPlantsByFilterAsync = async (
  filter: WoodyPlantFilterModel,
  sort?: WoodyPlantSortModel
): Promise<WoodyPlantListModel | null> => {
  try {
    var response = await getAsync({
      url: `${_WoodyPlantsList}?${buildQuery(filter, sort)}`,
    });

    if (response.ok) return await response.json();

    NotifyApiError();
    const responseText = await response.text();
    console.log(responseText);
    return null;
  } catch (error) {
    NotifyApiError();
    return null;
  }
};

const NotifyApiError = () => {
  notification['error']({
    message: 'Chyba komunikace se serverem',
    description:
      'Při komunikaci se serverem došlo k chybě, opakujte požadavek později prosím.',
  });
};
