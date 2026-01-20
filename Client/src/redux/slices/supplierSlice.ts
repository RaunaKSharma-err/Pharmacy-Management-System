import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  createdAt: string;
}

interface SupplierState {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  isLoading: boolean;
  error: string | null;
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'PharmaCo Ltd',
    email: 'orders@pharmaco.com',
    phone: '+1 234-567-8901',
    address: '123 Pharma Street, Medical District, NY 10001',
    contactPerson: 'Robert Johnson',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'MediSupply Inc',
    email: 'contact@medisupply.com',
    phone: '+1 234-567-8902',
    address: '456 Health Ave, Healthcare Hub, CA 90001',
    contactPerson: 'Sarah Williams',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'HealthFirst Pharma',
    email: 'info@healthfirst.com',
    phone: '+1 234-567-8903',
    address: '789 Wellness Blvd, Medical Park, TX 75001',
    contactPerson: 'Michael Brown',
    createdAt: '2024-02-01',
  },
];

const initialState: SupplierState = {
  suppliers: mockSuppliers,
  selectedSupplier: null,
  isLoading: false,
  error: null,
};

export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockSuppliers;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSupplier = createAsyncThunk(
  'suppliers/add',
  async (supplier: Omit<Supplier, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newSupplier: Supplier = {
        ...supplier,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      return newSupplier;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'suppliers/update',
  async (supplier: Supplier, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return supplier;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  'suppliers/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    setSelectedSupplier: (state, action: PayloadAction<Supplier | null>) => {
      state.selectedSupplier = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addSupplier.fulfilled, (state, action) => {
        state.suppliers.push(action.payload);
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
      });
  },
});

export const { setSelectedSupplier } = supplierSlice.actions;
export default supplierSlice.reducer;
