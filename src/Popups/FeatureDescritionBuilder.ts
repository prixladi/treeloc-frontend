type PopupData = {
  name?: string;
  species?: string;
  imgUrls?: string[];
  note?: string;
  coords?: [number, number];
  currentCoords: [number, number];
};

const buildDescription = ({
  name,
  species,
  imgUrls,
  note,
  coords,
  currentCoords
}: PopupData) => {
  return `<p>${getName(name)}<br />${getSpecies(species)}</p>${getImg(
    imgUrls
  )}${getNote(note)}${getDistance(currentCoords, coords)}`;
};

const getName = (name?: string) =>
  name && name !== 'null'
    ? `<strong>${name}</strong>`
    : '<strong>Neznámá dřevina</strong>';

const getSpecies = (species?: string) =>
  species && species !== 'null' ? `(<i>${species}</i>)` : '';

const getImg = (imgUrls?: string[]) =>
  imgUrls && imgUrls.length > 0
    ? `<p><a href="${imgUrls[0]}" target="_blank" title="Otevře se v novém okně">Obrázek dřeviny</a></ p>`
    : '';

const getNote = (note?: string) =>
  note && note !== 'null' ? `<p>${note}</p>` : '';

const getDistance = (
  currentCoords: [number, number],
  coords?: [number, number]
) =>
  coords
    ? `<p><strong>Vzdálenost:</strong> ${calcCrow(
        currentCoords[0],
        currentCoords[1],
        coords[1],
        coords[0]
      )} km</p>`
    : '';

const calcCrow = (
  ilat1: number,
  ilon1: number,
  ilat2: number,
  ilon2: number
) => {
  var R = 6378;
  var dLat = toRad(ilat2 - ilat1);
  var dLon = toRad(ilon2 - ilon1);
  var lat1 = toRad(ilat1);
  var lat2 = toRad(ilat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d.toFixed(1);
};

const toRad = (value: number) => {
  return (value * Math.PI) / 180;
};

export { buildDescription };
