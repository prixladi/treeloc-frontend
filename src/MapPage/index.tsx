import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction
} from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';

import { MapCenter } from '../Common/MapConstants';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import MapLogic from './MapLogic';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [13, 47]
});

L.Marker.prototype.options.icon = DefaultIcon;

const styles: { width: string; height: string; position: 'absolute' } = {
  width: '100%',
  height: '95%',
  position: 'absolute'
};

const MapPage = () => {
  const [map, setMap] = useState(null as L.Map | null);
  const mapContainer = useRef(null as HTMLDivElement | null);

  useEffect(() => {
    const initializeMap = ({
      setMap,
      mapContainer
    }: {
      setMap: Dispatch<SetStateAction<L.Map | null>>;
      mapContainer: any;
    }) => {
      const map = new L.Map(mapContainer.current, {
        zoomControl: false,
        tap: false
      });

      map.setView(MapCenter, 9);

      // 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      setMap(map);
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  if (!map)
    return <div ref={el => (mapContainer.current = el)} style={styles} />;

  return (
    <>
      <div ref={el => (mapContainer.current = el)} style={styles} />
      <MapLogic map={map} />
    </>
  );
};

export default MapPage;
