import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Medicine {
  id: string;
  name: string;
  category: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  supplierId: string;
  supplierName: string;
  createdAt: string;
  updatedAt: string;
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

// Mock data
const mockMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    batchNumber: 'PCM-2024-001',
    expiryDate: '2025-12-15',
    quantity: 150,
    purchasePrice: 2.50,
    sellingPrice: 5.00,
    supplierId: '1',
    supplierName: 'PharmaCo Ltd',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotics',
    batchNumber: 'AMX-2024-015',
    expiryDate: '2025-06-20',
    quantity: 45,
    purchasePrice: 8.00,
    sellingPrice: 15.00,
    supplierId: '2',
    supplierName: 'MediSupply Inc',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
  },
  {
    id: '3',
    name: 'Omeprazole 20mg',
    category: 'Gastrointestinal',
    batchNumber: 'OMP-2024-008',
    expiryDate: '2024-03-01',
    quantity: 8,
    purchasePrice: 5.00,
    sellingPrice: 12.00,
    supplierId: '1',
    supplierName: 'PharmaCo Ltd',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '4',
    name: 'Metformin 500mg',
    category: 'Diabetes',
    batchNumber: 'MET-2024-022',
    expiryDate: '2025-09-30',
    quantity: 200,
    purchasePrice: 3.00,
    sellingPrice: 7.50,
    supplierId: '3',
    supplierName: 'HealthFirst Pharma',
    createdAt: '2024-02-25',
    updatedAt: '2024-02-25',
  },
  {
    id: '5',
    name: 'Ibuprofen 400mg',
    category: 'Pain Relief',
    batchNumber: 'IBU-2024-003',
    expiryDate: '2025-08-15',
    quantity: 12,
    purchasePrice: 4.00,
    sellingPrice: 9.00,
    supplierId: '2',
    supplierName: 'MediSupply Inc',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
  {
    id: '6',
    name: 'Cetirizine 10mg',
    category: 'Allergy',
    batchNumber: 'CET-2024-011',
    expiryDate: '2025-11-20',
    quantity: 80,
    purchasePrice: 2.00,
    sellingPrice: 5.50,
    supplierId: '1',
    supplierName: 'PharmaCo Ltd',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
  },
  {
    id: '7',
    name: 'Lisinopril 10mg',
    category: 'Cardiovascular',
    batchNumber: 'LIS-2024-007',
    expiryDate: '2025-07-10',
    quantity: 5,
    purchasePrice: 6.00,
    sellingPrice: 14.00,
    supplierId: '3',
    supplierName: 'HealthFirst Pharma',
    createdAt: '2024-01-28',
    updatedAt: '2024-01-28',
  },
  {
    id: '8',
    name: 'Aspirin 100mg',
    category: 'Cardiovascular',
    batchNumber: 'ASP-2024-019',
    expiryDate: '2024-02-28',
    quantity: 25,
    purchasePrice: 1.50,
    sellingPrice: 4.00,
    supplierId: '2',
    supplierName: 'MediSupply Inc',
    createdAt: '2024-02-05',
    updatedAt: '2024-02-05',
  },
];

const initialState: MedicineState = {
  medicines: mockMedicines,
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
  'medicines/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockMedicines;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMedicine = createAsyncThunk(
  'medicines/add',
  async (medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newMedicine: Medicine = {
        ...medicine,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newMedicine;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMedicine = createAsyncThunk(
  'medicines/update',
  async (medicine: Medicine, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...medicine, updatedAt: new Date().toISOString() };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMedicine = createAsyncThunk(
  'medicines/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicines = action.payload;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addMedicine.fulfilled, (state, action) => {
        state.medicines.push(action.payload);
      })
      .addCase(updateMedicine.fulfilled, (state, action) => {
        const index = state.medicines.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.medicines[index] = action.payload;
        }
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.medicines = state.medicines.filter(m => m.id !== action.payload);
      });
  },
});

export const { setFilters, setSelectedMedicine, clearError } = medicineSlice.actions;
export default medicineSlice.reducer;
