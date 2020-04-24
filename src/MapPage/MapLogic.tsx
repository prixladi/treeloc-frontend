import React, { useEffect, useState } from 'react';
import { useUserMapMarker } from '../Hooks/UserMapMarker';
import { geolocated, GeolocatedProps } from 'react-geolocated';
import L from 'leaflet';
import { useWoodyPlantsMapControl } from '../Hooks/WoodyPlantsMapControl';
import { setData } from './utils';
import { Modal } from 'antd';
import { FindPlantsCard } from './FindPlantsCard';
import { useSignalR } from '../Hooks/UseSignalR';
import { WoodyPlantDetailModel } from '../Services/Models';
import { GetFirstPositionFromPlant } from '../Common/Helpers';

interface Props extends GeolocatedProps {
  map: L.Map;
  searchedPlant?: WoodyPlantDetailModel;
}

const MapLogic = ({ map, coords, searchedPlant }: Props) => {
  const [load, setLoad] = useState(!searchedPlant);
  const [currentCoords, setMarkerCoords] = useUserMapMarker(map);
  const [distance, setDistance] = useState(null as number | null);
  const [count, setCount] = useState(8000);
  const version = useSignalR();
  const [data, setControlOpen, loadAsync] = useWoodyPlantsMapControl(
    map,
    currentCoords
  );

  useEffect(() => {
    if (searchedPlant) {
      const pos = GetFirstPositionFromPlant(searchedPlant);
      if (pos) {
        map.flyTo([pos[1], pos[0]], 11);
      }
      setData(
        map,
        { woodyPlants: [searchedPlant], totalCount: 1 },
        currentCoords
      );
    }
  // eslint-disable-next-line
  }, [searchedPlant, map, coords]);

  useEffect(() => {
    if (load) setControlOpen(true);
    if (!coords) return;

    const currentCoords: [number, number] = [coords.latitude, coords.longitude];
    setMarkerCoords(currentCoords);
    // eslint-disable-next-line
  }, [coords]);

  useEffect(() => {
    if (!load) return;

    if (data.list && data.list.version !== version) {
      if (distance) loadAsync(count, currentCoords, distance / 6378);
      else loadAsync(count, currentCoords);
    }
    // eslint-disable-next-line
  }, [version]);

  useEffect(() => {
    setData(map, data.list, currentCoords);
    // eslint-disable-next-line
  }, [map, data.list]);

  return (
    <Modal
      confirmLoading={data.loading}
      visible={data.controlOpen}
      onCancel={() => setControlOpen(false)}
      onOk={async () => {
        setLoad(true);

        if (distance) await loadAsync(count, currentCoords, distance / 6378);
        else await loadAsync(count, currentCoords);

        setControlOpen(false);
      }}
    >
      <FindPlantsCard
        distance={distance}
        setDistance={setDistance}
        count={count}
        setCount={setCount}
      />
    </Modal>
  );
};

export const GeolocatedLogic = geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
})(MapLogic);

export const PlainLogic = MapLogic;
