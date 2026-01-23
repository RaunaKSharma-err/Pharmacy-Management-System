import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { suppliersAPI } from '@/service/api';

export interface Supplier {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  createdAt?: string;
}

interface SupplierState {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SupplierState = {
  suppliers: [],
  selectedSupplier: null,
  isLoading: false,
  error: null,
};

export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await suppliersAPI.getAll();
      return response.data.suppliers || response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch suppliers';
      return rejectWithValue(message);
    }
  }
);

export const addSupplier = createAsyncThunk(
  'suppliers/add',
  async (supplier: Omit<Supplier, 'id' | '_id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const response = await suppliersAPI.create(supplier);
      return response.data.supplier || response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add supplier';
      return rejectWithValue(message);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'suppliers/update',
  async ({ id, data }: { id: string; data: Partial<Supplier> }, { rejectWithValue }) => {
    try {
      const response = await suppliersAPI.update(id, data);
      return response.data.supplier || response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update supplier';
      return rejectWithValue(message);
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  'suppliers/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await suppliersAPI.delete(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete supplier';
      return rejectWithValue(message);
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
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suppliers = action.payload.map((s) => ({ ...s, id: s._id || s.id }));
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addSupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        const supplier = { ...action.payload, id: action.payload._id || action.payload.id };
        state.suppliers.push(supplier);
      })
      .addCase(addSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = { ...action.payload, id: action.payload._id || action.payload.id };
        const index = state.suppliers.findIndex(s => s.id === updated.id || s._id === updated._id);
        if (index !== -1) {
          state.suppliers[index] = updated;
        }
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteSupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suppliers = state.suppliers.filter(s => s.id !== action.payload && s._id !== action.payload);
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedSupplier } = supplierSlice.actions;
export default supplierSlice.reducer;
