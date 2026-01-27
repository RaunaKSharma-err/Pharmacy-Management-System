import { BarChart3, TrendingUp, AlertTriangle, Calendar } from "lucide-react";
import { SimpleCard, MetricCard } from "@/components/ui/metric-card";
import { useAppSelector } from "@/redux/hooks";

const ReportsPage = () => {
  const { medicines } = useAppSelector((state) => state.medicines);
  const lowStock = medicines.filter((m) => m.quantity <= 20);
  const expired = medicines.filter((m) => new Date(m.expiryDate) < new Date());
  const { todaySales } = useAppSelector((state) => state.sales);
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="text-muted-foreground mt-1">
            View inventory and sales reports
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Sales (Monthly)"
          value={todaySales}
          icon={TrendingUp}
          variant="success"
        />
        <MetricCard
          title="Low Stock Items"
          value={lowStock.length}
          icon={AlertTriangle}
          variant="warning"
        />
        <MetricCard
          title="Expired Items"
          value={expired.length}
          icon={Calendar}
          variant="destructive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleCard title="Low Stock Report">
          <div className="space-y-2">
            {lowStock.length > 0 ? (
              lowStock.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <span className="font-medium">{m.name}</span>
                  <span className="text-warning font-semibold">
                    {m.quantity} units
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No low stock items
              </p>
            )}
          </div>
        </SimpleCard>
        <SimpleCard title="Expired Medicines Report">
          <div className="space-y-2">
            {expired.length > 0 ? (
              expired.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <span className="font-medium">{m.name}</span>
                  <span className="text-destructive font-semibold">
                    {new Date(m.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No expired items
              </p>
            )}
          </div>
        </SimpleCard>
      </div>
    </div>
  );
};

export default ReportsPage;
