import { WoodyPlantPreviewModel } from '../Services/Models';

export type TableData = {
  id: string;
  name: string;
  species: string;
  note: string;
};

export const TransformTableData = (
  woodyPlants: WoodyPlantPreviewModel[] | undefined
): TableData[] | undefined => {
  return woodyPlants?.map(woodyPlant => ({
    id: woodyPlant.id,
    name: woodyPlant.localizedNames.czech ?? 'Nevyplněno',
    species: woodyPlant.localizedSpecies.czech ?? 'Nevyplněno',
    note: woodyPlant.localizedNotes.czech ?? 'Nevyplněno'
}));
};
