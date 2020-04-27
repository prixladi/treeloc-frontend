import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';

import { MapCenter } from '../Common/MapConstants';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { GeolocatedLogic } from './MapLogic';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { getWoodyPlantByIdAsync } from '../Services/WoodyPlantsService';
import { WoodyPlantDetailModel } from '../Services/Models';
import { isObjectId } from '../Common/Helpers';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [13, 47],
});;

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

const initializeMap = (
  setMap: Dispatch<SetStateAction<L.Map | null>>,
  mapContainer: any,
  plantId: string | null
) => {
  const map = new L.Map(mapContainer.current, {
    zoomControl: false,
    tap: false,
  });

  map.setView(MapCenter, plantId ? 12 : 8);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, tilesets under <a href=" https://creativecommons.org/licenses/by/3.0/CC BY 3.0">CC BY 3.0</a> | Icons are from <a href="https://icons8.com">icons8.com</a>',
  }).addTo(map);

  setMap(map);
};

const MapPage = ({ location }: RouteComponentProps) => {
  const [plantId, setPlantId] = useState(getSearchedPlantId(location.search));
  const [plant, setPlant] = useState(null as WoodyPlantDetailModel | null);
  const [map, setMap] = useState(null as L.Map | null);
  const mapContainer = useRef(null as HTMLDivElement | null);

  useEffect(() => {
    const getSearchedWoodyPlant = async () => {
      if (plantId) {
        const plant = await getWoodyPlantByIdAsync(plantId);
        if (plant) setPlant(plant);
        else setPlantId(null);
      }
    };

    getSearchedWoodyPlant();
    // eslint-disable-next-line
  }, [plantId]);

  useEffect(() => {
    if (!map) initializeMap(setMap, mapContainer, plantId);
  }, [map, plantId]);

  if (!map || (plantId && !plant))
    return <div ref={(el) => (mapContainer.current = el)} style={styles} />;

  if (plant)
    return (
      <>
        <div ref={(el) => (mapContainer.current = el)} style={styles} />
        <GeolocatedLogic searchedPlant={plant} map={map} />
      </>
    );

  return (
    <>
      <div ref={(el) => (mapContainer.current = el)} style={styles} />
      <GeolocatedLogic map={map} />
    </>
  );
};

export default withRouter(MapPage);
