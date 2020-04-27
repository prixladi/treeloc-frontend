import {
  WoodyPlantListModel,
  WoodyPlantPreviewModel,
  WoodyPlantDetailModel,
} from '../Services/Models';

import L from 'leaflet';
import 'leaflet.markercluster';
import 'Leaflet.Deflate';
import { deflate } from './deflateUtils';
import { treeIcon } from '../Common/MapConstants';
import { buildDescription } from '../Popups/FeatureDescritionBuilder';
import { GetFirstPositionFromPlant } from '../Common/Helpers';

export const Sources = {
  _Points: 'points',
  _Lines: 'lines',
  _Polygons: 'polygons',
};

const getPointFeaturesFromList = (
  list: WoodyPlantListModel | null,
  currentCoords: [number, number],
  searchedId?: string
): GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] => {
  if (!list) return [];

  const filtered = list.woodyPlants.filter(
    (plant: WoodyPlantPreviewModel) =>
      plant.location &&
      plant.location?.geometry &&
      (plant.location?.geometry.type === 'Point' ||
        plant.location?.geometry.type === 'MultiPoint') &&
      searchedId !== plant.id
  );

  return filtered.map((plant) => ({
    type: 'Feature',
    geometry: plant.location?.geometry as GeoJSON.Geometry,
    properties: {
      name: plant.localizedNames.czech,
      species: plant.localizedSpecies.czech,
      note: plant.localizedNotes.czech,
      imgUrls: plant.imageUrls,
      currentCoords: currentCoords,
      coords: GetFirstPositionFromPlant(plant),
    },
  }));
};

const getLineFeaturesFromList = (
  list: WoodyPlantListModel | null,
  currentCoords: [number, number],
  searchedId?: string
): GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] => {
  if (!list) return [];

  const filtered = list.woodyPlants.filter(
    (plant: WoodyPlantPreviewModel) =>
      plant.location &&
      plant.location?.geometry &&
      (plant.location?.geometry.type === 'LineString' ||
        plant.location?.geometry.type === 'MultiLineString') &&
      searchedId !== plant.id
  );

  return filtered.map((plant) => ({
    type: 'Feature',
    geometry: plant.location?.geometry as GeoJSON.Geometry,
    properties: {
      name: plant.localizedNames.czech,
      species: plant.localizedSpecies.czech,
      note: plant.localizedNotes.czech,
      imgUrls: plant.imageUrls,
      currentCoords: currentCoords,
      coords: GetFirstPositionFromPlant(plant),
    },
  }));
};

const getPolygonFeaturesFromList = (
  list: WoodyPlantListModel | null,
  currentCoords: [number, number],
  searchedId?: string
): GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] => {
  if (!list) return [];

  const filtered = list.woodyPlants.filter(
    (plant: WoodyPlantPreviewModel) =>
      plant.location &&
      plant.location?.geometry &&
      (plant.location?.geometry.type === 'Polygon' ||
        plant.location?.geometry.type === 'MultiPolygon') &&
      searchedId !== plant.id
  );

  return filtered.map((plant) => ({
    type: 'Feature',
    geometry: plant.location?.geometry as GeoJSON.Geometry,
    properties: {
      name: plant.localizedNames.czech,
      species: plant.localizedSpecies.czech,
      note: plant.localizedNotes.czech,
      imgUrls: plant.imageUrls,
      currentCoords: currentCoords,
      coords: GetFirstPositionFromPlant(plant),
    },
  }));
};

const getSearchedFeature = (
  searchedPlant: WoodyPlantDetailModel | undefined,
  currentCoords: [number, number]
): GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] => {
  if (
    !searchedPlant ||
    !searchedPlant.location ||
    !searchedPlant.location?.geometry
  )
    return [];

  return [
    {
      type: 'Feature',
      geometry: searchedPlant.location?.geometry as GeoJSON.Geometry,
      properties: {
        name: searchedPlant.localizedNames.czech,
        species: searchedPlant.localizedSpecies.czech,
        note: searchedPlant.localizedNotes.czech,
        imgUrls: searchedPlant.imageUrls,
        currentCoords: currentCoords,
        coords: GetFirstPositionFromPlant(searchedPlant),
      },
    },
  ];
};

