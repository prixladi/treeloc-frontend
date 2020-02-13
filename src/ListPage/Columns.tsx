import React from 'react';
import { WoodyPlantSortModel } from '../Services/Models';
import Column from 'antd/lib/table/Column';

type ColumnProps = {
  sort: WoodyPlantSortModel;
};

const getSortOrder = (key: string, sort: WoodyPlantSortModel) => {
  return sort.sortBy === key
    ? sort.ascending
      ? 'ascend'
      : 'descend'
    : undefined;
};

export const GetNameColumn = ({ sort }: ColumnProps) => (
  <Column
    sorter
    sortOrder={getSortOrder('LocalizedNames', sort)}
    title='Jméno'
    dataIndex='name'
    key='LocalizedNames'
  />
);

export const GetSpeciesColumn = ({ sort }: ColumnProps) => (
  <Column
    sorter
    sortOrder={getSortOrder('LocalizedSpecies', sort)}
    title='Druh'
    dataIndex='species'
    key='LocalizedSpecies'
  />
);

export const GetNoteColumn = ({ sort }: ColumnProps) => (
  <Column
    sorter
    sortOrder={getSortOrder('LocalizedNotes', sort)}
    title='Poznámka'
    dataIndex='note'
    key='LocalizedNotes'
  />
);
