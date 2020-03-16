type PopupData = {
  name?: string;
  species?: string;
  imgUrls?: string[];
  note?: string;
};

const buildDescription = ({ name, species, imgUrls, note }: PopupData) => {
  return `<p>${getName(name)}<br />${getSpecies(species)}</p>${getImg(imgUrls)}${getNote(
    note
  )}`;
};

const getName = (name?: string) =>
  name && name !== "null" ? `<strong>${name}</strong>` : '<strong>Neznámá dřevina</strong>';

const getSpecies = (species?: string) =>
  species && species !== "null" ? `(<i>${species}</i>)` : '';

const getImg = (imgUrls?: string[]) =>
  imgUrls && imgUrls.length > 0 
    ? `<p><a href="${imgUrls[0]}" target="_blank" title="Otevře se v novém okně">Obrázek dřeviny</a></ p>`
    : '';

const getNote = (note?: string) => (note && note !== "null" ? `<p>${note}</p>` : '');

export { buildDescription };
