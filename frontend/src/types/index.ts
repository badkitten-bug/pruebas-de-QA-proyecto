export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'volunteer' | 'staff' | 'veterinarian' | 'donor' | 'adopter';
};

export type Animal = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  healthStatus: 'healthy' | 'sick' | 'recovering' | 'critical';
  intakeDate: Date;
  medicalHistory: MedicalRecord[];
  adoptionStatus: 'available' | 'pending' | 'adopted';
  imageUrl?: string; // Add image URL field
};

export type MedicalRecord = {
  id: string;
  date: Date;
  description: string;
  treatment: string;
  veterinarian: string;
};

export type AdoptionRequest = {
  id: string;
  animalId: string;
  adopterId: string;
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: Date;
  lastUpdated: Date;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: 'food' | 'medicine' | 'supplies';
  quantity: number;
  unit: string;
  minimumRequired: number;
};

export type Donation = {
  id: string;
  donorId: string;
  type: 'monetary' | 'material';
  amount?: number;
  items?: Array<{
    name: string;
    quantity: number;
  }>;
  date: Date;
};