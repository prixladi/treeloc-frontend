import React, { useState } from 'react';
import { Page } from '../Common';
import { useWoodyPlantsLoader } from '../Hooks';
import { Table } from 'antd';
import { PaginationConfig, SorterResult } from 'antd/lib/table';
import {
  WoodyPlantPreviewModel,
  SortBy,
  WoodyPlantFilterModel,
  WoodyPlantSortModel
} from '../Services/Models';
import Column from 'antd/lib/table/Column';
import { ResponsiveSearch } from './styled';

const initialFilter: WoodyPlantFilterModel = { skip: 0, take: 14 };
const initialSort: WoodyPlantSortModel = { ascending: true };

const ListPage: React.FC = () => {
  const [list, loadAsync] = useWoodyPlantsLoader(initialFilter, initialSort);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState(initialSort);
  const [loading, setLoading] = useState(false);

  const tryLoadAsync = async (
    filter: WoodyPlantFilterModel,
    sort: WoodyPlantSortModel
  ) => {
    setLoading(true);
    try {
      await loadAsync(filter, sort);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onTableChangeAsync = async (
    pagination: PaginationConfig,
    _: Partial<Record<keyof WoodyPlantPreviewModel, string[]>>,
    sorter: SorterResult<WoodyPlantPreviewModel>
  ) => {
    if (!pagination.current || !pagination.pageSize) return;

    const newSkip = (pagination.current - 1) * pagination.pageSize;

    const { skip, take, ...oldFilter } = filter;
    const newFilter = {
      skip: newSkip,
      take: pagination.pageSize,
      ...oldFilter
    };

    const sort: WoodyPlantSortModel = {
      ascending: sorter.order === 'ascend',
      sortBy: sorter.order && (sorter.columnKey as SortBy)
    };

    setPage(pagination.current);
    setFilter(newFilter);
    setSort(sort);

    await tryLoadAsync(newFilter, sort);
  };

  const onTextSearchChangeAsync = async (search: string) => {
    const { text, ...oldFilter } = filter;
    const newFilter = { text: search, ...oldFilter };

    const sort: WoodyPlantSortModel = {
      ascending: true
    };

    setSort(sort);
    setFilter(newFilter);

    await tryLoadAsync(newFilter, sort);
  };

  const pagination = {
    total: list?.totalCount,
    pageSize: 14,
    current: page,
    position: 'bottom'
  } as PaginationConfig;

  const getSortOrder = (key: string) => {
    return sort.sortBy === key
      ? sort.ascending
        ? 'ascend'
        : 'descend'
      : undefined;
  };

  const nameColumn = (
    <Column
      sorter
      sortOrder={getSortOrder('LocalizedNames')}
      title='Jméno'
      dataIndex='localizedNames.czech'
      key='LocalizedNames'
    />
  );

  const speciesColumn = (
    <Column
      sorter
      sortOrder={getSortOrder('LocalizedSpecies')}
      title='Druh'
      dataIndex='localizedSpecies.czech'
      key='LocalizedSpecies'
    />
  );

  const noteColumn = (
    <Column
      sorter
      sortOrder={getSortOrder('LocalizedNotes')}
      title='Poznámka'
      dataIndex='localizedNotes.czech'
      key='LocalizedNotes'
    />
  );

  return (
    <Page title='Seznam dřevin'>
      <ResponsiveSearch
        placeholder='Vyhledávat v textu'
        onSearch={onTextSearchChangeAsync}
        className='textSearch'
        enterButton
        loading={loading}
      />
      <Table
        pagination={pagination}
        dataSource={list?.woodyPlants}
        onChange={onTableChangeAsync}
        style={{ margin: '0.5em' }}
        rowKey='id'
        bordered
        loading={loading}
        expandedRowRender={(x: any) => <div />}
      >
        {nameColumn}
        {speciesColumn}
        {noteColumn}
      </Table>
    </Page>
  );
};

export default ListPage;
