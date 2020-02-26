declare const conf: { apiUrl: string };

export const _BaseApiUrl = conf.apiUrl;

export const _WoodyPlantsList = `${_BaseApiUrl}/woodyPlants`;

export const _WoodyPlantDetail = (id: string) =>
  `${_BaseApiUrl}/woodyPlants/${id}`;
