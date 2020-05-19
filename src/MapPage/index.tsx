import React, { useState, useRef } from 'react';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { GeolocatedLogic } from './MapLogic';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { WoodyPlantDetailModel } from '../Services/Models';
import { isObjectId } from '../Common/Helpers';
import { useTitle } from '../Hooks/UseTitle';
import * as Effects from './Effects';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [13, 47],
});

const styles: { width: string; height: string; position: 'absolute' } = {
  width: '100%',
  height: '95%',
  position: 'absolute',
};

const getSearchedPlantId = (search: string) => {
  if (!search) return null;

  const params = new URLSearchParams(search);
  var id = params.get('searchedPlantId');

  if (id && isObjectId(id)) return id;

  return null;
};

const MapPage = ({ location }: RouteComponentProps) => {
  const [plantId, setPlantId] = useState(getSearchedPlantId(location.search));
  const [plant, setPlant] = useState(null as WoodyPlantDetailModel | null);
  const [map, setMap] = useState(null as L.Map | null);
  const mapContainer = useRef(null as HTMLDivElement | null);
  useTitle('TreeLoc | Mapa dřevin');

  Effects.useSearcherWoodyPlantEffect(plantId, setPlantId, setPlant);
  Effects.useMapContainerEffect(map, mapContainer, plantId, setMap);

  if (!map || (plantId && !plant)) return <div ref={(el) => (mapContainer.current = el)} style={styles} />;

  return (
    <>
      <div ref={(el) => (mapContainer.current = el)} style={styles} />
      <GeolocatedLogic searchedPlant={plant} map={map} />
    </>
  );
};

export default withRouter(MapPage);
