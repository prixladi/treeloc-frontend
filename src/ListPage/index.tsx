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
import './index.css';
import { ResponsiveSearch } from './styled';

const initialFilter: WoodyPlantFilterModel = { skip: 0, take: 15 };
const initialSort: WoodyPlantSortModel = { ascending: true };

const ListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [list, loadAsync] = useWoodyPlantsLoader(initialFilter, initialSort);
  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState(initialSort);
  const [loading, setLoading] = useState(false);


  const tryLoadAsync = async (filter: WoodyPlantFilterModel, sort: WoodyPlantSortModel) => {
    setLoading(true);
    try {
      await loadAsync(filter, sort);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

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

    const sort = {
      ascending: sorter.order === 'ascend',
      sortBy: sorter.columnKey as SortBy
    };

    setPage(pagination.current);
    setFilter(filter);
    setSort(sort);

    await tryLoadAsync(newFilter, sort);
  };

  const onTextSearchChangeAsync = async (search: string) => {
    const { text, ...oldFilter } = filter;
    const newFilter = { text: search, ...oldFilter };
    setFilter(newFilter);
    await tryLoadAsync(newFilter, sort);
  };

  const pagination = {
    total: list?.totalCount,
    pageSize: 14,
    current: page,
    position: 'bottom'
  } as PaginationConfig;

  return (
    <Page title='Seznam dřevin'>
      <ResponsiveSearch
        placeholder='Vyhledávat v textu'
        onSearch={onTextSearchChangeAsync}
        className='textSearch'
        enterButton
        disabled={loading}
      />
      <Table
        pagination={pagination}
        dataSource={list?.woodyPlants}
        onChange={onTableChangeAsync}
        style={{ margin: '0.3em' }}
        bordered
      >
        <Column
          sorter
          title='Jméno'
          dataIndex='localizedNames.czech'
          key='LocalizedNames'
        />
        <Column
          sorter
          title='Druh'
          dataIndex='localizedSpecies.czech'
          key='LocalizedSpecies'
        />
        <Column
          sorter
          title='Poznámka'
          dataIndex='localizedNotes.czech'
          key='LocalizedNotes'
        />
      </Table>
    </Page>
  );
};

export default ListPage;
