import React, { useEffect, useState } from 'react';
import { useUserMapMarker } from '../Hooks/UserMapMarker';
import { geolocated, GeolocatedProps } from 'react-geolocated';
import L from 'leaflet';
import { useWoodyPlantsMapControl } from '../Hooks/WoodyPlantsMapControl';
import { setData } from './utils';
import { Modal } from 'antd';
import { FindPlantsCard } from './FindPlantsCard';

interface Props extends GeolocatedProps {
  map: L.Map;
}

const MapLogic = ({ map, coords }: Props) => {
  const [currentCoords, setMarkerCoords] = useUserMapMarker(map);
  const [distance, setDistance] = useState(null as number | null);
  const [count, setCount] = useState(100);
  const [data, setControlOpen, loadAsync] = useWoodyPlantsMapControl(
    map,
    currentCoords
  );

  useEffect(() => {
    if (!coords) return;

    const currentCoords: [number, number] = [coords.latitude, coords.longitude];
    setMarkerCoords(currentCoords);

    if (distance) loadAsync(count, currentCoords, distance / 6378);
    else loadAsync(count, currentCoords);
    // eslint-disable-next-line
  }, [coords]);

  useEffect(() => {
    setData(map, data.list);
  }, [map, data.list]);

  useEffect(() => {
    setData(map, data.list);
  }, [map, data.list]);

  return (
    <Modal
      confirmLoading={data.loading}
      visible={data.controlOpen}
      onCancel={() => setControlOpen(false)}
      onOk={async () => {
        if (distance) loadAsync(count, currentCoords, distance / 6378);
        else loadAsync(count, currentCoords);
        
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

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true
  }
})(MapLogic);
