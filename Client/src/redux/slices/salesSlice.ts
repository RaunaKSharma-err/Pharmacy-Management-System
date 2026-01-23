import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { salesAPI } from '@/service/api';

export interface CartItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  _id?: string;
  items: CartItem[];
  totalAmount: number;
  customerId?: string;
  customerName?: string;
  createdAt: string;
  createdBy: string;
}

interface SalesState {
  cart: CartItem[];
  sales: Sale[];
  todaySales: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  cart: [],
  sales: [],
  todaySales: 0,
  isLoading: false,
  error: null,
};

export const createSale = createAsyncThunk(
  'sales/create',
  async (sale: Omit<Sale, 'id' | '_id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const response = await salesAPI.create(sale);
      return response.data.sale || response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create sale';
      return rejectWithValue(message);
    }
  }
);

export const fetchSales = createAsyncThunk(
  'sales/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await salesAPI.getAll();
      return response.data.sales || response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch sales';
      return rejectWithValue(message);
    }
  }
);

export const fetchDailySales = createAsyncThunk(
  'sales/fetchDaily',
  async (_, { rejectWithValue }) => {
    try {
      const response = await salesAPI.getDaily();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch daily sales';
      return rejectWithValue(message);
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.cart.find(item => item.medicineId === action.payload.medicineId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
      } else {
        state.cart.push(action.payload);
      }
    },
    updateCartQuantity: (state, action: PayloadAction<{ medicineId: string; quantity: number }>) => {
      const item = state.cart.find(item => item.medicineId === action.payload.medicineId);
      if (item) {
        item.quantity = action.payload.quantity;
        item.totalPrice = item.quantity * item.unitPrice;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.medicineId !== action.payload);
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSale.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.isLoading = false;
        const sale = { ...action.payload, id: action.payload._id || action.payload.id };
        state.sales.unshift(sale);
        state.todaySales += sale.totalAmount;
        state.cart = [];
      })
      .addCase(createSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSales.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales = action.payload.map((s) => ({ ...s, id: s._id || s.id }));
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDailySales.fulfilled, (state, action) => {
        state.todaySales = action.payload.total || action.payload.todaySales || 0;
      });
  },
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart } = salesSlice.actions;
export default salesSlice.reducer;
