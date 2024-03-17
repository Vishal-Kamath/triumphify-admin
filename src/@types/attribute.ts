export interface Attribute {
  id: string;
  name: string;
  values: {
    id: string;
    name: string;
  }[];
  created_at: Date;
  updated_at: Date | null;
}

export interface AttributesWithState {
  id: string;
  name: string;
  checked: boolean;
  values: {
    id: string;
    name: string;
    checked: boolean;
  }[];
}