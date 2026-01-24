import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { medicinesAPI } from '@/service/api';

export interface Medicine {
  id: string;
  _id?: string;
  name: string;
  category: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  supplierId: string;
  supplierName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MedicineState {
  medicines: Medicine[];
  selectedMedicine: Medicine | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    category: string;
    stockStatus: 'all' | 'low' | 'expired' | 'in-stock';
  };
}

const initialState: MedicineState = {
  medicines: [],
  selectedMedicine: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: 'all',
    stockStatus: 'all',
  },
};

export const fetchMedicines = createAsyncThunk(
  'medicines/',
  async (_, { rejectWithValue }) => {
    try {
      const response = await medicinesAPI.getAll();
      console.log(response.data);
      return response.data.medicines || response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch medicines';
      return rejectWithValue(message);
    }
  }
);

export const fetchMedicineById = createAsyncThunk(
  'medicines/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await medicinesAPI.getById(id);
      return response.data.medicine || response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch medicine';
      return rejectWithValue(message);
    }
  }
);

export const addMedicine = createAsyncThunk(
  'medicines/add',
  async (medicine: Omit<Medicine, 'id' | '_id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await medicinesAPI.create(medicine);
      return response.data.medicine || response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add medicine';
      return rejectWithValue(message);
    }
  }
);

export const updateMedicine = createAsyncThunk(
  'medicines/update',
  async ({ id, data }: { id: string; data: Partial<Medicine> }, { rejectWithValue }) => {
    try {
      const response = await medicinesAPI.update(id, data);
      return response.data.medicine || response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update medicine';
      return rejectWithValue(message);
    }
  }
);

export const deleteMedicine = createAsyncThunk(
  'medicines/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await medicinesAPI.delete(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete medicine';
      return rejectWithValue(message);
    }
  }
);

const medicineSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<MedicineState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedMedicine: (state, action: PayloadAction<Medicine | null>) => {
      state.selectedMedicine = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicines = action.payload.map((m) => ({ ...m, id: m._id || m.id }));
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMedicineById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMedicineById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedMedicine = { ...action.payload, id: action.payload._id || action.payload.id };
      })
      .addCase(fetchMedicineById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addMedicine.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addMedicine.fulfilled, (state, action) => {
        state.isLoading = false;
        const medicine = { ...action.payload, id: action.payload._id || action.payload.id };
        state.medicines.push(medicine);
      })
      .addCase(addMedicine.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMedicine.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMedicine.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = { ...action.payload, id: action.payload._id || action.payload.id };
        const index = state.medicines.findIndex(m => m.id === updated.id || m._id === updated._id);
        if (index !== -1) {
          state.medicines[index] = updated;
        }
      })
      .addCase(updateMedicine.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteMedicine.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicines = state.medicines.filter(m => m.id !== action.payload && m._id !== action.payload);
      })
      .addCase(deleteMedicine.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, setSelectedMedicine, clearError } = medicineSlice.actions;
export default medicineSlice.reducer;
