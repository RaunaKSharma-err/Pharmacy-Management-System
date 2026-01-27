import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Receipt,
  Check,
  Pill,
  Clock,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  createSale,
  fetchSales,
} from "@/redux/slices/salesSlice";
import { fetchMedicines } from "@/redux/slices/medicineSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimpleCard } from "@/components/ui/metric-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const SalesPage = () => {
  const dispatch = useAppDispatch();
  const { medicines } = useAppSelector((state) => state.medicines);
  const { cart, sales, isLoading } = useAppSelector((state) => state.sales);
  const { user } = useAppSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [showBillModal, setShowBillModal] = useState(false);
  const [billGenerated, setBillGenerated] = useState(false);

  // Fetch medicines and sales on mount
  useEffect(() => {
    dispatch(fetchMedicines());
    dispatch(fetchSales());
  }, [dispatch]);

  // Filter medicines based on search
  const filteredMedicines = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return medicines
      .filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          m.quantity > 0 &&
          new Date(m.expiryDate) > new Date(),
      )
      .slice(0, 8);
  }, [medicines, searchQuery]);

  // Calculate cart total
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cart]);

  // Get recent sales (last 10)
  const recentSales = useMemo(() => {
    return [...sales]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);
  }, [sales]);

  const handleAddToCart = (medicine: (typeof medicines)[0]) => {
    const existingItem = cart.find((item) => item.medicineId === medicine.id);
    const currentQty = existingItem?.quantity || 0;

    if (currentQty >= medicine.quantity) {
      toast({
        title: "Insufficient stock",
        description: `Only ${medicine.quantity} units available.`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        medicineId: medicine.id,
        medicineName: medicine.name,
        quantity: 1,
        unitPrice: medicine.sellingPrice,
        totalPrice: medicine.sellingPrice,
      }),
    );
    setSearchQuery("");
  };

  const handleQuantityChange = (medicineId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(medicineId));
      return;
    }

    const medicine = medicines.find((m) => m.id === medicineId);
    if (medicine && newQuantity > medicine.quantity) {
      toast({
        title: "Insufficient stock",
        description: `Only ${medicine.quantity} units available.`,
        variant: "destructive",
      });
      return;
    }

    dispatch(updateCartQuantity({ medicineId, quantity: newQuantity }));
  };

  const handleGenerateBill = () => {
    setShowBillModal(true);
  };

  const handleCompleteSale = async () => {
    await dispatch(
      createSale({
        items: cart,
        totalAmount: cartTotal,
        customerName: "Walk-in Customer",
        createdBy: user?.name || "Staff",
      }),
    );
    setBillGenerated(true);
    toast({
      title: "Sale completed!",
      description: `Bill of $${cartTotal.toFixed(2)} generated successfully.`,
    });
  };

  const handleCloseBill = () => {
    setShowBillModal(false);
    setBillGenerated(false);
    dispatch(clearCart());
  };

  console.log(sales);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales / Billing</h1>
          <p className="text-muted-foreground mt-1">
            Create new sales and generate bills
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Medicine Search */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search medicine by name..."
              className="pl-10 h-12 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Search Results */}
          {filteredMedicines.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border/50 shadow-lg overflow-hidden"
            >
              {filteredMedicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="flex items-center justify-between p-4 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{medicine.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {medicine.quantity} | $
                        {medicine.sellingPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(medicine)}
                    className="gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              ))}
            </motion.div>
          )}

          {/* Cart Table */}
          <SimpleCard title="Cart Items" className="mt-6">
            {cart.length > 0 ? (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.medicineId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.medicineName}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.unitPrice.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(
                              item.medicineId,
                              item.quantity - 1,
                            )
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-10 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(
                              item.medicineId,
                              item.quantity + 1,
                            )
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Total Price */}
                      <p className="w-20 text-right font-semibold">
                        ${item.totalPrice.toFixed(2)}
                      </p>

                      {/* Remove */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          dispatch(removeFromCart(item.medicineId))
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  Cart is empty. Search for medicines to add.
                </p>
              </div>
            )}
          </SimpleCard>
        </div>

        {/* Right Side - Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <SimpleCard title="Order Summary">
              <div className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.medicineId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.medicineName} × {item.quantity}
                      </span>
                      <span>${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {cart.length > 0 && (
                  <>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-muted-foreground">Tax (0%)</span>
                        <span>$0.00</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-lg text-primary">
                          ${cartTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full h-12 gap-2 text-base"
                      onClick={handleGenerateBill}
                      disabled={cart.length === 0}
                    >
                      <Receipt className="w-5 h-5" />
                      Generate Bill
                    </Button>
                  </>
                )}
              </div>
            </SimpleCard>
          </div>
        </div>
      </div>

      {/* Recent Sales Section */}
      <SimpleCard title="Recent Sales" className="mt-6">
        {recentSales.length > 0 ? (
          <div className="space-y-3">
            {recentSales.map((sale, index) => (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-primary" />
                    <span className="font-medium">
                      {sale.customerName || "Walk-in Customer"}
                    </span>
                  </div>
                  <span className="font-bold text-primary">
                    ${sale.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex flex-wrap gap-2">
                    {sale.items.map((item, i) => (
                      <span
                        key={i}
                        className="bg-background px-2 py-0.5 rounded text-xs"
                      >
                        {item.medicineName} × {item.quantity}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(sale.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Receipt className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No sales recorded yet.</p>
          </div>
        )}
      </SimpleCard>

      {/* Bill Modal */}
      <Dialog open={showBillModal} onOpenChange={setShowBillModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {billGenerated ? "Sale Complete!" : "Bill Preview"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {billGenerated
                ? "The sale has been recorded successfully."
                : "Review the bill before completing the sale."}
            </DialogDescription>
          </DialogHeader>

          {billGenerated ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <p className="text-2xl font-bold text-primary mb-2">
                ${cartTotal.toFixed(2)}
              </p>
              <p className="text-muted-foreground">Transaction completed</p>
              <Button className="mt-6 w-full" onClick={handleCloseBill}>
                Start New Sale
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.medicineId}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.medicineName} × {item.quantity}
                    </span>
                    <span>${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowBillModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCompleteSale}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Complete Sale"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesPage;
