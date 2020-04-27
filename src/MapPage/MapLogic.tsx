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
    if (!searchedPlant) return;

    const pos = GetFirstPositionFromPlant(searchedPlant);
    if (pos) {
      map.panTo([pos[1], pos[0]]);
      if (distance) loadAsync(count, [pos[1], pos[0]], distance / 6378);
      else loadAsync(count, [pos[1], pos[0]]);
    }

    // eslint-disable-next-line
  }, [searchedPlant, map]);

  useEffect(() => {
    if (!coords) return;

    const currentCoords: [number, number] = [coords.latitude, coords.longitude];
    setMarkerCoords(currentCoords);

    if (load) {
      if (distance) loadAsync(count, currentCoords, distance / 6378);
      else loadAsync(count, currentCoords);
    }

    // eslint-disable-next-line
  }, [coords]);

  useEffect(() => {
    if (load) {
      if (data.list && data.list.version !== version) {
        if (distance) loadAsync(count, currentCoords, distance / 6378);
        else loadAsync(count, currentCoords);
      }
    }
    else if(searchedPlant)
    {
      const pos = GetFirstPositionFromPlant(searchedPlant);
      if (pos && data.list && data.list.version !== version) {
        if (distance) loadAsync(count, [pos[1], pos[0]], distance / 6378);
        else loadAsync(count, [pos[1], pos[0]]);
      }
    }
    // eslint-disable-next-line
  }, [version]);

  useEffect(() => {
    if (!searchedPlant) setData(map, data.list, currentCoords);
    else {
      const pos = GetFirstPositionFromPlant(searchedPlant);
      if (pos)
        setData(
          map,
          data.list,
          currentCoords,
          !load ? searchedPlant : undefined
        );
      else setData(map, data.list, currentCoords);
    }
    // eslint-disable-next-line
  }, [map, data.list]);

  return (
    <Modal
      confirmLoading={data.loading}
      visible={data.controlOpen}
      okText={'Hledat'}
      cancelText={'Zrušit'}
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
