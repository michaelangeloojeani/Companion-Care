export interface Pet {
    id?: string;
    name: string;
    species: string;
    breed?: string;
    gender?: string;
    dob?: string;
    weight?: number;
    owner: string;
    photoUrl?: string;
  }