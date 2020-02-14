import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction
} from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapCenter } from '../Common/MapConstants';
import MapLogic from './MapLogic';

const styles: { width: string; height: string; position: 'absolute' } = {
  width: '100%',
  height: '100%',
  position: 'absolute'
};

const MapPage = () => {
  const [map, setMap] = useState(null as Map | null);
  const mapContainer = useRef(null as HTMLDivElement | null);

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoic2hhbXlyIiwiYSI6ImNrMXpiaGFrYzB0c3UzaHFndmFydGplaGsifQ.996oH0ZsDkH6xe7iXaDfGg';

    const initializeMap = ({
      setMap,
      mapContainer
    }: {
      setMap: Dispatch<SetStateAction<Map | null>>;
      mapContainer: any;
    }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/shamyr/ck6ifw0i104yf1imxxvdk5ntb', 
        center: MapCenter,
        zoom: 7.5
      });

      map.on('load', () => {
        setMap(map);
        map.resize();
      });
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
