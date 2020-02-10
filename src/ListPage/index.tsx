import React, { useState } from 'react';
import { Page } from '../Common';
import { useWoodyPlantsLoader } from '../Hooks';
import { Table } from 'antd';
import { PaginationConfig, SorterResult } from 'antd/lib/table';
import { WoodyPlantPreviewModel, SortBy } from '../Services/Models';
import Column from 'antd/lib/table/Column';

const initialFilter = { skip: 0, take: 10 };
const initialSort = { ascending: true };

const ListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [list, loadByFilter] = useWoodyPlantsLoader(initialFilter, initialSort);

  if (!list) return <div />;

  const onChangeAsync = async (
    pagination: PaginationConfig,
    filter: Partial<Record<keyof WoodyPlantPreviewModel, string[]>>,
    sorter: SorterResult<WoodyPlantPreviewModel>
  ) => {
    if (!pagination.current || !pagination.pageSize) return;

    const skip = (pagination.current - 1) * pagination.pageSize;

    setPage(pagination.current);

    await loadByFilter(
      { skip: skip, take: pagination.pageSize },
      {
        ascending: sorter.order === 'ascend',
        sortBy: sorter.columnKey as SortBy
      }
    );
  };

  const pagination = {
    total: list.totalCount,
    defaultCurrent: 1,
    pageSize: 10,
    current: page
  } as PaginationConfig;

  return (
    <Page title='Seznam dřevin'>
      <Table
        pagination={pagination}
        dataSource={list.woodyPlants}
        onChange={onChangeAsync}
      >
        <Column
          sorter
          title='Jméno'
          dataIndex='localizedNames.czech'
          key='LocalizedNames'
        />
        <Column
          sorter
          filterDropdown
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
