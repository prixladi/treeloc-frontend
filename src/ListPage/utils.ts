import * as Models from '../Services/Models';
import { Dispatch, SetStateAction } from 'react';
import { PaginationConfig, SorterResult } from 'antd/lib/table';

export type TableData = {
  id: string;
  name: string;
  species: string;
  note: string;
};

type ListState = {
  loadAsync: (
    flter: Models.WoodyPlantFilterModel,
    sort?: Models.WoodyPlantSortModel
  ) => Promise<void>;
  setPage: Dispatch<SetStateAction<number>>;
  setFilter: Dispatch<SetStateAction<Models.WoodyPlantFilterModel>>;
  setSort: Dispatch<SetStateAction<Models.WoodyPlantSortModel>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const transformTableData = (
  woodyPlants: Models.WoodyPlantPreviewModel[] | undefined
): TableData[] | undefined => {
  return woodyPlants?.map((woodyPlant) => ({
    id: woodyPlant.id,
    name: woodyPlant.localizedNames.czech ?? 'Nevyplněno',
    species: woodyPlant.localizedSpecies.czech ?? 'Nevyplněno',
    note: woodyPlant.localizedNotes.czech ?? 'Nevyplněno',
    location: woodyPlant.location,
  }));
};

const tryLoadAsync = async (
  filter: Models.WoodyPlantFilterModel,
  sort: Models.WoodyPlantSortModel,
  setLoading: Dispatch<SetStateAction<boolean>>,
  loadAsync: (
    flter: Models.WoodyPlantFilterModel,
    sort?: Models.WoodyPlantSortModel
  ) => Promise<void>
) => {
  setLoading(true);
  try {
    await loadAsync(filter, sort);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

const getPagination = (pageSize: number, page: number, totalCount?: number) =>
  ({
    total: totalCount,
    pageSize: pageSize,
    current: page,
    position: 'bottom',
  } as PaginationConfig);

const onTableChangeAsync = async (
  pagination: PaginationConfig,
  sorter: SorterResult<TableData>,
  filter: Models.WoodyPlantFilterModel,
  state: ListState
) => {
  if (!pagination.current || !pagination.pageSize) return;

  const newSkip = (pagination.current - 1) * pagination.pageSize;
  const { skip, take, ...oldFilter } = filter;
  const newFilter = {
    skip: newSkip,
    take: pagination.pageSize,
    ...oldFilter,
  };

  const sort: Models.WoodyPlantSortModel = {
    ascending: sorter.order === 'ascend',
    sortBy: sorter.order && (sorter.columnKey as Models.SortBy),
  };

  state.setPage(pagination.current);
  state.setFilter(newFilter);
  state.setSort(sort);

  await tryLoadAsync(newFilter, sort, state.setLoading, state.loadAsync);
};

const onTextSearchChangeAsync = async (
  search: string,
  filter: Models.WoodyPlantFilterModel,
  state: ListState
) => {
  const { text, skip, ...oldFilter } = filter;
  const newFilter = { text: search, skip: 0, ...oldFilter };
  const sort = { ascending: true };

  state.setSort(sort);
  state.setFilter(newFilter);
  state.setPage(1);

  await tryLoadAsync(newFilter, sort, state.setLoading, state.loadAsync);
};

export {
  onTableChangeAsync,
  onTextSearchChangeAsync,
  getPagination,
  transformTableData,
};