const onEachFeature = (
  feature: GeoJSON.Feature<GeoJSON.Geometry, any>,
  layer: L.Layer
) => {
  if (feature.properties) {
    layer.bindPopup(
      buildDescription({
        name: feature.properties.name,
        species: feature.properties.species,
        note: feature.properties.note,
        imgUrls: feature.properties.imgUrls,
        currentCoords: feature.properties.currentCoords,
        coords: feature.properties.coords,
      })
    );
  }
};

let intervalHandle: number | null = null;

const onEachSearchedFeature = (
  feature: GeoJSON.Feature<GeoJSON.Geometry, any>,
  layer: L.Layer
) => {
  if (!feature.properties) return;

  const popup = new L.Popup({ autoClose: false });

  popup.setContent(
    buildDescription({
      name: feature.properties.name,
      species: feature.properties.species,
      note: feature.properties.note,
      imgUrls: feature.properties.imgUrls,
      currentCoords: feature.properties.currentCoords,
      coords: feature.properties.coords,
    })
  );

  layer.bindPopup(popup).openPopup();

  intervalHandle = setInterval(() => {
    if (!popup.isOpen()) {
      layer.openPopup();
    }
  }, 60);
};

const getPointLayer = (
  data: GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
) => {
  return L.geoJSON(data, {
    pointToLayer: (_, yx) => {
      const marker = new L.Marker(yx, {
        icon: treeIcon,
      });

      return marker;
    },
    onEachFeature: onEachFeature,
  });
};

const getLineLayer = (
  data: GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
) => {
  return L.geoJSON(data, {
    style: { color: '#135200' },
    onEachFeature: onEachFeature,
  });
};

const getPolygonLayer = (
  data: GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
) => {
  return L.geoJSON(data, {
    style: { color: '#135200' },
    onEachFeature: onEachFeature,
  });
};

const getSearchedLayer = (
  data: GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>,
  map: L.Map
) => {
  const layer = L.geoJSON(data, {
    pointToLayer: (_, yx) => {
      const marker = new L.Marker(yx, {
        icon: treeIcon,
      });

      return marker;
    },
    style: { color: '#135200' },
    onEachFeature: onEachSearchedFeature,
  });

  map.on('popupclose', (e) => {
    if (intervalHandle) clearInterval(intervalHandle);
  });

  return layer;
};

let pointLayer: L.Layer | null = null;
let lineLayer: L.Layer | null = null;
let polygonLayer: L.Layer | null = null;
let searchedLayer: L.Layer | null = null;
let deflated: any | null = null;

export const setData = (
  map: L.Map,
  list: WoodyPlantListModel | null,
  currentCoords: [number, number],
  searchedPlant?: WoodyPlantDetailModel
) => {
  if (!list) return;

  const pointData = {
    type: 'FeatureCollection',
    features: getPointFeaturesFromList(list, currentCoords, searchedPlant?.id),
  } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

  const lineData = {
    type: 'FeatureCollection',
    features: getLineFeaturesFromList(list, currentCoords, searchedPlant?.id),
  } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

  const polygonData = {
    type: 'FeatureCollection',
    features: getPolygonFeaturesFromList(
      list,
      currentCoords,
      searchedPlant?.id
    ),
  } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

  const searchedData = {
    type: 'FeatureCollection',
    features: getSearchedFeature(searchedPlant, currentCoords),
  } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

  if (pointLayer) pointLayer.remove();
  if (lineLayer) lineLayer.remove();
  if (polygonLayer) polygonLayer.remove();
  if (deflated) deflated.remove();

  pointLayer = getPointLayer(pointData);
  lineLayer = getLineLayer(lineData);
  polygonLayer = getPolygonLayer(polygonData);
  searchedLayer = getSearchedLayer(searchedData, map);

  deflated = deflate();

  if (pointData.features.length > 0) pointLayer.addTo(deflated);
  if (lineData.features.length > 0) lineLayer.addTo(deflated);
  if (polygonData.features.length > 0) polygonLayer.addTo(deflated);
  if (searchedPlant) searchedLayer.addTo(map);

  deflated.addTo(map);
};
