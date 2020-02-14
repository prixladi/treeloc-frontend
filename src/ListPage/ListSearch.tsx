import React from 'react';
import { ResponsiveSearch } from './styled';

type Props = {
  loading: boolean;
  onTextSearchChangeAsync: (search: string) => Promise<void>;
};

const ListSearch = ({ loading, onTextSearchChangeAsync }: Props) => (
  <ResponsiveSearch
    placeholder='Vyhledávat v textu'
    onSearch={onTextSearchChangeAsync}
    className='textSearch'
    enterButton
    loading={loading}
  />
);

export { ListSearch };
