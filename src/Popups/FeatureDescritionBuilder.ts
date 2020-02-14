type PopupData = {
  name?: string;
  species?: string;
  imgUrl?: string;
  note?: string;
};

const buildDescription = ({ name, species, imgUrl, note }: PopupData) => {
  return `<p>${getName(name)}<br />${getSpecies(species)}</p>${getImg(imgUrl)}${getNote(
    note
  )}`;
};

const getName = (name?: string) =>
  name && name !== "null" ? `<strong>${name}</strong>` : '<strong>Neznámá dřevina</strong>';

const getSpecies = (species?: string) =>
  species && species !== "null" ? `(<i>${species}</i>)` : '';

const getImg = (imgUrl?: string) =>
  imgUrl && imgUrl !== "null"
    ? `<p><a href="${imgUrl}" target="_blank" title="Otevře se v novém okně">Obrázek dřeviny</a></ p>`
    : '';

const getNote = (note?: string) => (note && note !== "null" ? `<p>${note}</p>` : '');

export { buildDescription };
