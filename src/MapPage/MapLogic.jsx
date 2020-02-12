import React from 'react';
import { useUserMapMaker } from '../Hooks/UserMapMarker';

const MapLogic = ({ map }) => {
  const coords = useUserMapMaker(map, [15.4749126, 49.8037633]);

  return <div />;
};


export default MapLogic;
