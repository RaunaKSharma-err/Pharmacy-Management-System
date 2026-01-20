import { motion } from 'framer-motion';
import {
  Pill,
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign,
  Package,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useAppSelector } from '@/redux/hooks';
import { MetricCard, SimpleCard } from '@/components/ui/metric-card';
import { StatusBadge, getStockStatus } from '@/components/ui/status-badge';

// Mock sales data for charts
const dailySalesData = [
  { day: 'Mon', sales: 420 },
  { day: 'Tue', sales: 580 },
  { day: 'Wed', sales: 350 },
  { day: 'Thu', sales: 720 },
  { day: 'Fri', sales: 890 },
  { day: 'Sat', sales: 1100 },
  { day: 'Sun', sales: 680 },
];

const monthlySalesData = [
  { month: 'Jan', sales: 12400 },
  { month: 'Feb', sales: 15800 },
  { month: 'Mar', sales: 14200 },
  { month: 'Apr', sales: 18600 },
  { month: 'May', sales: 21300 },
  { month: 'Jun', sales: 19800 },
];

const DashboardPage = () => {
  const { medicines } = useAppSelector((state) => state.medicines);
  const { todaySales } = useAppSelector((state) => state.sales);

  // Calculate stats
  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter((m) => m.quantity <= 20 && m.quantity > 0).length;
  const expiredCount = medicines.filter((m) => new Date(m.expiryDate) < new Date()).length;

  // Get low stock medicines
  const lowStockMedicines = medicines
    .filter((m) => m.quantity <= 20)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  // Get expiring soon medicines (within 30 days)
  const expiringSoon = medicines
    .filter((m) => {
      const expiry = new Date(m.expiryDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expiry <= thirtyDaysFromNow && expiry >= new Date();
    })
    .slice(0, 5);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening in your pharmacy.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard
          title="Total Medicines"
          value={totalMedicines}
          icon={Pill}
          variant="primary"
          change={{ value: 12, type: 'increase' }}
        />
        <MetricCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={AlertTriangle}
          variant="warning"
        />
        <MetricCard
          title="Expired Items"
          value={expiredCount}
          icon={Calendar}
          variant="destructive"
        />
        <MetricCard
          title="Today's Sales"
          value={`$${todaySales.toFixed(2)}`}
          icon={DollarSign}
          variant="success"
          change={{ value: 8, type: 'increase' }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <SimpleCard title="Weekly Sales" className="col-span-1">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySalesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`$${value}`, 'Sales']}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SimpleCard>

        {/* Monthly Sales Chart */}
        <SimpleCard title="Monthly Overview" className="col-span-1">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Sales']}
                />
                <Bar
                  dataKey="sales"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SimpleCard>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Table */}
        <SimpleCard
          title="Low Stock Alert"
          action={
            <span className="text-sm text-warning font-medium flex items-center gap-1">
              <Package className="w-4 h-4" />
              {lowStockCount} items
            </span>
          }
        >
          {lowStockMedicines.length > 0 ? (
            <div className="space-y-3">
              {lowStockMedicines.map((medicine, index) => (
                <motion.div
                  key={medicine.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{medicine.name}</p>
                    <p className="text-xs text-muted-foreground">{medicine.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-warning">
                      {medicine.quantity} left
                    </span>
                    <StatusBadge
                      status={getStockStatus(medicine.quantity, medicine.expiryDate)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No low stock items
            </p>
          )}
        </SimpleCard>

        {/* Expiring Soon Table */}
        <SimpleCard
          title="Expiring Soon"
          action={
            <span className="text-sm text-destructive font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Within 30 days
            </span>
          }
        >
          {expiringSoon.length > 0 ? (
            <div className="space-y-3">
              {expiringSoon.map((medicine, index) => (
                <motion.div
                  key={medicine.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{medicine.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Batch: {medicine.batchNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-destructive">
                      {new Date(medicine.expiryDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Expiry date</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No medicines expiring soon
            </p>
          )}
        </SimpleCard>
      </div>
    </div>
  );
};

export default DashboardPage;
