import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SortOption } from '../components/products/ProductsFilters';

export type ViewMode = 'grid' | 'list';

export interface CatalogFiltersState {
  // min and max price currently available; preset for mock purposes
  price: {
    min: number;
    max: number;
  };
  categories: string[]; // category slugs
  processing: string[]; // 'fresh' | 'frozen' | 'salted' | 'smoked'
  packageTypes: string[];
  origins: string[];
  certificates: string[];
  onlyNew: boolean;
  onlyPromo: boolean;
  sort: SortOption;
  viewMode: ViewMode;
}

const initialState: CatalogFiltersState = {
  price: { min: 0, max: 0 },
  categories: [],
  processing: [],
  packageTypes: [],
  origins: [],
  certificates: [],
  onlyNew: false,
  onlyPromo: false,
  sort: 'default',
  viewMode: 'grid',
};

export const catalogFiltersSlice = createSlice({
  name: 'catalogFilters',
  initialState,
  reducers: {
    setPrice(state, action: PayloadAction<{ min: number; max: number }>) {
      state.price = action.payload;
    },
    setCategories(state, action: PayloadAction<string[]>) {
      state.categories = action.payload;
    },
    setProcessing(state, action: PayloadAction<string[]>) {
      state.processing = action.payload;
    },
    setPackageTypes(state, action: PayloadAction<string[]>) {
      state.packageTypes = action.payload;
    },
    setOrigins(state, action: PayloadAction<string[]>) {
      state.origins = action.payload;
    },
    setCertificates(state, action: PayloadAction<string[]>) {
      state.certificates = action.payload;
    },
    toggleOnlyNew(state) {
      state.onlyNew = !state.onlyNew;
    },
    toggleOnlyPromo(state) {
      state.onlyPromo = !state.onlyPromo;
    },
    setSort(state, action: PayloadAction<SortOption>) {
      state.sort = action.payload;
    },
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setPrice,
  setCategories,
  setProcessing,
  setPackageTypes,
  setOrigins,
  setCertificates,
  toggleOnlyNew,
  toggleOnlyPromo,
  setSort,
  setViewMode,
  resetFilters,
} = catalogFiltersSlice.actions;

export default catalogFiltersSlice.reducer;
