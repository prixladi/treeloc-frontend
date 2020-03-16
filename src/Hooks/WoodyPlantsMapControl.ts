import { WoodyPlantListModel } from '../Services/Models';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { getWoodyPlantsByFilterAsync } from '../Services/WoodyPlantsService';
import { FindWoodyPlantsControl } from '../MapControls/FindWoodyPlantsControl';
import L from 'leaflet';

const control = new FindWoodyPlantsControl();

export type WoodyPlantsData = {
  list: WoodyPlantListModel | null;
  loading: boolean;
  controlOpen: boolean;
};

export const useWoodyPlantsMapControl = (
  map: L.Map,
  coords: [number, number]
): [
  WoodyPlantsData,
  Dispatch<SetStateAction<boolean>>,
  (take: number, coods: [number, number], distance?: number) => Promise<void>
] => {
  const [list, setList] = useState(null as WoodyPlantListModel | null);
  const [loading, setLoading] = useState(false);
  const [controlOpen, setControlOpen] = useState(false);

  const loadAsync = async (
    take: number,
    coords: [number, number],
    distance?: number
  ): Promise<void> => {
    setLoading(true);
    try {
      const plants = await getWoodyPlantsByFilterAsync(
        {
          skip: 0,
          take,
          point: { longitude: coords[1], latitude: coords[0] },
          distance
        },
        { ascending: true }
      );

      setList(plants);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    map.addControl(control);
  }, [map]);

  useEffect(() => {
    control.onClickCallback = () => {
      setControlOpen(true);
    };
    // eslint-disable-next-line
  }, [coords]);

  return [
    {
      list,
      loading,
      controlOpen
    },
    setControlOpen,
    loadAsync
  ];
};
