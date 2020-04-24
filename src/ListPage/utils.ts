import { WoodyPlantPreviewModel, WoodyPlantFilterModel, WoodyPlantSortModel } from '../Services/Models';
import { Dispatch, SetStateAction } from 'react';
import { PaginationConfig } from 'antd/lib/table';

export type TableData = {
  id: string;
  name: string;
  species: string;
  note: string;
};

export const transformTableData = (
  woodyPlants: WoodyPlantPreviewModel[] | undefined
): TableData[] | undefined => {
  return woodyPlants?.map(woodyPlant => ({
    id: woodyPlant.id,
    name: woodyPlant.localizedNames.czech ?? 'Nevyplněno',
    species: woodyPlant.localizedSpecies.czech ?? 'Nevyplněno',
    note: woodyPlant.localizedNotes.czech ?? 'Nevyplněno',
    location: woodyPlant.location
  }));
};

export const tryLoadAsync = async (
  filter: WoodyPlantFilterModel,
  sort: WoodyPlantSortModel,
  setLoading: Dispatch<SetStateAction<boolean>>,
  loadAsync: (flter: WoodyPlantFilterModel, sort?: WoodyPlantSortModel) => Promise<void>
) => {
  setLoading(true);
  try {
    await loadAsync(filter, sort);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getPagination = (pageSize: number, page: number, totalCount?: number) => ({
  total: totalCount,
  pageSize: pageSize,
  current: page,
  position: 'bottom'
} as PaginationConfig);