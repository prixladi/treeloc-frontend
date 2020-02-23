import { WoodyPlantListModel } from '../Services/Models';
import { useState, useEffect } from 'react';
import { getWoodyPlantsByFilterAsync } from '../Services/WoodyPlantsService';
import { FindWoodyPlantsControl } from '../MapControls/FindWoodyPlantsControl';
import L from 'leaflet';

const control = new FindWoodyPlantsControl();

export const useWoodyPlantsMapControl = (map: L.Map, coords: [number, number]) => {
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
          point: { longitude: coords[1], latitude: coords[0] },
          distance: 100/6378.1
        },
        { ascending: true }
      )
    );
  };

  useEffect(() => {
    map.addControl(control);
  }, [map])

  useEffect(() => {
    control.onClickCallback = () => {
      loadAsync(0, 100, coords);
    };
    // eslint-disable-next-line
  }, [coords]);

  return list;
};
