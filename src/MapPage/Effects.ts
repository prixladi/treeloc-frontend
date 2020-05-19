import { useEffect, Dispatch, SetStateAction, MutableRefObject } from 'react';
import { getWoodyPlantByIdAsync } from '../Services/WoodyPlantsService';
import { WoodyPlantDetailModel } from '../Services/Models';
import L from 'leaflet';
import { MapCenter } from '../Common/MapConstants';
import { getFirstPositionFromPlant } from '../Common/Helpers';
import { WoodyPlantsData } from '../Hooks/WoodyPlantsMapControl';
import { setData } from './utils';

const useSearcherWoodyPlantEffect = (
  plantId: string | null,
  setPlantId: Dispatch<SetStateAction<string | null>>,
  setPlant: Dispatch<SetStateAction<WoodyPlantDetailModel | null>>
) => {
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
};

const useMapContainerEffect = (
  map: L.Map | null,
  mapContainer: MutableRefObject<HTMLDivElement | null>,
  plantId: string | null,
  setMap: Dispatch<SetStateAction<L.Map | null>>
) => {
  const tyleOptions = {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, tilesets under <a href=" https://creativecommons.org/licenses/by/3.0/CC BY 3.0">CC BY 3.0</a> | Icons are from <a href="https://icons8.com">icons8.com</a>',
  };

  const typeTemplate = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  useEffect(() => {
    if (map || !mapContainer.current) return;

    const newMap = new L.Map(mapContainer.current, {
      zoomControl: false,
      tap: false,
    });

    newMap.setView(MapCenter, plantId ? 12 : 8);
    L.tileLayer(typeTemplate, tyleOptions).addTo(newMap);
    setMap(newMap);
    // eslint-disable-next-line
  }, [map, plantId, mapContainer]);
};

const useSearcherWoodyPlantMapEffect = (
  map: L.Map,
  searchedPlant: WoodyPlantDetailModel | null,
  distance: number | null,
  count: number,
  loadAsync: (
    take: number,
    coods: [number, number],
    distance?: number | null
  ) => Promise<void>
) => {
  useEffect(() => {
    if (!searchedPlant) return;

    const pos = getFirstPositionFromPlant(searchedPlant);
    if (pos) {
      map.panTo([pos[1], pos[0]]);
      loadAsync(count, [pos[1], pos[0]], distance);
    }
    // eslint-disable-next-line
  }, [searchedPlant, map]);
};
const useCurrentCoordsEffect = (
  coords: Coordinates | undefined,
  distance: number | null,
  count: number,
  setMarkerCoords: (newCoords: [number, number]) => void,
  load: boolean,
  loadAsync: (
    take: number,
    coods: [number, number],
    distance?: number | null
  ) => Promise<void>
) => {
  useEffect(() => {
    if (!coords) return;

    const currentCoords: [number, number] = [coords.latitude, coords.longitude];
    setMarkerCoords(currentCoords);

    if (load) loadAsync(count, currentCoords, distance);
    // eslint-disable-next-line
  }, [coords]);
};

const useVersionChangedEffect = (
  version: string | null,
  load: boolean,
  distance: number | null,
  count: number,
  data: WoodyPlantsData,
  currentCoords: [number, number],
  searchedPlant: WoodyPlantDetailModel | null,
  loadAsync: (
    take: number,
    coods: [number, number],
    distance?: number | null
  ) => Promise<void>
) => {
  useEffect(() => {
    if (load) {
      if (data.list && data.list.version !== version) {
        loadAsync(count, currentCoords, distance);
      }
    } else if (searchedPlant) {
      const pos = getFirstPositionFromPlant(searchedPlant);
      if (pos && data.list && data.list.version !== version) {
        loadAsync(count, [pos[1], pos[0]], distance);
      }
    }
    // eslint-disable-next-line
  }, [version]);
};

const useDataChangedEffect = (
  map: L.Map,
  load: boolean,
  data: WoodyPlantsData,
  currentCoords: [number, number],
  searchedPlant: WoodyPlantDetailModel | null
) => {
  useEffect(() => {
    if (!searchedPlant) setData(map, data.list, currentCoords);
    else {
      const pos = getFirstPositionFromPlant(searchedPlant);
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
};

export {
  useSearcherWoodyPlantEffect,
  useMapContainerEffect,
  useSearcherWoodyPlantMapEffect,
  useCurrentCoordsEffect,
  useVersionChangedEffect,
  useDataChangedEffect,
};
