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

export type SortBy = 'LocalizedNames' | 'LocalizedNotes' | 'LocalizedSpecies' | 'TextMatchScore';

export type WoodyPlantSortModel = {
  sortBy?: SortBy,
  ascending: boolean
};

export type LocalizedStringModel = {
  czech?: string;
};

export type Location = {
  name?: string
  geometry?: Omit<GeoJSON.Geometry, 'GeometryCollection' > 
}

export type WoodyPlantPreviewModel = {
    id: string
    localizedNames: LocalizedStringModel
    localizedNotes: LocalizedStringModel
    localizedSpecies: LocalizedStringModel
    imageUrls: string[]
    location?: Location
};

export interface WoodyPlantDetailModel extends WoodyPlantPreviewModel {
    imageUrl: string
}

export type WoodyPlantListModel = {
  woodyPlants: WoodyPlantPreviewModel[];
  totalCount: number;
};
