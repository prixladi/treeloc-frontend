import React, { useState } from 'react';

import { useWoodyPlantsLoader } from '../Hooks/WoodyPlantsLoader';
import { Table } from 'antd';
import { PaginationConfig, SorterResult } from 'antd/lib/table';
import * as Models from '../Services/Models';
import * as Utils from './utils';
import * as Columns from './Columns';
import { ListSearch } from './ListSearch';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useTitle } from '../Hooks/UseTitle';

const pageSize: number = 14;
const initialFilter: Models.WoodyPlantFilterModel = { skip: 0, take: pageSize };
const initialSort: Models.WoodyPlantSortModel = { ascending: true };

const ListPage = (props: RouteComponentProps) => {
  const [list, loadAsync] = useWoodyPlantsLoader(initialFilter, initialSort);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState(initialSort);
  const [loading, setLoading] = useState(false);
  useTitle('TreeLoc | Seznam dřevin');

  const buildState = () => ({
    loadAsync,
    setPage,
    setFilter,
    setSort,
    setLoading,
  });

  const onTableChangeAsync = async (
    pagination: PaginationConfig,
    _: Partial<Record<keyof Utils.TableData, string[]>>,
    sorter: SorterResult<Utils.TableData>
  ) => {
    Utils.onTableChangeAsync(pagination, sorter, filter, buildState());
  };

  const onTextSearchChangeAsync = async (search: string) => {
    Utils.onTextSearchChangeAsync(search, filter, buildState());
  };

  return (
    <>
      <ListSearch
        loading={loading}
        onTextSearchChangeAsync={onTextSearchChangeAsync}
      />
      <Table
        pagination={Utils.getPagination(pageSize, page, list?.totalCount)}
        dataSource={Utils.transformTableData(list?.woodyPlants)}
        onChange={onTableChangeAsync}
        style={{ margin: '0.5em' }}
        rowKey='id'
        bordered
        loading={loading}
      >
        {Columns.getNameColumn({ sort })}
        {Columns.getSpeciesColumn({ sort })}
        {Columns.getNoteColumn({ sort })}
        {Columns.getActionsColumn(props)}
      </Table>
    </>
  );
};

export default withRouter(ListPage);
