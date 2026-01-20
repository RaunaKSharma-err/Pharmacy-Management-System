import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
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

const mockSales: Sale[] = [
  {
    id: '1',
    items: [
      { medicineId: '1', medicineName: 'Paracetamol 500mg', quantity: 2, unitPrice: 5.00, totalPrice: 10.00 },
      { medicineId: '6', medicineName: 'Cetirizine 10mg', quantity: 1, unitPrice: 5.50, totalPrice: 5.50 },
    ],
    totalAmount: 15.50,
    customerName: 'Walk-in Customer',
    createdAt: new Date().toISOString(),
    createdBy: 'John Pharmacist',
  },
  {
    id: '2',
    items: [
      { medicineId: '4', medicineName: 'Metformin 500mg', quantity: 3, unitPrice: 7.50, totalPrice: 22.50 },
    ],
    totalAmount: 22.50,
    customerName: 'Jane Doe',
    createdAt: new Date().toISOString(),
    createdBy: 'John Pharmacist',
  },
];

const initialState: SalesState = {
  cart: [],
  sales: mockSales,
  todaySales: 38.00,
  isLoading: false,
  error: null,
};

export const createSale = createAsyncThunk(
  'sales/create',
  async (sale: Omit<Sale, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newSale: Sale = {
        ...sale,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      return newSale;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSales = createAsyncThunk(
  'sales/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockSales;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales.unshift(action.payload);
        state.todaySales += action.payload.totalAmount;
        state.cart = [];
      })
      .addCase(createSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.sales = action.payload;
      });
  },
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart } = salesSlice.actions;
export default salesSlice.reducer;
