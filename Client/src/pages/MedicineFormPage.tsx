import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  addMedicine,
  updateMedicine,
  Medicine,
} from "@/redux/slices/medicineSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const categories = [
  "Pain Relief",
  "Antibiotics",
  "Gastrointestinal",
  "Diabetes",
  "Allergy",
  "Cardiovascular",
  "Vitamins",
  "Skin Care",
];

interface MedicineFormData {
  name: string;
  category: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  supplierId: string;
}

const MedicineFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { medicines, isLoading } = useAppSelector((state) => state.medicines);
  const { suppliers } = useAppSelector((state) => state.suppliers);

  const isEditing = !!id;
  const existingMedicine = isEditing
    ? medicines.find((m) => m.id === id)
    : null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MedicineFormData>({
    defaultValues: existingMedicine
      ? {
          name: existingMedicine.name,
          category: existingMedicine.category,
          batchNumber: existingMedicine.batchNumber,
          expiryDate: existingMedicine.expiryDate.split("T")[0],
          quantity: existingMedicine.quantity,
          purchasePrice: existingMedicine.purchasePrice,
          sellingPrice: existingMedicine.sellingPrice,
          supplierId: existingMedicine.supplierId,
        }
      : undefined,
  });

  const watchedCategory = watch("category");
  const watchedSupplier = watch("supplierId");

  const onSubmit = async (data: MedicineFormData) => {
    const supplier = suppliers.find((s) => s.id === data.supplierId);
    const medicineData = {
      ...data,
      supplierName: supplier?.name || "Unknown Supplier",
    };

    if (isEditing && existingMedicine) {
      await dispatch(
        updateMedicine({ id: existingMedicine.id, data: medicineData }),
      );
      toast({
        title: "Medicine updated",
        description: "The medicine has been updated successfully.",
      });
    } else {
      await dispatch(addMedicine(medicineData));
      toast({
        title: "Medicine added",
        description: "The new medicine has been added to inventory.",
      });
    }
    navigate("/medicines");
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Medicines
        </Button>

        <div className="mb-8">
          <h1 className="page-title">
            {isEditing ? "Edit Medicine" : "Add New Medicine"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing
              ? "Update the medicine details below"
              : "Fill in the details to add a new medicine"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card rounded-xl border border-border/50 shadow-soft p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Paracetamol 500mg"
                  {...register("name", { required: "Name is required" })}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={watchedCategory}
                  onValueChange={(value) => setValue("category", value)}
                >
                  <SelectTrigger
                    className={
                      !watchedCategory && errors.category
                        ? "border-destructive"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("category", {
                    required: "Category is required",
                  })}
                />
                {errors.category && (
                  <p className="text-destructive text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number *</Label>
                <Input
                  id="batchNumber"
                  placeholder="e.g., PCM-2024-001"
                  {...register("batchNumber", {
                    required: "Batch number is required",
                  })}
                  className={errors.batchNumber ? "border-destructive" : ""}
                />
                {errors.batchNumber && (
                  <p className="text-destructive text-sm">
                    {errors.batchNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...register("expiryDate", {
                    required: "Expiry date is required",
                  })}
                  className={errors.expiryDate ? "border-destructive" : ""}
                />
                {errors.expiryDate && (
                  <p className="text-destructive text-sm">
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register("quantity", {
                    required: "Quantity is required",
                    min: { value: 0, message: "Quantity cannot be negative" },
                    valueAsNumber: true,
                  })}
                  className={errors.quantity ? "border-destructive" : ""}
                />
                {errors.quantity && (
                  <p className="text-destructive text-sm">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price ($) *</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...register("purchasePrice", {
                    required: "Purchase price is required",
                    min: { value: 0, message: "Price cannot be negative" },
                    valueAsNumber: true,
                  })}
                  className={errors.purchasePrice ? "border-destructive" : ""}
                />
                {errors.purchasePrice && (
                  <p className="text-destructive text-sm">
                    {errors.purchasePrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Selling Price ($) *</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...register("sellingPrice", {
                    required: "Selling price is required",
                    min: { value: 0, message: "Price cannot be negative" },
                    valueAsNumber: true,
                  })}
                  className={errors.sellingPrice ? "border-destructive" : ""}
                />
                {errors.sellingPrice && (
                  <p className="text-destructive text-sm">
                    {errors.sellingPrice.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierId">Supplier *</Label>
              <Select
                value={watchedSupplier}
                onValueChange={(value) => setValue("supplierId", value)}
              >
                <SelectTrigger
                  className={
                    !watchedSupplier && errors.supplierId
                      ? "border-destructive"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("supplierId", {
                  required: "Supplier is required",
                })}
              />
              {errors.supplierId && (
                <p className="text-destructive text-sm">
                  {errors.supplierId.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? "Update Medicine" : "Add Medicine"}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MedicineFormPage;
