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

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [13, 47],
});

L.Marker.prototype.options.icon = DefaultIcon;

const styles: { width: string; height: string; position: 'absolute' } = {
  width: '100%',
  height: '95%',
  position: 'absolute',
};

const getSearchedPlantId = (search: string) => {
  if (!search) return null;

  const params = new URLSearchParams(search);
  var id = params.get('searchedPlantId');

  if(id && isObjectId(id))
    return id;
};

const MapPage = ({ location }: RouteComponentProps) => {
  const [searchedPlantId] = useState(getSearchedPlantId(location.search));
  const [plant, setPlant] = useState(null as WoodyPlantDetailModel | null);
  const [map, setMap] = useState(null as L.Map | null);
  const mapContainer = useRef(null as HTMLDivElement | null);

  console.log(searchedPlantId);

  const getSearchedWoodyPlant = async () => {
    if (searchedPlantId)
      setPlant(await getWoodyPlantByIdAsync(searchedPlantId));
  };

  useEffect(() => {
    getSearchedWoodyPlant();
    // eslint-disable-next-line
  }, [searchedPlantId]);

  useEffect(() => {
    const initializeMap = ({
      setMap,
      mapContainer,
    }: {
      setMap: Dispatch<SetStateAction<L.Map | null>>;
      mapContainer: any;
    }) => {
      const map = new L.Map(mapContainer.current, {
        zoomControl: false,
        tap: false,
      });

      map.setView(MapCenter, 8);

      // 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | Icons from <a href="https://icons8.com">icons8.com</a>',
      }).addTo(map);

      setMap(map);
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  if (!map || (searchedPlantId && !plant))
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
