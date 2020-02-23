import L from 'leaflet';
import 'leaflet.markercluster';
import 'Leaflet.Deflate';
import { treeIcon } from '../Common/MapConstants';

export const deflate = () => {
  return L.deflate({
    minSize: 10,
    markerCluster: true,
    markerOptions: { icon: treeIcon }
  });
};
