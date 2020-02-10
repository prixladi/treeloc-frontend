import React from "react";
import { Page } from "../Common";
import { useWoodyPlantsLoader } from "../Hooks";
import { Table } from 'antd';

const columns = [
  { title: 'Jméno', dataIndex: 'localizedNames.czech', key: 'name' },
  { title: 'Druh', dataIndex: 'localizedSpecies.czech', key: 'species' },
  { title: 'Poznámka', dataIndex: 'localizedNames.czech', key: 'note' },
];

const ListPage: React.FC = () => {
  var [list] = useWoodyPlantsLoader({ skip: 0, take: 50 }, { ascending: true});
  
  if(!list)
    return <div />;
    
return <Page title="Seznam dřevin"><Table columns={columns} dataSource={list.woodyPlants}></Table></Page>;
};

export default ListPage;
