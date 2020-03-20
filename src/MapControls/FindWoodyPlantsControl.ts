import L from 'leaflet';

export class FindWoodyPlantsControl extends L.Control {
  map?: L.Map;
  container?: HTMLDivElement;
  anchor: HTMLAnchorElement;
  onClickCallback?: () => void;

  onclick() {
    if (this.onClickCallback) this.onClickCallback();
  }

  constructor() {
    super();
    this.anchor = document.createElement('a');
    this.anchor.className = 'leaflet-bar';
    this.anchor.onclick = e => {
      L.DomEvent.stop(e);
      this.onclick();
    };
    this.anchor.title = 'Najít dřeviny';
    this.anchor.innerHTML = '<img src="/assets/tree.png" />';
  }

  getPosition(): L.ControlPosition {
    return 'topleft';
  }
  
  onAdd(map: L.Map) {
    this.map = map;

    this.container = document.createElement('div');
    this.container.className = 'leaflet-bar';
    this.container.appendChild(this.anchor);

    return this.container;
  }

  onRemove() {
    this.container?.parentNode?.removeChild(this.container);
    this.map = undefined;
  }
}
