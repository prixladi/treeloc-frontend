import React, { useState } from 'react';
import { Page } from '../Common';
import { useWoodyPlantsLoader } from '../Hooks/WoodyPlantsLoader';
import { Table } from 'antd';
import { PaginationConfig, SorterResult } from 'antd/lib/table';
import {
  SortBy,
  WoodyPlantFilterModel,
  WoodyPlantSortModel,
} from '../Services/Models';
import {
  transformTableData,
  TableData,
  tryLoadAsync,
  getPagination,
} from './utils';
import {
  GetNameColumn,
  GetSpeciesColumn,
  GetNoteColumn,
  GetActionsColumn,
} from './Columns';
import { ListSearch } from './ListSearch';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const pageSize: number = 14;
const initialFilter: WoodyPlantFilterModel = { skip: 0, take: pageSize };
const initialSort: WoodyPlantSortModel = { ascending: true };

const ListPage = (props: RouteComponentProps) => {
  const [list, loadAsync] = useWoodyPlantsLoader(initialFilter, initialSort);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState(initialSort);
  const [loading, setLoading] = useState(false);

  const onTableChangeAsync = async (
    pagination: PaginationConfig,
    _: Partial<Record<keyof TableData, string[]>>,
    sorter: SorterResult<TableData>
  ) => {
    if (!pagination.current || !pagination.pageSize) return;

    const newSkip = (pagination.current - 1) * pagination.pageSize;

    const { skip, take, ...oldFilter } = filter;
    const newFilter = {
      skip: newSkip,
      take: pagination.pageSize,
      ...oldFilter,
    };

    const sort: WoodyPlantSortModel = {
      ascending: sorter.order === 'ascend',
      sortBy: sorter.order && (sorter.columnKey as SortBy),
    };

    setPage(pagination.current);
    setFilter(newFilter);
    setSort(sort);

    await tryLoadAsync(newFilter, sort, setLoading, loadAsync);
  };

  const onTextSearchChangeAsync = async (search: string) => {
    const { text, skip, ...oldFilter } = filter;
    const newFilter = { text: search, skip: 0, ...oldFilter };

    const sort: WoodyPlantSortModel = {
      ascending: true,
    };

    setSort(sort);
    setFilter(newFilter);
    setPage(1);

    await tryLoadAsync(newFilter, sort, setLoading, loadAsync);
  };

  return (
    <Page title='Seznam dřevin'>
      <ListSearch
        loading={loading}
        onTextSearchChangeAsync={onTextSearchChangeAsync}
      />
      <Table
        pagination={getPagination(pageSize, page, list?.totalCount)}
        dataSource={transformTableData(list?.woodyPlants)}
        onChange={onTableChangeAsync}
        style={{ margin: '0.5em' }}
        rowKey='id'
        bordered
        loading={loading}
      >
        {GetNameColumn({ sort })}
        {GetSpeciesColumn({ sort })}
        {GetNoteColumn({ sort })}
        {GetActionsColumn(props)}
      </Table>
    </Page>
  );
};

export default withRouter(ListPage);
