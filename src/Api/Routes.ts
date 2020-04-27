declare const conf: { apiUrl: string };

export const _BaseApiUrl = conf.apiUrl.replace(/([^:])(\/\/+)/g, '$1/');

export const _WoodyPlantsList = `${_BaseApiUrl}/woodyPlants`;

export const _WoodyPlantDetail = (id: string) =>
  `${_BaseApiUrl}/woodyPlants/${id}`;
