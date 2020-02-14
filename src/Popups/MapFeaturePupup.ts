import { Popup, MapLayerEventType, Map } from 'mapbox-gl';
import { buildDescription } from './FeatureDescritionBuilder';

export const createPopup = (event: MapLayerEventType['click'], map: Map) => {
    if (!event.features) return;

    const props = event.features[0].properties!;

    new Popup()
      .setLngLat(event.lngLat)
      .setHTML(
        buildDescription({
          name: props.name,
          note: props.note,
          imgUrl: props.imgUrl,
          species: props.species
        })
      )
      .addTo(map);
};
