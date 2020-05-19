import React, { useState } from 'react';
import L from 'leaflet';

import { useUserMapMarker } from '../Hooks/UserMapMarker';
import { geolocated, GeolocatedProps } from 'react-geolocated';
import { useWoodyPlantsMapControl } from '../Hooks/WoodyPlantsMapControl';
import { Modal } from 'antd';
import { FindPlantsCard } from './FindPlantsCard';
import { useSignalR } from '../Hooks/UseSignalR';
import { WoodyPlantDetailModel } from '../Services/Models';
import * as Effects from './Effects';

interface Props extends GeolocatedProps {
  map: L.Map;
  searchedPlant: WoodyPlantDetailModel | null;
}

const MapLogic = ({ map, coords, searchedPlant }: Props) => {
  const [load, setLoad] = useState(!searchedPlant);
  const [currentCoords, setMarkerCoords] = useUserMapMarker(map);
  const [distance, setDistance] = useState(null as number | null);
  const [count, setCount] = useState(8000);
  const [data, setControlOpen, loadAsync] = useWoodyPlantsMapControl(
    map,
    currentCoords
  );
  const version = useSignalR();

  Effects.useSearcherWoodyPlantMapEffect(
    map,
    searchedPlant,
    distance,
    count,
    loadAsync
  );

  Effects.useCurrentCoordsEffect(
    coords,
    distance,
    count,
    setMarkerCoords,
    load,
    loadAsync
  );

  Effects.useVersionChangedEffect(
    version,
    load,
    distance,
    count,
    data,
    currentCoords,
    searchedPlant,
    loadAsync
  );

  Effects.useDataChangedEffect(map, load, data, currentCoords, searchedPlant);

  return (
    <Modal
      confirmLoading={data.loading}
      visible={data.controlOpen}
      okText={'Hledat'}
      cancelText={'Zrušit'}
      onCancel={() => setControlOpen(false)}
      onOk={async () => {
        setLoad(true);
        await loadAsync(count, currentCoords, distance);
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
