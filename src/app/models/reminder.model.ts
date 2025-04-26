export interface Reminder {
    id?: string;
    petId: string;
    type: string; // medication, vet visit, etc.
    title: string;
    description?: string;
    dateTime: Date;
    isComplete: boolean;
  }