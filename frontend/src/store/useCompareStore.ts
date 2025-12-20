
import { create } from 'zustand';
import { Enterprise } from '../services/enterprise.service';

interface CompareStore {
  selectedIds: number[];
  compareList: Enterprise[];
  addToCompare: (enterprise: Enterprise) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  selectedIds: [],
  compareList: [],
  addToCompare: (enterprise) => set((state) => {
    if (state.selectedIds.includes(enterprise.id)) return state;
    if (state.selectedIds.length >= 4) {
      alert('对比室容量上限为 4 家企业');
      return state;
    }
    return {
      selectedIds: [...state.selectedIds, enterprise.id],
      compareList: [...state.compareList, enterprise],
    };
  }),
  removeFromCompare: (id) => set((state) => ({
    selectedIds: state.selectedIds.filter(sid => sid !== id),
    compareList: state.compareList.filter(e => e.id !== id),
  })),
  clearCompare: () => set({ selectedIds: [], compareList: [] }),
}));
