import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapLogic from './MapLogic';

const styles = {
  width: '100vw',
  height: 'calc(100vh - 80px)',
  position: 'absolute'
};

const MapPage = () => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoic2hhbXlyIiwiYSI6ImNrMXpiaGFrYzB0c3UzaHFndmFydGplaGsifQ.996oH0ZsDkH6xe7iXaDfGg';
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/shamyr/ck6ifw0i104yf1imxxvdk5ntb', // stylesheet location
        center: [15.4749126, 49.8037633],
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
