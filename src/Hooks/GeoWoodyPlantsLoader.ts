import { WoodyPlantListModel } from '../Services/Models';
import { useState } from 'react';
import { getWoodyPlantsByFilterAsync } from '../Services/WoodyPlantsService';

export const useGeoWoodyPlantsLoader = (): [
  WoodyPlantListModel | null,
  (skip: number, take: number, coords: [number, number]) => Promise<void>
] => {
  var [list, setList] = useState(null as WoodyPlantListModel | null);

  const loadAsync = async (
    skip: number,
    take: number,
    coords: [number, number]
  ): Promise<void> => {
    setList(
      await getWoodyPlantsByFilterAsync(
        {
          skip: skip,
          take: take,
          point: { longitude: coords[0], latitude: coords[1] }
        },
        { ascending: true }
      )
    );
  };

  return [list, loadAsync];
};
