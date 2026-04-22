export interface HousingLocationInfo {
  id: number;
  name: string;
  city: string;
  state: string;
  photo: string;
  availableUnits: number;
  wifi: boolean;
  laundry: boolean;
  deleted: boolean;
}
export interface HousingLocationViewModel extends HousingLocationInfo {
  selected: boolean;
}
