import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  Pill,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { deleteMedicine, setFilters } from '@/redux/slices/medicineSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { StatusBadge, getStockStatus } from '@/components/ui/status-badge';
import { toast } from '@/hooks/use-toast';

const categories = [
  'All',
  'Pain Relief',
  'Antibiotics',
  'Gastrointestinal',
  'Diabetes',
  'Allergy',
  'Cardiovascular',
];

const MedicinesPage = () => {
  const dispatch = useAppDispatch();
  const { medicines, filters } = useAppSelector((state) => state.medicines);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const matchesSearch =
        medicine.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        medicine.batchNumber.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.category === 'all' ||
        filters.category === '' ||
        medicine.category === filters.category;

      const status = getStockStatus(medicine.quantity, medicine.expiryDate);
      const matchesStatus =
        filters.stockStatus === 'all' ||
        (filters.stockStatus === 'low' && status === 'low-stock') ||
        (filters.stockStatus === 'expired' && status === 'expired') ||
        (filters.stockStatus === 'in-stock' && status === 'in-stock');

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [medicines, filters]);

  const handleDelete = async () => {
    if (deleteId) {
      await dispatch(deleteMedicine(deleteId));
      toast({
        title: 'Medicine deleted',
        description: 'The medicine has been removed from inventory.',
      });
      setDeleteId(null);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Medicines</h1>
          <p className="text-muted-foreground mt-1">
            Manage your pharmacy inventory
          </p>
        </div>
        <Link to="/medicines/add">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Medicine
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search medicines or batch number..."
            className="pl-10"
            value={filters.search}
            onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
          />
        </div>
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) =>
            dispatch(setFilters({ category: value === 'all' ? '' : value }))
          }
        >
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat === 'All' ? 'all' : cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.stockStatus}
          onValueChange={(value: any) =>
            dispatch(setFilters({ stockStatus: value }))
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Medicine</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Batch No.</TableHead>
              <TableHead className="font-semibold">Expiry</TableHead>
              <TableHead className="font-semibold text-center">Qty</TableHead>
              <TableHead className="font-semibold text-right">Price</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((medicine, index) => {
                const status = getStockStatus(medicine.quantity, medicine.expiryDate);
                return (
                  <motion.tr
                    key={medicine.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-border/50 hover:bg-muted/30"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Pill className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {medicine.supplierName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {medicine.category}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {medicine.batchNumber}
                    </TableCell>
                    <TableCell>
                      {new Date(medicine.expiryDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {medicine.quantity}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${medicine.sellingPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/medicines/edit/${medicine.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(medicine.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <Pill className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No medicines found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this medicine? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MedicinesPage;
