import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Mail, Phone, MapPin, Plus } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { fetchSuppliers } from "@/redux/slices/supplierSlice";
import { Button } from "@/components/ui/button";
import { SimpleCard } from "@/components/ui/metric-card";
import SupplierFormDialog from "@/components/ui/SupplierFormDialogue";
import { LoadingSpinner } from "@/components/ui/loading";

const SuppliersPage = () => {
  const dispatch = useAppDispatch();
  const { suppliers, isLoading } = useAppSelector((state) => state.suppliers);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  if (isLoading && suppliers.length === 0) {
    return (
      <div className="page-container flex items-center justify-center min-h-[400px]">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Suppliers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your medicine suppliers
          </p>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Supplier
        </Button>
      </div>

      {suppliers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No suppliers found. Add your first supplier to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier, index) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SimpleCard className="h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="font-semibold text-lg">{supplier.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {supplier.contactPerson}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{supplier.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{supplier.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SimpleCard>
            </motion.div>
          ))}
        </div>
      )}

      <SupplierFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default SuppliersPage;
