export type PointModel = {
  latitude: number;
  longitude: number;
};

export type WoodyPlantFilterModel = {
  skip: number;
  take: number;
  text?: string;
  point?: PointModel;
  distance?: number;
};

export type WoodyPlantSortModel = {
  sortBy?: 'LocalizedNames' | 'LocalizedNotes' | 'LocalizedSpecies' | 'TextMatchScore',
  ascending: boolean
};

export type LocalizedStringModel = {
  czech?: string;
};

export type WoodyPlantPreviewModel = {
    id: string
    localizedNames: LocalizedStringModel
    localizedNotes: LocalizedStringModel
    localizedSpecies: LocalizedStringModel
};

export interface WoodyPlantDetailModel extends WoodyPlantPreviewModel {
    imageUrl: string
}

export type WoodyPlantListModel = {
  woodyPlants: WoodyPlantPreviewModel[];
  totalCount: number;
};
