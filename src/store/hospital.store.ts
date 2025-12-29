import { Hospital } from '@/types/hospital.type';
import { create } from 'zustand';

interface HospitalStore {
  currentHospital: Hospital | null;
  hospitals: Hospital[];
  setCurrentHospital: (hospital: Hospital) => void;
  setHospitals: (hospitals: Hospital[]) => void;
  addHospital: (hospital: Hospital) => void;
  updateHospital: (id: string, updates: Partial<Hospital>) => void;
  removeHospital: (id: string) => void;
}

export const useHospitalStore = create<HospitalStore>((set) => ({
  currentHospital: null,
  hospitals: [],
  
  setCurrentHospital: (hospital) => set({ currentHospital: hospital }),
  
  setHospitals: (hospitals) => set({ hospitals }),
  
  addHospital: (hospital) => 
    set((state) => ({ hospitals: [...state.hospitals, hospital] })),
  
  updateHospital: (id, updates) =>
    set((state) => ({
      hospitals: state.hospitals.map((hospital) =>
        hospital.id === id ? { ...hospital, ...updates } : hospital
      ),
    })),
  
  removeHospital: (id) =>
    set((state) => ({
      hospitals: state.hospitals.filter((hospital) => hospital.id !== id),
    })),
}));