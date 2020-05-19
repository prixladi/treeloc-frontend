import React from 'react';
import {
  WoodyPlantSortModel,
  WoodyPlantPreviewModel,
} from '../Services/Models';
import Column from 'antd/lib/table/Column';
import { Button } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { _Map } from '../Routes';

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

export const getNameColumn = ({ sort }: ColumnProps) => (
  <Column
    sorter
    sortOrder={getSortOrder('LocalizedNames', sort)}
    title='Název'
    dataIndex='name'
    key='LocalizedNames'
  />
);

export const getSpeciesColumn = ({ sort }: ColumnProps) => (
  <Column
    sorter
    sortOrder={getSortOrder('LocalizedSpecies', sort)}
    title='Druh'
    dataIndex='species'
    key='LocalizedSpecies'
  />
);

export const getNoteColumn = ({ sort }: ColumnProps) => (
  <Column
    sorter
    sortOrder={getSortOrder('LocalizedNotes', sort)}
    title='Poznámka'
    dataIndex='note'
    key='LocalizedNotes'
  />
);

export const getActionsColumn = ({ history }: RouteComponentProps) => (
  <Column
    title='Akce'
    key='actions'
    render={(model: WoodyPlantPreviewModel) => {
      if (model.location?.geometry)
        return (
          <>
            <Button
              onClick={() =>
                history.push(`${_Map}?searchedPlantId=${model.id}`)
              }
              icon='search'
            >
              Zobrazit v mapě
            </Button>
          </>
        );
    }}
  />
);
