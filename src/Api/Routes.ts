export const _BaseApiUrl = "http://localhost:4545/api/v1";

export const _WoodyPlantsList = `${_BaseApiUrl}/woodyPlants`;

export const _WoodyPlantDetail = (id: string) =>
  `${_BaseApiUrl}/woodyPlants/${id}`;
