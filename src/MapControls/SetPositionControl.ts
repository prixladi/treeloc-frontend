import { IControl, Map } from 'mapbox-gl';

export class SetPositionControl implements IControl {
  map?: Map;
  container?: HTMLDivElement;
  button: HTMLButtonElement;
  onClickCallback?: () => void;

  onclick() {
    if (this.onClickCallback) this.onClickCallback();
  }

  constructor() {
    this.button = document.createElement('button');
    this.button.className = 'mapboxgl-ctrl-icon mapbox-gl-draw_point';
    this.button.type = 'button';
    this.button.onclick = _ => this.onclick();
    this.button.title = 'Nastavit pozici';
  }

  onAdd(map: Map) {
    this.map = map;

    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl';
    this.container.appendChild(this.button);

    return this.container;
  }
  onRemove() {
    this.container?.parentNode?.removeChild(this.container);
    this.map = undefined;
  }
}
